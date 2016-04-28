'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.AuthStreamable = exports.Streamable = exports.STATUS_CODE = undefined;

var _get2 = function get(object, property, receiver) { if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _constants = require('./constants');

Object.defineProperty(exports, 'STATUS_CODE', {
  enumerable: true,
  get: function get() {
    return _constants.STATUS_CODE;
  }
});

var _fs = require('fs');

var _fs2 = _interopRequireDefault(_fs);

var _requestPromise = require('request-promise');

var _requestPromise2 = _interopRequireDefault(_requestPromise);

var _urlJoin = require('url-join');

var _urlJoin2 = _interopRequireDefault(_urlJoin);

var _bluebird = require('bluebird');

var _bluebird2 = _interopRequireDefault(_bluebird);

var _bluebirdRetry = require('bluebird-retry');

var _bluebirdRetry2 = _interopRequireDefault(_bluebirdRetry);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var API_BASE_URL = 'https://api.streamable.com';

var Streamable = exports.Streamable = function () {
  function Streamable() {
    _classCallCheck(this, Streamable);
  }

  _createClass(Streamable, [{
    key: 'uploadStream',


    /**
     * Upload a video stream to Streamable
     * @param {string} stream the stream of the file
     * @param {string} [title=''] title of the video
     * @return {Promise} A promise to return the response
     */
    value: function uploadStream(stream) {
      var title = arguments.length <= 1 || arguments[1] === undefined ? '' : arguments[1];

      var data = { file: stream, title: title };
      return this._post('/upload', data);
    }

    /**
     * Upload a video to Streamable
     * @param {string} filePath the path to the file
     * @param {string} [title=''] title of the video
     * @return {Promise} A promise to return the response
     */

  }, {
    key: 'uploadVideo',
    value: function uploadVideo(filePath) {
      var title = arguments.length <= 1 || arguments[1] === undefined ? '' : arguments[1];

      var stream = _fs2.default.createReadStream(filePath);
      return this.uploadStream(stream, title);
    }

    /**
     * Import a video to Streamable
     * @param {string} url the URL to the video
     * @param {string} [title] title of the video
     * @return {Promise} A promise to return the response
     */

  }, {
    key: 'importVideo',
    value: function importVideo(url) {
      var title = arguments.length <= 1 || arguments[1] === undefined ? '' : arguments[1];

      var qs = { url: url, title: title };
      return this._get('/import', qs);
    }

    /**
     * Retrieve a video from Streamable
     * @param {string} shortcode the shortcode of the video
     * @return {Promise} A promise to return the response
     */

  }, {
    key: 'retrieveVideo',
    value: function retrieveVideo(shortcode) {
      return this._get('/videos/' + shortcode);
    }

    /**
     * Retrieve a user on Streamable
     * @param {string} username the name of the user
     * @return {Promise} A promise to return the response
     */

  }, {
    key: 'retrieveUser',
    value: function retrieveUser(username) {
      return this._get('/users/' + username);
    }

    /**
     * Wait for a specific status of a video
     * @param {string} shortcode the shortcode of the video
     * @param {number} status status to wait for
     * @param {object} config configuration for bluebird-retry
     * @return {Promise} A promise to return the response
     */

  }, {
    key: 'waitFor',
    value: function waitFor(shortcode, status) {
      var _this = this;

      var config = arguments.length <= 2 || arguments[2] === undefined ? {} : arguments[2];

      var go = function go() {
        return _this.retrieveVideo(shortcode).then(function (resp) {
          if (resp.status === status) {
            return _bluebird2.default.resolve(resp);
          }
          return _bluebird2.default.reject('not done yet');
        });
      };

      return (0, _bluebirdRetry2.default)(go, config);
    }

    /**
     * Make an HTTP request to Streamable
     * @param {string} method the HTTP method to use
     * @param {string} path the path
     * @param {object} [options={}] additional options
     * @return {Promise} A promise to return the response
     */

  }, {
    key: '_request',
    value: function _request(method, path) {
      var options = arguments.length <= 2 || arguments[2] === undefined ? {} : arguments[2];

      var url = (0, _urlJoin2.default)(API_BASE_URL, path);
      options = this._prepareOptions(method, path, options);
      return (0, _requestPromise2.default)(url, options);
    }

    /**
     * Make an HTTP GET request to Streamable
     * @param {string} path the path
     * @param {object} [qs={}] the querystring
     * @return {Promise} A promise to return the response
     */

  }, {
    key: '_get',
    value: function _get(path) {
      var qs = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];

      return this._request('GET', path, { qs: qs });
    }

    /**
     * Make an HTTP POST request as "multipart/form" to Streamable
     * @param {string} path the path
     * @param {object} [data={}] the data
     * @return {Promise} A promise to return the response
     */

  }, {
    key: '_post',
    value: function _post(path) {
      var data = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];

      return this._request('POST', path, { formData: data });
    }

    /**
     * Prepare an object with request options
     * @param {string} method the HTTP method to use
     * @param {string} path the path to request
     * @param {object} [options={}] additional request options
     * @return {object} Request options object
     */

  }, {
    key: '_prepareOptions',
    value: function _prepareOptions(method, path) {
      var options = arguments.length <= 2 || arguments[2] === undefined ? {} : arguments[2];

      var forced = {
        method: method,
        json: true
      };
      return Object.assign({}, options, forced);
    }
  }]);

  return Streamable;
}();

var AuthStreamable = exports.AuthStreamable = function (_Streamable) {
  _inherits(AuthStreamable, _Streamable);

  /**
   * @constructor
   * @param {string} username The username to log in with
   * @param {string} password The password to log in with
   */

  function AuthStreamable(username, password) {
    _classCallCheck(this, AuthStreamable);

    var _this2 = _possibleConstructorReturn(this, Object.getPrototypeOf(AuthStreamable).call(this));

    _this2.username = username;
    _this2.password = password;
    return _this2;
  }

  /**
   * Retrieve information about the currently logged-in user
   * @return {Promise} A promise to return the response
   */


  _createClass(AuthStreamable, [{
    key: 'retrieveMe',
    value: function retrieveMe() {
      return this._get('/me');
    }

    /**
     * Prepare an object with request options, including authentication
     * @param {string} method The HTTP method
     * @param {string} path The HTTP path
     * @return {object} Request options object
     */

  }, {
    key: '_prepareOptions',
    value: function _prepareOptions(method, path) {
      var options = arguments.length <= 2 || arguments[2] === undefined ? {} : arguments[2];

      options = _get2(Object.getPrototypeOf(AuthStreamable.prototype), '_prepareOptions', this).call(this, method, path, options);
      var auth = {
        username: this.username,
        password: this.password
      };
      return Object.assign({}, options, { auth: auth });
    }
  }]);

  return AuthStreamable;
}(Streamable);
