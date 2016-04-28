import fs from 'fs'
import request from 'request-promise'
import urljoin from 'url-join'
import Promise from 'bluebird'
import retry from 'bluebird-retry'

const API_BASE_URL = 'https://api.streamable.com'

export class Streamable {

  /**
   * Upload a video stream to Streamable
   * @param {string} stream the stream of the file
   * @param {string} [title=''] title of the video
   * @return {Promise} A promise to return the response
   */
  uploadStream (stream, title = '') {
    const data = { file: stream, title: title }
    return this._post('/upload', data)
  }

  /**
   * Upload a video to Streamable
   * @param {string} filePath the path to the file
   * @param {string} [title=''] title of the video
   * @return {Promise} A promise to return the response
   */
  uploadVideo (filePath, title = '') {
    const stream = fs.createReadStream(filePath)
    return this.uploadStream(stream, title)
  }

  /**
   * Import a video to Streamable
   * @param {string} url the URL to the video
   * @param {string} [title] title of the video
   * @return {Promise} A promise to return the response
   */
  importVideo (url, title = '') {
    const qs = { url: url, title: title }
    return this._get('/import', qs)
  }

  /**
   * Retrieve a video from Streamable
   * @param {string} shortcode the shortcode of the video
   * @return {Promise} A promise to return the response
   */
  retrieveVideo (shortcode) {
    return this._get(`/videos/${shortcode}`)
  }

  /**
   * Retrieve a user on Streamable
   * @param {string} username the name of the user
   * @return {Promise} A promise to return the response
   */
  retrieveUser (username) {
    return this._get(`/users/${username}`)
  }

  /**
   * Wait for a specific status of a video
   * @param {string} shortcode the shortcode of the video
   * @param {number} status status to wait for
   * @param {object} config configuration for bluebird-retry
   * @return {Promise} A promise to return the response
   */
  waitFor (shortcode, status, config = {}) {
    let go = () => {
      return this.retrieveVideo(shortcode).then((resp) => {
        if (resp.status === status) {
          return Promise.resolve(resp)
        }
        return Promise.reject('not done yet')
      })
    }

    return retry(go, config)
  }

  /**
   * Make an HTTP request to Streamable
   * @param {string} method the HTTP method to use
   * @param {string} path the path
   * @param {object} [options={}] additional options
   * @return {Promise} A promise to return the response
   */
  _request (method, path, options = {}) {
    const url = urljoin(API_BASE_URL, path)
    options = this._prepareOptions(method, path, options)
    return request(url, options)
  }

  /**
   * Make an HTTP GET request to Streamable
   * @param {string} path the path
   * @param {object} [qs={}] the querystring
   * @return {Promise} A promise to return the response
   */
  _get (path, qs = {}) {
    return this._request('GET', path, { qs: qs })
  }

  /**
   * Make an HTTP POST request as "multipart/form" to Streamable
   * @param {string} path the path
   * @param {object} [data={}] the data
   * @return {Promise} A promise to return the response
   */
  _post (path, data = {}) {
    return this._request('POST', path, { formData: data })
  }

  /**
   * Prepare an object with request options
   * @param {string} method the HTTP method to use
   * @param {string} path the path to request
   * @param {object} [options={}] additional request options
   * @return {object} Request options object
   */
  _prepareOptions (method, path, options = {}) {
    let forced = {
      method: method,
      json: true
    }
    return Object.assign({}, options, forced)
  }
}

export class AuthStreamable extends Streamable {

  /**
   * @constructor
   * @param {string} username The username to log in with
   * @param {string} password The password to log in with
   */
  constructor (username, password) {
    super()
    this.username = username
    this.password = password
  }

  /**
   * Retrieve information about the currently logged-in user
   * @return {Promise} A promise to return the response
   */
  retrieveMe () {
    return this._get('/me')
  }

  /**
   * Prepare an object with request options, including authentication
   * @param {string} method The HTTP method
   * @param {string} path The HTTP path
   * @return {object} Request options object
   */
  _prepareOptions (method, path, options = {}) {
    options = super._prepareOptions(method, path, options)
    let auth = {
      username: this.username,
      password: this.password
    }
    return Object.assign({}, options, { auth: auth })
  }
}
