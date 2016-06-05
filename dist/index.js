'use strict';

function _interopDefault (ex) { return (ex && (typeof ex === 'object') && 'default' in ex) ? ex['default'] : ex; }

var fs = _interopDefault(require('fs'));
var request = _interopDefault(require('request-promise'));
var urljoin = _interopDefault(require('url-join'));
var Promise = _interopDefault(require('bluebird'));
var retry = _interopDefault(require('bluebird-retry'));

var babelHelpers = {};

babelHelpers.classCallCheck = function (instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError("Cannot call a class as a function");
  }
};

babelHelpers.createClass = function () {
  function defineProperties(target, props) {
    for (var i = 0; i < props.length; i++) {
      var descriptor = props[i];
      descriptor.enumerable = descriptor.enumerable || false;
      descriptor.configurable = true;
      if ("value" in descriptor) descriptor.writable = true;
      Object.defineProperty(target, descriptor.key, descriptor);
    }
  }

  return function (Constructor, protoProps, staticProps) {
    if (protoProps) defineProperties(Constructor.prototype, protoProps);
    if (staticProps) defineProperties(Constructor, staticProps);
    return Constructor;
  };
}();

babelHelpers.get = function get(object, property, receiver) {
  if (object === null) object = Function.prototype;
  var desc = Object.getOwnPropertyDescriptor(object, property);

  if (desc === undefined) {
    var parent = Object.getPrototypeOf(object);

    if (parent === null) {
      return undefined;
    } else {
      return get(parent, property, receiver);
    }
  } else if ("value" in desc) {
    return desc.value;
  } else {
    var getter = desc.get;

    if (getter === undefined) {
      return undefined;
    }

    return getter.call(receiver);
  }
};

babelHelpers.inherits = function (subClass, superClass) {
  if (typeof superClass !== "function" && superClass !== null) {
    throw new TypeError("Super expression must either be null or a function, not " + typeof superClass);
  }

  subClass.prototype = Object.create(superClass && superClass.prototype, {
    constructor: {
      value: subClass,
      enumerable: false,
      writable: true,
      configurable: true
    }
  });
  if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass;
};

babelHelpers.possibleConstructorReturn = function (self, call) {
  if (!self) {
    throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
  }

  return call && (typeof call === "object" || typeof call === "function") ? call : self;
};

babelHelpers;

var STATUS_CODE$1 = {
  UPLOADING: 0,
  PROCESSING: 1,
  READY: 2, // at least one file ready
  ERROR: 3
};

var API_BASE_URL = 'https://api.streamable.com';

var Streamable = function () {
  function Streamable() {
    babelHelpers.classCallCheck(this, Streamable);
  }

  babelHelpers.createClass(Streamable, [{
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

      var stream = fs.createReadStream(filePath);
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
     * @param {number} [status=STATUS_CODE.READY] status to wait for
     * @param {object} [config={}] configuration for bluebird-retry
     * @return {Promise} A promise which resolves on the given status
     */

  }, {
    key: 'waitFor',
    value: function waitFor(shortcode) {
      var _this = this;

      var status = arguments.length <= 1 || arguments[1] === undefined ? STATUS_CODE.READY : arguments[1];
      var config = arguments.length <= 2 || arguments[2] === undefined ? {} : arguments[2];

      var go = function go() {
        return _this.retrieveVideo(shortcode).then(function (resp) {
          return resp.status === status ? Promise.resolve(resp) : Promise.reject(resp);
        });
      };

      return retry(go, config);
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

      var url = urljoin(API_BASE_URL, path);
      options = this._prepareOptions(method, path, options);
      return request(url, options);
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

var AuthStreamable = function (_Streamable) {
  babelHelpers.inherits(AuthStreamable, _Streamable);


  /**
   * @constructor
   * @param {string} username The username to log in with
   * @param {string} password The password to log in with
   */

  function AuthStreamable(username, password) {
    babelHelpers.classCallCheck(this, AuthStreamable);

    var _this2 = babelHelpers.possibleConstructorReturn(this, Object.getPrototypeOf(AuthStreamable).call(this));

    _this2.username = username;
    _this2.password = password;
    return _this2;
  }

  /**
   * Retrieve information about the currently logged-in user
   * @return {Promise} A promise to return the response
   */


  babelHelpers.createClass(AuthStreamable, [{
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

      options = babelHelpers.get(Object.getPrototypeOf(AuthStreamable.prototype), '_prepareOptions', this).call(this, method, path, options);
      var auth = {
        username: this.username,
        password: this.password
      };
      return Object.assign({}, options, { auth: auth });
    }
  }]);
  return AuthStreamable;
}(Streamable);

exports.Streamable = Streamable;
exports.AuthStreamable = AuthStreamable;
exports.STATUS_CODE = STATUS_CODE$1;
//# sourceMappingURL=index.js.map