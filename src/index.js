import fs from 'fs';
import request from 'request-promise';
import urljoin from 'url-join';

const API_BASE_URL = 'https://api.streamable.com';

export class Streamable {
  constructor() {}

  /**
   * Upload a video stream to Streamable
   * @param {string} stream the stream of the file
   * @param {string} [title=''] title of the video
   * @return {Promise} A promise to return the response
   */
  uploadStream(stream, title = '') {
    let data = {
      file: stream,
      title
    };
    return this._post('/upload', data);
  }

  /**
   * Upload a video to Streamable
   * @param {string} filePath the path to the file
   * @param {string} [title=''] title of the video
   * @return {Promise} A promise to return the response
   */
  uploadVideo(filePath, title = '') {
    let stream = fs.createReadStream(filePath);
    return this.uploadStream(stream, title);
  }

  /**
   * Import a video to Streamable
   * @param {string} url the URL to the video
   * @param {string} [title] title of the video
   * @return {Promise} A promise to return the response
   */
  importVideo(url, title = '') {
    let qs = {url, title};
    return this._get('/import', qs);
  }

  /**
   * Retrieve a video from Streamable
   * @param {string} shortcode the shortcode of the video
   * @return {Promise} A promise to return the response
   */
  retrieveVideo(shortcode) {
    return this._get(`/videos/${shortcode}`);
  }

  /**
   * Retrieve a user on Streamable
   * @param {string} username the name of the user
   * @return {Promise} A promise to return the response
   */
  retrieveUser(username) {
    return this._get(`/users/${username}`);
  }

  /**
   * Make an HTTP request to Streamable
   * @param {string} method the HTTP method to use
   * @param {string} path the path
   * @param {object} [options={}] additional options
   * @return {Promise} A promise to return the response
   */
  _request(method, path, options = {}) {
    let url = urljoin(API_BASE_URL, path);
    options = this._prepare_options(method, path, options);
    return request(url, options);
  }

  /**
   * Make an HTTP GET request to Streamable
   * @param {string} path the path
   * @param {object} [qs={}] the querystring
   * @return {Promise} A promise to return the response
   */
  _get(path, qs = {}) {
    return this._request('GET', path, {qs});
  }

  /**
   * Make an HTTP POST request as "multipart/form" to Streamable
   * @param {string} path the path
   * @param {object} [data={}] the data
   * @return {Promise} A promise to return the response
   */
  _post(path, data = {}) {
    return this._request('POST', path, {
      formData: data
    });
  }

  /**
   * Prepare an object with request options
   * @param {string} method the HTTP method to use
   * @param {string} path the path to request
   * @param {object} [options={}] additional request options
   * @return {object} Request options object
   */
  _prepare_options(method, path, options = {}) {
    return Object.assign({}, options, {
      method,
      json: true
    });
  }
}

export class AuthStreamable extends Streamable {

  /**
   * @constructor
   * @param {string} username The username to log in with
   * @param {string} password The password to log in with
   */
  constructor(username, password) {
    super();
    this.username = username;
    this.password = password;
  }

  /**
   * Retrieve information about the currently logged-in user
   * @return {Promise} A promise to return the response
   */
  retrieveMe() {
    return this._get('/me');
  }

  /**
   * Prepare an object with request options, including authentication
   * @param {string} method The HTTP method
   * @param {string} path The HTTP path
   * @return {object} Request options object
   */
  _prepare_options(method, path, options = {}) {
    options = super._prepare_options(method, path, options);
    return Object.assign({}, options, {
      auth: {
        username: this.username,
        password: this.password
      }
    });
  }
}
