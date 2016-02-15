'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});
exports.AuthStreamable = exports.Streamable = undefined;

var _get2 = function get(object, property, receiver) { if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _fs = require('fs');

var _fs2 = _interopRequireDefault(_fs);

var _requestPromise = require('request-promise');

var _requestPromise2 = _interopRequireDefault(_requestPromise);

var _urlJoin = require('url-join');

var _urlJoin2 = _interopRequireDefault(_urlJoin);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var API_BASE_URL = 'https://api.streamable.com';

var Streamable = exports.Streamable = function () {
	function Streamable() {
		_classCallCheck(this, Streamable);
	}

	/**
  * Upload a video to Streamable
  * @param {string} filePath the path to the file
  * @param {string} [title] title of the video
  * @returns A promise to return the response
  */


	_createClass(Streamable, [{
		key: 'uploadVideo',
		value: function uploadVideo(filePath, title) {
			var data = {
				file: _fs2.default.createReadStream(filePath)
			};
			if (title) {
				data.title = title;
			}
			return this._post('/upload', data);
		}

		/**
   * Import a video to Streamable
   * @param {string} url the URL to the video
   * @param {string} [title] title of the video
   * @returns A promise to return the response
   */

	}, {
		key: 'importVideo',
		value: function importVideo(url) {
			var title = arguments.length <= 1 || arguments[1] === undefined ? '' : arguments[1];

			var qs = { url: url };
			if (title) {
				qs.title = title;
			}
			return this._get('/import', qs);
		}

		/**
   * Retrieve a video from Streamable
   * @param {string} shortcode the shortcode of the video
   * @returns A promise to return the response
   */

	}, {
		key: 'retrieveVideo',
		value: function retrieveVideo(shortcode) {
			return this._get('/videos/' + shortcode);
		}

		/**
   * Retrieve a user on Streamable
   * @param {string} username the name of the user
   * @returns A promise to return the response
   */

	}, {
		key: 'retrieveUser',
		value: function retrieveUser(username) {
			return this._get('/users/' + username);
		}

		/**
   * Make an HTTP request to Streamable
   * @param {string} method the HTTP method to use
   * @param {string} path the path
   * @param {object} [options={}] additional options
   * @returns A promise to return the response
   */

	}, {
		key: '_request',
		value: function _request(method, path) {
			var options = arguments.length <= 2 || arguments[2] === undefined ? {} : arguments[2];

			var url = (0, _urlJoin2.default)(API_BASE_URL, path);
			options = this._prepare_options(method, path, options);
			return (0, _requestPromise2.default)(url, options);
		}

		/**
   * Make an HTTP GET request to Streamable
   * @param {string} path the path
   * @param {object} [qs={}] the querystring
   * @returns A promise to return the response
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
   * @returns A promise to return the response
   */

	}, {
		key: '_post',
		value: function _post(path) {
			var data = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];

			return this._request('POST', path, {
				formData: data
			});
		}

		/**
   * Prepare an object with request options
   * @param {string} method the HTTP method to use
   * @param {string} path the path to request
   * @param {object} [options={}] additional request options
   * @returns A promise to return the response
   */

	}, {
		key: '_prepare_options',
		value: function _prepare_options(method, path) {
			var options = arguments.length <= 2 || arguments[2] === undefined ? {} : arguments[2];

			return Object.assign({}, options, {
				method: method,
				json: true
			});
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

		var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(AuthStreamable).call(this));

		_this.username = username;
		_this.password = password;
		return _this;
	}

	/**
  * Retrieve information about the currently logged-in user
  * @returns A promise to return the response
  */


	_createClass(AuthStreamable, [{
		key: 'retrieveMe',
		value: function retrieveMe() {
			return this._get('/me');
		}

		/**
   * Prepare an object with request options, including authentication
   * @returns A promise to return the response
   */

	}, {
		key: '_prepare_options',
		value: function _prepare_options(method, path) {
			var options = arguments.length <= 2 || arguments[2] === undefined ? {} : arguments[2];

			options = _get2(Object.getPrototypeOf(AuthStreamable.prototype), '_prepare_options', this).call(this, method, path, options);
			return Object.assign({}, options, {
				auth: {
					username: this.username,
					password: this.password
				}
			});
		}
	}]);

	return AuthStreamable;
}(Streamable);