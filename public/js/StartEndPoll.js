(self["webpackChunk"] = self["webpackChunk"] || []).push([["/js/StartEndPoll"],{

/***/ "./node_modules/axios/index.js":
/*!*************************************!*\
  !*** ./node_modules/axios/index.js ***!
  \*************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

module.exports = __webpack_require__(/*! ./lib/axios */ "./node_modules/axios/lib/axios.js");

/***/ }),

/***/ "./node_modules/axios/lib/adapters/xhr.js":
/*!************************************************!*\
  !*** ./node_modules/axios/lib/adapters/xhr.js ***!
  \************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";


var utils = __webpack_require__(/*! ./../utils */ "./node_modules/axios/lib/utils.js");
var settle = __webpack_require__(/*! ./../core/settle */ "./node_modules/axios/lib/core/settle.js");
var cookies = __webpack_require__(/*! ./../helpers/cookies */ "./node_modules/axios/lib/helpers/cookies.js");
var buildURL = __webpack_require__(/*! ./../helpers/buildURL */ "./node_modules/axios/lib/helpers/buildURL.js");
var buildFullPath = __webpack_require__(/*! ../core/buildFullPath */ "./node_modules/axios/lib/core/buildFullPath.js");
var parseHeaders = __webpack_require__(/*! ./../helpers/parseHeaders */ "./node_modules/axios/lib/helpers/parseHeaders.js");
var isURLSameOrigin = __webpack_require__(/*! ./../helpers/isURLSameOrigin */ "./node_modules/axios/lib/helpers/isURLSameOrigin.js");
var createError = __webpack_require__(/*! ../core/createError */ "./node_modules/axios/lib/core/createError.js");

module.exports = function xhrAdapter(config) {
  return new Promise(function dispatchXhrRequest(resolve, reject) {
    var requestData = config.data;
    var requestHeaders = config.headers;
    var responseType = config.responseType;

    if (utils.isFormData(requestData)) {
      delete requestHeaders['Content-Type']; // Let the browser set it
    }

    var request = new XMLHttpRequest();

    // HTTP basic authentication
    if (config.auth) {
      var username = config.auth.username || '';
      var password = config.auth.password ? unescape(encodeURIComponent(config.auth.password)) : '';
      requestHeaders.Authorization = 'Basic ' + btoa(username + ':' + password);
    }

    var fullPath = buildFullPath(config.baseURL, config.url);
    request.open(config.method.toUpperCase(), buildURL(fullPath, config.params, config.paramsSerializer), true);

    // Set the request timeout in MS
    request.timeout = config.timeout;

    function onloadend() {
      if (!request) {
        return;
      }
      // Prepare the response
      var responseHeaders = 'getAllResponseHeaders' in request ? parseHeaders(request.getAllResponseHeaders()) : null;
      var responseData = !responseType || responseType === 'text' ||  responseType === 'json' ?
        request.responseText : request.response;
      var response = {
        data: responseData,
        status: request.status,
        statusText: request.statusText,
        headers: responseHeaders,
        config: config,
        request: request
      };

      settle(resolve, reject, response);

      // Clean up request
      request = null;
    }

    if ('onloadend' in request) {
      // Use onloadend if available
      request.onloadend = onloadend;
    } else {
      // Listen for ready state to emulate onloadend
      request.onreadystatechange = function handleLoad() {
        if (!request || request.readyState !== 4) {
          return;
        }

        // The request errored out and we didn't get a response, this will be
        // handled by onerror instead
        // With one exception: request that using file: protocol, most browsers
        // will return status as 0 even though it's a successful request
        if (request.status === 0 && !(request.responseURL && request.responseURL.indexOf('file:') === 0)) {
          return;
        }
        // readystate handler is calling before onerror or ontimeout handlers,
        // so we should call onloadend on the next 'tick'
        setTimeout(onloadend);
      };
    }

    // Handle browser request cancellation (as opposed to a manual cancellation)
    request.onabort = function handleAbort() {
      if (!request) {
        return;
      }

      reject(createError('Request aborted', config, 'ECONNABORTED', request));

      // Clean up request
      request = null;
    };

    // Handle low level network errors
    request.onerror = function handleError() {
      // Real errors are hidden from us by the browser
      // onerror should only fire if it's a network error
      reject(createError('Network Error', config, null, request));

      // Clean up request
      request = null;
    };

    // Handle timeout
    request.ontimeout = function handleTimeout() {
      var timeoutErrorMessage = 'timeout of ' + config.timeout + 'ms exceeded';
      if (config.timeoutErrorMessage) {
        timeoutErrorMessage = config.timeoutErrorMessage;
      }
      reject(createError(
        timeoutErrorMessage,
        config,
        config.transitional && config.transitional.clarifyTimeoutError ? 'ETIMEDOUT' : 'ECONNABORTED',
        request));

      // Clean up request
      request = null;
    };

    // Add xsrf header
    // This is only done if running in a standard browser environment.
    // Specifically not if we're in a web worker, or react-native.
    if (utils.isStandardBrowserEnv()) {
      // Add xsrf header
      var xsrfValue = (config.withCredentials || isURLSameOrigin(fullPath)) && config.xsrfCookieName ?
        cookies.read(config.xsrfCookieName) :
        undefined;

      if (xsrfValue) {
        requestHeaders[config.xsrfHeaderName] = xsrfValue;
      }
    }

    // Add headers to the request
    if ('setRequestHeader' in request) {
      utils.forEach(requestHeaders, function setRequestHeader(val, key) {
        if (typeof requestData === 'undefined' && key.toLowerCase() === 'content-type') {
          // Remove Content-Type if data is undefined
          delete requestHeaders[key];
        } else {
          // Otherwise add header to the request
          request.setRequestHeader(key, val);
        }
      });
    }

    // Add withCredentials to request if needed
    if (!utils.isUndefined(config.withCredentials)) {
      request.withCredentials = !!config.withCredentials;
    }

    // Add responseType to request if needed
    if (responseType && responseType !== 'json') {
      request.responseType = config.responseType;
    }

    // Handle progress if needed
    if (typeof config.onDownloadProgress === 'function') {
      request.addEventListener('progress', config.onDownloadProgress);
    }

    // Not all browsers support upload events
    if (typeof config.onUploadProgress === 'function' && request.upload) {
      request.upload.addEventListener('progress', config.onUploadProgress);
    }

    if (config.cancelToken) {
      // Handle cancellation
      config.cancelToken.promise.then(function onCanceled(cancel) {
        if (!request) {
          return;
        }

        request.abort();
        reject(cancel);
        // Clean up request
        request = null;
      });
    }

    if (!requestData) {
      requestData = null;
    }

    // Send the request
    request.send(requestData);
  });
};


/***/ }),

/***/ "./node_modules/axios/lib/axios.js":
/*!*****************************************!*\
  !*** ./node_modules/axios/lib/axios.js ***!
  \*****************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";


var utils = __webpack_require__(/*! ./utils */ "./node_modules/axios/lib/utils.js");
var bind = __webpack_require__(/*! ./helpers/bind */ "./node_modules/axios/lib/helpers/bind.js");
var Axios = __webpack_require__(/*! ./core/Axios */ "./node_modules/axios/lib/core/Axios.js");
var mergeConfig = __webpack_require__(/*! ./core/mergeConfig */ "./node_modules/axios/lib/core/mergeConfig.js");
var defaults = __webpack_require__(/*! ./defaults */ "./node_modules/axios/lib/defaults.js");

/**
 * Create an instance of Axios
 *
 * @param {Object} defaultConfig The default config for the instance
 * @return {Axios} A new instance of Axios
 */
function createInstance(defaultConfig) {
  var context = new Axios(defaultConfig);
  var instance = bind(Axios.prototype.request, context);

  // Copy axios.prototype to instance
  utils.extend(instance, Axios.prototype, context);

  // Copy context to instance
  utils.extend(instance, context);

  return instance;
}

// Create the default instance to be exported
var axios = createInstance(defaults);

// Expose Axios class to allow class inheritance
axios.Axios = Axios;

// Factory for creating new instances
axios.create = function create(instanceConfig) {
  return createInstance(mergeConfig(axios.defaults, instanceConfig));
};

// Expose Cancel & CancelToken
axios.Cancel = __webpack_require__(/*! ./cancel/Cancel */ "./node_modules/axios/lib/cancel/Cancel.js");
axios.CancelToken = __webpack_require__(/*! ./cancel/CancelToken */ "./node_modules/axios/lib/cancel/CancelToken.js");
axios.isCancel = __webpack_require__(/*! ./cancel/isCancel */ "./node_modules/axios/lib/cancel/isCancel.js");

// Expose all/spread
axios.all = function all(promises) {
  return Promise.all(promises);
};
axios.spread = __webpack_require__(/*! ./helpers/spread */ "./node_modules/axios/lib/helpers/spread.js");

// Expose isAxiosError
axios.isAxiosError = __webpack_require__(/*! ./helpers/isAxiosError */ "./node_modules/axios/lib/helpers/isAxiosError.js");

module.exports = axios;

// Allow use of default import syntax in TypeScript
module.exports["default"] = axios;


/***/ }),

/***/ "./node_modules/axios/lib/cancel/Cancel.js":
/*!*************************************************!*\
  !*** ./node_modules/axios/lib/cancel/Cancel.js ***!
  \*************************************************/
/***/ ((module) => {

"use strict";


/**
 * A `Cancel` is an object that is thrown when an operation is canceled.
 *
 * @class
 * @param {string=} message The message.
 */
function Cancel(message) {
  this.message = message;
}

Cancel.prototype.toString = function toString() {
  return 'Cancel' + (this.message ? ': ' + this.message : '');
};

Cancel.prototype.__CANCEL__ = true;

module.exports = Cancel;


/***/ }),

/***/ "./node_modules/axios/lib/cancel/CancelToken.js":
/*!******************************************************!*\
  !*** ./node_modules/axios/lib/cancel/CancelToken.js ***!
  \******************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";


var Cancel = __webpack_require__(/*! ./Cancel */ "./node_modules/axios/lib/cancel/Cancel.js");

/**
 * A `CancelToken` is an object that can be used to request cancellation of an operation.
 *
 * @class
 * @param {Function} executor The executor function.
 */
function CancelToken(executor) {
  if (typeof executor !== 'function') {
    throw new TypeError('executor must be a function.');
  }

  var resolvePromise;
  this.promise = new Promise(function promiseExecutor(resolve) {
    resolvePromise = resolve;
  });

  var token = this;
  executor(function cancel(message) {
    if (token.reason) {
      // Cancellation has already been requested
      return;
    }

    token.reason = new Cancel(message);
    resolvePromise(token.reason);
  });
}

/**
 * Throws a `Cancel` if cancellation has been requested.
 */
CancelToken.prototype.throwIfRequested = function throwIfRequested() {
  if (this.reason) {
    throw this.reason;
  }
};

/**
 * Returns an object that contains a new `CancelToken` and a function that, when called,
 * cancels the `CancelToken`.
 */
CancelToken.source = function source() {
  var cancel;
  var token = new CancelToken(function executor(c) {
    cancel = c;
  });
  return {
    token: token,
    cancel: cancel
  };
};

module.exports = CancelToken;


/***/ }),

/***/ "./node_modules/axios/lib/cancel/isCancel.js":
/*!***************************************************!*\
  !*** ./node_modules/axios/lib/cancel/isCancel.js ***!
  \***************************************************/
/***/ ((module) => {

"use strict";


module.exports = function isCancel(value) {
  return !!(value && value.__CANCEL__);
};


/***/ }),

/***/ "./node_modules/axios/lib/core/Axios.js":
/*!**********************************************!*\
  !*** ./node_modules/axios/lib/core/Axios.js ***!
  \**********************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";


var utils = __webpack_require__(/*! ./../utils */ "./node_modules/axios/lib/utils.js");
var buildURL = __webpack_require__(/*! ../helpers/buildURL */ "./node_modules/axios/lib/helpers/buildURL.js");
var InterceptorManager = __webpack_require__(/*! ./InterceptorManager */ "./node_modules/axios/lib/core/InterceptorManager.js");
var dispatchRequest = __webpack_require__(/*! ./dispatchRequest */ "./node_modules/axios/lib/core/dispatchRequest.js");
var mergeConfig = __webpack_require__(/*! ./mergeConfig */ "./node_modules/axios/lib/core/mergeConfig.js");
var validator = __webpack_require__(/*! ../helpers/validator */ "./node_modules/axios/lib/helpers/validator.js");

var validators = validator.validators;
/**
 * Create a new instance of Axios
 *
 * @param {Object} instanceConfig The default config for the instance
 */
function Axios(instanceConfig) {
  this.defaults = instanceConfig;
  this.interceptors = {
    request: new InterceptorManager(),
    response: new InterceptorManager()
  };
}

/**
 * Dispatch a request
 *
 * @param {Object} config The config specific for this request (merged with this.defaults)
 */
Axios.prototype.request = function request(config) {
  /*eslint no-param-reassign:0*/
  // Allow for axios('example/url'[, config]) a la fetch API
  if (typeof config === 'string') {
    config = arguments[1] || {};
    config.url = arguments[0];
  } else {
    config = config || {};
  }

  config = mergeConfig(this.defaults, config);

  // Set config.method
  if (config.method) {
    config.method = config.method.toLowerCase();
  } else if (this.defaults.method) {
    config.method = this.defaults.method.toLowerCase();
  } else {
    config.method = 'get';
  }

  var transitional = config.transitional;

  if (transitional !== undefined) {
    validator.assertOptions(transitional, {
      silentJSONParsing: validators.transitional(validators.boolean, '1.0.0'),
      forcedJSONParsing: validators.transitional(validators.boolean, '1.0.0'),
      clarifyTimeoutError: validators.transitional(validators.boolean, '1.0.0')
    }, false);
  }

  // filter out skipped interceptors
  var requestInterceptorChain = [];
  var synchronousRequestInterceptors = true;
  this.interceptors.request.forEach(function unshiftRequestInterceptors(interceptor) {
    if (typeof interceptor.runWhen === 'function' && interceptor.runWhen(config) === false) {
      return;
    }

    synchronousRequestInterceptors = synchronousRequestInterceptors && interceptor.synchronous;

    requestInterceptorChain.unshift(interceptor.fulfilled, interceptor.rejected);
  });

  var responseInterceptorChain = [];
  this.interceptors.response.forEach(function pushResponseInterceptors(interceptor) {
    responseInterceptorChain.push(interceptor.fulfilled, interceptor.rejected);
  });

  var promise;

  if (!synchronousRequestInterceptors) {
    var chain = [dispatchRequest, undefined];

    Array.prototype.unshift.apply(chain, requestInterceptorChain);
    chain = chain.concat(responseInterceptorChain);

    promise = Promise.resolve(config);
    while (chain.length) {
      promise = promise.then(chain.shift(), chain.shift());
    }

    return promise;
  }


  var newConfig = config;
  while (requestInterceptorChain.length) {
    var onFulfilled = requestInterceptorChain.shift();
    var onRejected = requestInterceptorChain.shift();
    try {
      newConfig = onFulfilled(newConfig);
    } catch (error) {
      onRejected(error);
      break;
    }
  }

  try {
    promise = dispatchRequest(newConfig);
  } catch (error) {
    return Promise.reject(error);
  }

  while (responseInterceptorChain.length) {
    promise = promise.then(responseInterceptorChain.shift(), responseInterceptorChain.shift());
  }

  return promise;
};

Axios.prototype.getUri = function getUri(config) {
  config = mergeConfig(this.defaults, config);
  return buildURL(config.url, config.params, config.paramsSerializer).replace(/^\?/, '');
};

// Provide aliases for supported request methods
utils.forEach(['delete', 'get', 'head', 'options'], function forEachMethodNoData(method) {
  /*eslint func-names:0*/
  Axios.prototype[method] = function(url, config) {
    return this.request(mergeConfig(config || {}, {
      method: method,
      url: url,
      data: (config || {}).data
    }));
  };
});

utils.forEach(['post', 'put', 'patch'], function forEachMethodWithData(method) {
  /*eslint func-names:0*/
  Axios.prototype[method] = function(url, data, config) {
    return this.request(mergeConfig(config || {}, {
      method: method,
      url: url,
      data: data
    }));
  };
});

module.exports = Axios;


/***/ }),

/***/ "./node_modules/axios/lib/core/InterceptorManager.js":
/*!***********************************************************!*\
  !*** ./node_modules/axios/lib/core/InterceptorManager.js ***!
  \***********************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";


var utils = __webpack_require__(/*! ./../utils */ "./node_modules/axios/lib/utils.js");

function InterceptorManager() {
  this.handlers = [];
}

/**
 * Add a new interceptor to the stack
 *
 * @param {Function} fulfilled The function to handle `then` for a `Promise`
 * @param {Function} rejected The function to handle `reject` for a `Promise`
 *
 * @return {Number} An ID used to remove interceptor later
 */
InterceptorManager.prototype.use = function use(fulfilled, rejected, options) {
  this.handlers.push({
    fulfilled: fulfilled,
    rejected: rejected,
    synchronous: options ? options.synchronous : false,
    runWhen: options ? options.runWhen : null
  });
  return this.handlers.length - 1;
};

/**
 * Remove an interceptor from the stack
 *
 * @param {Number} id The ID that was returned by `use`
 */
InterceptorManager.prototype.eject = function eject(id) {
  if (this.handlers[id]) {
    this.handlers[id] = null;
  }
};

/**
 * Iterate over all the registered interceptors
 *
 * This method is particularly useful for skipping over any
 * interceptors that may have become `null` calling `eject`.
 *
 * @param {Function} fn The function to call for each interceptor
 */
InterceptorManager.prototype.forEach = function forEach(fn) {
  utils.forEach(this.handlers, function forEachHandler(h) {
    if (h !== null) {
      fn(h);
    }
  });
};

module.exports = InterceptorManager;


/***/ }),

/***/ "./node_modules/axios/lib/core/buildFullPath.js":
/*!******************************************************!*\
  !*** ./node_modules/axios/lib/core/buildFullPath.js ***!
  \******************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";


var isAbsoluteURL = __webpack_require__(/*! ../helpers/isAbsoluteURL */ "./node_modules/axios/lib/helpers/isAbsoluteURL.js");
var combineURLs = __webpack_require__(/*! ../helpers/combineURLs */ "./node_modules/axios/lib/helpers/combineURLs.js");

/**
 * Creates a new URL by combining the baseURL with the requestedURL,
 * only when the requestedURL is not already an absolute URL.
 * If the requestURL is absolute, this function returns the requestedURL untouched.
 *
 * @param {string} baseURL The base URL
 * @param {string} requestedURL Absolute or relative URL to combine
 * @returns {string} The combined full path
 */
module.exports = function buildFullPath(baseURL, requestedURL) {
  if (baseURL && !isAbsoluteURL(requestedURL)) {
    return combineURLs(baseURL, requestedURL);
  }
  return requestedURL;
};


/***/ }),

/***/ "./node_modules/axios/lib/core/createError.js":
/*!****************************************************!*\
  !*** ./node_modules/axios/lib/core/createError.js ***!
  \****************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";


var enhanceError = __webpack_require__(/*! ./enhanceError */ "./node_modules/axios/lib/core/enhanceError.js");

/**
 * Create an Error with the specified message, config, error code, request and response.
 *
 * @param {string} message The error message.
 * @param {Object} config The config.
 * @param {string} [code] The error code (for example, 'ECONNABORTED').
 * @param {Object} [request] The request.
 * @param {Object} [response] The response.
 * @returns {Error} The created error.
 */
module.exports = function createError(message, config, code, request, response) {
  var error = new Error(message);
  return enhanceError(error, config, code, request, response);
};


/***/ }),

/***/ "./node_modules/axios/lib/core/dispatchRequest.js":
/*!********************************************************!*\
  !*** ./node_modules/axios/lib/core/dispatchRequest.js ***!
  \********************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";


var utils = __webpack_require__(/*! ./../utils */ "./node_modules/axios/lib/utils.js");
var transformData = __webpack_require__(/*! ./transformData */ "./node_modules/axios/lib/core/transformData.js");
var isCancel = __webpack_require__(/*! ../cancel/isCancel */ "./node_modules/axios/lib/cancel/isCancel.js");
var defaults = __webpack_require__(/*! ../defaults */ "./node_modules/axios/lib/defaults.js");

/**
 * Throws a `Cancel` if cancellation has been requested.
 */
function throwIfCancellationRequested(config) {
  if (config.cancelToken) {
    config.cancelToken.throwIfRequested();
  }
}

/**
 * Dispatch a request to the server using the configured adapter.
 *
 * @param {object} config The config that is to be used for the request
 * @returns {Promise} The Promise to be fulfilled
 */
module.exports = function dispatchRequest(config) {
  throwIfCancellationRequested(config);

  // Ensure headers exist
  config.headers = config.headers || {};

  // Transform request data
  config.data = transformData.call(
    config,
    config.data,
    config.headers,
    config.transformRequest
  );

  // Flatten headers
  config.headers = utils.merge(
    config.headers.common || {},
    config.headers[config.method] || {},
    config.headers
  );

  utils.forEach(
    ['delete', 'get', 'head', 'post', 'put', 'patch', 'common'],
    function cleanHeaderConfig(method) {
      delete config.headers[method];
    }
  );

  var adapter = config.adapter || defaults.adapter;

  return adapter(config).then(function onAdapterResolution(response) {
    throwIfCancellationRequested(config);

    // Transform response data
    response.data = transformData.call(
      config,
      response.data,
      response.headers,
      config.transformResponse
    );

    return response;
  }, function onAdapterRejection(reason) {
    if (!isCancel(reason)) {
      throwIfCancellationRequested(config);

      // Transform response data
      if (reason && reason.response) {
        reason.response.data = transformData.call(
          config,
          reason.response.data,
          reason.response.headers,
          config.transformResponse
        );
      }
    }

    return Promise.reject(reason);
  });
};


/***/ }),

/***/ "./node_modules/axios/lib/core/enhanceError.js":
/*!*****************************************************!*\
  !*** ./node_modules/axios/lib/core/enhanceError.js ***!
  \*****************************************************/
/***/ ((module) => {

"use strict";


/**
 * Update an Error with the specified config, error code, and response.
 *
 * @param {Error} error The error to update.
 * @param {Object} config The config.
 * @param {string} [code] The error code (for example, 'ECONNABORTED').
 * @param {Object} [request] The request.
 * @param {Object} [response] The response.
 * @returns {Error} The error.
 */
module.exports = function enhanceError(error, config, code, request, response) {
  error.config = config;
  if (code) {
    error.code = code;
  }

  error.request = request;
  error.response = response;
  error.isAxiosError = true;

  error.toJSON = function toJSON() {
    return {
      // Standard
      message: this.message,
      name: this.name,
      // Microsoft
      description: this.description,
      number: this.number,
      // Mozilla
      fileName: this.fileName,
      lineNumber: this.lineNumber,
      columnNumber: this.columnNumber,
      stack: this.stack,
      // Axios
      config: this.config,
      code: this.code
    };
  };
  return error;
};


/***/ }),

/***/ "./node_modules/axios/lib/core/mergeConfig.js":
/*!****************************************************!*\
  !*** ./node_modules/axios/lib/core/mergeConfig.js ***!
  \****************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";


var utils = __webpack_require__(/*! ../utils */ "./node_modules/axios/lib/utils.js");

/**
 * Config-specific merge-function which creates a new config-object
 * by merging two configuration objects together.
 *
 * @param {Object} config1
 * @param {Object} config2
 * @returns {Object} New object resulting from merging config2 to config1
 */
module.exports = function mergeConfig(config1, config2) {
  // eslint-disable-next-line no-param-reassign
  config2 = config2 || {};
  var config = {};

  var valueFromConfig2Keys = ['url', 'method', 'data'];
  var mergeDeepPropertiesKeys = ['headers', 'auth', 'proxy', 'params'];
  var defaultToConfig2Keys = [
    'baseURL', 'transformRequest', 'transformResponse', 'paramsSerializer',
    'timeout', 'timeoutMessage', 'withCredentials', 'adapter', 'responseType', 'xsrfCookieName',
    'xsrfHeaderName', 'onUploadProgress', 'onDownloadProgress', 'decompress',
    'maxContentLength', 'maxBodyLength', 'maxRedirects', 'transport', 'httpAgent',
    'httpsAgent', 'cancelToken', 'socketPath', 'responseEncoding'
  ];
  var directMergeKeys = ['validateStatus'];

  function getMergedValue(target, source) {
    if (utils.isPlainObject(target) && utils.isPlainObject(source)) {
      return utils.merge(target, source);
    } else if (utils.isPlainObject(source)) {
      return utils.merge({}, source);
    } else if (utils.isArray(source)) {
      return source.slice();
    }
    return source;
  }

  function mergeDeepProperties(prop) {
    if (!utils.isUndefined(config2[prop])) {
      config[prop] = getMergedValue(config1[prop], config2[prop]);
    } else if (!utils.isUndefined(config1[prop])) {
      config[prop] = getMergedValue(undefined, config1[prop]);
    }
  }

  utils.forEach(valueFromConfig2Keys, function valueFromConfig2(prop) {
    if (!utils.isUndefined(config2[prop])) {
      config[prop] = getMergedValue(undefined, config2[prop]);
    }
  });

  utils.forEach(mergeDeepPropertiesKeys, mergeDeepProperties);

  utils.forEach(defaultToConfig2Keys, function defaultToConfig2(prop) {
    if (!utils.isUndefined(config2[prop])) {
      config[prop] = getMergedValue(undefined, config2[prop]);
    } else if (!utils.isUndefined(config1[prop])) {
      config[prop] = getMergedValue(undefined, config1[prop]);
    }
  });

  utils.forEach(directMergeKeys, function merge(prop) {
    if (prop in config2) {
      config[prop] = getMergedValue(config1[prop], config2[prop]);
    } else if (prop in config1) {
      config[prop] = getMergedValue(undefined, config1[prop]);
    }
  });

  var axiosKeys = valueFromConfig2Keys
    .concat(mergeDeepPropertiesKeys)
    .concat(defaultToConfig2Keys)
    .concat(directMergeKeys);

  var otherKeys = Object
    .keys(config1)
    .concat(Object.keys(config2))
    .filter(function filterAxiosKeys(key) {
      return axiosKeys.indexOf(key) === -1;
    });

  utils.forEach(otherKeys, mergeDeepProperties);

  return config;
};


/***/ }),

/***/ "./node_modules/axios/lib/core/settle.js":
/*!***********************************************!*\
  !*** ./node_modules/axios/lib/core/settle.js ***!
  \***********************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";


var createError = __webpack_require__(/*! ./createError */ "./node_modules/axios/lib/core/createError.js");

/**
 * Resolve or reject a Promise based on response status.
 *
 * @param {Function} resolve A function that resolves the promise.
 * @param {Function} reject A function that rejects the promise.
 * @param {object} response The response.
 */
module.exports = function settle(resolve, reject, response) {
  var validateStatus = response.config.validateStatus;
  if (!response.status || !validateStatus || validateStatus(response.status)) {
    resolve(response);
  } else {
    reject(createError(
      'Request failed with status code ' + response.status,
      response.config,
      null,
      response.request,
      response
    ));
  }
};


/***/ }),

/***/ "./node_modules/axios/lib/core/transformData.js":
/*!******************************************************!*\
  !*** ./node_modules/axios/lib/core/transformData.js ***!
  \******************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";


var utils = __webpack_require__(/*! ./../utils */ "./node_modules/axios/lib/utils.js");
var defaults = __webpack_require__(/*! ./../defaults */ "./node_modules/axios/lib/defaults.js");

/**
 * Transform the data for a request or a response
 *
 * @param {Object|String} data The data to be transformed
 * @param {Array} headers The headers for the request or response
 * @param {Array|Function} fns A single function or Array of functions
 * @returns {*} The resulting transformed data
 */
module.exports = function transformData(data, headers, fns) {
  var context = this || defaults;
  /*eslint no-param-reassign:0*/
  utils.forEach(fns, function transform(fn) {
    data = fn.call(context, data, headers);
  });

  return data;
};


/***/ }),

/***/ "./node_modules/axios/lib/defaults.js":
/*!********************************************!*\
  !*** ./node_modules/axios/lib/defaults.js ***!
  \********************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";
/* provided dependency */ var process = __webpack_require__(/*! process/browser.js */ "./node_modules/process/browser.js");


var utils = __webpack_require__(/*! ./utils */ "./node_modules/axios/lib/utils.js");
var normalizeHeaderName = __webpack_require__(/*! ./helpers/normalizeHeaderName */ "./node_modules/axios/lib/helpers/normalizeHeaderName.js");
var enhanceError = __webpack_require__(/*! ./core/enhanceError */ "./node_modules/axios/lib/core/enhanceError.js");

var DEFAULT_CONTENT_TYPE = {
  'Content-Type': 'application/x-www-form-urlencoded'
};

function setContentTypeIfUnset(headers, value) {
  if (!utils.isUndefined(headers) && utils.isUndefined(headers['Content-Type'])) {
    headers['Content-Type'] = value;
  }
}

function getDefaultAdapter() {
  var adapter;
  if (typeof XMLHttpRequest !== 'undefined') {
    // For browsers use XHR adapter
    adapter = __webpack_require__(/*! ./adapters/xhr */ "./node_modules/axios/lib/adapters/xhr.js");
  } else if (typeof process !== 'undefined' && Object.prototype.toString.call(process) === '[object process]') {
    // For node use HTTP adapter
    adapter = __webpack_require__(/*! ./adapters/http */ "./node_modules/axios/lib/adapters/xhr.js");
  }
  return adapter;
}

function stringifySafely(rawValue, parser, encoder) {
  if (utils.isString(rawValue)) {
    try {
      (parser || JSON.parse)(rawValue);
      return utils.trim(rawValue);
    } catch (e) {
      if (e.name !== 'SyntaxError') {
        throw e;
      }
    }
  }

  return (encoder || JSON.stringify)(rawValue);
}

var defaults = {

  transitional: {
    silentJSONParsing: true,
    forcedJSONParsing: true,
    clarifyTimeoutError: false
  },

  adapter: getDefaultAdapter(),

  transformRequest: [function transformRequest(data, headers) {
    normalizeHeaderName(headers, 'Accept');
    normalizeHeaderName(headers, 'Content-Type');

    if (utils.isFormData(data) ||
      utils.isArrayBuffer(data) ||
      utils.isBuffer(data) ||
      utils.isStream(data) ||
      utils.isFile(data) ||
      utils.isBlob(data)
    ) {
      return data;
    }
    if (utils.isArrayBufferView(data)) {
      return data.buffer;
    }
    if (utils.isURLSearchParams(data)) {
      setContentTypeIfUnset(headers, 'application/x-www-form-urlencoded;charset=utf-8');
      return data.toString();
    }
    if (utils.isObject(data) || (headers && headers['Content-Type'] === 'application/json')) {
      setContentTypeIfUnset(headers, 'application/json');
      return stringifySafely(data);
    }
    return data;
  }],

  transformResponse: [function transformResponse(data) {
    var transitional = this.transitional;
    var silentJSONParsing = transitional && transitional.silentJSONParsing;
    var forcedJSONParsing = transitional && transitional.forcedJSONParsing;
    var strictJSONParsing = !silentJSONParsing && this.responseType === 'json';

    if (strictJSONParsing || (forcedJSONParsing && utils.isString(data) && data.length)) {
      try {
        return JSON.parse(data);
      } catch (e) {
        if (strictJSONParsing) {
          if (e.name === 'SyntaxError') {
            throw enhanceError(e, this, 'E_JSON_PARSE');
          }
          throw e;
        }
      }
    }

    return data;
  }],

  /**
   * A timeout in milliseconds to abort a request. If set to 0 (default) a
   * timeout is not created.
   */
  timeout: 0,

  xsrfCookieName: 'XSRF-TOKEN',
  xsrfHeaderName: 'X-XSRF-TOKEN',

  maxContentLength: -1,
  maxBodyLength: -1,

  validateStatus: function validateStatus(status) {
    return status >= 200 && status < 300;
  }
};

defaults.headers = {
  common: {
    'Accept': 'application/json, text/plain, */*'
  }
};

utils.forEach(['delete', 'get', 'head'], function forEachMethodNoData(method) {
  defaults.headers[method] = {};
});

utils.forEach(['post', 'put', 'patch'], function forEachMethodWithData(method) {
  defaults.headers[method] = utils.merge(DEFAULT_CONTENT_TYPE);
});

module.exports = defaults;


/***/ }),

/***/ "./node_modules/axios/lib/helpers/bind.js":
/*!************************************************!*\
  !*** ./node_modules/axios/lib/helpers/bind.js ***!
  \************************************************/
/***/ ((module) => {

"use strict";


module.exports = function bind(fn, thisArg) {
  return function wrap() {
    var args = new Array(arguments.length);
    for (var i = 0; i < args.length; i++) {
      args[i] = arguments[i];
    }
    return fn.apply(thisArg, args);
  };
};


/***/ }),

/***/ "./node_modules/axios/lib/helpers/buildURL.js":
/*!****************************************************!*\
  !*** ./node_modules/axios/lib/helpers/buildURL.js ***!
  \****************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";


var utils = __webpack_require__(/*! ./../utils */ "./node_modules/axios/lib/utils.js");

function encode(val) {
  return encodeURIComponent(val).
    replace(/%3A/gi, ':').
    replace(/%24/g, '$').
    replace(/%2C/gi, ',').
    replace(/%20/g, '+').
    replace(/%5B/gi, '[').
    replace(/%5D/gi, ']');
}

/**
 * Build a URL by appending params to the end
 *
 * @param {string} url The base of the url (e.g., http://www.google.com)
 * @param {object} [params] The params to be appended
 * @returns {string} The formatted url
 */
module.exports = function buildURL(url, params, paramsSerializer) {
  /*eslint no-param-reassign:0*/
  if (!params) {
    return url;
  }

  var serializedParams;
  if (paramsSerializer) {
    serializedParams = paramsSerializer(params);
  } else if (utils.isURLSearchParams(params)) {
    serializedParams = params.toString();
  } else {
    var parts = [];

    utils.forEach(params, function serialize(val, key) {
      if (val === null || typeof val === 'undefined') {
        return;
      }

      if (utils.isArray(val)) {
        key = key + '[]';
      } else {
        val = [val];
      }

      utils.forEach(val, function parseValue(v) {
        if (utils.isDate(v)) {
          v = v.toISOString();
        } else if (utils.isObject(v)) {
          v = JSON.stringify(v);
        }
        parts.push(encode(key) + '=' + encode(v));
      });
    });

    serializedParams = parts.join('&');
  }

  if (serializedParams) {
    var hashmarkIndex = url.indexOf('#');
    if (hashmarkIndex !== -1) {
      url = url.slice(0, hashmarkIndex);
    }

    url += (url.indexOf('?') === -1 ? '?' : '&') + serializedParams;
  }

  return url;
};


/***/ }),

/***/ "./node_modules/axios/lib/helpers/combineURLs.js":
/*!*******************************************************!*\
  !*** ./node_modules/axios/lib/helpers/combineURLs.js ***!
  \*******************************************************/
/***/ ((module) => {

"use strict";


/**
 * Creates a new URL by combining the specified URLs
 *
 * @param {string} baseURL The base URL
 * @param {string} relativeURL The relative URL
 * @returns {string} The combined URL
 */
module.exports = function combineURLs(baseURL, relativeURL) {
  return relativeURL
    ? baseURL.replace(/\/+$/, '') + '/' + relativeURL.replace(/^\/+/, '')
    : baseURL;
};


/***/ }),

/***/ "./node_modules/axios/lib/helpers/cookies.js":
/*!***************************************************!*\
  !*** ./node_modules/axios/lib/helpers/cookies.js ***!
  \***************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";


var utils = __webpack_require__(/*! ./../utils */ "./node_modules/axios/lib/utils.js");

module.exports = (
  utils.isStandardBrowserEnv() ?

  // Standard browser envs support document.cookie
    (function standardBrowserEnv() {
      return {
        write: function write(name, value, expires, path, domain, secure) {
          var cookie = [];
          cookie.push(name + '=' + encodeURIComponent(value));

          if (utils.isNumber(expires)) {
            cookie.push('expires=' + new Date(expires).toGMTString());
          }

          if (utils.isString(path)) {
            cookie.push('path=' + path);
          }

          if (utils.isString(domain)) {
            cookie.push('domain=' + domain);
          }

          if (secure === true) {
            cookie.push('secure');
          }

          document.cookie = cookie.join('; ');
        },

        read: function read(name) {
          var match = document.cookie.match(new RegExp('(^|;\\s*)(' + name + ')=([^;]*)'));
          return (match ? decodeURIComponent(match[3]) : null);
        },

        remove: function remove(name) {
          this.write(name, '', Date.now() - 86400000);
        }
      };
    })() :

  // Non standard browser env (web workers, react-native) lack needed support.
    (function nonStandardBrowserEnv() {
      return {
        write: function write() {},
        read: function read() { return null; },
        remove: function remove() {}
      };
    })()
);


/***/ }),

/***/ "./node_modules/axios/lib/helpers/isAbsoluteURL.js":
/*!*********************************************************!*\
  !*** ./node_modules/axios/lib/helpers/isAbsoluteURL.js ***!
  \*********************************************************/
/***/ ((module) => {

"use strict";


/**
 * Determines whether the specified URL is absolute
 *
 * @param {string} url The URL to test
 * @returns {boolean} True if the specified URL is absolute, otherwise false
 */
module.exports = function isAbsoluteURL(url) {
  // A URL is considered absolute if it begins with "<scheme>://" or "//" (protocol-relative URL).
  // RFC 3986 defines scheme name as a sequence of characters beginning with a letter and followed
  // by any combination of letters, digits, plus, period, or hyphen.
  return /^([a-z][a-z\d\+\-\.]*:)?\/\//i.test(url);
};


/***/ }),

/***/ "./node_modules/axios/lib/helpers/isAxiosError.js":
/*!********************************************************!*\
  !*** ./node_modules/axios/lib/helpers/isAxiosError.js ***!
  \********************************************************/
/***/ ((module) => {

"use strict";


/**
 * Determines whether the payload is an error thrown by Axios
 *
 * @param {*} payload The value to test
 * @returns {boolean} True if the payload is an error thrown by Axios, otherwise false
 */
module.exports = function isAxiosError(payload) {
  return (typeof payload === 'object') && (payload.isAxiosError === true);
};


/***/ }),

/***/ "./node_modules/axios/lib/helpers/isURLSameOrigin.js":
/*!***********************************************************!*\
  !*** ./node_modules/axios/lib/helpers/isURLSameOrigin.js ***!
  \***********************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";


var utils = __webpack_require__(/*! ./../utils */ "./node_modules/axios/lib/utils.js");

module.exports = (
  utils.isStandardBrowserEnv() ?

  // Standard browser envs have full support of the APIs needed to test
  // whether the request URL is of the same origin as current location.
    (function standardBrowserEnv() {
      var msie = /(msie|trident)/i.test(navigator.userAgent);
      var urlParsingNode = document.createElement('a');
      var originURL;

      /**
    * Parse a URL to discover it's components
    *
    * @param {String} url The URL to be parsed
    * @returns {Object}
    */
      function resolveURL(url) {
        var href = url;

        if (msie) {
        // IE needs attribute set twice to normalize properties
          urlParsingNode.setAttribute('href', href);
          href = urlParsingNode.href;
        }

        urlParsingNode.setAttribute('href', href);

        // urlParsingNode provides the UrlUtils interface - http://url.spec.whatwg.org/#urlutils
        return {
          href: urlParsingNode.href,
          protocol: urlParsingNode.protocol ? urlParsingNode.protocol.replace(/:$/, '') : '',
          host: urlParsingNode.host,
          search: urlParsingNode.search ? urlParsingNode.search.replace(/^\?/, '') : '',
          hash: urlParsingNode.hash ? urlParsingNode.hash.replace(/^#/, '') : '',
          hostname: urlParsingNode.hostname,
          port: urlParsingNode.port,
          pathname: (urlParsingNode.pathname.charAt(0) === '/') ?
            urlParsingNode.pathname :
            '/' + urlParsingNode.pathname
        };
      }

      originURL = resolveURL(window.location.href);

      /**
    * Determine if a URL shares the same origin as the current location
    *
    * @param {String} requestURL The URL to test
    * @returns {boolean} True if URL shares the same origin, otherwise false
    */
      return function isURLSameOrigin(requestURL) {
        var parsed = (utils.isString(requestURL)) ? resolveURL(requestURL) : requestURL;
        return (parsed.protocol === originURL.protocol &&
            parsed.host === originURL.host);
      };
    })() :

  // Non standard browser envs (web workers, react-native) lack needed support.
    (function nonStandardBrowserEnv() {
      return function isURLSameOrigin() {
        return true;
      };
    })()
);


/***/ }),

/***/ "./node_modules/axios/lib/helpers/normalizeHeaderName.js":
/*!***************************************************************!*\
  !*** ./node_modules/axios/lib/helpers/normalizeHeaderName.js ***!
  \***************************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";


var utils = __webpack_require__(/*! ../utils */ "./node_modules/axios/lib/utils.js");

module.exports = function normalizeHeaderName(headers, normalizedName) {
  utils.forEach(headers, function processHeader(value, name) {
    if (name !== normalizedName && name.toUpperCase() === normalizedName.toUpperCase()) {
      headers[normalizedName] = value;
      delete headers[name];
    }
  });
};


/***/ }),

/***/ "./node_modules/axios/lib/helpers/parseHeaders.js":
/*!********************************************************!*\
  !*** ./node_modules/axios/lib/helpers/parseHeaders.js ***!
  \********************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";


var utils = __webpack_require__(/*! ./../utils */ "./node_modules/axios/lib/utils.js");

// Headers whose duplicates are ignored by node
// c.f. https://nodejs.org/api/http.html#http_message_headers
var ignoreDuplicateOf = [
  'age', 'authorization', 'content-length', 'content-type', 'etag',
  'expires', 'from', 'host', 'if-modified-since', 'if-unmodified-since',
  'last-modified', 'location', 'max-forwards', 'proxy-authorization',
  'referer', 'retry-after', 'user-agent'
];

/**
 * Parse headers into an object
 *
 * ```
 * Date: Wed, 27 Aug 2014 08:58:49 GMT
 * Content-Type: application/json
 * Connection: keep-alive
 * Transfer-Encoding: chunked
 * ```
 *
 * @param {String} headers Headers needing to be parsed
 * @returns {Object} Headers parsed into an object
 */
module.exports = function parseHeaders(headers) {
  var parsed = {};
  var key;
  var val;
  var i;

  if (!headers) { return parsed; }

  utils.forEach(headers.split('\n'), function parser(line) {
    i = line.indexOf(':');
    key = utils.trim(line.substr(0, i)).toLowerCase();
    val = utils.trim(line.substr(i + 1));

    if (key) {
      if (parsed[key] && ignoreDuplicateOf.indexOf(key) >= 0) {
        return;
      }
      if (key === 'set-cookie') {
        parsed[key] = (parsed[key] ? parsed[key] : []).concat([val]);
      } else {
        parsed[key] = parsed[key] ? parsed[key] + ', ' + val : val;
      }
    }
  });

  return parsed;
};


/***/ }),

/***/ "./node_modules/axios/lib/helpers/spread.js":
/*!**************************************************!*\
  !*** ./node_modules/axios/lib/helpers/spread.js ***!
  \**************************************************/
/***/ ((module) => {

"use strict";


/**
 * Syntactic sugar for invoking a function and expanding an array for arguments.
 *
 * Common use case would be to use `Function.prototype.apply`.
 *
 *  ```js
 *  function f(x, y, z) {}
 *  var args = [1, 2, 3];
 *  f.apply(null, args);
 *  ```
 *
 * With `spread` this example can be re-written.
 *
 *  ```js
 *  spread(function(x, y, z) {})([1, 2, 3]);
 *  ```
 *
 * @param {Function} callback
 * @returns {Function}
 */
module.exports = function spread(callback) {
  return function wrap(arr) {
    return callback.apply(null, arr);
  };
};


/***/ }),

/***/ "./node_modules/axios/lib/helpers/validator.js":
/*!*****************************************************!*\
  !*** ./node_modules/axios/lib/helpers/validator.js ***!
  \*****************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";


var pkg = __webpack_require__(/*! ./../../package.json */ "./node_modules/axios/package.json");

var validators = {};

// eslint-disable-next-line func-names
['object', 'boolean', 'number', 'function', 'string', 'symbol'].forEach(function(type, i) {
  validators[type] = function validator(thing) {
    return typeof thing === type || 'a' + (i < 1 ? 'n ' : ' ') + type;
  };
});

var deprecatedWarnings = {};
var currentVerArr = pkg.version.split('.');

/**
 * Compare package versions
 * @param {string} version
 * @param {string?} thanVersion
 * @returns {boolean}
 */
function isOlderVersion(version, thanVersion) {
  var pkgVersionArr = thanVersion ? thanVersion.split('.') : currentVerArr;
  var destVer = version.split('.');
  for (var i = 0; i < 3; i++) {
    if (pkgVersionArr[i] > destVer[i]) {
      return true;
    } else if (pkgVersionArr[i] < destVer[i]) {
      return false;
    }
  }
  return false;
}

/**
 * Transitional option validator
 * @param {function|boolean?} validator
 * @param {string?} version
 * @param {string} message
 * @returns {function}
 */
validators.transitional = function transitional(validator, version, message) {
  var isDeprecated = version && isOlderVersion(version);

  function formatMessage(opt, desc) {
    return '[Axios v' + pkg.version + '] Transitional option \'' + opt + '\'' + desc + (message ? '. ' + message : '');
  }

  // eslint-disable-next-line func-names
  return function(value, opt, opts) {
    if (validator === false) {
      throw new Error(formatMessage(opt, ' has been removed in ' + version));
    }

    if (isDeprecated && !deprecatedWarnings[opt]) {
      deprecatedWarnings[opt] = true;
      // eslint-disable-next-line no-console
      console.warn(
        formatMessage(
          opt,
          ' has been deprecated since v' + version + ' and will be removed in the near future'
        )
      );
    }

    return validator ? validator(value, opt, opts) : true;
  };
};

/**
 * Assert object's properties type
 * @param {object} options
 * @param {object} schema
 * @param {boolean?} allowUnknown
 */

function assertOptions(options, schema, allowUnknown) {
  if (typeof options !== 'object') {
    throw new TypeError('options must be an object');
  }
  var keys = Object.keys(options);
  var i = keys.length;
  while (i-- > 0) {
    var opt = keys[i];
    var validator = schema[opt];
    if (validator) {
      var value = options[opt];
      var result = value === undefined || validator(value, opt, options);
      if (result !== true) {
        throw new TypeError('option ' + opt + ' must be ' + result);
      }
      continue;
    }
    if (allowUnknown !== true) {
      throw Error('Unknown option ' + opt);
    }
  }
}

module.exports = {
  isOlderVersion: isOlderVersion,
  assertOptions: assertOptions,
  validators: validators
};


/***/ }),

/***/ "./node_modules/axios/lib/utils.js":
/*!*****************************************!*\
  !*** ./node_modules/axios/lib/utils.js ***!
  \*****************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";


var bind = __webpack_require__(/*! ./helpers/bind */ "./node_modules/axios/lib/helpers/bind.js");

// utils is a library of generic helper functions non-specific to axios

var toString = Object.prototype.toString;

/**
 * Determine if a value is an Array
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if value is an Array, otherwise false
 */
function isArray(val) {
  return toString.call(val) === '[object Array]';
}

/**
 * Determine if a value is undefined
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if the value is undefined, otherwise false
 */
function isUndefined(val) {
  return typeof val === 'undefined';
}

/**
 * Determine if a value is a Buffer
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if value is a Buffer, otherwise false
 */
function isBuffer(val) {
  return val !== null && !isUndefined(val) && val.constructor !== null && !isUndefined(val.constructor)
    && typeof val.constructor.isBuffer === 'function' && val.constructor.isBuffer(val);
}

/**
 * Determine if a value is an ArrayBuffer
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if value is an ArrayBuffer, otherwise false
 */
function isArrayBuffer(val) {
  return toString.call(val) === '[object ArrayBuffer]';
}

/**
 * Determine if a value is a FormData
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if value is an FormData, otherwise false
 */
function isFormData(val) {
  return (typeof FormData !== 'undefined') && (val instanceof FormData);
}

/**
 * Determine if a value is a view on an ArrayBuffer
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if value is a view on an ArrayBuffer, otherwise false
 */
function isArrayBufferView(val) {
  var result;
  if ((typeof ArrayBuffer !== 'undefined') && (ArrayBuffer.isView)) {
    result = ArrayBuffer.isView(val);
  } else {
    result = (val) && (val.buffer) && (val.buffer instanceof ArrayBuffer);
  }
  return result;
}

/**
 * Determine if a value is a String
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if value is a String, otherwise false
 */
function isString(val) {
  return typeof val === 'string';
}

/**
 * Determine if a value is a Number
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if value is a Number, otherwise false
 */
function isNumber(val) {
  return typeof val === 'number';
}

/**
 * Determine if a value is an Object
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if value is an Object, otherwise false
 */
function isObject(val) {
  return val !== null && typeof val === 'object';
}

/**
 * Determine if a value is a plain Object
 *
 * @param {Object} val The value to test
 * @return {boolean} True if value is a plain Object, otherwise false
 */
function isPlainObject(val) {
  if (toString.call(val) !== '[object Object]') {
    return false;
  }

  var prototype = Object.getPrototypeOf(val);
  return prototype === null || prototype === Object.prototype;
}

/**
 * Determine if a value is a Date
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if value is a Date, otherwise false
 */
function isDate(val) {
  return toString.call(val) === '[object Date]';
}

/**
 * Determine if a value is a File
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if value is a File, otherwise false
 */
function isFile(val) {
  return toString.call(val) === '[object File]';
}

/**
 * Determine if a value is a Blob
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if value is a Blob, otherwise false
 */
function isBlob(val) {
  return toString.call(val) === '[object Blob]';
}

/**
 * Determine if a value is a Function
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if value is a Function, otherwise false
 */
function isFunction(val) {
  return toString.call(val) === '[object Function]';
}

/**
 * Determine if a value is a Stream
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if value is a Stream, otherwise false
 */
function isStream(val) {
  return isObject(val) && isFunction(val.pipe);
}

/**
 * Determine if a value is a URLSearchParams object
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if value is a URLSearchParams object, otherwise false
 */
function isURLSearchParams(val) {
  return typeof URLSearchParams !== 'undefined' && val instanceof URLSearchParams;
}

/**
 * Trim excess whitespace off the beginning and end of a string
 *
 * @param {String} str The String to trim
 * @returns {String} The String freed of excess whitespace
 */
function trim(str) {
  return str.trim ? str.trim() : str.replace(/^\s+|\s+$/g, '');
}

/**
 * Determine if we're running in a standard browser environment
 *
 * This allows axios to run in a web worker, and react-native.
 * Both environments support XMLHttpRequest, but not fully standard globals.
 *
 * web workers:
 *  typeof window -> undefined
 *  typeof document -> undefined
 *
 * react-native:
 *  navigator.product -> 'ReactNative'
 * nativescript
 *  navigator.product -> 'NativeScript' or 'NS'
 */
function isStandardBrowserEnv() {
  if (typeof navigator !== 'undefined' && (navigator.product === 'ReactNative' ||
                                           navigator.product === 'NativeScript' ||
                                           navigator.product === 'NS')) {
    return false;
  }
  return (
    typeof window !== 'undefined' &&
    typeof document !== 'undefined'
  );
}

/**
 * Iterate over an Array or an Object invoking a function for each item.
 *
 * If `obj` is an Array callback will be called passing
 * the value, index, and complete array for each item.
 *
 * If 'obj' is an Object callback will be called passing
 * the value, key, and complete object for each property.
 *
 * @param {Object|Array} obj The object to iterate
 * @param {Function} fn The callback to invoke for each item
 */
function forEach(obj, fn) {
  // Don't bother if no value provided
  if (obj === null || typeof obj === 'undefined') {
    return;
  }

  // Force an array if not already something iterable
  if (typeof obj !== 'object') {
    /*eslint no-param-reassign:0*/
    obj = [obj];
  }

  if (isArray(obj)) {
    // Iterate over array values
    for (var i = 0, l = obj.length; i < l; i++) {
      fn.call(null, obj[i], i, obj);
    }
  } else {
    // Iterate over object keys
    for (var key in obj) {
      if (Object.prototype.hasOwnProperty.call(obj, key)) {
        fn.call(null, obj[key], key, obj);
      }
    }
  }
}

/**
 * Accepts varargs expecting each argument to be an object, then
 * immutably merges the properties of each object and returns result.
 *
 * When multiple objects contain the same key the later object in
 * the arguments list will take precedence.
 *
 * Example:
 *
 * ```js
 * var result = merge({foo: 123}, {foo: 456});
 * console.log(result.foo); // outputs 456
 * ```
 *
 * @param {Object} obj1 Object to merge
 * @returns {Object} Result of all merge properties
 */
function merge(/* obj1, obj2, obj3, ... */) {
  var result = {};
  function assignValue(val, key) {
    if (isPlainObject(result[key]) && isPlainObject(val)) {
      result[key] = merge(result[key], val);
    } else if (isPlainObject(val)) {
      result[key] = merge({}, val);
    } else if (isArray(val)) {
      result[key] = val.slice();
    } else {
      result[key] = val;
    }
  }

  for (var i = 0, l = arguments.length; i < l; i++) {
    forEach(arguments[i], assignValue);
  }
  return result;
}

/**
 * Extends object a by mutably adding to it the properties of object b.
 *
 * @param {Object} a The object to be extended
 * @param {Object} b The object to copy properties from
 * @param {Object} thisArg The object to bind function to
 * @return {Object} The resulting value of object a
 */
function extend(a, b, thisArg) {
  forEach(b, function assignValue(val, key) {
    if (thisArg && typeof val === 'function') {
      a[key] = bind(val, thisArg);
    } else {
      a[key] = val;
    }
  });
  return a;
}

/**
 * Remove byte order marker. This catches EF BB BF (the UTF-8 BOM)
 *
 * @param {string} content with BOM
 * @return {string} content value without BOM
 */
function stripBOM(content) {
  if (content.charCodeAt(0) === 0xFEFF) {
    content = content.slice(1);
  }
  return content;
}

module.exports = {
  isArray: isArray,
  isArrayBuffer: isArrayBuffer,
  isBuffer: isBuffer,
  isFormData: isFormData,
  isArrayBufferView: isArrayBufferView,
  isString: isString,
  isNumber: isNumber,
  isObject: isObject,
  isPlainObject: isPlainObject,
  isUndefined: isUndefined,
  isDate: isDate,
  isFile: isFile,
  isBlob: isBlob,
  isFunction: isFunction,
  isStream: isStream,
  isURLSearchParams: isURLSearchParams,
  isStandardBrowserEnv: isStandardBrowserEnv,
  forEach: forEach,
  merge: merge,
  extend: extend,
  trim: trim,
  stripBOM: stripBOM
};


/***/ }),

/***/ "./resources/js/react/StartEndPoll/StartEndPoll.js":
/*!*********************************************************!*\
  !*** ./resources/js/react/StartEndPoll/StartEndPoll.js ***!
  \*********************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "./node_modules/react/index.js");
/* harmony import */ var _shared_axios__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../../shared/axios */ "./resources/js/shared/axios.js");
/* harmony import */ var react_toastify__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! react-toastify */ "./node_modules/react-toastify/dist/react-toastify.esm.mjs");
/* harmony import */ var draft_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! draft-js */ "./node_modules/draft-js/lib/Draft.js");
/* harmony import */ var draft_js__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(draft_js__WEBPACK_IMPORTED_MODULE_3__);
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! react/jsx-runtime */ "./node_modules/react/jsx-runtime.js");
function _typeof(obj) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (obj) { return typeof obj; } : function (obj) { return obj && "function" == typeof Symbol && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }, _typeof(obj); }
function _regeneratorRuntime() { "use strict"; /*! regenerator-runtime -- Copyright (c) 2014-present, Facebook, Inc. -- license (MIT): https://github.com/facebook/regenerator/blob/main/LICENSE */ _regeneratorRuntime = function _regeneratorRuntime() { return exports; }; var exports = {}, Op = Object.prototype, hasOwn = Op.hasOwnProperty, defineProperty = Object.defineProperty || function (obj, key, desc) { obj[key] = desc.value; }, $Symbol = "function" == typeof Symbol ? Symbol : {}, iteratorSymbol = $Symbol.iterator || "@@iterator", asyncIteratorSymbol = $Symbol.asyncIterator || "@@asyncIterator", toStringTagSymbol = $Symbol.toStringTag || "@@toStringTag"; function define(obj, key, value) { return Object.defineProperty(obj, key, { value: value, enumerable: !0, configurable: !0, writable: !0 }), obj[key]; } try { define({}, ""); } catch (err) { define = function define(obj, key, value) { return obj[key] = value; }; } function wrap(innerFn, outerFn, self, tryLocsList) { var protoGenerator = outerFn && outerFn.prototype instanceof Generator ? outerFn : Generator, generator = Object.create(protoGenerator.prototype), context = new Context(tryLocsList || []); return defineProperty(generator, "_invoke", { value: makeInvokeMethod(innerFn, self, context) }), generator; } function tryCatch(fn, obj, arg) { try { return { type: "normal", arg: fn.call(obj, arg) }; } catch (err) { return { type: "throw", arg: err }; } } exports.wrap = wrap; var ContinueSentinel = {}; function Generator() {} function GeneratorFunction() {} function GeneratorFunctionPrototype() {} var IteratorPrototype = {}; define(IteratorPrototype, iteratorSymbol, function () { return this; }); var getProto = Object.getPrototypeOf, NativeIteratorPrototype = getProto && getProto(getProto(values([]))); NativeIteratorPrototype && NativeIteratorPrototype !== Op && hasOwn.call(NativeIteratorPrototype, iteratorSymbol) && (IteratorPrototype = NativeIteratorPrototype); var Gp = GeneratorFunctionPrototype.prototype = Generator.prototype = Object.create(IteratorPrototype); function defineIteratorMethods(prototype) { ["next", "throw", "return"].forEach(function (method) { define(prototype, method, function (arg) { return this._invoke(method, arg); }); }); } function AsyncIterator(generator, PromiseImpl) { function invoke(method, arg, resolve, reject) { var record = tryCatch(generator[method], generator, arg); if ("throw" !== record.type) { var result = record.arg, value = result.value; return value && "object" == _typeof(value) && hasOwn.call(value, "__await") ? PromiseImpl.resolve(value.__await).then(function (value) { invoke("next", value, resolve, reject); }, function (err) { invoke("throw", err, resolve, reject); }) : PromiseImpl.resolve(value).then(function (unwrapped) { result.value = unwrapped, resolve(result); }, function (error) { return invoke("throw", error, resolve, reject); }); } reject(record.arg); } var previousPromise; defineProperty(this, "_invoke", { value: function value(method, arg) { function callInvokeWithMethodAndArg() { return new PromiseImpl(function (resolve, reject) { invoke(method, arg, resolve, reject); }); } return previousPromise = previousPromise ? previousPromise.then(callInvokeWithMethodAndArg, callInvokeWithMethodAndArg) : callInvokeWithMethodAndArg(); } }); } function makeInvokeMethod(innerFn, self, context) { var state = "suspendedStart"; return function (method, arg) { if ("executing" === state) throw new Error("Generator is already running"); if ("completed" === state) { if ("throw" === method) throw arg; return { value: void 0, done: !0 }; } for (context.method = method, context.arg = arg;;) { var delegate = context.delegate; if (delegate) { var delegateResult = maybeInvokeDelegate(delegate, context); if (delegateResult) { if (delegateResult === ContinueSentinel) continue; return delegateResult; } } if ("next" === context.method) context.sent = context._sent = context.arg;else if ("throw" === context.method) { if ("suspendedStart" === state) throw state = "completed", context.arg; context.dispatchException(context.arg); } else "return" === context.method && context.abrupt("return", context.arg); state = "executing"; var record = tryCatch(innerFn, self, context); if ("normal" === record.type) { if (state = context.done ? "completed" : "suspendedYield", record.arg === ContinueSentinel) continue; return { value: record.arg, done: context.done }; } "throw" === record.type && (state = "completed", context.method = "throw", context.arg = record.arg); } }; } function maybeInvokeDelegate(delegate, context) { var methodName = context.method, method = delegate.iterator[methodName]; if (undefined === method) return context.delegate = null, "throw" === methodName && delegate.iterator["return"] && (context.method = "return", context.arg = undefined, maybeInvokeDelegate(delegate, context), "throw" === context.method) || "return" !== methodName && (context.method = "throw", context.arg = new TypeError("The iterator does not provide a '" + methodName + "' method")), ContinueSentinel; var record = tryCatch(method, delegate.iterator, context.arg); if ("throw" === record.type) return context.method = "throw", context.arg = record.arg, context.delegate = null, ContinueSentinel; var info = record.arg; return info ? info.done ? (context[delegate.resultName] = info.value, context.next = delegate.nextLoc, "return" !== context.method && (context.method = "next", context.arg = undefined), context.delegate = null, ContinueSentinel) : info : (context.method = "throw", context.arg = new TypeError("iterator result is not an object"), context.delegate = null, ContinueSentinel); } function pushTryEntry(locs) { var entry = { tryLoc: locs[0] }; 1 in locs && (entry.catchLoc = locs[1]), 2 in locs && (entry.finallyLoc = locs[2], entry.afterLoc = locs[3]), this.tryEntries.push(entry); } function resetTryEntry(entry) { var record = entry.completion || {}; record.type = "normal", delete record.arg, entry.completion = record; } function Context(tryLocsList) { this.tryEntries = [{ tryLoc: "root" }], tryLocsList.forEach(pushTryEntry, this), this.reset(!0); } function values(iterable) { if (iterable || "" === iterable) { var iteratorMethod = iterable[iteratorSymbol]; if (iteratorMethod) return iteratorMethod.call(iterable); if ("function" == typeof iterable.next) return iterable; if (!isNaN(iterable.length)) { var i = -1, next = function next() { for (; ++i < iterable.length;) if (hasOwn.call(iterable, i)) return next.value = iterable[i], next.done = !1, next; return next.value = undefined, next.done = !0, next; }; return next.next = next; } } throw new TypeError(_typeof(iterable) + " is not iterable"); } return GeneratorFunction.prototype = GeneratorFunctionPrototype, defineProperty(Gp, "constructor", { value: GeneratorFunctionPrototype, configurable: !0 }), defineProperty(GeneratorFunctionPrototype, "constructor", { value: GeneratorFunction, configurable: !0 }), GeneratorFunction.displayName = define(GeneratorFunctionPrototype, toStringTagSymbol, "GeneratorFunction"), exports.isGeneratorFunction = function (genFun) { var ctor = "function" == typeof genFun && genFun.constructor; return !!ctor && (ctor === GeneratorFunction || "GeneratorFunction" === (ctor.displayName || ctor.name)); }, exports.mark = function (genFun) { return Object.setPrototypeOf ? Object.setPrototypeOf(genFun, GeneratorFunctionPrototype) : (genFun.__proto__ = GeneratorFunctionPrototype, define(genFun, toStringTagSymbol, "GeneratorFunction")), genFun.prototype = Object.create(Gp), genFun; }, exports.awrap = function (arg) { return { __await: arg }; }, defineIteratorMethods(AsyncIterator.prototype), define(AsyncIterator.prototype, asyncIteratorSymbol, function () { return this; }), exports.AsyncIterator = AsyncIterator, exports.async = function (innerFn, outerFn, self, tryLocsList, PromiseImpl) { void 0 === PromiseImpl && (PromiseImpl = Promise); var iter = new AsyncIterator(wrap(innerFn, outerFn, self, tryLocsList), PromiseImpl); return exports.isGeneratorFunction(outerFn) ? iter : iter.next().then(function (result) { return result.done ? result.value : iter.next(); }); }, defineIteratorMethods(Gp), define(Gp, toStringTagSymbol, "Generator"), define(Gp, iteratorSymbol, function () { return this; }), define(Gp, "toString", function () { return "[object Generator]"; }), exports.keys = function (val) { var object = Object(val), keys = []; for (var key in object) keys.push(key); return keys.reverse(), function next() { for (; keys.length;) { var key = keys.pop(); if (key in object) return next.value = key, next.done = !1, next; } return next.done = !0, next; }; }, exports.values = values, Context.prototype = { constructor: Context, reset: function reset(skipTempReset) { if (this.prev = 0, this.next = 0, this.sent = this._sent = undefined, this.done = !1, this.delegate = null, this.method = "next", this.arg = undefined, this.tryEntries.forEach(resetTryEntry), !skipTempReset) for (var name in this) "t" === name.charAt(0) && hasOwn.call(this, name) && !isNaN(+name.slice(1)) && (this[name] = undefined); }, stop: function stop() { this.done = !0; var rootRecord = this.tryEntries[0].completion; if ("throw" === rootRecord.type) throw rootRecord.arg; return this.rval; }, dispatchException: function dispatchException(exception) { if (this.done) throw exception; var context = this; function handle(loc, caught) { return record.type = "throw", record.arg = exception, context.next = loc, caught && (context.method = "next", context.arg = undefined), !!caught; } for (var i = this.tryEntries.length - 1; i >= 0; --i) { var entry = this.tryEntries[i], record = entry.completion; if ("root" === entry.tryLoc) return handle("end"); if (entry.tryLoc <= this.prev) { var hasCatch = hasOwn.call(entry, "catchLoc"), hasFinally = hasOwn.call(entry, "finallyLoc"); if (hasCatch && hasFinally) { if (this.prev < entry.catchLoc) return handle(entry.catchLoc, !0); if (this.prev < entry.finallyLoc) return handle(entry.finallyLoc); } else if (hasCatch) { if (this.prev < entry.catchLoc) return handle(entry.catchLoc, !0); } else { if (!hasFinally) throw new Error("try statement without catch or finally"); if (this.prev < entry.finallyLoc) return handle(entry.finallyLoc); } } } }, abrupt: function abrupt(type, arg) { for (var i = this.tryEntries.length - 1; i >= 0; --i) { var entry = this.tryEntries[i]; if (entry.tryLoc <= this.prev && hasOwn.call(entry, "finallyLoc") && this.prev < entry.finallyLoc) { var finallyEntry = entry; break; } } finallyEntry && ("break" === type || "continue" === type) && finallyEntry.tryLoc <= arg && arg <= finallyEntry.finallyLoc && (finallyEntry = null); var record = finallyEntry ? finallyEntry.completion : {}; return record.type = type, record.arg = arg, finallyEntry ? (this.method = "next", this.next = finallyEntry.finallyLoc, ContinueSentinel) : this.complete(record); }, complete: function complete(record, afterLoc) { if ("throw" === record.type) throw record.arg; return "break" === record.type || "continue" === record.type ? this.next = record.arg : "return" === record.type ? (this.rval = this.arg = record.arg, this.method = "return", this.next = "end") : "normal" === record.type && afterLoc && (this.next = afterLoc), ContinueSentinel; }, finish: function finish(finallyLoc) { for (var i = this.tryEntries.length - 1; i >= 0; --i) { var entry = this.tryEntries[i]; if (entry.finallyLoc === finallyLoc) return this.complete(entry.completion, entry.afterLoc), resetTryEntry(entry), ContinueSentinel; } }, "catch": function _catch(tryLoc) { for (var i = this.tryEntries.length - 1; i >= 0; --i) { var entry = this.tryEntries[i]; if (entry.tryLoc === tryLoc) { var record = entry.completion; if ("throw" === record.type) { var thrown = record.arg; resetTryEntry(entry); } return thrown; } } throw new Error("illegal catch attempt"); }, delegateYield: function delegateYield(iterable, resultName, nextLoc) { return this.delegate = { iterator: values(iterable), resultName: resultName, nextLoc: nextLoc }, "next" === this.method && (this.arg = undefined), ContinueSentinel; } }, exports; }
function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }
function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }
function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, _toPropertyKey(descriptor.key), descriptor); } }
function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); Object.defineProperty(Constructor, "prototype", { writable: false }); return Constructor; }
function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); Object.defineProperty(subClass, "prototype", { writable: false }); if (superClass) _setPrototypeOf(subClass, superClass); }
function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf ? Object.setPrototypeOf.bind() : function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }
function _createSuper(Derived) { var hasNativeReflectConstruct = _isNativeReflectConstruct(); return function _createSuperInternal() { var Super = _getPrototypeOf(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = _getPrototypeOf(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return _possibleConstructorReturn(this, result); }; }
function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } else if (call !== void 0) { throw new TypeError("Derived constructors may only return object or undefined"); } return _assertThisInitialized(self); }
function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }
function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {})); return true; } catch (e) { return false; } }
function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf.bind() : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }
function _defineProperty(obj, key, value) { key = _toPropertyKey(key); if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }
function _toPropertyKey(arg) { var key = _toPrimitive(arg, "string"); return _typeof(key) === "symbol" ? key : String(key); }
function _toPrimitive(input, hint) { if (_typeof(input) !== "object" || input === null) return input; var prim = input[Symbol.toPrimitive]; if (prim !== undefined) { var res = prim.call(input, hint || "default"); if (_typeof(res) !== "object") return res; throw new TypeError("@@toPrimitive must return a primitive value."); } return (hint === "string" ? String : Number)(input); }






var _ref = window.TSN || {},
  poll_full = _ref.poll_full;
var StartEndPoll = /*#__PURE__*/function (_React$Component) {
  _inherits(StartEndPoll, _React$Component);
  var _super = _createSuper(StartEndPoll);
  function StartEndPoll(props) {
    var _poll_full$start;
    var _this;
    _classCallCheck(this, StartEndPoll);
    _this = _super.call(this, props);
    _defineProperty(_assertThisInitialized(_this), "handleStart", function (e) {
      var strVar = _this.state.startVariable.map(function (strVar) {
        if (strVar.num = e.target.value) {
          return strVar;
        }
      });
      document.getElementById('StartButton').innerText = strVar.title + strVar.dateStamp;
    });
    _this.state = {
      startVariable: [{
        num: 1,
        title: 'Запланировать начало',
        dateStamp: null
      }, {
        num: 2,
        title: 'Установить дату начала (изменить/удалить дату начала)',
        dateStamp: (_poll_full$start = poll_full.start) !== null && _poll_full$start !== void 0 ? _poll_full$start : Date.now()
      }]
    };
    _this.handleStart = _this.handleStart.bind(_assertThisInitialized(_this));
    return _this;
  }
  _createClass(StartEndPoll, [{
    key: "togglePollStartState",
    value: function () {
      var _togglePollStartState = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee(e) {
        return _regeneratorRuntime().wrap(function _callee$(_context) {
          while (1) switch (_context.prev = _context.next) {
            case 0:
              e.preventDefault();
              _context.prev = 1;
              _context.next = 4;
              return _shared_axios__WEBPACK_IMPORTED_MODULE_1__.client.post("/polls/".concat(poll_full.id, "/start"));
            case 4:
              react_toastify__WEBPACK_IMPORTED_MODULE_2__.toast.success('Статус голосования успешно изменён.');
              window.location.reload();
              _context.next = 11;
              break;
            case 8:
              _context.prev = 8;
              _context.t0 = _context["catch"](1);
              react_toastify__WEBPACK_IMPORTED_MODULE_2__.toast.error('Ошибка изменения статуса голосования.');
            case 11:
            case "end":
              return _context.stop();
          }
        }, _callee, null, [[1, 8]]);
      }));
      function togglePollStartState(_x) {
        return _togglePollStartState.apply(this, arguments);
      }
      return togglePollStartState;
    }()
  }, {
    key: "togglePollEndState",
    value: function () {
      var _togglePollEndState = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee2(e) {
        return _regeneratorRuntime().wrap(function _callee2$(_context2) {
          while (1) switch (_context2.prev = _context2.next) {
            case 0:
              e.preventDefault();
              _context2.prev = 1;
              _context2.next = 4;
              return _shared_axios__WEBPACK_IMPORTED_MODULE_1__.client.post("/polls/".concat(poll_full.id, "/end"));
            case 4:
              react_toastify__WEBPACK_IMPORTED_MODULE_2__.toast.success('Статус голосования успешно изменён.');
              window.location.reload();
              _context2.next = 11;
              break;
            case 8:
              _context2.prev = 8;
              _context2.t0 = _context2["catch"](1);
              react_toastify__WEBPACK_IMPORTED_MODULE_2__.toast.error('Ошибка изменения статуса голосования.');
            case 11:
            case "end":
              return _context2.stop();
          }
        }, _callee2, null, [[1, 8]]);
      }));
      function togglePollEndState(_x2) {
        return _togglePollEndState.apply(this, arguments);
      }
      return togglePollEndState;
    }()
  }, {
    key: "render",
    value: function render() {
      var _poll_full$start2, _poll_full$finished;
      //console.log(poll);
      return /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsxs)("div", {
        className: "px-1 py-4 sm:px-6 ",
        children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsx)("label", {
          className: "px-1 py-4 block text-xl text-black font-semibold text-wrap",
          children: "\u041D\u0430\u0447\u0430\u043B\u043E \u0438 \u043E\u043A\u043E\u043D\u0447\u0430\u043D\u0438\u0435"
        }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsxs)("div", {
          className: "flex flex-row px-4",
          children: ["\u0422\u0435\u043A\u0443\u0449\u0438\u0439 \u0441\u0442\u0430\u0442\u0443\u0441:\xA0", poll_full.start && poll_full.finished && /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsxs)("b", {
            children: [" \u0437\u0430\u043A\u043E\u043D\u0447\u0435\u043D\u043E \u0432 ", "".concat(poll_full.finished), " "]
          }), poll_full.start && !poll_full.finished && /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsxs)("b", {
            children: [" \u043D\u0430\u0447\u0430\u0442\u043E \u0432 ", "".concat(poll_full.start), " "]
          }), !poll_full.start && !poll_full.finished && /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsx)("b", {
            children: " \u043D\u0435 \u043D\u0430\u0447\u0430\u0442\u043E "
          })]
        }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsxs)("div", {
          className: "flex flex-row px-4",
          children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsx)("div", {
            children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsx)("select", {
              name: "start_poll",
              className: "mt-1 block py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm",
              required: true,
              onChange: this.handleStart,
              children: this.state.startVariable.map(function (strVar, key) {
                return /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsx)("option", {
                  value: strVar.num,
                  children: strVar.title
                }, key);
              })
            })
          }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsx)("div", {
            children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsx)("input", {
              type: "datetime-local",
              defaultValue: (_poll_full$start2 = poll_full.start) !== null && _poll_full$start2 !== void 0 ? _poll_full$start2 : Date.now()
            })
          }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsx)("div", {
            children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsx)("button", {
              type: "button",
              id: "StartButton",
              className: "justify-end py-2 px-4 border border-transparent text-sm font-medium text-white shadow-sm rounded-md bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500",
              onClick: this.togglePollStartState,
              children: "\u0423\u0441\u0442\u0430\u043D\u043E\u0432\u0438\u0442\u044C"
            })
          })]
        }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsxs)("div", {
          className: "flex flex-row px-4",
          children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsx)("div", {
            children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsxs)("select", {
              name: "end_poll",
              className: "mt-1 block py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm",
              required: true,
              children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsx)("option", {
                value: "\u0417\u0430\u043F\u043B\u0430\u043D\u0438\u0440\u043E\u0432\u0430\u0442\u044C \u043E\u043A\u043E\u043D\u0447\u0430\u043D\u0438\u0435",
                defaultValue: true,
                children: "\u0417\u0430\u043F\u043B\u0430\u043D\u0438\u0440\u043E\u0432\u0430\u0442\u044C \u043E\u043A\u043E\u043D\u0447\u0430\u043D\u0438\u0435"
              }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsx)("option", {
                value: "\u0423\u0441\u0442\u0430\u0432\u043D\u043E\u0438\u0442\u044C \u0434\u0430\u0442\u0443 \u043E\u043A\u043E\u043D\u0447\u0430\u043D\u0438\u044F (\u0438\u0437\u043C\u0435\u043D\u0438\u0442\u044C/\u0443\u0434\u0430\u043B\u0438\u0442\u044C \u0434\u0430\u0442\u0443 \u043E\u043A\u043E\u043D\u0447\u0430\u043D\u0438\u044F)",
                children: "\u0423\u0441\u0442\u0430\u0432\u043D\u043E\u0438\u0442\u044C \u0434\u0430\u0442\u0443 \u043E\u043A\u043E\u043D\u0447\u0430\u043D\u0438\u044F (\u0438\u0437\u043C\u0435\u043D\u0438\u0442\u044C/\u0443\u0434\u0430\u043B\u0438\u0442\u044C \u0434\u0430\u0442\u0443 \u043E\u043A\u043E\u043D\u0447\u0430\u043D\u0438\u044F)"
              })]
            })
          }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsx)("div", {
            children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsx)("input", {
              type: "datetime-local",
              defaultValue: (_poll_full$finished = poll_full.finished) !== null && _poll_full$finished !== void 0 ? _poll_full$finished : Date.now()
            })
          }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsx)("div", {
            children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsx)("button", {
              type: "button",
              className: "justify-end py-2 px-4 border border-transparent text-sm font-medium text-white shadow-sm rounded-md bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500",
              onClick: this.togglePollEndState,
              children: "\u0423\u0441\u0442\u0430\u043D\u043E\u0432\u0438\u0442\u044C"
            })
          })]
        })]
      });
    }
  }]);
  return StartEndPoll;
}(react__WEBPACK_IMPORTED_MODULE_0__.Component);
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (StartEndPoll);

/***/ }),

/***/ "./resources/js/react/StartEndPoll/index.js":
/*!**************************************************!*\
  !*** ./resources/js/react/StartEndPoll/index.js ***!
  \**************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "./node_modules/react/index.js");
/* harmony import */ var react_dom__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! react-dom */ "./node_modules/react-dom/index.js");
/* harmony import */ var react_toastify__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! react-toastify */ "./node_modules/react-toastify/dist/react-toastify.esm.mjs");
/* harmony import */ var react_toastify_dist_ReactToastify_css__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! react-toastify/dist/ReactToastify.css */ "./node_modules/react-toastify/dist/ReactToastify.css");
/* harmony import */ var _StartEndPoll__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./StartEndPoll */ "./resources/js/react/StartEndPoll/StartEndPoll.js");
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! react/jsx-runtime */ "./node_modules/react/jsx-runtime.js");








var App = function App() {
  return /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5__.jsxs)(react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5__.Fragment, {
    children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5__.jsx)(_StartEndPoll__WEBPACK_IMPORTED_MODULE_4__["default"], {}), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5__.jsx)(react_toastify__WEBPACK_IMPORTED_MODULE_2__.ToastContainer, {})]
  });
};
react_dom__WEBPACK_IMPORTED_MODULE_1__.render( /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5__.jsx)(App, {}), document.getElementById('StartEndPoll'));

/***/ }),

/***/ "./resources/js/shared/axios.js":
/*!**************************************!*\
  !*** ./resources/js/shared/axios.js ***!
  \**************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   client: () => (/* binding */ client)
/* harmony export */ });
/* harmony import */ var axios__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! axios */ "./node_modules/axios/index.js");
/* harmony import */ var axios__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(axios__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _helpers__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./helpers */ "./resources/js/shared/helpers.js");


(axios__WEBPACK_IMPORTED_MODULE_0___default().defaults).headers.common['X-Requested-With'] = 'XMLHttpRequest';
(axios__WEBPACK_IMPORTED_MODULE_0___default().defaults).headers.common['Accept'] = 'application/json';
if (_helpers__WEBPACK_IMPORTED_MODULE_1__.csrfToken) {
  (axios__WEBPACK_IMPORTED_MODULE_0___default().defaults).headers.common['X-CSRF-TOKEN'] = _helpers__WEBPACK_IMPORTED_MODULE_1__.csrfToken.content;
} else {
  console.error('CSRF token not found: https://laravel.com/docs/csrf#csrf-x-csrf-token');
}
var statusCodesTriggeringRedirectToLogin = [401];
var statusCodesTriggeringPageReload = [419];

// Add a response interceptor
axios__WEBPACK_IMPORTED_MODULE_0___default().interceptors.response.use(function (response) {
  // Any status code that lie within the range of 2xx cause this function to trigger
  // Do something with response data

  var errorMessage = response.data.errorMessage;
  if (errorMessage) {
    return Promise.reject(errorMessage);
  }
  return response;
}, function (error) {
  // Any status codes that falls outside the range of 2xx cause this function to trigger
  // Do something with response error

  if (typeof error.response !== 'undefined' && error.response.status === 422) {
    var _error$response$data = error.response.data,
      message = _error$response$data.message,
      errors = _error$response$data.errors;
    var details = Object.keys(errors).map(function (key) {
      return errors[key].join(' ');
    });
    var finalMessage = message;
    if (details.length) {
      finalMessage += " ".concat(details.join(' '));
    }
    return Promise.reject(finalMessage);
  }
  if (typeof error.response !== 'undefined' && statusCodesTriggeringRedirectToLogin.includes(error.response.status)) {
    window.location = '/login';
  }
  if (typeof error.response !== 'undefined' && statusCodesTriggeringPageReload.includes(error.response.status)) {
    window.location.reload();
  }
  return Promise.reject(error);
});
var client = (axios__WEBPACK_IMPORTED_MODULE_0___default());

/***/ }),

/***/ "./resources/js/shared/helpers.js":
/*!****************************************!*\
  !*** ./resources/js/shared/helpers.js ***!
  \****************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   csrfToken: () => (/* binding */ csrfToken),
/* harmony export */   isJson: () => (/* binding */ isJson),
/* harmony export */   toBase64: () => (/* binding */ toBase64),
/* harmony export */   truncateText: () => (/* binding */ truncateText)
/* harmony export */ });
var csrfToken = document.querySelector('meta[name="csrf-token"]');
var truncateText = function truncateText(text) {
  var symbolsNumber = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 25;
  if (text.length <= symbolsNumber) {
    return text;
  }
  return text.substring(0, symbolsNumber - 3).concat('...');
};
var isJson = function isJson(str) {
  try {
    JSON.parse(str);
  } catch (e) {
    return false;
  }
  return true;
};
var toBase64 = function toBase64(file) {
  return new Promise(function (resolve, reject) {
    var reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = function () {
      return resolve(reader.result);
    };
    reader.onerror = reject;
  });
};

/***/ }),

/***/ "./node_modules/css-loader/dist/cjs.js??ruleSet[1].rules[7].oneOf[1].use[1]!./node_modules/postcss-loader/dist/cjs.js??ruleSet[1].rules[7].oneOf[1].use[2]!./node_modules/react-toastify/dist/ReactToastify.css":
/*!**********************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/css-loader/dist/cjs.js??ruleSet[1].rules[7].oneOf[1].use[1]!./node_modules/postcss-loader/dist/cjs.js??ruleSet[1].rules[7].oneOf[1].use[2]!./node_modules/react-toastify/dist/ReactToastify.css ***!
  \**********************************************************************************************************************************************************************************************************************/
/***/ ((module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../css-loader/dist/runtime/api.js */ "./node_modules/css-loader/dist/runtime/api.js");
/* harmony import */ var _css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_0__);
// Imports

var ___CSS_LOADER_EXPORT___ = _css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_0___default()(function(i){return i[1]});
// Module
___CSS_LOADER_EXPORT___.push([module.id, ":root {\n  --toastify-color-light: #fff;\n  --toastify-color-dark: #121212;\n  --toastify-color-info: #3498db;\n  --toastify-color-success: #07bc0c;\n  --toastify-color-warning: #f1c40f;\n  --toastify-color-error: #e74c3c;\n  --toastify-color-transparent: rgba(255, 255, 255, 0.7);\n  --toastify-icon-color-info: var(--toastify-color-info);\n  --toastify-icon-color-success: var(--toastify-color-success);\n  --toastify-icon-color-warning: var(--toastify-color-warning);\n  --toastify-icon-color-error: var(--toastify-color-error);\n  --toastify-toast-width: 320px;\n  --toastify-toast-background: #fff;\n  --toastify-toast-min-height: 64px;\n  --toastify-toast-max-height: 800px;\n  --toastify-font-family: sans-serif;\n  --toastify-z-index: 9999;\n  --toastify-text-color-light: #757575;\n  --toastify-text-color-dark: #fff;\n  --toastify-text-color-info: #fff;\n  --toastify-text-color-success: #fff;\n  --toastify-text-color-warning: #fff;\n  --toastify-text-color-error: #fff;\n  --toastify-spinner-color: #616161;\n  --toastify-spinner-color-empty-area: #e0e0e0;\n  --toastify-color-progress-light: linear-gradient(\n    to right,\n    #4cd964,\n    #5ac8fa,\n    #007aff,\n    #34aadc,\n    #5856d6,\n    #ff2d55\n  );\n  --toastify-color-progress-dark: #bb86fc;\n  --toastify-color-progress-info: var(--toastify-color-info);\n  --toastify-color-progress-success: var(--toastify-color-success);\n  --toastify-color-progress-warning: var(--toastify-color-warning);\n  --toastify-color-progress-error: var(--toastify-color-error);\n}\n\n.Toastify__toast-container {\n  z-index: var(--toastify-z-index);\n  -webkit-transform: translate3d(0, 0, var(--toastify-z-index));\n  position: fixed;\n  padding: 4px;\n  width: var(--toastify-toast-width);\n  box-sizing: border-box;\n  color: #fff;\n}\n\n.Toastify__toast-container--top-left {\n  top: 1em;\n  left: 1em;\n}\n\n.Toastify__toast-container--top-center {\n  top: 1em;\n  left: 50%;\n  transform: translateX(-50%);\n}\n\n.Toastify__toast-container--top-right {\n  top: 1em;\n  right: 1em;\n}\n\n.Toastify__toast-container--bottom-left {\n  bottom: 1em;\n  left: 1em;\n}\n\n.Toastify__toast-container--bottom-center {\n  bottom: 1em;\n  left: 50%;\n  transform: translateX(-50%);\n}\n\n.Toastify__toast-container--bottom-right {\n  bottom: 1em;\n  right: 1em;\n}\n\n@media only screen and (max-width : 480px) {\n  .Toastify__toast-container {\n    width: 100vw;\n    padding: 0;\n    left: 0;\n    margin: 0;\n  }\n  .Toastify__toast-container--top-left, .Toastify__toast-container--top-center, .Toastify__toast-container--top-right {\n    top: 0;\n    transform: translateX(0);\n  }\n  .Toastify__toast-container--bottom-left, .Toastify__toast-container--bottom-center, .Toastify__toast-container--bottom-right {\n    bottom: 0;\n    transform: translateX(0);\n  }\n  .Toastify__toast-container--rtl {\n    right: 0;\n    left: initial;\n  }\n}\n\n.Toastify__toast {\n  position: relative;\n  min-height: var(--toastify-toast-min-height);\n  box-sizing: border-box;\n  margin-bottom: 1rem;\n  padding: 8px;\n  border-radius: 4px;\n  box-shadow: 0 1px 10px 0 rgba(0, 0, 0, 0.1), 0 2px 15px 0 rgba(0, 0, 0, 0.05);\n  display: flex;\n  justify-content: space-between;\n  max-height: var(--toastify-toast-max-height);\n  overflow: hidden;\n  font-family: var(--toastify-font-family);\n  cursor: default;\n  direction: ltr;\n  /* webkit only issue #791 */\n  z-index: 0;\n}\n\n.Toastify__toast--rtl {\n  direction: rtl;\n}\n\n.Toastify__toast--close-on-click {\n  cursor: pointer;\n}\n\n.Toastify__toast-body {\n  margin: auto 0;\n  flex: 1 1 auto;\n  padding: 6px;\n  display: flex;\n  align-items: center;\n}\n\n.Toastify__toast-body > div:last-child {\n  word-break: break-word;\n  flex: 1;\n}\n\n.Toastify__toast-icon {\n  margin-inline-end: 10px;\n  width: 20px;\n  flex-shrink: 0;\n  display: flex;\n}\n\n.Toastify--animate {\n  animation-fill-mode: both;\n  animation-duration: 0.7s;\n}\n\n.Toastify--animate-icon {\n  animation-fill-mode: both;\n  animation-duration: 0.3s;\n}\n\n@media only screen and (max-width : 480px) {\n  .Toastify__toast {\n    margin-bottom: 0;\n    border-radius: 0;\n  }\n}\n\n.Toastify__toast-theme--dark {\n  background: var(--toastify-color-dark);\n  color: var(--toastify-text-color-dark);\n}\n\n.Toastify__toast-theme--light {\n  background: var(--toastify-color-light);\n  color: var(--toastify-text-color-light);\n}\n\n.Toastify__toast-theme--colored.Toastify__toast--default {\n  background: var(--toastify-color-light);\n  color: var(--toastify-text-color-light);\n}\n\n.Toastify__toast-theme--colored.Toastify__toast--info {\n  color: var(--toastify-text-color-info);\n  background: var(--toastify-color-info);\n}\n\n.Toastify__toast-theme--colored.Toastify__toast--success {\n  color: var(--toastify-text-color-success);\n  background: var(--toastify-color-success);\n}\n\n.Toastify__toast-theme--colored.Toastify__toast--warning {\n  color: var(--toastify-text-color-warning);\n  background: var(--toastify-color-warning);\n}\n\n.Toastify__toast-theme--colored.Toastify__toast--error {\n  color: var(--toastify-text-color-error);\n  background: var(--toastify-color-error);\n}\n\n.Toastify__progress-bar-theme--light {\n  background: var(--toastify-color-progress-light);\n}\n\n.Toastify__progress-bar-theme--dark {\n  background: var(--toastify-color-progress-dark);\n}\n\n.Toastify__progress-bar--info {\n  background: var(--toastify-color-progress-info);\n}\n\n.Toastify__progress-bar--success {\n  background: var(--toastify-color-progress-success);\n}\n\n.Toastify__progress-bar--warning {\n  background: var(--toastify-color-progress-warning);\n}\n\n.Toastify__progress-bar--error {\n  background: var(--toastify-color-progress-error);\n}\n\n.Toastify__progress-bar-theme--colored.Toastify__progress-bar--info, .Toastify__progress-bar-theme--colored.Toastify__progress-bar--success, .Toastify__progress-bar-theme--colored.Toastify__progress-bar--warning, .Toastify__progress-bar-theme--colored.Toastify__progress-bar--error {\n  background: var(--toastify-color-transparent);\n}\n\n.Toastify__close-button {\n  color: #fff;\n  background: transparent;\n  outline: none;\n  border: none;\n  padding: 0;\n  cursor: pointer;\n  opacity: 0.7;\n  transition: 0.3s ease;\n  align-self: flex-start;\n}\n\n.Toastify__close-button--light {\n  color: #000;\n  opacity: 0.3;\n}\n\n.Toastify__close-button > svg {\n  fill: currentColor;\n  height: 16px;\n  width: 14px;\n}\n\n.Toastify__close-button:hover, .Toastify__close-button:focus {\n  opacity: 1;\n}\n\n@keyframes Toastify__trackProgress {\n  0% {\n    transform: scaleX(1);\n  }\n  100% {\n    transform: scaleX(0);\n  }\n}\n\n.Toastify__progress-bar {\n  position: absolute;\n  bottom: 0;\n  left: 0;\n  width: 100%;\n  height: 5px;\n  z-index: var(--toastify-z-index);\n  opacity: 0.7;\n  transform-origin: left;\n}\n\n.Toastify__progress-bar--animated {\n  animation: Toastify__trackProgress linear 1 forwards;\n}\n\n.Toastify__progress-bar--controlled {\n  transition: transform 0.2s;\n}\n\n.Toastify__progress-bar--rtl {\n  right: 0;\n  left: initial;\n  transform-origin: right;\n}\n\n.Toastify__spinner {\n  width: 20px;\n  height: 20px;\n  box-sizing: border-box;\n  border: 2px solid;\n  border-radius: 100%;\n  border-color: var(--toastify-spinner-color-empty-area);\n  border-right-color: var(--toastify-spinner-color);\n  animation: Toastify__spin 0.65s linear infinite;\n}\n\n@keyframes Toastify__bounceInRight {\n  from, 60%, 75%, 90%, to {\n    animation-timing-function: cubic-bezier(0.215, 0.61, 0.355, 1);\n  }\n  from {\n    opacity: 0;\n    transform: translate3d(3000px, 0, 0);\n  }\n  60% {\n    opacity: 1;\n    transform: translate3d(-25px, 0, 0);\n  }\n  75% {\n    transform: translate3d(10px, 0, 0);\n  }\n  90% {\n    transform: translate3d(-5px, 0, 0);\n  }\n  to {\n    transform: none;\n  }\n}\n\n@keyframes Toastify__bounceOutRight {\n  20% {\n    opacity: 1;\n    transform: translate3d(-20px, 0, 0);\n  }\n  to {\n    opacity: 0;\n    transform: translate3d(2000px, 0, 0);\n  }\n}\n\n@keyframes Toastify__bounceInLeft {\n  from, 60%, 75%, 90%, to {\n    animation-timing-function: cubic-bezier(0.215, 0.61, 0.355, 1);\n  }\n  0% {\n    opacity: 0;\n    transform: translate3d(-3000px, 0, 0);\n  }\n  60% {\n    opacity: 1;\n    transform: translate3d(25px, 0, 0);\n  }\n  75% {\n    transform: translate3d(-10px, 0, 0);\n  }\n  90% {\n    transform: translate3d(5px, 0, 0);\n  }\n  to {\n    transform: none;\n  }\n}\n\n@keyframes Toastify__bounceOutLeft {\n  20% {\n    opacity: 1;\n    transform: translate3d(20px, 0, 0);\n  }\n  to {\n    opacity: 0;\n    transform: translate3d(-2000px, 0, 0);\n  }\n}\n\n@keyframes Toastify__bounceInUp {\n  from, 60%, 75%, 90%, to {\n    animation-timing-function: cubic-bezier(0.215, 0.61, 0.355, 1);\n  }\n  from {\n    opacity: 0;\n    transform: translate3d(0, 3000px, 0);\n  }\n  60% {\n    opacity: 1;\n    transform: translate3d(0, -20px, 0);\n  }\n  75% {\n    transform: translate3d(0, 10px, 0);\n  }\n  90% {\n    transform: translate3d(0, -5px, 0);\n  }\n  to {\n    transform: translate3d(0, 0, 0);\n  }\n}\n\n@keyframes Toastify__bounceOutUp {\n  20% {\n    transform: translate3d(0, -10px, 0);\n  }\n  40%, 45% {\n    opacity: 1;\n    transform: translate3d(0, 20px, 0);\n  }\n  to {\n    opacity: 0;\n    transform: translate3d(0, -2000px, 0);\n  }\n}\n\n@keyframes Toastify__bounceInDown {\n  from, 60%, 75%, 90%, to {\n    animation-timing-function: cubic-bezier(0.215, 0.61, 0.355, 1);\n  }\n  0% {\n    opacity: 0;\n    transform: translate3d(0, -3000px, 0);\n  }\n  60% {\n    opacity: 1;\n    transform: translate3d(0, 25px, 0);\n  }\n  75% {\n    transform: translate3d(0, -10px, 0);\n  }\n  90% {\n    transform: translate3d(0, 5px, 0);\n  }\n  to {\n    transform: none;\n  }\n}\n\n@keyframes Toastify__bounceOutDown {\n  20% {\n    transform: translate3d(0, 10px, 0);\n  }\n  40%, 45% {\n    opacity: 1;\n    transform: translate3d(0, -20px, 0);\n  }\n  to {\n    opacity: 0;\n    transform: translate3d(0, 2000px, 0);\n  }\n}\n\n.Toastify__bounce-enter--top-left, .Toastify__bounce-enter--bottom-left {\n  animation-name: Toastify__bounceInLeft;\n}\n\n.Toastify__bounce-enter--top-right, .Toastify__bounce-enter--bottom-right {\n  animation-name: Toastify__bounceInRight;\n}\n\n.Toastify__bounce-enter--top-center {\n  animation-name: Toastify__bounceInDown;\n}\n\n.Toastify__bounce-enter--bottom-center {\n  animation-name: Toastify__bounceInUp;\n}\n\n.Toastify__bounce-exit--top-left, .Toastify__bounce-exit--bottom-left {\n  animation-name: Toastify__bounceOutLeft;\n}\n\n.Toastify__bounce-exit--top-right, .Toastify__bounce-exit--bottom-right {\n  animation-name: Toastify__bounceOutRight;\n}\n\n.Toastify__bounce-exit--top-center {\n  animation-name: Toastify__bounceOutUp;\n}\n\n.Toastify__bounce-exit--bottom-center {\n  animation-name: Toastify__bounceOutDown;\n}\n\n@keyframes Toastify__zoomIn {\n  from {\n    opacity: 0;\n    transform: scale3d(0.3, 0.3, 0.3);\n  }\n  50% {\n    opacity: 1;\n  }\n}\n\n@keyframes Toastify__zoomOut {\n  from {\n    opacity: 1;\n  }\n  50% {\n    opacity: 0;\n    transform: scale3d(0.3, 0.3, 0.3);\n  }\n  to {\n    opacity: 0;\n  }\n}\n\n.Toastify__zoom-enter {\n  animation-name: Toastify__zoomIn;\n}\n\n.Toastify__zoom-exit {\n  animation-name: Toastify__zoomOut;\n}\n\n@keyframes Toastify__flipIn {\n  from {\n    transform: perspective(400px) rotate3d(1, 0, 0, 90deg);\n    animation-timing-function: ease-in;\n    opacity: 0;\n  }\n  40% {\n    transform: perspective(400px) rotate3d(1, 0, 0, -20deg);\n    animation-timing-function: ease-in;\n  }\n  60% {\n    transform: perspective(400px) rotate3d(1, 0, 0, 10deg);\n    opacity: 1;\n  }\n  80% {\n    transform: perspective(400px) rotate3d(1, 0, 0, -5deg);\n  }\n  to {\n    transform: perspective(400px);\n  }\n}\n\n@keyframes Toastify__flipOut {\n  from {\n    transform: perspective(400px);\n  }\n  30% {\n    transform: perspective(400px) rotate3d(1, 0, 0, -20deg);\n    opacity: 1;\n  }\n  to {\n    transform: perspective(400px) rotate3d(1, 0, 0, 90deg);\n    opacity: 0;\n  }\n}\n\n.Toastify__flip-enter {\n  animation-name: Toastify__flipIn;\n}\n\n.Toastify__flip-exit {\n  animation-name: Toastify__flipOut;\n}\n\n@keyframes Toastify__slideInRight {\n  from {\n    transform: translate3d(110%, 0, 0);\n    visibility: visible;\n  }\n  to {\n    transform: translate3d(0, 0, 0);\n  }\n}\n\n@keyframes Toastify__slideInLeft {\n  from {\n    transform: translate3d(-110%, 0, 0);\n    visibility: visible;\n  }\n  to {\n    transform: translate3d(0, 0, 0);\n  }\n}\n\n@keyframes Toastify__slideInUp {\n  from {\n    transform: translate3d(0, 110%, 0);\n    visibility: visible;\n  }\n  to {\n    transform: translate3d(0, 0, 0);\n  }\n}\n\n@keyframes Toastify__slideInDown {\n  from {\n    transform: translate3d(0, -110%, 0);\n    visibility: visible;\n  }\n  to {\n    transform: translate3d(0, 0, 0);\n  }\n}\n\n@keyframes Toastify__slideOutRight {\n  from {\n    transform: translate3d(0, 0, 0);\n  }\n  to {\n    visibility: hidden;\n    transform: translate3d(110%, 0, 0);\n  }\n}\n\n@keyframes Toastify__slideOutLeft {\n  from {\n    transform: translate3d(0, 0, 0);\n  }\n  to {\n    visibility: hidden;\n    transform: translate3d(-110%, 0, 0);\n  }\n}\n\n@keyframes Toastify__slideOutDown {\n  from {\n    transform: translate3d(0, 0, 0);\n  }\n  to {\n    visibility: hidden;\n    transform: translate3d(0, 500px, 0);\n  }\n}\n\n@keyframes Toastify__slideOutUp {\n  from {\n    transform: translate3d(0, 0, 0);\n  }\n  to {\n    visibility: hidden;\n    transform: translate3d(0, -500px, 0);\n  }\n}\n\n.Toastify__slide-enter--top-left, .Toastify__slide-enter--bottom-left {\n  animation-name: Toastify__slideInLeft;\n}\n\n.Toastify__slide-enter--top-right, .Toastify__slide-enter--bottom-right {\n  animation-name: Toastify__slideInRight;\n}\n\n.Toastify__slide-enter--top-center {\n  animation-name: Toastify__slideInDown;\n}\n\n.Toastify__slide-enter--bottom-center {\n  animation-name: Toastify__slideInUp;\n}\n\n.Toastify__slide-exit--top-left, .Toastify__slide-exit--bottom-left {\n  animation-name: Toastify__slideOutLeft;\n}\n\n.Toastify__slide-exit--top-right, .Toastify__slide-exit--bottom-right {\n  animation-name: Toastify__slideOutRight;\n}\n\n.Toastify__slide-exit--top-center {\n  animation-name: Toastify__slideOutUp;\n}\n\n.Toastify__slide-exit--bottom-center {\n  animation-name: Toastify__slideOutDown;\n}\n\n@keyframes Toastify__spin {\n  from {\n    transform: rotate(0deg);\n  }\n  to {\n    transform: rotate(360deg);\n  }\n}", ""]);
// Exports
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (___CSS_LOADER_EXPORT___);


/***/ }),

/***/ "./node_modules/css-loader/dist/runtime/api.js":
/*!*****************************************************!*\
  !*** ./node_modules/css-loader/dist/runtime/api.js ***!
  \*****************************************************/
/***/ ((module) => {

"use strict";


/*
  MIT License http://www.opensource.org/licenses/mit-license.php
  Author Tobias Koppers @sokra
*/
// css base code, injected by the css-loader
// eslint-disable-next-line func-names
module.exports = function (cssWithMappingToString) {
  var list = []; // return the list of modules as css string

  list.toString = function toString() {
    return this.map(function (item) {
      var content = cssWithMappingToString(item);

      if (item[2]) {
        return "@media ".concat(item[2], " {").concat(content, "}");
      }

      return content;
    }).join("");
  }; // import a list of modules into the list
  // eslint-disable-next-line func-names


  list.i = function (modules, mediaQuery, dedupe) {
    if (typeof modules === "string") {
      // eslint-disable-next-line no-param-reassign
      modules = [[null, modules, ""]];
    }

    var alreadyImportedModules = {};

    if (dedupe) {
      for (var i = 0; i < this.length; i++) {
        // eslint-disable-next-line prefer-destructuring
        var id = this[i][0];

        if (id != null) {
          alreadyImportedModules[id] = true;
        }
      }
    }

    for (var _i = 0; _i < modules.length; _i++) {
      var item = [].concat(modules[_i]);

      if (dedupe && alreadyImportedModules[item[0]]) {
        // eslint-disable-next-line no-continue
        continue;
      }

      if (mediaQuery) {
        if (!item[2]) {
          item[2] = mediaQuery;
        } else {
          item[2] = "".concat(mediaQuery, " and ").concat(item[2]);
        }
      }

      list.push(item);
    }
  };

  return list;
};

/***/ }),

/***/ "./node_modules/draft-js/lib/AtomicBlockUtils.js":
/*!*******************************************************!*\
  !*** ./node_modules/draft-js/lib/AtomicBlockUtils.js ***!
  \*******************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";
/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @format
 * 
 * @emails oncall+draft_js
 */


function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; var ownKeys = Object.keys(source); if (typeof Object.getOwnPropertySymbols === 'function') { ownKeys = ownKeys.concat(Object.getOwnPropertySymbols(source).filter(function (sym) { return Object.getOwnPropertyDescriptor(source, sym).enumerable; })); } ownKeys.forEach(function (key) { _defineProperty(target, key, source[key]); }); } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var BlockMapBuilder = __webpack_require__(/*! ./BlockMapBuilder */ "./node_modules/draft-js/lib/BlockMapBuilder.js");

var CharacterMetadata = __webpack_require__(/*! ./CharacterMetadata */ "./node_modules/draft-js/lib/CharacterMetadata.js");

var ContentBlock = __webpack_require__(/*! ./ContentBlock */ "./node_modules/draft-js/lib/ContentBlock.js");

var ContentBlockNode = __webpack_require__(/*! ./ContentBlockNode */ "./node_modules/draft-js/lib/ContentBlockNode.js");

var DraftModifier = __webpack_require__(/*! ./DraftModifier */ "./node_modules/draft-js/lib/DraftModifier.js");

var EditorState = __webpack_require__(/*! ./EditorState */ "./node_modules/draft-js/lib/EditorState.js");

var generateRandomKey = __webpack_require__(/*! ./generateRandomKey */ "./node_modules/draft-js/lib/generateRandomKey.js");

var gkx = __webpack_require__(/*! ./gkx */ "./node_modules/draft-js/lib/gkx.js");

var Immutable = __webpack_require__(/*! immutable */ "./node_modules/draft-js/node_modules/immutable/dist/immutable.js");

var moveBlockInContentState = __webpack_require__(/*! ./moveBlockInContentState */ "./node_modules/draft-js/lib/moveBlockInContentState.js");

var experimentalTreeDataSupport = gkx('draft_tree_data_support');
var ContentBlockRecord = experimentalTreeDataSupport ? ContentBlockNode : ContentBlock;
var List = Immutable.List,
    Repeat = Immutable.Repeat;
var AtomicBlockUtils = {
  insertAtomicBlock: function insertAtomicBlock(editorState, entityKey, character) {
    var contentState = editorState.getCurrentContent();
    var selectionState = editorState.getSelection();
    var afterRemoval = DraftModifier.removeRange(contentState, selectionState, 'backward');
    var targetSelection = afterRemoval.getSelectionAfter();
    var afterSplit = DraftModifier.splitBlock(afterRemoval, targetSelection);
    var insertionTarget = afterSplit.getSelectionAfter();
    var asAtomicBlock = DraftModifier.setBlockType(afterSplit, insertionTarget, 'atomic');
    var charData = CharacterMetadata.create({
      entity: entityKey
    });
    var atomicBlockConfig = {
      key: generateRandomKey(),
      type: 'atomic',
      text: character,
      characterList: List(Repeat(charData, character.length))
    };
    var atomicDividerBlockConfig = {
      key: generateRandomKey(),
      type: 'unstyled'
    };

    if (experimentalTreeDataSupport) {
      atomicBlockConfig = _objectSpread({}, atomicBlockConfig, {
        nextSibling: atomicDividerBlockConfig.key
      });
      atomicDividerBlockConfig = _objectSpread({}, atomicDividerBlockConfig, {
        prevSibling: atomicBlockConfig.key
      });
    }

    var fragmentArray = [new ContentBlockRecord(atomicBlockConfig), new ContentBlockRecord(atomicDividerBlockConfig)];
    var fragment = BlockMapBuilder.createFromArray(fragmentArray);
    var withAtomicBlock = DraftModifier.replaceWithFragment(asAtomicBlock, insertionTarget, fragment);
    var newContent = withAtomicBlock.merge({
      selectionBefore: selectionState,
      selectionAfter: withAtomicBlock.getSelectionAfter().set('hasFocus', true)
    });
    return EditorState.push(editorState, newContent, 'insert-fragment');
  },
  moveAtomicBlock: function moveAtomicBlock(editorState, atomicBlock, targetRange, insertionMode) {
    var contentState = editorState.getCurrentContent();
    var selectionState = editorState.getSelection();
    var withMovedAtomicBlock;

    if (insertionMode === 'before' || insertionMode === 'after') {
      var targetBlock = contentState.getBlockForKey(insertionMode === 'before' ? targetRange.getStartKey() : targetRange.getEndKey());
      withMovedAtomicBlock = moveBlockInContentState(contentState, atomicBlock, targetBlock, insertionMode);
    } else {
      var afterRemoval = DraftModifier.removeRange(contentState, targetRange, 'backward');
      var selectionAfterRemoval = afterRemoval.getSelectionAfter();

      var _targetBlock = afterRemoval.getBlockForKey(selectionAfterRemoval.getFocusKey());

      if (selectionAfterRemoval.getStartOffset() === 0) {
        withMovedAtomicBlock = moveBlockInContentState(afterRemoval, atomicBlock, _targetBlock, 'before');
      } else if (selectionAfterRemoval.getEndOffset() === _targetBlock.getLength()) {
        withMovedAtomicBlock = moveBlockInContentState(afterRemoval, atomicBlock, _targetBlock, 'after');
      } else {
        var afterSplit = DraftModifier.splitBlock(afterRemoval, selectionAfterRemoval);
        var selectionAfterSplit = afterSplit.getSelectionAfter();

        var _targetBlock2 = afterSplit.getBlockForKey(selectionAfterSplit.getFocusKey());

        withMovedAtomicBlock = moveBlockInContentState(afterSplit, atomicBlock, _targetBlock2, 'before');
      }
    }

    var newContent = withMovedAtomicBlock.merge({
      selectionBefore: selectionState,
      selectionAfter: withMovedAtomicBlock.getSelectionAfter().set('hasFocus', true)
    });
    return EditorState.push(editorState, newContent, 'move-block');
  }
};
module.exports = AtomicBlockUtils;

/***/ }),

/***/ "./node_modules/draft-js/lib/BlockMapBuilder.js":
/*!******************************************************!*\
  !*** ./node_modules/draft-js/lib/BlockMapBuilder.js ***!
  \******************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";
/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @format
 * 
 * @emails oncall+draft_js
 */


var Immutable = __webpack_require__(/*! immutable */ "./node_modules/draft-js/node_modules/immutable/dist/immutable.js");

var OrderedMap = Immutable.OrderedMap;
var BlockMapBuilder = {
  createFromArray: function createFromArray(blocks) {
    return OrderedMap(blocks.map(function (block) {
      return [block.getKey(), block];
    }));
  }
};
module.exports = BlockMapBuilder;

/***/ }),

/***/ "./node_modules/draft-js/lib/BlockTree.js":
/*!************************************************!*\
  !*** ./node_modules/draft-js/lib/BlockTree.js ***!
  \************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";
/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @format
 * 
 * @emails oncall+draft_js
 */


function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; var ownKeys = Object.keys(source); if (typeof Object.getOwnPropertySymbols === 'function') { ownKeys = ownKeys.concat(Object.getOwnPropertySymbols(source).filter(function (sym) { return Object.getOwnPropertyDescriptor(source, sym).enumerable; })); } ownKeys.forEach(function (key) { _defineProperty(target, key, source[key]); }); } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _objectWithoutPropertiesLoose(source, excluded) { if (source == null) return {}; var target = {}; var sourceKeys = Object.keys(source); var key, i; for (i = 0; i < sourceKeys.length; i++) { key = sourceKeys[i]; if (excluded.indexOf(key) >= 0) continue; target[key] = source[key]; } return target; }

var findRangesImmutable = __webpack_require__(/*! ./findRangesImmutable */ "./node_modules/draft-js/lib/findRangesImmutable.js");

var getOwnObjectValues = __webpack_require__(/*! ./getOwnObjectValues */ "./node_modules/draft-js/lib/getOwnObjectValues.js");

var Immutable = __webpack_require__(/*! immutable */ "./node_modules/draft-js/node_modules/immutable/dist/immutable.js");

var List = Immutable.List,
    Repeat = Immutable.Repeat,
    Record = Immutable.Record;

var returnTrue = function returnTrue() {
  return true;
};

var defaultLeafRange = {
  start: null,
  end: null
};
var LeafRange = Record(defaultLeafRange);
var defaultDecoratorRange = {
  start: null,
  end: null,
  decoratorKey: null,
  leaves: null
};
var DecoratorRange = Record(defaultDecoratorRange);
var BlockTree = {
  /**
   * Generate a block tree for a given ContentBlock/decorator pair.
   */
  generate: function generate(contentState, block, decorator) {
    var textLength = block.getLength();

    if (!textLength) {
      return List.of(new DecoratorRange({
        start: 0,
        end: 0,
        decoratorKey: null,
        leaves: List.of(new LeafRange({
          start: 0,
          end: 0
        }))
      }));
    }

    var leafSets = [];
    var decorations = decorator ? decorator.getDecorations(block, contentState) : List(Repeat(null, textLength));
    var chars = block.getCharacterList();
    findRangesImmutable(decorations, areEqual, returnTrue, function (start, end) {
      leafSets.push(new DecoratorRange({
        start: start,
        end: end,
        decoratorKey: decorations.get(start),
        leaves: generateLeaves(chars.slice(start, end).toList(), start)
      }));
    });
    return List(leafSets);
  },
  fromJS: function fromJS(_ref) {
    var leaves = _ref.leaves,
        other = _objectWithoutPropertiesLoose(_ref, ["leaves"]);

    return new DecoratorRange(_objectSpread({}, other, {
      leaves: leaves != null ? List(Array.isArray(leaves) ? leaves : getOwnObjectValues(leaves)).map(function (leaf) {
        return LeafRange(leaf);
      }) : null
    }));
  }
};
/**
 * Generate LeafRange records for a given character list.
 */

function generateLeaves(characters, offset) {
  var leaves = [];
  var inlineStyles = characters.map(function (c) {
    return c.getStyle();
  }).toList();
  findRangesImmutable(inlineStyles, areEqual, returnTrue, function (start, end) {
    leaves.push(new LeafRange({
      start: start + offset,
      end: end + offset
    }));
  });
  return List(leaves);
}

function areEqual(a, b) {
  return a === b;
}

module.exports = BlockTree;

/***/ }),

/***/ "./node_modules/draft-js/lib/CharacterMetadata.js":
/*!********************************************************!*\
  !*** ./node_modules/draft-js/lib/CharacterMetadata.js ***!
  \********************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";
/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @format
 * 
 * @emails oncall+draft_js
 */


function _inheritsLoose(subClass, superClass) { subClass.prototype = Object.create(superClass.prototype); subClass.prototype.constructor = subClass; subClass.__proto__ = superClass; }

var _require = __webpack_require__(/*! immutable */ "./node_modules/draft-js/node_modules/immutable/dist/immutable.js"),
    Map = _require.Map,
    OrderedSet = _require.OrderedSet,
    Record = _require.Record; // Immutable.map is typed such that the value for every key in the map
// must be the same type


var EMPTY_SET = OrderedSet();
var defaultRecord = {
  style: EMPTY_SET,
  entity: null
};
var CharacterMetadataRecord = Record(defaultRecord);

var CharacterMetadata = /*#__PURE__*/function (_CharacterMetadataRec) {
  _inheritsLoose(CharacterMetadata, _CharacterMetadataRec);

  function CharacterMetadata() {
    return _CharacterMetadataRec.apply(this, arguments) || this;
  }

  var _proto = CharacterMetadata.prototype;

  _proto.getStyle = function getStyle() {
    return this.get('style');
  };

  _proto.getEntity = function getEntity() {
    return this.get('entity');
  };

  _proto.hasStyle = function hasStyle(style) {
    return this.getStyle().includes(style);
  };

  CharacterMetadata.applyStyle = function applyStyle(record, style) {
    var withStyle = record.set('style', record.getStyle().add(style));
    return CharacterMetadata.create(withStyle);
  };

  CharacterMetadata.removeStyle = function removeStyle(record, style) {
    var withoutStyle = record.set('style', record.getStyle().remove(style));
    return CharacterMetadata.create(withoutStyle);
  };

  CharacterMetadata.applyEntity = function applyEntity(record, entityKey) {
    var withEntity = record.getEntity() === entityKey ? record : record.set('entity', entityKey);
    return CharacterMetadata.create(withEntity);
  }
  /**
   * Use this function instead of the `CharacterMetadata` constructor.
   * Since most content generally uses only a very small number of
   * style/entity permutations, we can reuse these objects as often as
   * possible.
   */
  ;

  CharacterMetadata.create = function create(config) {
    if (!config) {
      return EMPTY;
    }

    var defaultConfig = {
      style: EMPTY_SET,
      entity: null
    }; // Fill in unspecified properties, if necessary.

    var configMap = Map(defaultConfig).merge(config);
    var existing = pool.get(configMap);

    if (existing) {
      return existing;
    }

    var newCharacter = new CharacterMetadata(configMap);
    pool = pool.set(configMap, newCharacter);
    return newCharacter;
  };

  CharacterMetadata.fromJS = function fromJS(_ref) {
    var style = _ref.style,
        entity = _ref.entity;
    return new CharacterMetadata({
      style: Array.isArray(style) ? OrderedSet(style) : style,
      entity: Array.isArray(entity) ? OrderedSet(entity) : entity
    });
  };

  return CharacterMetadata;
}(CharacterMetadataRecord);

var EMPTY = new CharacterMetadata();
var pool = Map([[Map(defaultRecord), EMPTY]]);
CharacterMetadata.EMPTY = EMPTY;
module.exports = CharacterMetadata;

/***/ }),

/***/ "./node_modules/draft-js/lib/CompositeDraftDecorator.js":
/*!**************************************************************!*\
  !*** ./node_modules/draft-js/lib/CompositeDraftDecorator.js ***!
  \**************************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";
/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @format
 * 
 * @emails oncall+draft_js
 */


function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var Immutable = __webpack_require__(/*! immutable */ "./node_modules/draft-js/node_modules/immutable/dist/immutable.js");

var List = Immutable.List;
var DELIMITER = '.';
/**
 * A CompositeDraftDecorator traverses through a list of DraftDecorator
 * instances to identify sections of a ContentBlock that should be rendered
 * in a "decorated" manner. For example, hashtags, mentions, and links may
 * be intended to stand out visually, be rendered as anchors, etc.
 *
 * The list of decorators supplied to the constructor will be used in the
 * order they are provided. This allows the caller to specify a priority for
 * string matching, in case of match collisions among decorators.
 *
 * For instance, I may have a link with a `#` in its text. Though this section
 * of text may match our hashtag decorator, it should not be treated as a
 * hashtag. I should therefore list my link DraftDecorator
 * before my hashtag DraftDecorator when constructing this composite
 * decorator instance.
 *
 * Thus, when a collision like this is encountered, the earlier match is
 * preserved and the new match is discarded.
 */

var CompositeDraftDecorator = /*#__PURE__*/function () {
  function CompositeDraftDecorator(decorators) {
    _defineProperty(this, "_decorators", void 0);

    // Copy the decorator array, since we use this array order to determine
    // precedence of decoration matching. If the array is mutated externally,
    // we don't want to be affected here.
    this._decorators = decorators.slice();
  }

  var _proto = CompositeDraftDecorator.prototype;

  _proto.getDecorations = function getDecorations(block, contentState) {
    var decorations = Array(block.getText().length).fill(null);

    this._decorators.forEach(function (
    /*object*/
    decorator,
    /*number*/
    ii) {
      var counter = 0;
      var strategy = decorator.strategy;

      var callback = function callback(
      /*number*/
      start,
      /*number*/
      end) {
        // Find out if any of our matching range is already occupied
        // by another decorator. If so, discard the match. Otherwise, store
        // the component key for rendering.
        if (canOccupySlice(decorations, start, end)) {
          occupySlice(decorations, start, end, ii + DELIMITER + counter);
          counter++;
        }
      };

      strategy(block, callback, contentState);
    });

    return List(decorations);
  };

  _proto.getComponentForKey = function getComponentForKey(key) {
    var componentKey = parseInt(key.split(DELIMITER)[0], 10);
    return this._decorators[componentKey].component;
  };

  _proto.getPropsForKey = function getPropsForKey(key) {
    var componentKey = parseInt(key.split(DELIMITER)[0], 10);
    return this._decorators[componentKey].props;
  };

  return CompositeDraftDecorator;
}();
/**
 * Determine whether we can occupy the specified slice of the decorations
 * array.
 */


function canOccupySlice(decorations, start, end) {
  for (var ii = start; ii < end; ii++) {
    if (decorations[ii] != null) {
      return false;
    }
  }

  return true;
}
/**
 * Splice the specified component into our decoration array at the desired
 * range.
 */


function occupySlice(targetArr, start, end, componentKey) {
  for (var ii = start; ii < end; ii++) {
    targetArr[ii] = componentKey;
  }
}

module.exports = CompositeDraftDecorator;

/***/ }),

/***/ "./node_modules/draft-js/lib/ContentBlock.js":
/*!***************************************************!*\
  !*** ./node_modules/draft-js/lib/ContentBlock.js ***!
  \***************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";
/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @format
 * 
 * @emails oncall+draft_js
 */


function _inheritsLoose(subClass, superClass) { subClass.prototype = Object.create(superClass.prototype); subClass.prototype.constructor = subClass; subClass.__proto__ = superClass; }

var CharacterMetadata = __webpack_require__(/*! ./CharacterMetadata */ "./node_modules/draft-js/lib/CharacterMetadata.js");

var findRangesImmutable = __webpack_require__(/*! ./findRangesImmutable */ "./node_modules/draft-js/lib/findRangesImmutable.js");

var Immutable = __webpack_require__(/*! immutable */ "./node_modules/draft-js/node_modules/immutable/dist/immutable.js");

var List = Immutable.List,
    Map = Immutable.Map,
    OrderedSet = Immutable.OrderedSet,
    Record = Immutable.Record,
    Repeat = Immutable.Repeat;
var EMPTY_SET = OrderedSet();
var defaultRecord = {
  key: '',
  type: 'unstyled',
  text: '',
  characterList: List(),
  depth: 0,
  data: Map()
};
var ContentBlockRecord = Record(defaultRecord);

var decorateCharacterList = function decorateCharacterList(config) {
  if (!config) {
    return config;
  }

  var characterList = config.characterList,
      text = config.text;

  if (text && !characterList) {
    config.characterList = List(Repeat(CharacterMetadata.EMPTY, text.length));
  }

  return config;
};

var ContentBlock = /*#__PURE__*/function (_ContentBlockRecord) {
  _inheritsLoose(ContentBlock, _ContentBlockRecord);

  function ContentBlock(config) {
    return _ContentBlockRecord.call(this, decorateCharacterList(config)) || this;
  }

  var _proto = ContentBlock.prototype;

  _proto.getKey = function getKey() {
    return this.get('key');
  };

  _proto.getType = function getType() {
    return this.get('type');
  };

  _proto.getText = function getText() {
    return this.get('text');
  };

  _proto.getCharacterList = function getCharacterList() {
    return this.get('characterList');
  };

  _proto.getLength = function getLength() {
    return this.getText().length;
  };

  _proto.getDepth = function getDepth() {
    return this.get('depth');
  };

  _proto.getData = function getData() {
    return this.get('data');
  };

  _proto.getInlineStyleAt = function getInlineStyleAt(offset) {
    var character = this.getCharacterList().get(offset);
    return character ? character.getStyle() : EMPTY_SET;
  };

  _proto.getEntityAt = function getEntityAt(offset) {
    var character = this.getCharacterList().get(offset);
    return character ? character.getEntity() : null;
  }
  /**
   * Execute a callback for every contiguous range of styles within the block.
   */
  ;

  _proto.findStyleRanges = function findStyleRanges(filterFn, callback) {
    findRangesImmutable(this.getCharacterList(), haveEqualStyle, filterFn, callback);
  }
  /**
   * Execute a callback for every contiguous range of entities within the block.
   */
  ;

  _proto.findEntityRanges = function findEntityRanges(filterFn, callback) {
    findRangesImmutable(this.getCharacterList(), haveEqualEntity, filterFn, callback);
  };

  return ContentBlock;
}(ContentBlockRecord);

function haveEqualStyle(charA, charB) {
  return charA.getStyle() === charB.getStyle();
}

function haveEqualEntity(charA, charB) {
  return charA.getEntity() === charB.getEntity();
}

module.exports = ContentBlock;

/***/ }),

/***/ "./node_modules/draft-js/lib/ContentBlockNode.js":
/*!*******************************************************!*\
  !*** ./node_modules/draft-js/lib/ContentBlockNode.js ***!
  \*******************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";
/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @format
 * 
 * @emails oncall+draft_js
 *
 * This file is a fork of ContentBlock adding support for nesting references by
 * providing links to children, parent, prevSibling, and nextSibling.
 *
 * This is unstable and not part of the public API and should not be used by
 * production systems. This file may be update/removed without notice.
 */


function _inheritsLoose(subClass, superClass) { subClass.prototype = Object.create(superClass.prototype); subClass.prototype.constructor = subClass; subClass.__proto__ = superClass; }

var CharacterMetadata = __webpack_require__(/*! ./CharacterMetadata */ "./node_modules/draft-js/lib/CharacterMetadata.js");

var findRangesImmutable = __webpack_require__(/*! ./findRangesImmutable */ "./node_modules/draft-js/lib/findRangesImmutable.js");

var Immutable = __webpack_require__(/*! immutable */ "./node_modules/draft-js/node_modules/immutable/dist/immutable.js");

var List = Immutable.List,
    Map = Immutable.Map,
    OrderedSet = Immutable.OrderedSet,
    Record = Immutable.Record,
    Repeat = Immutable.Repeat;
var EMPTY_SET = OrderedSet();
var defaultRecord = {
  parent: null,
  characterList: List(),
  data: Map(),
  depth: 0,
  key: '',
  text: '',
  type: 'unstyled',
  children: List(),
  prevSibling: null,
  nextSibling: null
};

var haveEqualStyle = function haveEqualStyle(charA, charB) {
  return charA.getStyle() === charB.getStyle();
};

var haveEqualEntity = function haveEqualEntity(charA, charB) {
  return charA.getEntity() === charB.getEntity();
};

var decorateCharacterList = function decorateCharacterList(config) {
  if (!config) {
    return config;
  }

  var characterList = config.characterList,
      text = config.text;

  if (text && !characterList) {
    config.characterList = List(Repeat(CharacterMetadata.EMPTY, text.length));
  }

  return config;
};

var ContentBlockNode = /*#__PURE__*/function (_ref) {
  _inheritsLoose(ContentBlockNode, _ref);

  function ContentBlockNode() {
    var props = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : defaultRecord;

    /* eslint-disable-next-line constructor-super */
    return _ref.call(this, decorateCharacterList(props)) || this;
  }

  var _proto = ContentBlockNode.prototype;

  _proto.getKey = function getKey() {
    return this.get('key');
  };

  _proto.getType = function getType() {
    return this.get('type');
  };

  _proto.getText = function getText() {
    return this.get('text');
  };

  _proto.getCharacterList = function getCharacterList() {
    return this.get('characterList');
  };

  _proto.getLength = function getLength() {
    return this.getText().length;
  };

  _proto.getDepth = function getDepth() {
    return this.get('depth');
  };

  _proto.getData = function getData() {
    return this.get('data');
  };

  _proto.getInlineStyleAt = function getInlineStyleAt(offset) {
    var character = this.getCharacterList().get(offset);
    return character ? character.getStyle() : EMPTY_SET;
  };

  _proto.getEntityAt = function getEntityAt(offset) {
    var character = this.getCharacterList().get(offset);
    return character ? character.getEntity() : null;
  };

  _proto.getChildKeys = function getChildKeys() {
    return this.get('children');
  };

  _proto.getParentKey = function getParentKey() {
    return this.get('parent');
  };

  _proto.getPrevSiblingKey = function getPrevSiblingKey() {
    return this.get('prevSibling');
  };

  _proto.getNextSiblingKey = function getNextSiblingKey() {
    return this.get('nextSibling');
  };

  _proto.findStyleRanges = function findStyleRanges(filterFn, callback) {
    findRangesImmutable(this.getCharacterList(), haveEqualStyle, filterFn, callback);
  };

  _proto.findEntityRanges = function findEntityRanges(filterFn, callback) {
    findRangesImmutable(this.getCharacterList(), haveEqualEntity, filterFn, callback);
  };

  return ContentBlockNode;
}(Record(defaultRecord));

module.exports = ContentBlockNode;

/***/ }),

/***/ "./node_modules/draft-js/lib/ContentState.js":
/*!***************************************************!*\
  !*** ./node_modules/draft-js/lib/ContentState.js ***!
  \***************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";
/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @format
 * 
 * @emails oncall+draft_js
 */


function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; var ownKeys = Object.keys(source); if (typeof Object.getOwnPropertySymbols === 'function') { ownKeys = ownKeys.concat(Object.getOwnPropertySymbols(source).filter(function (sym) { return Object.getOwnPropertyDescriptor(source, sym).enumerable; })); } ownKeys.forEach(function (key) { _defineProperty(target, key, source[key]); }); } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _inheritsLoose(subClass, superClass) { subClass.prototype = Object.create(superClass.prototype); subClass.prototype.constructor = subClass; subClass.__proto__ = superClass; }

var BlockMapBuilder = __webpack_require__(/*! ./BlockMapBuilder */ "./node_modules/draft-js/lib/BlockMapBuilder.js");

var CharacterMetadata = __webpack_require__(/*! ./CharacterMetadata */ "./node_modules/draft-js/lib/CharacterMetadata.js");

var ContentBlock = __webpack_require__(/*! ./ContentBlock */ "./node_modules/draft-js/lib/ContentBlock.js");

var ContentBlockNode = __webpack_require__(/*! ./ContentBlockNode */ "./node_modules/draft-js/lib/ContentBlockNode.js");

var DraftEntity = __webpack_require__(/*! ./DraftEntity */ "./node_modules/draft-js/lib/DraftEntity.js");

var SelectionState = __webpack_require__(/*! ./SelectionState */ "./node_modules/draft-js/lib/SelectionState.js");

var generateRandomKey = __webpack_require__(/*! ./generateRandomKey */ "./node_modules/draft-js/lib/generateRandomKey.js");

var getOwnObjectValues = __webpack_require__(/*! ./getOwnObjectValues */ "./node_modules/draft-js/lib/getOwnObjectValues.js");

var gkx = __webpack_require__(/*! ./gkx */ "./node_modules/draft-js/lib/gkx.js");

var Immutable = __webpack_require__(/*! immutable */ "./node_modules/draft-js/node_modules/immutable/dist/immutable.js");

var sanitizeDraftText = __webpack_require__(/*! ./sanitizeDraftText */ "./node_modules/draft-js/lib/sanitizeDraftText.js");

var List = Immutable.List,
    Record = Immutable.Record,
    Repeat = Immutable.Repeat,
    ImmutableMap = Immutable.Map,
    OrderedMap = Immutable.OrderedMap;
var defaultRecord = {
  entityMap: null,
  blockMap: null,
  selectionBefore: null,
  selectionAfter: null
};
var ContentStateRecord = Record(defaultRecord);
/* $FlowFixMe[signature-verification-failure] Supressing a `signature-
 * verification-failure` error here. TODO: T65949050 Clean up the branch for
 * this GK */

var ContentBlockNodeRecord = gkx('draft_tree_data_support') ? ContentBlockNode : ContentBlock;

var ContentState = /*#__PURE__*/function (_ContentStateRecord) {
  _inheritsLoose(ContentState, _ContentStateRecord);

  function ContentState() {
    return _ContentStateRecord.apply(this, arguments) || this;
  }

  var _proto = ContentState.prototype;

  _proto.getEntityMap = function getEntityMap() {
    // TODO: update this when we fully remove DraftEntity
    return DraftEntity;
  };

  _proto.getBlockMap = function getBlockMap() {
    return this.get('blockMap');
  };

  _proto.getSelectionBefore = function getSelectionBefore() {
    return this.get('selectionBefore');
  };

  _proto.getSelectionAfter = function getSelectionAfter() {
    return this.get('selectionAfter');
  };

  _proto.getBlockForKey = function getBlockForKey(key) {
    var block = this.getBlockMap().get(key);
    return block;
  };

  _proto.getKeyBefore = function getKeyBefore(key) {
    return this.getBlockMap().reverse().keySeq().skipUntil(function (v) {
      return v === key;
    }).skip(1).first();
  };

  _proto.getKeyAfter = function getKeyAfter(key) {
    return this.getBlockMap().keySeq().skipUntil(function (v) {
      return v === key;
    }).skip(1).first();
  };

  _proto.getBlockAfter = function getBlockAfter(key) {
    return this.getBlockMap().skipUntil(function (_, k) {
      return k === key;
    }).skip(1).first();
  };

  _proto.getBlockBefore = function getBlockBefore(key) {
    return this.getBlockMap().reverse().skipUntil(function (_, k) {
      return k === key;
    }).skip(1).first();
  };

  _proto.getBlocksAsArray = function getBlocksAsArray() {
    return this.getBlockMap().toArray();
  };

  _proto.getFirstBlock = function getFirstBlock() {
    return this.getBlockMap().first();
  };

  _proto.getLastBlock = function getLastBlock() {
    return this.getBlockMap().last();
  };

  _proto.getPlainText = function getPlainText(delimiter) {
    return this.getBlockMap().map(function (block) {
      return block ? block.getText() : '';
    }).join(delimiter || '\n');
  };

  _proto.getLastCreatedEntityKey = function getLastCreatedEntityKey() {
    // TODO: update this when we fully remove DraftEntity
    return DraftEntity.__getLastCreatedEntityKey();
  };

  _proto.hasText = function hasText() {
    var blockMap = this.getBlockMap();
    return blockMap.size > 1 || // make sure that there are no zero width space chars
    escape(blockMap.first().getText()).replace(/%u200B/g, '').length > 0;
  };

  _proto.createEntity = function createEntity(type, mutability, data) {
    // TODO: update this when we fully remove DraftEntity
    DraftEntity.__create(type, mutability, data);

    return this;
  };

  _proto.mergeEntityData = function mergeEntityData(key, toMerge) {
    // TODO: update this when we fully remove DraftEntity
    DraftEntity.__mergeData(key, toMerge);

    return this;
  };

  _proto.replaceEntityData = function replaceEntityData(key, newData) {
    // TODO: update this when we fully remove DraftEntity
    DraftEntity.__replaceData(key, newData);

    return this;
  };

  _proto.addEntity = function addEntity(instance) {
    // TODO: update this when we fully remove DraftEntity
    DraftEntity.__add(instance);

    return this;
  };

  _proto.getEntity = function getEntity(key) {
    // TODO: update this when we fully remove DraftEntity
    return DraftEntity.__get(key);
  };

  _proto.getAllEntities = function getAllEntities() {
    return DraftEntity.__getAll();
  };

  _proto.loadWithEntities = function loadWithEntities(entities) {
    return DraftEntity.__loadWithEntities(entities);
  };

  ContentState.createFromBlockArray = function createFromBlockArray( // TODO: update flow type when we completely deprecate the old entity API
  blocks, entityMap) {
    // TODO: remove this when we completely deprecate the old entity API
    var theBlocks = Array.isArray(blocks) ? blocks : blocks.contentBlocks;
    var blockMap = BlockMapBuilder.createFromArray(theBlocks);
    var selectionState = blockMap.isEmpty() ? new SelectionState() : SelectionState.createEmpty(blockMap.first().getKey());
    return new ContentState({
      blockMap: blockMap,
      entityMap: entityMap || DraftEntity,
      selectionBefore: selectionState,
      selectionAfter: selectionState
    });
  };

  ContentState.createFromText = function createFromText(text) {
    var delimiter = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : /\r\n?|\n/g;
    var strings = text.split(delimiter);
    var blocks = strings.map(function (block) {
      block = sanitizeDraftText(block);
      return new ContentBlockNodeRecord({
        key: generateRandomKey(),
        text: block,
        type: 'unstyled',
        characterList: List(Repeat(CharacterMetadata.EMPTY, block.length))
      });
    });
    return ContentState.createFromBlockArray(blocks);
  };

  ContentState.fromJS = function fromJS(state) {
    return new ContentState(_objectSpread({}, state, {
      blockMap: OrderedMap(state.blockMap).map(ContentState.createContentBlockFromJS),
      selectionBefore: new SelectionState(state.selectionBefore),
      selectionAfter: new SelectionState(state.selectionAfter)
    }));
  };

  ContentState.createContentBlockFromJS = function createContentBlockFromJS(block) {
    var characterList = block.characterList;
    return new ContentBlockNodeRecord(_objectSpread({}, block, {
      data: ImmutableMap(block.data),
      characterList: characterList != null ? List((Array.isArray(characterList) ? characterList : getOwnObjectValues(characterList)).map(function (c) {
        return CharacterMetadata.fromJS(c);
      })) : undefined
    }));
  };

  return ContentState;
}(ContentStateRecord);

module.exports = ContentState;

/***/ }),

/***/ "./node_modules/draft-js/lib/ContentStateInlineStyle.js":
/*!**************************************************************!*\
  !*** ./node_modules/draft-js/lib/ContentStateInlineStyle.js ***!
  \**************************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";
/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @format
 * 
 * @emails oncall+draft_js
 */


var CharacterMetadata = __webpack_require__(/*! ./CharacterMetadata */ "./node_modules/draft-js/lib/CharacterMetadata.js");

var _require = __webpack_require__(/*! immutable */ "./node_modules/draft-js/node_modules/immutable/dist/immutable.js"),
    Map = _require.Map;

var ContentStateInlineStyle = {
  add: function add(contentState, selectionState, inlineStyle) {
    return modifyInlineStyle(contentState, selectionState, inlineStyle, true);
  },
  remove: function remove(contentState, selectionState, inlineStyle) {
    return modifyInlineStyle(contentState, selectionState, inlineStyle, false);
  }
};

function modifyInlineStyle(contentState, selectionState, inlineStyle, addOrRemove) {
  var blockMap = contentState.getBlockMap();
  var startKey = selectionState.getStartKey();
  var startOffset = selectionState.getStartOffset();
  var endKey = selectionState.getEndKey();
  var endOffset = selectionState.getEndOffset();
  var newBlocks = blockMap.skipUntil(function (_, k) {
    return k === startKey;
  }).takeUntil(function (_, k) {
    return k === endKey;
  }).concat(Map([[endKey, blockMap.get(endKey)]])).map(function (block, blockKey) {
    var sliceStart;
    var sliceEnd;

    if (startKey === endKey) {
      sliceStart = startOffset;
      sliceEnd = endOffset;
    } else {
      sliceStart = blockKey === startKey ? startOffset : 0;
      sliceEnd = blockKey === endKey ? endOffset : block.getLength();
    }

    var chars = block.getCharacterList();
    var current;

    while (sliceStart < sliceEnd) {
      current = chars.get(sliceStart);
      chars = chars.set(sliceStart, addOrRemove ? CharacterMetadata.applyStyle(current, inlineStyle) : CharacterMetadata.removeStyle(current, inlineStyle));
      sliceStart++;
    }

    return block.set('characterList', chars);
  });
  return contentState.merge({
    blockMap: blockMap.merge(newBlocks),
    selectionBefore: selectionState,
    selectionAfter: selectionState
  });
}

module.exports = ContentStateInlineStyle;

/***/ }),

/***/ "./node_modules/draft-js/lib/DOMObserver.js":
/*!**************************************************!*\
  !*** ./node_modules/draft-js/lib/DOMObserver.js ***!
  \**************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";
/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @format
 * 
 * @emails oncall+draft_js
 */


function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var UserAgent = __webpack_require__(/*! fbjs/lib/UserAgent */ "./node_modules/fbjs/lib/UserAgent.js");

var findAncestorOffsetKey = __webpack_require__(/*! ./findAncestorOffsetKey */ "./node_modules/draft-js/lib/findAncestorOffsetKey.js");

var getWindowForNode = __webpack_require__(/*! ./getWindowForNode */ "./node_modules/draft-js/lib/getWindowForNode.js");

var Immutable = __webpack_require__(/*! immutable */ "./node_modules/draft-js/node_modules/immutable/dist/immutable.js");

var invariant = __webpack_require__(/*! fbjs/lib/invariant */ "./node_modules/fbjs/lib/invariant.js");

var nullthrows = __webpack_require__(/*! fbjs/lib/nullthrows */ "./node_modules/fbjs/lib/nullthrows.js");

var Map = Immutable.Map;
// Heavily based on Prosemirror's DOMObserver https://github.com/ProseMirror/prosemirror-view/blob/master/src/domobserver.js
var DOM_OBSERVER_OPTIONS = {
  subtree: true,
  characterData: true,
  childList: true,
  characterDataOldValue: false,
  attributes: false
}; // IE11 has very broken mutation observers, so we also listen to DOMCharacterDataModified

var USE_CHAR_DATA = UserAgent.isBrowser('IE <= 11');

var DOMObserver = /*#__PURE__*/function () {
  function DOMObserver(container) {
    var _this = this;

    _defineProperty(this, "observer", void 0);

    _defineProperty(this, "container", void 0);

    _defineProperty(this, "mutations", void 0);

    _defineProperty(this, "onCharData", void 0);

    this.container = container;
    this.mutations = Map();
    var containerWindow = getWindowForNode(container);

    if (containerWindow.MutationObserver && !USE_CHAR_DATA) {
      this.observer = new containerWindow.MutationObserver(function (mutations) {
        return _this.registerMutations(mutations);
      });
    } else {
      this.onCharData = function (e) {
        !(e.target instanceof Node) ?  true ? invariant(false, 'Expected target to be an instance of Node') : 0 : void 0;

        _this.registerMutation({
          type: 'characterData',
          target: e.target
        });
      };
    }
  }

  var _proto = DOMObserver.prototype;

  _proto.start = function start() {
    if (this.observer) {
      this.observer.observe(this.container, DOM_OBSERVER_OPTIONS);
    } else {
      /* $FlowFixMe[incompatible-call] (>=0.68.0 site=www,mobile) This event
       * type is not defined by Flow's standard library */
      this.container.addEventListener('DOMCharacterDataModified', this.onCharData);
    }
  };

  _proto.stopAndFlushMutations = function stopAndFlushMutations() {
    var observer = this.observer;

    if (observer) {
      this.registerMutations(observer.takeRecords());
      observer.disconnect();
    } else {
      /* $FlowFixMe[incompatible-call] (>=0.68.0 site=www,mobile) This event
       * type is not defined by Flow's standard library */
      this.container.removeEventListener('DOMCharacterDataModified', this.onCharData);
    }

    var mutations = this.mutations;
    this.mutations = Map();
    return mutations;
  };

  _proto.registerMutations = function registerMutations(mutations) {
    for (var i = 0; i < mutations.length; i++) {
      this.registerMutation(mutations[i]);
    }
  };

  _proto.getMutationTextContent = function getMutationTextContent(mutation) {
    var type = mutation.type,
        target = mutation.target,
        removedNodes = mutation.removedNodes;

    if (type === 'characterData') {
      // When `textContent` is '', there is a race condition that makes
      // getting the offsetKey from the target not possible.
      // These events are also followed by a `childList`, which is the one
      // we are able to retrieve the offsetKey and apply the '' text.
      if (target.textContent !== '') {
        // IE 11 considers the enter keypress that concludes the composition
        // as an input char. This strips that newline character so the draft
        // state does not receive spurious newlines.
        if (USE_CHAR_DATA) {
          return target.textContent.replace('\n', '');
        }

        return target.textContent;
      }
    } else if (type === 'childList') {
      if (removedNodes && removedNodes.length) {
        // `characterData` events won't happen or are ignored when
        // removing the last character of a leaf node, what happens
        // instead is a `childList` event with a `removedNodes` array.
        // For this case the textContent should be '' and
        // `DraftModifier.replaceText` will make sure the content is
        // updated properly.
        return '';
      } else if (target.textContent !== '') {
        // Typing Chinese in an empty block in MS Edge results in a
        // `childList` event with non-empty textContent.
        // See https://github.com/facebook/draft-js/issues/2082
        return target.textContent;
      }
    }

    return null;
  };

  _proto.registerMutation = function registerMutation(mutation) {
    var textContent = this.getMutationTextContent(mutation);

    if (textContent != null) {
      var offsetKey = nullthrows(findAncestorOffsetKey(mutation.target));
      this.mutations = this.mutations.set(offsetKey, textContent);
    }
  };

  return DOMObserver;
}();

module.exports = DOMObserver;

/***/ }),

/***/ "./node_modules/draft-js/lib/DefaultDraftBlockRenderMap.js":
/*!*****************************************************************!*\
  !*** ./node_modules/draft-js/lib/DefaultDraftBlockRenderMap.js ***!
  \*****************************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";
/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @format
 * 
 * @emails oncall+draft_js
 */


var React = __webpack_require__(/*! react */ "./node_modules/react/index.js");

var cx = __webpack_require__(/*! fbjs/lib/cx */ "./node_modules/fbjs/lib/cx.js");

var _require = __webpack_require__(/*! immutable */ "./node_modules/draft-js/node_modules/immutable/dist/immutable.js"),
    Map = _require.Map;

var UL_WRAP = React.createElement("ul", {
  className: cx('public/DraftStyleDefault/ul')
});
var OL_WRAP = React.createElement("ol", {
  className: cx('public/DraftStyleDefault/ol')
});
var PRE_WRAP = React.createElement("pre", {
  className: cx('public/DraftStyleDefault/pre')
});
var DefaultDraftBlockRenderMap = Map({
  'header-one': {
    element: 'h1'
  },
  'header-two': {
    element: 'h2'
  },
  'header-three': {
    element: 'h3'
  },
  'header-four': {
    element: 'h4'
  },
  'header-five': {
    element: 'h5'
  },
  'header-six': {
    element: 'h6'
  },
  section: {
    element: 'section'
  },
  article: {
    element: 'article'
  },
  'unordered-list-item': {
    element: 'li',
    wrapper: UL_WRAP
  },
  'ordered-list-item': {
    element: 'li',
    wrapper: OL_WRAP
  },
  blockquote: {
    element: 'blockquote'
  },
  atomic: {
    element: 'figure'
  },
  'code-block': {
    element: 'pre',
    wrapper: PRE_WRAP
  },
  unstyled: {
    element: 'div',
    aliasedElements: ['p']
  }
});
module.exports = DefaultDraftBlockRenderMap;

/***/ }),

/***/ "./node_modules/draft-js/lib/DefaultDraftInlineStyle.js":
/*!**************************************************************!*\
  !*** ./node_modules/draft-js/lib/DefaultDraftInlineStyle.js ***!
  \**************************************************************/
/***/ ((module) => {

"use strict";
/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @format
 * 
 * @emails oncall+draft_js
 */


module.exports = {
  BOLD: {
    fontWeight: 'bold'
  },
  CODE: {
    fontFamily: 'monospace',
    wordWrap: 'break-word'
  },
  ITALIC: {
    fontStyle: 'italic'
  },
  STRIKETHROUGH: {
    textDecoration: 'line-through'
  },
  UNDERLINE: {
    textDecoration: 'underline'
  }
};

/***/ }),

/***/ "./node_modules/draft-js/lib/Draft.js":
/*!********************************************!*\
  !*** ./node_modules/draft-js/lib/Draft.js ***!
  \********************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";
/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @format
 * 
 */


var AtomicBlockUtils = __webpack_require__(/*! ./AtomicBlockUtils */ "./node_modules/draft-js/lib/AtomicBlockUtils.js");

var BlockMapBuilder = __webpack_require__(/*! ./BlockMapBuilder */ "./node_modules/draft-js/lib/BlockMapBuilder.js");

var CharacterMetadata = __webpack_require__(/*! ./CharacterMetadata */ "./node_modules/draft-js/lib/CharacterMetadata.js");

var CompositeDraftDecorator = __webpack_require__(/*! ./CompositeDraftDecorator */ "./node_modules/draft-js/lib/CompositeDraftDecorator.js");

var ContentBlock = __webpack_require__(/*! ./ContentBlock */ "./node_modules/draft-js/lib/ContentBlock.js");

var ContentState = __webpack_require__(/*! ./ContentState */ "./node_modules/draft-js/lib/ContentState.js");

var DefaultDraftBlockRenderMap = __webpack_require__(/*! ./DefaultDraftBlockRenderMap */ "./node_modules/draft-js/lib/DefaultDraftBlockRenderMap.js");

var DefaultDraftInlineStyle = __webpack_require__(/*! ./DefaultDraftInlineStyle */ "./node_modules/draft-js/lib/DefaultDraftInlineStyle.js");

var DraftEditor = __webpack_require__(/*! ./DraftEditor.react */ "./node_modules/draft-js/lib/DraftEditor.react.js");

var DraftEditorBlock = __webpack_require__(/*! ./DraftEditorBlock.react */ "./node_modules/draft-js/lib/DraftEditorBlock.react.js");

var DraftEntity = __webpack_require__(/*! ./DraftEntity */ "./node_modules/draft-js/lib/DraftEntity.js");

var DraftModifier = __webpack_require__(/*! ./DraftModifier */ "./node_modules/draft-js/lib/DraftModifier.js");

var DraftEntityInstance = __webpack_require__(/*! ./DraftEntityInstance */ "./node_modules/draft-js/lib/DraftEntityInstance.js");

var EditorState = __webpack_require__(/*! ./EditorState */ "./node_modules/draft-js/lib/EditorState.js");

var KeyBindingUtil = __webpack_require__(/*! ./KeyBindingUtil */ "./node_modules/draft-js/lib/KeyBindingUtil.js");

var RawDraftContentState = __webpack_require__(/*! ./RawDraftContentState */ "./node_modules/draft-js/lib/RawDraftContentState.js");

var RichTextEditorUtil = __webpack_require__(/*! ./RichTextEditorUtil */ "./node_modules/draft-js/lib/RichTextEditorUtil.js");

var SelectionState = __webpack_require__(/*! ./SelectionState */ "./node_modules/draft-js/lib/SelectionState.js");

var convertFromDraftStateToRaw = __webpack_require__(/*! ./convertFromDraftStateToRaw */ "./node_modules/draft-js/lib/convertFromDraftStateToRaw.js");

var convertFromRawToDraftState = __webpack_require__(/*! ./convertFromRawToDraftState */ "./node_modules/draft-js/lib/convertFromRawToDraftState.js");

var generateRandomKey = __webpack_require__(/*! ./generateRandomKey */ "./node_modules/draft-js/lib/generateRandomKey.js");

var getDefaultKeyBinding = __webpack_require__(/*! ./getDefaultKeyBinding */ "./node_modules/draft-js/lib/getDefaultKeyBinding.js");

var getVisibleSelectionRect = __webpack_require__(/*! ./getVisibleSelectionRect */ "./node_modules/draft-js/lib/getVisibleSelectionRect.js");

var convertFromHTML = __webpack_require__(/*! ./convertFromHTMLToContentBlocks */ "./node_modules/draft-js/lib/convertFromHTMLToContentBlocks.js");

var DraftPublic = {
  Editor: DraftEditor,
  EditorBlock: DraftEditorBlock,
  EditorState: EditorState,
  CompositeDecorator: CompositeDraftDecorator,
  Entity: DraftEntity,
  EntityInstance: DraftEntityInstance,
  BlockMapBuilder: BlockMapBuilder,
  CharacterMetadata: CharacterMetadata,
  ContentBlock: ContentBlock,
  ContentState: ContentState,
  RawDraftContentState: RawDraftContentState,
  SelectionState: SelectionState,
  AtomicBlockUtils: AtomicBlockUtils,
  KeyBindingUtil: KeyBindingUtil,
  Modifier: DraftModifier,
  RichUtils: RichTextEditorUtil,
  DefaultDraftBlockRenderMap: DefaultDraftBlockRenderMap,
  DefaultDraftInlineStyle: DefaultDraftInlineStyle,
  convertFromHTML: convertFromHTML,
  convertFromRaw: convertFromRawToDraftState,
  convertToRaw: convertFromDraftStateToRaw,
  genKey: generateRandomKey,
  getDefaultKeyBinding: getDefaultKeyBinding,
  getVisibleSelectionRect: getVisibleSelectionRect
};
module.exports = DraftPublic;

/***/ }),

/***/ "./node_modules/draft-js/lib/DraftEditor.react.js":
/*!********************************************************!*\
  !*** ./node_modules/draft-js/lib/DraftEditor.react.js ***!
  \********************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";
/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @format
 * 
 * @preventMunge
 * @emails oncall+draft_js
 */


var _assign = __webpack_require__(/*! object-assign */ "./node_modules/object-assign/index.js");

function _extends() { _extends = _assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; var ownKeys = Object.keys(source); if (typeof Object.getOwnPropertySymbols === 'function') { ownKeys = ownKeys.concat(Object.getOwnPropertySymbols(source).filter(function (sym) { return Object.getOwnPropertyDescriptor(source, sym).enumerable; })); } ownKeys.forEach(function (key) { _defineProperty(target, key, source[key]); }); } return target; }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _inheritsLoose(subClass, superClass) { subClass.prototype = Object.create(superClass.prototype); subClass.prototype.constructor = subClass; subClass.__proto__ = superClass; }

var DefaultDraftBlockRenderMap = __webpack_require__(/*! ./DefaultDraftBlockRenderMap */ "./node_modules/draft-js/lib/DefaultDraftBlockRenderMap.js");

var DefaultDraftInlineStyle = __webpack_require__(/*! ./DefaultDraftInlineStyle */ "./node_modules/draft-js/lib/DefaultDraftInlineStyle.js");

var DraftEditorCompositionHandler = __webpack_require__(/*! ./DraftEditorCompositionHandler */ "./node_modules/draft-js/lib/DraftEditorCompositionHandler.js");

var DraftEditorContents = __webpack_require__(/*! ./DraftEditorContents.react */ "./node_modules/draft-js/lib/DraftEditorContents.react.js");

var DraftEditorDragHandler = __webpack_require__(/*! ./DraftEditorDragHandler */ "./node_modules/draft-js/lib/DraftEditorDragHandler.js");

var DraftEditorEditHandler = __webpack_require__(/*! ./DraftEditorEditHandler */ "./node_modules/draft-js/lib/DraftEditorEditHandler.js");

var flushControlled = __webpack_require__(/*! ./DraftEditorFlushControlled */ "./node_modules/draft-js/lib/DraftEditorFlushControlled.js");

var DraftEditorPlaceholder = __webpack_require__(/*! ./DraftEditorPlaceholder.react */ "./node_modules/draft-js/lib/DraftEditorPlaceholder.react.js");

var DraftEffects = __webpack_require__(/*! ./DraftEffects */ "./node_modules/draft-js/lib/DraftEffects.js");

var EditorState = __webpack_require__(/*! ./EditorState */ "./node_modules/draft-js/lib/EditorState.js");

var React = __webpack_require__(/*! react */ "./node_modules/react/index.js");

var Scroll = __webpack_require__(/*! fbjs/lib/Scroll */ "./node_modules/fbjs/lib/Scroll.js");

var Style = __webpack_require__(/*! fbjs/lib/Style */ "./node_modules/fbjs/lib/Style.js");

var UserAgent = __webpack_require__(/*! fbjs/lib/UserAgent */ "./node_modules/fbjs/lib/UserAgent.js");

var cx = __webpack_require__(/*! fbjs/lib/cx */ "./node_modules/fbjs/lib/cx.js");

var generateRandomKey = __webpack_require__(/*! ./generateRandomKey */ "./node_modules/draft-js/lib/generateRandomKey.js");

var getDefaultKeyBinding = __webpack_require__(/*! ./getDefaultKeyBinding */ "./node_modules/draft-js/lib/getDefaultKeyBinding.js");

var getScrollPosition = __webpack_require__(/*! fbjs/lib/getScrollPosition */ "./node_modules/fbjs/lib/getScrollPosition.js");

var gkx = __webpack_require__(/*! ./gkx */ "./node_modules/draft-js/lib/gkx.js");

var invariant = __webpack_require__(/*! fbjs/lib/invariant */ "./node_modules/fbjs/lib/invariant.js");

var isHTMLElement = __webpack_require__(/*! ./isHTMLElement */ "./node_modules/draft-js/lib/isHTMLElement.js");

var nullthrows = __webpack_require__(/*! fbjs/lib/nullthrows */ "./node_modules/fbjs/lib/nullthrows.js");

var isIE = UserAgent.isBrowser('IE'); // IE does not support the `input` event on contentEditable, so we can't
// observe spellcheck behavior.

var allowSpellCheck = !isIE; // Define a set of handler objects to correspond to each possible `mode`
// of editor behavior.

var handlerMap = {
  edit: DraftEditorEditHandler,
  composite: DraftEditorCompositionHandler,
  drag: DraftEditorDragHandler,
  cut: null,
  render: null
};
var didInitODS = false;

var UpdateDraftEditorFlags = /*#__PURE__*/function (_React$Component) {
  _inheritsLoose(UpdateDraftEditorFlags, _React$Component);

  function UpdateDraftEditorFlags() {
    return _React$Component.apply(this, arguments) || this;
  }

  var _proto = UpdateDraftEditorFlags.prototype;

  _proto.render = function render() {
    return null;
  };

  _proto.componentDidMount = function componentDidMount() {
    this._update();
  };

  _proto.componentDidUpdate = function componentDidUpdate() {
    this._update();
  };

  _proto._update = function _update() {
    var editor = this.props.editor;
    /**
     * Sometimes a render triggers a 'focus' or other event, and that will
     * schedule a second render pass.
     * In order to make sure the second render pass gets the latest editor
     * state, we update it here.
     * Example:
     * render #1
     * +
     * |
     * | cWU -> Nothing ... latestEditorState = STALE_STATE :(
     * |
     * | render -> this.props.editorState = FRESH_STATE
     * | +         *and* set latestEditorState = FRESH_STATE
     *   |
     * | |
     * | +--> triggers 'focus' event, calling 'handleFocus' with latestEditorState
     * |                                                +
     * |                                                |
     * +>cdU -> latestEditorState = FRESH_STATE         | the 'handleFocus' call schedules render #2
     *                                                  | with latestEditorState, which is FRESH_STATE
     *                                                  |
     * render #2 <--------------------------------------+
     * +
     * |
     * | cwU -> nothing updates
     * |
     * | render -> this.props.editorState = FRESH_STATE which was passed in above
     * |
     * +>cdU fires and resets latestEditorState = FRESH_STATE
     * ---
     * Note that if we don't set latestEditorState in 'render' in the above
     * diagram, then STALE_STATE gets passed to render #2.
     */

    editor._latestEditorState = this.props.editorState;
    /**
     * The reason we set this 'blockSelectEvents' flag is that  IE will fire a
     * 'selectionChange' event when we programmatically change the selection,
     * meaning it would trigger a new select event while we are in the middle
     * of updating.
     * We found that the 'selection.addRange' was what triggered the stray
     * selectionchange event in IE.
     * To be clear - we have not been able to reproduce specific bugs related
     * to this stray selection event, but have recorded logs that some
     * conditions do cause it to get bumped into during editOnSelect.
     */

    editor._blockSelectEvents = true;
  };

  return UpdateDraftEditorFlags;
}(React.Component);
/**
 * `DraftEditor` is the root editor component. It composes a `contentEditable`
 * div, and provides a wide variety of useful function props for managing the
 * state of the editor. See `DraftEditorProps` for details.
 */


var DraftEditor = /*#__PURE__*/function (_React$Component2) {
  _inheritsLoose(DraftEditor, _React$Component2);

  /**
   * Define proxies that can route events to the current handler.
   */
  function DraftEditor(props) {
    var _this;

    _this = _React$Component2.call(this, props) || this;

    _defineProperty(_assertThisInitialized(_this), "_blockSelectEvents", void 0);

    _defineProperty(_assertThisInitialized(_this), "_clipboard", void 0);

    _defineProperty(_assertThisInitialized(_this), "_handler", void 0);

    _defineProperty(_assertThisInitialized(_this), "_dragCount", void 0);

    _defineProperty(_assertThisInitialized(_this), "_internalDrag", void 0);

    _defineProperty(_assertThisInitialized(_this), "_editorKey", void 0);

    _defineProperty(_assertThisInitialized(_this), "_placeholderAccessibilityID", void 0);

    _defineProperty(_assertThisInitialized(_this), "_latestEditorState", void 0);

    _defineProperty(_assertThisInitialized(_this), "_latestCommittedEditorState", void 0);

    _defineProperty(_assertThisInitialized(_this), "_pendingStateFromBeforeInput", void 0);

    _defineProperty(_assertThisInitialized(_this), "_onBeforeInput", void 0);

    _defineProperty(_assertThisInitialized(_this), "_onBlur", void 0);

    _defineProperty(_assertThisInitialized(_this), "_onCharacterData", void 0);

    _defineProperty(_assertThisInitialized(_this), "_onCompositionEnd", void 0);

    _defineProperty(_assertThisInitialized(_this), "_onCompositionStart", void 0);

    _defineProperty(_assertThisInitialized(_this), "_onCopy", void 0);

    _defineProperty(_assertThisInitialized(_this), "_onCut", void 0);

    _defineProperty(_assertThisInitialized(_this), "_onDragEnd", void 0);

    _defineProperty(_assertThisInitialized(_this), "_onDragOver", void 0);

    _defineProperty(_assertThisInitialized(_this), "_onDragStart", void 0);

    _defineProperty(_assertThisInitialized(_this), "_onDrop", void 0);

    _defineProperty(_assertThisInitialized(_this), "_onInput", void 0);

    _defineProperty(_assertThisInitialized(_this), "_onFocus", void 0);

    _defineProperty(_assertThisInitialized(_this), "_onKeyDown", void 0);

    _defineProperty(_assertThisInitialized(_this), "_onKeyPress", void 0);

    _defineProperty(_assertThisInitialized(_this), "_onKeyUp", void 0);

    _defineProperty(_assertThisInitialized(_this), "_onMouseDown", void 0);

    _defineProperty(_assertThisInitialized(_this), "_onMouseUp", void 0);

    _defineProperty(_assertThisInitialized(_this), "_onPaste", void 0);

    _defineProperty(_assertThisInitialized(_this), "_onSelect", void 0);

    _defineProperty(_assertThisInitialized(_this), "editor", void 0);

    _defineProperty(_assertThisInitialized(_this), "editorContainer", void 0);

    _defineProperty(_assertThisInitialized(_this), "focus", void 0);

    _defineProperty(_assertThisInitialized(_this), "blur", void 0);

    _defineProperty(_assertThisInitialized(_this), "setMode", void 0);

    _defineProperty(_assertThisInitialized(_this), "exitCurrentMode", void 0);

    _defineProperty(_assertThisInitialized(_this), "restoreEditorDOM", void 0);

    _defineProperty(_assertThisInitialized(_this), "setClipboard", void 0);

    _defineProperty(_assertThisInitialized(_this), "getClipboard", void 0);

    _defineProperty(_assertThisInitialized(_this), "getEditorKey", void 0);

    _defineProperty(_assertThisInitialized(_this), "update", void 0);

    _defineProperty(_assertThisInitialized(_this), "onDragEnter", void 0);

    _defineProperty(_assertThisInitialized(_this), "onDragLeave", void 0);

    _defineProperty(_assertThisInitialized(_this), "_handleEditorContainerRef", function (node) {
      _this.editorContainer = node; // Instead of having a direct ref on the child, we'll grab it here.
      // This is safe as long as the rendered structure is static (which it is).
      // This lets the child support ref={props.editorRef} without merging refs.

      _this.editor = node !== null ? node.firstChild : null;
    });

    _defineProperty(_assertThisInitialized(_this), "focus", function (scrollPosition) {
      var editorState = _this.props.editorState;
      var alreadyHasFocus = editorState.getSelection().getHasFocus();
      var editorNode = _this.editor;

      if (!editorNode) {
        // once in a while people call 'focus' in a setTimeout, and the node has
        // been deleted, so it can be null in that case.
        return;
      }

      var scrollParent = Style.getScrollParent(editorNode);

      var _ref = scrollPosition || getScrollPosition(scrollParent),
          x = _ref.x,
          y = _ref.y;

      !isHTMLElement(editorNode) ?  true ? invariant(false, 'editorNode is not an HTMLElement') : 0 : void 0;
      editorNode.focus(); // Restore scroll position

      if (scrollParent === window) {
        window.scrollTo(x, y);
      } else {
        Scroll.setTop(scrollParent, y);
      } // On Chrome and Safari, calling focus on contenteditable focuses the
      // cursor at the first character. This is something you don't expect when
      // you're clicking on an input element but not directly on a character.
      // Put the cursor back where it was before the blur.


      if (!alreadyHasFocus) {
        _this.update(EditorState.forceSelection(editorState, editorState.getSelection()));
      }
    });

    _defineProperty(_assertThisInitialized(_this), "blur", function () {
      var editorNode = _this.editor;

      if (!editorNode) {
        return;
      }

      !isHTMLElement(editorNode) ?  true ? invariant(false, 'editorNode is not an HTMLElement') : 0 : void 0;
      editorNode.blur();
    });

    _defineProperty(_assertThisInitialized(_this), "setMode", function (mode) {
      var _this$props = _this.props,
          onPaste = _this$props.onPaste,
          onCut = _this$props.onCut,
          onCopy = _this$props.onCopy;

      var editHandler = _objectSpread({}, handlerMap.edit);

      if (onPaste) {
        /* $FlowFixMe[incompatible-type] (>=0.117.0 site=www,mobile) This comment
         * suppresses an error found when Flow v0.117 was deployed. To see the
         * error delete this comment and run Flow. */
        editHandler.onPaste = onPaste;
      }

      if (onCut) {
        editHandler.onCut = onCut;
      }

      if (onCopy) {
        editHandler.onCopy = onCopy;
      }

      var handler = _objectSpread({}, handlerMap, {
        edit: editHandler
      });

      _this._handler = handler[mode];
    });

    _defineProperty(_assertThisInitialized(_this), "exitCurrentMode", function () {
      _this.setMode('edit');
    });

    _defineProperty(_assertThisInitialized(_this), "restoreEditorDOM", function (scrollPosition) {
      _this.setState({
        contentsKey: _this.state.contentsKey + 1
      }, function () {
        _this.focus(scrollPosition);
      });
    });

    _defineProperty(_assertThisInitialized(_this), "setClipboard", function (clipboard) {
      _this._clipboard = clipboard;
    });

    _defineProperty(_assertThisInitialized(_this), "getClipboard", function () {
      return _this._clipboard;
    });

    _defineProperty(_assertThisInitialized(_this), "update", function (editorState) {
      _this._latestEditorState = editorState;

      _this.props.onChange(editorState);
    });

    _defineProperty(_assertThisInitialized(_this), "onDragEnter", function () {
      _this._dragCount++;
    });

    _defineProperty(_assertThisInitialized(_this), "onDragLeave", function () {
      _this._dragCount--;

      if (_this._dragCount === 0) {
        _this.exitCurrentMode();
      }
    });

    _this._blockSelectEvents = false;
    _this._clipboard = null;
    _this._handler = null;
    _this._dragCount = 0;
    _this._editorKey = props.editorKey || generateRandomKey();
    _this._placeholderAccessibilityID = 'placeholder-' + _this._editorKey;
    _this._latestEditorState = props.editorState;
    _this._latestCommittedEditorState = props.editorState;
    _this._onBeforeInput = _this._buildHandler('onBeforeInput');
    _this._onBlur = _this._buildHandler('onBlur');
    _this._onCharacterData = _this._buildHandler('onCharacterData');
    _this._onCompositionEnd = _this._buildHandler('onCompositionEnd');
    _this._onCompositionStart = _this._buildHandler('onCompositionStart');
    _this._onCopy = _this._buildHandler('onCopy');
    _this._onCut = _this._buildHandler('onCut');
    _this._onDragEnd = _this._buildHandler('onDragEnd');
    _this._onDragOver = _this._buildHandler('onDragOver');
    _this._onDragStart = _this._buildHandler('onDragStart');
    _this._onDrop = _this._buildHandler('onDrop');
    _this._onInput = _this._buildHandler('onInput');
    _this._onFocus = _this._buildHandler('onFocus');
    _this._onKeyDown = _this._buildHandler('onKeyDown');
    _this._onKeyPress = _this._buildHandler('onKeyPress');
    _this._onKeyUp = _this._buildHandler('onKeyUp');
    _this._onMouseDown = _this._buildHandler('onMouseDown');
    _this._onMouseUp = _this._buildHandler('onMouseUp');
    _this._onPaste = _this._buildHandler('onPaste');
    _this._onSelect = _this._buildHandler('onSelect');

    _this.getEditorKey = function () {
      return _this._editorKey;
    };

    if (true) {
      ['onDownArrow', 'onEscape', 'onLeftArrow', 'onRightArrow', 'onTab', 'onUpArrow'].forEach(function (propName) {
        if (props.hasOwnProperty(propName)) {
          // eslint-disable-next-line no-console
          console.warn("Supplying an `".concat(propName, "` prop to `DraftEditor` has ") + 'been deprecated. If your handler needs access to the keyboard ' + 'event, supply a custom `keyBindingFn` prop that falls back to ' + 'the default one (eg. https://is.gd/wHKQ3W).');
        }
      });
    } // See `restoreEditorDOM()`.


    _this.state = {
      contentsKey: 0
    };
    return _this;
  }
  /**
   * Build a method that will pass the event to the specified handler method.
   * This allows us to look up the correct handler function for the current
   * editor mode, if any has been specified.
   */


  var _proto2 = DraftEditor.prototype;

  _proto2._buildHandler = function _buildHandler(eventName) {
    var _this2 = this;

    // Wrap event handlers in `flushControlled`. In sync mode, this is
    // effectively a no-op. In async mode, this ensures all updates scheduled
    // inside the handler are flushed before React yields to the browser.
    return function (e) {
      if (!_this2.props.readOnly) {
        var method = _this2._handler && _this2._handler[eventName];

        if (method) {
          if (flushControlled) {
            flushControlled(function () {
              return method(_this2, e);
            });
          } else {
            method(_this2, e);
          }
        }
      }
    };
  };

  _proto2._showPlaceholder = function _showPlaceholder() {
    return !!this.props.placeholder && !this.props.editorState.isInCompositionMode() && !this.props.editorState.getCurrentContent().hasText();
  };

  _proto2._renderPlaceholder = function _renderPlaceholder() {
    if (this._showPlaceholder()) {
      var placeHolderProps = {
        text: nullthrows(this.props.placeholder),
        editorState: this.props.editorState,
        textAlignment: this.props.textAlignment,
        accessibilityID: this._placeholderAccessibilityID
      };
      /* $FlowFixMe[incompatible-type] (>=0.112.0 site=www,mobile) This comment
       * suppresses an error found when Flow v0.112 was deployed. To see the
       * error delete this comment and run Flow. */

      return React.createElement(DraftEditorPlaceholder, placeHolderProps);
    }

    return null;
  }
  /**
   * returns ariaDescribedBy prop with '{{editor_id_placeholder}}' replaced with
   * the DOM id of the placeholder (if it exists)
   * @returns aria-describedby attribute value
   */
  ;

  _proto2._renderARIADescribedBy = function _renderARIADescribedBy() {
    var describedBy = this.props.ariaDescribedBy || '';
    var placeholderID = this._showPlaceholder() ? this._placeholderAccessibilityID : '';
    return describedBy.replace('{{editor_id_placeholder}}', placeholderID) || undefined;
  };

  _proto2.render = function render() {
    var _this$props2 = this.props,
        blockRenderMap = _this$props2.blockRenderMap,
        blockRendererFn = _this$props2.blockRendererFn,
        blockStyleFn = _this$props2.blockStyleFn,
        customStyleFn = _this$props2.customStyleFn,
        customStyleMap = _this$props2.customStyleMap,
        editorState = _this$props2.editorState,
        preventScroll = _this$props2.preventScroll,
        readOnly = _this$props2.readOnly,
        textAlignment = _this$props2.textAlignment,
        textDirectionality = _this$props2.textDirectionality;
    var rootClass = cx({
      'DraftEditor/root': true,
      'DraftEditor/alignLeft': textAlignment === 'left',
      'DraftEditor/alignRight': textAlignment === 'right',
      'DraftEditor/alignCenter': textAlignment === 'center'
    });
    var contentStyle = {
      outline: 'none',
      // fix parent-draggable Safari bug. #1326
      userSelect: 'text',
      WebkitUserSelect: 'text',
      whiteSpace: 'pre-wrap',
      wordWrap: 'break-word'
    }; // The aria-expanded and aria-haspopup properties should only be rendered
    // for a combobox.

    /* $FlowFixMe[prop-missing] (>=0.68.0 site=www,mobile) This comment
     * suppresses an error found when Flow v0.68 was deployed. To see the error
     * delete this comment and run Flow. */

    var ariaRole = this.props.role || 'textbox';
    var ariaExpanded = ariaRole === 'combobox' ? !!this.props.ariaExpanded : null;
    var editorContentsProps = {
      blockRenderMap: blockRenderMap,
      blockRendererFn: blockRendererFn,
      blockStyleFn: blockStyleFn,
      customStyleMap: _objectSpread({}, DefaultDraftInlineStyle, customStyleMap),
      customStyleFn: customStyleFn,
      editorKey: this._editorKey,
      editorState: editorState,
      preventScroll: preventScroll,
      textDirectionality: textDirectionality
    };
    return React.createElement("div", {
      className: rootClass
    }, this._renderPlaceholder(), React.createElement("div", {
      className: cx('DraftEditor/editorContainer'),
      ref: this._handleEditorContainerRef
    }, React.createElement("div", {
      "aria-activedescendant": readOnly ? null : this.props.ariaActiveDescendantID,
      "aria-autocomplete": readOnly ? null : this.props.ariaAutoComplete,
      "aria-controls": readOnly ? null : this.props.ariaControls,
      "aria-describedby": this._renderARIADescribedBy(),
      "aria-expanded": readOnly ? null : ariaExpanded,
      "aria-label": this.props.ariaLabel,
      "aria-labelledby": this.props.ariaLabelledBy,
      "aria-multiline": this.props.ariaMultiline,
      "aria-owns": readOnly ? null : this.props.ariaOwneeID,
      autoCapitalize: this.props.autoCapitalize,
      autoComplete: this.props.autoComplete,
      autoCorrect: this.props.autoCorrect,
      className: cx({
        // Chrome's built-in translation feature mutates the DOM in ways
        // that Draft doesn't expect (ex: adding <font> tags inside
        // DraftEditorLeaf spans) and causes problems. We add notranslate
        // here which makes its autotranslation skip over this subtree.
        notranslate: !readOnly,
        'public/DraftEditor/content': true
      }),
      contentEditable: !readOnly,
      "data-testid": this.props.webDriverTestID,
      onBeforeInput: this._onBeforeInput,
      onBlur: this._onBlur,
      onCompositionEnd: this._onCompositionEnd,
      onCompositionStart: this._onCompositionStart,
      onCopy: this._onCopy,
      onCut: this._onCut,
      onDragEnd: this._onDragEnd,
      onDragEnter: this.onDragEnter,
      onDragLeave: this.onDragLeave,
      onDragOver: this._onDragOver,
      onDragStart: this._onDragStart,
      onDrop: this._onDrop,
      onFocus: this._onFocus,
      onInput: this._onInput,
      onKeyDown: this._onKeyDown,
      onKeyPress: this._onKeyPress,
      onKeyUp: this._onKeyUp,
      onMouseUp: this._onMouseUp,
      onPaste: this._onPaste,
      onSelect: this._onSelect,
      ref: this.props.editorRef,
      role: readOnly ? null : ariaRole,
      spellCheck: allowSpellCheck && this.props.spellCheck,
      style: contentStyle,
      suppressContentEditableWarning: true,
      tabIndex: this.props.tabIndex
    }, React.createElement(UpdateDraftEditorFlags, {
      editor: this,
      editorState: editorState
    }), React.createElement(DraftEditorContents, _extends({}, editorContentsProps, {
      key: 'contents' + this.state.contentsKey
    })))));
  };

  _proto2.componentDidMount = function componentDidMount() {
    this._blockSelectEvents = false;

    if (!didInitODS && gkx('draft_ods_enabled')) {
      didInitODS = true;
      DraftEffects.initODS();
    }

    this.setMode('edit');
    /**
     * IE has a hardcoded "feature" that attempts to convert link text into
     * anchors in contentEditable DOM. This breaks the editor's expectations of
     * the DOM, and control is lost. Disable it to make IE behave.
     * See: http://blogs.msdn.com/b/ieinternals/archive/2010/09/15/
     * ie9-beta-minor-change-list.aspx
     */

    if (isIE) {
      // editor can be null after mounting
      // https://stackoverflow.com/questions/44074747/componentdidmount-called-before-ref-callback
      if (!this.editor) {
        __webpack_require__.g.execCommand('AutoUrlDetect', false, false);
      } else {
        this.editor.ownerDocument.execCommand('AutoUrlDetect', false, false);
      }
    }
  };

  _proto2.componentDidUpdate = function componentDidUpdate() {
    this._blockSelectEvents = false;
    this._latestEditorState = this.props.editorState;
    this._latestCommittedEditorState = this.props.editorState;
  }
  /**
   * Used via `this.focus()`.
   *
   * Force focus back onto the editor node.
   *
   * We attempt to preserve scroll position when focusing. You can also pass
   * a specified scroll position (for cases like `cut` behavior where it should
   * be restored to a known position).
   */
  ;

  return DraftEditor;
}(React.Component);

_defineProperty(DraftEditor, "defaultProps", {
  ariaDescribedBy: '{{editor_id_placeholder}}',
  blockRenderMap: DefaultDraftBlockRenderMap,
  blockRendererFn: function blockRendererFn() {
    return null;
  },
  blockStyleFn: function blockStyleFn() {
    return '';
  },
  keyBindingFn: getDefaultKeyBinding,
  readOnly: false,
  spellCheck: false,
  stripPastedStyles: false
});

module.exports = DraftEditor;

/***/ }),

/***/ "./node_modules/draft-js/lib/DraftEditorBlock.react.js":
/*!*************************************************************!*\
  !*** ./node_modules/draft-js/lib/DraftEditorBlock.react.js ***!
  \*************************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";
/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @format
 * 
 * @emails oncall+draft_js
 */


var _assign = __webpack_require__(/*! object-assign */ "./node_modules/object-assign/index.js");

function _extends() { _extends = _assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _inheritsLoose(subClass, superClass) { subClass.prototype = Object.create(superClass.prototype); subClass.prototype.constructor = subClass; subClass.__proto__ = superClass; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var DraftEditorLeaf = __webpack_require__(/*! ./DraftEditorLeaf.react */ "./node_modules/draft-js/lib/DraftEditorLeaf.react.js");

var DraftOffsetKey = __webpack_require__(/*! ./DraftOffsetKey */ "./node_modules/draft-js/lib/DraftOffsetKey.js");

var React = __webpack_require__(/*! react */ "./node_modules/react/index.js");

var Scroll = __webpack_require__(/*! fbjs/lib/Scroll */ "./node_modules/fbjs/lib/Scroll.js");

var Style = __webpack_require__(/*! fbjs/lib/Style */ "./node_modules/fbjs/lib/Style.js");

var UnicodeBidi = __webpack_require__(/*! fbjs/lib/UnicodeBidi */ "./node_modules/fbjs/lib/UnicodeBidi.js");

var UnicodeBidiDirection = __webpack_require__(/*! fbjs/lib/UnicodeBidiDirection */ "./node_modules/fbjs/lib/UnicodeBidiDirection.js");

var cx = __webpack_require__(/*! fbjs/lib/cx */ "./node_modules/fbjs/lib/cx.js");

var getElementPosition = __webpack_require__(/*! fbjs/lib/getElementPosition */ "./node_modules/fbjs/lib/getElementPosition.js");

var getScrollPosition = __webpack_require__(/*! fbjs/lib/getScrollPosition */ "./node_modules/fbjs/lib/getScrollPosition.js");

var getViewportDimensions = __webpack_require__(/*! fbjs/lib/getViewportDimensions */ "./node_modules/fbjs/lib/getViewportDimensions.js");

var invariant = __webpack_require__(/*! fbjs/lib/invariant */ "./node_modules/fbjs/lib/invariant.js");

var isHTMLElement = __webpack_require__(/*! ./isHTMLElement */ "./node_modules/draft-js/lib/isHTMLElement.js");

var nullthrows = __webpack_require__(/*! fbjs/lib/nullthrows */ "./node_modules/fbjs/lib/nullthrows.js");

var SCROLL_BUFFER = 10;

/**
 * Return whether a block overlaps with either edge of the `SelectionState`.
 */
var isBlockOnSelectionEdge = function isBlockOnSelectionEdge(selection, key) {
  return selection.getAnchorKey() === key || selection.getFocusKey() === key;
};
/**
 * The default block renderer for a `DraftEditor` component.
 *
 * A `DraftEditorBlock` is able to render a given `ContentBlock` to its
 * appropriate decorator and inline style components.
 */


var DraftEditorBlock = /*#__PURE__*/function (_React$Component) {
  _inheritsLoose(DraftEditorBlock, _React$Component);

  function DraftEditorBlock() {
    var _this;

    for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    _this = _React$Component.call.apply(_React$Component, [this].concat(args)) || this;

    _defineProperty(_assertThisInitialized(_this), "_node", void 0);

    return _this;
  }

  var _proto = DraftEditorBlock.prototype;

  _proto.shouldComponentUpdate = function shouldComponentUpdate(nextProps) {
    return this.props.block !== nextProps.block || this.props.tree !== nextProps.tree || this.props.direction !== nextProps.direction || isBlockOnSelectionEdge(nextProps.selection, nextProps.block.getKey()) && nextProps.forceSelection;
  }
  /**
   * When a block is mounted and overlaps the selection state, we need to make
   * sure that the cursor is visible to match native behavior. This may not
   * be the case if the user has pressed `RETURN` or pasted some content, since
   * programmatically creating these new blocks and setting the DOM selection
   * will miss out on the browser natively scrolling to that position.
   *
   * To replicate native behavior, if the block overlaps the selection state
   * on mount, force the scroll position. Check the scroll state of the scroll
   * parent, and adjust it to align the entire block to the bottom of the
   * scroll parent.
   */
  ;

  _proto.componentDidMount = function componentDidMount() {
    if (this.props.preventScroll) {
      return;
    }

    var selection = this.props.selection;
    var endKey = selection.getEndKey();

    if (!selection.getHasFocus() || endKey !== this.props.block.getKey()) {
      return;
    }

    var blockNode = this._node;

    if (blockNode == null) {
      return;
    }

    var scrollParent = Style.getScrollParent(blockNode);
    var scrollPosition = getScrollPosition(scrollParent);
    var scrollDelta;

    if (scrollParent === window) {
      var nodePosition = getElementPosition(blockNode);
      var nodeBottom = nodePosition.y + nodePosition.height;
      var viewportHeight = getViewportDimensions().height;
      scrollDelta = nodeBottom - viewportHeight;

      if (scrollDelta > 0) {
        window.scrollTo(scrollPosition.x, scrollPosition.y + scrollDelta + SCROLL_BUFFER);
      }
    } else {
      !isHTMLElement(blockNode) ?  true ? invariant(false, 'blockNode is not an HTMLElement') : 0 : void 0;
      var blockBottom = blockNode.offsetHeight + blockNode.offsetTop;
      var pOffset = scrollParent.offsetTop + scrollParent.offsetHeight;
      var scrollBottom = pOffset + scrollPosition.y;
      scrollDelta = blockBottom - scrollBottom;

      if (scrollDelta > 0) {
        Scroll.setTop(scrollParent, Scroll.getTop(scrollParent) + scrollDelta + SCROLL_BUFFER);
      }
    }
  };

  _proto._renderChildren = function _renderChildren() {
    var _this2 = this;

    var block = this.props.block;
    var blockKey = block.getKey();
    var text = block.getText();
    var lastLeafSet = this.props.tree.size - 1;
    var hasSelection = isBlockOnSelectionEdge(this.props.selection, blockKey);
    return this.props.tree.map(function (leafSet, ii) {
      var leavesForLeafSet = leafSet.get('leaves'); // T44088704

      if (leavesForLeafSet.size === 0) {
        return null;
      }

      var lastLeaf = leavesForLeafSet.size - 1;
      var leaves = leavesForLeafSet.map(function (leaf, jj) {
        var offsetKey = DraftOffsetKey.encode(blockKey, ii, jj);
        var start = leaf.get('start');
        var end = leaf.get('end');
        return React.createElement(DraftEditorLeaf, {
          key: offsetKey,
          offsetKey: offsetKey,
          block: block,
          start: start,
          selection: hasSelection ? _this2.props.selection : null,
          forceSelection: _this2.props.forceSelection,
          text: text.slice(start, end),
          styleSet: block.getInlineStyleAt(start),
          customStyleMap: _this2.props.customStyleMap,
          customStyleFn: _this2.props.customStyleFn,
          isLast: ii === lastLeafSet && jj === lastLeaf
        });
      }).toArray();
      var decoratorKey = leafSet.get('decoratorKey');

      if (decoratorKey == null) {
        return leaves;
      }

      if (!_this2.props.decorator) {
        return leaves;
      }

      var decorator = nullthrows(_this2.props.decorator);
      var DecoratorComponent = decorator.getComponentForKey(decoratorKey);

      if (!DecoratorComponent) {
        return leaves;
      }

      var decoratorProps = decorator.getPropsForKey(decoratorKey);
      var decoratorOffsetKey = DraftOffsetKey.encode(blockKey, ii, 0);
      var start = leavesForLeafSet.first().get('start');
      var end = leavesForLeafSet.last().get('end');
      var decoratedText = text.slice(start, end);
      var entityKey = block.getEntityAt(leafSet.get('start')); // Resetting dir to the same value on a child node makes Chrome/Firefox
      // confused on cursor movement. See http://jsfiddle.net/d157kLck/3/

      var dir = UnicodeBidiDirection.getHTMLDirIfDifferent(UnicodeBidi.getDirection(decoratedText), _this2.props.direction);
      var commonProps = {
        contentState: _this2.props.contentState,
        decoratedText: decoratedText,
        dir: dir,
        start: start,
        end: end,
        blockKey: blockKey,
        entityKey: entityKey,
        offsetKey: decoratorOffsetKey
      };
      return React.createElement(DecoratorComponent, _extends({}, decoratorProps, commonProps, {
        key: decoratorOffsetKey
      }), leaves);
    }).toArray();
  };

  _proto.render = function render() {
    var _this3 = this;

    var _this$props = this.props,
        direction = _this$props.direction,
        offsetKey = _this$props.offsetKey;
    var className = cx({
      'public/DraftStyleDefault/block': true,
      'public/DraftStyleDefault/ltr': direction === 'LTR',
      'public/DraftStyleDefault/rtl': direction === 'RTL'
    });
    return React.createElement("div", {
      "data-offset-key": offsetKey,
      className: className,
      ref: function ref(_ref) {
        return _this3._node = _ref;
      }
    }, this._renderChildren());
  };

  return DraftEditorBlock;
}(React.Component);

module.exports = DraftEditorBlock;

/***/ }),

/***/ "./node_modules/draft-js/lib/DraftEditorBlockNode.react.js":
/*!*****************************************************************!*\
  !*** ./node_modules/draft-js/lib/DraftEditorBlockNode.react.js ***!
  \*****************************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";
/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @format
 * 
 * @emails oncall+draft_js
 *
 * This file is a fork of DraftEditorBlock.react.js and DraftEditorContents.react.js
 *
 * This is unstable and not part of the public API and should not be used by
 * production systems. This file may be update/removed without notice.
 */


var _assign = __webpack_require__(/*! object-assign */ "./node_modules/object-assign/index.js");

function _extends() { _extends = _assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _inheritsLoose(subClass, superClass) { subClass.prototype = Object.create(superClass.prototype); subClass.prototype.constructor = subClass; subClass.__proto__ = superClass; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; var ownKeys = Object.keys(source); if (typeof Object.getOwnPropertySymbols === 'function') { ownKeys = ownKeys.concat(Object.getOwnPropertySymbols(source).filter(function (sym) { return Object.getOwnPropertyDescriptor(source, sym).enumerable; })); } ownKeys.forEach(function (key) { _defineProperty(target, key, source[key]); }); } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var DraftEditorNode = __webpack_require__(/*! ./DraftEditorNode.react */ "./node_modules/draft-js/lib/DraftEditorNode.react.js");

var DraftOffsetKey = __webpack_require__(/*! ./DraftOffsetKey */ "./node_modules/draft-js/lib/DraftOffsetKey.js");

var React = __webpack_require__(/*! react */ "./node_modules/react/index.js");

var Scroll = __webpack_require__(/*! fbjs/lib/Scroll */ "./node_modules/fbjs/lib/Scroll.js");

var Style = __webpack_require__(/*! fbjs/lib/Style */ "./node_modules/fbjs/lib/Style.js");

var getElementPosition = __webpack_require__(/*! fbjs/lib/getElementPosition */ "./node_modules/fbjs/lib/getElementPosition.js");

var getScrollPosition = __webpack_require__(/*! fbjs/lib/getScrollPosition */ "./node_modules/fbjs/lib/getScrollPosition.js");

var getViewportDimensions = __webpack_require__(/*! fbjs/lib/getViewportDimensions */ "./node_modules/fbjs/lib/getViewportDimensions.js");

var Immutable = __webpack_require__(/*! immutable */ "./node_modules/draft-js/node_modules/immutable/dist/immutable.js");

var invariant = __webpack_require__(/*! fbjs/lib/invariant */ "./node_modules/fbjs/lib/invariant.js");

var isHTMLElement = __webpack_require__(/*! ./isHTMLElement */ "./node_modules/draft-js/lib/isHTMLElement.js");

var SCROLL_BUFFER = 10;
var List = Immutable.List; // we should harden up the bellow flow types to make them more strict

/**
 * Return whether a block overlaps with either edge of the `SelectionState`.
 */
var isBlockOnSelectionEdge = function isBlockOnSelectionEdge(selection, key) {
  return selection.getAnchorKey() === key || selection.getFocusKey() === key;
};
/**
 * We will use this helper to identify blocks that need to be wrapped but have siblings that
 * also share the same wrapper element, this way we can do the wrapping once the last sibling
 * is added.
 */


var shouldNotAddWrapperElement = function shouldNotAddWrapperElement(block, contentState) {
  var nextSiblingKey = block.getNextSiblingKey();
  return nextSiblingKey ? contentState.getBlockForKey(nextSiblingKey).getType() === block.getType() : false;
};

var applyWrapperElementToSiblings = function applyWrapperElementToSiblings(wrapperTemplate, Element, nodes) {
  var wrappedSiblings = []; // we check back until we find a sibling that does not have same wrapper

  var _iteratorNormalCompletion = true;
  var _didIteratorError = false;
  var _iteratorError = undefined;

  try {
    for (var _iterator = nodes.reverse()[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
      var sibling = _step.value;

      if (sibling.type !== Element) {
        break;
      }

      wrappedSiblings.push(sibling);
    } // we now should remove from acc the wrappedSiblings and add them back under same wrap

  } catch (err) {
    _didIteratorError = true;
    _iteratorError = err;
  } finally {
    try {
      if (!_iteratorNormalCompletion && _iterator["return"] != null) {
        _iterator["return"]();
      }
    } finally {
      if (_didIteratorError) {
        throw _iteratorError;
      }
    }
  }

  nodes.splice(nodes.indexOf(wrappedSiblings[0]), wrappedSiblings.length + 1);
  var childrenIs = wrappedSiblings.reverse();
  var key = childrenIs[0].key;
  nodes.push(React.cloneElement(wrapperTemplate, {
    key: "".concat(key, "-wrap"),
    'data-offset-key': DraftOffsetKey.encode(key, 0, 0)
  }, childrenIs));
  return nodes;
};

var getDraftRenderConfig = function getDraftRenderConfig(block, blockRenderMap) {
  var configForType = blockRenderMap.get(block.getType()) || blockRenderMap.get('unstyled');
  var wrapperTemplate = configForType.wrapper;
  var Element = configForType.element || blockRenderMap.get('unstyled').element;
  return {
    Element: Element,
    wrapperTemplate: wrapperTemplate
  };
};

var getCustomRenderConfig = function getCustomRenderConfig(block, blockRendererFn) {
  var customRenderer = blockRendererFn(block);

  if (!customRenderer) {
    return {};
  }

  var CustomComponent = customRenderer.component,
      customProps = customRenderer.props,
      customEditable = customRenderer.editable;
  return {
    CustomComponent: CustomComponent,
    customProps: customProps,
    customEditable: customEditable
  };
};

var getElementPropsConfig = function getElementPropsConfig(block, editorKey, offsetKey, blockStyleFn, customConfig, ref) {
  var elementProps = {
    'data-block': true,
    'data-editor': editorKey,
    'data-offset-key': offsetKey,
    key: block.getKey(),
    ref: ref
  };
  var customClass = blockStyleFn(block);

  if (customClass) {
    elementProps.className = customClass;
  }

  if (customConfig.customEditable !== undefined) {
    elementProps = _objectSpread({}, elementProps, {
      contentEditable: customConfig.customEditable,
      suppressContentEditableWarning: true
    });
  }

  return elementProps;
};

var DraftEditorBlockNode = /*#__PURE__*/function (_React$Component) {
  _inheritsLoose(DraftEditorBlockNode, _React$Component);

  function DraftEditorBlockNode() {
    var _this;

    for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    _this = _React$Component.call.apply(_React$Component, [this].concat(args)) || this;

    _defineProperty(_assertThisInitialized(_this), "wrapperRef", React.createRef());

    return _this;
  }

  var _proto = DraftEditorBlockNode.prototype;

  _proto.shouldComponentUpdate = function shouldComponentUpdate(nextProps) {
    var _this$props = this.props,
        block = _this$props.block,
        direction = _this$props.direction,
        tree = _this$props.tree;
    var isContainerNode = !block.getChildKeys().isEmpty();
    var blockHasChanged = block !== nextProps.block || tree !== nextProps.tree || direction !== nextProps.direction || isBlockOnSelectionEdge(nextProps.selection, nextProps.block.getKey()) && nextProps.forceSelection; // if we have children at this stage we always re-render container nodes
    // else if its a root node we avoid re-rendering by checking for block updates

    return isContainerNode || blockHasChanged;
  }
  /**
   * When a block is mounted and overlaps the selection state, we need to make
   * sure that the cursor is visible to match native behavior. This may not
   * be the case if the user has pressed `RETURN` or pasted some content, since
   * programatically creating these new blocks and setting the DOM selection
   * will miss out on the browser natively scrolling to that position.
   *
   * To replicate native behavior, if the block overlaps the selection state
   * on mount, force the scroll position. Check the scroll state of the scroll
   * parent, and adjust it to align the entire block to the bottom of the
   * scroll parent.
   */
  ;

  _proto.componentDidMount = function componentDidMount() {
    var selection = this.props.selection;
    var endKey = selection.getEndKey();

    if (!selection.getHasFocus() || endKey !== this.props.block.getKey()) {
      return;
    }

    var blockNode = this.wrapperRef.current;

    if (!blockNode) {
      // This Block Node was rendered without a wrapper element.
      return;
    }

    var scrollParent = Style.getScrollParent(blockNode);
    var scrollPosition = getScrollPosition(scrollParent);
    var scrollDelta;

    if (scrollParent === window) {
      var nodePosition = getElementPosition(blockNode);
      var nodeBottom = nodePosition.y + nodePosition.height;
      var viewportHeight = getViewportDimensions().height;
      scrollDelta = nodeBottom - viewportHeight;

      if (scrollDelta > 0) {
        window.scrollTo(scrollPosition.x, scrollPosition.y + scrollDelta + SCROLL_BUFFER);
      }
    } else {
      !isHTMLElement(blockNode) ?  true ? invariant(false, 'blockNode is not an HTMLElement') : 0 : void 0;
      var htmlBlockNode = blockNode;
      var blockBottom = htmlBlockNode.offsetHeight + htmlBlockNode.offsetTop;
      var scrollBottom = scrollParent.offsetHeight + scrollPosition.y;
      scrollDelta = blockBottom - scrollBottom;

      if (scrollDelta > 0) {
        Scroll.setTop(scrollParent, Scroll.getTop(scrollParent) + scrollDelta + SCROLL_BUFFER);
      }
    }
  };

  _proto.render = function render() {
    var _this2 = this;

    var _this$props2 = this.props,
        block = _this$props2.block,
        blockRenderMap = _this$props2.blockRenderMap,
        blockRendererFn = _this$props2.blockRendererFn,
        blockStyleFn = _this$props2.blockStyleFn,
        contentState = _this$props2.contentState,
        decorator = _this$props2.decorator,
        editorKey = _this$props2.editorKey,
        editorState = _this$props2.editorState,
        customStyleFn = _this$props2.customStyleFn,
        customStyleMap = _this$props2.customStyleMap,
        direction = _this$props2.direction,
        forceSelection = _this$props2.forceSelection,
        selection = _this$props2.selection,
        tree = _this$props2.tree;
    var children = null;

    if (block.children.size) {
      children = block.children.reduce(function (acc, key) {
        var offsetKey = DraftOffsetKey.encode(key, 0, 0);
        var child = contentState.getBlockForKey(key);
        var customConfig = getCustomRenderConfig(child, blockRendererFn);
        var Component = customConfig.CustomComponent || DraftEditorBlockNode;

        var _getDraftRenderConfig = getDraftRenderConfig(child, blockRenderMap),
            Element = _getDraftRenderConfig.Element,
            wrapperTemplate = _getDraftRenderConfig.wrapperTemplate;

        var elementProps = getElementPropsConfig(child, editorKey, offsetKey, blockStyleFn, customConfig, null);

        var childProps = _objectSpread({}, _this2.props, {
          tree: editorState.getBlockTree(key),
          blockProps: customConfig.customProps,
          offsetKey: offsetKey,
          block: child
        });

        acc.push(React.createElement(Element, elementProps, React.createElement(Component, childProps)));

        if (!wrapperTemplate || shouldNotAddWrapperElement(child, contentState)) {
          return acc;
        } // if we are here it means we are the last block
        // that has a wrapperTemplate so we should wrap itself
        // and all other previous siblings that share the same wrapper


        applyWrapperElementToSiblings(wrapperTemplate, Element, acc);
        return acc;
      }, []);
    }

    var blockKey = block.getKey();
    var offsetKey = DraftOffsetKey.encode(blockKey, 0, 0);
    var customConfig = getCustomRenderConfig(block, blockRendererFn);
    var Component = customConfig.CustomComponent;
    var blockNode = Component != null ? React.createElement(Component, _extends({}, this.props, {
      tree: editorState.getBlockTree(blockKey),
      blockProps: customConfig.customProps,
      offsetKey: offsetKey,
      block: block
    })) : React.createElement(DraftEditorNode, {
      block: block,
      children: children,
      contentState: contentState,
      customStyleFn: customStyleFn,
      customStyleMap: customStyleMap,
      decorator: decorator,
      direction: direction,
      forceSelection: forceSelection,
      hasSelection: isBlockOnSelectionEdge(selection, blockKey),
      selection: selection,
      tree: tree
    });

    if (block.getParentKey()) {
      return blockNode;
    }

    var _getDraftRenderConfig2 = getDraftRenderConfig(block, blockRenderMap),
        Element = _getDraftRenderConfig2.Element;

    var elementProps = getElementPropsConfig(block, editorKey, offsetKey, blockStyleFn, customConfig, this.wrapperRef); // root block nodes needs to be wrapped

    return React.createElement(Element, elementProps, blockNode);
  };

  return DraftEditorBlockNode;
}(React.Component);

module.exports = DraftEditorBlockNode;

/***/ }),

/***/ "./node_modules/draft-js/lib/DraftEditorCompositionHandler.js":
/*!********************************************************************!*\
  !*** ./node_modules/draft-js/lib/DraftEditorCompositionHandler.js ***!
  \********************************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";
/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @format
 * 
 * @emails oncall+draft_js
 */


var DOMObserver = __webpack_require__(/*! ./DOMObserver */ "./node_modules/draft-js/lib/DOMObserver.js");

var DraftModifier = __webpack_require__(/*! ./DraftModifier */ "./node_modules/draft-js/lib/DraftModifier.js");

var DraftOffsetKey = __webpack_require__(/*! ./DraftOffsetKey */ "./node_modules/draft-js/lib/DraftOffsetKey.js");

var EditorState = __webpack_require__(/*! ./EditorState */ "./node_modules/draft-js/lib/EditorState.js");

var Keys = __webpack_require__(/*! fbjs/lib/Keys */ "./node_modules/fbjs/lib/Keys.js");

var UserAgent = __webpack_require__(/*! fbjs/lib/UserAgent */ "./node_modules/fbjs/lib/UserAgent.js");

var editOnSelect = __webpack_require__(/*! ./editOnSelect */ "./node_modules/draft-js/lib/editOnSelect.js");

var getContentEditableContainer = __webpack_require__(/*! ./getContentEditableContainer */ "./node_modules/draft-js/lib/getContentEditableContainer.js");

var getDraftEditorSelection = __webpack_require__(/*! ./getDraftEditorSelection */ "./node_modules/draft-js/lib/getDraftEditorSelection.js");

var getEntityKeyForSelection = __webpack_require__(/*! ./getEntityKeyForSelection */ "./node_modules/draft-js/lib/getEntityKeyForSelection.js");

var nullthrows = __webpack_require__(/*! fbjs/lib/nullthrows */ "./node_modules/fbjs/lib/nullthrows.js");

var isIE = UserAgent.isBrowser('IE');
/**
 * Millisecond delay to allow `compositionstart` to fire again upon
 * `compositionend`.
 *
 * This is used for Korean input to ensure that typing can continue without
 * the editor trying to render too quickly. More specifically, Safari 7.1+
 * triggers `compositionstart` a little slower than Chrome/FF, which
 * leads to composed characters being resolved and re-render occurring
 * sooner than we want.
 */

var RESOLVE_DELAY = 20;
/**
 * A handful of variables used to track the current composition and its
 * resolution status. These exist at the module level because it is not
 * possible to have compositions occurring in multiple editors simultaneously,
 * and it simplifies state management with respect to the DraftEditor component.
 */

var resolved = false;
var stillComposing = false;
var domObserver = null;

function startDOMObserver(editor) {
  if (!domObserver) {
    domObserver = new DOMObserver(getContentEditableContainer(editor));
    domObserver.start();
  }
}

var DraftEditorCompositionHandler = {
  /**
   * A `compositionstart` event has fired while we're still in composition
   * mode. Continue the current composition session to prevent a re-render.
   */
  onCompositionStart: function onCompositionStart(editor) {
    stillComposing = true;
    startDOMObserver(editor);
  },

  /**
   * Attempt to end the current composition session.
   *
   * Defer handling because browser will still insert the chars into active
   * element after `compositionend`. If a `compositionstart` event fires
   * before `resolveComposition` executes, our composition session will
   * continue.
   *
   * The `resolved` flag is useful because certain IME interfaces fire the
   * `compositionend` event multiple times, thus queueing up multiple attempts
   * at handling the composition. Since handling the same composition event
   * twice could break the DOM, we only use the first event. Example: Arabic
   * Google Input Tools on Windows 8.1 fires `compositionend` three times.
   */
  onCompositionEnd: function onCompositionEnd(editor) {
    resolved = false;
    stillComposing = false;
    setTimeout(function () {
      if (!resolved) {
        DraftEditorCompositionHandler.resolveComposition(editor);
      }
    }, RESOLVE_DELAY);
  },
  onSelect: editOnSelect,

  /**
   * In Safari, keydown events may fire when committing compositions. If
   * the arrow keys are used to commit, prevent default so that the cursor
   * doesn't move, otherwise it will jump back noticeably on re-render.
   */
  onKeyDown: function onKeyDown(editor, e) {
    if (!stillComposing) {
      // If a keydown event is received after compositionend but before the
      // 20ms timer expires (ex: type option-E then backspace, or type A then
      // backspace in 2-Set Korean), we should immediately resolve the
      // composition and reinterpret the key press in edit mode.
      DraftEditorCompositionHandler.resolveComposition(editor);

      editor._onKeyDown(e);

      return;
    }

    if (e.which === Keys.RIGHT || e.which === Keys.LEFT) {
      e.preventDefault();
    }
  },

  /**
   * Keypress events may fire when committing compositions. In Firefox,
   * pressing RETURN commits the composition and inserts extra newline
   * characters that we do not want. `preventDefault` allows the composition
   * to be committed while preventing the extra characters.
   */
  onKeyPress: function onKeyPress(_editor, e) {
    if (e.which === Keys.RETURN) {
      e.preventDefault();
    }
  },

  /**
   * Attempt to insert composed characters into the document.
   *
   * If we are still in a composition session, do nothing. Otherwise, insert
   * the characters into the document and terminate the composition session.
   *
   * If no characters were composed -- for instance, the user
   * deleted all composed characters and committed nothing new --
   * force a re-render. We also re-render when the composition occurs
   * at the beginning of a leaf, to ensure that if the browser has
   * created a new text node for the composition, we will discard it.
   *
   * Resetting innerHTML will move focus to the beginning of the editor,
   * so we update to force it back to the correct place.
   */
  resolveComposition: function resolveComposition(editor) {
    if (stillComposing) {
      return;
    }

    var mutations = nullthrows(domObserver).stopAndFlushMutations();
    domObserver = null;
    resolved = true;
    var editorState = EditorState.set(editor._latestEditorState, {
      inCompositionMode: false
    });
    editor.exitCurrentMode();

    if (!mutations.size) {
      editor.update(editorState);
      return;
    } // TODO, check if Facebook still needs this flag or if it could be removed.
    // Since there can be multiple mutations providing a `composedChars` doesn't
    // apply well on this new model.
    // if (
    //   gkx('draft_handlebeforeinput_composed_text') &&
    //   editor.props.handleBeforeInput &&
    //   isEventHandled(
    //     editor.props.handleBeforeInput(
    //       composedChars,
    //       editorState,
    //       event.timeStamp,
    //     ),
    //   )
    // ) {
    //   return;
    // }


    var contentState = editorState.getCurrentContent();
    mutations.forEach(function (composedChars, offsetKey) {
      var _DraftOffsetKey$decod = DraftOffsetKey.decode(offsetKey),
          blockKey = _DraftOffsetKey$decod.blockKey,
          decoratorKey = _DraftOffsetKey$decod.decoratorKey,
          leafKey = _DraftOffsetKey$decod.leafKey;

      var _editorState$getBlock = editorState.getBlockTree(blockKey).getIn([decoratorKey, 'leaves', leafKey]),
          start = _editorState$getBlock.start,
          end = _editorState$getBlock.end;

      var replacementRange = editorState.getSelection().merge({
        anchorKey: blockKey,
        focusKey: blockKey,
        anchorOffset: start,
        focusOffset: end,
        isBackward: false
      });
      var entityKey = getEntityKeyForSelection(contentState, replacementRange);
      var currentStyle = contentState.getBlockForKey(blockKey).getInlineStyleAt(start);
      contentState = DraftModifier.replaceText(contentState, replacementRange, composedChars, currentStyle, entityKey); // We need to update the editorState so the leaf node ranges are properly
      // updated and multiple mutations are correctly applied.

      editorState = EditorState.set(editorState, {
        currentContent: contentState
      });
    }); // When we apply the text changes to the ContentState, the selection always
    // goes to the end of the field, but it should just stay where it is
    // after compositionEnd.

    var documentSelection = getDraftEditorSelection(editorState, getContentEditableContainer(editor));
    var compositionEndSelectionState = documentSelection.selectionState;
    editor.restoreEditorDOM(); // See:
    // - https://github.com/facebook/draft-js/issues/2093
    // - https://github.com/facebook/draft-js/pull/2094
    // Apply this fix only in IE for now. We can test it in
    // other browsers in the future to ensure no regressions

    var editorStateWithUpdatedSelection = isIE ? EditorState.forceSelection(editorState, compositionEndSelectionState) : EditorState.acceptSelection(editorState, compositionEndSelectionState);
    editor.update(EditorState.push(editorStateWithUpdatedSelection, contentState, 'insert-characters'));
  }
};
module.exports = DraftEditorCompositionHandler;

/***/ }),

/***/ "./node_modules/draft-js/lib/DraftEditorContents-core.react.js":
/*!*********************************************************************!*\
  !*** ./node_modules/draft-js/lib/DraftEditorContents-core.react.js ***!
  \*********************************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";
/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @format
 * 
 * @emails oncall+draft_js
 */


var _assign = __webpack_require__(/*! object-assign */ "./node_modules/object-assign/index.js");

function _extends() { _extends = _assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; var ownKeys = Object.keys(source); if (typeof Object.getOwnPropertySymbols === 'function') { ownKeys = ownKeys.concat(Object.getOwnPropertySymbols(source).filter(function (sym) { return Object.getOwnPropertyDescriptor(source, sym).enumerable; })); } ownKeys.forEach(function (key) { _defineProperty(target, key, source[key]); }); } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _inheritsLoose(subClass, superClass) { subClass.prototype = Object.create(superClass.prototype); subClass.prototype.constructor = subClass; subClass.__proto__ = superClass; }

var DraftEditorBlock = __webpack_require__(/*! ./DraftEditorBlock.react */ "./node_modules/draft-js/lib/DraftEditorBlock.react.js");

var DraftOffsetKey = __webpack_require__(/*! ./DraftOffsetKey */ "./node_modules/draft-js/lib/DraftOffsetKey.js");

var React = __webpack_require__(/*! react */ "./node_modules/react/index.js");

var cx = __webpack_require__(/*! fbjs/lib/cx */ "./node_modules/fbjs/lib/cx.js");

var joinClasses = __webpack_require__(/*! fbjs/lib/joinClasses */ "./node_modules/fbjs/lib/joinClasses.js");

var nullthrows = __webpack_require__(/*! fbjs/lib/nullthrows */ "./node_modules/fbjs/lib/nullthrows.js");

/**
 * Provide default styling for list items. This way, lists will be styled with
 * proper counters and indentation even if the caller does not specify
 * their own styling at all. If more than five levels of nesting are needed,
 * the necessary CSS classes can be provided via `blockStyleFn` configuration.
 */
var getListItemClasses = function getListItemClasses(type, depth, shouldResetCount, direction) {
  return cx({
    'public/DraftStyleDefault/unorderedListItem': type === 'unordered-list-item',
    'public/DraftStyleDefault/orderedListItem': type === 'ordered-list-item',
    'public/DraftStyleDefault/reset': shouldResetCount,
    'public/DraftStyleDefault/depth0': depth === 0,
    'public/DraftStyleDefault/depth1': depth === 1,
    'public/DraftStyleDefault/depth2': depth === 2,
    'public/DraftStyleDefault/depth3': depth === 3,
    'public/DraftStyleDefault/depth4': depth >= 4,
    'public/DraftStyleDefault/listLTR': direction === 'LTR',
    'public/DraftStyleDefault/listRTL': direction === 'RTL'
  });
};
/**
 * `DraftEditorContents` is the container component for all block components
 * rendered for a `DraftEditor`. It is optimized to aggressively avoid
 * re-rendering blocks whenever possible.
 *
 * This component is separate from `DraftEditor` because certain props
 * (for instance, ARIA props) must be allowed to update without affecting
 * the contents of the editor.
 */


var DraftEditorContents = /*#__PURE__*/function (_React$Component) {
  _inheritsLoose(DraftEditorContents, _React$Component);

  function DraftEditorContents() {
    return _React$Component.apply(this, arguments) || this;
  }

  var _proto = DraftEditorContents.prototype;

  _proto.shouldComponentUpdate = function shouldComponentUpdate(nextProps) {
    var prevEditorState = this.props.editorState;
    var nextEditorState = nextProps.editorState;
    var prevDirectionMap = prevEditorState.getDirectionMap();
    var nextDirectionMap = nextEditorState.getDirectionMap(); // Text direction has changed for one or more blocks. We must re-render.

    if (prevDirectionMap !== nextDirectionMap) {
      return true;
    }

    var didHaveFocus = prevEditorState.getSelection().getHasFocus();
    var nowHasFocus = nextEditorState.getSelection().getHasFocus();

    if (didHaveFocus !== nowHasFocus) {
      return true;
    }

    var nextNativeContent = nextEditorState.getNativelyRenderedContent();
    var wasComposing = prevEditorState.isInCompositionMode();
    var nowComposing = nextEditorState.isInCompositionMode(); // If the state is unchanged or we're currently rendering a natively
    // rendered state, there's nothing new to be done.

    if (prevEditorState === nextEditorState || nextNativeContent !== null && nextEditorState.getCurrentContent() === nextNativeContent || wasComposing && nowComposing) {
      return false;
    }

    var prevContent = prevEditorState.getCurrentContent();
    var nextContent = nextEditorState.getCurrentContent();
    var prevDecorator = prevEditorState.getDecorator();
    var nextDecorator = nextEditorState.getDecorator();
    return wasComposing !== nowComposing || prevContent !== nextContent || prevDecorator !== nextDecorator || nextEditorState.mustForceSelection();
  };

  _proto.render = function render() {
    var _this$props = this.props,
        blockRenderMap = _this$props.blockRenderMap,
        blockRendererFn = _this$props.blockRendererFn,
        blockStyleFn = _this$props.blockStyleFn,
        customStyleMap = _this$props.customStyleMap,
        customStyleFn = _this$props.customStyleFn,
        editorState = _this$props.editorState,
        editorKey = _this$props.editorKey,
        preventScroll = _this$props.preventScroll,
        textDirectionality = _this$props.textDirectionality;
    var content = editorState.getCurrentContent();
    var selection = editorState.getSelection();
    var forceSelection = editorState.mustForceSelection();
    var decorator = editorState.getDecorator();
    var directionMap = nullthrows(editorState.getDirectionMap());
    var blocksAsArray = content.getBlocksAsArray();
    var processedBlocks = [];
    var currentDepth = null;
    var lastWrapperTemplate = null;

    for (var ii = 0; ii < blocksAsArray.length; ii++) {
      var _block = blocksAsArray[ii];

      var key = _block.getKey();

      var blockType = _block.getType();

      var customRenderer = blockRendererFn(_block);
      var CustomComponent = void 0,
          customProps = void 0,
          customEditable = void 0;

      if (customRenderer) {
        CustomComponent = customRenderer.component;
        customProps = customRenderer.props;
        customEditable = customRenderer.editable;
      }

      var direction = textDirectionality ? textDirectionality : directionMap.get(key);
      var offsetKey = DraftOffsetKey.encode(key, 0, 0);
      var componentProps = {
        contentState: content,
        block: _block,
        blockProps: customProps,
        blockStyleFn: blockStyleFn,
        customStyleMap: customStyleMap,
        customStyleFn: customStyleFn,
        decorator: decorator,
        direction: direction,
        forceSelection: forceSelection,
        offsetKey: offsetKey,
        preventScroll: preventScroll,
        selection: selection,
        tree: editorState.getBlockTree(key)
      };
      var configForType = blockRenderMap.get(blockType) || blockRenderMap.get('unstyled');
      var wrapperTemplate = configForType.wrapper;
      var Element = configForType.element || blockRenderMap.get('unstyled').element;

      var depth = _block.getDepth();

      var _className = '';

      if (blockStyleFn) {
        _className = blockStyleFn(_block);
      } // List items are special snowflakes, since we handle nesting and
      // counters manually.


      if (Element === 'li') {
        var shouldResetCount = lastWrapperTemplate !== wrapperTemplate || currentDepth === null || depth > currentDepth;
        _className = joinClasses(_className, getListItemClasses(blockType, depth, shouldResetCount, direction));
      }

      var Component = CustomComponent || DraftEditorBlock;
      var childProps = {
        className: _className,
        'data-block': true,
        'data-editor': editorKey,
        'data-offset-key': offsetKey,
        key: key
      };

      if (customEditable !== undefined) {
        childProps = _objectSpread({}, childProps, {
          contentEditable: customEditable,
          suppressContentEditableWarning: true
        });
      }

      var child = React.createElement(Element, childProps,
      /* $FlowFixMe[incompatible-type] (>=0.112.0 site=www,mobile) This
       * comment suppresses an error found when Flow v0.112 was deployed. To
       * see the error delete this comment and run Flow. */
      React.createElement(Component, _extends({}, componentProps, {
        key: key
      })));
      processedBlocks.push({
        block: child,
        wrapperTemplate: wrapperTemplate,
        key: key,
        offsetKey: offsetKey
      });

      if (wrapperTemplate) {
        currentDepth = _block.getDepth();
      } else {
        currentDepth = null;
      }

      lastWrapperTemplate = wrapperTemplate;
    } // Group contiguous runs of blocks that have the same wrapperTemplate


    var outputBlocks = [];

    for (var _ii = 0; _ii < processedBlocks.length;) {
      var info = processedBlocks[_ii];

      if (info.wrapperTemplate) {
        var blocks = [];

        do {
          blocks.push(processedBlocks[_ii].block);
          _ii++;
        } while (_ii < processedBlocks.length && processedBlocks[_ii].wrapperTemplate === info.wrapperTemplate);

        var wrapperElement = React.cloneElement(info.wrapperTemplate, {
          key: info.key + '-wrap',
          'data-offset-key': info.offsetKey
        }, blocks);
        outputBlocks.push(wrapperElement);
      } else {
        outputBlocks.push(info.block);
        _ii++;
      }
    }

    return React.createElement("div", {
      "data-contents": "true"
    }, outputBlocks);
  };

  return DraftEditorContents;
}(React.Component);

module.exports = DraftEditorContents;

/***/ }),

/***/ "./node_modules/draft-js/lib/DraftEditorContents.react.js":
/*!****************************************************************!*\
  !*** ./node_modules/draft-js/lib/DraftEditorContents.react.js ***!
  \****************************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";
/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @format
 * 
 */


var gkx = __webpack_require__(/*! ./gkx */ "./node_modules/draft-js/lib/gkx.js");

var experimentalTreeDataSupport = gkx('draft_tree_data_support');
module.exports = experimentalTreeDataSupport ? __webpack_require__(/*! ./DraftEditorContentsExperimental.react */ "./node_modules/draft-js/lib/DraftEditorContentsExperimental.react.js") : __webpack_require__(/*! ./DraftEditorContents-core.react */ "./node_modules/draft-js/lib/DraftEditorContents-core.react.js");

/***/ }),

/***/ "./node_modules/draft-js/lib/DraftEditorContentsExperimental.react.js":
/*!****************************************************************************!*\
  !*** ./node_modules/draft-js/lib/DraftEditorContentsExperimental.react.js ***!
  \****************************************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";
/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @format
 * 
 * @emails oncall+draft_js
 *
 * This file is a fork of DraftEditorContents.react.js for tree nodes
 *
 * This is unstable and not part of the public API and should not be used by
 * production systems. This file may be update/removed without notice.
 */


var _assign = __webpack_require__(/*! object-assign */ "./node_modules/object-assign/index.js");

function _extends() { _extends = _assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

function _inheritsLoose(subClass, superClass) { subClass.prototype = Object.create(superClass.prototype); subClass.prototype.constructor = subClass; subClass.__proto__ = superClass; }

var DraftEditorBlockNode = __webpack_require__(/*! ./DraftEditorBlockNode.react */ "./node_modules/draft-js/lib/DraftEditorBlockNode.react.js");

var DraftOffsetKey = __webpack_require__(/*! ./DraftOffsetKey */ "./node_modules/draft-js/lib/DraftOffsetKey.js");

var React = __webpack_require__(/*! react */ "./node_modules/react/index.js");

var nullthrows = __webpack_require__(/*! fbjs/lib/nullthrows */ "./node_modules/fbjs/lib/nullthrows.js");

/**
 * `DraftEditorContents` is the container component for all block components
 * rendered for a `DraftEditor`. It is optimized to aggressively avoid
 * re-rendering blocks whenever possible.
 *
 * This component is separate from `DraftEditor` because certain props
 * (for instance, ARIA props) must be allowed to update without affecting
 * the contents of the editor.
 */
var DraftEditorContentsExperimental = /*#__PURE__*/function (_React$Component) {
  _inheritsLoose(DraftEditorContentsExperimental, _React$Component);

  function DraftEditorContentsExperimental() {
    return _React$Component.apply(this, arguments) || this;
  }

  var _proto = DraftEditorContentsExperimental.prototype;

  _proto.shouldComponentUpdate = function shouldComponentUpdate(nextProps) {
    var prevEditorState = this.props.editorState;
    var nextEditorState = nextProps.editorState;
    var prevDirectionMap = prevEditorState.getDirectionMap();
    var nextDirectionMap = nextEditorState.getDirectionMap(); // Text direction has changed for one or more blocks. We must re-render.

    if (prevDirectionMap !== nextDirectionMap) {
      return true;
    }

    var didHaveFocus = prevEditorState.getSelection().getHasFocus();
    var nowHasFocus = nextEditorState.getSelection().getHasFocus();

    if (didHaveFocus !== nowHasFocus) {
      return true;
    }

    var nextNativeContent = nextEditorState.getNativelyRenderedContent();
    var wasComposing = prevEditorState.isInCompositionMode();
    var nowComposing = nextEditorState.isInCompositionMode(); // If the state is unchanged or we're currently rendering a natively
    // rendered state, there's nothing new to be done.

    if (prevEditorState === nextEditorState || nextNativeContent !== null && nextEditorState.getCurrentContent() === nextNativeContent || wasComposing && nowComposing) {
      return false;
    }

    var prevContent = prevEditorState.getCurrentContent();
    var nextContent = nextEditorState.getCurrentContent();
    var prevDecorator = prevEditorState.getDecorator();
    var nextDecorator = nextEditorState.getDecorator();
    return wasComposing !== nowComposing || prevContent !== nextContent || prevDecorator !== nextDecorator || nextEditorState.mustForceSelection();
  };

  _proto.render = function render() {
    var _this$props = this.props,
        blockRenderMap = _this$props.blockRenderMap,
        blockRendererFn = _this$props.blockRendererFn,
        blockStyleFn = _this$props.blockStyleFn,
        customStyleMap = _this$props.customStyleMap,
        customStyleFn = _this$props.customStyleFn,
        editorState = _this$props.editorState,
        editorKey = _this$props.editorKey,
        textDirectionality = _this$props.textDirectionality;
    var content = editorState.getCurrentContent();
    var selection = editorState.getSelection();
    var forceSelection = editorState.mustForceSelection();
    var decorator = editorState.getDecorator();
    var directionMap = nullthrows(editorState.getDirectionMap());
    var blocksAsArray = content.getBlocksAsArray();
    var rootBlock = blocksAsArray[0];
    var processedBlocks = [];
    var nodeBlock = rootBlock;

    while (nodeBlock) {
      var blockKey = nodeBlock.getKey();
      var blockProps = {
        blockRenderMap: blockRenderMap,
        blockRendererFn: blockRendererFn,
        blockStyleFn: blockStyleFn,
        contentState: content,
        customStyleFn: customStyleFn,
        customStyleMap: customStyleMap,
        decorator: decorator,
        editorKey: editorKey,
        editorState: editorState,
        forceSelection: forceSelection,
        selection: selection,
        block: nodeBlock,
        direction: textDirectionality ? textDirectionality : directionMap.get(blockKey),
        tree: editorState.getBlockTree(blockKey)
      };
      var configForType = blockRenderMap.get(nodeBlock.getType()) || blockRenderMap.get('unstyled');
      var wrapperTemplate = configForType.wrapper;
      processedBlocks.push({
        /* $FlowFixMe[incompatible-type] (>=0.112.0 site=www,mobile) This
         * comment suppresses an error found when Flow v0.112 was deployed. To
         * see the error delete this comment and run Flow. */
        block: React.createElement(DraftEditorBlockNode, _extends({
          key: blockKey
        }, blockProps)),
        wrapperTemplate: wrapperTemplate,
        key: blockKey,
        offsetKey: DraftOffsetKey.encode(blockKey, 0, 0)
      });
      var nextBlockKey = nodeBlock.getNextSiblingKey();
      nodeBlock = nextBlockKey ? content.getBlockForKey(nextBlockKey) : null;
    } // Group contiguous runs of blocks that have the same wrapperTemplate


    var outputBlocks = [];

    for (var ii = 0; ii < processedBlocks.length;) {
      var info = processedBlocks[ii];

      if (info.wrapperTemplate) {
        var blocks = [];

        do {
          blocks.push(processedBlocks[ii].block);
          ii++;
        } while (ii < processedBlocks.length && processedBlocks[ii].wrapperTemplate === info.wrapperTemplate);

        var wrapperElement = React.cloneElement(info.wrapperTemplate, {
          key: info.key + '-wrap',
          'data-offset-key': info.offsetKey
        }, blocks);
        outputBlocks.push(wrapperElement);
      } else {
        outputBlocks.push(info.block);
        ii++;
      }
    }

    return React.createElement("div", {
      "data-contents": "true"
    }, outputBlocks);
  };

  return DraftEditorContentsExperimental;
}(React.Component);

module.exports = DraftEditorContentsExperimental;

/***/ }),

/***/ "./node_modules/draft-js/lib/DraftEditorDecoratedLeaves.react.js":
/*!***********************************************************************!*\
  !*** ./node_modules/draft-js/lib/DraftEditorDecoratedLeaves.react.js ***!
  \***********************************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";
/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @format
 * 
 * @emails oncall+draft_js
 *
 * This is unstable and not part of the public API and should not be used by
 * production systems. This file may be update/removed without notice.
 */


var _assign = __webpack_require__(/*! object-assign */ "./node_modules/object-assign/index.js");

function _extends() { _extends = _assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

function _inheritsLoose(subClass, superClass) { subClass.prototype = Object.create(superClass.prototype); subClass.prototype.constructor = subClass; subClass.__proto__ = superClass; }

var DraftOffsetKey = __webpack_require__(/*! ./DraftOffsetKey */ "./node_modules/draft-js/lib/DraftOffsetKey.js");

var React = __webpack_require__(/*! react */ "./node_modules/react/index.js");

var UnicodeBidi = __webpack_require__(/*! fbjs/lib/UnicodeBidi */ "./node_modules/fbjs/lib/UnicodeBidi.js");

var UnicodeBidiDirection = __webpack_require__(/*! fbjs/lib/UnicodeBidiDirection */ "./node_modules/fbjs/lib/UnicodeBidiDirection.js");

var DraftEditorDecoratedLeaves = /*#__PURE__*/function (_React$Component) {
  _inheritsLoose(DraftEditorDecoratedLeaves, _React$Component);

  function DraftEditorDecoratedLeaves() {
    return _React$Component.apply(this, arguments) || this;
  }

  var _proto = DraftEditorDecoratedLeaves.prototype;

  _proto.render = function render() {
    var _this$props = this.props,
        block = _this$props.block,
        children = _this$props.children,
        contentState = _this$props.contentState,
        decorator = _this$props.decorator,
        decoratorKey = _this$props.decoratorKey,
        direction = _this$props.direction,
        leafSet = _this$props.leafSet,
        text = _this$props.text;
    var blockKey = block.getKey();
    var leavesForLeafSet = leafSet.get('leaves');
    var DecoratorComponent = decorator.getComponentForKey(decoratorKey);
    var decoratorProps = decorator.getPropsForKey(decoratorKey);
    var decoratorOffsetKey = DraftOffsetKey.encode(blockKey, parseInt(decoratorKey, 10), 0);
    var decoratedText = text.slice(leavesForLeafSet.first().get('start'), leavesForLeafSet.last().get('end')); // Resetting dir to the same value on a child node makes Chrome/Firefox
    // confused on cursor movement. See http://jsfiddle.net/d157kLck/3/

    var dir = UnicodeBidiDirection.getHTMLDirIfDifferent(UnicodeBidi.getDirection(decoratedText), direction);
    return React.createElement(DecoratorComponent, _extends({}, decoratorProps, {
      contentState: contentState,
      decoratedText: decoratedText,
      dir: dir,
      key: decoratorOffsetKey,
      entityKey: block.getEntityAt(leafSet.get('start')),
      offsetKey: decoratorOffsetKey
    }), children);
  };

  return DraftEditorDecoratedLeaves;
}(React.Component);

module.exports = DraftEditorDecoratedLeaves;

/***/ }),

/***/ "./node_modules/draft-js/lib/DraftEditorDragHandler.js":
/*!*************************************************************!*\
  !*** ./node_modules/draft-js/lib/DraftEditorDragHandler.js ***!
  \*************************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";
/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @format
 * 
 * @emails oncall+draft_js
 */


var DataTransfer = __webpack_require__(/*! fbjs/lib/DataTransfer */ "./node_modules/fbjs/lib/DataTransfer.js");

var DraftModifier = __webpack_require__(/*! ./DraftModifier */ "./node_modules/draft-js/lib/DraftModifier.js");

var EditorState = __webpack_require__(/*! ./EditorState */ "./node_modules/draft-js/lib/EditorState.js");

var findAncestorOffsetKey = __webpack_require__(/*! ./findAncestorOffsetKey */ "./node_modules/draft-js/lib/findAncestorOffsetKey.js");

var getCorrectDocumentFromNode = __webpack_require__(/*! ./getCorrectDocumentFromNode */ "./node_modules/draft-js/lib/getCorrectDocumentFromNode.js");

var getTextContentFromFiles = __webpack_require__(/*! ./getTextContentFromFiles */ "./node_modules/draft-js/lib/getTextContentFromFiles.js");

var getUpdatedSelectionState = __webpack_require__(/*! ./getUpdatedSelectionState */ "./node_modules/draft-js/lib/getUpdatedSelectionState.js");

var getWindowForNode = __webpack_require__(/*! ./getWindowForNode */ "./node_modules/draft-js/lib/getWindowForNode.js");

var isEventHandled = __webpack_require__(/*! ./isEventHandled */ "./node_modules/draft-js/lib/isEventHandled.js");

var nullthrows = __webpack_require__(/*! fbjs/lib/nullthrows */ "./node_modules/fbjs/lib/nullthrows.js");
/**
 * Get a SelectionState for the supplied mouse event.
 */


function getSelectionForEvent(event, editorState) {
  var node = null;
  var offset = null;
  var eventTargetDocument = getCorrectDocumentFromNode(event.currentTarget);
  /* $FlowFixMe[prop-missing] (>=0.68.0 site=www,mobile) This comment
   * suppresses an error found when Flow v0.68 was deployed. To see the error
   * delete this comment and run Flow. */

  if (typeof eventTargetDocument.caretRangeFromPoint === 'function') {
    /* $FlowFixMe[incompatible-use] (>=0.68.0 site=www,mobile) This comment
     * suppresses an error found when Flow v0.68 was deployed. To see the error
     * delete this comment and run Flow. */
    var dropRange = eventTargetDocument.caretRangeFromPoint(event.x, event.y);
    node = dropRange.startContainer;
    offset = dropRange.startOffset;
  } else if (event.rangeParent) {
    node = event.rangeParent;
    offset = event.rangeOffset;
  } else {
    return null;
  }

  node = nullthrows(node);
  offset = nullthrows(offset);
  var offsetKey = nullthrows(findAncestorOffsetKey(node));
  return getUpdatedSelectionState(editorState, offsetKey, offset, offsetKey, offset);
}

var DraftEditorDragHandler = {
  /**
   * Drag originating from input terminated.
   */
  onDragEnd: function onDragEnd(editor) {
    editor.exitCurrentMode();
    endDrag(editor);
  },

  /**
   * Handle data being dropped.
   */
  onDrop: function onDrop(editor, e) {
    var data = new DataTransfer(e.nativeEvent.dataTransfer);
    var editorState = editor._latestEditorState;
    var dropSelection = getSelectionForEvent(e.nativeEvent, editorState);
    e.preventDefault();
    editor._dragCount = 0;
    editor.exitCurrentMode();

    if (dropSelection == null) {
      return;
    }

    var files = data.getFiles();

    if (files.length > 0) {
      if (editor.props.handleDroppedFiles && isEventHandled(editor.props.handleDroppedFiles(dropSelection, files))) {
        return;
      }
      /* $FlowFixMe[incompatible-call] This comment suppresses an error found
       * DataTransfer was typed. getFiles() returns an array of <Files extends
       * Blob>, not Blob */


      getTextContentFromFiles(files, function (fileText) {
        fileText && editor.update(insertTextAtSelection(editorState, dropSelection, fileText));
      });
      return;
    }

    var dragType = editor._internalDrag ? 'internal' : 'external';

    if (editor.props.handleDrop && isEventHandled(editor.props.handleDrop(dropSelection, data, dragType))) {// handled
    } else if (editor._internalDrag) {
      editor.update(moveText(editorState, dropSelection));
    } else {
      editor.update(insertTextAtSelection(editorState, dropSelection, data.getText()));
    }

    endDrag(editor);
  }
};

function endDrag(editor) {
  editor._internalDrag = false; // Fix issue #1383
  // Prior to React v16.5.0 onDrop breaks onSelect event:
  // https://github.com/facebook/react/issues/11379.
  // Dispatching a mouseup event on DOM node will make it go back to normal.

  var editorNode = editor.editorContainer;

  if (editorNode) {
    var mouseUpEvent = new MouseEvent('mouseup', {
      view: getWindowForNode(editorNode),
      bubbles: true,
      cancelable: true
    });
    editorNode.dispatchEvent(mouseUpEvent);
  }
}

function moveText(editorState, targetSelection) {
  var newContentState = DraftModifier.moveText(editorState.getCurrentContent(), editorState.getSelection(), targetSelection);
  return EditorState.push(editorState, newContentState, 'insert-fragment');
}
/**
 * Insert text at a specified selection.
 */


function insertTextAtSelection(editorState, selection, text) {
  var newContentState = DraftModifier.insertText(editorState.getCurrentContent(), selection, text, editorState.getCurrentInlineStyle());
  return EditorState.push(editorState, newContentState, 'insert-fragment');
}

module.exports = DraftEditorDragHandler;

/***/ }),

/***/ "./node_modules/draft-js/lib/DraftEditorEditHandler.js":
/*!*************************************************************!*\
  !*** ./node_modules/draft-js/lib/DraftEditorEditHandler.js ***!
  \*************************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";
/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @format
 * 
 * @emails oncall+draft_js
 */


var UserAgent = __webpack_require__(/*! fbjs/lib/UserAgent */ "./node_modules/fbjs/lib/UserAgent.js");

var onBeforeInput = __webpack_require__(/*! ./editOnBeforeInput */ "./node_modules/draft-js/lib/editOnBeforeInput.js");

var onBlur = __webpack_require__(/*! ./editOnBlur */ "./node_modules/draft-js/lib/editOnBlur.js");

var onCompositionStart = __webpack_require__(/*! ./editOnCompositionStart */ "./node_modules/draft-js/lib/editOnCompositionStart.js");

var onCopy = __webpack_require__(/*! ./editOnCopy */ "./node_modules/draft-js/lib/editOnCopy.js");

var onCut = __webpack_require__(/*! ./editOnCut */ "./node_modules/draft-js/lib/editOnCut.js");

var onDragOver = __webpack_require__(/*! ./editOnDragOver */ "./node_modules/draft-js/lib/editOnDragOver.js");

var onDragStart = __webpack_require__(/*! ./editOnDragStart */ "./node_modules/draft-js/lib/editOnDragStart.js");

var onFocus = __webpack_require__(/*! ./editOnFocus */ "./node_modules/draft-js/lib/editOnFocus.js");

var onInput = __webpack_require__(/*! ./editOnInput */ "./node_modules/draft-js/lib/editOnInput.js");

var onKeyDown = __webpack_require__(/*! ./editOnKeyDown */ "./node_modules/draft-js/lib/editOnKeyDown.js");

var onPaste = __webpack_require__(/*! ./editOnPaste */ "./node_modules/draft-js/lib/editOnPaste.js");

var onSelect = __webpack_require__(/*! ./editOnSelect */ "./node_modules/draft-js/lib/editOnSelect.js");

var isChrome = UserAgent.isBrowser('Chrome');
var isFirefox = UserAgent.isBrowser('Firefox');
var selectionHandler = isChrome || isFirefox ? onSelect : function (e) {};
var DraftEditorEditHandler = {
  onBeforeInput: onBeforeInput,
  onBlur: onBlur,
  onCompositionStart: onCompositionStart,
  onCopy: onCopy,
  onCut: onCut,
  onDragOver: onDragOver,
  onDragStart: onDragStart,
  onFocus: onFocus,
  onInput: onInput,
  onKeyDown: onKeyDown,
  onPaste: onPaste,
  onSelect: onSelect,
  // In certain cases, contenteditable on chrome does not fire the onSelect
  // event, causing problems with cursor positioning. Therefore, the selection
  // state update handler is added to more events to ensure that the selection
  // state is always synced with the actual cursor positions.
  onMouseUp: selectionHandler,
  onKeyUp: selectionHandler
};
module.exports = DraftEditorEditHandler;

/***/ }),

/***/ "./node_modules/draft-js/lib/DraftEditorFlushControlled.js":
/*!*****************************************************************!*\
  !*** ./node_modules/draft-js/lib/DraftEditorFlushControlled.js ***!
  \*****************************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";


/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @format
 * 
 * @emails oncall+draft_js
 */
var ReactDOMComet = __webpack_require__(/*! react-dom */ "./node_modules/react-dom/index.js");

var flushControlled = ReactDOMComet.unstable_flushControlled;
module.exports = flushControlled;

/***/ }),

/***/ "./node_modules/draft-js/lib/DraftEditorLeaf.react.js":
/*!************************************************************!*\
  !*** ./node_modules/draft-js/lib/DraftEditorLeaf.react.js ***!
  \************************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";
/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @format
 * 
 * @emails oncall+draft_js
 */


var _assign = __webpack_require__(/*! object-assign */ "./node_modules/object-assign/index.js");

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _inheritsLoose(subClass, superClass) { subClass.prototype = Object.create(superClass.prototype); subClass.prototype.constructor = subClass; subClass.__proto__ = superClass; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var DraftEditorTextNode = __webpack_require__(/*! ./DraftEditorTextNode.react */ "./node_modules/draft-js/lib/DraftEditorTextNode.react.js");

var React = __webpack_require__(/*! react */ "./node_modules/react/index.js");

var invariant = __webpack_require__(/*! fbjs/lib/invariant */ "./node_modules/fbjs/lib/invariant.js");

var isHTMLBRElement = __webpack_require__(/*! ./isHTMLBRElement */ "./node_modules/draft-js/lib/isHTMLBRElement.js");

var setDraftEditorSelection = (__webpack_require__(/*! ./setDraftEditorSelection */ "./node_modules/draft-js/lib/setDraftEditorSelection.js").setDraftEditorSelection);

/**
 * All leaf nodes in the editor are spans with single text nodes. Leaf
 * elements are styled based on the merging of an optional custom style map
 * and a default style map.
 *
 * `DraftEditorLeaf` also provides a wrapper for calling into the imperative
 * DOM Selection API. In this way, top-level components can declaratively
 * maintain the selection state.
 */
var DraftEditorLeaf = /*#__PURE__*/function (_React$Component) {
  _inheritsLoose(DraftEditorLeaf, _React$Component);

  function DraftEditorLeaf() {
    var _this;

    for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    _this = _React$Component.call.apply(_React$Component, [this].concat(args)) || this;

    _defineProperty(_assertThisInitialized(_this), "leaf", void 0);

    return _this;
  }

  var _proto = DraftEditorLeaf.prototype;

  _proto._setSelection = function _setSelection() {
    var selection = this.props.selection; // If selection state is irrelevant to the parent block, no-op.

    if (selection == null || !selection.getHasFocus()) {
      return;
    }

    var _this$props = this.props,
        block = _this$props.block,
        start = _this$props.start,
        text = _this$props.text;
    var blockKey = block.getKey();
    var end = start + text.length;

    if (!selection.hasEdgeWithin(blockKey, start, end)) {
      return;
    } // Determine the appropriate target node for selection. If the child
    // is not a text node, it is a <br /> spacer. In this case, use the
    // <span> itself as the selection target.


    var node = this.leaf;
    !node ?  true ? invariant(false, 'Missing node') : 0 : void 0;
    var child = node.firstChild;
    !child ?  true ? invariant(false, 'Missing child') : 0 : void 0;
    var targetNode;

    if (child.nodeType === Node.TEXT_NODE) {
      targetNode = child;
    } else if (isHTMLBRElement(child)) {
      targetNode = node;
    } else {
      targetNode = child.firstChild;
      !targetNode ?  true ? invariant(false, 'Missing targetNode') : 0 : void 0;
    }

    setDraftEditorSelection(selection, targetNode, blockKey, start, end);
  };

  _proto.shouldComponentUpdate = function shouldComponentUpdate(nextProps) {
    var leafNode = this.leaf;
    !leafNode ?  true ? invariant(false, 'Missing leafNode') : 0 : void 0;
    var shouldUpdate = leafNode.textContent !== nextProps.text || nextProps.styleSet !== this.props.styleSet || nextProps.forceSelection;
    return shouldUpdate;
  };

  _proto.componentDidUpdate = function componentDidUpdate() {
    this._setSelection();
  };

  _proto.componentDidMount = function componentDidMount() {
    this._setSelection();
  };

  _proto.render = function render() {
    var _this2 = this;

    var block = this.props.block;
    var text = this.props.text; // If the leaf is at the end of its block and ends in a soft newline, append
    // an extra line feed character. Browsers collapse trailing newline
    // characters, which leaves the cursor in the wrong place after a
    // shift+enter. The extra character repairs this.

    if (text.endsWith('\n') && this.props.isLast) {
      text += '\n';
    }

    var _this$props2 = this.props,
        customStyleMap = _this$props2.customStyleMap,
        customStyleFn = _this$props2.customStyleFn,
        offsetKey = _this$props2.offsetKey,
        styleSet = _this$props2.styleSet;
    var styleObj = styleSet.reduce(function (map, styleName) {
      var mergedStyles = {};
      var style = customStyleMap[styleName];

      if (style !== undefined && map.textDecoration !== style.textDecoration) {
        // .trim() is necessary for IE9/10/11 and Edge
        mergedStyles.textDecoration = [map.textDecoration, style.textDecoration].join(' ').trim();
      }

      return _assign(map, style, mergedStyles);
    }, {});

    if (customStyleFn) {
      var newStyles = customStyleFn(styleSet, block);
      styleObj = _assign(styleObj, newStyles);
    }

    return React.createElement("span", {
      "data-offset-key": offsetKey,
      ref: function ref(_ref) {
        return _this2.leaf = _ref;
      },
      style: styleObj
    }, React.createElement(DraftEditorTextNode, null, text));
  };

  return DraftEditorLeaf;
}(React.Component);

module.exports = DraftEditorLeaf;

/***/ }),

/***/ "./node_modules/draft-js/lib/DraftEditorNode.react.js":
/*!************************************************************!*\
  !*** ./node_modules/draft-js/lib/DraftEditorNode.react.js ***!
  \************************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";
/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @format
 * 
 * @emails oncall+draft_js
 *
 * This is unstable and not part of the public API and should not be used by
 * production systems. This file may be update/removed without notice.
 */


function _inheritsLoose(subClass, superClass) { subClass.prototype = Object.create(superClass.prototype); subClass.prototype.constructor = subClass; subClass.__proto__ = superClass; }

var DraftEditorDecoratedLeaves = __webpack_require__(/*! ./DraftEditorDecoratedLeaves.react */ "./node_modules/draft-js/lib/DraftEditorDecoratedLeaves.react.js");

var DraftEditorLeaf = __webpack_require__(/*! ./DraftEditorLeaf.react */ "./node_modules/draft-js/lib/DraftEditorLeaf.react.js");

var DraftOffsetKey = __webpack_require__(/*! ./DraftOffsetKey */ "./node_modules/draft-js/lib/DraftOffsetKey.js");

var Immutable = __webpack_require__(/*! immutable */ "./node_modules/draft-js/node_modules/immutable/dist/immutable.js");

var React = __webpack_require__(/*! react */ "./node_modules/react/index.js");

var cx = __webpack_require__(/*! fbjs/lib/cx */ "./node_modules/fbjs/lib/cx.js");

var List = Immutable.List;

var DraftEditorNode = /*#__PURE__*/function (_React$Component) {
  _inheritsLoose(DraftEditorNode, _React$Component);

  function DraftEditorNode() {
    return _React$Component.apply(this, arguments) || this;
  }

  var _proto = DraftEditorNode.prototype;

  _proto.render = function render() {
    var _this$props = this.props,
        block = _this$props.block,
        contentState = _this$props.contentState,
        customStyleFn = _this$props.customStyleFn,
        customStyleMap = _this$props.customStyleMap,
        decorator = _this$props.decorator,
        direction = _this$props.direction,
        forceSelection = _this$props.forceSelection,
        hasSelection = _this$props.hasSelection,
        selection = _this$props.selection,
        tree = _this$props.tree;
    var blockKey = block.getKey();
    var text = block.getText();
    var lastLeafSet = tree.size - 1;
    var children = this.props.children || tree.map(function (leafSet, ii) {
      var decoratorKey = leafSet.get('decoratorKey');
      var leavesForLeafSet = leafSet.get('leaves');
      var lastLeaf = leavesForLeafSet.size - 1;
      var Leaves = leavesForLeafSet.map(function (leaf, jj) {
        var offsetKey = DraftOffsetKey.encode(blockKey, ii, jj);
        var start = leaf.get('start');
        var end = leaf.get('end');
        return React.createElement(DraftEditorLeaf, {
          key: offsetKey,
          offsetKey: offsetKey,
          block: block,
          start: start,
          selection: hasSelection ? selection : null,
          forceSelection: forceSelection,
          text: text.slice(start, end),
          styleSet: block.getInlineStyleAt(start),
          customStyleMap: customStyleMap,
          customStyleFn: customStyleFn,
          isLast: decoratorKey === lastLeafSet && jj === lastLeaf
        });
      }).toArray();

      if (!decoratorKey || !decorator) {
        return Leaves;
      }

      return React.createElement(DraftEditorDecoratedLeaves, {
        block: block,
        children: Leaves,
        contentState: contentState,
        decorator: decorator,
        decoratorKey: decoratorKey,
        direction: direction,
        leafSet: leafSet,
        text: text,
        key: ii
      });
    }).toArray();
    return React.createElement("div", {
      "data-offset-key": DraftOffsetKey.encode(blockKey, 0, 0),
      className: cx({
        'public/DraftStyleDefault/block': true,
        'public/DraftStyleDefault/ltr': direction === 'LTR',
        'public/DraftStyleDefault/rtl': direction === 'RTL'
      })
    }, children);
  };

  return DraftEditorNode;
}(React.Component);

module.exports = DraftEditorNode;

/***/ }),

/***/ "./node_modules/draft-js/lib/DraftEditorPlaceholder.react.js":
/*!*******************************************************************!*\
  !*** ./node_modules/draft-js/lib/DraftEditorPlaceholder.react.js ***!
  \*******************************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";
/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @format
 * 
 * @emails oncall+draft_js
 */


function _inheritsLoose(subClass, superClass) { subClass.prototype = Object.create(superClass.prototype); subClass.prototype.constructor = subClass; subClass.__proto__ = superClass; }

var React = __webpack_require__(/*! react */ "./node_modules/react/index.js");

var cx = __webpack_require__(/*! fbjs/lib/cx */ "./node_modules/fbjs/lib/cx.js");

/**
 * This component is responsible for rendering placeholder text for the
 * `DraftEditor` component.
 *
 * Override placeholder style via CSS.
 */
var DraftEditorPlaceholder = /*#__PURE__*/function (_React$Component) {
  _inheritsLoose(DraftEditorPlaceholder, _React$Component);

  function DraftEditorPlaceholder() {
    return _React$Component.apply(this, arguments) || this;
  }

  var _proto = DraftEditorPlaceholder.prototype;

  _proto.shouldComponentUpdate = function shouldComponentUpdate(nextProps) {
    return this.props.text !== nextProps.text || this.props.editorState.getSelection().getHasFocus() !== nextProps.editorState.getSelection().getHasFocus();
  };

  _proto.render = function render() {
    var hasFocus = this.props.editorState.getSelection().getHasFocus();
    var className = cx({
      'public/DraftEditorPlaceholder/root': true,
      'public/DraftEditorPlaceholder/hasFocus': hasFocus
    });
    var contentStyle = {
      whiteSpace: 'pre-wrap'
    };
    return React.createElement("div", {
      className: className
    }, React.createElement("div", {
      className: cx('public/DraftEditorPlaceholder/inner'),
      id: this.props.accessibilityID,
      style: contentStyle
    }, this.props.text));
  };

  return DraftEditorPlaceholder;
}(React.Component);

module.exports = DraftEditorPlaceholder;

/***/ }),

/***/ "./node_modules/draft-js/lib/DraftEditorTextNode.react.js":
/*!****************************************************************!*\
  !*** ./node_modules/draft-js/lib/DraftEditorTextNode.react.js ***!
  \****************************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";
/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @format
 * 
 * @emails oncall+draft_js
 */


function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _inheritsLoose(subClass, superClass) { subClass.prototype = Object.create(superClass.prototype); subClass.prototype.constructor = subClass; subClass.__proto__ = superClass; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var React = __webpack_require__(/*! react */ "./node_modules/react/index.js");

var UserAgent = __webpack_require__(/*! fbjs/lib/UserAgent */ "./node_modules/fbjs/lib/UserAgent.js");

var invariant = __webpack_require__(/*! fbjs/lib/invariant */ "./node_modules/fbjs/lib/invariant.js");

var isElement = __webpack_require__(/*! ./isElement */ "./node_modules/draft-js/lib/isElement.js"); // In IE, spans with <br> tags render as two newlines. By rendering a span
// with only a newline character, we can be sure to render a single line.


var useNewlineChar = UserAgent.isBrowser('IE <= 11');
/**
 * Check whether the node should be considered a newline.
 */

function isNewline(node) {
  return useNewlineChar ? node.textContent === '\n' : node.tagName === 'BR';
}
/**
 * Placeholder elements for empty text content.
 *
 * What is this `data-text` attribute, anyway? It turns out that we need to
 * put an attribute on the lowest-level text node in order to preserve correct
 * spellcheck handling. If the <span> is naked, Chrome and Safari may do
 * bizarre things to do the DOM -- split text nodes, create extra spans, etc.
 * If the <span> has an attribute, this appears not to happen.
 * See http://jsfiddle.net/9khdavod/ for the failure case, and
 * http://jsfiddle.net/7pg143f7/ for the fixed case.
 */


var NEWLINE_A = function NEWLINE_A(ref) {
  return useNewlineChar ? React.createElement("span", {
    key: "A",
    "data-text": "true",
    ref: ref
  }, '\n') : React.createElement("br", {
    key: "A",
    "data-text": "true",
    ref: ref
  });
};

var NEWLINE_B = function NEWLINE_B(ref) {
  return useNewlineChar ? React.createElement("span", {
    key: "B",
    "data-text": "true",
    ref: ref
  }, '\n') : React.createElement("br", {
    key: "B",
    "data-text": "true",
    ref: ref
  });
};

/**
 * The lowest-level component in a `DraftEditor`, the text node component
 * replaces the default React text node implementation. This allows us to
 * perform custom handling of newline behavior and avoid re-rendering text
 * nodes with DOM state that already matches the expectations of our immutable
 * editor state.
 */
var DraftEditorTextNode = /*#__PURE__*/function (_React$Component) {
  _inheritsLoose(DraftEditorTextNode, _React$Component);

  function DraftEditorTextNode(props) {
    var _this;

    _this = _React$Component.call(this, props) || this; // By flipping this flag, we also keep flipping keys which forces
    // React to remount this node every time it rerenders.

    _defineProperty(_assertThisInitialized(_this), "_forceFlag", void 0);

    _defineProperty(_assertThisInitialized(_this), "_node", void 0);

    _this._forceFlag = false;
    return _this;
  }

  var _proto = DraftEditorTextNode.prototype;

  _proto.shouldComponentUpdate = function shouldComponentUpdate(nextProps) {
    var node = this._node;
    var shouldBeNewline = nextProps.children === '';
    !isElement(node) ?  true ? invariant(false, 'node is not an Element') : 0 : void 0;
    var elementNode = node;

    if (shouldBeNewline) {
      return !isNewline(elementNode);
    }

    return elementNode.textContent !== nextProps.children;
  };

  _proto.componentDidMount = function componentDidMount() {
    this._forceFlag = !this._forceFlag;
  };

  _proto.componentDidUpdate = function componentDidUpdate() {
    this._forceFlag = !this._forceFlag;
  };

  _proto.render = function render() {
    var _this2 = this;

    if (this.props.children === '') {
      return this._forceFlag ? NEWLINE_A(function (ref) {
        return _this2._node = ref;
      }) : NEWLINE_B(function (ref) {
        return _this2._node = ref;
      });
    }

    return React.createElement("span", {
      key: this._forceFlag ? 'A' : 'B',
      "data-text": "true",
      ref: function ref(_ref) {
        return _this2._node = _ref;
      }
    }, this.props.children);
  };

  return DraftEditorTextNode;
}(React.Component);

module.exports = DraftEditorTextNode;

/***/ }),

/***/ "./node_modules/draft-js/lib/DraftEffects.js":
/*!***************************************************!*\
  !*** ./node_modules/draft-js/lib/DraftEffects.js ***!
  \***************************************************/
/***/ ((module) => {

"use strict";
/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */


module.exports = {
  initODS: function initODS() {},
  handleExtensionCausedError: function handleExtensionCausedError() {}
};

/***/ }),

/***/ "./node_modules/draft-js/lib/DraftEntity.js":
/*!**************************************************!*\
  !*** ./node_modules/draft-js/lib/DraftEntity.js ***!
  \**************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";


function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; var ownKeys = Object.keys(source); if (typeof Object.getOwnPropertySymbols === 'function') { ownKeys = ownKeys.concat(Object.getOwnPropertySymbols(source).filter(function (sym) { return Object.getOwnPropertyDescriptor(source, sym).enumerable; })); } ownKeys.forEach(function (key) { _defineProperty(target, key, source[key]); }); } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @format
 * 
 * @emails oncall+draft_js
 */
var DraftEntityInstance = __webpack_require__(/*! ./DraftEntityInstance */ "./node_modules/draft-js/lib/DraftEntityInstance.js");

var Immutable = __webpack_require__(/*! immutable */ "./node_modules/draft-js/node_modules/immutable/dist/immutable.js");

var invariant = __webpack_require__(/*! fbjs/lib/invariant */ "./node_modules/fbjs/lib/invariant.js");

var uuid = __webpack_require__(/*! ./uuid */ "./node_modules/draft-js/lib/uuid.js");

var Map = Immutable.Map;
var instances = Map();
var instanceKey = uuid();
/**
 * Temporary utility for generating the warnings
 */

function logWarning(oldMethodCall, newMethodCall) {
  console.warn('WARNING: ' + oldMethodCall + ' will be deprecated soon!\nPlease use "' + newMethodCall + '" instead.');
}

/**
 * A "document entity" is an object containing metadata associated with a
 * piece of text in a ContentBlock.
 *
 * For example, a `link` entity might include a `uri` property. When a
 * ContentBlock is rendered in the browser, text that refers to that link
 * entity may be rendered as an anchor, with the `uri` as the href value.
 *
 * In a ContentBlock, every position in the text may correspond to zero
 * or one entities. This correspondence is tracked using a key string,
 * generated via DraftEntity.create() and used to obtain entity metadata
 * via DraftEntity.get().
 */
var DraftEntity = {
  /**
   * WARNING: This method will be deprecated soon!
   * Please use 'contentState.getLastCreatedEntityKey' instead.
   * ---
   * Get the random key string from whatever entity was last created.
   * We need this to support the new API, as part of transitioning to put Entity
   * storage in contentState.
   */
  getLastCreatedEntityKey: function getLastCreatedEntityKey() {
    logWarning('DraftEntity.getLastCreatedEntityKey', 'contentState.getLastCreatedEntityKey');
    return DraftEntity.__getLastCreatedEntityKey();
  },

  /**
   * WARNING: This method will be deprecated soon!
   * Please use 'contentState.createEntity' instead.
   * ---
   * Create a DraftEntityInstance and store it for later retrieval.
   *
   * A random key string will be generated and returned. This key may
   * be used to track the entity's usage in a ContentBlock, and for
   * retrieving data about the entity at render time.
   */
  create: function create(type, mutability, data) {
    logWarning('DraftEntity.create', 'contentState.createEntity');
    return DraftEntity.__create(type, mutability, data);
  },

  /**
   * WARNING: This method will be deprecated soon!
   * Please use 'contentState.addEntity' instead.
   * ---
   * Add an existing DraftEntityInstance to the DraftEntity map. This is
   * useful when restoring instances from the server.
   */
  add: function add(instance) {
    logWarning('DraftEntity.add', 'contentState.addEntity');
    return DraftEntity.__add(instance);
  },

  /**
   * WARNING: This method will be deprecated soon!
   * Please use 'contentState.getEntity' instead.
   * ---
   * Retrieve the entity corresponding to the supplied key string.
   */
  get: function get(key) {
    logWarning('DraftEntity.get', 'contentState.getEntity');
    return DraftEntity.__get(key);
  },

  /**
   * Get all the entities in the content state.
   */
  __getAll: function __getAll() {
    return instances;
  },

  /**
   * Load the entity map with the given set of entities.
   */
  __loadWithEntities: function __loadWithEntities(entities) {
    instances = entities;
    instanceKey = uuid();
  },

  /**
   * WARNING: This method will be deprecated soon!
   * Please use 'contentState.mergeEntityData' instead.
   * ---
   * Entity instances are immutable. If you need to update the data for an
   * instance, this method will merge your data updates and return a new
   * instance.
   */
  mergeData: function mergeData(key, toMerge) {
    logWarning('DraftEntity.mergeData', 'contentState.mergeEntityData');
    return DraftEntity.__mergeData(key, toMerge);
  },

  /**
   * WARNING: This method will be deprecated soon!
   * Please use 'contentState.replaceEntityData' instead.
   * ---
   * Completely replace the data for a given instance.
   */
  replaceData: function replaceData(key, newData) {
    logWarning('DraftEntity.replaceData', 'contentState.replaceEntityData');
    return DraftEntity.__replaceData(key, newData);
  },
  // ***********************************WARNING******************************
  // --- the above public API will be deprecated in the next version of Draft!
  // The methods below this line are private - don't call them directly.

  /**
   * Get the random key string from whatever entity was last created.
   * We need this to support the new API, as part of transitioning to put Entity
   * storage in contentState.
   */
  __getLastCreatedEntityKey: function __getLastCreatedEntityKey() {
    return instanceKey;
  },

  /**
   * Create a DraftEntityInstance and store it for later retrieval.
   *
   * A random key string will be generated and returned. This key may
   * be used to track the entity's usage in a ContentBlock, and for
   * retrieving data about the entity at render time.
   */
  __create: function __create(type, mutability, data) {
    return DraftEntity.__add(new DraftEntityInstance({
      type: type,
      mutability: mutability,
      data: data || {}
    }));
  },

  /**
   * Add an existing DraftEntityInstance to the DraftEntity map. This is
   * useful when restoring instances from the server.
   */
  __add: function __add(instance) {
    instanceKey = uuid();
    instances = instances.set(instanceKey, instance);
    return instanceKey;
  },

  /**
   * Retrieve the entity corresponding to the supplied key string.
   */
  __get: function __get(key) {
    var instance = instances.get(key);
    !!!instance ?  true ? invariant(false, 'Unknown DraftEntity key: %s.', key) : 0 : void 0;
    return instance;
  },

  /**
   * Entity instances are immutable. If you need to update the data for an
   * instance, this method will merge your data updates and return a new
   * instance.
   */
  __mergeData: function __mergeData(key, toMerge) {
    var instance = DraftEntity.__get(key);

    var newData = _objectSpread({}, instance.getData(), toMerge);

    var newInstance = instance.set('data', newData);
    instances = instances.set(key, newInstance);
    return newInstance;
  },

  /**
   * Completely replace the data for a given instance.
   */
  __replaceData: function __replaceData(key, newData) {
    var instance = DraftEntity.__get(key);

    var newInstance = instance.set('data', newData);
    instances = instances.set(key, newInstance);
    return newInstance;
  }
};
module.exports = DraftEntity;

/***/ }),

/***/ "./node_modules/draft-js/lib/DraftEntityInstance.js":
/*!**********************************************************!*\
  !*** ./node_modules/draft-js/lib/DraftEntityInstance.js ***!
  \**********************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";
/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @legacyServerCallableInstance
 * @format
 * 
 * @emails oncall+draft_js
 */


function _inheritsLoose(subClass, superClass) { subClass.prototype = Object.create(superClass.prototype); subClass.prototype.constructor = subClass; subClass.__proto__ = superClass; }

var Immutable = __webpack_require__(/*! immutable */ "./node_modules/draft-js/node_modules/immutable/dist/immutable.js");

var Record = Immutable.Record;
var DraftEntityInstanceRecord = Record({
  type: 'TOKEN',
  mutability: 'IMMUTABLE',
  data: Object
});
/**
 * An instance of a document entity, consisting of a `type` and relevant
 * `data`, metadata about the entity.
 *
 * For instance, a "link" entity might provide a URI, and a "mention"
 * entity might provide the mentioned user's ID. These pieces of data
 * may be used when rendering the entity as part of a ContentBlock DOM
 * representation. For a link, the data would be used as an href for
 * the rendered anchor. For a mention, the ID could be used to retrieve
 * a hovercard.
 */

var DraftEntityInstance = /*#__PURE__*/function (_DraftEntityInstanceR) {
  _inheritsLoose(DraftEntityInstance, _DraftEntityInstanceR);

  function DraftEntityInstance() {
    return _DraftEntityInstanceR.apply(this, arguments) || this;
  }

  var _proto = DraftEntityInstance.prototype;

  _proto.getType = function getType() {
    return this.get('type');
  };

  _proto.getMutability = function getMutability() {
    return this.get('mutability');
  };

  _proto.getData = function getData() {
    return this.get('data');
  };

  return DraftEntityInstance;
}(DraftEntityInstanceRecord);

module.exports = DraftEntityInstance;

/***/ }),

/***/ "./node_modules/draft-js/lib/DraftEntitySegments.js":
/*!**********************************************************!*\
  !*** ./node_modules/draft-js/lib/DraftEntitySegments.js ***!
  \**********************************************************/
/***/ ((module) => {

"use strict";
/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @format
 * 
 * @emails oncall+draft_js
 */


/**
 * Identify the range to delete from a segmented entity.
 *
 * Rules:
 *
 *  Example: 'John F. Kennedy'
 *
 *   - Deletion from within any non-whitespace (i.e. ['John', 'F.', 'Kennedy'])
 *     will return the range of that text.
 *
 *       'John F. Kennedy' -> 'John F.'
 *                  ^
 *
 *   - Forward deletion of whitespace will remove the following section:
 *
 *       'John F. Kennedy' -> 'John Kennedy'
 *            ^
 *
 *   - Backward deletion of whitespace will remove the previous section:
 *
 *       'John F. Kennedy' -> 'F. Kennedy'
 *            ^
 */
var DraftEntitySegments = {
  getRemovalRange: function getRemovalRange(selectionStart, selectionEnd, text, entityStart, direction) {
    var segments = text.split(' ');
    segments = segments.map(function (
    /*string*/
    segment,
    /*number*/
    ii) {
      if (direction === 'forward') {
        if (ii > 0) {
          return ' ' + segment;
        }
      } else if (ii < segments.length - 1) {
        return segment + ' ';
      }

      return segment;
    });
    var segmentStart = entityStart;
    var segmentEnd;
    var segment;
    var removalStart = null;
    var removalEnd = null;

    for (var jj = 0; jj < segments.length; jj++) {
      segment = segments[jj];
      segmentEnd = segmentStart + segment.length; // Our selection overlaps this segment.

      if (selectionStart < segmentEnd && segmentStart < selectionEnd) {
        if (removalStart !== null) {
          removalEnd = segmentEnd;
        } else {
          removalStart = segmentStart;
          removalEnd = segmentEnd;
        }
      } else if (removalStart !== null) {
        break;
      }

      segmentStart = segmentEnd;
    }

    var entityEnd = entityStart + text.length;
    var atStart = removalStart === entityStart;
    var atEnd = removalEnd === entityEnd;

    if (!atStart && atEnd || atStart && !atEnd) {
      if (direction === 'forward') {
        if (removalEnd !== entityEnd) {
          removalEnd++;
        }
      } else if (removalStart !== entityStart) {
        removalStart--;
      }
    }

    return {
      start: removalStart,
      end: removalEnd
    };
  }
};
module.exports = DraftEntitySegments;

/***/ }),

/***/ "./node_modules/draft-js/lib/DraftJsDebugLogging.js":
/*!**********************************************************!*\
  !*** ./node_modules/draft-js/lib/DraftJsDebugLogging.js ***!
  \**********************************************************/
/***/ ((module) => {

"use strict";
/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */


module.exports = {
  logBlockedSelectionEvent: function logBlockedSelectionEvent() {
    return null;
  },
  logSelectionStateFailure: function logSelectionStateFailure() {
    return null;
  }
};

/***/ }),

/***/ "./node_modules/draft-js/lib/DraftModifier.js":
/*!****************************************************!*\
  !*** ./node_modules/draft-js/lib/DraftModifier.js ***!
  \****************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";
/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @format
 * 
 * @emails oncall+draft_js
 */


var CharacterMetadata = __webpack_require__(/*! ./CharacterMetadata */ "./node_modules/draft-js/lib/CharacterMetadata.js");

var ContentStateInlineStyle = __webpack_require__(/*! ./ContentStateInlineStyle */ "./node_modules/draft-js/lib/ContentStateInlineStyle.js");

var applyEntityToContentState = __webpack_require__(/*! ./applyEntityToContentState */ "./node_modules/draft-js/lib/applyEntityToContentState.js");

var getCharacterRemovalRange = __webpack_require__(/*! ./getCharacterRemovalRange */ "./node_modules/draft-js/lib/getCharacterRemovalRange.js");

var getContentStateFragment = __webpack_require__(/*! ./getContentStateFragment */ "./node_modules/draft-js/lib/getContentStateFragment.js");

var Immutable = __webpack_require__(/*! immutable */ "./node_modules/draft-js/node_modules/immutable/dist/immutable.js");

var insertFragmentIntoContentState = __webpack_require__(/*! ./insertFragmentIntoContentState */ "./node_modules/draft-js/lib/insertFragmentIntoContentState.js");

var insertTextIntoContentState = __webpack_require__(/*! ./insertTextIntoContentState */ "./node_modules/draft-js/lib/insertTextIntoContentState.js");

var invariant = __webpack_require__(/*! fbjs/lib/invariant */ "./node_modules/fbjs/lib/invariant.js");

var modifyBlockForContentState = __webpack_require__(/*! ./modifyBlockForContentState */ "./node_modules/draft-js/lib/modifyBlockForContentState.js");

var removeEntitiesAtEdges = __webpack_require__(/*! ./removeEntitiesAtEdges */ "./node_modules/draft-js/lib/removeEntitiesAtEdges.js");

var removeRangeFromContentState = __webpack_require__(/*! ./removeRangeFromContentState */ "./node_modules/draft-js/lib/removeRangeFromContentState.js");

var splitBlockInContentState = __webpack_require__(/*! ./splitBlockInContentState */ "./node_modules/draft-js/lib/splitBlockInContentState.js");

var OrderedSet = Immutable.OrderedSet;
/**
 * `DraftModifier` provides a set of convenience methods that apply
 * modifications to a `ContentState` object based on a target `SelectionState`.
 *
 * Any change to a `ContentState` should be decomposable into a series of
 * transaction functions that apply the required changes and return output
 * `ContentState` objects.
 *
 * These functions encapsulate some of the most common transaction sequences.
 */

var DraftModifier = {
  replaceText: function replaceText(contentState, rangeToReplace, text, inlineStyle, entityKey) {
    var withoutEntities = removeEntitiesAtEdges(contentState, rangeToReplace);
    var withoutText = removeRangeFromContentState(withoutEntities, rangeToReplace);
    var character = CharacterMetadata.create({
      style: inlineStyle || OrderedSet(),
      entity: entityKey || null
    });
    return insertTextIntoContentState(withoutText, withoutText.getSelectionAfter(), text, character);
  },
  insertText: function insertText(contentState, targetRange, text, inlineStyle, entityKey) {
    !targetRange.isCollapsed() ?  true ? invariant(false, 'Target range must be collapsed for `insertText`.') : 0 : void 0;
    return DraftModifier.replaceText(contentState, targetRange, text, inlineStyle, entityKey);
  },
  moveText: function moveText(contentState, removalRange, targetRange) {
    var movedFragment = getContentStateFragment(contentState, removalRange);
    var afterRemoval = DraftModifier.removeRange(contentState, removalRange, 'backward');
    return DraftModifier.replaceWithFragment(afterRemoval, targetRange, movedFragment);
  },
  replaceWithFragment: function replaceWithFragment(contentState, targetRange, fragment) {
    var mergeBlockData = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : 'REPLACE_WITH_NEW_DATA';
    var withoutEntities = removeEntitiesAtEdges(contentState, targetRange);
    var withoutText = removeRangeFromContentState(withoutEntities, targetRange);
    return insertFragmentIntoContentState(withoutText, withoutText.getSelectionAfter(), fragment, mergeBlockData);
  },
  removeRange: function removeRange(contentState, rangeToRemove, removalDirection) {
    var startKey, endKey, startBlock, endBlock;

    if (rangeToRemove.getIsBackward()) {
      rangeToRemove = rangeToRemove.merge({
        anchorKey: rangeToRemove.getFocusKey(),
        anchorOffset: rangeToRemove.getFocusOffset(),
        focusKey: rangeToRemove.getAnchorKey(),
        focusOffset: rangeToRemove.getAnchorOffset(),
        isBackward: false
      });
    }

    startKey = rangeToRemove.getAnchorKey();
    endKey = rangeToRemove.getFocusKey();
    startBlock = contentState.getBlockForKey(startKey);
    endBlock = contentState.getBlockForKey(endKey);
    var startOffset = rangeToRemove.getStartOffset();
    var endOffset = rangeToRemove.getEndOffset();
    var startEntityKey = startBlock.getEntityAt(startOffset);
    var endEntityKey = endBlock.getEntityAt(endOffset - 1); // Check whether the selection state overlaps with a single entity.
    // If so, try to remove the appropriate substring of the entity text.

    if (startKey === endKey) {
      if (startEntityKey && startEntityKey === endEntityKey) {
        var adjustedRemovalRange = getCharacterRemovalRange(contentState.getEntityMap(), startBlock, endBlock, rangeToRemove, removalDirection);
        return removeRangeFromContentState(contentState, adjustedRemovalRange);
      }
    }

    var withoutEntities = removeEntitiesAtEdges(contentState, rangeToRemove);
    return removeRangeFromContentState(withoutEntities, rangeToRemove);
  },
  splitBlock: function splitBlock(contentState, selectionState) {
    var withoutEntities = removeEntitiesAtEdges(contentState, selectionState);
    var withoutText = removeRangeFromContentState(withoutEntities, selectionState);
    return splitBlockInContentState(withoutText, withoutText.getSelectionAfter());
  },
  applyInlineStyle: function applyInlineStyle(contentState, selectionState, inlineStyle) {
    return ContentStateInlineStyle.add(contentState, selectionState, inlineStyle);
  },
  removeInlineStyle: function removeInlineStyle(contentState, selectionState, inlineStyle) {
    return ContentStateInlineStyle.remove(contentState, selectionState, inlineStyle);
  },
  setBlockType: function setBlockType(contentState, selectionState, blockType) {
    return modifyBlockForContentState(contentState, selectionState, function (block) {
      return block.merge({
        type: blockType,
        depth: 0
      });
    });
  },
  setBlockData: function setBlockData(contentState, selectionState, blockData) {
    return modifyBlockForContentState(contentState, selectionState, function (block) {
      return block.merge({
        data: blockData
      });
    });
  },
  mergeBlockData: function mergeBlockData(contentState, selectionState, blockData) {
    return modifyBlockForContentState(contentState, selectionState, function (block) {
      return block.merge({
        data: block.getData().merge(blockData)
      });
    });
  },
  applyEntity: function applyEntity(contentState, selectionState, entityKey) {
    var withoutEntities = removeEntitiesAtEdges(contentState, selectionState);
    return applyEntityToContentState(withoutEntities, selectionState, entityKey);
  }
};
module.exports = DraftModifier;

/***/ }),

/***/ "./node_modules/draft-js/lib/DraftOffsetKey.js":
/*!*****************************************************!*\
  !*** ./node_modules/draft-js/lib/DraftOffsetKey.js ***!
  \*****************************************************/
/***/ ((module) => {

"use strict";
/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @format
 * 
 * @emails oncall+draft_js
 */


var KEY_DELIMITER = '-';
var DraftOffsetKey = {
  encode: function encode(blockKey, decoratorKey, leafKey) {
    return blockKey + KEY_DELIMITER + decoratorKey + KEY_DELIMITER + leafKey;
  },
  decode: function decode(offsetKey) {
    // Extracts the last two parts of offsetKey and captures the rest in blockKeyParts
    var _offsetKey$split$reve = offsetKey.split(KEY_DELIMITER).reverse(),
        leafKey = _offsetKey$split$reve[0],
        decoratorKey = _offsetKey$split$reve[1],
        blockKeyParts = _offsetKey$split$reve.slice(2);

    return {
      // Recomposes the parts of blockKey after reversing them
      blockKey: blockKeyParts.reverse().join(KEY_DELIMITER),
      decoratorKey: parseInt(decoratorKey, 10),
      leafKey: parseInt(leafKey, 10)
    };
  }
};
module.exports = DraftOffsetKey;

/***/ }),

/***/ "./node_modules/draft-js/lib/DraftPasteProcessor.js":
/*!**********************************************************!*\
  !*** ./node_modules/draft-js/lib/DraftPasteProcessor.js ***!
  \**********************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";
/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @format
 * 
 * @emails oncall+draft_js
 */


function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; var ownKeys = Object.keys(source); if (typeof Object.getOwnPropertySymbols === 'function') { ownKeys = ownKeys.concat(Object.getOwnPropertySymbols(source).filter(function (sym) { return Object.getOwnPropertyDescriptor(source, sym).enumerable; })); } ownKeys.forEach(function (key) { _defineProperty(target, key, source[key]); }); } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var ContentBlock = __webpack_require__(/*! ./ContentBlock */ "./node_modules/draft-js/lib/ContentBlock.js");

var ContentBlockNode = __webpack_require__(/*! ./ContentBlockNode */ "./node_modules/draft-js/lib/ContentBlockNode.js");

var convertFromHTMLToContentBlocks = __webpack_require__(/*! ./convertFromHTMLToContentBlocks */ "./node_modules/draft-js/lib/convertFromHTMLToContentBlocks.js");

var generateRandomKey = __webpack_require__(/*! ./generateRandomKey */ "./node_modules/draft-js/lib/generateRandomKey.js");

var getSafeBodyFromHTML = __webpack_require__(/*! ./getSafeBodyFromHTML */ "./node_modules/draft-js/lib/getSafeBodyFromHTML.js");

var gkx = __webpack_require__(/*! ./gkx */ "./node_modules/draft-js/lib/gkx.js");

var Immutable = __webpack_require__(/*! immutable */ "./node_modules/draft-js/node_modules/immutable/dist/immutable.js");

var sanitizeDraftText = __webpack_require__(/*! ./sanitizeDraftText */ "./node_modules/draft-js/lib/sanitizeDraftText.js");

var List = Immutable.List,
    Repeat = Immutable.Repeat;
var experimentalTreeDataSupport = gkx('draft_tree_data_support');
var ContentBlockRecord = experimentalTreeDataSupport ? ContentBlockNode : ContentBlock;
var DraftPasteProcessor = {
  processHTML: function processHTML(html, blockRenderMap) {
    return convertFromHTMLToContentBlocks(html, getSafeBodyFromHTML, blockRenderMap);
  },
  processText: function processText(textBlocks, character, type) {
    return textBlocks.reduce(function (acc, textLine, index) {
      textLine = sanitizeDraftText(textLine);
      var key = generateRandomKey();
      var blockNodeConfig = {
        key: key,
        type: type,
        text: textLine,
        characterList: List(Repeat(character, textLine.length))
      }; // next block updates previous block

      if (experimentalTreeDataSupport && index !== 0) {
        var prevSiblingIndex = index - 1; // update previous block

        var previousBlock = acc[prevSiblingIndex] = acc[prevSiblingIndex].merge({
          nextSibling: key
        });
        blockNodeConfig = _objectSpread({}, blockNodeConfig, {
          prevSibling: previousBlock.getKey()
        });
      }

      acc.push(new ContentBlockRecord(blockNodeConfig));
      return acc;
    }, []);
  }
};
module.exports = DraftPasteProcessor;

/***/ }),

/***/ "./node_modules/draft-js/lib/DraftRemovableWord.js":
/*!*********************************************************!*\
  !*** ./node_modules/draft-js/lib/DraftRemovableWord.js ***!
  \*********************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";
/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @format
 * 
 * @emails oncall+draft_js
 */


var TokenizeUtil = __webpack_require__(/*! fbjs/lib/TokenizeUtil */ "./node_modules/fbjs/lib/TokenizeUtil.js");

var punctuation = TokenizeUtil.getPunctuation(); // The apostrophe and curly single quotes behave in a curious way: when
// surrounded on both sides by word characters, they behave as word chars; when
// either neighbor is punctuation or an end of the string, they behave as
// punctuation.

var CHAMELEON_CHARS = "['\u2018\u2019]"; // Remove the underscore, which should count as part of the removable word. The
// "chameleon chars" also count as punctuation in this regex.

var WHITESPACE_AND_PUNCTUATION = '\\s|(?![_])' + punctuation;
var DELETE_STRING = '^' + '(?:' + WHITESPACE_AND_PUNCTUATION + ')*' + '(?:' + CHAMELEON_CHARS + '|(?!' + WHITESPACE_AND_PUNCTUATION + ').)*' + '(?:(?!' + WHITESPACE_AND_PUNCTUATION + ').)';
var DELETE_REGEX = new RegExp(DELETE_STRING);
var BACKSPACE_STRING = '(?:(?!' + WHITESPACE_AND_PUNCTUATION + ').)' + '(?:' + CHAMELEON_CHARS + '|(?!' + WHITESPACE_AND_PUNCTUATION + ').)*' + '(?:' + WHITESPACE_AND_PUNCTUATION + ')*' + '$';
var BACKSPACE_REGEX = new RegExp(BACKSPACE_STRING);

function getRemovableWord(text, isBackward) {
  var matches = isBackward ? BACKSPACE_REGEX.exec(text) : DELETE_REGEX.exec(text);
  return matches ? matches[0] : text;
}

var DraftRemovableWord = {
  getBackward: function getBackward(text) {
    return getRemovableWord(text, true);
  },
  getForward: function getForward(text) {
    return getRemovableWord(text, false);
  }
};
module.exports = DraftRemovableWord;

/***/ }),

/***/ "./node_modules/draft-js/lib/DraftStringKey.js":
/*!*****************************************************!*\
  !*** ./node_modules/draft-js/lib/DraftStringKey.js ***!
  \*****************************************************/
/***/ ((module) => {

"use strict";
/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @format
 * 
 * @emails oncall+draft_js
 */


var DraftStringKey = {
  stringify: function stringify(key) {
    return '_' + String(key);
  },
  unstringify: function unstringify(key) {
    return key.slice(1);
  }
};
module.exports = DraftStringKey;

/***/ }),

/***/ "./node_modules/draft-js/lib/DraftTreeAdapter.js":
/*!*******************************************************!*\
  !*** ./node_modules/draft-js/lib/DraftTreeAdapter.js ***!
  \*******************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";


function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; var ownKeys = Object.keys(source); if (typeof Object.getOwnPropertySymbols === 'function') { ownKeys = ownKeys.concat(Object.getOwnPropertySymbols(source).filter(function (sym) { return Object.getOwnPropertyDescriptor(source, sym).enumerable; })); } ownKeys.forEach(function (key) { _defineProperty(target, key, source[key]); }); } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @format
 * 
 * @emails oncall+draft_js
 *
 * This is unstable and not part of the public API and should not be used by
 * production systems. This file may be update/removed without notice.
 */
var generateRandomKey = __webpack_require__(/*! ./generateRandomKey */ "./node_modules/draft-js/lib/generateRandomKey.js");

var invariant = __webpack_require__(/*! fbjs/lib/invariant */ "./node_modules/fbjs/lib/invariant.js");

var traverseInDepthOrder = function traverseInDepthOrder(blocks, fn) {
  var stack = [].concat(blocks).reverse();

  while (stack.length) {
    var _block = stack.pop();

    fn(_block);
    var children = _block.children;
    !Array.isArray(children) ?  true ? invariant(false, 'Invalid tree raw block') : 0 : void 0;
    stack = stack.concat([].concat(children.reverse()));
  }
};

var isListBlock = function isListBlock(block) {
  if (!(block && block.type)) {
    return false;
  }

  var type = block.type;
  return type === 'unordered-list-item' || type === 'ordered-list-item';
};

var addDepthToChildren = function addDepthToChildren(block) {
  if (Array.isArray(block.children)) {
    block.children = block.children.map(function (child) {
      return child.type === block.type ? _objectSpread({}, child, {
        depth: (block.depth || 0) + 1
      }) : child;
    });
  }
};
/**
 * This adapter is intended to be be used as an adapter to draft tree data
 *
 * draft state <=====> draft tree state
 */


var DraftTreeAdapter = {
  /**
   * Converts from a tree raw state back to draft raw state
   */
  fromRawTreeStateToRawState: function fromRawTreeStateToRawState(draftTreeState) {
    var blocks = draftTreeState.blocks;
    var transformedBlocks = [];
    !Array.isArray(blocks) ?  true ? invariant(false, 'Invalid raw state') : 0 : void 0;

    if (!Array.isArray(blocks) || !blocks.length) {
      return draftTreeState;
    }

    traverseInDepthOrder(blocks, function (block) {
      var newBlock = _objectSpread({}, block);

      if (isListBlock(block)) {
        newBlock.depth = newBlock.depth || 0;
        addDepthToChildren(block); // if it's a non-leaf node, we don't do anything else

        if (block.children != null && block.children.length > 0) {
          return;
        }
      }

      delete newBlock.children;
      transformedBlocks.push(newBlock);
    });
    draftTreeState.blocks = transformedBlocks;
    return _objectSpread({}, draftTreeState, {
      blocks: transformedBlocks
    });
  },

  /**
   * Converts from draft raw state to tree draft state
   */
  fromRawStateToRawTreeState: function fromRawStateToRawTreeState(draftState) {
    var transformedBlocks = [];
    var parentStack = [];
    draftState.blocks.forEach(function (block) {
      var isList = isListBlock(block);
      var depth = block.depth || 0;

      var treeBlock = _objectSpread({}, block, {
        children: []
      });

      if (!isList) {
        transformedBlocks.push(treeBlock);
        return;
      }

      var lastParent = parentStack[0]; // block is non-nested & there are no nested blocks, directly push block

      if (lastParent == null && depth === 0) {
        transformedBlocks.push(treeBlock); // block is first nested block or previous nested block is at a lower level
      } else if (lastParent == null || lastParent.depth < depth - 1) {
        // create new parent block
        var newParent = {
          key: generateRandomKey(),
          text: '',
          depth: depth - 1,
          type: block.type,
          children: [],
          entityRanges: [],
          inlineStyleRanges: []
        };
        parentStack.unshift(newParent);

        if (depth === 1) {
          // add as a root-level block
          transformedBlocks.push(newParent);
        } else if (lastParent != null) {
          // depth > 1 => also add as previous parent's child
          lastParent.children.push(newParent);
        }

        newParent.children.push(treeBlock);
      } else if (lastParent.depth === depth - 1) {
        // add as child of last parent
        lastParent.children.push(treeBlock);
      } else {
        // pop out parents at levels above this one from the parent stack
        while (lastParent != null && lastParent.depth >= depth) {
          parentStack.shift();
          lastParent = parentStack[0];
        }

        if (depth > 0) {
          lastParent.children.push(treeBlock);
        } else {
          transformedBlocks.push(treeBlock);
        }
      }
    });
    return _objectSpread({}, draftState, {
      blocks: transformedBlocks
    });
  }
};
module.exports = DraftTreeAdapter;

/***/ }),

/***/ "./node_modules/draft-js/lib/DraftTreeInvariants.js":
/*!**********************************************************!*\
  !*** ./node_modules/draft-js/lib/DraftTreeInvariants.js ***!
  \**********************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";


/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @format
 * 
 * @emails oncall+draft_js
 *
 * This is unstable and not part of the public API and should not be used by
 * production systems. This file may be update/removed without notice.
 */
var warning = __webpack_require__(/*! fbjs/lib/warning */ "./node_modules/fbjs/lib/warning.js");

var DraftTreeInvariants = {
  /**
   * Check if the block is valid
   */
  isValidBlock: function isValidBlock(block, blockMap) {
    var key = block.getKey(); // is its parent's child

    var parentKey = block.getParentKey();

    if (parentKey != null) {
      var parent = blockMap.get(parentKey);

      if (!parent.getChildKeys().includes(key)) {
         true ? warning(true, 'Tree is missing parent -> child pointer on %s', key) : 0;
        return false;
      }
    } // is its children's parent


    var children = block.getChildKeys().map(function (k) {
      return blockMap.get(k);
    });

    if (!children.every(function (c) {
      return c.getParentKey() === key;
    })) {
       true ? warning(true, 'Tree is missing child -> parent pointer on %s', key) : 0;
      return false;
    } // is its previous sibling's next sibling


    var prevSiblingKey = block.getPrevSiblingKey();

    if (prevSiblingKey != null) {
      var prevSibling = blockMap.get(prevSiblingKey);

      if (prevSibling.getNextSiblingKey() !== key) {
         true ? warning(true, "Tree is missing nextSibling pointer on %s's prevSibling", key) : 0;
        return false;
      }
    } // is its next sibling's previous sibling


    var nextSiblingKey = block.getNextSiblingKey();

    if (nextSiblingKey != null) {
      var nextSibling = blockMap.get(nextSiblingKey);

      if (nextSibling.getPrevSiblingKey() !== key) {
         true ? warning(true, "Tree is missing prevSibling pointer on %s's nextSibling", key) : 0;
        return false;
      }
    } // no 2-node cycles


    if (nextSiblingKey !== null && prevSiblingKey !== null) {
      if (prevSiblingKey === nextSiblingKey) {
         true ? warning(true, 'Tree has a two-node cycle at %s', key) : 0;
        return false;
      }
    } // if it's a leaf node, it has text but no children


    if (block.text != '') {
      if (block.getChildKeys().size > 0) {
         true ? warning(true, 'Leaf node %s has children', key) : 0;
        return false;
      }
    }

    return true;
  },

  /**
   * Checks that this is a connected tree on all the blocks
   * starting from the first block, traversing nextSibling and child pointers
   * should be a tree (preorder traversal - parent, then children)
   * num of connected node === number of blocks
   */
  isConnectedTree: function isConnectedTree(blockMap) {
    // exactly one node has no previous sibling + no parent
    var eligibleFirstNodes = blockMap.toArray().filter(function (block) {
      return block.getParentKey() == null && block.getPrevSiblingKey() == null;
    });

    if (eligibleFirstNodes.length !== 1) {
       true ? warning(true, 'Tree is not connected. More or less than one first node') : 0;
      return false;
    }

    var firstNode = eligibleFirstNodes.shift();
    var nodesSeen = 0;
    var currentKey = firstNode.getKey();
    var visitedStack = [];

    while (currentKey != null) {
      var currentNode = blockMap.get(currentKey);
      var childKeys = currentNode.getChildKeys();
      var nextSiblingKey = currentNode.getNextSiblingKey(); // if the node has children, add parent's next sibling to stack and go to children

      if (childKeys.size > 0) {
        if (nextSiblingKey != null) {
          visitedStack.unshift(nextSiblingKey);
        }

        var children = childKeys.map(function (k) {
          return blockMap.get(k);
        });

        var _firstNode = children.find(function (block) {
          return block.getPrevSiblingKey() == null;
        });

        if (_firstNode == null) {
           true ? warning(true, '%s has no first child', currentKey) : 0;
          return false;
        }

        currentKey = _firstNode.getKey(); // TODO(T32490138): Deal with multi-node cycles here
      } else {
        if (currentNode.getNextSiblingKey() != null) {
          currentKey = currentNode.getNextSiblingKey();
        } else {
          currentKey = visitedStack.shift();
        }
      }

      nodesSeen++;
    }

    if (nodesSeen !== blockMap.size) {
       true ? warning(true, 'Tree is not connected. %s nodes were seen instead of %s', nodesSeen, blockMap.size) : 0;
      return false;
    }

    return true;
  },

  /**
   * Checks that the block map is a connected tree with valid blocks
   */
  isValidTree: function isValidTree(blockMap) {
    var _this = this;

    var blocks = blockMap.toArray();

    if (!blocks.every(function (block) {
      return _this.isValidBlock(block, blockMap);
    })) {
      return false;
    }

    return this.isConnectedTree(blockMap);
  }
};
module.exports = DraftTreeInvariants;

/***/ }),

/***/ "./node_modules/draft-js/lib/EditorBidiService.js":
/*!********************************************************!*\
  !*** ./node_modules/draft-js/lib/EditorBidiService.js ***!
  \********************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";
/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @format
 * 
 * @emails oncall+draft_js
 */


var UnicodeBidiService = __webpack_require__(/*! fbjs/lib/UnicodeBidiService */ "./node_modules/fbjs/lib/UnicodeBidiService.js");

var Immutable = __webpack_require__(/*! immutable */ "./node_modules/draft-js/node_modules/immutable/dist/immutable.js");

var nullthrows = __webpack_require__(/*! fbjs/lib/nullthrows */ "./node_modules/fbjs/lib/nullthrows.js");

var OrderedMap = Immutable.OrderedMap;
var bidiService;
var EditorBidiService = {
  getDirectionMap: function getDirectionMap(content, prevBidiMap) {
    if (!bidiService) {
      bidiService = new UnicodeBidiService();
    } else {
      bidiService.reset();
    }

    var blockMap = content.getBlockMap();
    var nextBidi = blockMap.valueSeq().map(function (block) {
      return nullthrows(bidiService).getDirection(block.getText());
    });
    var bidiMap = OrderedMap(blockMap.keySeq().zip(nextBidi));

    if (prevBidiMap != null && Immutable.is(prevBidiMap, bidiMap)) {
      return prevBidiMap;
    }

    return bidiMap;
  }
};
module.exports = EditorBidiService;

/***/ }),

/***/ "./node_modules/draft-js/lib/EditorState.js":
/*!**************************************************!*\
  !*** ./node_modules/draft-js/lib/EditorState.js ***!
  \**************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";
/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @format
 * 
 * @emails oncall+draft_js
 */


function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; var ownKeys = Object.keys(source); if (typeof Object.getOwnPropertySymbols === 'function') { ownKeys = ownKeys.concat(Object.getOwnPropertySymbols(source).filter(function (sym) { return Object.getOwnPropertyDescriptor(source, sym).enumerable; })); } ownKeys.forEach(function (key) { _defineProperty(target, key, source[key]); }); } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var BlockTree = __webpack_require__(/*! ./BlockTree */ "./node_modules/draft-js/lib/BlockTree.js");

var ContentState = __webpack_require__(/*! ./ContentState */ "./node_modules/draft-js/lib/ContentState.js");

var EditorBidiService = __webpack_require__(/*! ./EditorBidiService */ "./node_modules/draft-js/lib/EditorBidiService.js");

var SelectionState = __webpack_require__(/*! ./SelectionState */ "./node_modules/draft-js/lib/SelectionState.js");

var Immutable = __webpack_require__(/*! immutable */ "./node_modules/draft-js/node_modules/immutable/dist/immutable.js");

var OrderedSet = Immutable.OrderedSet,
    Record = Immutable.Record,
    Stack = Immutable.Stack,
    OrderedMap = Immutable.OrderedMap,
    List = Immutable.List; // When configuring an editor, the user can chose to provide or not provide
// basically all keys. `currentContent` varies, so this type doesn't include it.
// (See the types defined below.)

var defaultRecord = {
  allowUndo: true,
  currentContent: null,
  decorator: null,
  directionMap: null,
  forceSelection: false,
  inCompositionMode: false,
  inlineStyleOverride: null,
  lastChangeType: null,
  nativelyRenderedContent: null,
  redoStack: Stack(),
  selection: null,
  treeMap: null,
  undoStack: Stack()
};
var EditorStateRecord = Record(defaultRecord);

var EditorState = /*#__PURE__*/function () {
  EditorState.createEmpty = function createEmpty(decorator) {
    return this.createWithText('', decorator);
  };

  EditorState.createWithText = function createWithText(text, decorator) {
    return EditorState.createWithContent(ContentState.createFromText(text), decorator);
  };

  EditorState.createWithContent = function createWithContent(contentState, decorator) {
    if (contentState.getBlockMap().count() === 0) {
      return EditorState.createEmpty(decorator);
    }

    var firstKey = contentState.getBlockMap().first().getKey();
    return EditorState.create({
      currentContent: contentState,
      undoStack: Stack(),
      redoStack: Stack(),
      decorator: decorator || null,
      selection: SelectionState.createEmpty(firstKey)
    });
  };

  EditorState.create = function create(config) {
    var currentContent = config.currentContent,
        decorator = config.decorator;

    var recordConfig = _objectSpread({}, config, {
      treeMap: generateNewTreeMap(currentContent, decorator),
      directionMap: EditorBidiService.getDirectionMap(currentContent)
    });

    return new EditorState(new EditorStateRecord(recordConfig));
  };

  EditorState.fromJS = function fromJS(config) {
    return new EditorState(new EditorStateRecord(_objectSpread({}, config, {
      directionMap: config.directionMap != null ? OrderedMap(config.directionMap) : config.directionMap,
      inlineStyleOverride: config.inlineStyleOverride != null ? OrderedSet(config.inlineStyleOverride) : config.inlineStyleOverride,
      nativelyRenderedContent: config.nativelyRenderedContent != null ? ContentState.fromJS(config.nativelyRenderedContent) : config.nativelyRenderedContent,
      redoStack: config.redoStack != null ? Stack(config.redoStack.map(function (v) {
        return ContentState.fromJS(v);
      })) : config.redoStack,
      selection: config.selection != null ? new SelectionState(config.selection) : config.selection,
      treeMap: config.treeMap != null ? OrderedMap(config.treeMap).map(function (v) {
        return List(v).map(function (v) {
          return BlockTree.fromJS(v);
        });
      }) : config.treeMap,
      undoStack: config.undoStack != null ? Stack(config.undoStack.map(function (v) {
        return ContentState.fromJS(v);
      })) : config.undoStack,
      currentContent: ContentState.fromJS(config.currentContent)
    })));
  };

  EditorState.set = function set(editorState, put) {
    var map = editorState.getImmutable().withMutations(function (state) {
      var existingDecorator = state.get('decorator');
      var decorator = existingDecorator;

      if (put.decorator === null) {
        decorator = null;
      } else if (put.decorator) {
        decorator = put.decorator;
      }

      var newContent = put.currentContent || editorState.getCurrentContent();

      if (decorator !== existingDecorator) {
        var treeMap = state.get('treeMap');
        var newTreeMap;

        if (decorator && existingDecorator) {
          newTreeMap = regenerateTreeForNewDecorator(newContent, newContent.getBlockMap(), treeMap, decorator, existingDecorator);
        } else {
          newTreeMap = generateNewTreeMap(newContent, decorator);
        }

        state.merge({
          decorator: decorator,
          treeMap: newTreeMap,
          nativelyRenderedContent: null
        });
        return;
      }

      var existingContent = editorState.getCurrentContent();

      if (newContent !== existingContent) {
        state.set('treeMap', regenerateTreeForNewBlocks(editorState, newContent.getBlockMap(), newContent.getEntityMap(), decorator));
      }

      state.merge(put);
    });
    return new EditorState(map);
  };

  var _proto = EditorState.prototype;

  _proto.toJS = function toJS() {
    return this.getImmutable().toJS();
  };

  _proto.getAllowUndo = function getAllowUndo() {
    return this.getImmutable().get('allowUndo');
  };

  _proto.getCurrentContent = function getCurrentContent() {
    return this.getImmutable().get('currentContent');
  };

  _proto.getUndoStack = function getUndoStack() {
    return this.getImmutable().get('undoStack');
  };

  _proto.getRedoStack = function getRedoStack() {
    return this.getImmutable().get('redoStack');
  };

  _proto.getSelection = function getSelection() {
    return this.getImmutable().get('selection');
  };

  _proto.getDecorator = function getDecorator() {
    return this.getImmutable().get('decorator');
  };

  _proto.isInCompositionMode = function isInCompositionMode() {
    return this.getImmutable().get('inCompositionMode');
  };

  _proto.mustForceSelection = function mustForceSelection() {
    return this.getImmutable().get('forceSelection');
  };

  _proto.getNativelyRenderedContent = function getNativelyRenderedContent() {
    return this.getImmutable().get('nativelyRenderedContent');
  };

  _proto.getLastChangeType = function getLastChangeType() {
    return this.getImmutable().get('lastChangeType');
  }
  /**
   * While editing, the user may apply inline style commands with a collapsed
   * cursor, intending to type text that adopts the specified style. In this
   * case, we track the specified style as an "override" that takes precedence
   * over the inline style of the text adjacent to the cursor.
   *
   * If null, there is no override in place.
   */
  ;

  _proto.getInlineStyleOverride = function getInlineStyleOverride() {
    return this.getImmutable().get('inlineStyleOverride');
  };

  EditorState.setInlineStyleOverride = function setInlineStyleOverride(editorState, inlineStyleOverride) {
    return EditorState.set(editorState, {
      inlineStyleOverride: inlineStyleOverride
    });
  }
  /**
   * Get the appropriate inline style for the editor state. If an
   * override is in place, use it. Otherwise, the current style is
   * based on the location of the selection state.
   */
  ;

  _proto.getCurrentInlineStyle = function getCurrentInlineStyle() {
    var override = this.getInlineStyleOverride();

    if (override != null) {
      return override;
    }

    var content = this.getCurrentContent();
    var selection = this.getSelection();

    if (selection.isCollapsed()) {
      return getInlineStyleForCollapsedSelection(content, selection);
    }

    return getInlineStyleForNonCollapsedSelection(content, selection);
  };

  _proto.getBlockTree = function getBlockTree(blockKey) {
    return this.getImmutable().getIn(['treeMap', blockKey]);
  };

  _proto.isSelectionAtStartOfContent = function isSelectionAtStartOfContent() {
    var firstKey = this.getCurrentContent().getBlockMap().first().getKey();
    return this.getSelection().hasEdgeWithin(firstKey, 0, 0);
  };

  _proto.isSelectionAtEndOfContent = function isSelectionAtEndOfContent() {
    var content = this.getCurrentContent();
    var blockMap = content.getBlockMap();
    var last = blockMap.last();
    var end = last.getLength();
    return this.getSelection().hasEdgeWithin(last.getKey(), end, end);
  };

  _proto.getDirectionMap = function getDirectionMap() {
    return this.getImmutable().get('directionMap');
  }
  /**
   * Incorporate native DOM selection changes into the EditorState. This
   * method can be used when we simply want to accept whatever the DOM
   * has given us to represent selection, and we do not need to re-render
   * the editor.
   *
   * To forcibly move the DOM selection, see `EditorState.forceSelection`.
   */
  ;

  EditorState.acceptSelection = function acceptSelection(editorState, selection) {
    return updateSelection(editorState, selection, false);
  }
  /**
   * At times, we need to force the DOM selection to be where we
   * need it to be. This can occur when the anchor or focus nodes
   * are non-text nodes, for instance. In this case, we want to trigger
   * a re-render of the editor, which in turn forces selection into
   * the correct place in the DOM. The `forceSelection` method
   * accomplishes this.
   *
   * This method should be used in cases where you need to explicitly
   * move the DOM selection from one place to another without a change
   * in ContentState.
   */
  ;

  EditorState.forceSelection = function forceSelection(editorState, selection) {
    if (!selection.getHasFocus()) {
      selection = selection.set('hasFocus', true);
    }

    return updateSelection(editorState, selection, true);
  }
  /**
   * Move selection to the end of the editor without forcing focus.
   */
  ;

  EditorState.moveSelectionToEnd = function moveSelectionToEnd(editorState) {
    var content = editorState.getCurrentContent();
    var lastBlock = content.getLastBlock();
    var lastKey = lastBlock.getKey();
    var length = lastBlock.getLength();
    return EditorState.acceptSelection(editorState, new SelectionState({
      anchorKey: lastKey,
      anchorOffset: length,
      focusKey: lastKey,
      focusOffset: length,
      isBackward: false
    }));
  }
  /**
   * Force focus to the end of the editor. This is useful in scenarios
   * where we want to programmatically focus the input and it makes sense
   * to allow the user to continue working seamlessly.
   */
  ;

  EditorState.moveFocusToEnd = function moveFocusToEnd(editorState) {
    var afterSelectionMove = EditorState.moveSelectionToEnd(editorState);
    return EditorState.forceSelection(afterSelectionMove, afterSelectionMove.getSelection());
  }
  /**
   * Push the current ContentState onto the undo stack if it should be
   * considered a boundary state, and set the provided ContentState as the
   * new current content.
   */
  ;

  EditorState.push = function push(editorState, contentState, changeType) {
    var forceSelection = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : true;

    if (editorState.getCurrentContent() === contentState) {
      return editorState;
    }

    var directionMap = EditorBidiService.getDirectionMap(contentState, editorState.getDirectionMap());

    if (!editorState.getAllowUndo()) {
      return EditorState.set(editorState, {
        currentContent: contentState,
        directionMap: directionMap,
        lastChangeType: changeType,
        selection: contentState.getSelectionAfter(),
        forceSelection: forceSelection,
        inlineStyleOverride: null
      });
    }

    var selection = editorState.getSelection();
    var currentContent = editorState.getCurrentContent();
    var undoStack = editorState.getUndoStack();
    var newContent = contentState;

    if (selection !== currentContent.getSelectionAfter() || mustBecomeBoundary(editorState, changeType)) {
      undoStack = undoStack.push(currentContent);
      newContent = newContent.set('selectionBefore', selection);
    } else if (changeType === 'insert-characters' || changeType === 'backspace-character' || changeType === 'delete-character') {
      // Preserve the previous selection.
      newContent = newContent.set('selectionBefore', currentContent.getSelectionBefore());
    }

    var inlineStyleOverride = editorState.getInlineStyleOverride(); // Don't discard inline style overrides for the following change types:

    var overrideChangeTypes = ['adjust-depth', 'change-block-type', 'split-block'];

    if (overrideChangeTypes.indexOf(changeType) === -1) {
      inlineStyleOverride = null;
    }

    var editorStateChanges = {
      currentContent: newContent,
      directionMap: directionMap,
      undoStack: undoStack,
      redoStack: Stack(),
      lastChangeType: changeType,
      selection: contentState.getSelectionAfter(),
      forceSelection: forceSelection,
      inlineStyleOverride: inlineStyleOverride
    };
    return EditorState.set(editorState, editorStateChanges);
  }
  /**
   * Make the top ContentState in the undo stack the new current content and
   * push the current content onto the redo stack.
   */
  ;

  EditorState.undo = function undo(editorState) {
    if (!editorState.getAllowUndo()) {
      return editorState;
    }

    var undoStack = editorState.getUndoStack();
    var newCurrentContent = undoStack.peek();

    if (!newCurrentContent) {
      return editorState;
    }

    var currentContent = editorState.getCurrentContent();
    var directionMap = EditorBidiService.getDirectionMap(newCurrentContent, editorState.getDirectionMap());
    return EditorState.set(editorState, {
      currentContent: newCurrentContent,
      directionMap: directionMap,
      undoStack: undoStack.shift(),
      redoStack: editorState.getRedoStack().push(currentContent),
      forceSelection: true,
      inlineStyleOverride: null,
      lastChangeType: 'undo',
      nativelyRenderedContent: null,
      selection: currentContent.getSelectionBefore()
    });
  }
  /**
   * Make the top ContentState in the redo stack the new current content and
   * push the current content onto the undo stack.
   */
  ;

  EditorState.redo = function redo(editorState) {
    if (!editorState.getAllowUndo()) {
      return editorState;
    }

    var redoStack = editorState.getRedoStack();
    var newCurrentContent = redoStack.peek();

    if (!newCurrentContent) {
      return editorState;
    }

    var currentContent = editorState.getCurrentContent();
    var directionMap = EditorBidiService.getDirectionMap(newCurrentContent, editorState.getDirectionMap());
    return EditorState.set(editorState, {
      currentContent: newCurrentContent,
      directionMap: directionMap,
      undoStack: editorState.getUndoStack().push(currentContent),
      redoStack: redoStack.shift(),
      forceSelection: true,
      inlineStyleOverride: null,
      lastChangeType: 'redo',
      nativelyRenderedContent: null,
      selection: newCurrentContent.getSelectionAfter()
    });
  }
  /**
   * Not for public consumption.
   */
  ;

  function EditorState(immutable) {
    _defineProperty(this, "_immutable", void 0);

    this._immutable = immutable;
  }
  /**
   * Not for public consumption.
   */


  _proto.getImmutable = function getImmutable() {
    return this._immutable;
  };

  return EditorState;
}();
/**
 * Set the supplied SelectionState as the new current selection, and set
 * the `force` flag to trigger manual selection placement by the view.
 */


function updateSelection(editorState, selection, forceSelection) {
  return EditorState.set(editorState, {
    selection: selection,
    forceSelection: forceSelection,
    nativelyRenderedContent: null,
    inlineStyleOverride: null
  });
}
/**
 * Regenerate the entire tree map for a given ContentState and decorator.
 * Returns an OrderedMap that maps all available ContentBlock objects.
 */


function generateNewTreeMap(contentState, decorator) {
  return contentState.getBlockMap().map(function (block) {
    return BlockTree.generate(contentState, block, decorator);
  }).toOrderedMap();
}
/**
 * Regenerate tree map objects for all ContentBlocks that have changed
 * between the current editorState and newContent. Returns an OrderedMap
 * with only changed regenerated tree map objects.
 */


function regenerateTreeForNewBlocks(editorState, newBlockMap, newEntityMap, decorator) {
  var contentState = editorState.getCurrentContent().set('entityMap', newEntityMap);
  var prevBlockMap = contentState.getBlockMap();
  var prevTreeMap = editorState.getImmutable().get('treeMap');
  return prevTreeMap.merge(newBlockMap.toSeq().filter(function (block, key) {
    return block !== prevBlockMap.get(key);
  }).map(function (block) {
    return BlockTree.generate(contentState, block, decorator);
  }));
}
/**
 * Generate tree map objects for a new decorator object, preserving any
 * decorations that are unchanged from the previous decorator.
 *
 * Note that in order for this to perform optimally, decoration Lists for
 * decorators should be preserved when possible to allow for direct immutable
 * List comparison.
 */


function regenerateTreeForNewDecorator(content, blockMap, previousTreeMap, decorator, existingDecorator) {
  return previousTreeMap.merge(blockMap.toSeq().filter(function (block) {
    return decorator.getDecorations(block, content) !== existingDecorator.getDecorations(block, content);
  }).map(function (block) {
    return BlockTree.generate(content, block, decorator);
  }));
}
/**
 * Return whether a change should be considered a boundary state, given
 * the previous change type. Allows us to discard potential boundary states
 * during standard typing or deletion behavior.
 */


function mustBecomeBoundary(editorState, changeType) {
  var lastChangeType = editorState.getLastChangeType();
  return changeType !== lastChangeType || changeType !== 'insert-characters' && changeType !== 'backspace-character' && changeType !== 'delete-character';
}

function getInlineStyleForCollapsedSelection(content, selection) {
  var startKey = selection.getStartKey();
  var startOffset = selection.getStartOffset();
  var startBlock = content.getBlockForKey(startKey); // If the cursor is not at the start of the block, look backward to
  // preserve the style of the preceding character.

  if (startOffset > 0) {
    return startBlock.getInlineStyleAt(startOffset - 1);
  } // The caret is at position zero in this block. If the block has any
  // text at all, use the style of the first character.


  if (startBlock.getLength()) {
    return startBlock.getInlineStyleAt(0);
  } // Otherwise, look upward in the document to find the closest character.


  return lookUpwardForInlineStyle(content, startKey);
}

function getInlineStyleForNonCollapsedSelection(content, selection) {
  var startKey = selection.getStartKey();
  var startOffset = selection.getStartOffset();
  var startBlock = content.getBlockForKey(startKey); // If there is a character just inside the selection, use its style.

  if (startOffset < startBlock.getLength()) {
    return startBlock.getInlineStyleAt(startOffset);
  } // Check if the selection at the end of a non-empty block. Use the last
  // style in the block.


  if (startOffset > 0) {
    return startBlock.getInlineStyleAt(startOffset - 1);
  } // Otherwise, look upward in the document to find the closest character.


  return lookUpwardForInlineStyle(content, startKey);
}

function lookUpwardForInlineStyle(content, fromKey) {
  var lastNonEmpty = content.getBlockMap().reverse().skipUntil(function (_, k) {
    return k === fromKey;
  }).skip(1).skipUntil(function (block, _) {
    return block.getLength();
  }).first();

  if (lastNonEmpty) {
    return lastNonEmpty.getInlineStyleAt(lastNonEmpty.getLength() - 1);
  }

  return OrderedSet();
}

module.exports = EditorState;

/***/ }),

/***/ "./node_modules/draft-js/lib/KeyBindingUtil.js":
/*!*****************************************************!*\
  !*** ./node_modules/draft-js/lib/KeyBindingUtil.js ***!
  \*****************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";
/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @format
 * 
 * @emails oncall+draft_js
 */


var UserAgent = __webpack_require__(/*! fbjs/lib/UserAgent */ "./node_modules/fbjs/lib/UserAgent.js");

var isSoftNewlineEvent = __webpack_require__(/*! ./isSoftNewlineEvent */ "./node_modules/draft-js/lib/isSoftNewlineEvent.js");

var isOSX = UserAgent.isPlatform('Mac OS X');
var KeyBindingUtil = {
  /**
   * Check whether the ctrlKey modifier is *not* being used in conjunction with
   * the altKey modifier. If they are combined, the result is an `altGraph`
   * key modifier, which should not be handled by this set of key bindings.
   */
  isCtrlKeyCommand: function isCtrlKeyCommand(e) {
    return !!e.ctrlKey && !e.altKey;
  },
  isOptionKeyCommand: function isOptionKeyCommand(e) {
    return isOSX && e.altKey;
  },
  usesMacOSHeuristics: function usesMacOSHeuristics() {
    return isOSX;
  },
  hasCommandModifier: function hasCommandModifier(e) {
    return isOSX ? !!e.metaKey && !e.altKey : KeyBindingUtil.isCtrlKeyCommand(e);
  },
  isSoftNewlineEvent: isSoftNewlineEvent
};
module.exports = KeyBindingUtil;

/***/ }),

/***/ "./node_modules/draft-js/lib/RawDraftContentState.js":
/*!***********************************************************!*\
  !*** ./node_modules/draft-js/lib/RawDraftContentState.js ***!
  \***********************************************************/
/***/ (() => {

"use strict";
/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @format
 * 
 * @emails oncall+draft_js
 */


/***/ }),

/***/ "./node_modules/draft-js/lib/RichTextEditorUtil.js":
/*!*********************************************************!*\
  !*** ./node_modules/draft-js/lib/RichTextEditorUtil.js ***!
  \*********************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";
/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @format
 * 
 * @emails oncall+draft_js
 */


var DraftModifier = __webpack_require__(/*! ./DraftModifier */ "./node_modules/draft-js/lib/DraftModifier.js");

var EditorState = __webpack_require__(/*! ./EditorState */ "./node_modules/draft-js/lib/EditorState.js");

var adjustBlockDepthForContentState = __webpack_require__(/*! ./adjustBlockDepthForContentState */ "./node_modules/draft-js/lib/adjustBlockDepthForContentState.js");

var nullthrows = __webpack_require__(/*! fbjs/lib/nullthrows */ "./node_modules/fbjs/lib/nullthrows.js");

var RichTextEditorUtil = {
  currentBlockContainsLink: function currentBlockContainsLink(editorState) {
    var selection = editorState.getSelection();
    var contentState = editorState.getCurrentContent();
    var entityMap = contentState.getEntityMap();
    return contentState.getBlockForKey(selection.getAnchorKey()).getCharacterList().slice(selection.getStartOffset(), selection.getEndOffset()).some(function (v) {
      var entity = v.getEntity();
      return !!entity && entityMap.__get(entity).getType() === 'LINK';
    });
  },
  getCurrentBlockType: function getCurrentBlockType(editorState) {
    var selection = editorState.getSelection();
    return editorState.getCurrentContent().getBlockForKey(selection.getStartKey()).getType();
  },
  getDataObjectForLinkURL: function getDataObjectForLinkURL(uri) {
    return {
      url: uri.toString()
    };
  },
  handleKeyCommand: function handleKeyCommand(editorState, command, eventTimeStamp) {
    switch (command) {
      case 'bold':
        return RichTextEditorUtil.toggleInlineStyle(editorState, 'BOLD');

      case 'italic':
        return RichTextEditorUtil.toggleInlineStyle(editorState, 'ITALIC');

      case 'underline':
        return RichTextEditorUtil.toggleInlineStyle(editorState, 'UNDERLINE');

      case 'code':
        return RichTextEditorUtil.toggleCode(editorState);

      case 'backspace':
      case 'backspace-word':
      case 'backspace-to-start-of-line':
        return RichTextEditorUtil.onBackspace(editorState);

      case 'delete':
      case 'delete-word':
      case 'delete-to-end-of-block':
        return RichTextEditorUtil.onDelete(editorState);

      default:
        // they may have custom editor commands; ignore those
        return null;
    }
  },
  insertSoftNewline: function insertSoftNewline(editorState) {
    var contentState = DraftModifier.insertText(editorState.getCurrentContent(), editorState.getSelection(), '\n', editorState.getCurrentInlineStyle(), null);
    var newEditorState = EditorState.push(editorState, contentState, 'insert-characters');
    return EditorState.forceSelection(newEditorState, contentState.getSelectionAfter());
  },

  /**
   * For collapsed selections at the start of styled blocks, backspace should
   * just remove the existing style.
   */
  onBackspace: function onBackspace(editorState) {
    var selection = editorState.getSelection();

    if (!selection.isCollapsed() || selection.getAnchorOffset() || selection.getFocusOffset()) {
      return null;
    } // First, try to remove a preceding atomic block.


    var content = editorState.getCurrentContent();
    var startKey = selection.getStartKey();
    var blockBefore = content.getBlockBefore(startKey);

    if (blockBefore && blockBefore.getType() === 'atomic') {
      var blockMap = content.getBlockMap()["delete"](blockBefore.getKey());
      var withoutAtomicBlock = content.merge({
        blockMap: blockMap,
        selectionAfter: selection
      });

      if (withoutAtomicBlock !== content) {
        return EditorState.push(editorState, withoutAtomicBlock, 'remove-range');
      }
    } // If that doesn't succeed, try to remove the current block style.


    var withoutBlockStyle = RichTextEditorUtil.tryToRemoveBlockStyle(editorState);

    if (withoutBlockStyle) {
      return EditorState.push(editorState, withoutBlockStyle, 'change-block-type');
    }

    return null;
  },
  onDelete: function onDelete(editorState) {
    var selection = editorState.getSelection();

    if (!selection.isCollapsed()) {
      return null;
    }

    var content = editorState.getCurrentContent();
    var startKey = selection.getStartKey();
    var block = content.getBlockForKey(startKey);
    var length = block.getLength(); // The cursor is somewhere within the text. Behave normally.

    if (selection.getStartOffset() < length) {
      return null;
    }

    var blockAfter = content.getBlockAfter(startKey);

    if (!blockAfter || blockAfter.getType() !== 'atomic') {
      return null;
    }

    var atomicBlockTarget = selection.merge({
      focusKey: blockAfter.getKey(),
      focusOffset: blockAfter.getLength()
    });
    var withoutAtomicBlock = DraftModifier.removeRange(content, atomicBlockTarget, 'forward');

    if (withoutAtomicBlock !== content) {
      return EditorState.push(editorState, withoutAtomicBlock, 'remove-range');
    }

    return null;
  },
  onTab: function onTab(event, editorState, maxDepth) {
    var selection = editorState.getSelection();
    var key = selection.getAnchorKey();

    if (key !== selection.getFocusKey()) {
      return editorState;
    }

    var content = editorState.getCurrentContent();
    var block = content.getBlockForKey(key);
    var type = block.getType();

    if (type !== 'unordered-list-item' && type !== 'ordered-list-item') {
      return editorState;
    }

    event.preventDefault();
    var depth = block.getDepth();

    if (!event.shiftKey && depth === maxDepth) {
      return editorState;
    }

    var withAdjustment = adjustBlockDepthForContentState(content, selection, event.shiftKey ? -1 : 1, maxDepth);
    return EditorState.push(editorState, withAdjustment, 'adjust-depth');
  },
  toggleBlockType: function toggleBlockType(editorState, blockType) {
    var selection = editorState.getSelection();
    var startKey = selection.getStartKey();
    var endKey = selection.getEndKey();
    var content = editorState.getCurrentContent();
    var target = selection; // Triple-click can lead to a selection that includes offset 0 of the
    // following block. The `SelectionState` for this case is accurate, but
    // we should avoid toggling block type for the trailing block because it
    // is a confusing interaction.

    if (startKey !== endKey && selection.getEndOffset() === 0) {
      var blockBefore = nullthrows(content.getBlockBefore(endKey));
      endKey = blockBefore.getKey();
      target = target.merge({
        anchorKey: startKey,
        anchorOffset: selection.getStartOffset(),
        focusKey: endKey,
        focusOffset: blockBefore.getLength(),
        isBackward: false
      });
    }

    var hasAtomicBlock = content.getBlockMap().skipWhile(function (_, k) {
      return k !== startKey;
    }).reverse().skipWhile(function (_, k) {
      return k !== endKey;
    }).some(function (v) {
      return v.getType() === 'atomic';
    });

    if (hasAtomicBlock) {
      return editorState;
    }

    var typeToSet = content.getBlockForKey(startKey).getType() === blockType ? 'unstyled' : blockType;
    return EditorState.push(editorState, DraftModifier.setBlockType(content, target, typeToSet), 'change-block-type');
  },
  toggleCode: function toggleCode(editorState) {
    var selection = editorState.getSelection();
    var anchorKey = selection.getAnchorKey();
    var focusKey = selection.getFocusKey();

    if (selection.isCollapsed() || anchorKey !== focusKey) {
      return RichTextEditorUtil.toggleBlockType(editorState, 'code-block');
    }

    return RichTextEditorUtil.toggleInlineStyle(editorState, 'CODE');
  },

  /**
   * Toggle the specified inline style for the selection. If the
   * user's selection is collapsed, apply or remove the style for the
   * internal state. If it is not collapsed, apply the change directly
   * to the document state.
   */
  toggleInlineStyle: function toggleInlineStyle(editorState, inlineStyle) {
    var selection = editorState.getSelection();
    var currentStyle = editorState.getCurrentInlineStyle(); // If the selection is collapsed, toggle the specified style on or off and
    // set the result as the new inline style override. This will then be
    // used as the inline style for the next character to be inserted.

    if (selection.isCollapsed()) {
      return EditorState.setInlineStyleOverride(editorState, currentStyle.has(inlineStyle) ? currentStyle.remove(inlineStyle) : currentStyle.add(inlineStyle));
    } // If characters are selected, immediately apply or remove the
    // inline style on the document state itself.


    var content = editorState.getCurrentContent();
    var newContent; // If the style is already present for the selection range, remove it.
    // Otherwise, apply it.

    if (currentStyle.has(inlineStyle)) {
      newContent = DraftModifier.removeInlineStyle(content, selection, inlineStyle);
    } else {
      newContent = DraftModifier.applyInlineStyle(content, selection, inlineStyle);
    }

    return EditorState.push(editorState, newContent, 'change-inline-style');
  },
  toggleLink: function toggleLink(editorState, targetSelection, entityKey) {
    var withoutLink = DraftModifier.applyEntity(editorState.getCurrentContent(), targetSelection, entityKey);
    return EditorState.push(editorState, withoutLink, 'apply-entity');
  },

  /**
   * When a collapsed cursor is at the start of a styled block, changes block
   * type to 'unstyled'. Returns null if selection does not meet that criteria.
   */
  tryToRemoveBlockStyle: function tryToRemoveBlockStyle(editorState) {
    var selection = editorState.getSelection();
    var offset = selection.getAnchorOffset();

    if (selection.isCollapsed() && offset === 0) {
      var key = selection.getAnchorKey();
      var content = editorState.getCurrentContent();
      var block = content.getBlockForKey(key);
      var type = block.getType();
      var blockBefore = content.getBlockBefore(key);

      if (type === 'code-block' && blockBefore && blockBefore.getType() === 'code-block' && blockBefore.getLength() !== 0) {
        return null;
      }

      if (type !== 'unstyled') {
        return DraftModifier.setBlockType(content, selection, 'unstyled');
      }
    }

    return null;
  }
};
module.exports = RichTextEditorUtil;

/***/ }),

/***/ "./node_modules/draft-js/lib/SecondaryClipboard.js":
/*!*********************************************************!*\
  !*** ./node_modules/draft-js/lib/SecondaryClipboard.js ***!
  \*********************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";
/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @format
 * 
 * @emails oncall+draft_js
 */


var DraftModifier = __webpack_require__(/*! ./DraftModifier */ "./node_modules/draft-js/lib/DraftModifier.js");

var EditorState = __webpack_require__(/*! ./EditorState */ "./node_modules/draft-js/lib/EditorState.js");

var getContentStateFragment = __webpack_require__(/*! ./getContentStateFragment */ "./node_modules/draft-js/lib/getContentStateFragment.js");

var nullthrows = __webpack_require__(/*! fbjs/lib/nullthrows */ "./node_modules/fbjs/lib/nullthrows.js");

var clipboard = null;
/**
 * Some systems offer a "secondary" clipboard to allow quick internal cut
 * and paste behavior. For instance, Ctrl+K (cut) and Ctrl+Y (paste).
 */

var SecondaryClipboard = {
  cut: function cut(editorState) {
    var content = editorState.getCurrentContent();
    var selection = editorState.getSelection();
    var targetRange = null;

    if (selection.isCollapsed()) {
      var anchorKey = selection.getAnchorKey();
      var blockEnd = content.getBlockForKey(anchorKey).getLength();

      if (blockEnd === selection.getAnchorOffset()) {
        var keyAfter = content.getKeyAfter(anchorKey);

        if (keyAfter == null) {
          return editorState;
        }

        targetRange = selection.set('focusKey', keyAfter).set('focusOffset', 0);
      } else {
        targetRange = selection.set('focusOffset', blockEnd);
      }
    } else {
      targetRange = selection;
    }

    targetRange = nullthrows(targetRange); // TODO: This should actually append to the current state when doing
    // successive ^K commands without any other cursor movement

    clipboard = getContentStateFragment(content, targetRange);
    var afterRemoval = DraftModifier.removeRange(content, targetRange, 'forward');

    if (afterRemoval === content) {
      return editorState;
    }

    return EditorState.push(editorState, afterRemoval, 'remove-range');
  },
  paste: function paste(editorState) {
    if (!clipboard) {
      return editorState;
    }

    var newContent = DraftModifier.replaceWithFragment(editorState.getCurrentContent(), editorState.getSelection(), clipboard);
    return EditorState.push(editorState, newContent, 'insert-fragment');
  }
};
module.exports = SecondaryClipboard;

/***/ }),

/***/ "./node_modules/draft-js/lib/SelectionState.js":
/*!*****************************************************!*\
  !*** ./node_modules/draft-js/lib/SelectionState.js ***!
  \*****************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";
/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @format
 * 
 * @emails oncall+draft_js
 */


function _inheritsLoose(subClass, superClass) { subClass.prototype = Object.create(superClass.prototype); subClass.prototype.constructor = subClass; subClass.__proto__ = superClass; }

var Immutable = __webpack_require__(/*! immutable */ "./node_modules/draft-js/node_modules/immutable/dist/immutable.js");

var Record = Immutable.Record;
var defaultRecord = {
  anchorKey: '',
  anchorOffset: 0,
  focusKey: '',
  focusOffset: 0,
  isBackward: false,
  hasFocus: false
};
/* $FlowFixMe[unclear-type] This comment suppresses an error found when
 * automatically adding a type annotation with the codemod Komodo/Annotate_
 * exports. To see the error delete this comment and run Flow. */

var SelectionStateRecord = Record(defaultRecord);

var SelectionState = /*#__PURE__*/function (_SelectionStateRecord) {
  _inheritsLoose(SelectionState, _SelectionStateRecord);

  function SelectionState() {
    return _SelectionStateRecord.apply(this, arguments) || this;
  }

  var _proto = SelectionState.prototype;

  _proto.serialize = function serialize() {
    return 'Anchor: ' + this.getAnchorKey() + ':' + this.getAnchorOffset() + ', ' + 'Focus: ' + this.getFocusKey() + ':' + this.getFocusOffset() + ', ' + 'Is Backward: ' + String(this.getIsBackward()) + ', ' + 'Has Focus: ' + String(this.getHasFocus());
  };

  _proto.getAnchorKey = function getAnchorKey() {
    return this.get('anchorKey');
  };

  _proto.getAnchorOffset = function getAnchorOffset() {
    return this.get('anchorOffset');
  };

  _proto.getFocusKey = function getFocusKey() {
    return this.get('focusKey');
  };

  _proto.getFocusOffset = function getFocusOffset() {
    return this.get('focusOffset');
  };

  _proto.getIsBackward = function getIsBackward() {
    return this.get('isBackward');
  };

  _proto.getHasFocus = function getHasFocus() {
    return this.get('hasFocus');
  }
  /**
   * Return whether the specified range overlaps with an edge of the
   * SelectionState.
   */
  ;

  _proto.hasEdgeWithin = function hasEdgeWithin(blockKey, start, end) {
    var anchorKey = this.getAnchorKey();
    var focusKey = this.getFocusKey();

    if (anchorKey === focusKey && anchorKey === blockKey) {
      var selectionStart = this.getStartOffset();
      var selectionEnd = this.getEndOffset();
      return start <= selectionStart && selectionStart <= end || // selectionStart is between start and end, or
      start <= selectionEnd && selectionEnd <= end // selectionEnd is between start and end
      ;
    }

    if (blockKey !== anchorKey && blockKey !== focusKey) {
      return false;
    }

    var offsetToCheck = blockKey === anchorKey ? this.getAnchorOffset() : this.getFocusOffset();
    return start <= offsetToCheck && end >= offsetToCheck;
  };

  _proto.isCollapsed = function isCollapsed() {
    return this.getAnchorKey() === this.getFocusKey() && this.getAnchorOffset() === this.getFocusOffset();
  };

  _proto.getStartKey = function getStartKey() {
    return this.getIsBackward() ? this.getFocusKey() : this.getAnchorKey();
  };

  _proto.getStartOffset = function getStartOffset() {
    return this.getIsBackward() ? this.getFocusOffset() : this.getAnchorOffset();
  };

  _proto.getEndKey = function getEndKey() {
    return this.getIsBackward() ? this.getAnchorKey() : this.getFocusKey();
  };

  _proto.getEndOffset = function getEndOffset() {
    return this.getIsBackward() ? this.getAnchorOffset() : this.getFocusOffset();
  };

  SelectionState.createEmpty = function createEmpty(key) {
    return new SelectionState({
      anchorKey: key,
      anchorOffset: 0,
      focusKey: key,
      focusOffset: 0,
      isBackward: false,
      hasFocus: false
    });
  };

  return SelectionState;
}(SelectionStateRecord);

module.exports = SelectionState;

/***/ }),

/***/ "./node_modules/draft-js/lib/adjustBlockDepthForContentState.js":
/*!**********************************************************************!*\
  !*** ./node_modules/draft-js/lib/adjustBlockDepthForContentState.js ***!
  \**********************************************************************/
/***/ ((module) => {

"use strict";
/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @format
 * 
 * @emails oncall+draft_js
 */


function adjustBlockDepthForContentState(contentState, selectionState, adjustment, maxDepth) {
  var startKey = selectionState.getStartKey();
  var endKey = selectionState.getEndKey();
  var blockMap = contentState.getBlockMap();
  var blocks = blockMap.toSeq().skipUntil(function (_, k) {
    return k === startKey;
  }).takeUntil(function (_, k) {
    return k === endKey;
  }).concat([[endKey, blockMap.get(endKey)]]).map(function (block) {
    var depth = block.getDepth() + adjustment;
    depth = Math.max(0, Math.min(depth, maxDepth));
    return block.set('depth', depth);
  });
  blockMap = blockMap.merge(blocks);
  return contentState.merge({
    blockMap: blockMap,
    selectionBefore: selectionState,
    selectionAfter: selectionState
  });
}

module.exports = adjustBlockDepthForContentState;

/***/ }),

/***/ "./node_modules/draft-js/lib/applyEntityToContentBlock.js":
/*!****************************************************************!*\
  !*** ./node_modules/draft-js/lib/applyEntityToContentBlock.js ***!
  \****************************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";
/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @format
 * 
 * @emails oncall+draft_js
 */


var CharacterMetadata = __webpack_require__(/*! ./CharacterMetadata */ "./node_modules/draft-js/lib/CharacterMetadata.js");

function applyEntityToContentBlock(contentBlock, startArg, end, entityKey) {
  var start = startArg;
  var characterList = contentBlock.getCharacterList();

  while (start < end) {
    characterList = characterList.set(start, CharacterMetadata.applyEntity(characterList.get(start), entityKey));
    start++;
  }

  return contentBlock.set('characterList', characterList);
}

module.exports = applyEntityToContentBlock;

/***/ }),

/***/ "./node_modules/draft-js/lib/applyEntityToContentState.js":
/*!****************************************************************!*\
  !*** ./node_modules/draft-js/lib/applyEntityToContentState.js ***!
  \****************************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";
/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @format
 * 
 * @emails oncall+draft_js
 */


var applyEntityToContentBlock = __webpack_require__(/*! ./applyEntityToContentBlock */ "./node_modules/draft-js/lib/applyEntityToContentBlock.js");

var Immutable = __webpack_require__(/*! immutable */ "./node_modules/draft-js/node_modules/immutable/dist/immutable.js");

function applyEntityToContentState(contentState, selectionState, entityKey) {
  var blockMap = contentState.getBlockMap();
  var startKey = selectionState.getStartKey();
  var startOffset = selectionState.getStartOffset();
  var endKey = selectionState.getEndKey();
  var endOffset = selectionState.getEndOffset();
  var newBlocks = blockMap.skipUntil(function (_, k) {
    return k === startKey;
  }).takeUntil(function (_, k) {
    return k === endKey;
  }).toOrderedMap().merge(Immutable.OrderedMap([[endKey, blockMap.get(endKey)]])).map(function (block, blockKey) {
    var sliceStart = blockKey === startKey ? startOffset : 0;
    var sliceEnd = blockKey === endKey ? endOffset : block.getLength();
    return applyEntityToContentBlock(block, sliceStart, sliceEnd, entityKey);
  });
  return contentState.merge({
    blockMap: blockMap.merge(newBlocks),
    selectionBefore: selectionState,
    selectionAfter: selectionState
  });
}

module.exports = applyEntityToContentState;

/***/ }),

/***/ "./node_modules/draft-js/lib/convertFromDraftStateToRaw.js":
/*!*****************************************************************!*\
  !*** ./node_modules/draft-js/lib/convertFromDraftStateToRaw.js ***!
  \*****************************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";
/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @format
 * 
 * @emails oncall+draft_js
 */


function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; var ownKeys = Object.keys(source); if (typeof Object.getOwnPropertySymbols === 'function') { ownKeys = ownKeys.concat(Object.getOwnPropertySymbols(source).filter(function (sym) { return Object.getOwnPropertyDescriptor(source, sym).enumerable; })); } ownKeys.forEach(function (key) { _defineProperty(target, key, source[key]); }); } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var ContentBlock = __webpack_require__(/*! ./ContentBlock */ "./node_modules/draft-js/lib/ContentBlock.js");

var ContentBlockNode = __webpack_require__(/*! ./ContentBlockNode */ "./node_modules/draft-js/lib/ContentBlockNode.js");

var DraftStringKey = __webpack_require__(/*! ./DraftStringKey */ "./node_modules/draft-js/lib/DraftStringKey.js");

var encodeEntityRanges = __webpack_require__(/*! ./encodeEntityRanges */ "./node_modules/draft-js/lib/encodeEntityRanges.js");

var encodeInlineStyleRanges = __webpack_require__(/*! ./encodeInlineStyleRanges */ "./node_modules/draft-js/lib/encodeInlineStyleRanges.js");

var invariant = __webpack_require__(/*! fbjs/lib/invariant */ "./node_modules/fbjs/lib/invariant.js");

var createRawBlock = function createRawBlock(block, entityStorageMap) {
  return {
    key: block.getKey(),
    text: block.getText(),
    type: block.getType(),
    depth: block.getDepth(),
    inlineStyleRanges: encodeInlineStyleRanges(block),
    entityRanges: encodeEntityRanges(block, entityStorageMap),
    data: block.getData().toObject()
  };
};

var insertRawBlock = function insertRawBlock(block, entityMap, rawBlocks, blockCacheRef) {
  if (block instanceof ContentBlock) {
    rawBlocks.push(createRawBlock(block, entityMap));
    return;
  }

  !(block instanceof ContentBlockNode) ?  true ? invariant(false, 'block is not a BlockNode') : 0 : void 0;
  var parentKey = block.getParentKey();

  var rawBlock = blockCacheRef[block.getKey()] = _objectSpread({}, createRawBlock(block, entityMap), {
    children: []
  });

  if (parentKey) {
    blockCacheRef[parentKey].children.push(rawBlock);
    return;
  }

  rawBlocks.push(rawBlock);
};

var encodeRawBlocks = function encodeRawBlocks(contentState, rawState) {
  var entityMap = rawState.entityMap;
  var rawBlocks = [];
  var blockCacheRef = {};
  var entityCacheRef = {};
  var entityStorageKey = 0;
  contentState.getBlockMap().forEach(function (block) {
    block.findEntityRanges(function (character) {
      return character.getEntity() !== null;
    }, function (start) {
      var entityKey = block.getEntityAt(start); // Stringify to maintain order of otherwise numeric keys.

      var stringifiedEntityKey = DraftStringKey.stringify(entityKey); // This makes this function resilient to two entities
      // erroneously having the same key

      if (entityCacheRef[stringifiedEntityKey]) {
        return;
      }

      entityCacheRef[stringifiedEntityKey] = entityKey; // we need the `any` casting here since this is a temporary state
      // where we will later on flip the entity map and populate it with
      // real entity, at this stage we just need to map back the entity
      // key used by the BlockNode

      entityMap[stringifiedEntityKey] = "".concat(entityStorageKey);
      entityStorageKey++;
    });
    insertRawBlock(block, entityMap, rawBlocks, blockCacheRef);
  });
  return {
    blocks: rawBlocks,
    entityMap: entityMap
  };
}; // Flip storage map so that our storage keys map to global
// DraftEntity keys.


var encodeRawEntityMap = function encodeRawEntityMap(contentState, rawState) {
  var blocks = rawState.blocks,
      entityMap = rawState.entityMap;
  var rawEntityMap = {};
  Object.keys(entityMap).forEach(function (key, index) {
    var entity = contentState.getEntity(DraftStringKey.unstringify(key));
    rawEntityMap[index] = {
      type: entity.getType(),
      mutability: entity.getMutability(),
      data: entity.getData()
    };
  });
  return {
    blocks: blocks,
    entityMap: rawEntityMap
  };
};

var convertFromDraftStateToRaw = function convertFromDraftStateToRaw(contentState) {
  var rawDraftContentState = {
    entityMap: {},
    blocks: []
  }; // add blocks

  rawDraftContentState = encodeRawBlocks(contentState, rawDraftContentState); // add entities

  rawDraftContentState = encodeRawEntityMap(contentState, rawDraftContentState);
  return rawDraftContentState;
};

module.exports = convertFromDraftStateToRaw;

/***/ }),

/***/ "./node_modules/draft-js/lib/convertFromHTMLToContentBlocks.js":
/*!*********************************************************************!*\
  !*** ./node_modules/draft-js/lib/convertFromHTMLToContentBlocks.js ***!
  \*********************************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";
/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @format
 * 
 * @emails oncall+draft_js
 */


var _knownListItemDepthCl;

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; var ownKeys = Object.keys(source); if (typeof Object.getOwnPropertySymbols === 'function') { ownKeys = ownKeys.concat(Object.getOwnPropertySymbols(source).filter(function (sym) { return Object.getOwnPropertyDescriptor(source, sym).enumerable; })); } ownKeys.forEach(function (key) { _defineProperty(target, key, source[key]); }); } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var CharacterMetadata = __webpack_require__(/*! ./CharacterMetadata */ "./node_modules/draft-js/lib/CharacterMetadata.js");

var ContentBlock = __webpack_require__(/*! ./ContentBlock */ "./node_modules/draft-js/lib/ContentBlock.js");

var ContentBlockNode = __webpack_require__(/*! ./ContentBlockNode */ "./node_modules/draft-js/lib/ContentBlockNode.js");

var DefaultDraftBlockRenderMap = __webpack_require__(/*! ./DefaultDraftBlockRenderMap */ "./node_modules/draft-js/lib/DefaultDraftBlockRenderMap.js");

var DraftEntity = __webpack_require__(/*! ./DraftEntity */ "./node_modules/draft-js/lib/DraftEntity.js");

var URI = __webpack_require__(/*! fbjs/lib/URI */ "./node_modules/fbjs/lib/URI.js");

var cx = __webpack_require__(/*! fbjs/lib/cx */ "./node_modules/fbjs/lib/cx.js");

var generateRandomKey = __webpack_require__(/*! ./generateRandomKey */ "./node_modules/draft-js/lib/generateRandomKey.js");

var getSafeBodyFromHTML = __webpack_require__(/*! ./getSafeBodyFromHTML */ "./node_modules/draft-js/lib/getSafeBodyFromHTML.js");

var gkx = __webpack_require__(/*! ./gkx */ "./node_modules/draft-js/lib/gkx.js");

var _require = __webpack_require__(/*! immutable */ "./node_modules/draft-js/node_modules/immutable/dist/immutable.js"),
    List = _require.List,
    Map = _require.Map,
    OrderedSet = _require.OrderedSet;

var isHTMLAnchorElement = __webpack_require__(/*! ./isHTMLAnchorElement */ "./node_modules/draft-js/lib/isHTMLAnchorElement.js");

var isHTMLBRElement = __webpack_require__(/*! ./isHTMLBRElement */ "./node_modules/draft-js/lib/isHTMLBRElement.js");

var isHTMLElement = __webpack_require__(/*! ./isHTMLElement */ "./node_modules/draft-js/lib/isHTMLElement.js");

var isHTMLImageElement = __webpack_require__(/*! ./isHTMLImageElement */ "./node_modules/draft-js/lib/isHTMLImageElement.js");

var experimentalTreeDataSupport = gkx('draft_tree_data_support');
var NBSP = '&nbsp;';
var SPACE = ' '; // used for replacing characters in HTML

var REGEX_CR = new RegExp('\r', 'g');
var REGEX_LF = new RegExp('\n', 'g');
var REGEX_LEADING_LF = new RegExp('^\n', 'g');
var REGEX_NBSP = new RegExp(NBSP, 'g');
var REGEX_CARRIAGE = new RegExp('&#13;?', 'g');
var REGEX_ZWS = new RegExp('&#8203;?', 'g'); // https://developer.mozilla.org/en-US/docs/Web/CSS/font-weight

var boldValues = ['bold', 'bolder', '500', '600', '700', '800', '900'];
var notBoldValues = ['light', 'lighter', 'normal', '100', '200', '300', '400'];
var anchorAttr = ['className', 'href', 'rel', 'target', 'title'];
var imgAttr = ['alt', 'className', 'height', 'src', 'width'];
var knownListItemDepthClasses = (_knownListItemDepthCl = {}, _defineProperty(_knownListItemDepthCl, cx('public/DraftStyleDefault/depth0'), 0), _defineProperty(_knownListItemDepthCl, cx('public/DraftStyleDefault/depth1'), 1), _defineProperty(_knownListItemDepthCl, cx('public/DraftStyleDefault/depth2'), 2), _defineProperty(_knownListItemDepthCl, cx('public/DraftStyleDefault/depth3'), 3), _defineProperty(_knownListItemDepthCl, cx('public/DraftStyleDefault/depth4'), 4), _knownListItemDepthCl);
var HTMLTagToRawInlineStyleMap = Map({
  b: 'BOLD',
  code: 'CODE',
  del: 'STRIKETHROUGH',
  em: 'ITALIC',
  i: 'ITALIC',
  s: 'STRIKETHROUGH',
  strike: 'STRIKETHROUGH',
  strong: 'BOLD',
  u: 'UNDERLINE',
  mark: 'HIGHLIGHT'
});

/**
 * Build a mapping from HTML tags to draftjs block types
 * out of a BlockRenderMap.
 *
 * The BlockTypeMap for the default BlockRenderMap looks like this:
 *   Map({
 *     h1: 'header-one',
 *     h2: 'header-two',
 *     h3: 'header-three',
 *     h4: 'header-four',
 *     h5: 'header-five',
 *     h6: 'header-six',
 *     blockquote: 'blockquote',
 *     figure: 'atomic',
 *     pre: ['code-block'],
 *     div: 'unstyled',
 *     p: 'unstyled',
 *     li: ['ordered-list-item', 'unordered-list-item'],
 *   })
 */
var buildBlockTypeMap = function buildBlockTypeMap(blockRenderMap) {
  var blockTypeMap = {};
  blockRenderMap.mapKeys(function (blockType, desc) {
    var elements = [desc.element];

    if (desc.aliasedElements !== undefined) {
      elements.push.apply(elements, desc.aliasedElements);
    }

    elements.forEach(function (element) {
      if (blockTypeMap[element] === undefined) {
        blockTypeMap[element] = blockType;
      } else if (typeof blockTypeMap[element] === 'string') {
        blockTypeMap[element] = [blockTypeMap[element], blockType];
      } else {
        blockTypeMap[element].push(blockType);
      }
    });
  });
  return Map(blockTypeMap);
};

var detectInlineStyle = function detectInlineStyle(node) {
  if (isHTMLElement(node)) {
    var element = node; // Currently only used to detect preformatted inline code

    if (element.style.fontFamily.includes('monospace')) {
      return 'CODE';
    }
  }

  return null;
};
/**
 * If we're pasting from one DraftEditor to another we can check to see if
 * existing list item depth classes are being used and preserve this style
 */


var getListItemDepth = function getListItemDepth(node) {
  var depth = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;
  Object.keys(knownListItemDepthClasses).some(function (depthClass) {
    if (node.classList.contains(depthClass)) {
      depth = knownListItemDepthClasses[depthClass];
    }
  });
  return depth;
};
/**
 * Return true if the provided HTML Element can be used to build a
 * Draftjs-compatible link.
 */


var isValidAnchor = function isValidAnchor(node) {
  if (!isHTMLAnchorElement(node)) {
    return false;
  }

  var anchorNode = node;

  if (!anchorNode.href || anchorNode.protocol !== 'http:' && anchorNode.protocol !== 'https:' && anchorNode.protocol !== 'mailto:' && anchorNode.protocol !== 'tel:') {
    return false;
  }

  try {
    // Just checking whether we can actually create a URI
    var _ = new URI(anchorNode.href);

    return true; // We need our catch statements to have arguments, else
    // UglifyJS (which we use for our OSS builds) will crash.
    // eslint-disable-next-line fb-www/no-unused-catch-bindings
  } catch (_) {
    return false;
  }
};
/**
 * Return true if the provided HTML Element can be used to build a
 * Draftjs-compatible image.
 */


var isValidImage = function isValidImage(node) {
  if (!isHTMLImageElement(node)) {
    return false;
  }

  var imageNode = node;
  return !!(imageNode.attributes.getNamedItem('src') && imageNode.attributes.getNamedItem('src').value);
};
/**
 * Try to guess the inline style of an HTML element based on its css
 * styles (font-weight, font-style and text-decoration).
 */


var styleFromNodeAttributes = function styleFromNodeAttributes(node, style) {
  if (!isHTMLElement(node)) {
    return style;
  }

  var htmlElement = node;
  var fontWeight = htmlElement.style.fontWeight;
  var fontStyle = htmlElement.style.fontStyle;
  var textDecoration = htmlElement.style.textDecoration;
  return style.withMutations(function (style) {
    if (boldValues.indexOf(fontWeight) >= 0) {
      style.add('BOLD');
    } else if (notBoldValues.indexOf(fontWeight) >= 0) {
      style.remove('BOLD');
    }

    if (fontStyle === 'italic') {
      style.add('ITALIC');
    } else if (fontStyle === 'normal') {
      style.remove('ITALIC');
    }

    if (textDecoration === 'underline') {
      style.add('UNDERLINE');
    }

    if (textDecoration === 'line-through') {
      style.add('STRIKETHROUGH');
    }

    if (textDecoration === 'none') {
      style.remove('UNDERLINE');
      style.remove('STRIKETHROUGH');
    }
  });
};
/**
 * Determine if a nodeName is a list type, 'ul' or 'ol'
 */


var isListNode = function isListNode(nodeName) {
  return nodeName === 'ul' || nodeName === 'ol';
};
/**
 *  ContentBlockConfig is a mutable data structure that holds all
 *  the information required to build a ContentBlock and an array of
 *  all the child nodes (childConfigs).
 *  It is being used a temporary data structure by the
 *  ContentBlocksBuilder class.
 */


/**
 * ContentBlocksBuilder builds a list of ContentBlocks and an Entity Map
 * out of one (or several) HTMLElement(s).
 *
 * The algorithm has two passes: first it builds a tree of ContentBlockConfigs
 * by walking through the HTML nodes and their children, then it walks the
 * ContentBlockConfigs tree to compute parents/siblings and create
 * the actual ContentBlocks.
 *
 * Typical usage is:
 *     new ContentBlocksBuilder()
 *        .addDOMNode(someHTMLNode)
 *        .addDOMNode(someOtherHTMLNode)
 *       .getContentBlocks();
 *
 */
var ContentBlocksBuilder = /*#__PURE__*/function () {
  // Most of the method in the class depend on the state of the content builder
  // (i.e. currentBlockType, currentDepth, currentEntity etc.). Though it may
  // be confusing at first, it made the code simpler than the alternative which
  // is to pass those values around in every call.
  // The following attributes are used to accumulate text and styles
  // as we are walking the HTML node tree.
  // Describes the future ContentState as a tree of content blocks
  // The content blocks generated from the blockConfigs
  // Entity map use to store links and images found in the HTML nodes
  // Map HTML tags to draftjs block types and disambiguation function
  function ContentBlocksBuilder(blockTypeMap, disambiguate) {
    _defineProperty(this, "characterList", List());

    _defineProperty(this, "currentBlockType", 'unstyled');

    _defineProperty(this, "currentDepth", 0);

    _defineProperty(this, "currentEntity", null);

    _defineProperty(this, "currentText", '');

    _defineProperty(this, "wrapper", null);

    _defineProperty(this, "blockConfigs", []);

    _defineProperty(this, "contentBlocks", []);

    _defineProperty(this, "entityMap", DraftEntity);

    _defineProperty(this, "blockTypeMap", void 0);

    _defineProperty(this, "disambiguate", void 0);

    this.clear();
    this.blockTypeMap = blockTypeMap;
    this.disambiguate = disambiguate;
  }
  /**
   * Clear the internal state of the ContentBlocksBuilder
   */


  var _proto = ContentBlocksBuilder.prototype;

  _proto.clear = function clear() {
    this.characterList = List();
    this.blockConfigs = [];
    this.currentBlockType = 'unstyled';
    this.currentDepth = 0;
    this.currentEntity = null;
    this.currentText = '';
    this.entityMap = DraftEntity;
    this.wrapper = null;
    this.contentBlocks = [];
  }
  /**
   * Add an HTMLElement to the ContentBlocksBuilder
   */
  ;

  _proto.addDOMNode = function addDOMNode(node) {
    var _this$blockConfigs;

    this.contentBlocks = [];
    this.currentDepth = 0; // Converts the HTML node to block config

    (_this$blockConfigs = this.blockConfigs).push.apply(_this$blockConfigs, this._toBlockConfigs([node], OrderedSet())); // There might be some left over text in the builder's
    // internal state, if so make a ContentBlock out of it.


    this._trimCurrentText();

    if (this.currentText !== '') {
      this.blockConfigs.push(this._makeBlockConfig());
    } // for chaining


    return this;
  }
  /**
   * Return the ContentBlocks and the EntityMap that corresponds
   * to the previously added HTML nodes.
   */
  ;

  _proto.getContentBlocks = function getContentBlocks() {
    if (this.contentBlocks.length === 0) {
      if (experimentalTreeDataSupport) {
        this._toContentBlocks(this.blockConfigs);
      } else {
        this._toFlatContentBlocks(this.blockConfigs);
      }
    }

    return {
      contentBlocks: this.contentBlocks,
      entityMap: this.entityMap
    };
  } // ***********************************WARNING******************************
  // The methods below this line are private - don't call them directly.

  /**
   * Generate a new ContentBlockConfig out of the current internal state
   * of the builder, then clears the internal state.
   */
  ;

  _proto._makeBlockConfig = function _makeBlockConfig() {
    var config = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
    var key = config.key || generateRandomKey();

    var block = _objectSpread({
      key: key,
      type: this.currentBlockType,
      text: this.currentText,
      characterList: this.characterList,
      depth: this.currentDepth,
      parent: null,
      children: List(),
      prevSibling: null,
      nextSibling: null,
      childConfigs: []
    }, config);

    this.characterList = List();
    this.currentBlockType = 'unstyled';
    this.currentText = '';
    return block;
  }
  /**
   * Converts an array of HTML elements to a multi-root tree of content
   * block configs. Some text content may be left in the builders internal
   * state to enable chaining sucessive calls.
   */
  ;

  _proto._toBlockConfigs = function _toBlockConfigs(nodes, style) {
    var blockConfigs = [];

    for (var i = 0; i < nodes.length; i++) {
      var node = nodes[i];
      var nodeName = node.nodeName.toLowerCase();

      if (nodeName === 'body' || isListNode(nodeName)) {
        // body, ol and ul are 'block' type nodes so create a block config
        // with the text accumulated so far (if any)
        this._trimCurrentText();

        if (this.currentText !== '') {
          blockConfigs.push(this._makeBlockConfig());
        } // body, ol and ul nodes are ignored, but their children are inlined in
        // the parent block config.


        var wasCurrentDepth = this.currentDepth;
        var wasWrapper = this.wrapper;

        if (isListNode(nodeName)) {
          this.wrapper = nodeName;

          if (isListNode(wasWrapper)) {
            this.currentDepth++;
          }
        }

        blockConfigs.push.apply(blockConfigs, this._toBlockConfigs(Array.from(node.childNodes), style));
        this.currentDepth = wasCurrentDepth;
        this.wrapper = wasWrapper;
        continue;
      }

      var blockType = this.blockTypeMap.get(nodeName);

      if (blockType !== undefined) {
        // 'block' type node means we need to create a block config
        // with the text accumulated so far (if any)
        this._trimCurrentText();

        if (this.currentText !== '') {
          blockConfigs.push(this._makeBlockConfig());
        }

        var _wasCurrentDepth = this.currentDepth;
        var _wasWrapper = this.wrapper;
        this.wrapper = nodeName === 'pre' ? 'pre' : this.wrapper;

        if (typeof blockType !== 'string') {
          blockType = this.disambiguate(nodeName, this.wrapper) || blockType[0] || 'unstyled';
        }

        if (!experimentalTreeDataSupport && isHTMLElement(node) && (blockType === 'unordered-list-item' || blockType === 'ordered-list-item')) {
          var htmlElement = node;
          this.currentDepth = getListItemDepth(htmlElement, this.currentDepth);
        }

        var key = generateRandomKey();

        var childConfigs = this._toBlockConfigs(Array.from(node.childNodes), style);

        this._trimCurrentText();

        blockConfigs.push(this._makeBlockConfig({
          key: key,
          childConfigs: childConfigs,
          type: blockType
        }));
        this.currentDepth = _wasCurrentDepth;
        this.wrapper = _wasWrapper;
        continue;
      }

      if (nodeName === '#text') {
        this._addTextNode(node, style);

        continue;
      }

      if (nodeName === 'br') {
        this._addBreakNode(node, style);

        continue;
      }

      if (isValidImage(node)) {
        this._addImgNode(node, style);

        continue;
      }

      if (isValidAnchor(node)) {
        this._addAnchorNode(node, blockConfigs, style);

        continue;
      }

      var newStyle = style;

      if (HTMLTagToRawInlineStyleMap.has(nodeName)) {
        newStyle = newStyle.add(HTMLTagToRawInlineStyleMap.get(nodeName));
      }

      newStyle = styleFromNodeAttributes(node, newStyle);
      var inlineStyle = detectInlineStyle(node);

      if (inlineStyle != null) {
        newStyle = newStyle.add(inlineStyle);
      }

      blockConfigs.push.apply(blockConfigs, this._toBlockConfigs(Array.from(node.childNodes), newStyle));
    }

    return blockConfigs;
  }
  /**
   * Append a string of text to the internal buffer.
   */
  ;

  _proto._appendText = function _appendText(text, style) {
    var _this$characterList;

    this.currentText += text;
    var characterMetadata = CharacterMetadata.create({
      style: style,
      entity: this.currentEntity
    });
    this.characterList = (_this$characterList = this.characterList).push.apply(_this$characterList, Array(text.length).fill(characterMetadata));
  }
  /**
   * Trim the text in the internal buffer.
   */
  ;

  _proto._trimCurrentText = function _trimCurrentText() {
    var l = this.currentText.length;
    var begin = l - this.currentText.trimLeft().length;
    var end = this.currentText.trimRight().length; // We should not trim whitespaces for which an entity is defined.

    var entity = this.characterList.findEntry(function (characterMetadata) {
      return characterMetadata.getEntity() !== null;
    });
    begin = entity !== undefined ? Math.min(begin, entity[0]) : begin;
    entity = this.characterList.reverse().findEntry(function (characterMetadata) {
      return characterMetadata.getEntity() !== null;
    });
    end = entity !== undefined ? Math.max(end, l - entity[0]) : end;

    if (begin > end) {
      this.currentText = '';
      this.characterList = List();
    } else {
      this.currentText = this.currentText.slice(begin, end);
      this.characterList = this.characterList.slice(begin, end);
    }
  }
  /**
   * Add the content of an HTML text node to the internal state
   */
  ;

  _proto._addTextNode = function _addTextNode(node, style) {
    var text = node.textContent;
    var trimmedText = text.trim(); // If we are not in a pre block and the trimmed content is empty,
    // normalize to a single space.

    if (trimmedText === '' && this.wrapper !== 'pre') {
      text = ' ';
    }

    if (this.wrapper !== 'pre') {
      // Trim leading line feed, which is invisible in HTML
      text = text.replace(REGEX_LEADING_LF, ''); // Can't use empty string because MSWord

      text = text.replace(REGEX_LF, SPACE);
    }

    this._appendText(text, style);
  };

  _proto._addBreakNode = function _addBreakNode(node, style) {
    if (!isHTMLBRElement(node)) {
      return;
    }

    this._appendText('\n', style);
  }
  /**
   * Add the content of an HTML img node to the internal state
   */
  ;

  _proto._addImgNode = function _addImgNode(node, style) {
    if (!isHTMLImageElement(node)) {
      return;
    }

    var image = node;
    var entityConfig = {};
    imgAttr.forEach(function (attr) {
      var imageAttribute = image.getAttribute(attr);

      if (imageAttribute) {
        entityConfig[attr] = imageAttribute;
      }
    }); // TODO: T15530363 update this when we remove DraftEntity entirely

    this.currentEntity = this.entityMap.__create('IMAGE', 'IMMUTABLE', entityConfig); // The child text node cannot just have a space or return as content (since
    // we strip those out), unless the image is for presentation only.
    // See https://github.com/facebook/draft-js/issues/231 for some context.

    if (gkx('draftjs_fix_paste_for_img')) {
      if (image.getAttribute('role') !== 'presentation') {
        this._appendText("\uD83D\uDCF7", style);
      }
    } else {
      this._appendText("\uD83D\uDCF7", style);
    }

    this.currentEntity = null;
  }
  /**
   * Add the content of an HTML 'a' node to the internal state. Child nodes
   * (if any) are converted to Block Configs and appended to the provided
   * blockConfig array.
   */
  ;

  _proto._addAnchorNode = function _addAnchorNode(node, blockConfigs, style) {
    // The check has already been made by isValidAnchor but
    // we have to do it again to keep flow happy.
    if (!isHTMLAnchorElement(node)) {
      return;
    }

    var anchor = node;
    var entityConfig = {};
    anchorAttr.forEach(function (attr) {
      var anchorAttribute = anchor.getAttribute(attr);

      if (anchorAttribute) {
        entityConfig[attr] = anchorAttribute;
      }
    });
    entityConfig.url = new URI(anchor.href).toString(); // TODO: T15530363 update this when we remove DraftEntity completely

    this.currentEntity = this.entityMap.__create('LINK', 'MUTABLE', entityConfig || {});
    blockConfigs.push.apply(blockConfigs, this._toBlockConfigs(Array.from(node.childNodes), style));
    this.currentEntity = null;
  }
  /**
   * Walk the BlockConfig tree, compute parent/children/siblings,
   * and generate the corresponding ContentBlockNode
   */
  ;

  _proto._toContentBlocks = function _toContentBlocks(blockConfigs) {
    var parent = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;
    var l = blockConfigs.length - 1;

    for (var i = 0; i <= l; i++) {
      var config = blockConfigs[i];
      config.parent = parent;
      config.prevSibling = i > 0 ? blockConfigs[i - 1].key : null;
      config.nextSibling = i < l ? blockConfigs[i + 1].key : null;
      config.children = List(config.childConfigs.map(function (child) {
        return child.key;
      }));
      this.contentBlocks.push(new ContentBlockNode(_objectSpread({}, config)));

      this._toContentBlocks(config.childConfigs, config.key);
    }
  }
  /**
   * Remove 'useless' container nodes from the block config hierarchy, by
   * replacing them with their children.
   */
  ;

  _proto._hoistContainersInBlockConfigs = function _hoistContainersInBlockConfigs(blockConfigs) {
    var _this = this;

    var hoisted = List(blockConfigs).flatMap(function (blockConfig) {
      // Don't mess with useful blocks
      if (blockConfig.type !== 'unstyled' || blockConfig.text !== '') {
        return [blockConfig];
      }

      return _this._hoistContainersInBlockConfigs(blockConfig.childConfigs);
    });
    return hoisted;
  } // ***********************************************************************
  // The two methods below are used for backward compatibility when
  // experimentalTreeDataSupport is disabled.

  /**
   * Same as _toContentBlocks but replaces nested blocks by their
   * text content.
   */
  ;

  _proto._toFlatContentBlocks = function _toFlatContentBlocks(blockConfigs) {
    var _this2 = this;

    var cleanConfigs = this._hoistContainersInBlockConfigs(blockConfigs);

    cleanConfigs.forEach(function (config) {
      var _this2$_extractTextFr = _this2._extractTextFromBlockConfigs(config.childConfigs),
          text = _this2$_extractTextFr.text,
          characterList = _this2$_extractTextFr.characterList;

      _this2.contentBlocks.push(new ContentBlock(_objectSpread({}, config, {
        text: config.text + text,
        characterList: config.characterList.concat(characterList)
      })));
    });
  }
  /**
   * Extract the text and the associated inline styles form an
   * array of content block configs.
   */
  ;

  _proto._extractTextFromBlockConfigs = function _extractTextFromBlockConfigs(blockConfigs) {
    var l = blockConfigs.length - 1;
    var text = '';
    var characterList = List();

    for (var i = 0; i <= l; i++) {
      var config = blockConfigs[i];
      text += config.text;
      characterList = characterList.concat(config.characterList);

      if (text !== '' && config.type !== 'unstyled') {
        text += '\n';
        characterList = characterList.push(characterList.last());
      }

      var children = this._extractTextFromBlockConfigs(config.childConfigs);

      text += children.text;
      characterList = characterList.concat(children.characterList);
    }

    return {
      text: text,
      characterList: characterList
    };
  };

  return ContentBlocksBuilder;
}();
/**
 * Converts an HTML string to an array of ContentBlocks and an EntityMap
 * suitable to initialize the internal state of a Draftjs component.
 */


var convertFromHTMLToContentBlocks = function convertFromHTMLToContentBlocks(html) {
  var DOMBuilder = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : getSafeBodyFromHTML;
  var blockRenderMap = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : DefaultDraftBlockRenderMap;
  // Be ABSOLUTELY SURE that the dom builder you pass here won't execute
  // arbitrary code in whatever environment you're running this in. For an
  // example of how we try to do this in-browser, see getSafeBodyFromHTML.
  // Remove funky characters from the HTML string
  html = html.trim().replace(REGEX_CR, '').replace(REGEX_NBSP, SPACE).replace(REGEX_CARRIAGE, '').replace(REGEX_ZWS, ''); // Build a DOM tree out of the HTML string

  var safeBody = DOMBuilder(html);

  if (!safeBody) {
    return null;
  } // Build a BlockTypeMap out of the BlockRenderMap


  var blockTypeMap = buildBlockTypeMap(blockRenderMap); // Select the proper block type for the cases where the blockRenderMap
  // uses multiple block types for the same html tag.

  var disambiguate = function disambiguate(tag, wrapper) {
    if (tag === 'li') {
      return wrapper === 'ol' ? 'ordered-list-item' : 'unordered-list-item';
    }

    return null;
  };

  return new ContentBlocksBuilder(blockTypeMap, disambiguate).addDOMNode(safeBody).getContentBlocks();
};

module.exports = convertFromHTMLToContentBlocks;

/***/ }),

/***/ "./node_modules/draft-js/lib/convertFromRawToDraftState.js":
/*!*****************************************************************!*\
  !*** ./node_modules/draft-js/lib/convertFromRawToDraftState.js ***!
  \*****************************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";
/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @format
 * 
 * @emails oncall+draft_js
 */


function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; var ownKeys = Object.keys(source); if (typeof Object.getOwnPropertySymbols === 'function') { ownKeys = ownKeys.concat(Object.getOwnPropertySymbols(source).filter(function (sym) { return Object.getOwnPropertyDescriptor(source, sym).enumerable; })); } ownKeys.forEach(function (key) { _defineProperty(target, key, source[key]); }); } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var ContentBlock = __webpack_require__(/*! ./ContentBlock */ "./node_modules/draft-js/lib/ContentBlock.js");

var ContentBlockNode = __webpack_require__(/*! ./ContentBlockNode */ "./node_modules/draft-js/lib/ContentBlockNode.js");

var ContentState = __webpack_require__(/*! ./ContentState */ "./node_modules/draft-js/lib/ContentState.js");

var DraftEntity = __webpack_require__(/*! ./DraftEntity */ "./node_modules/draft-js/lib/DraftEntity.js");

var DraftTreeAdapter = __webpack_require__(/*! ./DraftTreeAdapter */ "./node_modules/draft-js/lib/DraftTreeAdapter.js");

var DraftTreeInvariants = __webpack_require__(/*! ./DraftTreeInvariants */ "./node_modules/draft-js/lib/DraftTreeInvariants.js");

var SelectionState = __webpack_require__(/*! ./SelectionState */ "./node_modules/draft-js/lib/SelectionState.js");

var createCharacterList = __webpack_require__(/*! ./createCharacterList */ "./node_modules/draft-js/lib/createCharacterList.js");

var decodeEntityRanges = __webpack_require__(/*! ./decodeEntityRanges */ "./node_modules/draft-js/lib/decodeEntityRanges.js");

var decodeInlineStyleRanges = __webpack_require__(/*! ./decodeInlineStyleRanges */ "./node_modules/draft-js/lib/decodeInlineStyleRanges.js");

var generateRandomKey = __webpack_require__(/*! ./generateRandomKey */ "./node_modules/draft-js/lib/generateRandomKey.js");

var gkx = __webpack_require__(/*! ./gkx */ "./node_modules/draft-js/lib/gkx.js");

var Immutable = __webpack_require__(/*! immutable */ "./node_modules/draft-js/node_modules/immutable/dist/immutable.js");

var invariant = __webpack_require__(/*! fbjs/lib/invariant */ "./node_modules/fbjs/lib/invariant.js");

var experimentalTreeDataSupport = gkx('draft_tree_data_support');
var List = Immutable.List,
    Map = Immutable.Map,
    OrderedMap = Immutable.OrderedMap;

var decodeBlockNodeConfig = function decodeBlockNodeConfig(block, entityMap) {
  var key = block.key,
      type = block.type,
      data = block.data,
      text = block.text,
      depth = block.depth;
  var blockNodeConfig = {
    text: text,
    depth: depth || 0,
    type: type || 'unstyled',
    key: key || generateRandomKey(),
    data: Map(data),
    characterList: decodeCharacterList(block, entityMap)
  };
  return blockNodeConfig;
};

var decodeCharacterList = function decodeCharacterList(block, entityMap) {
  var text = block.text,
      rawEntityRanges = block.entityRanges,
      rawInlineStyleRanges = block.inlineStyleRanges;
  var entityRanges = rawEntityRanges || [];
  var inlineStyleRanges = rawInlineStyleRanges || []; // Translate entity range keys to the DraftEntity map.

  return createCharacterList(decodeInlineStyleRanges(text, inlineStyleRanges), decodeEntityRanges(text, entityRanges.filter(function (range) {
    return entityMap.hasOwnProperty(range.key);
  }).map(function (range) {
    return _objectSpread({}, range, {
      key: entityMap[range.key]
    });
  })));
};

var addKeyIfMissing = function addKeyIfMissing(block) {
  return _objectSpread({}, block, {
    key: block.key || generateRandomKey()
  });
};
/**
 * Node stack is responsible to ensure we traverse the tree only once
 * in depth order, while also providing parent refs to inner nodes to
 * construct their links.
 */


var updateNodeStack = function updateNodeStack(stack, nodes, parentRef) {
  var nodesWithParentRef = nodes.map(function (block) {
    return _objectSpread({}, block, {
      parentRef: parentRef
    });
  }); // since we pop nodes from the stack we need to insert them in reverse

  return stack.concat(nodesWithParentRef.reverse());
};
/**
 * This will build a tree draft content state by creating the node
 * reference links into a single tree walk. Each node has a link
 * reference to "parent", "children", "nextSibling" and "prevSibling"
 * blockMap will be created using depth ordering.
 */


var decodeContentBlockNodes = function decodeContentBlockNodes(blocks, entityMap) {
  return blocks // ensure children have valid keys to enable sibling links
  .map(addKeyIfMissing).reduce(function (blockMap, block, index) {
    !Array.isArray(block.children) ?  true ? invariant(false, 'invalid RawDraftContentBlock can not be converted to ContentBlockNode') : 0 : void 0; // ensure children have valid keys to enable sibling links

    var children = block.children.map(addKeyIfMissing); // root level nodes

    var contentBlockNode = new ContentBlockNode(_objectSpread({}, decodeBlockNodeConfig(block, entityMap), {
      prevSibling: index === 0 ? null : blocks[index - 1].key,
      nextSibling: index === blocks.length - 1 ? null : blocks[index + 1].key,
      children: List(children.map(function (child) {
        return child.key;
      }))
    })); // push root node to blockMap

    blockMap = blockMap.set(contentBlockNode.getKey(), contentBlockNode); // this stack is used to ensure we visit all nodes respecting depth ordering

    var stack = updateNodeStack([], children, contentBlockNode); // start computing children nodes

    while (stack.length > 0) {
      // we pop from the stack and start processing this node
      var node = stack.pop(); // parentRef already points to a converted ContentBlockNode

      var parentRef = node.parentRef;
      var siblings = parentRef.getChildKeys();

      var _index = siblings.indexOf(node.key);

      var isValidBlock = Array.isArray(node.children);

      if (!isValidBlock) {
        !isValidBlock ?  true ? invariant(false, 'invalid RawDraftContentBlock can not be converted to ContentBlockNode') : 0 : void 0;
        break;
      } // ensure children have valid keys to enable sibling links


      var _children = node.children.map(addKeyIfMissing);

      var _contentBlockNode = new ContentBlockNode(_objectSpread({}, decodeBlockNodeConfig(node, entityMap), {
        parent: parentRef.getKey(),
        children: List(_children.map(function (child) {
          return child.key;
        })),
        prevSibling: _index === 0 ? null : siblings.get(_index - 1),
        nextSibling: _index === siblings.size - 1 ? null : siblings.get(_index + 1)
      })); // push node to blockMap


      blockMap = blockMap.set(_contentBlockNode.getKey(), _contentBlockNode); // this stack is used to ensure we visit all nodes respecting depth ordering

      stack = updateNodeStack(stack, _children, _contentBlockNode);
    }

    return blockMap;
  }, OrderedMap());
};

var decodeContentBlocks = function decodeContentBlocks(blocks, entityMap) {
  return OrderedMap(blocks.map(function (block) {
    var contentBlock = new ContentBlock(decodeBlockNodeConfig(block, entityMap));
    return [contentBlock.getKey(), contentBlock];
  }));
};

var decodeRawBlocks = function decodeRawBlocks(rawState, entityMap) {
  var isTreeRawBlock = rawState.blocks.find(function (block) {
    return Array.isArray(block.children) && block.children.length > 0;
  });
  var rawBlocks = experimentalTreeDataSupport && !isTreeRawBlock ? DraftTreeAdapter.fromRawStateToRawTreeState(rawState).blocks : rawState.blocks;

  if (!experimentalTreeDataSupport) {
    return decodeContentBlocks(isTreeRawBlock ? DraftTreeAdapter.fromRawTreeStateToRawState(rawState).blocks : rawBlocks, entityMap);
  }

  var blockMap = decodeContentBlockNodes(rawBlocks, entityMap); // in dev mode, check that the tree invariants are met

  if (true) {
    !DraftTreeInvariants.isValidTree(blockMap) ?  true ? invariant(false, 'Should be a valid tree') : 0 : void 0;
  }

  return blockMap;
};

var decodeRawEntityMap = function decodeRawEntityMap(rawState) {
  var rawEntityMap = rawState.entityMap;
  var entityMap = {}; // TODO: Update this once we completely remove DraftEntity

  Object.keys(rawEntityMap).forEach(function (rawEntityKey) {
    var _rawEntityMap$rawEnti = rawEntityMap[rawEntityKey],
        type = _rawEntityMap$rawEnti.type,
        mutability = _rawEntityMap$rawEnti.mutability,
        data = _rawEntityMap$rawEnti.data; // get the key reference to created entity

    entityMap[rawEntityKey] = DraftEntity.__create(type, mutability, data || {});
  });
  return entityMap;
};

var convertFromRawToDraftState = function convertFromRawToDraftState(rawState) {
  !Array.isArray(rawState.blocks) ?  true ? invariant(false, 'invalid RawDraftContentState') : 0 : void 0; // decode entities

  var entityMap = decodeRawEntityMap(rawState); // decode blockMap

  var blockMap = decodeRawBlocks(rawState, entityMap); // create initial selection

  var selectionState = blockMap.isEmpty() ? new SelectionState() : SelectionState.createEmpty(blockMap.first().getKey());
  return new ContentState({
    blockMap: blockMap,
    entityMap: entityMap,
    selectionBefore: selectionState,
    selectionAfter: selectionState
  });
};

module.exports = convertFromRawToDraftState;

/***/ }),

/***/ "./node_modules/draft-js/lib/createCharacterList.js":
/*!**********************************************************!*\
  !*** ./node_modules/draft-js/lib/createCharacterList.js ***!
  \**********************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";
/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @format
 * 
 * @emails oncall+draft_js
 */


var CharacterMetadata = __webpack_require__(/*! ./CharacterMetadata */ "./node_modules/draft-js/lib/CharacterMetadata.js");

var Immutable = __webpack_require__(/*! immutable */ "./node_modules/draft-js/node_modules/immutable/dist/immutable.js");

var List = Immutable.List;

function createCharacterList(inlineStyles, entities) {
  var characterArray = inlineStyles.map(function (style, ii) {
    var entity = entities[ii];
    return CharacterMetadata.create({
      style: style,
      entity: entity
    });
  });
  return List(characterArray);
}

module.exports = createCharacterList;

/***/ }),

/***/ "./node_modules/draft-js/lib/decodeEntityRanges.js":
/*!*********************************************************!*\
  !*** ./node_modules/draft-js/lib/decodeEntityRanges.js ***!
  \*********************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";
/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @format
 * 
 * @emails oncall+draft_js
 */


var UnicodeUtils = __webpack_require__(/*! fbjs/lib/UnicodeUtils */ "./node_modules/fbjs/lib/UnicodeUtils.js");

var substr = UnicodeUtils.substr;
/**
 * Convert to native JavaScript string lengths to determine ranges.
 */

function decodeEntityRanges(text, ranges) {
  var entities = Array(text.length).fill(null);

  if (ranges) {
    ranges.forEach(function (range) {
      // Using Unicode-enabled substrings converted to JavaScript lengths,
      // fill the output array with entity keys.
      var start = substr(text, 0, range.offset).length;
      var end = start + substr(text, range.offset, range.length).length;

      for (var ii = start; ii < end; ii++) {
        entities[ii] = range.key;
      }
    });
  }

  return entities;
}

module.exports = decodeEntityRanges;

/***/ }),

/***/ "./node_modules/draft-js/lib/decodeInlineStyleRanges.js":
/*!**************************************************************!*\
  !*** ./node_modules/draft-js/lib/decodeInlineStyleRanges.js ***!
  \**************************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";
/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @format
 * 
 * @emails oncall+draft_js
 */


var UnicodeUtils = __webpack_require__(/*! fbjs/lib/UnicodeUtils */ "./node_modules/fbjs/lib/UnicodeUtils.js");

var _require = __webpack_require__(/*! immutable */ "./node_modules/draft-js/node_modules/immutable/dist/immutable.js"),
    OrderedSet = _require.OrderedSet;

var substr = UnicodeUtils.substr;
var EMPTY_SET = OrderedSet();
/**
 * Convert to native JavaScript string lengths to determine ranges.
 */

function decodeInlineStyleRanges(text, ranges) {
  var styles = Array(text.length).fill(EMPTY_SET);

  if (ranges) {
    ranges.forEach(function (range) {
      var cursor = substr(text, 0, range.offset).length;
      var end = cursor + substr(text, range.offset, range.length).length;

      while (cursor < end) {
        styles[cursor] = styles[cursor].add(range.style);
        cursor++;
      }
    });
  }

  return styles;
}

module.exports = decodeInlineStyleRanges;

/***/ }),

/***/ "./node_modules/draft-js/lib/draftKeyUtils.js":
/*!****************************************************!*\
  !*** ./node_modules/draft-js/lib/draftKeyUtils.js ***!
  \****************************************************/
/***/ ((module) => {

"use strict";
/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * Provides utilities for handling draftjs keys.
 *
 * @emails oncall+draft_js
 * 
 * @format
 */


function notEmptyKey(key) {
  return key != null && key != '';
}

module.exports = {
  notEmptyKey: notEmptyKey
};

/***/ }),

/***/ "./node_modules/draft-js/lib/editOnBeforeInput.js":
/*!********************************************************!*\
  !*** ./node_modules/draft-js/lib/editOnBeforeInput.js ***!
  \********************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";
/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @format
 * 
 * @emails oncall+draft_js
 */


var DraftModifier = __webpack_require__(/*! ./DraftModifier */ "./node_modules/draft-js/lib/DraftModifier.js");

var EditorState = __webpack_require__(/*! ./EditorState */ "./node_modules/draft-js/lib/EditorState.js");

var UserAgent = __webpack_require__(/*! fbjs/lib/UserAgent */ "./node_modules/fbjs/lib/UserAgent.js");

var getEntityKeyForSelection = __webpack_require__(/*! ./getEntityKeyForSelection */ "./node_modules/draft-js/lib/getEntityKeyForSelection.js");

var isEventHandled = __webpack_require__(/*! ./isEventHandled */ "./node_modules/draft-js/lib/isEventHandled.js");

var isSelectionAtLeafStart = __webpack_require__(/*! ./isSelectionAtLeafStart */ "./node_modules/draft-js/lib/isSelectionAtLeafStart.js");

var nullthrows = __webpack_require__(/*! fbjs/lib/nullthrows */ "./node_modules/fbjs/lib/nullthrows.js");

var setImmediate = __webpack_require__(/*! fbjs/lib/setImmediate */ "./node_modules/fbjs/lib/setImmediate.js"); // When nothing is focused, Firefox regards two characters, `'` and `/`, as
// commands that should open and focus the "quickfind" search bar. This should
// *never* happen while a contenteditable is focused, but as of v28, it
// sometimes does, even when the keypress event target is the contenteditable.
// This breaks the input. Special case these characters to ensure that when
// they are typed, we prevent default on the event to make sure not to
// trigger quickfind.


var FF_QUICKFIND_CHAR = "'";
var FF_QUICKFIND_LINK_CHAR = '/';
var isFirefox = UserAgent.isBrowser('Firefox');

function mustPreventDefaultForCharacter(character) {
  return isFirefox && (character == FF_QUICKFIND_CHAR || character == FF_QUICKFIND_LINK_CHAR);
}
/**
 * Replace the current selection with the specified text string, with the
 * inline style and entity key applied to the newly inserted text.
 */


function replaceText(editorState, text, inlineStyle, entityKey, forceSelection) {
  var contentState = DraftModifier.replaceText(editorState.getCurrentContent(), editorState.getSelection(), text, inlineStyle, entityKey);
  return EditorState.push(editorState, contentState, 'insert-characters', forceSelection);
}
/**
 * When `onBeforeInput` executes, the browser is attempting to insert a
 * character into the editor. Apply this character data to the document,
 * allowing native insertion if possible.
 *
 * Native insertion is encouraged in order to limit re-rendering and to
 * preserve spellcheck highlighting, which disappears or flashes if re-render
 * occurs on the relevant text nodes.
 */


function editOnBeforeInput(editor, e) {
  if (editor._pendingStateFromBeforeInput !== undefined) {
    editor.update(editor._pendingStateFromBeforeInput);
    editor._pendingStateFromBeforeInput = undefined;
  }

  var editorState = editor._latestEditorState;
  var chars = e.data; // In some cases (ex: IE ideographic space insertion) no character data
  // is provided. There's nothing to do when this happens.

  if (!chars) {
    return;
  } // Allow the top-level component to handle the insertion manually. This is
  // useful when triggering interesting behaviors for a character insertion,
  // Simple examples: replacing a raw text ':)' with a smile emoji or image
  // decorator, or setting a block to be a list item after typing '- ' at the
  // start of the block.


  if (editor.props.handleBeforeInput && isEventHandled(editor.props.handleBeforeInput(chars, editorState, e.timeStamp))) {
    e.preventDefault();
    return;
  } // If selection is collapsed, conditionally allow native behavior. This
  // reduces re-renders and preserves spellcheck highlighting. If the selection
  // is not collapsed, we will re-render.


  var selection = editorState.getSelection();
  var selectionStart = selection.getStartOffset();
  var anchorKey = selection.getAnchorKey();

  if (!selection.isCollapsed()) {
    e.preventDefault();
    editor.update(replaceText(editorState, chars, editorState.getCurrentInlineStyle(), getEntityKeyForSelection(editorState.getCurrentContent(), editorState.getSelection()), true));
    return;
  }

  var newEditorState = replaceText(editorState, chars, editorState.getCurrentInlineStyle(), getEntityKeyForSelection(editorState.getCurrentContent(), editorState.getSelection()), false); // Bunch of different cases follow where we need to prevent native insertion.

  var mustPreventNative = false;

  if (!mustPreventNative) {
    // Browsers tend to insert text in weird places in the DOM when typing at
    // the start of a leaf, so we'll handle it ourselves.
    mustPreventNative = isSelectionAtLeafStart(editor._latestCommittedEditorState);
  }

  if (!mustPreventNative) {
    // Let's say we have a decorator that highlights hashtags. In many cases
    // we need to prevent native behavior and rerender ourselves --
    // particularly, any case *except* where the inserted characters end up
    // anywhere except exactly where you put them.
    //
    // Using [] to denote a decorated leaf, some examples:
    //
    // 1. 'hi #' and append 'f'
    // desired rendering: 'hi [#f]'
    // native rendering would be: 'hi #f' (incorrect)
    //
    // 2. 'x [#foo]' and insert '#' before 'f'
    // desired rendering: 'x #[#foo]'
    // native rendering would be: 'x [##foo]' (incorrect)
    //
    // 3. '[#foobar]' and insert ' ' between 'foo' and 'bar'
    // desired rendering: '[#foo] bar'
    // native rendering would be: '[#foo bar]' (incorrect)
    //
    // 4. '[#foo]' and delete '#' [won't use this beforeinput codepath though]
    // desired rendering: 'foo'
    // native rendering would be: '[foo]' (incorrect)
    //
    // 5. '[#foo]' and append 'b'
    // desired rendering: '[#foob]'
    // native rendering would be: '[#foob]'
    // (native insertion here would be ok for decorators like simple spans,
    // but not more complex decorators. To be safe, we need to prevent it.)
    //
    // It is safe to allow native insertion if and only if the full list of
    // decorator ranges matches what we expect native insertion to give, and
    // the range lengths have not changed. We don't need to compare the content
    // because the only possible mutation to consider here is inserting plain
    // text and decorators can't affect text content.
    var oldBlockTree = editorState.getBlockTree(anchorKey);
    var newBlockTree = newEditorState.getBlockTree(anchorKey);
    mustPreventNative = oldBlockTree.size !== newBlockTree.size || oldBlockTree.zip(newBlockTree).some(function (_ref) {
      var oldLeafSet = _ref[0],
          newLeafSet = _ref[1];
      // selectionStart is guaranteed to be selectionEnd here
      var oldStart = oldLeafSet.get('start');
      var adjustedStart = oldStart + (oldStart >= selectionStart ? chars.length : 0);
      var oldEnd = oldLeafSet.get('end');
      var adjustedEnd = oldEnd + (oldEnd >= selectionStart ? chars.length : 0);
      var newStart = newLeafSet.get('start');
      var newEnd = newLeafSet.get('end');
      var newDecoratorKey = newLeafSet.get('decoratorKey');
      return (// Different decorators
        oldLeafSet.get('decoratorKey') !== newDecoratorKey || // Different number of inline styles
        oldLeafSet.get('leaves').size !== newLeafSet.get('leaves').size || // Different effective decorator position
        adjustedStart !== newStart || adjustedEnd !== newEnd || // Decorator already existed and its length changed
        newDecoratorKey != null && newEnd - newStart !== oldEnd - oldStart
      );
    });
  }

  if (!mustPreventNative) {
    mustPreventNative = mustPreventDefaultForCharacter(chars);
  }

  if (!mustPreventNative) {
    mustPreventNative = nullthrows(newEditorState.getDirectionMap()).get(anchorKey) !== nullthrows(editorState.getDirectionMap()).get(anchorKey);
  }

  if (mustPreventNative) {
    e.preventDefault();
    newEditorState = EditorState.set(newEditorState, {
      forceSelection: true
    });
    editor.update(newEditorState);
    return;
  } // We made it all the way! Let the browser do its thing and insert the char.


  newEditorState = EditorState.set(newEditorState, {
    nativelyRenderedContent: newEditorState.getCurrentContent()
  }); // The native event is allowed to occur. To allow user onChange handlers to
  // change the inserted text, we wait until the text is actually inserted
  // before we actually update our state. That way when we rerender, the text
  // we see in the DOM will already have been inserted properly.

  editor._pendingStateFromBeforeInput = newEditorState;
  setImmediate(function () {
    if (editor._pendingStateFromBeforeInput !== undefined) {
      editor.update(editor._pendingStateFromBeforeInput);
      editor._pendingStateFromBeforeInput = undefined;
    }
  });
}

module.exports = editOnBeforeInput;

/***/ }),

/***/ "./node_modules/draft-js/lib/editOnBlur.js":
/*!*************************************************!*\
  !*** ./node_modules/draft-js/lib/editOnBlur.js ***!
  \*************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";
/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @format
 * 
 * @emails oncall+draft_js
 */


var EditorState = __webpack_require__(/*! ./EditorState */ "./node_modules/draft-js/lib/EditorState.js");

var containsNode = __webpack_require__(/*! fbjs/lib/containsNode */ "./node_modules/fbjs/lib/containsNode.js");

var getActiveElement = __webpack_require__(/*! fbjs/lib/getActiveElement */ "./node_modules/fbjs/lib/getActiveElement.js");

function editOnBlur(editor, e) {
  // In a contentEditable element, when you select a range and then click
  // another active element, this does trigger a `blur` event but will not
  // remove the DOM selection from the contenteditable.
  // This is consistent across all browsers, but we prefer that the editor
  // behave like a textarea, where a `blur` event clears the DOM selection.
  // We therefore force the issue to be certain, checking whether the active
  // element is `body` to force it when blurring occurs within the window (as
  // opposed to clicking to another tab or window).
  var ownerDocument = e.currentTarget.ownerDocument;

  if ( // This ESLint rule conflicts with `sketchy-null-bool` flow check
  // eslint-disable-next-line no-extra-boolean-cast
  !Boolean(editor.props.preserveSelectionOnBlur) && getActiveElement(ownerDocument) === ownerDocument.body) {
    var _selection = ownerDocument.defaultView.getSelection();

    var editorNode = editor.editor;

    if (_selection.rangeCount === 1 && containsNode(editorNode, _selection.anchorNode) && containsNode(editorNode, _selection.focusNode)) {
      _selection.removeAllRanges();
    }
  }

  var editorState = editor._latestEditorState;
  var currentSelection = editorState.getSelection();

  if (!currentSelection.getHasFocus()) {
    return;
  }

  var selection = currentSelection.set('hasFocus', false);
  editor.props.onBlur && editor.props.onBlur(e);
  editor.update(EditorState.acceptSelection(editorState, selection));
}

module.exports = editOnBlur;

/***/ }),

/***/ "./node_modules/draft-js/lib/editOnCompositionStart.js":
/*!*************************************************************!*\
  !*** ./node_modules/draft-js/lib/editOnCompositionStart.js ***!
  \*************************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";
/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @format
 * 
 * @emails oncall+draft_js
 */


var EditorState = __webpack_require__(/*! ./EditorState */ "./node_modules/draft-js/lib/EditorState.js");
/**
 * The user has begun using an IME input system. Switching to `composite` mode
 * allows handling composition input and disables other edit behavior.
 */


function editOnCompositionStart(editor, e) {
  editor.setMode('composite');
  editor.update(EditorState.set(editor._latestEditorState, {
    inCompositionMode: true
  })); // Allow composition handler to interpret the compositionstart event

  editor._onCompositionStart(e);
}

module.exports = editOnCompositionStart;

/***/ }),

/***/ "./node_modules/draft-js/lib/editOnCopy.js":
/*!*************************************************!*\
  !*** ./node_modules/draft-js/lib/editOnCopy.js ***!
  \*************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";
/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @format
 * 
 * @emails oncall+draft_js
 */


var getFragmentFromSelection = __webpack_require__(/*! ./getFragmentFromSelection */ "./node_modules/draft-js/lib/getFragmentFromSelection.js");
/**
 * If we have a selection, create a ContentState fragment and store
 * it in our internal clipboard. Subsequent paste events will use this
 * fragment if no external clipboard data is supplied.
 */


function editOnCopy(editor, e) {
  var editorState = editor._latestEditorState;
  var selection = editorState.getSelection(); // No selection, so there's nothing to copy.

  if (selection.isCollapsed()) {
    e.preventDefault();
    return;
  }

  editor.setClipboard(getFragmentFromSelection(editor._latestEditorState));
}

module.exports = editOnCopy;

/***/ }),

/***/ "./node_modules/draft-js/lib/editOnCut.js":
/*!************************************************!*\
  !*** ./node_modules/draft-js/lib/editOnCut.js ***!
  \************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";
/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @format
 * 
 * @emails oncall+draft_js
 */


var DraftModifier = __webpack_require__(/*! ./DraftModifier */ "./node_modules/draft-js/lib/DraftModifier.js");

var EditorState = __webpack_require__(/*! ./EditorState */ "./node_modules/draft-js/lib/EditorState.js");

var Style = __webpack_require__(/*! fbjs/lib/Style */ "./node_modules/fbjs/lib/Style.js");

var getFragmentFromSelection = __webpack_require__(/*! ./getFragmentFromSelection */ "./node_modules/draft-js/lib/getFragmentFromSelection.js");

var getScrollPosition = __webpack_require__(/*! fbjs/lib/getScrollPosition */ "./node_modules/fbjs/lib/getScrollPosition.js");

var isNode = __webpack_require__(/*! ./isInstanceOfNode */ "./node_modules/draft-js/lib/isInstanceOfNode.js");
/**
 * On `cut` events, native behavior is allowed to occur so that the system
 * clipboard is set properly. This means that we need to take steps to recover
 * the editor DOM state after the `cut` has occurred in order to maintain
 * control of the component.
 *
 * In addition, we can keep a copy of the removed fragment, including all
 * styles and entities, for use as an internal paste.
 */


function editOnCut(editor, e) {
  var editorState = editor._latestEditorState;
  var selection = editorState.getSelection();
  var element = e.target;
  var scrollPosition; // No selection, so there's nothing to cut.

  if (selection.isCollapsed()) {
    e.preventDefault();
    return;
  } // Track the current scroll position so that it can be forced back in place
  // after the editor regains control of the DOM.


  if (isNode(element)) {
    var node = element;
    scrollPosition = getScrollPosition(Style.getScrollParent(node));
  }

  var fragment = getFragmentFromSelection(editorState);
  editor.setClipboard(fragment); // Set `cut` mode to disable all event handling temporarily.

  editor.setMode('cut'); // Let native `cut` behavior occur, then recover control.

  setTimeout(function () {
    editor.restoreEditorDOM(scrollPosition);
    editor.exitCurrentMode();
    editor.update(removeFragment(editorState));
  }, 0);
}

function removeFragment(editorState) {
  var newContent = DraftModifier.removeRange(editorState.getCurrentContent(), editorState.getSelection(), 'forward');
  return EditorState.push(editorState, newContent, 'remove-range');
}

module.exports = editOnCut;

/***/ }),

/***/ "./node_modules/draft-js/lib/editOnDragOver.js":
/*!*****************************************************!*\
  !*** ./node_modules/draft-js/lib/editOnDragOver.js ***!
  \*****************************************************/
/***/ ((module) => {

"use strict";
/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @format
 * 
 * @emails oncall+draft_js
 */


/**
 * Drag behavior has begun from outside the editor element.
 */
function editOnDragOver(editor, e) {
  editor.setMode('drag');
  e.preventDefault();
}

module.exports = editOnDragOver;

/***/ }),

/***/ "./node_modules/draft-js/lib/editOnDragStart.js":
/*!******************************************************!*\
  !*** ./node_modules/draft-js/lib/editOnDragStart.js ***!
  \******************************************************/
/***/ ((module) => {

"use strict";
/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @format
 * 
 * @emails oncall+draft_js
 */


/**
 * A `dragstart` event has begun within the text editor component.
 */
function editOnDragStart(editor) {
  editor._internalDrag = true;
  editor.setMode('drag');
}

module.exports = editOnDragStart;

/***/ }),

/***/ "./node_modules/draft-js/lib/editOnFocus.js":
/*!**************************************************!*\
  !*** ./node_modules/draft-js/lib/editOnFocus.js ***!
  \**************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";
/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @format
 * 
 * @emails oncall+draft_js
 */


var EditorState = __webpack_require__(/*! ./EditorState */ "./node_modules/draft-js/lib/EditorState.js");

var UserAgent = __webpack_require__(/*! fbjs/lib/UserAgent */ "./node_modules/fbjs/lib/UserAgent.js");

function editOnFocus(editor, e) {
  var editorState = editor._latestEditorState;
  var currentSelection = editorState.getSelection();

  if (currentSelection.getHasFocus()) {
    return;
  }

  var selection = currentSelection.set('hasFocus', true);
  editor.props.onFocus && editor.props.onFocus(e); // When the tab containing this text editor is hidden and the user does a
  // find-in-page in a _different_ tab, Chrome on Mac likes to forget what the
  // selection was right after sending this focus event and (if you let it)
  // moves the cursor back to the beginning of the editor, so we force the
  // selection here instead of simply accepting it in order to preserve the
  // old cursor position. See https://crbug.com/540004.
  // But it looks like this is fixed in Chrome 60.0.3081.0.
  // Other browsers also don't have this bug, so we prefer to acceptSelection
  // when possible, to ensure that unfocusing and refocusing a Draft editor
  // doesn't preserve the selection, matching how textareas work.

  if (UserAgent.isBrowser('Chrome < 60.0.3081.0')) {
    editor.update(EditorState.forceSelection(editorState, selection));
  } else {
    editor.update(EditorState.acceptSelection(editorState, selection));
  }
}

module.exports = editOnFocus;

/***/ }),

/***/ "./node_modules/draft-js/lib/editOnInput.js":
/*!**************************************************!*\
  !*** ./node_modules/draft-js/lib/editOnInput.js ***!
  \**************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";
/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @format
 * 
 * @emails oncall+draft_js
 */


var DraftModifier = __webpack_require__(/*! ./DraftModifier */ "./node_modules/draft-js/lib/DraftModifier.js");

var DraftOffsetKey = __webpack_require__(/*! ./DraftOffsetKey */ "./node_modules/draft-js/lib/DraftOffsetKey.js");

var EditorState = __webpack_require__(/*! ./EditorState */ "./node_modules/draft-js/lib/EditorState.js");

var UserAgent = __webpack_require__(/*! fbjs/lib/UserAgent */ "./node_modules/fbjs/lib/UserAgent.js");

var _require = __webpack_require__(/*! ./draftKeyUtils */ "./node_modules/draft-js/lib/draftKeyUtils.js"),
    notEmptyKey = _require.notEmptyKey;

var findAncestorOffsetKey = __webpack_require__(/*! ./findAncestorOffsetKey */ "./node_modules/draft-js/lib/findAncestorOffsetKey.js");

var keyCommandPlainBackspace = __webpack_require__(/*! ./keyCommandPlainBackspace */ "./node_modules/draft-js/lib/keyCommandPlainBackspace.js");

var nullthrows = __webpack_require__(/*! fbjs/lib/nullthrows */ "./node_modules/fbjs/lib/nullthrows.js");

var isGecko = UserAgent.isEngine('Gecko');
var DOUBLE_NEWLINE = '\n\n';

function onInputType(inputType, editorState) {
  switch (inputType) {
    case 'deleteContentBackward':
      return keyCommandPlainBackspace(editorState);
  }

  return editorState;
}
/**
 * This function serves two purposes
 *
 * 1. To update the editorState and call onChange method with the new
 * editorState. This editorState is calculated in editOnBeforeInput but the
 * onChange method is not called with the new state until this method does it.
 * It is done to handle a specific case where certain character inputs might
 * be replaced with something else. E.g. snippets ('rc' might be replaced
 * with boilerplate code for react component). More information on the
 * exact problem can be found here -
 * https://github.com/facebook/draft-js/commit/07892ba479bd4dfc6afd1e0ed179aaf51cd138b1
 *
 * 2. intended to handle spellcheck and autocorrect changes,
 * which occur in the DOM natively without any opportunity to observe or
 * interpret the changes before they occur.
 *
 * The `input` event fires in contentEditable elements reliably for non-IE
 * browsers, immediately after changes occur to the editor DOM. Since our other
 * handlers override or otherwise handle cover other varieties of text input,
 * the DOM state should match the model in all controlled input cases. Thus,
 * when an `input` change leads to a DOM/model mismatch, the change should be
 * due to a spellcheck change, and we can incorporate it into our model.
 */


function editOnInput(editor, e) {
  if (editor._pendingStateFromBeforeInput !== undefined) {
    editor.update(editor._pendingStateFromBeforeInput);
    editor._pendingStateFromBeforeInput = undefined;
  } // at this point editor is not null for sure (after input)


  var castedEditorElement = editor.editor;
  var domSelection = castedEditorElement.ownerDocument.defaultView.getSelection();
  var anchorNode = domSelection.anchorNode,
      isCollapsed = domSelection.isCollapsed;
  var isNotTextOrElementNode = (anchorNode === null || anchorNode === void 0 ? void 0 : anchorNode.nodeType) !== Node.TEXT_NODE && (anchorNode === null || anchorNode === void 0 ? void 0 : anchorNode.nodeType) !== Node.ELEMENT_NODE;

  if (anchorNode == null || isNotTextOrElementNode) {
    // TODO: (t16149272) figure out context for this change
    return;
  }

  if (anchorNode.nodeType === Node.TEXT_NODE && (anchorNode.previousSibling !== null || anchorNode.nextSibling !== null)) {
    // When typing at the beginning of a visual line, Chrome splits the text
    // nodes into two. Why? No one knows. This commit is suspicious:
    // https://chromium.googlesource.com/chromium/src/+/a3b600981286b135632371477f902214c55a1724
    // To work around, we'll merge the sibling text nodes back into this one.
    var span = anchorNode.parentNode;

    if (span == null) {
      // Handle null-parent case.
      return;
    }

    anchorNode.nodeValue = span.textContent;

    for (var child = span.firstChild; child != null; child = child.nextSibling) {
      if (child !== anchorNode) {
        span.removeChild(child);
      }
    }
  }

  var domText = anchorNode.textContent;
  var editorState = editor._latestEditorState;
  var offsetKey = nullthrows(findAncestorOffsetKey(anchorNode));

  var _DraftOffsetKey$decod = DraftOffsetKey.decode(offsetKey),
      blockKey = _DraftOffsetKey$decod.blockKey,
      decoratorKey = _DraftOffsetKey$decod.decoratorKey,
      leafKey = _DraftOffsetKey$decod.leafKey;

  var _editorState$getBlock = editorState.getBlockTree(blockKey).getIn([decoratorKey, 'leaves', leafKey]),
      start = _editorState$getBlock.start,
      end = _editorState$getBlock.end;

  var content = editorState.getCurrentContent();
  var block = content.getBlockForKey(blockKey);
  var modelText = block.getText().slice(start, end); // Special-case soft newlines here. If the DOM text ends in a soft newline,
  // we will have manually inserted an extra soft newline in DraftEditorLeaf.
  // We want to remove this extra newline for the purpose of our comparison
  // of DOM and model text.

  if (domText.endsWith(DOUBLE_NEWLINE)) {
    domText = domText.slice(0, -1);
  } // No change -- the DOM is up to date. Nothing to do here.


  if (domText === modelText) {
    // This can be buggy for some Android keyboards because they don't fire
    // standard onkeydown/pressed events and only fired editOnInput
    // so domText is already changed by the browser and ends up being equal
    // to modelText unexpectedly.
    // Newest versions of Android support the dom-inputevent-inputtype
    // and we can use the `inputType` to properly apply the state changes.

    /* $FlowFixMe[prop-missing] inputType is only defined on a draft of a
     * standard. https://w3c.github.io/input-events/#dom-inputevent-inputtype
     */
    var inputType = e.nativeEvent.inputType;

    if (inputType) {
      var newEditorState = onInputType(inputType, editorState);

      if (newEditorState !== editorState) {
        editor.restoreEditorDOM();
        editor.update(newEditorState);
        return;
      }
    }

    return;
  }

  var selection = editorState.getSelection(); // We'll replace the entire leaf with the text content of the target.

  var targetRange = selection.merge({
    anchorOffset: start,
    focusOffset: end,
    isBackward: false
  });
  var entityKey = block.getEntityAt(start);
  var entity = notEmptyKey(entityKey) ? content.getEntity(entityKey) : null;
  var entityType = entity != null ? entity.getMutability() : null;
  var preserveEntity = entityType === 'MUTABLE'; // Immutable or segmented entities cannot properly be handled by the
  // default browser undo, so we have to use a different change type to
  // force using our internal undo method instead of falling through to the
  // native browser undo.

  var changeType = preserveEntity ? 'spellcheck-change' : 'apply-entity';
  var newContent = DraftModifier.replaceText(content, targetRange, domText, block.getInlineStyleAt(start), preserveEntity ? block.getEntityAt(start) : null);
  var anchorOffset, focusOffset, startOffset, endOffset;

  if (isGecko) {
    // Firefox selection does not change while the context menu is open, so
    // we preserve the anchor and focus values of the DOM selection.
    anchorOffset = domSelection.anchorOffset;
    focusOffset = domSelection.focusOffset;
    startOffset = start + Math.min(anchorOffset, focusOffset);
    endOffset = startOffset + Math.abs(anchorOffset - focusOffset);
    anchorOffset = startOffset;
    focusOffset = endOffset;
  } else {
    // Browsers other than Firefox may adjust DOM selection while the context
    // menu is open, and Safari autocorrect is prone to providing an inaccurate
    // DOM selection. Don't trust it. Instead, use our existing SelectionState
    // and adjust it based on the number of characters changed during the
    // mutation.
    var charDelta = domText.length - modelText.length;
    startOffset = selection.getStartOffset();
    endOffset = selection.getEndOffset();
    anchorOffset = isCollapsed ? endOffset + charDelta : startOffset;
    focusOffset = endOffset + charDelta;
  } // Segmented entities are completely or partially removed when their
  // text content changes. For this case we do not want any text to be selected
  // after the change, so we are not merging the selection.


  var contentWithAdjustedDOMSelection = newContent.merge({
    selectionBefore: content.getSelectionAfter(),
    selectionAfter: selection.merge({
      anchorOffset: anchorOffset,
      focusOffset: focusOffset
    })
  });
  editor.update(EditorState.push(editorState, contentWithAdjustedDOMSelection, changeType));
}

module.exports = editOnInput;

/***/ }),

/***/ "./node_modules/draft-js/lib/editOnKeyDown.js":
/*!****************************************************!*\
  !*** ./node_modules/draft-js/lib/editOnKeyDown.js ***!
  \****************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";
/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @format
 * 
 * @emails oncall+draft_js
 */


var DraftModifier = __webpack_require__(/*! ./DraftModifier */ "./node_modules/draft-js/lib/DraftModifier.js");

var EditorState = __webpack_require__(/*! ./EditorState */ "./node_modules/draft-js/lib/EditorState.js");

var KeyBindingUtil = __webpack_require__(/*! ./KeyBindingUtil */ "./node_modules/draft-js/lib/KeyBindingUtil.js");

var Keys = __webpack_require__(/*! fbjs/lib/Keys */ "./node_modules/fbjs/lib/Keys.js");

var SecondaryClipboard = __webpack_require__(/*! ./SecondaryClipboard */ "./node_modules/draft-js/lib/SecondaryClipboard.js");

var UserAgent = __webpack_require__(/*! fbjs/lib/UserAgent */ "./node_modules/fbjs/lib/UserAgent.js");

var isEventHandled = __webpack_require__(/*! ./isEventHandled */ "./node_modules/draft-js/lib/isEventHandled.js");

var keyCommandBackspaceToStartOfLine = __webpack_require__(/*! ./keyCommandBackspaceToStartOfLine */ "./node_modules/draft-js/lib/keyCommandBackspaceToStartOfLine.js");

var keyCommandBackspaceWord = __webpack_require__(/*! ./keyCommandBackspaceWord */ "./node_modules/draft-js/lib/keyCommandBackspaceWord.js");

var keyCommandDeleteWord = __webpack_require__(/*! ./keyCommandDeleteWord */ "./node_modules/draft-js/lib/keyCommandDeleteWord.js");

var keyCommandInsertNewline = __webpack_require__(/*! ./keyCommandInsertNewline */ "./node_modules/draft-js/lib/keyCommandInsertNewline.js");

var keyCommandMoveSelectionToEndOfBlock = __webpack_require__(/*! ./keyCommandMoveSelectionToEndOfBlock */ "./node_modules/draft-js/lib/keyCommandMoveSelectionToEndOfBlock.js");

var keyCommandMoveSelectionToStartOfBlock = __webpack_require__(/*! ./keyCommandMoveSelectionToStartOfBlock */ "./node_modules/draft-js/lib/keyCommandMoveSelectionToStartOfBlock.js");

var keyCommandPlainBackspace = __webpack_require__(/*! ./keyCommandPlainBackspace */ "./node_modules/draft-js/lib/keyCommandPlainBackspace.js");

var keyCommandPlainDelete = __webpack_require__(/*! ./keyCommandPlainDelete */ "./node_modules/draft-js/lib/keyCommandPlainDelete.js");

var keyCommandTransposeCharacters = __webpack_require__(/*! ./keyCommandTransposeCharacters */ "./node_modules/draft-js/lib/keyCommandTransposeCharacters.js");

var keyCommandUndo = __webpack_require__(/*! ./keyCommandUndo */ "./node_modules/draft-js/lib/keyCommandUndo.js");

var isOptionKeyCommand = KeyBindingUtil.isOptionKeyCommand;
var isChrome = UserAgent.isBrowser('Chrome');
/**
 * Map a `DraftEditorCommand` command value to a corresponding function.
 */

function onKeyCommand(command, editorState, e) {
  switch (command) {
    case 'redo':
      return EditorState.redo(editorState);

    case 'delete':
      return keyCommandPlainDelete(editorState);

    case 'delete-word':
      return keyCommandDeleteWord(editorState);

    case 'backspace':
      return keyCommandPlainBackspace(editorState);

    case 'backspace-word':
      return keyCommandBackspaceWord(editorState);

    case 'backspace-to-start-of-line':
      return keyCommandBackspaceToStartOfLine(editorState, e);

    case 'split-block':
      return keyCommandInsertNewline(editorState);

    case 'transpose-characters':
      return keyCommandTransposeCharacters(editorState);

    case 'move-selection-to-start-of-block':
      return keyCommandMoveSelectionToStartOfBlock(editorState);

    case 'move-selection-to-end-of-block':
      return keyCommandMoveSelectionToEndOfBlock(editorState);

    case 'secondary-cut':
      return SecondaryClipboard.cut(editorState);

    case 'secondary-paste':
      return SecondaryClipboard.paste(editorState);

    default:
      return editorState;
  }
}
/**
 * Intercept keydown behavior to handle keys and commands manually, if desired.
 *
 * Keydown combinations may be mapped to `DraftCommand` values, which may
 * correspond to command functions that modify the editor or its contents.
 *
 * See `getDefaultKeyBinding` for defaults. Alternatively, the top-level
 * component may provide a custom mapping via the `keyBindingFn` prop.
 */


function editOnKeyDown(editor, e) {
  var keyCode = e.which;
  var editorState = editor._latestEditorState;

  function callDeprecatedHandler(handlerName) {
    var deprecatedHandler = editor.props[handlerName];

    if (deprecatedHandler) {
      deprecatedHandler(e);
      return true;
    } else {
      return false;
    }
  }

  switch (keyCode) {
    case Keys.RETURN:
      e.preventDefault(); // The top-level component may manually handle newline insertion. If
      // no special handling is performed, fall through to command handling.

      if (editor.props.handleReturn && isEventHandled(editor.props.handleReturn(e, editorState))) {
        return;
      }

      break;

    case Keys.ESC:
      e.preventDefault();

      if (callDeprecatedHandler('onEscape')) {
        return;
      }

      break;

    case Keys.TAB:
      if (callDeprecatedHandler('onTab')) {
        return;
      }

      break;

    case Keys.UP:
      if (callDeprecatedHandler('onUpArrow')) {
        return;
      }

      break;

    case Keys.RIGHT:
      if (callDeprecatedHandler('onRightArrow')) {
        return;
      }

      break;

    case Keys.DOWN:
      if (callDeprecatedHandler('onDownArrow')) {
        return;
      }

      break;

    case Keys.LEFT:
      if (callDeprecatedHandler('onLeftArrow')) {
        return;
      }

      break;

    case Keys.SPACE:
      // Prevent Chrome on OSX behavior where option + space scrolls.
      if (isChrome && isOptionKeyCommand(e)) {
        e.preventDefault();
      }

  }

  var command = editor.props.keyBindingFn(e); // If no command is specified, allow keydown event to continue.

  if (command == null || command === '') {
    if (keyCode === Keys.SPACE && isChrome && isOptionKeyCommand(e)) {
      // The default keydown event has already been prevented in order to stop
      // Chrome from scrolling. Insert a nbsp into the editor as OSX would for
      // other browsers.
      var contentState = DraftModifier.replaceText(editorState.getCurrentContent(), editorState.getSelection(), "\xA0");
      editor.update(EditorState.push(editorState, contentState, 'insert-characters'));
    }

    return;
  }

  if (command === 'undo') {
    // Since undo requires some special updating behavior to keep the editor
    // in sync, handle it separately.
    keyCommandUndo(e, editorState, editor.update);
    return;
  } // At this point, we know that we're handling a command of some kind, so
  // we don't want to insert a character following the keydown.


  e.preventDefault(); // Allow components higher up the tree to handle the command first.

  if (editor.props.handleKeyCommand && isEventHandled(editor.props.handleKeyCommand(command, editorState, e.timeStamp))) {
    return;
  }

  var newState = onKeyCommand(command, editorState, e);

  if (newState !== editorState) {
    editor.update(newState);
  }
}

module.exports = editOnKeyDown;

/***/ }),

/***/ "./node_modules/draft-js/lib/editOnPaste.js":
/*!**************************************************!*\
  !*** ./node_modules/draft-js/lib/editOnPaste.js ***!
  \**************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";
/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @format
 * 
 * @emails oncall+draft_js
 */


var BlockMapBuilder = __webpack_require__(/*! ./BlockMapBuilder */ "./node_modules/draft-js/lib/BlockMapBuilder.js");

var CharacterMetadata = __webpack_require__(/*! ./CharacterMetadata */ "./node_modules/draft-js/lib/CharacterMetadata.js");

var DataTransfer = __webpack_require__(/*! fbjs/lib/DataTransfer */ "./node_modules/fbjs/lib/DataTransfer.js");

var DraftModifier = __webpack_require__(/*! ./DraftModifier */ "./node_modules/draft-js/lib/DraftModifier.js");

var DraftPasteProcessor = __webpack_require__(/*! ./DraftPasteProcessor */ "./node_modules/draft-js/lib/DraftPasteProcessor.js");

var EditorState = __webpack_require__(/*! ./EditorState */ "./node_modules/draft-js/lib/EditorState.js");

var RichTextEditorUtil = __webpack_require__(/*! ./RichTextEditorUtil */ "./node_modules/draft-js/lib/RichTextEditorUtil.js");

var getEntityKeyForSelection = __webpack_require__(/*! ./getEntityKeyForSelection */ "./node_modules/draft-js/lib/getEntityKeyForSelection.js");

var getTextContentFromFiles = __webpack_require__(/*! ./getTextContentFromFiles */ "./node_modules/draft-js/lib/getTextContentFromFiles.js");

var isEventHandled = __webpack_require__(/*! ./isEventHandled */ "./node_modules/draft-js/lib/isEventHandled.js");

var splitTextIntoTextBlocks = __webpack_require__(/*! ./splitTextIntoTextBlocks */ "./node_modules/draft-js/lib/splitTextIntoTextBlocks.js");
/**
 * Paste content.
 */


function editOnPaste(editor, e) {
  e.preventDefault();
  var data = new DataTransfer(e.clipboardData); // Get files, unless this is likely to be a string the user wants inline.

  if (!data.isRichText()) {
    var files = data.getFiles();
    var defaultFileText = data.getText();

    if (files.length > 0) {
      // Allow customized paste handling for images, etc. Otherwise, fall
      // through to insert text contents into the editor.
      if (editor.props.handlePastedFiles && isEventHandled(editor.props.handlePastedFiles(files))) {
        return;
      }
      /* $FlowFixMe[incompatible-call] This comment suppresses an error found
       * DataTransfer was typed. getFiles() returns an array of <Files extends
       * Blob>, not Blob */


      getTextContentFromFiles(files, function (
      /*string*/
      fileText) {
        fileText = fileText || defaultFileText;

        if (!fileText) {
          return;
        }

        var editorState = editor._latestEditorState;
        var blocks = splitTextIntoTextBlocks(fileText);
        var character = CharacterMetadata.create({
          style: editorState.getCurrentInlineStyle(),
          entity: getEntityKeyForSelection(editorState.getCurrentContent(), editorState.getSelection())
        });
        var currentBlockType = RichTextEditorUtil.getCurrentBlockType(editorState);
        var text = DraftPasteProcessor.processText(blocks, character, currentBlockType);
        var fragment = BlockMapBuilder.createFromArray(text);
        var withInsertedText = DraftModifier.replaceWithFragment(editorState.getCurrentContent(), editorState.getSelection(), fragment);
        editor.update(EditorState.push(editorState, withInsertedText, 'insert-fragment'));
      });
      return;
    }
  }

  var textBlocks = [];
  var text = data.getText();
  var html = data.getHTML();
  var editorState = editor._latestEditorState;

  if (editor.props.formatPastedText) {
    var _editor$props$formatP = editor.props.formatPastedText(text, html),
        formattedText = _editor$props$formatP.text,
        formattedHtml = _editor$props$formatP.html;

    text = formattedText;
    html = formattedHtml;
  }

  if (editor.props.handlePastedText && isEventHandled(editor.props.handlePastedText(text, html, editorState))) {
    return;
  }

  if (text) {
    textBlocks = splitTextIntoTextBlocks(text);
  }

  if (!editor.props.stripPastedStyles) {
    // If the text from the paste event is rich content that matches what we
    // already have on the internal clipboard, assume that we should just use
    // the clipboard fragment for the paste. This will allow us to preserve
    // styling and entities, if any are present. Note that newlines are
    // stripped during comparison -- this is because copy/paste within the
    // editor in Firefox and IE will not include empty lines. The resulting
    // paste will preserve the newlines correctly.
    var internalClipboard = editor.getClipboard();

    if (!editor.props.formatPastedText && data.isRichText() && internalClipboard) {
      var _html;

      if ( // If the editorKey is present in the pasted HTML, it should be safe to
      // assume this is an internal paste.
      ((_html = html) === null || _html === void 0 ? void 0 : _html.indexOf(editor.getEditorKey())) !== -1 || // The copy may have been made within a single block, in which case the
      // editor key won't be part of the paste. In this case, just check
      // whether the pasted text matches the internal clipboard.
      textBlocks.length === 1 && internalClipboard.size === 1 && internalClipboard.first().getText() === text) {
        editor.update(insertFragment(editor._latestEditorState, internalClipboard));
        return;
      }
    } else if (internalClipboard && data.types.includes('com.apple.webarchive') && !data.types.includes('text/html') && areTextBlocksAndClipboardEqual(textBlocks, internalClipboard)) {
      // Safari does not properly store text/html in some cases.
      // Use the internalClipboard if present and equal to what is on
      // the clipboard. See https://bugs.webkit.org/show_bug.cgi?id=19893.
      editor.update(insertFragment(editor._latestEditorState, internalClipboard));
      return;
    } // If there is html paste data, try to parse that.


    if (html) {
      var htmlFragment = DraftPasteProcessor.processHTML(html, editor.props.blockRenderMap);

      if (htmlFragment) {
        var contentBlocks = htmlFragment.contentBlocks,
            entityMap = htmlFragment.entityMap;

        if (contentBlocks) {
          var htmlMap = BlockMapBuilder.createFromArray(contentBlocks);
          editor.update(insertFragment(editor._latestEditorState, htmlMap, entityMap));
          return;
        }
      }
    } // Otherwise, create a new fragment from our pasted text. Also
    // empty the internal clipboard, since it's no longer valid.


    editor.setClipboard(null);
  }

  if (textBlocks.length) {
    var character = CharacterMetadata.create({
      style: editorState.getCurrentInlineStyle(),
      entity: getEntityKeyForSelection(editorState.getCurrentContent(), editorState.getSelection())
    });
    var currentBlockType = RichTextEditorUtil.getCurrentBlockType(editorState);
    var textFragment = DraftPasteProcessor.processText(textBlocks, character, currentBlockType);
    var textMap = BlockMapBuilder.createFromArray(textFragment);
    editor.update(insertFragment(editor._latestEditorState, textMap));
  }
}

function insertFragment(editorState, fragment, entityMap) {
  var newContent = DraftModifier.replaceWithFragment(editorState.getCurrentContent(), editorState.getSelection(), fragment); // TODO: merge the entity map once we stop using DraftEntity
  // like this:
  // const mergedEntityMap = newContent.getEntityMap().merge(entityMap);

  return EditorState.push(editorState, newContent.set('entityMap', entityMap), 'insert-fragment');
}

function areTextBlocksAndClipboardEqual(textBlocks, blockMap) {
  return textBlocks.length === blockMap.size && blockMap.valueSeq().every(function (block, ii) {
    return block.getText() === textBlocks[ii];
  });
}

module.exports = editOnPaste;

/***/ }),

/***/ "./node_modules/draft-js/lib/editOnSelect.js":
/*!***************************************************!*\
  !*** ./node_modules/draft-js/lib/editOnSelect.js ***!
  \***************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";
/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @format
 * 
 * @emails oncall+draft_js
 */


var DraftJsDebugLogging = __webpack_require__(/*! ./DraftJsDebugLogging */ "./node_modules/draft-js/lib/DraftJsDebugLogging.js");

var EditorState = __webpack_require__(/*! ./EditorState */ "./node_modules/draft-js/lib/EditorState.js");

var getContentEditableContainer = __webpack_require__(/*! ./getContentEditableContainer */ "./node_modules/draft-js/lib/getContentEditableContainer.js");

var getDraftEditorSelection = __webpack_require__(/*! ./getDraftEditorSelection */ "./node_modules/draft-js/lib/getDraftEditorSelection.js");

function editOnSelect(editor) {
  if (editor._blockSelectEvents || editor._latestEditorState !== editor.props.editorState) {
    if (editor._blockSelectEvents) {
      var _editorState = editor.props.editorState;

      var selectionState = _editorState.getSelection();

      DraftJsDebugLogging.logBlockedSelectionEvent({
        // For now I don't think we need any other info
        anonymizedDom: 'N/A',
        extraParams: JSON.stringify({
          stacktrace: new Error().stack
        }),
        selectionState: JSON.stringify(selectionState.toJS())
      });
    }

    return;
  }

  var editorState = editor.props.editorState;
  var documentSelection = getDraftEditorSelection(editorState, getContentEditableContainer(editor));
  var updatedSelectionState = documentSelection.selectionState;

  if (updatedSelectionState !== editorState.getSelection()) {
    if (documentSelection.needsRecovery) {
      editorState = EditorState.forceSelection(editorState, updatedSelectionState);
    } else {
      editorState = EditorState.acceptSelection(editorState, updatedSelectionState);
    }

    editor.update(editorState);
  }
}

module.exports = editOnSelect;

/***/ }),

/***/ "./node_modules/draft-js/lib/encodeEntityRanges.js":
/*!*********************************************************!*\
  !*** ./node_modules/draft-js/lib/encodeEntityRanges.js ***!
  \*********************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";
/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @format
 * 
 * @emails oncall+draft_js
 */


var DraftStringKey = __webpack_require__(/*! ./DraftStringKey */ "./node_modules/draft-js/lib/DraftStringKey.js");

var UnicodeUtils = __webpack_require__(/*! fbjs/lib/UnicodeUtils */ "./node_modules/fbjs/lib/UnicodeUtils.js");

var strlen = UnicodeUtils.strlen;
/**
 * Convert to UTF-8 character counts for storage.
 */

function encodeEntityRanges(block, storageMap) {
  var encoded = [];
  block.findEntityRanges(function (character) {
    return !!character.getEntity();
  }, function (
  /*number*/
  start,
  /*number*/
  end) {
    var text = block.getText();
    var key = block.getEntityAt(start);
    encoded.push({
      offset: strlen(text.slice(0, start)),
      length: strlen(text.slice(start, end)),
      // Encode the key as a number for range storage.
      key: Number(storageMap[DraftStringKey.stringify(key)])
    });
  });
  return encoded;
}

module.exports = encodeEntityRanges;

/***/ }),

/***/ "./node_modules/draft-js/lib/encodeInlineStyleRanges.js":
/*!**************************************************************!*\
  !*** ./node_modules/draft-js/lib/encodeInlineStyleRanges.js ***!
  \**************************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";
/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @format
 * 
 * @emails oncall+draft_js
 */


var UnicodeUtils = __webpack_require__(/*! fbjs/lib/UnicodeUtils */ "./node_modules/fbjs/lib/UnicodeUtils.js");

var findRangesImmutable = __webpack_require__(/*! ./findRangesImmutable */ "./node_modules/draft-js/lib/findRangesImmutable.js");

var areEqual = function areEqual(a, b) {
  return a === b;
};

var isTruthy = function isTruthy(a) {
  return !!a;
};

var EMPTY_ARRAY = [];
/**
 * Helper function for getting encoded styles for each inline style. Convert
 * to UTF-8 character counts for storage.
 */

function getEncodedInlinesForType(block, styleList, styleToEncode) {
  var ranges = []; // Obtain an array with ranges for only the specified style.

  var filteredInlines = styleList.map(function (style) {
    return style.has(styleToEncode);
  }).toList();
  findRangesImmutable(filteredInlines, areEqual, // We only want to keep ranges with nonzero style values.
  isTruthy, function (start, end) {
    var text = block.getText();
    ranges.push({
      offset: UnicodeUtils.strlen(text.slice(0, start)),
      length: UnicodeUtils.strlen(text.slice(start, end)),
      style: styleToEncode
    });
  });
  return ranges;
}
/*
 * Retrieve the encoded arrays of inline styles, with each individual style
 * treated separately.
 */


function encodeInlineStyleRanges(block) {
  var styleList = block.getCharacterList().map(function (c) {
    return c.getStyle();
  }).toList();
  var ranges = styleList.flatten().toSet().map(function (style) {
    return getEncodedInlinesForType(block, styleList, style);
  });
  return Array.prototype.concat.apply(EMPTY_ARRAY, ranges.toJS());
}

module.exports = encodeInlineStyleRanges;

/***/ }),

/***/ "./node_modules/draft-js/lib/expandRangeToStartOfLine.js":
/*!***************************************************************!*\
  !*** ./node_modules/draft-js/lib/expandRangeToStartOfLine.js ***!
  \***************************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";


/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @format
 * 
 * @emails oncall+draft_js
 */
var UnicodeUtils = __webpack_require__(/*! fbjs/lib/UnicodeUtils */ "./node_modules/fbjs/lib/UnicodeUtils.js");

var getCorrectDocumentFromNode = __webpack_require__(/*! ./getCorrectDocumentFromNode */ "./node_modules/draft-js/lib/getCorrectDocumentFromNode.js");

var getRangeClientRects = __webpack_require__(/*! ./getRangeClientRects */ "./node_modules/draft-js/lib/getRangeClientRects.js");

var invariant = __webpack_require__(/*! fbjs/lib/invariant */ "./node_modules/fbjs/lib/invariant.js");
/**
 * Return the computed line height, in pixels, for the provided element.
 */


function getLineHeightPx(element) {
  var computed = getComputedStyle(element);
  var correctDocument = getCorrectDocumentFromNode(element);
  var div = correctDocument.createElement('div');
  div.style.fontFamily = computed.fontFamily;
  div.style.fontSize = computed.fontSize;
  div.style.fontStyle = computed.fontStyle;
  div.style.fontWeight = computed.fontWeight;
  div.style.lineHeight = computed.lineHeight;
  div.style.position = 'absolute';
  div.textContent = 'M';
  var documentBody = correctDocument.body;
  !documentBody ?  true ? invariant(false, 'Missing document.body') : 0 : void 0; // forced layout here

  documentBody.appendChild(div);
  var rect = div.getBoundingClientRect();
  documentBody.removeChild(div);
  return rect.height;
}
/**
 * Return whether every ClientRect in the provided list lies on the same line.
 *
 * We assume that the rects on the same line all contain the baseline, so the
 * lowest top line needs to be above the highest bottom line (i.e., if you were
 * to project the rects onto the y-axis, their intersection would be nonempty).
 *
 * In addition, we require that no two boxes are lineHeight (or more) apart at
 * either top or bottom, which helps protect against false positives for fonts
 * with extremely large glyph heights (e.g., with a font size of 17px, Zapfino
 * produces rects of height 58px!).
 */


function areRectsOnOneLine(rects, lineHeight) {
  var minTop = Infinity;
  var minBottom = Infinity;
  var maxTop = -Infinity;
  var maxBottom = -Infinity;

  for (var ii = 0; ii < rects.length; ii++) {
    var rect = rects[ii];

    if (rect.width === 0 || rect.width === 1) {
      // When a range starts or ends a soft wrap, many browsers (Chrome, IE,
      // Safari) include an empty rect on the previous or next line. When the
      // text lies in a container whose position is not integral (e.g., from
      // margin: auto), Safari makes these empty rects have width 1 (instead of
      // 0). Having one-pixel-wide characters seems unlikely (and most browsers
      // report widths in subpixel precision anyway) so it's relatively safe to
      // skip over them.
      continue;
    }

    minTop = Math.min(minTop, rect.top);
    minBottom = Math.min(minBottom, rect.bottom);
    maxTop = Math.max(maxTop, rect.top);
    maxBottom = Math.max(maxBottom, rect.bottom);
  }

  return maxTop <= minBottom && maxTop - minTop < lineHeight && maxBottom - minBottom < lineHeight;
}
/**
 * Return the length of a node, as used by Range offsets.
 */


function getNodeLength(node) {
  // http://www.w3.org/TR/dom/#concept-node-length
  switch (node.nodeType) {
    case Node.DOCUMENT_TYPE_NODE:
      return 0;

    case Node.TEXT_NODE:
    case Node.PROCESSING_INSTRUCTION_NODE:
    case Node.COMMENT_NODE:
      return node.length;

    default:
      return node.childNodes.length;
  }
}
/**
 * Given a collapsed range, move the start position backwards as far as
 * possible while the range still spans only a single line.
 */


function expandRangeToStartOfLine(range) {
  !range.collapsed ?  true ? invariant(false, 'expandRangeToStartOfLine: Provided range is not collapsed.') : 0 : void 0;
  range = range.cloneRange();
  var containingElement = range.startContainer;

  if (containingElement.nodeType !== 1) {
    containingElement = containingElement.parentNode;
  }

  var lineHeight = getLineHeightPx(containingElement); // Imagine our text looks like:
  //   <div><span>once upon a time, there was a <em>boy
  //   who lived</em> </span><q><strong>under^ the
  //   stairs</strong> in a small closet.</q></div>
  // where the caret represents the cursor. First, we crawl up the tree until
  // the range spans multiple lines (setting the start point to before
  // "<strong>", then before "<div>"), then at each level we do a search to
  // find the latest point which is still on a previous line. We'll find that
  // the break point is inside the span, then inside the <em>, then in its text
  // node child, the actual break point before "who".

  var bestContainer = range.endContainer;
  var bestOffset = range.endOffset;
  range.setStart(range.startContainer, 0);

  while (areRectsOnOneLine(getRangeClientRects(range), lineHeight)) {
    bestContainer = range.startContainer;
    bestOffset = range.startOffset;
    !bestContainer.parentNode ?  true ? invariant(false, 'Found unexpected detached subtree when traversing.') : 0 : void 0;
    range.setStartBefore(bestContainer);

    if (bestContainer.nodeType === 1 && getComputedStyle(bestContainer).display !== 'inline') {
      // The start of the line is never in a different block-level container.
      break;
    }
  } // In the above example, range now spans from "<div>" to "under",
  // bestContainer is <div>, and bestOffset is 1 (index of <q> inside <div>)].
  // Picking out which child to recurse into here is a special case since we
  // don't want to check past <q> -- once we find that the final range starts
  // in <span>, we can look at all of its children (and all of their children)
  // to find the break point.
  // At all times, (bestContainer, bestOffset) is the latest single-line start
  // point that we know of.


  var currentContainer = bestContainer;
  var maxIndexToConsider = bestOffset - 1;

  do {
    var nodeValue = currentContainer.nodeValue;
    var ii = maxIndexToConsider;

    for (; ii >= 0; ii--) {
      if (nodeValue != null && ii > 0 && UnicodeUtils.isSurrogatePair(nodeValue, ii - 1)) {
        // We're in the middle of a surrogate pair -- skip over so we never
        // return a range with an endpoint in the middle of a code point.
        continue;
      }

      range.setStart(currentContainer, ii);

      if (areRectsOnOneLine(getRangeClientRects(range), lineHeight)) {
        bestContainer = currentContainer;
        bestOffset = ii;
      } else {
        break;
      }
    }

    if (ii === -1 || currentContainer.childNodes.length === 0) {
      // If ii === -1, then (bestContainer, bestOffset), which is equal to
      // (currentContainer, 0), was a single-line start point but a start
      // point before currentContainer wasn't, so the line break seems to
      // have occurred immediately after currentContainer's start tag
      //
      // If currentContainer.childNodes.length === 0, we're already at a
      // terminal node (e.g., text node) and should return our current best.
      break;
    }

    currentContainer = currentContainer.childNodes[ii];
    maxIndexToConsider = getNodeLength(currentContainer);
  } while (true);

  range.setStart(bestContainer, bestOffset);
  return range;
}

module.exports = expandRangeToStartOfLine;

/***/ }),

/***/ "./node_modules/draft-js/lib/findAncestorOffsetKey.js":
/*!************************************************************!*\
  !*** ./node_modules/draft-js/lib/findAncestorOffsetKey.js ***!
  \************************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";
/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @format
 * 
 * @emails oncall+draft_js
 */


var getCorrectDocumentFromNode = __webpack_require__(/*! ./getCorrectDocumentFromNode */ "./node_modules/draft-js/lib/getCorrectDocumentFromNode.js");

var getSelectionOffsetKeyForNode = __webpack_require__(/*! ./getSelectionOffsetKeyForNode */ "./node_modules/draft-js/lib/getSelectionOffsetKeyForNode.js");
/**
 * Get the key from the node's nearest offset-aware ancestor.
 */


function findAncestorOffsetKey(node) {
  var searchNode = node;

  while (searchNode && searchNode !== getCorrectDocumentFromNode(node).documentElement) {
    var key = getSelectionOffsetKeyForNode(searchNode);

    if (key != null) {
      return key;
    }

    searchNode = searchNode.parentNode;
  }

  return null;
}

module.exports = findAncestorOffsetKey;

/***/ }),

/***/ "./node_modules/draft-js/lib/findRangesImmutable.js":
/*!**********************************************************!*\
  !*** ./node_modules/draft-js/lib/findRangesImmutable.js ***!
  \**********************************************************/
/***/ ((module) => {

"use strict";
/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @format
 * 
 * @emails oncall+draft_js
 */


/**
 * Search through an array to find contiguous stretches of elements that
 * match a specified filter function.
 *
 * When ranges are found, execute a specified `found` function to supply
 * the values to the caller.
 */
function findRangesImmutable(haystack, areEqualFn, filterFn, foundFn) {
  if (!haystack.size) {
    return;
  }

  var cursor = 0;
  haystack.reduce(function (value, nextValue, nextIndex) {
    if (!areEqualFn(value, nextValue)) {
      if (filterFn(value)) {
        foundFn(cursor, nextIndex);
      }

      cursor = nextIndex;
    }

    return nextValue;
  });
  filterFn(haystack.last()) && foundFn(cursor, haystack.count());
}

module.exports = findRangesImmutable;

/***/ }),

/***/ "./node_modules/draft-js/lib/generateRandomKey.js":
/*!********************************************************!*\
  !*** ./node_modules/draft-js/lib/generateRandomKey.js ***!
  \********************************************************/
/***/ ((module) => {

"use strict";
/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @format
 * 
 * @emails oncall+draft_js
 */


var seenKeys = {};
var MULTIPLIER = Math.pow(2, 24);

function generateRandomKey() {
  var key;

  while (key === undefined || seenKeys.hasOwnProperty(key) || !isNaN(+key)) {
    key = Math.floor(Math.random() * MULTIPLIER).toString(32);
  }

  seenKeys[key] = true;
  return key;
}

module.exports = generateRandomKey;

/***/ }),

/***/ "./node_modules/draft-js/lib/getCharacterRemovalRange.js":
/*!***************************************************************!*\
  !*** ./node_modules/draft-js/lib/getCharacterRemovalRange.js ***!
  \***************************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";
/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @format
 * 
 * @emails oncall+draft_js
 */


var DraftEntitySegments = __webpack_require__(/*! ./DraftEntitySegments */ "./node_modules/draft-js/lib/DraftEntitySegments.js");

var getRangesForDraftEntity = __webpack_require__(/*! ./getRangesForDraftEntity */ "./node_modules/draft-js/lib/getRangesForDraftEntity.js");

var invariant = __webpack_require__(/*! fbjs/lib/invariant */ "./node_modules/fbjs/lib/invariant.js");
/**
 * Given a SelectionState and a removal direction, determine the entire range
 * that should be removed from a ContentState. This is based on any entities
 * within the target, with their `mutability` values taken into account.
 *
 * For instance, if we are attempting to remove part of an "immutable" entity
 * range, the entire entity must be removed. The returned `SelectionState`
 * will be adjusted accordingly.
 */


function getCharacterRemovalRange(entityMap, startBlock, endBlock, selectionState, direction) {
  var start = selectionState.getStartOffset();
  var end = selectionState.getEndOffset();
  var startEntityKey = startBlock.getEntityAt(start);
  var endEntityKey = endBlock.getEntityAt(end - 1);

  if (!startEntityKey && !endEntityKey) {
    return selectionState;
  }

  var newSelectionState = selectionState;

  if (startEntityKey && startEntityKey === endEntityKey) {
    newSelectionState = getEntityRemovalRange(entityMap, startBlock, newSelectionState, direction, startEntityKey, true, true);
  } else if (startEntityKey && endEntityKey) {
    var startSelectionState = getEntityRemovalRange(entityMap, startBlock, newSelectionState, direction, startEntityKey, false, true);
    var endSelectionState = getEntityRemovalRange(entityMap, endBlock, newSelectionState, direction, endEntityKey, false, false);
    newSelectionState = newSelectionState.merge({
      anchorOffset: startSelectionState.getAnchorOffset(),
      focusOffset: endSelectionState.getFocusOffset(),
      isBackward: false
    });
  } else if (startEntityKey) {
    var _startSelectionState = getEntityRemovalRange(entityMap, startBlock, newSelectionState, direction, startEntityKey, false, true);

    newSelectionState = newSelectionState.merge({
      anchorOffset: _startSelectionState.getStartOffset(),
      isBackward: false
    });
  } else if (endEntityKey) {
    var _endSelectionState = getEntityRemovalRange(entityMap, endBlock, newSelectionState, direction, endEntityKey, false, false);

    newSelectionState = newSelectionState.merge({
      focusOffset: _endSelectionState.getEndOffset(),
      isBackward: false
    });
  }

  return newSelectionState;
}

function getEntityRemovalRange(entityMap, block, selectionState, direction, entityKey, isEntireSelectionWithinEntity, isEntityAtStart) {
  var start = selectionState.getStartOffset();
  var end = selectionState.getEndOffset();

  var entity = entityMap.__get(entityKey);

  var mutability = entity.getMutability();
  var sideToConsider = isEntityAtStart ? start : end; // `MUTABLE` entities can just have the specified range of text removed
  // directly. No adjustments are needed.

  if (mutability === 'MUTABLE') {
    return selectionState;
  } // Find the entity range that overlaps with our removal range.


  var entityRanges = getRangesForDraftEntity(block, entityKey).filter(function (range) {
    return sideToConsider <= range.end && sideToConsider >= range.start;
  });
  !(entityRanges.length == 1) ?  true ? invariant(false, 'There should only be one entity range within this removal range.') : 0 : void 0;
  var entityRange = entityRanges[0]; // For `IMMUTABLE` entity types, we will remove the entire entity range.

  if (mutability === 'IMMUTABLE') {
    return selectionState.merge({
      anchorOffset: entityRange.start,
      focusOffset: entityRange.end,
      isBackward: false
    });
  } // For `SEGMENTED` entity types, determine the appropriate segment to
  // remove.


  if (!isEntireSelectionWithinEntity) {
    if (isEntityAtStart) {
      end = entityRange.end;
    } else {
      start = entityRange.start;
    }
  }

  var removalRange = DraftEntitySegments.getRemovalRange(start, end, block.getText().slice(entityRange.start, entityRange.end), entityRange.start, direction);
  return selectionState.merge({
    anchorOffset: removalRange.start,
    focusOffset: removalRange.end,
    isBackward: false
  });
}

module.exports = getCharacterRemovalRange;

/***/ }),

/***/ "./node_modules/draft-js/lib/getContentEditableContainer.js":
/*!******************************************************************!*\
  !*** ./node_modules/draft-js/lib/getContentEditableContainer.js ***!
  \******************************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";
/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @format
 * 
 * @emails oncall+draft_js
 */


var invariant = __webpack_require__(/*! fbjs/lib/invariant */ "./node_modules/fbjs/lib/invariant.js");

var isHTMLElement = __webpack_require__(/*! ./isHTMLElement */ "./node_modules/draft-js/lib/isHTMLElement.js");

function getContentEditableContainer(editor) {
  var editorNode = editor.editorContainer;
  !editorNode ?  true ? invariant(false, 'Missing editorNode') : 0 : void 0;
  !isHTMLElement(editorNode.firstChild) ?  true ? invariant(false, 'editorNode.firstChild is not an HTMLElement') : 0 : void 0;
  var htmlElement = editorNode.firstChild;
  return htmlElement;
}

module.exports = getContentEditableContainer;

/***/ }),

/***/ "./node_modules/draft-js/lib/getContentStateFragment.js":
/*!**************************************************************!*\
  !*** ./node_modules/draft-js/lib/getContentStateFragment.js ***!
  \**************************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";
/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @format
 * 
 * @emails oncall+draft_js
 */


var randomizeBlockMapKeys = __webpack_require__(/*! ./randomizeBlockMapKeys */ "./node_modules/draft-js/lib/randomizeBlockMapKeys.js");

var removeEntitiesAtEdges = __webpack_require__(/*! ./removeEntitiesAtEdges */ "./node_modules/draft-js/lib/removeEntitiesAtEdges.js");

var getContentStateFragment = function getContentStateFragment(contentState, selectionState) {
  var startKey = selectionState.getStartKey();
  var startOffset = selectionState.getStartOffset();
  var endKey = selectionState.getEndKey();
  var endOffset = selectionState.getEndOffset(); // Edge entities should be stripped to ensure that we don't preserve
  // invalid partial entities when the fragment is reused. We do, however,
  // preserve entities that are entirely within the selection range.

  var contentWithoutEdgeEntities = removeEntitiesAtEdges(contentState, selectionState);
  var blockMap = contentWithoutEdgeEntities.getBlockMap();
  var blockKeys = blockMap.keySeq();
  var startIndex = blockKeys.indexOf(startKey);
  var endIndex = blockKeys.indexOf(endKey) + 1;
  return randomizeBlockMapKeys(blockMap.slice(startIndex, endIndex).map(function (block, blockKey) {
    var text = block.getText();
    var chars = block.getCharacterList();

    if (startKey === endKey) {
      return block.merge({
        text: text.slice(startOffset, endOffset),
        characterList: chars.slice(startOffset, endOffset)
      });
    }

    if (blockKey === startKey) {
      return block.merge({
        text: text.slice(startOffset),
        characterList: chars.slice(startOffset)
      });
    }

    if (blockKey === endKey) {
      return block.merge({
        text: text.slice(0, endOffset),
        characterList: chars.slice(0, endOffset)
      });
    }

    return block;
  }));
};

module.exports = getContentStateFragment;

/***/ }),

/***/ "./node_modules/draft-js/lib/getCorrectDocumentFromNode.js":
/*!*****************************************************************!*\
  !*** ./node_modules/draft-js/lib/getCorrectDocumentFromNode.js ***!
  \*****************************************************************/
/***/ ((module) => {

"use strict";


/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @format
 * 
 * @emails oncall+draft_js
 */
function getCorrectDocumentFromNode(node) {
  if (!node || !node.ownerDocument) {
    return document;
  }

  return node.ownerDocument;
}

module.exports = getCorrectDocumentFromNode;

/***/ }),

/***/ "./node_modules/draft-js/lib/getDefaultKeyBinding.js":
/*!***********************************************************!*\
  !*** ./node_modules/draft-js/lib/getDefaultKeyBinding.js ***!
  \***********************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";
/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @format
 * 
 * @emails oncall+draft_js
 */


var KeyBindingUtil = __webpack_require__(/*! ./KeyBindingUtil */ "./node_modules/draft-js/lib/KeyBindingUtil.js");

var Keys = __webpack_require__(/*! fbjs/lib/Keys */ "./node_modules/fbjs/lib/Keys.js");

var UserAgent = __webpack_require__(/*! fbjs/lib/UserAgent */ "./node_modules/fbjs/lib/UserAgent.js");

var isOSX = UserAgent.isPlatform('Mac OS X'); // Firefox on OSX had a bug resulting in navigation instead of cursor movement.
// This bug was fixed in Firefox 29. Feature detection is virtually impossible
// so we just check the version number. See #342765.

var shouldFixFirefoxMovement = isOSX && UserAgent.isBrowser('Firefox < 29');
var hasCommandModifier = KeyBindingUtil.hasCommandModifier,
    isCtrlKeyCommand = KeyBindingUtil.isCtrlKeyCommand;

function shouldRemoveWord(e) {
  return isOSX && e.altKey || isCtrlKeyCommand(e);
}
/**
 * Get the appropriate undo/redo command for a Z key command.
 */


function getZCommand(e) {
  if (!hasCommandModifier(e)) {
    return null;
  }

  return e.shiftKey ? 'redo' : 'undo';
}

function getDeleteCommand(e) {
  // Allow default "cut" behavior for PCs on Shift + Delete.
  if (!isOSX && e.shiftKey) {
    return null;
  }

  return shouldRemoveWord(e) ? 'delete-word' : 'delete';
}

function getBackspaceCommand(e) {
  if (hasCommandModifier(e) && isOSX) {
    return 'backspace-to-start-of-line';
  }

  return shouldRemoveWord(e) ? 'backspace-word' : 'backspace';
}
/**
 * Retrieve a bound key command for the given event.
 */


function getDefaultKeyBinding(e) {
  switch (e.keyCode) {
    case 66:
      // B
      return hasCommandModifier(e) ? 'bold' : null;

    case 68:
      // D
      return isCtrlKeyCommand(e) ? 'delete' : null;

    case 72:
      // H
      return isCtrlKeyCommand(e) ? 'backspace' : null;

    case 73:
      // I
      return hasCommandModifier(e) ? 'italic' : null;

    case 74:
      // J
      return hasCommandModifier(e) ? 'code' : null;

    case 75:
      // K
      return isOSX && isCtrlKeyCommand(e) ? 'secondary-cut' : null;

    case 77:
      // M
      return isCtrlKeyCommand(e) ? 'split-block' : null;

    case 79:
      // O
      return isCtrlKeyCommand(e) ? 'split-block' : null;

    case 84:
      // T
      return isOSX && isCtrlKeyCommand(e) ? 'transpose-characters' : null;

    case 85:
      // U
      return hasCommandModifier(e) ? 'underline' : null;

    case 87:
      // W
      return isOSX && isCtrlKeyCommand(e) ? 'backspace-word' : null;

    case 89:
      // Y
      if (isCtrlKeyCommand(e)) {
        return isOSX ? 'secondary-paste' : 'redo';
      }

      return null;

    case 90:
      // Z
      return getZCommand(e) || null;

    case Keys.RETURN:
      return 'split-block';

    case Keys.DELETE:
      return getDeleteCommand(e);

    case Keys.BACKSPACE:
      return getBackspaceCommand(e);
    // LEFT/RIGHT handlers serve as a workaround for a Firefox bug.

    case Keys.LEFT:
      return shouldFixFirefoxMovement && hasCommandModifier(e) ? 'move-selection-to-start-of-block' : null;

    case Keys.RIGHT:
      return shouldFixFirefoxMovement && hasCommandModifier(e) ? 'move-selection-to-end-of-block' : null;

    default:
      return null;
  }
}

module.exports = getDefaultKeyBinding;

/***/ }),

/***/ "./node_modules/draft-js/lib/getDraftEditorSelection.js":
/*!**************************************************************!*\
  !*** ./node_modules/draft-js/lib/getDraftEditorSelection.js ***!
  \**************************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";
/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @format
 * 
 * @emails oncall+draft_js
 */


var getDraftEditorSelectionWithNodes = __webpack_require__(/*! ./getDraftEditorSelectionWithNodes */ "./node_modules/draft-js/lib/getDraftEditorSelectionWithNodes.js");
/**
 * Convert the current selection range to an anchor/focus pair of offset keys
 * and values that can be interpreted by components.
 */


function getDraftEditorSelection(editorState, root) {
  var selection = root.ownerDocument.defaultView.getSelection();
  var anchorNode = selection.anchorNode,
      anchorOffset = selection.anchorOffset,
      focusNode = selection.focusNode,
      focusOffset = selection.focusOffset,
      rangeCount = selection.rangeCount;

  if ( // No active selection.
  rangeCount === 0 || // No selection, ever. As in, the user hasn't selected anything since
  // opening the document.
  anchorNode == null || focusNode == null) {
    return {
      selectionState: editorState.getSelection().set('hasFocus', false),
      needsRecovery: false
    };
  }

  return getDraftEditorSelectionWithNodes(editorState, root, anchorNode, anchorOffset, focusNode, focusOffset);
}

module.exports = getDraftEditorSelection;

/***/ }),

/***/ "./node_modules/draft-js/lib/getDraftEditorSelectionWithNodes.js":
/*!***********************************************************************!*\
  !*** ./node_modules/draft-js/lib/getDraftEditorSelectionWithNodes.js ***!
  \***********************************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";
/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @format
 * 
 * @emails oncall+draft_js
 */


var findAncestorOffsetKey = __webpack_require__(/*! ./findAncestorOffsetKey */ "./node_modules/draft-js/lib/findAncestorOffsetKey.js");

var getSelectionOffsetKeyForNode = __webpack_require__(/*! ./getSelectionOffsetKeyForNode */ "./node_modules/draft-js/lib/getSelectionOffsetKeyForNode.js");

var getUpdatedSelectionState = __webpack_require__(/*! ./getUpdatedSelectionState */ "./node_modules/draft-js/lib/getUpdatedSelectionState.js");

var invariant = __webpack_require__(/*! fbjs/lib/invariant */ "./node_modules/fbjs/lib/invariant.js");

var isElement = __webpack_require__(/*! ./isElement */ "./node_modules/draft-js/lib/isElement.js");

var nullthrows = __webpack_require__(/*! fbjs/lib/nullthrows */ "./node_modules/fbjs/lib/nullthrows.js");

/**
 * Convert the current selection range to an anchor/focus pair of offset keys
 * and values that can be interpreted by components.
 */
function getDraftEditorSelectionWithNodes(editorState, root, anchorNode, anchorOffset, focusNode, focusOffset) {
  var anchorIsTextNode = anchorNode.nodeType === Node.TEXT_NODE;
  var focusIsTextNode = focusNode.nodeType === Node.TEXT_NODE; // If the selection range lies only on text nodes, the task is simple.
  // Find the nearest offset-aware elements and use the
  // offset values supplied by the selection range.

  if (anchorIsTextNode && focusIsTextNode) {
    return {
      selectionState: getUpdatedSelectionState(editorState, nullthrows(findAncestorOffsetKey(anchorNode)), anchorOffset, nullthrows(findAncestorOffsetKey(focusNode)), focusOffset),
      needsRecovery: false
    };
  }

  var anchorPoint = null;
  var focusPoint = null;
  var needsRecovery = true; // An element is selected. Convert this selection range into leaf offset
  // keys and offset values for consumption at the component level. This
  // is common in Firefox, where select-all and triple click behavior leads
  // to entire elements being selected.
  //
  // Note that we use the `needsRecovery` parameter in the callback here. This
  // is because when certain elements are selected, the behavior for subsequent
  // cursor movement (e.g. via arrow keys) is uncertain and may not match
  // expectations at the component level. For example, if an entire <div> is
  // selected and the user presses the right arrow, Firefox keeps the selection
  // on the <div>. If we allow subsequent keypresses to insert characters
  // natively, they will be inserted into a browser-created text node to the
  // right of that <div>. This is obviously undesirable.
  //
  // With the `needsRecovery` flag, we inform the caller that it is responsible
  // for manually setting the selection state on the rendered document to
  // ensure proper selection state maintenance.

  if (anchorIsTextNode) {
    anchorPoint = {
      key: nullthrows(findAncestorOffsetKey(anchorNode)),
      offset: anchorOffset
    };
    focusPoint = getPointForNonTextNode(root, focusNode, focusOffset);
  } else if (focusIsTextNode) {
    focusPoint = {
      key: nullthrows(findAncestorOffsetKey(focusNode)),
      offset: focusOffset
    };
    anchorPoint = getPointForNonTextNode(root, anchorNode, anchorOffset);
  } else {
    anchorPoint = getPointForNonTextNode(root, anchorNode, anchorOffset);
    focusPoint = getPointForNonTextNode(root, focusNode, focusOffset); // If the selection is collapsed on an empty block, don't force recovery.
    // This way, on arrow key selection changes, the browser can move the
    // cursor from a non-zero offset on one block, through empty blocks,
    // to a matching non-zero offset on other text blocks.

    if (anchorNode === focusNode && anchorOffset === focusOffset) {
      needsRecovery = !!anchorNode.firstChild && anchorNode.firstChild.nodeName !== 'BR';
    }
  }

  return {
    selectionState: getUpdatedSelectionState(editorState, anchorPoint.key, anchorPoint.offset, focusPoint.key, focusPoint.offset),
    needsRecovery: needsRecovery
  };
}
/**
 * Identify the first leaf descendant for the given node.
 */


function getFirstLeaf(node) {
  while (node.firstChild && ( // data-blocks has no offset
  isElement(node.firstChild) && node.firstChild.getAttribute('data-blocks') === 'true' || getSelectionOffsetKeyForNode(node.firstChild))) {
    node = node.firstChild;
  }

  return node;
}
/**
 * Identify the last leaf descendant for the given node.
 */


function getLastLeaf(node) {
  while (node.lastChild && ( // data-blocks has no offset
  isElement(node.lastChild) && node.lastChild.getAttribute('data-blocks') === 'true' || getSelectionOffsetKeyForNode(node.lastChild))) {
    node = node.lastChild;
  }

  return node;
}

function getPointForNonTextNode(editorRoot, startNode, childOffset) {
  var node = startNode;
  var offsetKey = findAncestorOffsetKey(node);
  !(offsetKey != null || editorRoot && (editorRoot === node || editorRoot.firstChild === node)) ?  true ? invariant(false, 'Unknown node in selection range.') : 0 : void 0; // If the editorRoot is the selection, step downward into the content
  // wrapper.

  if (editorRoot === node) {
    node = node.firstChild;
    !isElement(node) ?  true ? invariant(false, 'Invalid DraftEditorContents node.') : 0 : void 0;
    var castedNode = node; // assignment only added for flow :/
    // otherwise it throws in line 200 saying that node can be null or undefined

    node = castedNode;
    !(node.getAttribute('data-contents') === 'true') ?  true ? invariant(false, 'Invalid DraftEditorContents structure.') : 0 : void 0;

    if (childOffset > 0) {
      childOffset = node.childNodes.length;
    }
  } // If the child offset is zero and we have an offset key, we're done.
  // If there's no offset key because the entire editor is selected,
  // find the leftmost ("first") leaf in the tree and use that as the offset
  // key.


  if (childOffset === 0) {
    var key = null;

    if (offsetKey != null) {
      key = offsetKey;
    } else {
      var firstLeaf = getFirstLeaf(node);
      key = nullthrows(getSelectionOffsetKeyForNode(firstLeaf));
    }

    return {
      key: key,
      offset: 0
    };
  }

  var nodeBeforeCursor = node.childNodes[childOffset - 1];
  var leafKey = null;
  var textLength = null;

  if (!getSelectionOffsetKeyForNode(nodeBeforeCursor)) {
    // Our target node may be a leaf or a text node, in which case we're
    // already where we want to be and can just use the child's length as
    // our offset.
    leafKey = nullthrows(offsetKey);
    textLength = getTextContentLength(nodeBeforeCursor);
  } else {
    // Otherwise, we'll look at the child to the left of the cursor and find
    // the last leaf node in its subtree.
    var lastLeaf = getLastLeaf(nodeBeforeCursor);
    leafKey = nullthrows(getSelectionOffsetKeyForNode(lastLeaf));
    textLength = getTextContentLength(lastLeaf);
  }

  return {
    key: leafKey,
    offset: textLength
  };
}
/**
 * Return the length of a node's textContent, regarding single newline
 * characters as zero-length. This allows us to avoid problems with identifying
 * the correct selection offset for empty blocks in IE, in which we
 * render newlines instead of break tags.
 */


function getTextContentLength(node) {
  var textContent = node.textContent;
  return textContent === '\n' ? 0 : textContent.length;
}

module.exports = getDraftEditorSelectionWithNodes;

/***/ }),

/***/ "./node_modules/draft-js/lib/getEntityKeyForSelection.js":
/*!***************************************************************!*\
  !*** ./node_modules/draft-js/lib/getEntityKeyForSelection.js ***!
  \***************************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";
/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @format
 * 
 * @emails oncall+draft_js
 */


var _require = __webpack_require__(/*! ./draftKeyUtils */ "./node_modules/draft-js/lib/draftKeyUtils.js"),
    notEmptyKey = _require.notEmptyKey;
/**
 * Return the entity key that should be used when inserting text for the
 * specified target selection, only if the entity is `MUTABLE`. `IMMUTABLE`
 * and `SEGMENTED` entities should not be used for insertion behavior.
 */


function getEntityKeyForSelection(contentState, targetSelection) {
  var entityKey;

  if (targetSelection.isCollapsed()) {
    var key = targetSelection.getAnchorKey();
    var offset = targetSelection.getAnchorOffset();

    if (offset > 0) {
      entityKey = contentState.getBlockForKey(key).getEntityAt(offset - 1);

      if (entityKey !== contentState.getBlockForKey(key).getEntityAt(offset)) {
        return null;
      }

      return filterKey(contentState.getEntityMap(), entityKey);
    }

    return null;
  }

  var startKey = targetSelection.getStartKey();
  var startOffset = targetSelection.getStartOffset();
  var startBlock = contentState.getBlockForKey(startKey);
  entityKey = startOffset === startBlock.getLength() ? null : startBlock.getEntityAt(startOffset);
  return filterKey(contentState.getEntityMap(), entityKey);
}
/**
 * Determine whether an entity key corresponds to a `MUTABLE` entity. If so,
 * return it. If not, return null.
 */


function filterKey(entityMap, entityKey) {
  if (notEmptyKey(entityKey)) {
    var entity = entityMap.__get(entityKey);

    return entity.getMutability() === 'MUTABLE' ? entityKey : null;
  }

  return null;
}

module.exports = getEntityKeyForSelection;

/***/ }),

/***/ "./node_modules/draft-js/lib/getFragmentFromSelection.js":
/*!***************************************************************!*\
  !*** ./node_modules/draft-js/lib/getFragmentFromSelection.js ***!
  \***************************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";
/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @format
 * 
 * @emails oncall+draft_js
 */


var getContentStateFragment = __webpack_require__(/*! ./getContentStateFragment */ "./node_modules/draft-js/lib/getContentStateFragment.js");

function getFragmentFromSelection(editorState) {
  var selectionState = editorState.getSelection();

  if (selectionState.isCollapsed()) {
    return null;
  }

  return getContentStateFragment(editorState.getCurrentContent(), selectionState);
}

module.exports = getFragmentFromSelection;

/***/ }),

/***/ "./node_modules/draft-js/lib/getNextDelimiterBlockKey.js":
/*!***************************************************************!*\
  !*** ./node_modules/draft-js/lib/getNextDelimiterBlockKey.js ***!
  \***************************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";


/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @format
 * 
 * @emails oncall+draft_js
 *
 * This is unstable and not part of the public API and should not be used by
 * production systems. This file may be update/removed without notice.
 */
var ContentBlockNode = __webpack_require__(/*! ./ContentBlockNode */ "./node_modules/draft-js/lib/ContentBlockNode.js");

var getNextDelimiterBlockKey = function getNextDelimiterBlockKey(block, blockMap) {
  var isExperimentalTreeBlock = block instanceof ContentBlockNode;

  if (!isExperimentalTreeBlock) {
    return null;
  }

  var nextSiblingKey = block.getNextSiblingKey();

  if (nextSiblingKey) {
    return nextSiblingKey;
  }

  var parent = block.getParentKey();

  if (!parent) {
    return null;
  }

  var nextNonDescendantBlock = blockMap.get(parent);

  while (nextNonDescendantBlock && !nextNonDescendantBlock.getNextSiblingKey()) {
    var parentKey = nextNonDescendantBlock.getParentKey();
    nextNonDescendantBlock = parentKey ? blockMap.get(parentKey) : null;
  }

  if (!nextNonDescendantBlock) {
    return null;
  }

  return nextNonDescendantBlock.getNextSiblingKey();
};

module.exports = getNextDelimiterBlockKey;

/***/ }),

/***/ "./node_modules/draft-js/lib/getOwnObjectValues.js":
/*!*********************************************************!*\
  !*** ./node_modules/draft-js/lib/getOwnObjectValues.js ***!
  \*********************************************************/
/***/ ((module) => {

"use strict";


/**
 * Copyright 2004-present Facebook. All Rights Reserved.
 *
 * 
 * @typechecks
 * @format
 */

/**
 * Retrieve an object's own values as an array. If you want the values in the
 * protoype chain, too, use getObjectValuesIncludingPrototype.
 *
 * If you are looking for a function that creates an Array instance based
 * on an "Array-like" object, use createArrayFrom instead.
 *
 * @param {object} obj An object.
 * @return {array}     The object's values.
 */
function getOwnObjectValues(obj) {
  return Object.keys(obj).map(function (key) {
    return obj[key];
  });
}

module.exports = getOwnObjectValues;

/***/ }),

/***/ "./node_modules/draft-js/lib/getRangeBoundingClientRect.js":
/*!*****************************************************************!*\
  !*** ./node_modules/draft-js/lib/getRangeBoundingClientRect.js ***!
  \*****************************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";
/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @format
 * 
 * @emails oncall+draft_js
 */


var getRangeClientRects = __webpack_require__(/*! ./getRangeClientRects */ "./node_modules/draft-js/lib/getRangeClientRects.js");

/**
 * Like range.getBoundingClientRect() but normalizes for browser bugs.
 */
function getRangeBoundingClientRect(range) {
  // "Return a DOMRect object describing the smallest rectangle that includes
  // the first rectangle in list and all of the remaining rectangles of which
  // the height or width is not zero."
  // http://www.w3.org/TR/cssom-view/#dom-range-getboundingclientrect
  var rects = getRangeClientRects(range);
  var top = 0;
  var right = 0;
  var bottom = 0;
  var left = 0;

  if (rects.length) {
    // If the first rectangle has 0 width, we use the second, this is needed
    // because Chrome renders a 0 width rectangle when the selection contains
    // a line break.
    if (rects.length > 1 && rects[0].width === 0) {
      var _rects$ = rects[1];
      top = _rects$.top;
      right = _rects$.right;
      bottom = _rects$.bottom;
      left = _rects$.left;
    } else {
      var _rects$2 = rects[0];
      top = _rects$2.top;
      right = _rects$2.right;
      bottom = _rects$2.bottom;
      left = _rects$2.left;
    }

    for (var ii = 1; ii < rects.length; ii++) {
      var rect = rects[ii];

      if (rect.height !== 0 && rect.width !== 0) {
        top = Math.min(top, rect.top);
        right = Math.max(right, rect.right);
        bottom = Math.max(bottom, rect.bottom);
        left = Math.min(left, rect.left);
      }
    }
  }

  return {
    top: top,
    right: right,
    bottom: bottom,
    left: left,
    width: right - left,
    height: bottom - top
  };
}

module.exports = getRangeBoundingClientRect;

/***/ }),

/***/ "./node_modules/draft-js/lib/getRangeClientRects.js":
/*!**********************************************************!*\
  !*** ./node_modules/draft-js/lib/getRangeClientRects.js ***!
  \**********************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";
/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @format
 * 
 * @emails oncall+draft_js
 */


var UserAgent = __webpack_require__(/*! fbjs/lib/UserAgent */ "./node_modules/fbjs/lib/UserAgent.js");

var invariant = __webpack_require__(/*! fbjs/lib/invariant */ "./node_modules/fbjs/lib/invariant.js");

var isChrome = UserAgent.isBrowser('Chrome'); // In Chrome, the client rects will include the entire bounds of all nodes that
// begin (have a start tag) within the selection, even if the selection does
// not overlap the entire node. To resolve this, we split the range at each
// start tag and join the client rects together.
// https://code.google.com/p/chromium/issues/detail?id=324437

/* eslint-disable consistent-return */

function getRangeClientRectsChrome(range) {
  var tempRange = range.cloneRange();
  var clientRects = [];

  for (var ancestor = range.endContainer; ancestor != null; ancestor = ancestor.parentNode) {
    // If we've climbed up to the common ancestor, we can now use the
    // original start point and stop climbing the tree.
    var atCommonAncestor = ancestor === range.commonAncestorContainer;

    if (atCommonAncestor) {
      tempRange.setStart(range.startContainer, range.startOffset);
    } else {
      tempRange.setStart(tempRange.endContainer, 0);
    }

    var rects = Array.from(tempRange.getClientRects());
    clientRects.push(rects);

    if (atCommonAncestor) {
      var _ref;

      clientRects.reverse();
      return (_ref = []).concat.apply(_ref, clientRects);
    }

    tempRange.setEndBefore(ancestor);
  }

   true ?  true ? invariant(false, 'Found an unexpected detached subtree when getting range client rects.') : 0 : 0;
}
/* eslint-enable consistent-return */

/**
 * Like range.getClientRects() but normalizes for browser bugs.
 */


var getRangeClientRects = isChrome ? getRangeClientRectsChrome : function (range) {
  return Array.from(range.getClientRects());
};
module.exports = getRangeClientRects;

/***/ }),

/***/ "./node_modules/draft-js/lib/getRangesForDraftEntity.js":
/*!**************************************************************!*\
  !*** ./node_modules/draft-js/lib/getRangesForDraftEntity.js ***!
  \**************************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";
/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @format
 * 
 * @emails oncall+draft_js
 */


var invariant = __webpack_require__(/*! fbjs/lib/invariant */ "./node_modules/fbjs/lib/invariant.js");
/**
 * Obtain the start and end positions of the range that has the
 * specified entity applied to it.
 *
 * Entity keys are applied only to contiguous stretches of text, so this
 * method searches for the first instance of the entity key and returns
 * the subsequent range.
 */


function getRangesForDraftEntity(block, key) {
  var ranges = [];
  block.findEntityRanges(function (c) {
    return c.getEntity() === key;
  }, function (start, end) {
    ranges.push({
      start: start,
      end: end
    });
  });
  !!!ranges.length ?  true ? invariant(false, 'Entity key not found in this range.') : 0 : void 0;
  return ranges;
}

module.exports = getRangesForDraftEntity;

/***/ }),

/***/ "./node_modules/draft-js/lib/getSafeBodyFromHTML.js":
/*!**********************************************************!*\
  !*** ./node_modules/draft-js/lib/getSafeBodyFromHTML.js ***!
  \**********************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";
/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @format
 * 
 * @emails oncall+draft_js
 */


var UserAgent = __webpack_require__(/*! fbjs/lib/UserAgent */ "./node_modules/fbjs/lib/UserAgent.js");

var invariant = __webpack_require__(/*! fbjs/lib/invariant */ "./node_modules/fbjs/lib/invariant.js");

var isOldIE = UserAgent.isBrowser('IE <= 9'); // Provides a dom node that will not execute scripts
// https://developer.mozilla.org/en-US/docs/Web/API/DOMImplementation.createHTMLDocument
// https://developer.mozilla.org/en-US/Add-ons/Code_snippets/HTML_to_DOM

function getSafeBodyFromHTML(html) {
  var doc;
  var root = null; // Provides a safe context

  if (!isOldIE && document.implementation && document.implementation.createHTMLDocument) {
    doc = document.implementation.createHTMLDocument('foo');
    !doc.documentElement ?  true ? invariant(false, 'Missing doc.documentElement') : 0 : void 0;
    doc.documentElement.innerHTML = html;
    root = doc.getElementsByTagName('body')[0];
  }

  return root;
}

module.exports = getSafeBodyFromHTML;

/***/ }),

/***/ "./node_modules/draft-js/lib/getSelectionOffsetKeyForNode.js":
/*!*******************************************************************!*\
  !*** ./node_modules/draft-js/lib/getSelectionOffsetKeyForNode.js ***!
  \*******************************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";
/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @format
 * 
 * @emails oncall+draft_js
 */

/**
 * Get offset key from a node or it's child nodes. Return the first offset key
 * found on the DOM tree of given node.
 */

var isElement = __webpack_require__(/*! ./isElement */ "./node_modules/draft-js/lib/isElement.js");

function getSelectionOffsetKeyForNode(node) {
  if (isElement(node)) {
    var castedNode = node;
    var offsetKey = castedNode.getAttribute('data-offset-key');

    if (offsetKey) {
      return offsetKey;
    }

    for (var ii = 0; ii < castedNode.childNodes.length; ii++) {
      var childOffsetKey = getSelectionOffsetKeyForNode(castedNode.childNodes[ii]);

      if (childOffsetKey) {
        return childOffsetKey;
      }
    }
  }

  return null;
}

module.exports = getSelectionOffsetKeyForNode;

/***/ }),

/***/ "./node_modules/draft-js/lib/getTextContentFromFiles.js":
/*!**************************************************************!*\
  !*** ./node_modules/draft-js/lib/getTextContentFromFiles.js ***!
  \**************************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";
/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @format
 * 
 * @emails oncall+draft_js
 */


var invariant = __webpack_require__(/*! fbjs/lib/invariant */ "./node_modules/fbjs/lib/invariant.js");

var TEXT_CLIPPING_REGEX = /\.textClipping$/;
var TEXT_TYPES = {
  'text/plain': true,
  'text/html': true,
  'text/rtf': true
}; // Somewhat arbitrary upper bound on text size. Let's not lock up the browser.

var TEXT_SIZE_UPPER_BOUND = 5000;
/**
 * Extract the text content from a file list.
 */

function getTextContentFromFiles(files, callback) {
  var readCount = 0;
  var results = [];
  files.forEach(function (
  /*blob*/
  file) {
    readFile(file, function (
    /*string*/
    text) {
      readCount++;
      text && results.push(text.slice(0, TEXT_SIZE_UPPER_BOUND));

      if (readCount == files.length) {
        callback(results.join('\r'));
      }
    });
  });
}
/**
 * todo isaac: Do work to turn html/rtf into a content fragment.
 */


function readFile(file, callback) {
  if (!__webpack_require__.g.FileReader || file.type && !(file.type in TEXT_TYPES)) {
    callback('');
    return;
  }

  if (file.type === '') {
    var _contents = ''; // Special-case text clippings, which have an empty type but include
    // `.textClipping` in the file name. `readAsText` results in an empty
    // string for text clippings, so we force the file name to serve
    // as the text value for the file.

    if (TEXT_CLIPPING_REGEX.test(file.name)) {
      _contents = file.name.replace(TEXT_CLIPPING_REGEX, '');
    }

    callback(_contents);
    return;
  }

  var reader = new FileReader();

  reader.onload = function () {
    var result = reader.result;
    !(typeof result === 'string') ?  true ? invariant(false, 'We should be calling "FileReader.readAsText" which returns a string') : 0 : void 0;
    callback(result);
  };

  reader.onerror = function () {
    callback('');
  };

  reader.readAsText(file);
}

module.exports = getTextContentFromFiles;

/***/ }),

/***/ "./node_modules/draft-js/lib/getUpdatedSelectionState.js":
/*!***************************************************************!*\
  !*** ./node_modules/draft-js/lib/getUpdatedSelectionState.js ***!
  \***************************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";
/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @format
 * 
 * @emails oncall+draft_js
 */


var DraftOffsetKey = __webpack_require__(/*! ./DraftOffsetKey */ "./node_modules/draft-js/lib/DraftOffsetKey.js");

var nullthrows = __webpack_require__(/*! fbjs/lib/nullthrows */ "./node_modules/fbjs/lib/nullthrows.js");

function getUpdatedSelectionState(editorState, anchorKey, anchorOffset, focusKey, focusOffset) {
  var selection = nullthrows(editorState.getSelection());

  if (!anchorKey || !focusKey) {
    // If we cannot make sense of the updated selection state, stick to the current one.
    if (true) {
      /* eslint-disable-next-line */
      console.warn('Invalid selection state.', arguments, editorState.toJS());
    }

    return selection;
  }

  var anchorPath = DraftOffsetKey.decode(anchorKey);
  var anchorBlockKey = anchorPath.blockKey;
  var anchorLeafBlockTree = editorState.getBlockTree(anchorBlockKey);
  var anchorLeaf = anchorLeafBlockTree && anchorLeafBlockTree.getIn([anchorPath.decoratorKey, 'leaves', anchorPath.leafKey]);
  var focusPath = DraftOffsetKey.decode(focusKey);
  var focusBlockKey = focusPath.blockKey;
  var focusLeafBlockTree = editorState.getBlockTree(focusBlockKey);
  var focusLeaf = focusLeafBlockTree && focusLeafBlockTree.getIn([focusPath.decoratorKey, 'leaves', focusPath.leafKey]);

  if (!anchorLeaf || !focusLeaf) {
    // If we cannot make sense of the updated selection state, stick to the current one.
    if (true) {
      /* eslint-disable-next-line */
      console.warn('Invalid selection state.', arguments, editorState.toJS());
    }

    return selection;
  }

  var anchorLeafStart = anchorLeaf.get('start');
  var focusLeafStart = focusLeaf.get('start');
  var anchorBlockOffset = anchorLeaf ? anchorLeafStart + anchorOffset : null;
  var focusBlockOffset = focusLeaf ? focusLeafStart + focusOffset : null;
  var areEqual = selection.getAnchorKey() === anchorBlockKey && selection.getAnchorOffset() === anchorBlockOffset && selection.getFocusKey() === focusBlockKey && selection.getFocusOffset() === focusBlockOffset;

  if (areEqual) {
    return selection;
  }

  var isBackward = false;

  if (anchorBlockKey === focusBlockKey) {
    var anchorLeafEnd = anchorLeaf.get('end');
    var focusLeafEnd = focusLeaf.get('end');

    if (focusLeafStart === anchorLeafStart && focusLeafEnd === anchorLeafEnd) {
      isBackward = focusOffset < anchorOffset;
    } else {
      isBackward = focusLeafStart < anchorLeafStart;
    }
  } else {
    var startKey = editorState.getCurrentContent().getBlockMap().keySeq().skipUntil(function (v) {
      return v === anchorBlockKey || v === focusBlockKey;
    }).first();
    isBackward = startKey === focusBlockKey;
  }

  return selection.merge({
    anchorKey: anchorBlockKey,
    anchorOffset: anchorBlockOffset,
    focusKey: focusBlockKey,
    focusOffset: focusBlockOffset,
    isBackward: isBackward
  });
}

module.exports = getUpdatedSelectionState;

/***/ }),

/***/ "./node_modules/draft-js/lib/getVisibleSelectionRect.js":
/*!**************************************************************!*\
  !*** ./node_modules/draft-js/lib/getVisibleSelectionRect.js ***!
  \**************************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";
/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @format
 * 
 * @emails oncall+draft_js
 */


var getRangeBoundingClientRect = __webpack_require__(/*! ./getRangeBoundingClientRect */ "./node_modules/draft-js/lib/getRangeBoundingClientRect.js");
/**
 * Return the bounding ClientRect for the visible DOM selection, if any.
 * In cases where there are no selected ranges or the bounding rect is
 * temporarily invalid, return null.
 *
 * When using from an iframe, you should pass the iframe window object
 */


function getVisibleSelectionRect(global) {
  var selection = global.getSelection();

  if (!selection.rangeCount) {
    return null;
  }

  var range = selection.getRangeAt(0);
  var boundingRect = getRangeBoundingClientRect(range);
  var top = boundingRect.top,
      right = boundingRect.right,
      bottom = boundingRect.bottom,
      left = boundingRect.left; // When a re-render leads to a node being removed, the DOM selection will
  // temporarily be placed on an ancestor node, which leads to an invalid
  // bounding rect. Discard this state.

  if (top === 0 && right === 0 && bottom === 0 && left === 0) {
    return null;
  }

  return boundingRect;
}

module.exports = getVisibleSelectionRect;

/***/ }),

/***/ "./node_modules/draft-js/lib/getWindowForNode.js":
/*!*******************************************************!*\
  !*** ./node_modules/draft-js/lib/getWindowForNode.js ***!
  \*******************************************************/
/***/ ((module) => {

"use strict";


/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @format
 * 
 * @emails oncall+draft_js
 */
function getWindowForNode(node) {
  if (!node || !node.ownerDocument || !node.ownerDocument.defaultView) {
    return window;
  }

  return node.ownerDocument.defaultView;
}

module.exports = getWindowForNode;

/***/ }),

/***/ "./node_modules/draft-js/lib/gkx.js":
/*!******************************************!*\
  !*** ./node_modules/draft-js/lib/gkx.js ***!
  \******************************************/
/***/ ((module) => {

"use strict";
/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @format
 * 
 */


module.exports = function (name) {
  if (typeof window !== 'undefined' && window.__DRAFT_GKX) {
    return !!window.__DRAFT_GKX[name];
  }

  return false;
};

/***/ }),

/***/ "./node_modules/draft-js/lib/insertFragmentIntoContentState.js":
/*!*********************************************************************!*\
  !*** ./node_modules/draft-js/lib/insertFragmentIntoContentState.js ***!
  \*********************************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";
/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @format
 * 
 * @emails oncall+draft_js
 */


var BlockMapBuilder = __webpack_require__(/*! ./BlockMapBuilder */ "./node_modules/draft-js/lib/BlockMapBuilder.js");

var ContentBlockNode = __webpack_require__(/*! ./ContentBlockNode */ "./node_modules/draft-js/lib/ContentBlockNode.js");

var Immutable = __webpack_require__(/*! immutable */ "./node_modules/draft-js/node_modules/immutable/dist/immutable.js");

var insertIntoList = __webpack_require__(/*! ./insertIntoList */ "./node_modules/draft-js/lib/insertIntoList.js");

var invariant = __webpack_require__(/*! fbjs/lib/invariant */ "./node_modules/fbjs/lib/invariant.js");

var randomizeBlockMapKeys = __webpack_require__(/*! ./randomizeBlockMapKeys */ "./node_modules/draft-js/lib/randomizeBlockMapKeys.js");

var List = Immutable.List;

var updateExistingBlock = function updateExistingBlock(contentState, selectionState, blockMap, fragmentBlock, targetKey, targetOffset) {
  var mergeBlockData = arguments.length > 6 && arguments[6] !== undefined ? arguments[6] : 'REPLACE_WITH_NEW_DATA';
  var targetBlock = blockMap.get(targetKey);
  var text = targetBlock.getText();
  var chars = targetBlock.getCharacterList();
  var finalKey = targetKey;
  var finalOffset = targetOffset + fragmentBlock.getText().length;
  var data = null;

  switch (mergeBlockData) {
    case 'MERGE_OLD_DATA_TO_NEW_DATA':
      data = fragmentBlock.getData().merge(targetBlock.getData());
      break;

    case 'REPLACE_WITH_NEW_DATA':
      data = fragmentBlock.getData();
      break;
  }

  var type = targetBlock.getType();

  if (text && type === 'unstyled') {
    type = fragmentBlock.getType();
  }

  var newBlock = targetBlock.merge({
    text: text.slice(0, targetOffset) + fragmentBlock.getText() + text.slice(targetOffset),
    characterList: insertIntoList(chars, fragmentBlock.getCharacterList(), targetOffset),
    type: type,
    data: data
  });
  return contentState.merge({
    blockMap: blockMap.set(targetKey, newBlock),
    selectionBefore: selectionState,
    selectionAfter: selectionState.merge({
      anchorKey: finalKey,
      anchorOffset: finalOffset,
      focusKey: finalKey,
      focusOffset: finalOffset,
      isBackward: false
    })
  });
};
/**
 * Appends text/characterList from the fragment first block to
 * target block.
 */


var updateHead = function updateHead(block, targetOffset, fragment) {
  var text = block.getText();
  var chars = block.getCharacterList(); // Modify head portion of block.

  var headText = text.slice(0, targetOffset);
  var headCharacters = chars.slice(0, targetOffset);
  var appendToHead = fragment.first();
  return block.merge({
    text: headText + appendToHead.getText(),
    characterList: headCharacters.concat(appendToHead.getCharacterList()),
    type: headText ? block.getType() : appendToHead.getType(),
    data: appendToHead.getData()
  });
};
/**
 * Appends offset text/characterList from the target block to the last
 * fragment block.
 */


var updateTail = function updateTail(block, targetOffset, fragment) {
  // Modify tail portion of block.
  var text = block.getText();
  var chars = block.getCharacterList(); // Modify head portion of block.

  var blockSize = text.length;
  var tailText = text.slice(targetOffset, blockSize);
  var tailCharacters = chars.slice(targetOffset, blockSize);
  var prependToTail = fragment.last();
  return prependToTail.merge({
    text: prependToTail.getText() + tailText,
    characterList: prependToTail.getCharacterList().concat(tailCharacters),
    data: prependToTail.getData()
  });
};

var getRootBlocks = function getRootBlocks(block, blockMap) {
  var headKey = block.getKey();
  var rootBlock = block;
  var rootBlocks = []; // sometimes the fragment head block will not be part of the blockMap itself this can happen when
  // the fragment head is used to update the target block, however when this does not happen we need
  // to make sure that we include it on the rootBlocks since the first block of a fragment is always a
  // fragment root block

  if (blockMap.get(headKey)) {
    rootBlocks.push(headKey);
  }

  while (rootBlock && rootBlock.getNextSiblingKey()) {
    var lastSiblingKey = rootBlock.getNextSiblingKey();

    if (!lastSiblingKey) {
      break;
    }

    rootBlocks.push(lastSiblingKey);
    rootBlock = blockMap.get(lastSiblingKey);
  }

  return rootBlocks;
};

var updateBlockMapLinks = function updateBlockMapLinks(blockMap, originalBlockMap, targetBlock, fragmentHeadBlock) {
  return blockMap.withMutations(function (blockMapState) {
    var targetKey = targetBlock.getKey();
    var headKey = fragmentHeadBlock.getKey();
    var targetNextKey = targetBlock.getNextSiblingKey();
    var targetParentKey = targetBlock.getParentKey();
    var fragmentRootBlocks = getRootBlocks(fragmentHeadBlock, blockMap);
    var lastRootFragmentBlockKey = fragmentRootBlocks[fragmentRootBlocks.length - 1];

    if (blockMapState.get(headKey)) {
      // update the fragment head when it is part of the blockMap otherwise
      blockMapState.setIn([targetKey, 'nextSibling'], headKey);
      blockMapState.setIn([headKey, 'prevSibling'], targetKey);
    } else {
      // update the target block that had the fragment head contents merged into it
      blockMapState.setIn([targetKey, 'nextSibling'], fragmentHeadBlock.getNextSiblingKey());
      blockMapState.setIn([fragmentHeadBlock.getNextSiblingKey(), 'prevSibling'], targetKey);
    } // update the last root block fragment


    blockMapState.setIn([lastRootFragmentBlockKey, 'nextSibling'], targetNextKey); // update the original target next block

    if (targetNextKey) {
      blockMapState.setIn([targetNextKey, 'prevSibling'], lastRootFragmentBlockKey);
    } // update fragment parent links


    fragmentRootBlocks.forEach(function (blockKey) {
      return blockMapState.setIn([blockKey, 'parent'], targetParentKey);
    }); // update targetBlock parent child links

    if (targetParentKey) {
      var targetParent = blockMap.get(targetParentKey);
      var originalTargetParentChildKeys = targetParent.getChildKeys();
      var targetBlockIndex = originalTargetParentChildKeys.indexOf(targetKey);
      var insertionIndex = targetBlockIndex + 1;
      var newChildrenKeysArray = originalTargetParentChildKeys.toArray(); // insert fragment children

      newChildrenKeysArray.splice.apply(newChildrenKeysArray, [insertionIndex, 0].concat(fragmentRootBlocks));
      blockMapState.setIn([targetParentKey, 'children'], List(newChildrenKeysArray));
    }
  });
};

var insertFragment = function insertFragment(contentState, selectionState, blockMap, fragment, targetKey, targetOffset) {
  var isTreeBasedBlockMap = blockMap.first() instanceof ContentBlockNode;
  var newBlockArr = [];
  var fragmentSize = fragment.size;
  var target = blockMap.get(targetKey);
  var head = fragment.first();
  var tail = fragment.last();
  var finalOffset = tail.getLength();
  var finalKey = tail.getKey();
  var shouldNotUpdateFromFragmentBlock = isTreeBasedBlockMap && (!target.getChildKeys().isEmpty() || !head.getChildKeys().isEmpty());
  blockMap.forEach(function (block, blockKey) {
    if (blockKey !== targetKey) {
      newBlockArr.push(block);
      return;
    }

    if (shouldNotUpdateFromFragmentBlock) {
      newBlockArr.push(block);
    } else {
      newBlockArr.push(updateHead(block, targetOffset, fragment));
    } // Insert fragment blocks after the head and before the tail.


    fragment // when we are updating the target block with the head fragment block we skip the first fragment
    // head since its contents have already been merged with the target block otherwise we include
    // the whole fragment
    .slice(shouldNotUpdateFromFragmentBlock ? 0 : 1, fragmentSize - 1).forEach(function (fragmentBlock) {
      return newBlockArr.push(fragmentBlock);
    }); // update tail

    newBlockArr.push(updateTail(block, targetOffset, fragment));
  });
  var updatedBlockMap = BlockMapBuilder.createFromArray(newBlockArr);

  if (isTreeBasedBlockMap) {
    updatedBlockMap = updateBlockMapLinks(updatedBlockMap, blockMap, target, head);
  }

  return contentState.merge({
    blockMap: updatedBlockMap,
    selectionBefore: selectionState,
    selectionAfter: selectionState.merge({
      anchorKey: finalKey,
      anchorOffset: finalOffset,
      focusKey: finalKey,
      focusOffset: finalOffset,
      isBackward: false
    })
  });
};

var insertFragmentIntoContentState = function insertFragmentIntoContentState(contentState, selectionState, fragmentBlockMap) {
  var mergeBlockData = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : 'REPLACE_WITH_NEW_DATA';
  !selectionState.isCollapsed() ?  true ? invariant(false, '`insertFragment` should only be called with a collapsed selection state.') : 0 : void 0;
  var blockMap = contentState.getBlockMap();
  var fragment = randomizeBlockMapKeys(fragmentBlockMap);
  var targetKey = selectionState.getStartKey();
  var targetOffset = selectionState.getStartOffset();
  var targetBlock = blockMap.get(targetKey);

  if (targetBlock instanceof ContentBlockNode) {
    !targetBlock.getChildKeys().isEmpty() ?  true ? invariant(false, '`insertFragment` should not be called when a container node is selected.') : 0 : void 0;
  } // When we insert a fragment with a single block we simply update the target block
  // with the contents of the inserted fragment block


  if (fragment.size === 1) {
    return updateExistingBlock(contentState, selectionState, blockMap, fragment.first(), targetKey, targetOffset, mergeBlockData);
  }

  return insertFragment(contentState, selectionState, blockMap, fragment, targetKey, targetOffset);
};

module.exports = insertFragmentIntoContentState;

/***/ }),

/***/ "./node_modules/draft-js/lib/insertIntoList.js":
/*!*****************************************************!*\
  !*** ./node_modules/draft-js/lib/insertIntoList.js ***!
  \*****************************************************/
/***/ ((module) => {

"use strict";
/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @format
 * 
 * @emails oncall+draft_js
 */


/**
 * Maintain persistence for target list when appending and prepending.
 */
function insertIntoList(targetListArg, toInsert, offset) {
  var targetList = targetListArg;

  if (offset === targetList.count()) {
    toInsert.forEach(function (c) {
      targetList = targetList.push(c);
    });
  } else if (offset === 0) {
    toInsert.reverse().forEach(function (c) {
      targetList = targetList.unshift(c);
    });
  } else {
    var head = targetList.slice(0, offset);
    var tail = targetList.slice(offset);
    targetList = head.concat(toInsert, tail).toList();
  }

  return targetList;
}

module.exports = insertIntoList;

/***/ }),

/***/ "./node_modules/draft-js/lib/insertTextIntoContentState.js":
/*!*****************************************************************!*\
  !*** ./node_modules/draft-js/lib/insertTextIntoContentState.js ***!
  \*****************************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";
/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @format
 * 
 * @emails oncall+draft_js
 */


var Immutable = __webpack_require__(/*! immutable */ "./node_modules/draft-js/node_modules/immutable/dist/immutable.js");

var insertIntoList = __webpack_require__(/*! ./insertIntoList */ "./node_modules/draft-js/lib/insertIntoList.js");

var invariant = __webpack_require__(/*! fbjs/lib/invariant */ "./node_modules/fbjs/lib/invariant.js");

var Repeat = Immutable.Repeat;

function insertTextIntoContentState(contentState, selectionState, text, characterMetadata) {
  !selectionState.isCollapsed() ?  true ? invariant(false, '`insertText` should only be called with a collapsed range.') : 0 : void 0;
  var len = null;

  if (text != null) {
    len = text.length;
  }

  if (len == null || len === 0) {
    return contentState;
  }

  var blockMap = contentState.getBlockMap();
  var key = selectionState.getStartKey();
  var offset = selectionState.getStartOffset();
  var block = blockMap.get(key);
  var blockText = block.getText();
  var newBlock = block.merge({
    text: blockText.slice(0, offset) + text + blockText.slice(offset, block.getLength()),
    characterList: insertIntoList(block.getCharacterList(), Repeat(characterMetadata, len).toList(), offset)
  });
  var newOffset = offset + len;
  return contentState.merge({
    blockMap: blockMap.set(key, newBlock),
    selectionAfter: selectionState.merge({
      anchorOffset: newOffset,
      focusOffset: newOffset
    })
  });
}

module.exports = insertTextIntoContentState;

/***/ }),

/***/ "./node_modules/draft-js/lib/isElement.js":
/*!************************************************!*\
  !*** ./node_modules/draft-js/lib/isElement.js ***!
  \************************************************/
/***/ ((module) => {

"use strict";


/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @format
 * 
 * @emails oncall+draft_js
 */
function isElement(node) {
  if (!node || !node.ownerDocument) {
    return false;
  }

  return node.nodeType === Node.ELEMENT_NODE;
}

module.exports = isElement;

/***/ }),

/***/ "./node_modules/draft-js/lib/isEventHandled.js":
/*!*****************************************************!*\
  !*** ./node_modules/draft-js/lib/isEventHandled.js ***!
  \*****************************************************/
/***/ ((module) => {

"use strict";
/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @format
 * 
 * @emails oncall+draft_js
 */


/**
 * Utility method for determining whether or not the value returned
 * from a handler indicates that it was handled.
 */
function isEventHandled(value) {
  return value === 'handled' || value === true;
}

module.exports = isEventHandled;

/***/ }),

/***/ "./node_modules/draft-js/lib/isHTMLAnchorElement.js":
/*!**********************************************************!*\
  !*** ./node_modules/draft-js/lib/isHTMLAnchorElement.js ***!
  \**********************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";


/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @format
 * 
 * @emails oncall+draft_js
 */
var isElement = __webpack_require__(/*! ./isElement */ "./node_modules/draft-js/lib/isElement.js");

function isHTMLAnchorElement(node) {
  if (!node || !node.ownerDocument) {
    return false;
  }

  return isElement(node) && node.nodeName === 'A';
}

module.exports = isHTMLAnchorElement;

/***/ }),

/***/ "./node_modules/draft-js/lib/isHTMLBRElement.js":
/*!******************************************************!*\
  !*** ./node_modules/draft-js/lib/isHTMLBRElement.js ***!
  \******************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";


/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @format
 * 
 * @emails oncall+draft_js
 */
var isElement = __webpack_require__(/*! ./isElement */ "./node_modules/draft-js/lib/isElement.js");

function isHTMLBRElement(node) {
  if (!node || !node.ownerDocument) {
    return false;
  }

  return isElement(node) && node.nodeName === 'BR';
}

module.exports = isHTMLBRElement;

/***/ }),

/***/ "./node_modules/draft-js/lib/isHTMLElement.js":
/*!****************************************************!*\
  !*** ./node_modules/draft-js/lib/isHTMLElement.js ***!
  \****************************************************/
/***/ ((module) => {

"use strict";


/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @format
 * 
 * @emails oncall+draft_js
 */
function isHTMLElement(node) {
  if (!node || !node.ownerDocument) {
    return false;
  }

  if (!node.ownerDocument.defaultView) {
    return node instanceof HTMLElement;
  }

  if (node instanceof node.ownerDocument.defaultView.HTMLElement) {
    return true;
  }

  return false;
}

module.exports = isHTMLElement;

/***/ }),

/***/ "./node_modules/draft-js/lib/isHTMLImageElement.js":
/*!*********************************************************!*\
  !*** ./node_modules/draft-js/lib/isHTMLImageElement.js ***!
  \*********************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";


/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @format
 * 
 * @emails oncall+draft_js
 */
var isElement = __webpack_require__(/*! ./isElement */ "./node_modules/draft-js/lib/isElement.js");

function isHTMLImageElement(node) {
  if (!node || !node.ownerDocument) {
    return false;
  }

  return isElement(node) && node.nodeName === 'IMG';
}

module.exports = isHTMLImageElement;

/***/ }),

/***/ "./node_modules/draft-js/lib/isInstanceOfNode.js":
/*!*******************************************************!*\
  !*** ./node_modules/draft-js/lib/isInstanceOfNode.js ***!
  \*******************************************************/
/***/ ((module) => {

"use strict";


/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @format
 * 
 * @emails oncall+draft_js
 */
function isInstanceOfNode(target) {
  // we changed the name because of having duplicate module provider (fbjs)
  if (!target || !('ownerDocument' in target)) {
    return false;
  }

  if ('ownerDocument' in target) {
    var node = target;

    if (!node.ownerDocument.defaultView) {
      return node instanceof Node;
    }

    if (node instanceof node.ownerDocument.defaultView.Node) {
      return true;
    }
  }

  return false;
}

module.exports = isInstanceOfNode;

/***/ }),

/***/ "./node_modules/draft-js/lib/isSelectionAtLeafStart.js":
/*!*************************************************************!*\
  !*** ./node_modules/draft-js/lib/isSelectionAtLeafStart.js ***!
  \*************************************************************/
/***/ ((module) => {

"use strict";
/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @format
 * 
 * @emails oncall+draft_js
 */


function isSelectionAtLeafStart(editorState) {
  var selection = editorState.getSelection();
  var anchorKey = selection.getAnchorKey();
  var blockTree = editorState.getBlockTree(anchorKey);
  var offset = selection.getStartOffset();
  var isAtStart = false;
  blockTree.some(function (leafSet) {
    if (offset === leafSet.get('start')) {
      isAtStart = true;
      return true;
    }

    if (offset < leafSet.get('end')) {
      return leafSet.get('leaves').some(function (leaf) {
        var leafStart = leaf.get('start');

        if (offset === leafStart) {
          isAtStart = true;
          return true;
        }

        return false;
      });
    }

    return false;
  });
  return isAtStart;
}

module.exports = isSelectionAtLeafStart;

/***/ }),

/***/ "./node_modules/draft-js/lib/isSoftNewlineEvent.js":
/*!*********************************************************!*\
  !*** ./node_modules/draft-js/lib/isSoftNewlineEvent.js ***!
  \*********************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";
/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @format
 * 
 * @emails oncall+draft_js
 */


var Keys = __webpack_require__(/*! fbjs/lib/Keys */ "./node_modules/fbjs/lib/Keys.js");

function isSoftNewlineEvent(e) {
  return e.which === Keys.RETURN && (e.getModifierState('Shift') || e.getModifierState('Alt') || e.getModifierState('Control'));
}

module.exports = isSoftNewlineEvent;

/***/ }),

/***/ "./node_modules/draft-js/lib/keyCommandBackspaceToStartOfLine.js":
/*!***********************************************************************!*\
  !*** ./node_modules/draft-js/lib/keyCommandBackspaceToStartOfLine.js ***!
  \***********************************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";
/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @format
 * 
 * @emails oncall+draft_js
 */


var EditorState = __webpack_require__(/*! ./EditorState */ "./node_modules/draft-js/lib/EditorState.js");

var expandRangeToStartOfLine = __webpack_require__(/*! ./expandRangeToStartOfLine */ "./node_modules/draft-js/lib/expandRangeToStartOfLine.js");

var getDraftEditorSelectionWithNodes = __webpack_require__(/*! ./getDraftEditorSelectionWithNodes */ "./node_modules/draft-js/lib/getDraftEditorSelectionWithNodes.js");

var moveSelectionBackward = __webpack_require__(/*! ./moveSelectionBackward */ "./node_modules/draft-js/lib/moveSelectionBackward.js");

var removeTextWithStrategy = __webpack_require__(/*! ./removeTextWithStrategy */ "./node_modules/draft-js/lib/removeTextWithStrategy.js");

function keyCommandBackspaceToStartOfLine(editorState, e) {
  var afterRemoval = removeTextWithStrategy(editorState, function (strategyState) {
    var selection = strategyState.getSelection();

    if (selection.isCollapsed() && selection.getAnchorOffset() === 0) {
      return moveSelectionBackward(strategyState, 1);
    }

    var ownerDocument = e.currentTarget.ownerDocument;
    var domSelection = ownerDocument.defaultView.getSelection(); // getRangeAt can technically throw if there's no selection, but we know
    // there is one here because text editor has focus (the cursor is a
    // selection of length 0). Therefore, we don't need to wrap this in a
    // try-catch block.

    var range = domSelection.getRangeAt(0);
    range = expandRangeToStartOfLine(range);
    return getDraftEditorSelectionWithNodes(strategyState, null, range.endContainer, range.endOffset, range.startContainer, range.startOffset).selectionState;
  }, 'backward');

  if (afterRemoval === editorState.getCurrentContent()) {
    return editorState;
  }

  return EditorState.push(editorState, afterRemoval, 'remove-range');
}

module.exports = keyCommandBackspaceToStartOfLine;

/***/ }),

/***/ "./node_modules/draft-js/lib/keyCommandBackspaceWord.js":
/*!**************************************************************!*\
  !*** ./node_modules/draft-js/lib/keyCommandBackspaceWord.js ***!
  \**************************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";
/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @format
 * 
 * @emails oncall+draft_js
 */


var DraftRemovableWord = __webpack_require__(/*! ./DraftRemovableWord */ "./node_modules/draft-js/lib/DraftRemovableWord.js");

var EditorState = __webpack_require__(/*! ./EditorState */ "./node_modules/draft-js/lib/EditorState.js");

var moveSelectionBackward = __webpack_require__(/*! ./moveSelectionBackward */ "./node_modules/draft-js/lib/moveSelectionBackward.js");

var removeTextWithStrategy = __webpack_require__(/*! ./removeTextWithStrategy */ "./node_modules/draft-js/lib/removeTextWithStrategy.js");
/**
 * Delete the word that is left of the cursor, as well as any spaces or
 * punctuation after the word.
 */


function keyCommandBackspaceWord(editorState) {
  var afterRemoval = removeTextWithStrategy(editorState, function (strategyState) {
    var selection = strategyState.getSelection();
    var offset = selection.getStartOffset(); // If there are no words before the cursor, remove the preceding newline.

    if (offset === 0) {
      return moveSelectionBackward(strategyState, 1);
    }

    var key = selection.getStartKey();
    var content = strategyState.getCurrentContent();
    var text = content.getBlockForKey(key).getText().slice(0, offset);
    var toRemove = DraftRemovableWord.getBackward(text);
    return moveSelectionBackward(strategyState, toRemove.length || 1);
  }, 'backward');

  if (afterRemoval === editorState.getCurrentContent()) {
    return editorState;
  }

  return EditorState.push(editorState, afterRemoval, 'remove-range');
}

module.exports = keyCommandBackspaceWord;

/***/ }),

/***/ "./node_modules/draft-js/lib/keyCommandDeleteWord.js":
/*!***********************************************************!*\
  !*** ./node_modules/draft-js/lib/keyCommandDeleteWord.js ***!
  \***********************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";
/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @format
 * 
 * @emails oncall+draft_js
 */


var DraftRemovableWord = __webpack_require__(/*! ./DraftRemovableWord */ "./node_modules/draft-js/lib/DraftRemovableWord.js");

var EditorState = __webpack_require__(/*! ./EditorState */ "./node_modules/draft-js/lib/EditorState.js");

var moveSelectionForward = __webpack_require__(/*! ./moveSelectionForward */ "./node_modules/draft-js/lib/moveSelectionForward.js");

var removeTextWithStrategy = __webpack_require__(/*! ./removeTextWithStrategy */ "./node_modules/draft-js/lib/removeTextWithStrategy.js");
/**
 * Delete the word that is right of the cursor, as well as any spaces or
 * punctuation before the word.
 */


function keyCommandDeleteWord(editorState) {
  var afterRemoval = removeTextWithStrategy(editorState, function (strategyState) {
    var selection = strategyState.getSelection();
    var offset = selection.getStartOffset();
    var key = selection.getStartKey();
    var content = strategyState.getCurrentContent();
    var text = content.getBlockForKey(key).getText().slice(offset);
    var toRemove = DraftRemovableWord.getForward(text); // If there are no words in front of the cursor, remove the newline.

    return moveSelectionForward(strategyState, toRemove.length || 1);
  }, 'forward');

  if (afterRemoval === editorState.getCurrentContent()) {
    return editorState;
  }

  return EditorState.push(editorState, afterRemoval, 'remove-range');
}

module.exports = keyCommandDeleteWord;

/***/ }),

/***/ "./node_modules/draft-js/lib/keyCommandInsertNewline.js":
/*!**************************************************************!*\
  !*** ./node_modules/draft-js/lib/keyCommandInsertNewline.js ***!
  \**************************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";
/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @format
 * 
 * @emails oncall+draft_js
 */


var DraftModifier = __webpack_require__(/*! ./DraftModifier */ "./node_modules/draft-js/lib/DraftModifier.js");

var EditorState = __webpack_require__(/*! ./EditorState */ "./node_modules/draft-js/lib/EditorState.js");

function keyCommandInsertNewline(editorState) {
  var contentState = DraftModifier.splitBlock(editorState.getCurrentContent(), editorState.getSelection());
  return EditorState.push(editorState, contentState, 'split-block');
}

module.exports = keyCommandInsertNewline;

/***/ }),

/***/ "./node_modules/draft-js/lib/keyCommandMoveSelectionToEndOfBlock.js":
/*!**************************************************************************!*\
  !*** ./node_modules/draft-js/lib/keyCommandMoveSelectionToEndOfBlock.js ***!
  \**************************************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";
/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @format
 * 
 * @emails oncall+draft_js
 */


var EditorState = __webpack_require__(/*! ./EditorState */ "./node_modules/draft-js/lib/EditorState.js");
/**
 * See comment for `moveSelectionToStartOfBlock`.
 */


function keyCommandMoveSelectionToEndOfBlock(editorState) {
  var selection = editorState.getSelection();
  var endKey = selection.getEndKey();
  var content = editorState.getCurrentContent();
  var textLength = content.getBlockForKey(endKey).getLength();
  return EditorState.set(editorState, {
    selection: selection.merge({
      anchorKey: endKey,
      anchorOffset: textLength,
      focusKey: endKey,
      focusOffset: textLength,
      isBackward: false
    }),
    forceSelection: true
  });
}

module.exports = keyCommandMoveSelectionToEndOfBlock;

/***/ }),

/***/ "./node_modules/draft-js/lib/keyCommandMoveSelectionToStartOfBlock.js":
/*!****************************************************************************!*\
  !*** ./node_modules/draft-js/lib/keyCommandMoveSelectionToStartOfBlock.js ***!
  \****************************************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";
/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @format
 * 
 * @emails oncall+draft_js
 */


var EditorState = __webpack_require__(/*! ./EditorState */ "./node_modules/draft-js/lib/EditorState.js");
/**
 * Collapse selection at the start of the first selected block. This is used
 * for Firefox versions that attempt to navigate forward/backward instead of
 * moving the cursor. Other browsers are able to move the cursor natively.
 */


function keyCommandMoveSelectionToStartOfBlock(editorState) {
  var selection = editorState.getSelection();
  var startKey = selection.getStartKey();
  return EditorState.set(editorState, {
    selection: selection.merge({
      anchorKey: startKey,
      anchorOffset: 0,
      focusKey: startKey,
      focusOffset: 0,
      isBackward: false
    }),
    forceSelection: true
  });
}

module.exports = keyCommandMoveSelectionToStartOfBlock;

/***/ }),

/***/ "./node_modules/draft-js/lib/keyCommandPlainBackspace.js":
/*!***************************************************************!*\
  !*** ./node_modules/draft-js/lib/keyCommandPlainBackspace.js ***!
  \***************************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";
/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @format
 * 
 * @emails oncall+draft_js
 */


var EditorState = __webpack_require__(/*! ./EditorState */ "./node_modules/draft-js/lib/EditorState.js");

var UnicodeUtils = __webpack_require__(/*! fbjs/lib/UnicodeUtils */ "./node_modules/fbjs/lib/UnicodeUtils.js");

var moveSelectionBackward = __webpack_require__(/*! ./moveSelectionBackward */ "./node_modules/draft-js/lib/moveSelectionBackward.js");

var removeTextWithStrategy = __webpack_require__(/*! ./removeTextWithStrategy */ "./node_modules/draft-js/lib/removeTextWithStrategy.js");
/**
 * Remove the selected range. If the cursor is collapsed, remove the preceding
 * character. This operation is Unicode-aware, so removing a single character
 * will remove a surrogate pair properly as well.
 */


function keyCommandPlainBackspace(editorState) {
  var afterRemoval = removeTextWithStrategy(editorState, function (strategyState) {
    var selection = strategyState.getSelection();
    var content = strategyState.getCurrentContent();
    var key = selection.getAnchorKey();
    var offset = selection.getAnchorOffset();
    var charBehind = content.getBlockForKey(key).getText()[offset - 1];
    return moveSelectionBackward(strategyState, charBehind ? UnicodeUtils.getUTF16Length(charBehind, 0) : 1);
  }, 'backward');

  if (afterRemoval === editorState.getCurrentContent()) {
    return editorState;
  }

  var selection = editorState.getSelection();
  return EditorState.push(editorState, afterRemoval.set('selectionBefore', selection), selection.isCollapsed() ? 'backspace-character' : 'remove-range');
}

module.exports = keyCommandPlainBackspace;

/***/ }),

/***/ "./node_modules/draft-js/lib/keyCommandPlainDelete.js":
/*!************************************************************!*\
  !*** ./node_modules/draft-js/lib/keyCommandPlainDelete.js ***!
  \************************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";
/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @format
 * 
 * @emails oncall+draft_js
 */


var EditorState = __webpack_require__(/*! ./EditorState */ "./node_modules/draft-js/lib/EditorState.js");

var UnicodeUtils = __webpack_require__(/*! fbjs/lib/UnicodeUtils */ "./node_modules/fbjs/lib/UnicodeUtils.js");

var moveSelectionForward = __webpack_require__(/*! ./moveSelectionForward */ "./node_modules/draft-js/lib/moveSelectionForward.js");

var removeTextWithStrategy = __webpack_require__(/*! ./removeTextWithStrategy */ "./node_modules/draft-js/lib/removeTextWithStrategy.js");
/**
 * Remove the selected range. If the cursor is collapsed, remove the following
 * character. This operation is Unicode-aware, so removing a single character
 * will remove a surrogate pair properly as well.
 */


function keyCommandPlainDelete(editorState) {
  var afterRemoval = removeTextWithStrategy(editorState, function (strategyState) {
    var selection = strategyState.getSelection();
    var content = strategyState.getCurrentContent();
    var key = selection.getAnchorKey();
    var offset = selection.getAnchorOffset();
    var charAhead = content.getBlockForKey(key).getText()[offset];
    return moveSelectionForward(strategyState, charAhead ? UnicodeUtils.getUTF16Length(charAhead, 0) : 1);
  }, 'forward');

  if (afterRemoval === editorState.getCurrentContent()) {
    return editorState;
  }

  var selection = editorState.getSelection();
  return EditorState.push(editorState, afterRemoval.set('selectionBefore', selection), selection.isCollapsed() ? 'delete-character' : 'remove-range');
}

module.exports = keyCommandPlainDelete;

/***/ }),

/***/ "./node_modules/draft-js/lib/keyCommandTransposeCharacters.js":
/*!********************************************************************!*\
  !*** ./node_modules/draft-js/lib/keyCommandTransposeCharacters.js ***!
  \********************************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";
/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @format
 * 
 * @emails oncall+draft_js
 */


var DraftModifier = __webpack_require__(/*! ./DraftModifier */ "./node_modules/draft-js/lib/DraftModifier.js");

var EditorState = __webpack_require__(/*! ./EditorState */ "./node_modules/draft-js/lib/EditorState.js");

var getContentStateFragment = __webpack_require__(/*! ./getContentStateFragment */ "./node_modules/draft-js/lib/getContentStateFragment.js");
/**
 * Transpose the characters on either side of a collapsed cursor, or
 * if the cursor is at the end of the block, transpose the last two
 * characters.
 */


function keyCommandTransposeCharacters(editorState) {
  var selection = editorState.getSelection();

  if (!selection.isCollapsed()) {
    return editorState;
  }

  var offset = selection.getAnchorOffset();

  if (offset === 0) {
    return editorState;
  }

  var blockKey = selection.getAnchorKey();
  var content = editorState.getCurrentContent();
  var block = content.getBlockForKey(blockKey);
  var length = block.getLength(); // Nothing to transpose if there aren't two characters.

  if (length <= 1) {
    return editorState;
  }

  var removalRange;
  var finalSelection;

  if (offset === length) {
    // The cursor is at the end of the block. Swap the last two characters.
    removalRange = selection.set('anchorOffset', offset - 1);
    finalSelection = selection;
  } else {
    removalRange = selection.set('focusOffset', offset + 1);
    finalSelection = removalRange.set('anchorOffset', offset + 1);
  } // Extract the character to move as a fragment. This preserves its
  // styling and entity, if any.


  var movedFragment = getContentStateFragment(content, removalRange);
  var afterRemoval = DraftModifier.removeRange(content, removalRange, 'backward'); // After the removal, the insertion target is one character back.

  var selectionAfter = afterRemoval.getSelectionAfter();
  var targetOffset = selectionAfter.getAnchorOffset() - 1;
  var targetRange = selectionAfter.merge({
    anchorOffset: targetOffset,
    focusOffset: targetOffset
  });
  var afterInsert = DraftModifier.replaceWithFragment(afterRemoval, targetRange, movedFragment);
  var newEditorState = EditorState.push(editorState, afterInsert, 'insert-fragment');
  return EditorState.acceptSelection(newEditorState, finalSelection);
}

module.exports = keyCommandTransposeCharacters;

/***/ }),

/***/ "./node_modules/draft-js/lib/keyCommandUndo.js":
/*!*****************************************************!*\
  !*** ./node_modules/draft-js/lib/keyCommandUndo.js ***!
  \*****************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";
/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @format
 * 
 * @emails oncall+draft_js
 */


var EditorState = __webpack_require__(/*! ./EditorState */ "./node_modules/draft-js/lib/EditorState.js");

function keyCommandUndo(e, editorState, updateFn) {
  var undoneState = EditorState.undo(editorState); // If the last change to occur was a spellcheck change, allow the undo
  // event to fall through to the browser. This allows the browser to record
  // the unwanted change, which should soon lead it to learn not to suggest
  // the correction again.

  if (editorState.getLastChangeType() === 'spellcheck-change') {
    var nativelyRenderedContent = undoneState.getCurrentContent();
    updateFn(EditorState.set(undoneState, {
      nativelyRenderedContent: nativelyRenderedContent
    }));
    return;
  } // Otheriwse, manage the undo behavior manually.


  e.preventDefault();

  if (!editorState.getNativelyRenderedContent()) {
    updateFn(undoneState);
    return;
  } // Trigger a re-render with the current content state to ensure that the
  // component tree has up-to-date props for comparison.


  updateFn(EditorState.set(editorState, {
    nativelyRenderedContent: null
  })); // Wait to ensure that the re-render has occurred before performing
  // the undo action.

  setTimeout(function () {
    updateFn(undoneState);
  }, 0);
}

module.exports = keyCommandUndo;

/***/ }),

/***/ "./node_modules/draft-js/lib/modifyBlockForContentState.js":
/*!*****************************************************************!*\
  !*** ./node_modules/draft-js/lib/modifyBlockForContentState.js ***!
  \*****************************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";
/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @format
 * 
 * @emails oncall+draft_js
 */


var Immutable = __webpack_require__(/*! immutable */ "./node_modules/draft-js/node_modules/immutable/dist/immutable.js");

var Map = Immutable.Map;

function modifyBlockForContentState(contentState, selectionState, operation) {
  var startKey = selectionState.getStartKey();
  var endKey = selectionState.getEndKey();
  var blockMap = contentState.getBlockMap();
  var newBlocks = blockMap.toSeq().skipUntil(function (_, k) {
    return k === startKey;
  }).takeUntil(function (_, k) {
    return k === endKey;
  }).concat(Map([[endKey, blockMap.get(endKey)]])).map(operation);
  return contentState.merge({
    blockMap: blockMap.merge(newBlocks),
    selectionBefore: selectionState,
    selectionAfter: selectionState
  });
}

module.exports = modifyBlockForContentState;

/***/ }),

/***/ "./node_modules/draft-js/lib/moveBlockInContentState.js":
/*!**************************************************************!*\
  !*** ./node_modules/draft-js/lib/moveBlockInContentState.js ***!
  \**************************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";
/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @format
 * 
 * @emails oncall+draft_js
 */


var ContentBlockNode = __webpack_require__(/*! ./ContentBlockNode */ "./node_modules/draft-js/lib/ContentBlockNode.js");

var getNextDelimiterBlockKey = __webpack_require__(/*! ./getNextDelimiterBlockKey */ "./node_modules/draft-js/lib/getNextDelimiterBlockKey.js");

var Immutable = __webpack_require__(/*! immutable */ "./node_modules/draft-js/node_modules/immutable/dist/immutable.js");

var invariant = __webpack_require__(/*! fbjs/lib/invariant */ "./node_modules/fbjs/lib/invariant.js");

var OrderedMap = Immutable.OrderedMap,
    List = Immutable.List;

var transformBlock = function transformBlock(key, blockMap, func) {
  if (!key) {
    return;
  }

  var block = blockMap.get(key);

  if (!block) {
    return;
  }

  blockMap.set(key, func(block));
};

var updateBlockMapLinks = function updateBlockMapLinks(blockMap, originalBlockToBeMoved, originalTargetBlock, insertionMode, isExperimentalTreeBlock) {
  if (!isExperimentalTreeBlock) {
    return blockMap;
  } // possible values of 'insertionMode' are: 'after', 'before'


  var isInsertedAfterTarget = insertionMode === 'after';
  var originalBlockKey = originalBlockToBeMoved.getKey();
  var originalTargetKey = originalTargetBlock.getKey();
  var originalParentKey = originalBlockToBeMoved.getParentKey();
  var originalNextSiblingKey = originalBlockToBeMoved.getNextSiblingKey();
  var originalPrevSiblingKey = originalBlockToBeMoved.getPrevSiblingKey();
  var newParentKey = originalTargetBlock.getParentKey();
  var newNextSiblingKey = isInsertedAfterTarget ? originalTargetBlock.getNextSiblingKey() : originalTargetKey;
  var newPrevSiblingKey = isInsertedAfterTarget ? originalTargetKey : originalTargetBlock.getPrevSiblingKey();
  return blockMap.withMutations(function (blocks) {
    // update old parent
    transformBlock(originalParentKey, blocks, function (block) {
      var parentChildrenList = block.getChildKeys();
      return block.merge({
        children: parentChildrenList["delete"](parentChildrenList.indexOf(originalBlockKey))
      });
    }); // update old prev

    transformBlock(originalPrevSiblingKey, blocks, function (block) {
      return block.merge({
        nextSibling: originalNextSiblingKey
      });
    }); // update old next

    transformBlock(originalNextSiblingKey, blocks, function (block) {
      return block.merge({
        prevSibling: originalPrevSiblingKey
      });
    }); // update new next

    transformBlock(newNextSiblingKey, blocks, function (block) {
      return block.merge({
        prevSibling: originalBlockKey
      });
    }); // update new prev

    transformBlock(newPrevSiblingKey, blocks, function (block) {
      return block.merge({
        nextSibling: originalBlockKey
      });
    }); // update new parent

    transformBlock(newParentKey, blocks, function (block) {
      var newParentChildrenList = block.getChildKeys();
      var targetBlockIndex = newParentChildrenList.indexOf(originalTargetKey);
      var insertionIndex = isInsertedAfterTarget ? targetBlockIndex + 1 : targetBlockIndex !== 0 ? targetBlockIndex - 1 : 0;
      var newChildrenArray = newParentChildrenList.toArray();
      newChildrenArray.splice(insertionIndex, 0, originalBlockKey);
      return block.merge({
        children: List(newChildrenArray)
      });
    }); // update block

    transformBlock(originalBlockKey, blocks, function (block) {
      return block.merge({
        nextSibling: newNextSiblingKey,
        prevSibling: newPrevSiblingKey,
        parent: newParentKey
      });
    });
  });
};

var moveBlockInContentState = function moveBlockInContentState(contentState, blockToBeMoved, targetBlock, insertionMode) {
  !(insertionMode !== 'replace') ?  true ? invariant(false, 'Replacing blocks is not supported.') : 0 : void 0;
  var targetKey = targetBlock.getKey();
  var blockKey = blockToBeMoved.getKey();
  !(blockKey !== targetKey) ?  true ? invariant(false, 'Block cannot be moved next to itself.') : 0 : void 0;
  var blockMap = contentState.getBlockMap();
  var isExperimentalTreeBlock = blockToBeMoved instanceof ContentBlockNode;
  var blocksToBeMoved = [blockToBeMoved];
  var blockMapWithoutBlocksToBeMoved = blockMap["delete"](blockKey);

  if (isExperimentalTreeBlock) {
    blocksToBeMoved = [];
    blockMapWithoutBlocksToBeMoved = blockMap.withMutations(function (blocks) {
      var nextSiblingKey = blockToBeMoved.getNextSiblingKey();
      var nextDelimiterBlockKey = getNextDelimiterBlockKey(blockToBeMoved, blocks);
      blocks.toSeq().skipUntil(function (block) {
        return block.getKey() === blockKey;
      }).takeWhile(function (block) {
        var key = block.getKey();
        var isBlockToBeMoved = key === blockKey;
        var hasNextSiblingAndIsNotNextSibling = nextSiblingKey && key !== nextSiblingKey;
        var doesNotHaveNextSiblingAndIsNotDelimiter = !nextSiblingKey && block.getParentKey() && (!nextDelimiterBlockKey || key !== nextDelimiterBlockKey);
        return !!(isBlockToBeMoved || hasNextSiblingAndIsNotNextSibling || doesNotHaveNextSiblingAndIsNotDelimiter);
      }).forEach(function (block) {
        blocksToBeMoved.push(block);
        blocks["delete"](block.getKey());
      });
    });
  }

  var blocksBefore = blockMapWithoutBlocksToBeMoved.toSeq().takeUntil(function (v) {
    return v === targetBlock;
  });
  var blocksAfter = blockMapWithoutBlocksToBeMoved.toSeq().skipUntil(function (v) {
    return v === targetBlock;
  }).skip(1);
  var slicedBlocks = blocksToBeMoved.map(function (block) {
    return [block.getKey(), block];
  });
  var newBlocks = OrderedMap();

  if (insertionMode === 'before') {
    var blockBefore = contentState.getBlockBefore(targetKey);
    !(!blockBefore || blockBefore.getKey() !== blockToBeMoved.getKey()) ?  true ? invariant(false, 'Block cannot be moved next to itself.') : 0 : void 0;
    newBlocks = blocksBefore.concat([].concat(slicedBlocks, [[targetKey, targetBlock]]), blocksAfter).toOrderedMap();
  } else if (insertionMode === 'after') {
    var blockAfter = contentState.getBlockAfter(targetKey);
    !(!blockAfter || blockAfter.getKey() !== blockKey) ?  true ? invariant(false, 'Block cannot be moved next to itself.') : 0 : void 0;
    newBlocks = blocksBefore.concat([[targetKey, targetBlock]].concat(slicedBlocks), blocksAfter).toOrderedMap();
  }

  return contentState.merge({
    blockMap: updateBlockMapLinks(newBlocks, blockToBeMoved, targetBlock, insertionMode, isExperimentalTreeBlock),
    selectionBefore: contentState.getSelectionAfter(),
    selectionAfter: contentState.getSelectionAfter().merge({
      anchorKey: blockKey,
      focusKey: blockKey
    })
  });
};

module.exports = moveBlockInContentState;

/***/ }),

/***/ "./node_modules/draft-js/lib/moveSelectionBackward.js":
/*!************************************************************!*\
  !*** ./node_modules/draft-js/lib/moveSelectionBackward.js ***!
  \************************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";
/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @format
 * 
 * @emails oncall+draft_js
 */


var warning = __webpack_require__(/*! fbjs/lib/warning */ "./node_modules/fbjs/lib/warning.js");
/**
 * Given a collapsed selection, move the focus `maxDistance` backward within
 * the selected block. If the selection will go beyond the start of the block,
 * move focus to the end of the previous block, but no further.
 *
 * This function is not Unicode-aware, so surrogate pairs will be treated
 * as having length 2.
 */


function moveSelectionBackward(editorState, maxDistance) {
  var selection = editorState.getSelection(); // Should eventually make this an invariant

   true ? warning(selection.isCollapsed(), 'moveSelectionBackward should only be called with a collapsed SelectionState') : 0;
  var content = editorState.getCurrentContent();
  var key = selection.getStartKey();
  var offset = selection.getStartOffset();
  var focusKey = key;
  var focusOffset = 0;

  if (maxDistance > offset) {
    var keyBefore = content.getKeyBefore(key);

    if (keyBefore == null) {
      focusKey = key;
    } else {
      focusKey = keyBefore;
      var blockBefore = content.getBlockForKey(keyBefore);
      focusOffset = blockBefore.getText().length;
    }
  } else {
    focusOffset = offset - maxDistance;
  }

  return selection.merge({
    focusKey: focusKey,
    focusOffset: focusOffset,
    isBackward: true
  });
}

module.exports = moveSelectionBackward;

/***/ }),

/***/ "./node_modules/draft-js/lib/moveSelectionForward.js":
/*!***********************************************************!*\
  !*** ./node_modules/draft-js/lib/moveSelectionForward.js ***!
  \***********************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";
/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @format
 * 
 * @emails oncall+draft_js
 */


var warning = __webpack_require__(/*! fbjs/lib/warning */ "./node_modules/fbjs/lib/warning.js");
/**
 * Given a collapsed selection, move the focus `maxDistance` forward within
 * the selected block. If the selection will go beyond the end of the block,
 * move focus to the start of the next block, but no further.
 *
 * This function is not Unicode-aware, so surrogate pairs will be treated
 * as having length 2.
 */


function moveSelectionForward(editorState, maxDistance) {
  var selection = editorState.getSelection(); // Should eventually make this an invariant

   true ? warning(selection.isCollapsed(), 'moveSelectionForward should only be called with a collapsed SelectionState') : 0;
  var key = selection.getStartKey();
  var offset = selection.getStartOffset();
  var content = editorState.getCurrentContent();
  var focusKey = key;
  var focusOffset;
  var block = content.getBlockForKey(key);

  if (maxDistance > block.getText().length - offset) {
    focusKey = content.getKeyAfter(key);
    focusOffset = 0;
  } else {
    focusOffset = offset + maxDistance;
  }

  return selection.merge({
    focusKey: focusKey,
    focusOffset: focusOffset
  });
}

module.exports = moveSelectionForward;

/***/ }),

/***/ "./node_modules/draft-js/lib/randomizeBlockMapKeys.js":
/*!************************************************************!*\
  !*** ./node_modules/draft-js/lib/randomizeBlockMapKeys.js ***!
  \************************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";
/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @format
 * 
 * @emails oncall+draft_js
 */


var ContentBlockNode = __webpack_require__(/*! ./ContentBlockNode */ "./node_modules/draft-js/lib/ContentBlockNode.js");

var generateRandomKey = __webpack_require__(/*! ./generateRandomKey */ "./node_modules/draft-js/lib/generateRandomKey.js");

var Immutable = __webpack_require__(/*! immutable */ "./node_modules/draft-js/node_modules/immutable/dist/immutable.js");

var OrderedMap = Immutable.OrderedMap;

var randomizeContentBlockNodeKeys = function randomizeContentBlockNodeKeys(blockMap) {
  var newKeysRef = {}; // we keep track of root blocks in order to update subsequent sibling links

  var lastRootBlock;
  return OrderedMap(blockMap.withMutations(function (blockMapState) {
    blockMapState.forEach(function (block, index) {
      var oldKey = block.getKey();
      var nextKey = block.getNextSiblingKey();
      var prevKey = block.getPrevSiblingKey();
      var childrenKeys = block.getChildKeys();
      var parentKey = block.getParentKey(); // new key that we will use to build linking

      var key = generateRandomKey(); // we will add it here to re-use it later

      newKeysRef[oldKey] = key;

      if (nextKey) {
        var nextBlock = blockMapState.get(nextKey);

        if (nextBlock) {
          blockMapState.setIn([nextKey, 'prevSibling'], key);
        } else {
          // this can happen when generating random keys for fragments
          blockMapState.setIn([oldKey, 'nextSibling'], null);
        }
      }

      if (prevKey) {
        var prevBlock = blockMapState.get(prevKey);

        if (prevBlock) {
          blockMapState.setIn([prevKey, 'nextSibling'], key);
        } else {
          // this can happen when generating random keys for fragments
          blockMapState.setIn([oldKey, 'prevSibling'], null);
        }
      }

      if (parentKey && blockMapState.get(parentKey)) {
        var parentBlock = blockMapState.get(parentKey);
        var parentChildrenList = parentBlock.getChildKeys();
        blockMapState.setIn([parentKey, 'children'], parentChildrenList.set(parentChildrenList.indexOf(block.getKey()), key));
      } else {
        // blocks will then be treated as root block nodes
        blockMapState.setIn([oldKey, 'parent'], null);

        if (lastRootBlock) {
          blockMapState.setIn([lastRootBlock.getKey(), 'nextSibling'], key);
          blockMapState.setIn([oldKey, 'prevSibling'], newKeysRef[lastRootBlock.getKey()]);
        }

        lastRootBlock = blockMapState.get(oldKey);
      }

      childrenKeys.forEach(function (childKey) {
        var childBlock = blockMapState.get(childKey);

        if (childBlock) {
          blockMapState.setIn([childKey, 'parent'], key);
        } else {
          blockMapState.setIn([oldKey, 'children'], block.getChildKeys().filter(function (child) {
            return child !== childKey;
          }));
        }
      });
    });
  }).toArray().map(function (block) {
    return [newKeysRef[block.getKey()], block.set('key', newKeysRef[block.getKey()])];
  }));
};

var randomizeContentBlockKeys = function randomizeContentBlockKeys(blockMap) {
  return OrderedMap(blockMap.toArray().map(function (block) {
    var key = generateRandomKey();
    return [key, block.set('key', key)];
  }));
};

var randomizeBlockMapKeys = function randomizeBlockMapKeys(blockMap) {
  var isTreeBasedBlockMap = blockMap.first() instanceof ContentBlockNode;

  if (!isTreeBasedBlockMap) {
    return randomizeContentBlockKeys(blockMap);
  }

  return randomizeContentBlockNodeKeys(blockMap);
};

module.exports = randomizeBlockMapKeys;

/***/ }),

/***/ "./node_modules/draft-js/lib/removeEntitiesAtEdges.js":
/*!************************************************************!*\
  !*** ./node_modules/draft-js/lib/removeEntitiesAtEdges.js ***!
  \************************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";
/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @format
 * 
 * @emails oncall+draft_js
 */


var CharacterMetadata = __webpack_require__(/*! ./CharacterMetadata */ "./node_modules/draft-js/lib/CharacterMetadata.js");

var findRangesImmutable = __webpack_require__(/*! ./findRangesImmutable */ "./node_modules/draft-js/lib/findRangesImmutable.js");

var invariant = __webpack_require__(/*! fbjs/lib/invariant */ "./node_modules/fbjs/lib/invariant.js");

function removeEntitiesAtEdges(contentState, selectionState) {
  var blockMap = contentState.getBlockMap();
  var entityMap = contentState.getEntityMap();
  var updatedBlocks = {};
  var startKey = selectionState.getStartKey();
  var startOffset = selectionState.getStartOffset();
  var startBlock = blockMap.get(startKey);
  var updatedStart = removeForBlock(entityMap, startBlock, startOffset);

  if (updatedStart !== startBlock) {
    updatedBlocks[startKey] = updatedStart;
  }

  var endKey = selectionState.getEndKey();
  var endOffset = selectionState.getEndOffset();
  var endBlock = blockMap.get(endKey);

  if (startKey === endKey) {
    endBlock = updatedStart;
  }

  var updatedEnd = removeForBlock(entityMap, endBlock, endOffset);

  if (updatedEnd !== endBlock) {
    updatedBlocks[endKey] = updatedEnd;
  }

  if (!Object.keys(updatedBlocks).length) {
    return contentState.set('selectionAfter', selectionState);
  }

  return contentState.merge({
    blockMap: blockMap.merge(updatedBlocks),
    selectionAfter: selectionState
  });
}
/**
 * Given a list of characters and an offset that is in the middle of an entity,
 * returns the start and end of the entity that is overlapping the offset.
 * Note: This method requires that the offset be in an entity range.
 */


function getRemovalRange(characters, entityKey, offset) {
  var removalRange; // Iterates through a list looking for ranges of matching items
  // based on the 'isEqual' callback.
  // Then instead of returning the result, call the 'found' callback
  // with each range.
  // Then filters those ranges based on the 'filter' callback
  //
  // Here we use it to find ranges of characters with the same entity key.

  findRangesImmutable(characters, // the list to iterate through
  function (a, b) {
    return a.getEntity() === b.getEntity();
  }, // 'isEqual' callback
  function (element) {
    return element.getEntity() === entityKey;
  }, // 'filter' callback
  function (start, end) {
    // 'found' callback
    if (start <= offset && end >= offset) {
      // this entity overlaps the offset index
      removalRange = {
        start: start,
        end: end
      };
    }
  });
  !(typeof removalRange === 'object') ?  true ? invariant(false, 'Removal range must exist within character list.') : 0 : void 0;
  return removalRange;
}

function removeForBlock(entityMap, block, offset) {
  var chars = block.getCharacterList();
  var charBefore = offset > 0 ? chars.get(offset - 1) : undefined;
  var charAfter = offset < chars.count() ? chars.get(offset) : undefined;
  var entityBeforeCursor = charBefore ? charBefore.getEntity() : undefined;
  var entityAfterCursor = charAfter ? charAfter.getEntity() : undefined;

  if (entityAfterCursor && entityAfterCursor === entityBeforeCursor) {
    var entity = entityMap.__get(entityAfterCursor);

    if (entity.getMutability() !== 'MUTABLE') {
      var _getRemovalRange = getRemovalRange(chars, entityAfterCursor, offset),
          start = _getRemovalRange.start,
          end = _getRemovalRange.end;

      var current;

      while (start < end) {
        current = chars.get(start);
        chars = chars.set(start, CharacterMetadata.applyEntity(current, null));
        start++;
      }

      return block.set('characterList', chars);
    }
  }

  return block;
}

module.exports = removeEntitiesAtEdges;

/***/ }),

/***/ "./node_modules/draft-js/lib/removeRangeFromContentState.js":
/*!******************************************************************!*\
  !*** ./node_modules/draft-js/lib/removeRangeFromContentState.js ***!
  \******************************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";
/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @format
 * 
 * @emails oncall+draft_js
 */


var ContentBlockNode = __webpack_require__(/*! ./ContentBlockNode */ "./node_modules/draft-js/lib/ContentBlockNode.js");

var getNextDelimiterBlockKey = __webpack_require__(/*! ./getNextDelimiterBlockKey */ "./node_modules/draft-js/lib/getNextDelimiterBlockKey.js");

var Immutable = __webpack_require__(/*! immutable */ "./node_modules/draft-js/node_modules/immutable/dist/immutable.js");

var List = Immutable.List,
    Map = Immutable.Map;

var transformBlock = function transformBlock(key, blockMap, func) {
  if (!key) {
    return;
  }

  var block = blockMap.get(key);

  if (!block) {
    return;
  }

  blockMap.set(key, func(block));
};
/**
 * Ancestors needs to be preserved when there are non selected
 * children to make sure we do not leave any orphans behind
 */


var getAncestorsKeys = function getAncestorsKeys(blockKey, blockMap) {
  var parents = [];

  if (!blockKey) {
    return parents;
  }

  var blockNode = blockMap.get(blockKey);

  while (blockNode && blockNode.getParentKey()) {
    var parentKey = blockNode.getParentKey();

    if (parentKey) {
      parents.push(parentKey);
    }

    blockNode = parentKey ? blockMap.get(parentKey) : null;
  }

  return parents;
};
/**
 * Get all next delimiter keys until we hit a root delimiter and return
 * an array of key references
 */


var getNextDelimitersBlockKeys = function getNextDelimitersBlockKeys(block, blockMap) {
  var nextDelimiters = [];

  if (!block) {
    return nextDelimiters;
  }

  var nextDelimiter = getNextDelimiterBlockKey(block, blockMap);

  while (nextDelimiter && blockMap.get(nextDelimiter)) {
    var _block = blockMap.get(nextDelimiter);

    nextDelimiters.push(nextDelimiter); // we do not need to keep checking all root node siblings, just the first occurance

    nextDelimiter = _block.getParentKey() ? getNextDelimiterBlockKey(_block, blockMap) : null;
  }

  return nextDelimiters;
};

var getNextValidSibling = function getNextValidSibling(block, blockMap, originalBlockMap) {
  if (!block) {
    return null;
  } // note that we need to make sure we refer to the original block since this
  // function is called within a withMutations


  var nextValidSiblingKey = originalBlockMap.get(block.getKey()).getNextSiblingKey();

  while (nextValidSiblingKey && !blockMap.get(nextValidSiblingKey)) {
    nextValidSiblingKey = originalBlockMap.get(nextValidSiblingKey).getNextSiblingKey() || null;
  }

  return nextValidSiblingKey;
};

var getPrevValidSibling = function getPrevValidSibling(block, blockMap, originalBlockMap) {
  if (!block) {
    return null;
  } // note that we need to make sure we refer to the original block since this
  // function is called within a withMutations


  var prevValidSiblingKey = originalBlockMap.get(block.getKey()).getPrevSiblingKey();

  while (prevValidSiblingKey && !blockMap.get(prevValidSiblingKey)) {
    prevValidSiblingKey = originalBlockMap.get(prevValidSiblingKey).getPrevSiblingKey() || null;
  }

  return prevValidSiblingKey;
};

var updateBlockMapLinks = function updateBlockMapLinks(blockMap, startBlock, endBlock, originalBlockMap) {
  return blockMap.withMutations(function (blocks) {
    // update start block if its retained
    transformBlock(startBlock.getKey(), blocks, function (block) {
      return block.merge({
        nextSibling: getNextValidSibling(block, blocks, originalBlockMap),
        prevSibling: getPrevValidSibling(block, blocks, originalBlockMap)
      });
    }); // update endblock if its retained

    transformBlock(endBlock.getKey(), blocks, function (block) {
      return block.merge({
        nextSibling: getNextValidSibling(block, blocks, originalBlockMap),
        prevSibling: getPrevValidSibling(block, blocks, originalBlockMap)
      });
    }); // update start block parent ancestors

    getAncestorsKeys(startBlock.getKey(), originalBlockMap).forEach(function (parentKey) {
      return transformBlock(parentKey, blocks, function (block) {
        return block.merge({
          children: block.getChildKeys().filter(function (key) {
            return blocks.get(key);
          }),
          nextSibling: getNextValidSibling(block, blocks, originalBlockMap),
          prevSibling: getPrevValidSibling(block, blocks, originalBlockMap)
        });
      });
    }); // update start block next - can only happen if startBlock == endBlock

    transformBlock(startBlock.getNextSiblingKey(), blocks, function (block) {
      return block.merge({
        prevSibling: startBlock.getPrevSiblingKey()
      });
    }); // update start block prev

    transformBlock(startBlock.getPrevSiblingKey(), blocks, function (block) {
      return block.merge({
        nextSibling: getNextValidSibling(block, blocks, originalBlockMap)
      });
    }); // update end block next

    transformBlock(endBlock.getNextSiblingKey(), blocks, function (block) {
      return block.merge({
        prevSibling: getPrevValidSibling(block, blocks, originalBlockMap)
      });
    }); // update end block prev

    transformBlock(endBlock.getPrevSiblingKey(), blocks, function (block) {
      return block.merge({
        nextSibling: endBlock.getNextSiblingKey()
      });
    }); // update end block parent ancestors

    getAncestorsKeys(endBlock.getKey(), originalBlockMap).forEach(function (parentKey) {
      transformBlock(parentKey, blocks, function (block) {
        return block.merge({
          children: block.getChildKeys().filter(function (key) {
            return blocks.get(key);
          }),
          nextSibling: getNextValidSibling(block, blocks, originalBlockMap),
          prevSibling: getPrevValidSibling(block, blocks, originalBlockMap)
        });
      });
    }); // update next delimiters all the way to a root delimiter

    getNextDelimitersBlockKeys(endBlock, originalBlockMap).forEach(function (delimiterKey) {
      return transformBlock(delimiterKey, blocks, function (block) {
        return block.merge({
          nextSibling: getNextValidSibling(block, blocks, originalBlockMap),
          prevSibling: getPrevValidSibling(block, blocks, originalBlockMap)
        });
      });
    }); // if parent (startBlock) was deleted

    if (blockMap.get(startBlock.getKey()) == null && blockMap.get(endBlock.getKey()) != null && endBlock.getParentKey() === startBlock.getKey() && endBlock.getPrevSiblingKey() == null) {
      var prevSiblingKey = startBlock.getPrevSiblingKey(); // endBlock becomes next sibling of parent's prevSibling

      transformBlock(endBlock.getKey(), blocks, function (block) {
        return block.merge({
          prevSibling: prevSiblingKey
        });
      });
      transformBlock(prevSiblingKey, blocks, function (block) {
        return block.merge({
          nextSibling: endBlock.getKey()
        });
      }); // Update parent for previous parent's children, and children for that parent

      var prevSibling = prevSiblingKey ? blockMap.get(prevSiblingKey) : null;
      var newParentKey = prevSibling ? prevSibling.getParentKey() : null;
      startBlock.getChildKeys().forEach(function (childKey) {
        transformBlock(childKey, blocks, function (block) {
          return block.merge({
            parent: newParentKey // set to null if there is no parent

          });
        });
      });

      if (newParentKey != null) {
        var newParent = blockMap.get(newParentKey);
        transformBlock(newParentKey, blocks, function (block) {
          return block.merge({
            children: newParent.getChildKeys().concat(startBlock.getChildKeys())
          });
        });
      } // last child of deleted parent should point to next sibling


      transformBlock(startBlock.getChildKeys().find(function (key) {
        var block = blockMap.get(key);
        return block.getNextSiblingKey() === null;
      }), blocks, function (block) {
        return block.merge({
          nextSibling: startBlock.getNextSiblingKey()
        });
      });
    }
  });
};

var removeRangeFromContentState = function removeRangeFromContentState(contentState, selectionState) {
  if (selectionState.isCollapsed()) {
    return contentState;
  }

  var blockMap = contentState.getBlockMap();
  var startKey = selectionState.getStartKey();
  var startOffset = selectionState.getStartOffset();
  var endKey = selectionState.getEndKey();
  var endOffset = selectionState.getEndOffset();
  var startBlock = blockMap.get(startKey);
  var endBlock = blockMap.get(endKey); // we assume that ContentBlockNode and ContentBlocks are not mixed together

  var isExperimentalTreeBlock = startBlock instanceof ContentBlockNode; // used to retain blocks that should not be deleted to avoid orphan children

  var parentAncestors = [];

  if (isExperimentalTreeBlock) {
    var endBlockchildrenKeys = endBlock.getChildKeys();
    var endBlockAncestors = getAncestorsKeys(endKey, blockMap); // endBlock has unselected siblings so we can not remove its ancestors parents

    if (endBlock.getNextSiblingKey()) {
      parentAncestors = parentAncestors.concat(endBlockAncestors);
    } // endBlock has children so can not remove this block or any of its ancestors


    if (!endBlockchildrenKeys.isEmpty()) {
      parentAncestors = parentAncestors.concat(endBlockAncestors.concat([endKey]));
    } // we need to retain all ancestors of the next delimiter block


    parentAncestors = parentAncestors.concat(getAncestorsKeys(getNextDelimiterBlockKey(endBlock, blockMap), blockMap));
  }

  var characterList;

  if (startBlock === endBlock) {
    characterList = removeFromList(startBlock.getCharacterList(), startOffset, endOffset);
  } else {
    characterList = startBlock.getCharacterList().slice(0, startOffset).concat(endBlock.getCharacterList().slice(endOffset));
  }

  var modifiedStart = startBlock.merge({
    text: startBlock.getText().slice(0, startOffset) + endBlock.getText().slice(endOffset),
    characterList: characterList
  }); // If cursor (collapsed) is at the start of the first child, delete parent
  // instead of child

  var shouldDeleteParent = isExperimentalTreeBlock && startOffset === 0 && endOffset === 0 && endBlock.getParentKey() === startKey && endBlock.getPrevSiblingKey() == null;
  var newBlocks = shouldDeleteParent ? Map([[startKey, null]]) : blockMap.toSeq().skipUntil(function (_, k) {
    return k === startKey;
  }).takeUntil(function (_, k) {
    return k === endKey;
  }).filter(function (_, k) {
    return parentAncestors.indexOf(k) === -1;
  }).concat(Map([[endKey, null]])).map(function (_, k) {
    return k === startKey ? modifiedStart : null;
  });
  var updatedBlockMap = blockMap.merge(newBlocks).filter(function (block) {
    return !!block;
  }); // Only update tree block pointers if the range is across blocks

  if (isExperimentalTreeBlock && startBlock !== endBlock) {
    updatedBlockMap = updateBlockMapLinks(updatedBlockMap, startBlock, endBlock, blockMap);
  }

  return contentState.merge({
    blockMap: updatedBlockMap,
    selectionBefore: selectionState,
    selectionAfter: selectionState.merge({
      anchorKey: startKey,
      anchorOffset: startOffset,
      focusKey: startKey,
      focusOffset: startOffset,
      isBackward: false
    })
  });
};
/**
 * Maintain persistence for target list when removing characters on the
 * head and tail of the character list.
 */


var removeFromList = function removeFromList(targetList, startOffset, endOffset) {
  if (startOffset === 0) {
    while (startOffset < endOffset) {
      targetList = targetList.shift();
      startOffset++;
    }
  } else if (endOffset === targetList.count()) {
    while (endOffset > startOffset) {
      targetList = targetList.pop();
      endOffset--;
    }
  } else {
    var head = targetList.slice(0, startOffset);
    var tail = targetList.slice(endOffset);
    targetList = head.concat(tail).toList();
  }

  return targetList;
};

module.exports = removeRangeFromContentState;

/***/ }),

/***/ "./node_modules/draft-js/lib/removeTextWithStrategy.js":
/*!*************************************************************!*\
  !*** ./node_modules/draft-js/lib/removeTextWithStrategy.js ***!
  \*************************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";
/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @format
 * 
 * @emails oncall+draft_js
 */


var DraftModifier = __webpack_require__(/*! ./DraftModifier */ "./node_modules/draft-js/lib/DraftModifier.js");

var gkx = __webpack_require__(/*! ./gkx */ "./node_modules/draft-js/lib/gkx.js");

var experimentalTreeDataSupport = gkx('draft_tree_data_support');
/**
 * For a collapsed selection state, remove text based on the specified strategy.
 * If the selection state is not collapsed, remove the entire selected range.
 */

function removeTextWithStrategy(editorState, strategy, direction) {
  var selection = editorState.getSelection();
  var content = editorState.getCurrentContent();
  var target = selection;
  var anchorKey = selection.getAnchorKey();
  var focusKey = selection.getFocusKey();
  var anchorBlock = content.getBlockForKey(anchorKey);

  if (experimentalTreeDataSupport) {
    if (direction === 'forward') {
      if (anchorKey !== focusKey) {
        // For now we ignore forward delete across blocks,
        // if there is demand for this we will implement it.
        return content;
      }
    }
  }

  if (selection.isCollapsed()) {
    if (direction === 'forward') {
      if (editorState.isSelectionAtEndOfContent()) {
        return content;
      }

      if (experimentalTreeDataSupport) {
        var isAtEndOfBlock = selection.getAnchorOffset() === content.getBlockForKey(anchorKey).getLength();

        if (isAtEndOfBlock) {
          var anchorBlockSibling = content.getBlockForKey(anchorBlock.nextSibling);

          if (!anchorBlockSibling || anchorBlockSibling.getLength() === 0) {
            // For now we ignore forward delete at the end of a block,
            // if there is demand for this we will implement it.
            return content;
          }
        }
      }
    } else if (editorState.isSelectionAtStartOfContent()) {
      return content;
    }

    target = strategy(editorState);

    if (target === selection) {
      return content;
    }
  }

  return DraftModifier.removeRange(content, target, direction);
}

module.exports = removeTextWithStrategy;

/***/ }),

/***/ "./node_modules/draft-js/lib/sanitizeDraftText.js":
/*!********************************************************!*\
  !*** ./node_modules/draft-js/lib/sanitizeDraftText.js ***!
  \********************************************************/
/***/ ((module) => {

"use strict";
/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @format
 * 
 * @emails oncall+draft_js
 */


var REGEX_BLOCK_DELIMITER = new RegExp('\r', 'g');

function sanitizeDraftText(input) {
  return input.replace(REGEX_BLOCK_DELIMITER, '');
}

module.exports = sanitizeDraftText;

/***/ }),

/***/ "./node_modules/draft-js/lib/setDraftEditorSelection.js":
/*!**************************************************************!*\
  !*** ./node_modules/draft-js/lib/setDraftEditorSelection.js ***!
  \**************************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";
/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @format
 * 
 * @emails oncall+draft_js
 */


var DraftEffects = __webpack_require__(/*! ./DraftEffects */ "./node_modules/draft-js/lib/DraftEffects.js");

var DraftJsDebugLogging = __webpack_require__(/*! ./DraftJsDebugLogging */ "./node_modules/draft-js/lib/DraftJsDebugLogging.js");

var UserAgent = __webpack_require__(/*! fbjs/lib/UserAgent */ "./node_modules/fbjs/lib/UserAgent.js");

var containsNode = __webpack_require__(/*! fbjs/lib/containsNode */ "./node_modules/fbjs/lib/containsNode.js");

var getActiveElement = __webpack_require__(/*! fbjs/lib/getActiveElement */ "./node_modules/fbjs/lib/getActiveElement.js");

var getCorrectDocumentFromNode = __webpack_require__(/*! ./getCorrectDocumentFromNode */ "./node_modules/draft-js/lib/getCorrectDocumentFromNode.js");

var invariant = __webpack_require__(/*! fbjs/lib/invariant */ "./node_modules/fbjs/lib/invariant.js");

var isElement = __webpack_require__(/*! ./isElement */ "./node_modules/draft-js/lib/isElement.js");

var isIE = UserAgent.isBrowser('IE');

function getAnonymizedDOM(node, getNodeLabels) {
  if (!node) {
    return '[empty]';
  }

  var anonymized = anonymizeTextWithin(node, getNodeLabels);

  if (anonymized.nodeType === Node.TEXT_NODE) {
    return anonymized.textContent;
  }

  !isElement(anonymized) ?  true ? invariant(false, 'Node must be an Element if it is not a text node.') : 0 : void 0;
  var castedElement = anonymized;
  return castedElement.outerHTML;
}

function anonymizeTextWithin(node, getNodeLabels) {
  var labels = getNodeLabels !== undefined ? getNodeLabels(node) : [];

  if (node.nodeType === Node.TEXT_NODE) {
    var length = node.textContent.length;
    return getCorrectDocumentFromNode(node).createTextNode('[text ' + length + (labels.length ? ' | ' + labels.join(', ') : '') + ']');
  }

  var clone = node.cloneNode();

  if (clone.nodeType === 1 && labels.length) {
    clone.setAttribute('data-labels', labels.join(', '));
  }

  var childNodes = node.childNodes;

  for (var ii = 0; ii < childNodes.length; ii++) {
    clone.appendChild(anonymizeTextWithin(childNodes[ii], getNodeLabels));
  }

  return clone;
}

function getAnonymizedEditorDOM(node, getNodeLabels) {
  // grabbing the DOM content of the Draft editor
  var currentNode = node; // this should only be used after checking with isElement

  var castedNode = currentNode;

  while (currentNode) {
    if (isElement(currentNode) && castedNode.hasAttribute('contenteditable')) {
      // found the Draft editor container
      return getAnonymizedDOM(currentNode, getNodeLabels);
    } else {
      currentNode = currentNode.parentNode;
      castedNode = currentNode;
    }
  }

  return 'Could not find contentEditable parent of node';
}

function getNodeLength(node) {
  return node.nodeValue === null ? node.childNodes.length : node.nodeValue.length;
}
/**
 * In modern non-IE browsers, we can support both forward and backward
 * selections.
 *
 * Note: IE10+ supports the Selection object, but it does not support
 * the `extend` method, which means that even in modern IE, it's not possible
 * to programatically create a backward selection. Thus, for all IE
 * versions, we use the old IE API to create our selections.
 */


function setDraftEditorSelection(selectionState, node, blockKey, nodeStart, nodeEnd) {
  // It's possible that the editor has been removed from the DOM but
  // our selection code doesn't know it yet. Forcing selection in
  // this case may lead to errors, so just bail now.
  var documentObject = getCorrectDocumentFromNode(node);

  if (!containsNode(documentObject.documentElement, node)) {
    return;
  }

  var selection = documentObject.defaultView.getSelection();
  var anchorKey = selectionState.getAnchorKey();
  var anchorOffset = selectionState.getAnchorOffset();
  var focusKey = selectionState.getFocusKey();
  var focusOffset = selectionState.getFocusOffset();
  var isBackward = selectionState.getIsBackward(); // IE doesn't support backward selection. Swap key/offset pairs.

  if (!selection.extend && isBackward) {
    var tempKey = anchorKey;
    var tempOffset = anchorOffset;
    anchorKey = focusKey;
    anchorOffset = focusOffset;
    focusKey = tempKey;
    focusOffset = tempOffset;
    isBackward = false;
  }

  var hasAnchor = anchorKey === blockKey && nodeStart <= anchorOffset && nodeEnd >= anchorOffset;
  var hasFocus = focusKey === blockKey && nodeStart <= focusOffset && nodeEnd >= focusOffset; // If the selection is entirely bound within this node, set the selection
  // and be done.

  if (hasAnchor && hasFocus) {
    selection.removeAllRanges();
    addPointToSelection(selection, node, anchorOffset - nodeStart, selectionState);
    addFocusToSelection(selection, node, focusOffset - nodeStart, selectionState);
    return;
  }

  if (!isBackward) {
    // If the anchor is within this node, set the range start.
    if (hasAnchor) {
      selection.removeAllRanges();
      addPointToSelection(selection, node, anchorOffset - nodeStart, selectionState);
    } // If the focus is within this node, we can assume that we have
    // already set the appropriate start range on the selection, and
    // can simply extend the selection.


    if (hasFocus) {
      addFocusToSelection(selection, node, focusOffset - nodeStart, selectionState);
    }
  } else {
    // If this node has the focus, set the selection range to be a
    // collapsed range beginning here. Later, when we encounter the anchor,
    // we'll use this information to extend the selection.
    if (hasFocus) {
      selection.removeAllRanges();
      addPointToSelection(selection, node, focusOffset - nodeStart, selectionState);
    } // If this node has the anchor, we may assume that the correct
    // focus information is already stored on the selection object.
    // We keep track of it, reset the selection range, and extend it
    // back to the focus point.


    if (hasAnchor) {
      var storedFocusNode = selection.focusNode;
      var storedFocusOffset = selection.focusOffset;
      selection.removeAllRanges();
      addPointToSelection(selection, node, anchorOffset - nodeStart, selectionState);
      addFocusToSelection(selection, storedFocusNode, storedFocusOffset, selectionState);
    }
  }
}
/**
 * Extend selection towards focus point.
 */


function addFocusToSelection(selection, node, offset, selectionState) {
  var activeElement = getActiveElement();
  var extend = selection.extend; // containsNode returns false if node is null.
  // Let's refine the type of this value out here so flow knows.

  if (extend && node != null && containsNode(activeElement, node)) {
    // If `extend` is called while another element has focus, an error is
    // thrown. We therefore disable `extend` if the active element is somewhere
    // other than the node we are selecting. This should only occur in Firefox,
    // since it is the only browser to support multiple selections.
    // See https://bugzilla.mozilla.org/show_bug.cgi?id=921444.
    // logging to catch bug that is being reported in t16250795
    if (offset > getNodeLength(node)) {
      // the call to 'selection.extend' is about to throw
      DraftJsDebugLogging.logSelectionStateFailure({
        anonymizedDom: getAnonymizedEditorDOM(node),
        extraParams: JSON.stringify({
          offset: offset
        }),
        selectionState: JSON.stringify(selectionState.toJS())
      });
    } // logging to catch bug that is being reported in t18110632


    var nodeWasFocus = node === selection.focusNode;

    try {
      // Fixes some reports of "InvalidStateError: Failed to execute 'extend' on
      // 'Selection': This Selection object doesn't have any Ranges."
      // Note: selection.extend does not exist in IE.
      if (selection.rangeCount > 0 && selection.extend) {
        selection.extend(node, offset);
      }
    } catch (e) {
      DraftJsDebugLogging.logSelectionStateFailure({
        anonymizedDom: getAnonymizedEditorDOM(node, function (n) {
          var labels = [];

          if (n === activeElement) {
            labels.push('active element');
          }

          if (n === selection.anchorNode) {
            labels.push('selection anchor node');
          }

          if (n === selection.focusNode) {
            labels.push('selection focus node');
          }

          return labels;
        }),
        extraParams: JSON.stringify({
          activeElementName: activeElement ? activeElement.nodeName : null,
          nodeIsFocus: node === selection.focusNode,
          nodeWasFocus: nodeWasFocus,
          selectionRangeCount: selection.rangeCount,
          selectionAnchorNodeName: selection.anchorNode ? selection.anchorNode.nodeName : null,
          selectionAnchorOffset: selection.anchorOffset,
          selectionFocusNodeName: selection.focusNode ? selection.focusNode.nodeName : null,
          selectionFocusOffset: selection.focusOffset,
          message: e ? '' + e : null,
          offset: offset
        }, null, 2),
        selectionState: JSON.stringify(selectionState.toJS(), null, 2)
      }); // allow the error to be thrown -
      // better than continuing in a broken state

      throw e;
    }
  } else {
    // IE doesn't support extend. This will mean no backward selection.
    // Extract the existing selection range and add focus to it.
    // Additionally, clone the selection range. IE11 throws an
    // InvalidStateError when attempting to access selection properties
    // after the range is detached.
    if (node && selection.rangeCount > 0) {
      var range = selection.getRangeAt(0);
      range.setEnd(node, offset);
      selection.addRange(range.cloneRange());
    }
  }
}

function addPointToSelection(selection, node, offset, selectionState) {
  var range = getCorrectDocumentFromNode(node).createRange(); // logging to catch bug that is being reported in t16250795

  if (offset > getNodeLength(node)) {
    // in this case we know that the call to 'range.setStart' is about to throw
    DraftJsDebugLogging.logSelectionStateFailure({
      anonymizedDom: getAnonymizedEditorDOM(node),
      extraParams: JSON.stringify({
        offset: offset
      }),
      selectionState: JSON.stringify(selectionState.toJS())
    });
    DraftEffects.handleExtensionCausedError();
  }

  range.setStart(node, offset); // IE sometimes throws Unspecified Error when trying to addRange

  if (isIE) {
    try {
      selection.addRange(range);
    } catch (e) {
      if (true) {
        /* eslint-disable-next-line no-console */
        console.warn('Call to selection.addRange() threw exception: ', e);
      }
    }
  } else {
    selection.addRange(range);
  }
}

module.exports = {
  setDraftEditorSelection: setDraftEditorSelection,
  addFocusToSelection: addFocusToSelection
};

/***/ }),

/***/ "./node_modules/draft-js/lib/splitBlockInContentState.js":
/*!***************************************************************!*\
  !*** ./node_modules/draft-js/lib/splitBlockInContentState.js ***!
  \***************************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";
/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @format
 * 
 * @emails oncall+draft_js
 */


var ContentBlockNode = __webpack_require__(/*! ./ContentBlockNode */ "./node_modules/draft-js/lib/ContentBlockNode.js");

var generateRandomKey = __webpack_require__(/*! ./generateRandomKey */ "./node_modules/draft-js/lib/generateRandomKey.js");

var Immutable = __webpack_require__(/*! immutable */ "./node_modules/draft-js/node_modules/immutable/dist/immutable.js");

var invariant = __webpack_require__(/*! fbjs/lib/invariant */ "./node_modules/fbjs/lib/invariant.js");

var modifyBlockForContentState = __webpack_require__(/*! ./modifyBlockForContentState */ "./node_modules/draft-js/lib/modifyBlockForContentState.js");

var List = Immutable.List,
    Map = Immutable.Map;

var transformBlock = function transformBlock(key, blockMap, func) {
  if (!key) {
    return;
  }

  var block = blockMap.get(key);

  if (!block) {
    return;
  }

  blockMap.set(key, func(block));
};

var updateBlockMapLinks = function updateBlockMapLinks(blockMap, originalBlock, belowBlock) {
  return blockMap.withMutations(function (blocks) {
    var originalBlockKey = originalBlock.getKey();
    var belowBlockKey = belowBlock.getKey(); // update block parent

    transformBlock(originalBlock.getParentKey(), blocks, function (block) {
      var parentChildrenList = block.getChildKeys();
      var insertionIndex = parentChildrenList.indexOf(originalBlockKey) + 1;
      var newChildrenArray = parentChildrenList.toArray();
      newChildrenArray.splice(insertionIndex, 0, belowBlockKey);
      return block.merge({
        children: List(newChildrenArray)
      });
    }); // update original next block

    transformBlock(originalBlock.getNextSiblingKey(), blocks, function (block) {
      return block.merge({
        prevSibling: belowBlockKey
      });
    }); // update original block

    transformBlock(originalBlockKey, blocks, function (block) {
      return block.merge({
        nextSibling: belowBlockKey
      });
    }); // update below block

    transformBlock(belowBlockKey, blocks, function (block) {
      return block.merge({
        prevSibling: originalBlockKey
      });
    });
  });
};

var splitBlockInContentState = function splitBlockInContentState(contentState, selectionState) {
  !selectionState.isCollapsed() ?  true ? invariant(false, 'Selection range must be collapsed.') : 0 : void 0;
  var key = selectionState.getAnchorKey();
  var blockMap = contentState.getBlockMap();
  var blockToSplit = blockMap.get(key);
  var text = blockToSplit.getText();

  if (!text) {
    var blockType = blockToSplit.getType();

    if (blockType === 'unordered-list-item' || blockType === 'ordered-list-item') {
      return modifyBlockForContentState(contentState, selectionState, function (block) {
        return block.merge({
          type: 'unstyled',
          depth: 0
        });
      });
    }
  }

  var offset = selectionState.getAnchorOffset();
  var chars = blockToSplit.getCharacterList();
  var keyBelow = generateRandomKey();
  var isExperimentalTreeBlock = blockToSplit instanceof ContentBlockNode;
  var blockAbove = blockToSplit.merge({
    text: text.slice(0, offset),
    characterList: chars.slice(0, offset)
  });
  var blockBelow = blockAbove.merge({
    key: keyBelow,
    text: text.slice(offset),
    characterList: chars.slice(offset),
    data: Map()
  });
  var blocksBefore = blockMap.toSeq().takeUntil(function (v) {
    return v === blockToSplit;
  });
  var blocksAfter = blockMap.toSeq().skipUntil(function (v) {
    return v === blockToSplit;
  }).rest();
  var newBlocks = blocksBefore.concat([[key, blockAbove], [keyBelow, blockBelow]], blocksAfter).toOrderedMap();

  if (isExperimentalTreeBlock) {
    !blockToSplit.getChildKeys().isEmpty() ?  true ? invariant(false, 'ContentBlockNode must not have children') : 0 : void 0;
    newBlocks = updateBlockMapLinks(newBlocks, blockAbove, blockBelow);
  }

  return contentState.merge({
    blockMap: newBlocks,
    selectionBefore: selectionState,
    selectionAfter: selectionState.merge({
      anchorKey: keyBelow,
      anchorOffset: 0,
      focusKey: keyBelow,
      focusOffset: 0,
      isBackward: false
    })
  });
};

module.exports = splitBlockInContentState;

/***/ }),

/***/ "./node_modules/draft-js/lib/splitTextIntoTextBlocks.js":
/*!**************************************************************!*\
  !*** ./node_modules/draft-js/lib/splitTextIntoTextBlocks.js ***!
  \**************************************************************/
/***/ ((module) => {

"use strict";
/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @format
 * 
 * @emails oncall+draft_js
 */


var NEWLINE_REGEX = /\r\n?|\n/g;

function splitTextIntoTextBlocks(text) {
  return text.split(NEWLINE_REGEX);
}

module.exports = splitTextIntoTextBlocks;

/***/ }),

/***/ "./node_modules/draft-js/lib/uuid.js":
/*!*******************************************!*\
  !*** ./node_modules/draft-js/lib/uuid.js ***!
  \*******************************************/
/***/ ((module) => {

"use strict";


/**
 * Copyright 2004-present Facebook. All Rights Reserved.
 *
 * @typechecks
 * 
 * @format
 */

/*eslint-disable no-bitwise */

/**
 * Based on the rfc4122-compliant solution posted at
 * http://stackoverflow.com/questions/105034
 */
function uuid() {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
    var r = Math.random() * 16 | 0;
    var v = c == 'x' ? r : r & 0x3 | 0x8;
    return v.toString(16);
  });
}

module.exports = uuid;

/***/ }),

/***/ "./node_modules/draft-js/node_modules/immutable/dist/immutable.js":
/*!************************************************************************!*\
  !*** ./node_modules/draft-js/node_modules/immutable/dist/immutable.js ***!
  \************************************************************************/
/***/ (function(module) {

/**
 *  Copyright (c) 2014-2015, Facebook, Inc.
 *  All rights reserved.
 *
 *  This source code is licensed under the BSD-style license found in the
 *  LICENSE file in the root directory of this source tree. An additional grant
 *  of patent rights can be found in the PATENTS file in the same directory.
 */

(function (global, factory) {
   true ? module.exports = factory() :
  0;
}(this, function () { 'use strict';var SLICE$0 = Array.prototype.slice;

  function createClass(ctor, superClass) {
    if (superClass) {
      ctor.prototype = Object.create(superClass.prototype);
    }
    ctor.prototype.constructor = ctor;
  }

  function Iterable(value) {
      return isIterable(value) ? value : Seq(value);
    }


  createClass(KeyedIterable, Iterable);
    function KeyedIterable(value) {
      return isKeyed(value) ? value : KeyedSeq(value);
    }


  createClass(IndexedIterable, Iterable);
    function IndexedIterable(value) {
      return isIndexed(value) ? value : IndexedSeq(value);
    }


  createClass(SetIterable, Iterable);
    function SetIterable(value) {
      return isIterable(value) && !isAssociative(value) ? value : SetSeq(value);
    }



  function isIterable(maybeIterable) {
    return !!(maybeIterable && maybeIterable[IS_ITERABLE_SENTINEL]);
  }

  function isKeyed(maybeKeyed) {
    return !!(maybeKeyed && maybeKeyed[IS_KEYED_SENTINEL]);
  }

  function isIndexed(maybeIndexed) {
    return !!(maybeIndexed && maybeIndexed[IS_INDEXED_SENTINEL]);
  }

  function isAssociative(maybeAssociative) {
    return isKeyed(maybeAssociative) || isIndexed(maybeAssociative);
  }

  function isOrdered(maybeOrdered) {
    return !!(maybeOrdered && maybeOrdered[IS_ORDERED_SENTINEL]);
  }

  Iterable.isIterable = isIterable;
  Iterable.isKeyed = isKeyed;
  Iterable.isIndexed = isIndexed;
  Iterable.isAssociative = isAssociative;
  Iterable.isOrdered = isOrdered;

  Iterable.Keyed = KeyedIterable;
  Iterable.Indexed = IndexedIterable;
  Iterable.Set = SetIterable;


  var IS_ITERABLE_SENTINEL = '@@__IMMUTABLE_ITERABLE__@@';
  var IS_KEYED_SENTINEL = '@@__IMMUTABLE_KEYED__@@';
  var IS_INDEXED_SENTINEL = '@@__IMMUTABLE_INDEXED__@@';
  var IS_ORDERED_SENTINEL = '@@__IMMUTABLE_ORDERED__@@';

  // Used for setting prototype methods that IE8 chokes on.
  var DELETE = 'delete';

  // Constants describing the size of trie nodes.
  var SHIFT = 5; // Resulted in best performance after ______?
  var SIZE = 1 << SHIFT;
  var MASK = SIZE - 1;

  // A consistent shared value representing "not set" which equals nothing other
  // than itself, and nothing that could be provided externally.
  var NOT_SET = {};

  // Boolean references, Rough equivalent of `bool &`.
  var CHANGE_LENGTH = { value: false };
  var DID_ALTER = { value: false };

  function MakeRef(ref) {
    ref.value = false;
    return ref;
  }

  function SetRef(ref) {
    ref && (ref.value = true);
  }

  // A function which returns a value representing an "owner" for transient writes
  // to tries. The return value will only ever equal itself, and will not equal
  // the return of any subsequent call of this function.
  function OwnerID() {}

  // http://jsperf.com/copy-array-inline
  function arrCopy(arr, offset) {
    offset = offset || 0;
    var len = Math.max(0, arr.length - offset);
    var newArr = new Array(len);
    for (var ii = 0; ii < len; ii++) {
      newArr[ii] = arr[ii + offset];
    }
    return newArr;
  }

  function ensureSize(iter) {
    if (iter.size === undefined) {
      iter.size = iter.__iterate(returnTrue);
    }
    return iter.size;
  }

  function wrapIndex(iter, index) {
    // This implements "is array index" which the ECMAString spec defines as:
    //
    //     A String property name P is an array index if and only if
    //     ToString(ToUint32(P)) is equal to P and ToUint32(P) is not equal
    //     to 2^32−1.
    //
    // http://www.ecma-international.org/ecma-262/6.0/#sec-array-exotic-objects
    if (typeof index !== 'number') {
      var uint32Index = index >>> 0; // N >>> 0 is shorthand for ToUint32
      if ('' + uint32Index !== index || uint32Index === 4294967295) {
        return NaN;
      }
      index = uint32Index;
    }
    return index < 0 ? ensureSize(iter) + index : index;
  }

  function returnTrue() {
    return true;
  }

  function wholeSlice(begin, end, size) {
    return (begin === 0 || (size !== undefined && begin <= -size)) &&
      (end === undefined || (size !== undefined && end >= size));
  }

  function resolveBegin(begin, size) {
    return resolveIndex(begin, size, 0);
  }

  function resolveEnd(end, size) {
    return resolveIndex(end, size, size);
  }

  function resolveIndex(index, size, defaultIndex) {
    return index === undefined ?
      defaultIndex :
      index < 0 ?
        Math.max(0, size + index) :
        size === undefined ?
          index :
          Math.min(size, index);
  }

  /* global Symbol */

  var ITERATE_KEYS = 0;
  var ITERATE_VALUES = 1;
  var ITERATE_ENTRIES = 2;

  var REAL_ITERATOR_SYMBOL = typeof Symbol === 'function' && Symbol.iterator;
  var FAUX_ITERATOR_SYMBOL = '@@iterator';

  var ITERATOR_SYMBOL = REAL_ITERATOR_SYMBOL || FAUX_ITERATOR_SYMBOL;


  function Iterator(next) {
      this.next = next;
    }

    Iterator.prototype.toString = function() {
      return '[Iterator]';
    };


  Iterator.KEYS = ITERATE_KEYS;
  Iterator.VALUES = ITERATE_VALUES;
  Iterator.ENTRIES = ITERATE_ENTRIES;

  Iterator.prototype.inspect =
  Iterator.prototype.toSource = function () { return this.toString(); }
  Iterator.prototype[ITERATOR_SYMBOL] = function () {
    return this;
  };


  function iteratorValue(type, k, v, iteratorResult) {
    var value = type === 0 ? k : type === 1 ? v : [k, v];
    iteratorResult ? (iteratorResult.value = value) : (iteratorResult = {
      value: value, done: false
    });
    return iteratorResult;
  }

  function iteratorDone() {
    return { value: undefined, done: true };
  }

  function hasIterator(maybeIterable) {
    return !!getIteratorFn(maybeIterable);
  }

  function isIterator(maybeIterator) {
    return maybeIterator && typeof maybeIterator.next === 'function';
  }

  function getIterator(iterable) {
    var iteratorFn = getIteratorFn(iterable);
    return iteratorFn && iteratorFn.call(iterable);
  }

  function getIteratorFn(iterable) {
    var iteratorFn = iterable && (
      (REAL_ITERATOR_SYMBOL && iterable[REAL_ITERATOR_SYMBOL]) ||
      iterable[FAUX_ITERATOR_SYMBOL]
    );
    if (typeof iteratorFn === 'function') {
      return iteratorFn;
    }
  }

  function isArrayLike(value) {
    return value && typeof value.length === 'number';
  }

  createClass(Seq, Iterable);
    function Seq(value) {
      return value === null || value === undefined ? emptySequence() :
        isIterable(value) ? value.toSeq() : seqFromValue(value);
    }

    Seq.of = function(/*...values*/) {
      return Seq(arguments);
    };

    Seq.prototype.toSeq = function() {
      return this;
    };

    Seq.prototype.toString = function() {
      return this.__toString('Seq {', '}');
    };

    Seq.prototype.cacheResult = function() {
      if (!this._cache && this.__iterateUncached) {
        this._cache = this.entrySeq().toArray();
        this.size = this._cache.length;
      }
      return this;
    };

    // abstract __iterateUncached(fn, reverse)

    Seq.prototype.__iterate = function(fn, reverse) {
      return seqIterate(this, fn, reverse, true);
    };

    // abstract __iteratorUncached(type, reverse)

    Seq.prototype.__iterator = function(type, reverse) {
      return seqIterator(this, type, reverse, true);
    };



  createClass(KeyedSeq, Seq);
    function KeyedSeq(value) {
      return value === null || value === undefined ?
        emptySequence().toKeyedSeq() :
        isIterable(value) ?
          (isKeyed(value) ? value.toSeq() : value.fromEntrySeq()) :
          keyedSeqFromValue(value);
    }

    KeyedSeq.prototype.toKeyedSeq = function() {
      return this;
    };



  createClass(IndexedSeq, Seq);
    function IndexedSeq(value) {
      return value === null || value === undefined ? emptySequence() :
        !isIterable(value) ? indexedSeqFromValue(value) :
        isKeyed(value) ? value.entrySeq() : value.toIndexedSeq();
    }

    IndexedSeq.of = function(/*...values*/) {
      return IndexedSeq(arguments);
    };

    IndexedSeq.prototype.toIndexedSeq = function() {
      return this;
    };

    IndexedSeq.prototype.toString = function() {
      return this.__toString('Seq [', ']');
    };

    IndexedSeq.prototype.__iterate = function(fn, reverse) {
      return seqIterate(this, fn, reverse, false);
    };

    IndexedSeq.prototype.__iterator = function(type, reverse) {
      return seqIterator(this, type, reverse, false);
    };



  createClass(SetSeq, Seq);
    function SetSeq(value) {
      return (
        value === null || value === undefined ? emptySequence() :
        !isIterable(value) ? indexedSeqFromValue(value) :
        isKeyed(value) ? value.entrySeq() : value
      ).toSetSeq();
    }

    SetSeq.of = function(/*...values*/) {
      return SetSeq(arguments);
    };

    SetSeq.prototype.toSetSeq = function() {
      return this;
    };



  Seq.isSeq = isSeq;
  Seq.Keyed = KeyedSeq;
  Seq.Set = SetSeq;
  Seq.Indexed = IndexedSeq;

  var IS_SEQ_SENTINEL = '@@__IMMUTABLE_SEQ__@@';

  Seq.prototype[IS_SEQ_SENTINEL] = true;



  createClass(ArraySeq, IndexedSeq);
    function ArraySeq(array) {
      this._array = array;
      this.size = array.length;
    }

    ArraySeq.prototype.get = function(index, notSetValue) {
      return this.has(index) ? this._array[wrapIndex(this, index)] : notSetValue;
    };

    ArraySeq.prototype.__iterate = function(fn, reverse) {
      var array = this._array;
      var maxIndex = array.length - 1;
      for (var ii = 0; ii <= maxIndex; ii++) {
        if (fn(array[reverse ? maxIndex - ii : ii], ii, this) === false) {
          return ii + 1;
        }
      }
      return ii;
    };

    ArraySeq.prototype.__iterator = function(type, reverse) {
      var array = this._array;
      var maxIndex = array.length - 1;
      var ii = 0;
      return new Iterator(function() 
        {return ii > maxIndex ?
          iteratorDone() :
          iteratorValue(type, ii, array[reverse ? maxIndex - ii++ : ii++])}
      );
    };



  createClass(ObjectSeq, KeyedSeq);
    function ObjectSeq(object) {
      var keys = Object.keys(object);
      this._object = object;
      this._keys = keys;
      this.size = keys.length;
    }

    ObjectSeq.prototype.get = function(key, notSetValue) {
      if (notSetValue !== undefined && !this.has(key)) {
        return notSetValue;
      }
      return this._object[key];
    };

    ObjectSeq.prototype.has = function(key) {
      return this._object.hasOwnProperty(key);
    };

    ObjectSeq.prototype.__iterate = function(fn, reverse) {
      var object = this._object;
      var keys = this._keys;
      var maxIndex = keys.length - 1;
      for (var ii = 0; ii <= maxIndex; ii++) {
        var key = keys[reverse ? maxIndex - ii : ii];
        if (fn(object[key], key, this) === false) {
          return ii + 1;
        }
      }
      return ii;
    };

    ObjectSeq.prototype.__iterator = function(type, reverse) {
      var object = this._object;
      var keys = this._keys;
      var maxIndex = keys.length - 1;
      var ii = 0;
      return new Iterator(function()  {
        var key = keys[reverse ? maxIndex - ii : ii];
        return ii++ > maxIndex ?
          iteratorDone() :
          iteratorValue(type, key, object[key]);
      });
    };

  ObjectSeq.prototype[IS_ORDERED_SENTINEL] = true;


  createClass(IterableSeq, IndexedSeq);
    function IterableSeq(iterable) {
      this._iterable = iterable;
      this.size = iterable.length || iterable.size;
    }

    IterableSeq.prototype.__iterateUncached = function(fn, reverse) {
      if (reverse) {
        return this.cacheResult().__iterate(fn, reverse);
      }
      var iterable = this._iterable;
      var iterator = getIterator(iterable);
      var iterations = 0;
      if (isIterator(iterator)) {
        var step;
        while (!(step = iterator.next()).done) {
          if (fn(step.value, iterations++, this) === false) {
            break;
          }
        }
      }
      return iterations;
    };

    IterableSeq.prototype.__iteratorUncached = function(type, reverse) {
      if (reverse) {
        return this.cacheResult().__iterator(type, reverse);
      }
      var iterable = this._iterable;
      var iterator = getIterator(iterable);
      if (!isIterator(iterator)) {
        return new Iterator(iteratorDone);
      }
      var iterations = 0;
      return new Iterator(function()  {
        var step = iterator.next();
        return step.done ? step : iteratorValue(type, iterations++, step.value);
      });
    };



  createClass(IteratorSeq, IndexedSeq);
    function IteratorSeq(iterator) {
      this._iterator = iterator;
      this._iteratorCache = [];
    }

    IteratorSeq.prototype.__iterateUncached = function(fn, reverse) {
      if (reverse) {
        return this.cacheResult().__iterate(fn, reverse);
      }
      var iterator = this._iterator;
      var cache = this._iteratorCache;
      var iterations = 0;
      while (iterations < cache.length) {
        if (fn(cache[iterations], iterations++, this) === false) {
          return iterations;
        }
      }
      var step;
      while (!(step = iterator.next()).done) {
        var val = step.value;
        cache[iterations] = val;
        if (fn(val, iterations++, this) === false) {
          break;
        }
      }
      return iterations;
    };

    IteratorSeq.prototype.__iteratorUncached = function(type, reverse) {
      if (reverse) {
        return this.cacheResult().__iterator(type, reverse);
      }
      var iterator = this._iterator;
      var cache = this._iteratorCache;
      var iterations = 0;
      return new Iterator(function()  {
        if (iterations >= cache.length) {
          var step = iterator.next();
          if (step.done) {
            return step;
          }
          cache[iterations] = step.value;
        }
        return iteratorValue(type, iterations, cache[iterations++]);
      });
    };




  // # pragma Helper functions

  function isSeq(maybeSeq) {
    return !!(maybeSeq && maybeSeq[IS_SEQ_SENTINEL]);
  }

  var EMPTY_SEQ;

  function emptySequence() {
    return EMPTY_SEQ || (EMPTY_SEQ = new ArraySeq([]));
  }

  function keyedSeqFromValue(value) {
    var seq =
      Array.isArray(value) ? new ArraySeq(value).fromEntrySeq() :
      isIterator(value) ? new IteratorSeq(value).fromEntrySeq() :
      hasIterator(value) ? new IterableSeq(value).fromEntrySeq() :
      typeof value === 'object' ? new ObjectSeq(value) :
      undefined;
    if (!seq) {
      throw new TypeError(
        'Expected Array or iterable object of [k, v] entries, '+
        'or keyed object: ' + value
      );
    }
    return seq;
  }

  function indexedSeqFromValue(value) {
    var seq = maybeIndexedSeqFromValue(value);
    if (!seq) {
      throw new TypeError(
        'Expected Array or iterable object of values: ' + value
      );
    }
    return seq;
  }

  function seqFromValue(value) {
    var seq = maybeIndexedSeqFromValue(value) ||
      (typeof value === 'object' && new ObjectSeq(value));
    if (!seq) {
      throw new TypeError(
        'Expected Array or iterable object of values, or keyed object: ' + value
      );
    }
    return seq;
  }

  function maybeIndexedSeqFromValue(value) {
    return (
      isArrayLike(value) ? new ArraySeq(value) :
      isIterator(value) ? new IteratorSeq(value) :
      hasIterator(value) ? new IterableSeq(value) :
      undefined
    );
  }

  function seqIterate(seq, fn, reverse, useKeys) {
    var cache = seq._cache;
    if (cache) {
      var maxIndex = cache.length - 1;
      for (var ii = 0; ii <= maxIndex; ii++) {
        var entry = cache[reverse ? maxIndex - ii : ii];
        if (fn(entry[1], useKeys ? entry[0] : ii, seq) === false) {
          return ii + 1;
        }
      }
      return ii;
    }
    return seq.__iterateUncached(fn, reverse);
  }

  function seqIterator(seq, type, reverse, useKeys) {
    var cache = seq._cache;
    if (cache) {
      var maxIndex = cache.length - 1;
      var ii = 0;
      return new Iterator(function()  {
        var entry = cache[reverse ? maxIndex - ii : ii];
        return ii++ > maxIndex ?
          iteratorDone() :
          iteratorValue(type, useKeys ? entry[0] : ii - 1, entry[1]);
      });
    }
    return seq.__iteratorUncached(type, reverse);
  }

  function fromJS(json, converter) {
    return converter ?
      fromJSWith(converter, json, '', {'': json}) :
      fromJSDefault(json);
  }

  function fromJSWith(converter, json, key, parentJSON) {
    if (Array.isArray(json)) {
      return converter.call(parentJSON, key, IndexedSeq(json).map(function(v, k)  {return fromJSWith(converter, v, k, json)}));
    }
    if (isPlainObj(json)) {
      return converter.call(parentJSON, key, KeyedSeq(json).map(function(v, k)  {return fromJSWith(converter, v, k, json)}));
    }
    return json;
  }

  function fromJSDefault(json) {
    if (Array.isArray(json)) {
      return IndexedSeq(json).map(fromJSDefault).toList();
    }
    if (isPlainObj(json)) {
      return KeyedSeq(json).map(fromJSDefault).toMap();
    }
    return json;
  }

  function isPlainObj(value) {
    return value && (value.constructor === Object || value.constructor === undefined);
  }

  /**
   * An extension of the "same-value" algorithm as [described for use by ES6 Map
   * and Set](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Map#Key_equality)
   *
   * NaN is considered the same as NaN, however -0 and 0 are considered the same
   * value, which is different from the algorithm described by
   * [`Object.is`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/is).
   *
   * This is extended further to allow Objects to describe the values they
   * represent, by way of `valueOf` or `equals` (and `hashCode`).
   *
   * Note: because of this extension, the key equality of Immutable.Map and the
   * value equality of Immutable.Set will differ from ES6 Map and Set.
   *
   * ### Defining custom values
   *
   * The easiest way to describe the value an object represents is by implementing
   * `valueOf`. For example, `Date` represents a value by returning a unix
   * timestamp for `valueOf`:
   *
   *     var date1 = new Date(1234567890000); // Fri Feb 13 2009 ...
   *     var date2 = new Date(1234567890000);
   *     date1.valueOf(); // 1234567890000
   *     assert( date1 !== date2 );
   *     assert( Immutable.is( date1, date2 ) );
   *
   * Note: overriding `valueOf` may have other implications if you use this object
   * where JavaScript expects a primitive, such as implicit string coercion.
   *
   * For more complex types, especially collections, implementing `valueOf` may
   * not be performant. An alternative is to implement `equals` and `hashCode`.
   *
   * `equals` takes another object, presumably of similar type, and returns true
   * if the it is equal. Equality is symmetrical, so the same result should be
   * returned if this and the argument are flipped.
   *
   *     assert( a.equals(b) === b.equals(a) );
   *
   * `hashCode` returns a 32bit integer number representing the object which will
   * be used to determine how to store the value object in a Map or Set. You must
   * provide both or neither methods, one must not exist without the other.
   *
   * Also, an important relationship between these methods must be upheld: if two
   * values are equal, they *must* return the same hashCode. If the values are not
   * equal, they might have the same hashCode; this is called a hash collision,
   * and while undesirable for performance reasons, it is acceptable.
   *
   *     if (a.equals(b)) {
   *       assert( a.hashCode() === b.hashCode() );
   *     }
   *
   * All Immutable collections implement `equals` and `hashCode`.
   *
   */
  function is(valueA, valueB) {
    if (valueA === valueB || (valueA !== valueA && valueB !== valueB)) {
      return true;
    }
    if (!valueA || !valueB) {
      return false;
    }
    if (typeof valueA.valueOf === 'function' &&
        typeof valueB.valueOf === 'function') {
      valueA = valueA.valueOf();
      valueB = valueB.valueOf();
      if (valueA === valueB || (valueA !== valueA && valueB !== valueB)) {
        return true;
      }
      if (!valueA || !valueB) {
        return false;
      }
    }
    if (typeof valueA.equals === 'function' &&
        typeof valueB.equals === 'function' &&
        valueA.equals(valueB)) {
      return true;
    }
    return false;
  }

  function deepEqual(a, b) {
    if (a === b) {
      return true;
    }

    if (
      !isIterable(b) ||
      a.size !== undefined && b.size !== undefined && a.size !== b.size ||
      a.__hash !== undefined && b.__hash !== undefined && a.__hash !== b.__hash ||
      isKeyed(a) !== isKeyed(b) ||
      isIndexed(a) !== isIndexed(b) ||
      isOrdered(a) !== isOrdered(b)
    ) {
      return false;
    }

    if (a.size === 0 && b.size === 0) {
      return true;
    }

    var notAssociative = !isAssociative(a);

    if (isOrdered(a)) {
      var entries = a.entries();
      return b.every(function(v, k)  {
        var entry = entries.next().value;
        return entry && is(entry[1], v) && (notAssociative || is(entry[0], k));
      }) && entries.next().done;
    }

    var flipped = false;

    if (a.size === undefined) {
      if (b.size === undefined) {
        if (typeof a.cacheResult === 'function') {
          a.cacheResult();
        }
      } else {
        flipped = true;
        var _ = a;
        a = b;
        b = _;
      }
    }

    var allEqual = true;
    var bSize = b.__iterate(function(v, k)  {
      if (notAssociative ? !a.has(v) :
          flipped ? !is(v, a.get(k, NOT_SET)) : !is(a.get(k, NOT_SET), v)) {
        allEqual = false;
        return false;
      }
    });

    return allEqual && a.size === bSize;
  }

  createClass(Repeat, IndexedSeq);

    function Repeat(value, times) {
      if (!(this instanceof Repeat)) {
        return new Repeat(value, times);
      }
      this._value = value;
      this.size = times === undefined ? Infinity : Math.max(0, times);
      if (this.size === 0) {
        if (EMPTY_REPEAT) {
          return EMPTY_REPEAT;
        }
        EMPTY_REPEAT = this;
      }
    }

    Repeat.prototype.toString = function() {
      if (this.size === 0) {
        return 'Repeat []';
      }
      return 'Repeat [ ' + this._value + ' ' + this.size + ' times ]';
    };

    Repeat.prototype.get = function(index, notSetValue) {
      return this.has(index) ? this._value : notSetValue;
    };

    Repeat.prototype.includes = function(searchValue) {
      return is(this._value, searchValue);
    };

    Repeat.prototype.slice = function(begin, end) {
      var size = this.size;
      return wholeSlice(begin, end, size) ? this :
        new Repeat(this._value, resolveEnd(end, size) - resolveBegin(begin, size));
    };

    Repeat.prototype.reverse = function() {
      return this;
    };

    Repeat.prototype.indexOf = function(searchValue) {
      if (is(this._value, searchValue)) {
        return 0;
      }
      return -1;
    };

    Repeat.prototype.lastIndexOf = function(searchValue) {
      if (is(this._value, searchValue)) {
        return this.size;
      }
      return -1;
    };

    Repeat.prototype.__iterate = function(fn, reverse) {
      for (var ii = 0; ii < this.size; ii++) {
        if (fn(this._value, ii, this) === false) {
          return ii + 1;
        }
      }
      return ii;
    };

    Repeat.prototype.__iterator = function(type, reverse) {var this$0 = this;
      var ii = 0;
      return new Iterator(function() 
        {return ii < this$0.size ? iteratorValue(type, ii++, this$0._value) : iteratorDone()}
      );
    };

    Repeat.prototype.equals = function(other) {
      return other instanceof Repeat ?
        is(this._value, other._value) :
        deepEqual(other);
    };


  var EMPTY_REPEAT;

  function invariant(condition, error) {
    if (!condition) throw new Error(error);
  }

  createClass(Range, IndexedSeq);

    function Range(start, end, step) {
      if (!(this instanceof Range)) {
        return new Range(start, end, step);
      }
      invariant(step !== 0, 'Cannot step a Range by 0');
      start = start || 0;
      if (end === undefined) {
        end = Infinity;
      }
      step = step === undefined ? 1 : Math.abs(step);
      if (end < start) {
        step = -step;
      }
      this._start = start;
      this._end = end;
      this._step = step;
      this.size = Math.max(0, Math.ceil((end - start) / step - 1) + 1);
      if (this.size === 0) {
        if (EMPTY_RANGE) {
          return EMPTY_RANGE;
        }
        EMPTY_RANGE = this;
      }
    }

    Range.prototype.toString = function() {
      if (this.size === 0) {
        return 'Range []';
      }
      return 'Range [ ' +
        this._start + '...' + this._end +
        (this._step > 1 ? ' by ' + this._step : '') +
      ' ]';
    };

    Range.prototype.get = function(index, notSetValue) {
      return this.has(index) ?
        this._start + wrapIndex(this, index) * this._step :
        notSetValue;
    };

    Range.prototype.includes = function(searchValue) {
      var possibleIndex = (searchValue - this._start) / this._step;
      return possibleIndex >= 0 &&
        possibleIndex < this.size &&
        possibleIndex === Math.floor(possibleIndex);
    };

    Range.prototype.slice = function(begin, end) {
      if (wholeSlice(begin, end, this.size)) {
        return this;
      }
      begin = resolveBegin(begin, this.size);
      end = resolveEnd(end, this.size);
      if (end <= begin) {
        return new Range(0, 0);
      }
      return new Range(this.get(begin, this._end), this.get(end, this._end), this._step);
    };

    Range.prototype.indexOf = function(searchValue) {
      var offsetValue = searchValue - this._start;
      if (offsetValue % this._step === 0) {
        var index = offsetValue / this._step;
        if (index >= 0 && index < this.size) {
          return index
        }
      }
      return -1;
    };

    Range.prototype.lastIndexOf = function(searchValue) {
      return this.indexOf(searchValue);
    };

    Range.prototype.__iterate = function(fn, reverse) {
      var maxIndex = this.size - 1;
      var step = this._step;
      var value = reverse ? this._start + maxIndex * step : this._start;
      for (var ii = 0; ii <= maxIndex; ii++) {
        if (fn(value, ii, this) === false) {
          return ii + 1;
        }
        value += reverse ? -step : step;
      }
      return ii;
    };

    Range.prototype.__iterator = function(type, reverse) {
      var maxIndex = this.size - 1;
      var step = this._step;
      var value = reverse ? this._start + maxIndex * step : this._start;
      var ii = 0;
      return new Iterator(function()  {
        var v = value;
        value += reverse ? -step : step;
        return ii > maxIndex ? iteratorDone() : iteratorValue(type, ii++, v);
      });
    };

    Range.prototype.equals = function(other) {
      return other instanceof Range ?
        this._start === other._start &&
        this._end === other._end &&
        this._step === other._step :
        deepEqual(this, other);
    };


  var EMPTY_RANGE;

  createClass(Collection, Iterable);
    function Collection() {
      throw TypeError('Abstract');
    }


  createClass(KeyedCollection, Collection);function KeyedCollection() {}

  createClass(IndexedCollection, Collection);function IndexedCollection() {}

  createClass(SetCollection, Collection);function SetCollection() {}


  Collection.Keyed = KeyedCollection;
  Collection.Indexed = IndexedCollection;
  Collection.Set = SetCollection;

  var imul =
    typeof Math.imul === 'function' && Math.imul(0xffffffff, 2) === -2 ?
    Math.imul :
    function imul(a, b) {
      a = a | 0; // int
      b = b | 0; // int
      var c = a & 0xffff;
      var d = b & 0xffff;
      // Shift by 0 fixes the sign on the high part.
      return (c * d) + ((((a >>> 16) * d + c * (b >>> 16)) << 16) >>> 0) | 0; // int
    };

  // v8 has an optimization for storing 31-bit signed numbers.
  // Values which have either 00 or 11 as the high order bits qualify.
  // This function drops the highest order bit in a signed number, maintaining
  // the sign bit.
  function smi(i32) {
    return ((i32 >>> 1) & 0x40000000) | (i32 & 0xBFFFFFFF);
  }

  function hash(o) {
    if (o === false || o === null || o === undefined) {
      return 0;
    }
    if (typeof o.valueOf === 'function') {
      o = o.valueOf();
      if (o === false || o === null || o === undefined) {
        return 0;
      }
    }
    if (o === true) {
      return 1;
    }
    var type = typeof o;
    if (type === 'number') {
      var h = o | 0;
      if (h !== o) {
        h ^= o * 0xFFFFFFFF;
      }
      while (o > 0xFFFFFFFF) {
        o /= 0xFFFFFFFF;
        h ^= o;
      }
      return smi(h);
    }
    if (type === 'string') {
      return o.length > STRING_HASH_CACHE_MIN_STRLEN ? cachedHashString(o) : hashString(o);
    }
    if (typeof o.hashCode === 'function') {
      return o.hashCode();
    }
    if (type === 'object') {
      return hashJSObj(o);
    }
    if (typeof o.toString === 'function') {
      return hashString(o.toString());
    }
    throw new Error('Value type ' + type + ' cannot be hashed.');
  }

  function cachedHashString(string) {
    var hash = stringHashCache[string];
    if (hash === undefined) {
      hash = hashString(string);
      if (STRING_HASH_CACHE_SIZE === STRING_HASH_CACHE_MAX_SIZE) {
        STRING_HASH_CACHE_SIZE = 0;
        stringHashCache = {};
      }
      STRING_HASH_CACHE_SIZE++;
      stringHashCache[string] = hash;
    }
    return hash;
  }

  // http://jsperf.com/hashing-strings
  function hashString(string) {
    // This is the hash from JVM
    // The hash code for a string is computed as
    // s[0] * 31 ^ (n - 1) + s[1] * 31 ^ (n - 2) + ... + s[n - 1],
    // where s[i] is the ith character of the string and n is the length of
    // the string. We "mod" the result to make it between 0 (inclusive) and 2^31
    // (exclusive) by dropping high bits.
    var hash = 0;
    for (var ii = 0; ii < string.length; ii++) {
      hash = 31 * hash + string.charCodeAt(ii) | 0;
    }
    return smi(hash);
  }

  function hashJSObj(obj) {
    var hash;
    if (usingWeakMap) {
      hash = weakMap.get(obj);
      if (hash !== undefined) {
        return hash;
      }
    }

    hash = obj[UID_HASH_KEY];
    if (hash !== undefined) {
      return hash;
    }

    if (!canDefineProperty) {
      hash = obj.propertyIsEnumerable && obj.propertyIsEnumerable[UID_HASH_KEY];
      if (hash !== undefined) {
        return hash;
      }

      hash = getIENodeHash(obj);
      if (hash !== undefined) {
        return hash;
      }
    }

    hash = ++objHashUID;
    if (objHashUID & 0x40000000) {
      objHashUID = 0;
    }

    if (usingWeakMap) {
      weakMap.set(obj, hash);
    } else if (isExtensible !== undefined && isExtensible(obj) === false) {
      throw new Error('Non-extensible objects are not allowed as keys.');
    } else if (canDefineProperty) {
      Object.defineProperty(obj, UID_HASH_KEY, {
        'enumerable': false,
        'configurable': false,
        'writable': false,
        'value': hash
      });
    } else if (obj.propertyIsEnumerable !== undefined &&
               obj.propertyIsEnumerable === obj.constructor.prototype.propertyIsEnumerable) {
      // Since we can't define a non-enumerable property on the object
      // we'll hijack one of the less-used non-enumerable properties to
      // save our hash on it. Since this is a function it will not show up in
      // `JSON.stringify` which is what we want.
      obj.propertyIsEnumerable = function() {
        return this.constructor.prototype.propertyIsEnumerable.apply(this, arguments);
      };
      obj.propertyIsEnumerable[UID_HASH_KEY] = hash;
    } else if (obj.nodeType !== undefined) {
      // At this point we couldn't get the IE `uniqueID` to use as a hash
      // and we couldn't use a non-enumerable property to exploit the
      // dontEnum bug so we simply add the `UID_HASH_KEY` on the node
      // itself.
      obj[UID_HASH_KEY] = hash;
    } else {
      throw new Error('Unable to set a non-enumerable property on object.');
    }

    return hash;
  }

  // Get references to ES5 object methods.
  var isExtensible = Object.isExtensible;

  // True if Object.defineProperty works as expected. IE8 fails this test.
  var canDefineProperty = (function() {
    try {
      Object.defineProperty({}, '@', {});
      return true;
    } catch (e) {
      return false;
    }
  }());

  // IE has a `uniqueID` property on DOM nodes. We can construct the hash from it
  // and avoid memory leaks from the IE cloneNode bug.
  function getIENodeHash(node) {
    if (node && node.nodeType > 0) {
      switch (node.nodeType) {
        case 1: // Element
          return node.uniqueID;
        case 9: // Document
          return node.documentElement && node.documentElement.uniqueID;
      }
    }
  }

  // If possible, use a WeakMap.
  var usingWeakMap = typeof WeakMap === 'function';
  var weakMap;
  if (usingWeakMap) {
    weakMap = new WeakMap();
  }

  var objHashUID = 0;

  var UID_HASH_KEY = '__immutablehash__';
  if (typeof Symbol === 'function') {
    UID_HASH_KEY = Symbol(UID_HASH_KEY);
  }

  var STRING_HASH_CACHE_MIN_STRLEN = 16;
  var STRING_HASH_CACHE_MAX_SIZE = 255;
  var STRING_HASH_CACHE_SIZE = 0;
  var stringHashCache = {};

  function assertNotInfinite(size) {
    invariant(
      size !== Infinity,
      'Cannot perform this action with an infinite size.'
    );
  }

  createClass(Map, KeyedCollection);

    // @pragma Construction

    function Map(value) {
      return value === null || value === undefined ? emptyMap() :
        isMap(value) && !isOrdered(value) ? value :
        emptyMap().withMutations(function(map ) {
          var iter = KeyedIterable(value);
          assertNotInfinite(iter.size);
          iter.forEach(function(v, k)  {return map.set(k, v)});
        });
    }

    Map.prototype.toString = function() {
      return this.__toString('Map {', '}');
    };

    // @pragma Access

    Map.prototype.get = function(k, notSetValue) {
      return this._root ?
        this._root.get(0, undefined, k, notSetValue) :
        notSetValue;
    };

    // @pragma Modification

    Map.prototype.set = function(k, v) {
      return updateMap(this, k, v);
    };

    Map.prototype.setIn = function(keyPath, v) {
      return this.updateIn(keyPath, NOT_SET, function()  {return v});
    };

    Map.prototype.remove = function(k) {
      return updateMap(this, k, NOT_SET);
    };

    Map.prototype.deleteIn = function(keyPath) {
      return this.updateIn(keyPath, function()  {return NOT_SET});
    };

    Map.prototype.update = function(k, notSetValue, updater) {
      return arguments.length === 1 ?
        k(this) :
        this.updateIn([k], notSetValue, updater);
    };

    Map.prototype.updateIn = function(keyPath, notSetValue, updater) {
      if (!updater) {
        updater = notSetValue;
        notSetValue = undefined;
      }
      var updatedValue = updateInDeepMap(
        this,
        forceIterator(keyPath),
        notSetValue,
        updater
      );
      return updatedValue === NOT_SET ? undefined : updatedValue;
    };

    Map.prototype.clear = function() {
      if (this.size === 0) {
        return this;
      }
      if (this.__ownerID) {
        this.size = 0;
        this._root = null;
        this.__hash = undefined;
        this.__altered = true;
        return this;
      }
      return emptyMap();
    };

    // @pragma Composition

    Map.prototype.merge = function(/*...iters*/) {
      return mergeIntoMapWith(this, undefined, arguments);
    };

    Map.prototype.mergeWith = function(merger) {var iters = SLICE$0.call(arguments, 1);
      return mergeIntoMapWith(this, merger, iters);
    };

    Map.prototype.mergeIn = function(keyPath) {var iters = SLICE$0.call(arguments, 1);
      return this.updateIn(
        keyPath,
        emptyMap(),
        function(m ) {return typeof m.merge === 'function' ?
          m.merge.apply(m, iters) :
          iters[iters.length - 1]}
      );
    };

    Map.prototype.mergeDeep = function(/*...iters*/) {
      return mergeIntoMapWith(this, deepMerger, arguments);
    };

    Map.prototype.mergeDeepWith = function(merger) {var iters = SLICE$0.call(arguments, 1);
      return mergeIntoMapWith(this, deepMergerWith(merger), iters);
    };

    Map.prototype.mergeDeepIn = function(keyPath) {var iters = SLICE$0.call(arguments, 1);
      return this.updateIn(
        keyPath,
        emptyMap(),
        function(m ) {return typeof m.mergeDeep === 'function' ?
          m.mergeDeep.apply(m, iters) :
          iters[iters.length - 1]}
      );
    };

    Map.prototype.sort = function(comparator) {
      // Late binding
      return OrderedMap(sortFactory(this, comparator));
    };

    Map.prototype.sortBy = function(mapper, comparator) {
      // Late binding
      return OrderedMap(sortFactory(this, comparator, mapper));
    };

    // @pragma Mutability

    Map.prototype.withMutations = function(fn) {
      var mutable = this.asMutable();
      fn(mutable);
      return mutable.wasAltered() ? mutable.__ensureOwner(this.__ownerID) : this;
    };

    Map.prototype.asMutable = function() {
      return this.__ownerID ? this : this.__ensureOwner(new OwnerID());
    };

    Map.prototype.asImmutable = function() {
      return this.__ensureOwner();
    };

    Map.prototype.wasAltered = function() {
      return this.__altered;
    };

    Map.prototype.__iterator = function(type, reverse) {
      return new MapIterator(this, type, reverse);
    };

    Map.prototype.__iterate = function(fn, reverse) {var this$0 = this;
      var iterations = 0;
      this._root && this._root.iterate(function(entry ) {
        iterations++;
        return fn(entry[1], entry[0], this$0);
      }, reverse);
      return iterations;
    };

    Map.prototype.__ensureOwner = function(ownerID) {
      if (ownerID === this.__ownerID) {
        return this;
      }
      if (!ownerID) {
        this.__ownerID = ownerID;
        this.__altered = false;
        return this;
      }
      return makeMap(this.size, this._root, ownerID, this.__hash);
    };


  function isMap(maybeMap) {
    return !!(maybeMap && maybeMap[IS_MAP_SENTINEL]);
  }

  Map.isMap = isMap;

  var IS_MAP_SENTINEL = '@@__IMMUTABLE_MAP__@@';

  var MapPrototype = Map.prototype;
  MapPrototype[IS_MAP_SENTINEL] = true;
  MapPrototype[DELETE] = MapPrototype.remove;
  MapPrototype.removeIn = MapPrototype.deleteIn;


  // #pragma Trie Nodes



    function ArrayMapNode(ownerID, entries) {
      this.ownerID = ownerID;
      this.entries = entries;
    }

    ArrayMapNode.prototype.get = function(shift, keyHash, key, notSetValue) {
      var entries = this.entries;
      for (var ii = 0, len = entries.length; ii < len; ii++) {
        if (is(key, entries[ii][0])) {
          return entries[ii][1];
        }
      }
      return notSetValue;
    };

    ArrayMapNode.prototype.update = function(ownerID, shift, keyHash, key, value, didChangeSize, didAlter) {
      var removed = value === NOT_SET;

      var entries = this.entries;
      var idx = 0;
      for (var len = entries.length; idx < len; idx++) {
        if (is(key, entries[idx][0])) {
          break;
        }
      }
      var exists = idx < len;

      if (exists ? entries[idx][1] === value : removed) {
        return this;
      }

      SetRef(didAlter);
      (removed || !exists) && SetRef(didChangeSize);

      if (removed && entries.length === 1) {
        return; // undefined
      }

      if (!exists && !removed && entries.length >= MAX_ARRAY_MAP_SIZE) {
        return createNodes(ownerID, entries, key, value);
      }

      var isEditable = ownerID && ownerID === this.ownerID;
      var newEntries = isEditable ? entries : arrCopy(entries);

      if (exists) {
        if (removed) {
          idx === len - 1 ? newEntries.pop() : (newEntries[idx] = newEntries.pop());
        } else {
          newEntries[idx] = [key, value];
        }
      } else {
        newEntries.push([key, value]);
      }

      if (isEditable) {
        this.entries = newEntries;
        return this;
      }

      return new ArrayMapNode(ownerID, newEntries);
    };




    function BitmapIndexedNode(ownerID, bitmap, nodes) {
      this.ownerID = ownerID;
      this.bitmap = bitmap;
      this.nodes = nodes;
    }

    BitmapIndexedNode.prototype.get = function(shift, keyHash, key, notSetValue) {
      if (keyHash === undefined) {
        keyHash = hash(key);
      }
      var bit = (1 << ((shift === 0 ? keyHash : keyHash >>> shift) & MASK));
      var bitmap = this.bitmap;
      return (bitmap & bit) === 0 ? notSetValue :
        this.nodes[popCount(bitmap & (bit - 1))].get(shift + SHIFT, keyHash, key, notSetValue);
    };

    BitmapIndexedNode.prototype.update = function(ownerID, shift, keyHash, key, value, didChangeSize, didAlter) {
      if (keyHash === undefined) {
        keyHash = hash(key);
      }
      var keyHashFrag = (shift === 0 ? keyHash : keyHash >>> shift) & MASK;
      var bit = 1 << keyHashFrag;
      var bitmap = this.bitmap;
      var exists = (bitmap & bit) !== 0;

      if (!exists && value === NOT_SET) {
        return this;
      }

      var idx = popCount(bitmap & (bit - 1));
      var nodes = this.nodes;
      var node = exists ? nodes[idx] : undefined;
      var newNode = updateNode(node, ownerID, shift + SHIFT, keyHash, key, value, didChangeSize, didAlter);

      if (newNode === node) {
        return this;
      }

      if (!exists && newNode && nodes.length >= MAX_BITMAP_INDEXED_SIZE) {
        return expandNodes(ownerID, nodes, bitmap, keyHashFrag, newNode);
      }

      if (exists && !newNode && nodes.length === 2 && isLeafNode(nodes[idx ^ 1])) {
        return nodes[idx ^ 1];
      }

      if (exists && newNode && nodes.length === 1 && isLeafNode(newNode)) {
        return newNode;
      }

      var isEditable = ownerID && ownerID === this.ownerID;
      var newBitmap = exists ? newNode ? bitmap : bitmap ^ bit : bitmap | bit;
      var newNodes = exists ? newNode ?
        setIn(nodes, idx, newNode, isEditable) :
        spliceOut(nodes, idx, isEditable) :
        spliceIn(nodes, idx, newNode, isEditable);

      if (isEditable) {
        this.bitmap = newBitmap;
        this.nodes = newNodes;
        return this;
      }

      return new BitmapIndexedNode(ownerID, newBitmap, newNodes);
    };




    function HashArrayMapNode(ownerID, count, nodes) {
      this.ownerID = ownerID;
      this.count = count;
      this.nodes = nodes;
    }

    HashArrayMapNode.prototype.get = function(shift, keyHash, key, notSetValue) {
      if (keyHash === undefined) {
        keyHash = hash(key);
      }
      var idx = (shift === 0 ? keyHash : keyHash >>> shift) & MASK;
      var node = this.nodes[idx];
      return node ? node.get(shift + SHIFT, keyHash, key, notSetValue) : notSetValue;
    };

    HashArrayMapNode.prototype.update = function(ownerID, shift, keyHash, key, value, didChangeSize, didAlter) {
      if (keyHash === undefined) {
        keyHash = hash(key);
      }
      var idx = (shift === 0 ? keyHash : keyHash >>> shift) & MASK;
      var removed = value === NOT_SET;
      var nodes = this.nodes;
      var node = nodes[idx];

      if (removed && !node) {
        return this;
      }

      var newNode = updateNode(node, ownerID, shift + SHIFT, keyHash, key, value, didChangeSize, didAlter);
      if (newNode === node) {
        return this;
      }

      var newCount = this.count;
      if (!node) {
        newCount++;
      } else if (!newNode) {
        newCount--;
        if (newCount < MIN_HASH_ARRAY_MAP_SIZE) {
          return packNodes(ownerID, nodes, newCount, idx);
        }
      }

      var isEditable = ownerID && ownerID === this.ownerID;
      var newNodes = setIn(nodes, idx, newNode, isEditable);

      if (isEditable) {
        this.count = newCount;
        this.nodes = newNodes;
        return this;
      }

      return new HashArrayMapNode(ownerID, newCount, newNodes);
    };




    function HashCollisionNode(ownerID, keyHash, entries) {
      this.ownerID = ownerID;
      this.keyHash = keyHash;
      this.entries = entries;
    }

    HashCollisionNode.prototype.get = function(shift, keyHash, key, notSetValue) {
      var entries = this.entries;
      for (var ii = 0, len = entries.length; ii < len; ii++) {
        if (is(key, entries[ii][0])) {
          return entries[ii][1];
        }
      }
      return notSetValue;
    };

    HashCollisionNode.prototype.update = function(ownerID, shift, keyHash, key, value, didChangeSize, didAlter) {
      if (keyHash === undefined) {
        keyHash = hash(key);
      }

      var removed = value === NOT_SET;

      if (keyHash !== this.keyHash) {
        if (removed) {
          return this;
        }
        SetRef(didAlter);
        SetRef(didChangeSize);
        return mergeIntoNode(this, ownerID, shift, keyHash, [key, value]);
      }

      var entries = this.entries;
      var idx = 0;
      for (var len = entries.length; idx < len; idx++) {
        if (is(key, entries[idx][0])) {
          break;
        }
      }
      var exists = idx < len;

      if (exists ? entries[idx][1] === value : removed) {
        return this;
      }

      SetRef(didAlter);
      (removed || !exists) && SetRef(didChangeSize);

      if (removed && len === 2) {
        return new ValueNode(ownerID, this.keyHash, entries[idx ^ 1]);
      }

      var isEditable = ownerID && ownerID === this.ownerID;
      var newEntries = isEditable ? entries : arrCopy(entries);

      if (exists) {
        if (removed) {
          idx === len - 1 ? newEntries.pop() : (newEntries[idx] = newEntries.pop());
        } else {
          newEntries[idx] = [key, value];
        }
      } else {
        newEntries.push([key, value]);
      }

      if (isEditable) {
        this.entries = newEntries;
        return this;
      }

      return new HashCollisionNode(ownerID, this.keyHash, newEntries);
    };




    function ValueNode(ownerID, keyHash, entry) {
      this.ownerID = ownerID;
      this.keyHash = keyHash;
      this.entry = entry;
    }

    ValueNode.prototype.get = function(shift, keyHash, key, notSetValue) {
      return is(key, this.entry[0]) ? this.entry[1] : notSetValue;
    };

    ValueNode.prototype.update = function(ownerID, shift, keyHash, key, value, didChangeSize, didAlter) {
      var removed = value === NOT_SET;
      var keyMatch = is(key, this.entry[0]);
      if (keyMatch ? value === this.entry[1] : removed) {
        return this;
      }

      SetRef(didAlter);

      if (removed) {
        SetRef(didChangeSize);
        return; // undefined
      }

      if (keyMatch) {
        if (ownerID && ownerID === this.ownerID) {
          this.entry[1] = value;
          return this;
        }
        return new ValueNode(ownerID, this.keyHash, [key, value]);
      }

      SetRef(didChangeSize);
      return mergeIntoNode(this, ownerID, shift, hash(key), [key, value]);
    };



  // #pragma Iterators

  ArrayMapNode.prototype.iterate =
  HashCollisionNode.prototype.iterate = function (fn, reverse) {
    var entries = this.entries;
    for (var ii = 0, maxIndex = entries.length - 1; ii <= maxIndex; ii++) {
      if (fn(entries[reverse ? maxIndex - ii : ii]) === false) {
        return false;
      }
    }
  }

  BitmapIndexedNode.prototype.iterate =
  HashArrayMapNode.prototype.iterate = function (fn, reverse) {
    var nodes = this.nodes;
    for (var ii = 0, maxIndex = nodes.length - 1; ii <= maxIndex; ii++) {
      var node = nodes[reverse ? maxIndex - ii : ii];
      if (node && node.iterate(fn, reverse) === false) {
        return false;
      }
    }
  }

  ValueNode.prototype.iterate = function (fn, reverse) {
    return fn(this.entry);
  }

  createClass(MapIterator, Iterator);

    function MapIterator(map, type, reverse) {
      this._type = type;
      this._reverse = reverse;
      this._stack = map._root && mapIteratorFrame(map._root);
    }

    MapIterator.prototype.next = function() {
      var type = this._type;
      var stack = this._stack;
      while (stack) {
        var node = stack.node;
        var index = stack.index++;
        var maxIndex;
        if (node.entry) {
          if (index === 0) {
            return mapIteratorValue(type, node.entry);
          }
        } else if (node.entries) {
          maxIndex = node.entries.length - 1;
          if (index <= maxIndex) {
            return mapIteratorValue(type, node.entries[this._reverse ? maxIndex - index : index]);
          }
        } else {
          maxIndex = node.nodes.length - 1;
          if (index <= maxIndex) {
            var subNode = node.nodes[this._reverse ? maxIndex - index : index];
            if (subNode) {
              if (subNode.entry) {
                return mapIteratorValue(type, subNode.entry);
              }
              stack = this._stack = mapIteratorFrame(subNode, stack);
            }
            continue;
          }
        }
        stack = this._stack = this._stack.__prev;
      }
      return iteratorDone();
    };


  function mapIteratorValue(type, entry) {
    return iteratorValue(type, entry[0], entry[1]);
  }

  function mapIteratorFrame(node, prev) {
    return {
      node: node,
      index: 0,
      __prev: prev
    };
  }

  function makeMap(size, root, ownerID, hash) {
    var map = Object.create(MapPrototype);
    map.size = size;
    map._root = root;
    map.__ownerID = ownerID;
    map.__hash = hash;
    map.__altered = false;
    return map;
  }

  var EMPTY_MAP;
  function emptyMap() {
    return EMPTY_MAP || (EMPTY_MAP = makeMap(0));
  }

  function updateMap(map, k, v) {
    var newRoot;
    var newSize;
    if (!map._root) {
      if (v === NOT_SET) {
        return map;
      }
      newSize = 1;
      newRoot = new ArrayMapNode(map.__ownerID, [[k, v]]);
    } else {
      var didChangeSize = MakeRef(CHANGE_LENGTH);
      var didAlter = MakeRef(DID_ALTER);
      newRoot = updateNode(map._root, map.__ownerID, 0, undefined, k, v, didChangeSize, didAlter);
      if (!didAlter.value) {
        return map;
      }
      newSize = map.size + (didChangeSize.value ? v === NOT_SET ? -1 : 1 : 0);
    }
    if (map.__ownerID) {
      map.size = newSize;
      map._root = newRoot;
      map.__hash = undefined;
      map.__altered = true;
      return map;
    }
    return newRoot ? makeMap(newSize, newRoot) : emptyMap();
  }

  function updateNode(node, ownerID, shift, keyHash, key, value, didChangeSize, didAlter) {
    if (!node) {
      if (value === NOT_SET) {
        return node;
      }
      SetRef(didAlter);
      SetRef(didChangeSize);
      return new ValueNode(ownerID, keyHash, [key, value]);
    }
    return node.update(ownerID, shift, keyHash, key, value, didChangeSize, didAlter);
  }

  function isLeafNode(node) {
    return node.constructor === ValueNode || node.constructor === HashCollisionNode;
  }

  function mergeIntoNode(node, ownerID, shift, keyHash, entry) {
    if (node.keyHash === keyHash) {
      return new HashCollisionNode(ownerID, keyHash, [node.entry, entry]);
    }

    var idx1 = (shift === 0 ? node.keyHash : node.keyHash >>> shift) & MASK;
    var idx2 = (shift === 0 ? keyHash : keyHash >>> shift) & MASK;

    var newNode;
    var nodes = idx1 === idx2 ?
      [mergeIntoNode(node, ownerID, shift + SHIFT, keyHash, entry)] :
      ((newNode = new ValueNode(ownerID, keyHash, entry)), idx1 < idx2 ? [node, newNode] : [newNode, node]);

    return new BitmapIndexedNode(ownerID, (1 << idx1) | (1 << idx2), nodes);
  }

  function createNodes(ownerID, entries, key, value) {
    if (!ownerID) {
      ownerID = new OwnerID();
    }
    var node = new ValueNode(ownerID, hash(key), [key, value]);
    for (var ii = 0; ii < entries.length; ii++) {
      var entry = entries[ii];
      node = node.update(ownerID, 0, undefined, entry[0], entry[1]);
    }
    return node;
  }

  function packNodes(ownerID, nodes, count, excluding) {
    var bitmap = 0;
    var packedII = 0;
    var packedNodes = new Array(count);
    for (var ii = 0, bit = 1, len = nodes.length; ii < len; ii++, bit <<= 1) {
      var node = nodes[ii];
      if (node !== undefined && ii !== excluding) {
        bitmap |= bit;
        packedNodes[packedII++] = node;
      }
    }
    return new BitmapIndexedNode(ownerID, bitmap, packedNodes);
  }

  function expandNodes(ownerID, nodes, bitmap, including, node) {
    var count = 0;
    var expandedNodes = new Array(SIZE);
    for (var ii = 0; bitmap !== 0; ii++, bitmap >>>= 1) {
      expandedNodes[ii] = bitmap & 1 ? nodes[count++] : undefined;
    }
    expandedNodes[including] = node;
    return new HashArrayMapNode(ownerID, count + 1, expandedNodes);
  }

  function mergeIntoMapWith(map, merger, iterables) {
    var iters = [];
    for (var ii = 0; ii < iterables.length; ii++) {
      var value = iterables[ii];
      var iter = KeyedIterable(value);
      if (!isIterable(value)) {
        iter = iter.map(function(v ) {return fromJS(v)});
      }
      iters.push(iter);
    }
    return mergeIntoCollectionWith(map, merger, iters);
  }

  function deepMerger(existing, value, key) {
    return existing && existing.mergeDeep && isIterable(value) ?
      existing.mergeDeep(value) :
      is(existing, value) ? existing : value;
  }

  function deepMergerWith(merger) {
    return function(existing, value, key)  {
      if (existing && existing.mergeDeepWith && isIterable(value)) {
        return existing.mergeDeepWith(merger, value);
      }
      var nextValue = merger(existing, value, key);
      return is(existing, nextValue) ? existing : nextValue;
    };
  }

  function mergeIntoCollectionWith(collection, merger, iters) {
    iters = iters.filter(function(x ) {return x.size !== 0});
    if (iters.length === 0) {
      return collection;
    }
    if (collection.size === 0 && !collection.__ownerID && iters.length === 1) {
      return collection.constructor(iters[0]);
    }
    return collection.withMutations(function(collection ) {
      var mergeIntoMap = merger ?
        function(value, key)  {
          collection.update(key, NOT_SET, function(existing )
            {return existing === NOT_SET ? value : merger(existing, value, key)}
          );
        } :
        function(value, key)  {
          collection.set(key, value);
        }
      for (var ii = 0; ii < iters.length; ii++) {
        iters[ii].forEach(mergeIntoMap);
      }
    });
  }

  function updateInDeepMap(existing, keyPathIter, notSetValue, updater) {
    var isNotSet = existing === NOT_SET;
    var step = keyPathIter.next();
    if (step.done) {
      var existingValue = isNotSet ? notSetValue : existing;
      var newValue = updater(existingValue);
      return newValue === existingValue ? existing : newValue;
    }
    invariant(
      isNotSet || (existing && existing.set),
      'invalid keyPath'
    );
    var key = step.value;
    var nextExisting = isNotSet ? NOT_SET : existing.get(key, NOT_SET);
    var nextUpdated = updateInDeepMap(
      nextExisting,
      keyPathIter,
      notSetValue,
      updater
    );
    return nextUpdated === nextExisting ? existing :
      nextUpdated === NOT_SET ? existing.remove(key) :
      (isNotSet ? emptyMap() : existing).set(key, nextUpdated);
  }

  function popCount(x) {
    x = x - ((x >> 1) & 0x55555555);
    x = (x & 0x33333333) + ((x >> 2) & 0x33333333);
    x = (x + (x >> 4)) & 0x0f0f0f0f;
    x = x + (x >> 8);
    x = x + (x >> 16);
    return x & 0x7f;
  }

  function setIn(array, idx, val, canEdit) {
    var newArray = canEdit ? array : arrCopy(array);
    newArray[idx] = val;
    return newArray;
  }

  function spliceIn(array, idx, val, canEdit) {
    var newLen = array.length + 1;
    if (canEdit && idx + 1 === newLen) {
      array[idx] = val;
      return array;
    }
    var newArray = new Array(newLen);
    var after = 0;
    for (var ii = 0; ii < newLen; ii++) {
      if (ii === idx) {
        newArray[ii] = val;
        after = -1;
      } else {
        newArray[ii] = array[ii + after];
      }
    }
    return newArray;
  }

  function spliceOut(array, idx, canEdit) {
    var newLen = array.length - 1;
    if (canEdit && idx === newLen) {
      array.pop();
      return array;
    }
    var newArray = new Array(newLen);
    var after = 0;
    for (var ii = 0; ii < newLen; ii++) {
      if (ii === idx) {
        after = 1;
      }
      newArray[ii] = array[ii + after];
    }
    return newArray;
  }

  var MAX_ARRAY_MAP_SIZE = SIZE / 4;
  var MAX_BITMAP_INDEXED_SIZE = SIZE / 2;
  var MIN_HASH_ARRAY_MAP_SIZE = SIZE / 4;

  createClass(List, IndexedCollection);

    // @pragma Construction

    function List(value) {
      var empty = emptyList();
      if (value === null || value === undefined) {
        return empty;
      }
      if (isList(value)) {
        return value;
      }
      var iter = IndexedIterable(value);
      var size = iter.size;
      if (size === 0) {
        return empty;
      }
      assertNotInfinite(size);
      if (size > 0 && size < SIZE) {
        return makeList(0, size, SHIFT, null, new VNode(iter.toArray()));
      }
      return empty.withMutations(function(list ) {
        list.setSize(size);
        iter.forEach(function(v, i)  {return list.set(i, v)});
      });
    }

    List.of = function(/*...values*/) {
      return this(arguments);
    };

    List.prototype.toString = function() {
      return this.__toString('List [', ']');
    };

    // @pragma Access

    List.prototype.get = function(index, notSetValue) {
      index = wrapIndex(this, index);
      if (index >= 0 && index < this.size) {
        index += this._origin;
        var node = listNodeFor(this, index);
        return node && node.array[index & MASK];
      }
      return notSetValue;
    };

    // @pragma Modification

    List.prototype.set = function(index, value) {
      return updateList(this, index, value);
    };

    List.prototype.remove = function(index) {
      return !this.has(index) ? this :
        index === 0 ? this.shift() :
        index === this.size - 1 ? this.pop() :
        this.splice(index, 1);
    };

    List.prototype.insert = function(index, value) {
      return this.splice(index, 0, value);
    };

    List.prototype.clear = function() {
      if (this.size === 0) {
        return this;
      }
      if (this.__ownerID) {
        this.size = this._origin = this._capacity = 0;
        this._level = SHIFT;
        this._root = this._tail = null;
        this.__hash = undefined;
        this.__altered = true;
        return this;
      }
      return emptyList();
    };

    List.prototype.push = function(/*...values*/) {
      var values = arguments;
      var oldSize = this.size;
      return this.withMutations(function(list ) {
        setListBounds(list, 0, oldSize + values.length);
        for (var ii = 0; ii < values.length; ii++) {
          list.set(oldSize + ii, values[ii]);
        }
      });
    };

    List.prototype.pop = function() {
      return setListBounds(this, 0, -1);
    };

    List.prototype.unshift = function(/*...values*/) {
      var values = arguments;
      return this.withMutations(function(list ) {
        setListBounds(list, -values.length);
        for (var ii = 0; ii < values.length; ii++) {
          list.set(ii, values[ii]);
        }
      });
    };

    List.prototype.shift = function() {
      return setListBounds(this, 1);
    };

    // @pragma Composition

    List.prototype.merge = function(/*...iters*/) {
      return mergeIntoListWith(this, undefined, arguments);
    };

    List.prototype.mergeWith = function(merger) {var iters = SLICE$0.call(arguments, 1);
      return mergeIntoListWith(this, merger, iters);
    };

    List.prototype.mergeDeep = function(/*...iters*/) {
      return mergeIntoListWith(this, deepMerger, arguments);
    };

    List.prototype.mergeDeepWith = function(merger) {var iters = SLICE$0.call(arguments, 1);
      return mergeIntoListWith(this, deepMergerWith(merger), iters);
    };

    List.prototype.setSize = function(size) {
      return setListBounds(this, 0, size);
    };

    // @pragma Iteration

    List.prototype.slice = function(begin, end) {
      var size = this.size;
      if (wholeSlice(begin, end, size)) {
        return this;
      }
      return setListBounds(
        this,
        resolveBegin(begin, size),
        resolveEnd(end, size)
      );
    };

    List.prototype.__iterator = function(type, reverse) {
      var index = 0;
      var values = iterateList(this, reverse);
      return new Iterator(function()  {
        var value = values();
        return value === DONE ?
          iteratorDone() :
          iteratorValue(type, index++, value);
      });
    };

    List.prototype.__iterate = function(fn, reverse) {
      var index = 0;
      var values = iterateList(this, reverse);
      var value;
      while ((value = values()) !== DONE) {
        if (fn(value, index++, this) === false) {
          break;
        }
      }
      return index;
    };

    List.prototype.__ensureOwner = function(ownerID) {
      if (ownerID === this.__ownerID) {
        return this;
      }
      if (!ownerID) {
        this.__ownerID = ownerID;
        return this;
      }
      return makeList(this._origin, this._capacity, this._level, this._root, this._tail, ownerID, this.__hash);
    };


  function isList(maybeList) {
    return !!(maybeList && maybeList[IS_LIST_SENTINEL]);
  }

  List.isList = isList;

  var IS_LIST_SENTINEL = '@@__IMMUTABLE_LIST__@@';

  var ListPrototype = List.prototype;
  ListPrototype[IS_LIST_SENTINEL] = true;
  ListPrototype[DELETE] = ListPrototype.remove;
  ListPrototype.setIn = MapPrototype.setIn;
  ListPrototype.deleteIn =
  ListPrototype.removeIn = MapPrototype.removeIn;
  ListPrototype.update = MapPrototype.update;
  ListPrototype.updateIn = MapPrototype.updateIn;
  ListPrototype.mergeIn = MapPrototype.mergeIn;
  ListPrototype.mergeDeepIn = MapPrototype.mergeDeepIn;
  ListPrototype.withMutations = MapPrototype.withMutations;
  ListPrototype.asMutable = MapPrototype.asMutable;
  ListPrototype.asImmutable = MapPrototype.asImmutable;
  ListPrototype.wasAltered = MapPrototype.wasAltered;



    function VNode(array, ownerID) {
      this.array = array;
      this.ownerID = ownerID;
    }

    // TODO: seems like these methods are very similar

    VNode.prototype.removeBefore = function(ownerID, level, index) {
      if (index === level ? 1 << level :  false || this.array.length === 0) {
        return this;
      }
      var originIndex = (index >>> level) & MASK;
      if (originIndex >= this.array.length) {
        return new VNode([], ownerID);
      }
      var removingFirst = originIndex === 0;
      var newChild;
      if (level > 0) {
        var oldChild = this.array[originIndex];
        newChild = oldChild && oldChild.removeBefore(ownerID, level - SHIFT, index);
        if (newChild === oldChild && removingFirst) {
          return this;
        }
      }
      if (removingFirst && !newChild) {
        return this;
      }
      var editable = editableVNode(this, ownerID);
      if (!removingFirst) {
        for (var ii = 0; ii < originIndex; ii++) {
          editable.array[ii] = undefined;
        }
      }
      if (newChild) {
        editable.array[originIndex] = newChild;
      }
      return editable;
    };

    VNode.prototype.removeAfter = function(ownerID, level, index) {
      if (index === (level ? 1 << level : 0) || this.array.length === 0) {
        return this;
      }
      var sizeIndex = ((index - 1) >>> level) & MASK;
      if (sizeIndex >= this.array.length) {
        return this;
      }

      var newChild;
      if (level > 0) {
        var oldChild = this.array[sizeIndex];
        newChild = oldChild && oldChild.removeAfter(ownerID, level - SHIFT, index);
        if (newChild === oldChild && sizeIndex === this.array.length - 1) {
          return this;
        }
      }

      var editable = editableVNode(this, ownerID);
      editable.array.splice(sizeIndex + 1);
      if (newChild) {
        editable.array[sizeIndex] = newChild;
      }
      return editable;
    };



  var DONE = {};

  function iterateList(list, reverse) {
    var left = list._origin;
    var right = list._capacity;
    var tailPos = getTailOffset(right);
    var tail = list._tail;

    return iterateNodeOrLeaf(list._root, list._level, 0);

    function iterateNodeOrLeaf(node, level, offset) {
      return level === 0 ?
        iterateLeaf(node, offset) :
        iterateNode(node, level, offset);
    }

    function iterateLeaf(node, offset) {
      var array = offset === tailPos ? tail && tail.array : node && node.array;
      var from = offset > left ? 0 : left - offset;
      var to = right - offset;
      if (to > SIZE) {
        to = SIZE;
      }
      return function()  {
        if (from === to) {
          return DONE;
        }
        var idx = reverse ? --to : from++;
        return array && array[idx];
      };
    }

    function iterateNode(node, level, offset) {
      var values;
      var array = node && node.array;
      var from = offset > left ? 0 : (left - offset) >> level;
      var to = ((right - offset) >> level) + 1;
      if (to > SIZE) {
        to = SIZE;
      }
      return function()  {
        do {
          if (values) {
            var value = values();
            if (value !== DONE) {
              return value;
            }
            values = null;
          }
          if (from === to) {
            return DONE;
          }
          var idx = reverse ? --to : from++;
          values = iterateNodeOrLeaf(
            array && array[idx], level - SHIFT, offset + (idx << level)
          );
        } while (true);
      };
    }
  }

  function makeList(origin, capacity, level, root, tail, ownerID, hash) {
    var list = Object.create(ListPrototype);
    list.size = capacity - origin;
    list._origin = origin;
    list._capacity = capacity;
    list._level = level;
    list._root = root;
    list._tail = tail;
    list.__ownerID = ownerID;
    list.__hash = hash;
    list.__altered = false;
    return list;
  }

  var EMPTY_LIST;
  function emptyList() {
    return EMPTY_LIST || (EMPTY_LIST = makeList(0, 0, SHIFT));
  }

  function updateList(list, index, value) {
    index = wrapIndex(list, index);

    if (index !== index) {
      return list;
    }

    if (index >= list.size || index < 0) {
      return list.withMutations(function(list ) {
        index < 0 ?
          setListBounds(list, index).set(0, value) :
          setListBounds(list, 0, index + 1).set(index, value)
      });
    }

    index += list._origin;

    var newTail = list._tail;
    var newRoot = list._root;
    var didAlter = MakeRef(DID_ALTER);
    if (index >= getTailOffset(list._capacity)) {
      newTail = updateVNode(newTail, list.__ownerID, 0, index, value, didAlter);
    } else {
      newRoot = updateVNode(newRoot, list.__ownerID, list._level, index, value, didAlter);
    }

    if (!didAlter.value) {
      return list;
    }

    if (list.__ownerID) {
      list._root = newRoot;
      list._tail = newTail;
      list.__hash = undefined;
      list.__altered = true;
      return list;
    }
    return makeList(list._origin, list._capacity, list._level, newRoot, newTail);
  }

  function updateVNode(node, ownerID, level, index, value, didAlter) {
    var idx = (index >>> level) & MASK;
    var nodeHas = node && idx < node.array.length;
    if (!nodeHas && value === undefined) {
      return node;
    }

    var newNode;

    if (level > 0) {
      var lowerNode = node && node.array[idx];
      var newLowerNode = updateVNode(lowerNode, ownerID, level - SHIFT, index, value, didAlter);
      if (newLowerNode === lowerNode) {
        return node;
      }
      newNode = editableVNode(node, ownerID);
      newNode.array[idx] = newLowerNode;
      return newNode;
    }

    if (nodeHas && node.array[idx] === value) {
      return node;
    }

    SetRef(didAlter);

    newNode = editableVNode(node, ownerID);
    if (value === undefined && idx === newNode.array.length - 1) {
      newNode.array.pop();
    } else {
      newNode.array[idx] = value;
    }
    return newNode;
  }

  function editableVNode(node, ownerID) {
    if (ownerID && node && ownerID === node.ownerID) {
      return node;
    }
    return new VNode(node ? node.array.slice() : [], ownerID);
  }

  function listNodeFor(list, rawIndex) {
    if (rawIndex >= getTailOffset(list._capacity)) {
      return list._tail;
    }
    if (rawIndex < 1 << (list._level + SHIFT)) {
      var node = list._root;
      var level = list._level;
      while (node && level > 0) {
        node = node.array[(rawIndex >>> level) & MASK];
        level -= SHIFT;
      }
      return node;
    }
  }

  function setListBounds(list, begin, end) {
    // Sanitize begin & end using this shorthand for ToInt32(argument)
    // http://www.ecma-international.org/ecma-262/6.0/#sec-toint32
    if (begin !== undefined) {
      begin = begin | 0;
    }
    if (end !== undefined) {
      end = end | 0;
    }
    var owner = list.__ownerID || new OwnerID();
    var oldOrigin = list._origin;
    var oldCapacity = list._capacity;
    var newOrigin = oldOrigin + begin;
    var newCapacity = end === undefined ? oldCapacity : end < 0 ? oldCapacity + end : oldOrigin + end;
    if (newOrigin === oldOrigin && newCapacity === oldCapacity) {
      return list;
    }

    // If it's going to end after it starts, it's empty.
    if (newOrigin >= newCapacity) {
      return list.clear();
    }

    var newLevel = list._level;
    var newRoot = list._root;

    // New origin might need creating a higher root.
    var offsetShift = 0;
    while (newOrigin + offsetShift < 0) {
      newRoot = new VNode(newRoot && newRoot.array.length ? [undefined, newRoot] : [], owner);
      newLevel += SHIFT;
      offsetShift += 1 << newLevel;
    }
    if (offsetShift) {
      newOrigin += offsetShift;
      oldOrigin += offsetShift;
      newCapacity += offsetShift;
      oldCapacity += offsetShift;
    }

    var oldTailOffset = getTailOffset(oldCapacity);
    var newTailOffset = getTailOffset(newCapacity);

    // New size might need creating a higher root.
    while (newTailOffset >= 1 << (newLevel + SHIFT)) {
      newRoot = new VNode(newRoot && newRoot.array.length ? [newRoot] : [], owner);
      newLevel += SHIFT;
    }

    // Locate or create the new tail.
    var oldTail = list._tail;
    var newTail = newTailOffset < oldTailOffset ?
      listNodeFor(list, newCapacity - 1) :
      newTailOffset > oldTailOffset ? new VNode([], owner) : oldTail;

    // Merge Tail into tree.
    if (oldTail && newTailOffset > oldTailOffset && newOrigin < oldCapacity && oldTail.array.length) {
      newRoot = editableVNode(newRoot, owner);
      var node = newRoot;
      for (var level = newLevel; level > SHIFT; level -= SHIFT) {
        var idx = (oldTailOffset >>> level) & MASK;
        node = node.array[idx] = editableVNode(node.array[idx], owner);
      }
      node.array[(oldTailOffset >>> SHIFT) & MASK] = oldTail;
    }

    // If the size has been reduced, there's a chance the tail needs to be trimmed.
    if (newCapacity < oldCapacity) {
      newTail = newTail && newTail.removeAfter(owner, 0, newCapacity);
    }

    // If the new origin is within the tail, then we do not need a root.
    if (newOrigin >= newTailOffset) {
      newOrigin -= newTailOffset;
      newCapacity -= newTailOffset;
      newLevel = SHIFT;
      newRoot = null;
      newTail = newTail && newTail.removeBefore(owner, 0, newOrigin);

    // Otherwise, if the root has been trimmed, garbage collect.
    } else if (newOrigin > oldOrigin || newTailOffset < oldTailOffset) {
      offsetShift = 0;

      // Identify the new top root node of the subtree of the old root.
      while (newRoot) {
        var beginIndex = (newOrigin >>> newLevel) & MASK;
        if (beginIndex !== (newTailOffset >>> newLevel) & MASK) {
          break;
        }
        if (beginIndex) {
          offsetShift += (1 << newLevel) * beginIndex;
        }
        newLevel -= SHIFT;
        newRoot = newRoot.array[beginIndex];
      }

      // Trim the new sides of the new root.
      if (newRoot && newOrigin > oldOrigin) {
        newRoot = newRoot.removeBefore(owner, newLevel, newOrigin - offsetShift);
      }
      if (newRoot && newTailOffset < oldTailOffset) {
        newRoot = newRoot.removeAfter(owner, newLevel, newTailOffset - offsetShift);
      }
      if (offsetShift) {
        newOrigin -= offsetShift;
        newCapacity -= offsetShift;
      }
    }

    if (list.__ownerID) {
      list.size = newCapacity - newOrigin;
      list._origin = newOrigin;
      list._capacity = newCapacity;
      list._level = newLevel;
      list._root = newRoot;
      list._tail = newTail;
      list.__hash = undefined;
      list.__altered = true;
      return list;
    }
    return makeList(newOrigin, newCapacity, newLevel, newRoot, newTail);
  }

  function mergeIntoListWith(list, merger, iterables) {
    var iters = [];
    var maxSize = 0;
    for (var ii = 0; ii < iterables.length; ii++) {
      var value = iterables[ii];
      var iter = IndexedIterable(value);
      if (iter.size > maxSize) {
        maxSize = iter.size;
      }
      if (!isIterable(value)) {
        iter = iter.map(function(v ) {return fromJS(v)});
      }
      iters.push(iter);
    }
    if (maxSize > list.size) {
      list = list.setSize(maxSize);
    }
    return mergeIntoCollectionWith(list, merger, iters);
  }

  function getTailOffset(size) {
    return size < SIZE ? 0 : (((size - 1) >>> SHIFT) << SHIFT);
  }

  createClass(OrderedMap, Map);

    // @pragma Construction

    function OrderedMap(value) {
      return value === null || value === undefined ? emptyOrderedMap() :
        isOrderedMap(value) ? value :
        emptyOrderedMap().withMutations(function(map ) {
          var iter = KeyedIterable(value);
          assertNotInfinite(iter.size);
          iter.forEach(function(v, k)  {return map.set(k, v)});
        });
    }

    OrderedMap.of = function(/*...values*/) {
      return this(arguments);
    };

    OrderedMap.prototype.toString = function() {
      return this.__toString('OrderedMap {', '}');
    };

    // @pragma Access

    OrderedMap.prototype.get = function(k, notSetValue) {
      var index = this._map.get(k);
      return index !== undefined ? this._list.get(index)[1] : notSetValue;
    };

    // @pragma Modification

    OrderedMap.prototype.clear = function() {
      if (this.size === 0) {
        return this;
      }
      if (this.__ownerID) {
        this.size = 0;
        this._map.clear();
        this._list.clear();
        return this;
      }
      return emptyOrderedMap();
    };

    OrderedMap.prototype.set = function(k, v) {
      return updateOrderedMap(this, k, v);
    };

    OrderedMap.prototype.remove = function(k) {
      return updateOrderedMap(this, k, NOT_SET);
    };

    OrderedMap.prototype.wasAltered = function() {
      return this._map.wasAltered() || this._list.wasAltered();
    };

    OrderedMap.prototype.__iterate = function(fn, reverse) {var this$0 = this;
      return this._list.__iterate(
        function(entry ) {return entry && fn(entry[1], entry[0], this$0)},
        reverse
      );
    };

    OrderedMap.prototype.__iterator = function(type, reverse) {
      return this._list.fromEntrySeq().__iterator(type, reverse);
    };

    OrderedMap.prototype.__ensureOwner = function(ownerID) {
      if (ownerID === this.__ownerID) {
        return this;
      }
      var newMap = this._map.__ensureOwner(ownerID);
      var newList = this._list.__ensureOwner(ownerID);
      if (!ownerID) {
        this.__ownerID = ownerID;
        this._map = newMap;
        this._list = newList;
        return this;
      }
      return makeOrderedMap(newMap, newList, ownerID, this.__hash);
    };


  function isOrderedMap(maybeOrderedMap) {
    return isMap(maybeOrderedMap) && isOrdered(maybeOrderedMap);
  }

  OrderedMap.isOrderedMap = isOrderedMap;

  OrderedMap.prototype[IS_ORDERED_SENTINEL] = true;
  OrderedMap.prototype[DELETE] = OrderedMap.prototype.remove;



  function makeOrderedMap(map, list, ownerID, hash) {
    var omap = Object.create(OrderedMap.prototype);
    omap.size = map ? map.size : 0;
    omap._map = map;
    omap._list = list;
    omap.__ownerID = ownerID;
    omap.__hash = hash;
    return omap;
  }

  var EMPTY_ORDERED_MAP;
  function emptyOrderedMap() {
    return EMPTY_ORDERED_MAP || (EMPTY_ORDERED_MAP = makeOrderedMap(emptyMap(), emptyList()));
  }

  function updateOrderedMap(omap, k, v) {
    var map = omap._map;
    var list = omap._list;
    var i = map.get(k);
    var has = i !== undefined;
    var newMap;
    var newList;
    if (v === NOT_SET) { // removed
      if (!has) {
        return omap;
      }
      if (list.size >= SIZE && list.size >= map.size * 2) {
        newList = list.filter(function(entry, idx)  {return entry !== undefined && i !== idx});
        newMap = newList.toKeyedSeq().map(function(entry ) {return entry[0]}).flip().toMap();
        if (omap.__ownerID) {
          newMap.__ownerID = newList.__ownerID = omap.__ownerID;
        }
      } else {
        newMap = map.remove(k);
        newList = i === list.size - 1 ? list.pop() : list.set(i, undefined);
      }
    } else {
      if (has) {
        if (v === list.get(i)[1]) {
          return omap;
        }
        newMap = map;
        newList = list.set(i, [k, v]);
      } else {
        newMap = map.set(k, list.size);
        newList = list.set(list.size, [k, v]);
      }
    }
    if (omap.__ownerID) {
      omap.size = newMap.size;
      omap._map = newMap;
      omap._list = newList;
      omap.__hash = undefined;
      return omap;
    }
    return makeOrderedMap(newMap, newList);
  }

  createClass(ToKeyedSequence, KeyedSeq);
    function ToKeyedSequence(indexed, useKeys) {
      this._iter = indexed;
      this._useKeys = useKeys;
      this.size = indexed.size;
    }

    ToKeyedSequence.prototype.get = function(key, notSetValue) {
      return this._iter.get(key, notSetValue);
    };

    ToKeyedSequence.prototype.has = function(key) {
      return this._iter.has(key);
    };

    ToKeyedSequence.prototype.valueSeq = function() {
      return this._iter.valueSeq();
    };

    ToKeyedSequence.prototype.reverse = function() {var this$0 = this;
      var reversedSequence = reverseFactory(this, true);
      if (!this._useKeys) {
        reversedSequence.valueSeq = function()  {return this$0._iter.toSeq().reverse()};
      }
      return reversedSequence;
    };

    ToKeyedSequence.prototype.map = function(mapper, context) {var this$0 = this;
      var mappedSequence = mapFactory(this, mapper, context);
      if (!this._useKeys) {
        mappedSequence.valueSeq = function()  {return this$0._iter.toSeq().map(mapper, context)};
      }
      return mappedSequence;
    };

    ToKeyedSequence.prototype.__iterate = function(fn, reverse) {var this$0 = this;
      var ii;
      return this._iter.__iterate(
        this._useKeys ?
          function(v, k)  {return fn(v, k, this$0)} :
          ((ii = reverse ? resolveSize(this) : 0),
            function(v ) {return fn(v, reverse ? --ii : ii++, this$0)}),
        reverse
      );
    };

    ToKeyedSequence.prototype.__iterator = function(type, reverse) {
      if (this._useKeys) {
        return this._iter.__iterator(type, reverse);
      }
      var iterator = this._iter.__iterator(ITERATE_VALUES, reverse);
      var ii = reverse ? resolveSize(this) : 0;
      return new Iterator(function()  {
        var step = iterator.next();
        return step.done ? step :
          iteratorValue(type, reverse ? --ii : ii++, step.value, step);
      });
    };

  ToKeyedSequence.prototype[IS_ORDERED_SENTINEL] = true;


  createClass(ToIndexedSequence, IndexedSeq);
    function ToIndexedSequence(iter) {
      this._iter = iter;
      this.size = iter.size;
    }

    ToIndexedSequence.prototype.includes = function(value) {
      return this._iter.includes(value);
    };

    ToIndexedSequence.prototype.__iterate = function(fn, reverse) {var this$0 = this;
      var iterations = 0;
      return this._iter.__iterate(function(v ) {return fn(v, iterations++, this$0)}, reverse);
    };

    ToIndexedSequence.prototype.__iterator = function(type, reverse) {
      var iterator = this._iter.__iterator(ITERATE_VALUES, reverse);
      var iterations = 0;
      return new Iterator(function()  {
        var step = iterator.next();
        return step.done ? step :
          iteratorValue(type, iterations++, step.value, step)
      });
    };



  createClass(ToSetSequence, SetSeq);
    function ToSetSequence(iter) {
      this._iter = iter;
      this.size = iter.size;
    }

    ToSetSequence.prototype.has = function(key) {
      return this._iter.includes(key);
    };

    ToSetSequence.prototype.__iterate = function(fn, reverse) {var this$0 = this;
      return this._iter.__iterate(function(v ) {return fn(v, v, this$0)}, reverse);
    };

    ToSetSequence.prototype.__iterator = function(type, reverse) {
      var iterator = this._iter.__iterator(ITERATE_VALUES, reverse);
      return new Iterator(function()  {
        var step = iterator.next();
        return step.done ? step :
          iteratorValue(type, step.value, step.value, step);
      });
    };



  createClass(FromEntriesSequence, KeyedSeq);
    function FromEntriesSequence(entries) {
      this._iter = entries;
      this.size = entries.size;
    }

    FromEntriesSequence.prototype.entrySeq = function() {
      return this._iter.toSeq();
    };

    FromEntriesSequence.prototype.__iterate = function(fn, reverse) {var this$0 = this;
      return this._iter.__iterate(function(entry ) {
        // Check if entry exists first so array access doesn't throw for holes
        // in the parent iteration.
        if (entry) {
          validateEntry(entry);
          var indexedIterable = isIterable(entry);
          return fn(
            indexedIterable ? entry.get(1) : entry[1],
            indexedIterable ? entry.get(0) : entry[0],
            this$0
          );
        }
      }, reverse);
    };

    FromEntriesSequence.prototype.__iterator = function(type, reverse) {
      var iterator = this._iter.__iterator(ITERATE_VALUES, reverse);
      return new Iterator(function()  {
        while (true) {
          var step = iterator.next();
          if (step.done) {
            return step;
          }
          var entry = step.value;
          // Check if entry exists first so array access doesn't throw for holes
          // in the parent iteration.
          if (entry) {
            validateEntry(entry);
            var indexedIterable = isIterable(entry);
            return iteratorValue(
              type,
              indexedIterable ? entry.get(0) : entry[0],
              indexedIterable ? entry.get(1) : entry[1],
              step
            );
          }
        }
      });
    };


  ToIndexedSequence.prototype.cacheResult =
  ToKeyedSequence.prototype.cacheResult =
  ToSetSequence.prototype.cacheResult =
  FromEntriesSequence.prototype.cacheResult =
    cacheResultThrough;


  function flipFactory(iterable) {
    var flipSequence = makeSequence(iterable);
    flipSequence._iter = iterable;
    flipSequence.size = iterable.size;
    flipSequence.flip = function()  {return iterable};
    flipSequence.reverse = function () {
      var reversedSequence = iterable.reverse.apply(this); // super.reverse()
      reversedSequence.flip = function()  {return iterable.reverse()};
      return reversedSequence;
    };
    flipSequence.has = function(key ) {return iterable.includes(key)};
    flipSequence.includes = function(key ) {return iterable.has(key)};
    flipSequence.cacheResult = cacheResultThrough;
    flipSequence.__iterateUncached = function (fn, reverse) {var this$0 = this;
      return iterable.__iterate(function(v, k)  {return fn(k, v, this$0) !== false}, reverse);
    }
    flipSequence.__iteratorUncached = function(type, reverse) {
      if (type === ITERATE_ENTRIES) {
        var iterator = iterable.__iterator(type, reverse);
        return new Iterator(function()  {
          var step = iterator.next();
          if (!step.done) {
            var k = step.value[0];
            step.value[0] = step.value[1];
            step.value[1] = k;
          }
          return step;
        });
      }
      return iterable.__iterator(
        type === ITERATE_VALUES ? ITERATE_KEYS : ITERATE_VALUES,
        reverse
      );
    }
    return flipSequence;
  }


  function mapFactory(iterable, mapper, context) {
    var mappedSequence = makeSequence(iterable);
    mappedSequence.size = iterable.size;
    mappedSequence.has = function(key ) {return iterable.has(key)};
    mappedSequence.get = function(key, notSetValue)  {
      var v = iterable.get(key, NOT_SET);
      return v === NOT_SET ?
        notSetValue :
        mapper.call(context, v, key, iterable);
    };
    mappedSequence.__iterateUncached = function (fn, reverse) {var this$0 = this;
      return iterable.__iterate(
        function(v, k, c)  {return fn(mapper.call(context, v, k, c), k, this$0) !== false},
        reverse
      );
    }
    mappedSequence.__iteratorUncached = function (type, reverse) {
      var iterator = iterable.__iterator(ITERATE_ENTRIES, reverse);
      return new Iterator(function()  {
        var step = iterator.next();
        if (step.done) {
          return step;
        }
        var entry = step.value;
        var key = entry[0];
        return iteratorValue(
          type,
          key,
          mapper.call(context, entry[1], key, iterable),
          step
        );
      });
    }
    return mappedSequence;
  }


  function reverseFactory(iterable, useKeys) {
    var reversedSequence = makeSequence(iterable);
    reversedSequence._iter = iterable;
    reversedSequence.size = iterable.size;
    reversedSequence.reverse = function()  {return iterable};
    if (iterable.flip) {
      reversedSequence.flip = function () {
        var flipSequence = flipFactory(iterable);
        flipSequence.reverse = function()  {return iterable.flip()};
        return flipSequence;
      };
    }
    reversedSequence.get = function(key, notSetValue) 
      {return iterable.get(useKeys ? key : -1 - key, notSetValue)};
    reversedSequence.has = function(key )
      {return iterable.has(useKeys ? key : -1 - key)};
    reversedSequence.includes = function(value ) {return iterable.includes(value)};
    reversedSequence.cacheResult = cacheResultThrough;
    reversedSequence.__iterate = function (fn, reverse) {var this$0 = this;
      return iterable.__iterate(function(v, k)  {return fn(v, k, this$0)}, !reverse);
    };
    reversedSequence.__iterator =
      function(type, reverse)  {return iterable.__iterator(type, !reverse)};
    return reversedSequence;
  }


  function filterFactory(iterable, predicate, context, useKeys) {
    var filterSequence = makeSequence(iterable);
    if (useKeys) {
      filterSequence.has = function(key ) {
        var v = iterable.get(key, NOT_SET);
        return v !== NOT_SET && !!predicate.call(context, v, key, iterable);
      };
      filterSequence.get = function(key, notSetValue)  {
        var v = iterable.get(key, NOT_SET);
        return v !== NOT_SET && predicate.call(context, v, key, iterable) ?
          v : notSetValue;
      };
    }
    filterSequence.__iterateUncached = function (fn, reverse) {var this$0 = this;
      var iterations = 0;
      iterable.__iterate(function(v, k, c)  {
        if (predicate.call(context, v, k, c)) {
          iterations++;
          return fn(v, useKeys ? k : iterations - 1, this$0);
        }
      }, reverse);
      return iterations;
    };
    filterSequence.__iteratorUncached = function (type, reverse) {
      var iterator = iterable.__iterator(ITERATE_ENTRIES, reverse);
      var iterations = 0;
      return new Iterator(function()  {
        while (true) {
          var step = iterator.next();
          if (step.done) {
            return step;
          }
          var entry = step.value;
          var key = entry[0];
          var value = entry[1];
          if (predicate.call(context, value, key, iterable)) {
            return iteratorValue(type, useKeys ? key : iterations++, value, step);
          }
        }
      });
    }
    return filterSequence;
  }


  function countByFactory(iterable, grouper, context) {
    var groups = Map().asMutable();
    iterable.__iterate(function(v, k)  {
      groups.update(
        grouper.call(context, v, k, iterable),
        0,
        function(a ) {return a + 1}
      );
    });
    return groups.asImmutable();
  }


  function groupByFactory(iterable, grouper, context) {
    var isKeyedIter = isKeyed(iterable);
    var groups = (isOrdered(iterable) ? OrderedMap() : Map()).asMutable();
    iterable.__iterate(function(v, k)  {
      groups.update(
        grouper.call(context, v, k, iterable),
        function(a ) {return (a = a || [], a.push(isKeyedIter ? [k, v] : v), a)}
      );
    });
    var coerce = iterableClass(iterable);
    return groups.map(function(arr ) {return reify(iterable, coerce(arr))});
  }


  function sliceFactory(iterable, begin, end, useKeys) {
    var originalSize = iterable.size;

    // Sanitize begin & end using this shorthand for ToInt32(argument)
    // http://www.ecma-international.org/ecma-262/6.0/#sec-toint32
    if (begin !== undefined) {
      begin = begin | 0;
    }
    if (end !== undefined) {
      end = end | 0;
    }

    if (wholeSlice(begin, end, originalSize)) {
      return iterable;
    }

    var resolvedBegin = resolveBegin(begin, originalSize);
    var resolvedEnd = resolveEnd(end, originalSize);

    // begin or end will be NaN if they were provided as negative numbers and
    // this iterable's size is unknown. In that case, cache first so there is
    // a known size and these do not resolve to NaN.
    if (resolvedBegin !== resolvedBegin || resolvedEnd !== resolvedEnd) {
      return sliceFactory(iterable.toSeq().cacheResult(), begin, end, useKeys);
    }

    // Note: resolvedEnd is undefined when the original sequence's length is
    // unknown and this slice did not supply an end and should contain all
    // elements after resolvedBegin.
    // In that case, resolvedSize will be NaN and sliceSize will remain undefined.
    var resolvedSize = resolvedEnd - resolvedBegin;
    var sliceSize;
    if (resolvedSize === resolvedSize) {
      sliceSize = resolvedSize < 0 ? 0 : resolvedSize;
    }

    var sliceSeq = makeSequence(iterable);

    // If iterable.size is undefined, the size of the realized sliceSeq is
    // unknown at this point unless the number of items to slice is 0
    sliceSeq.size = sliceSize === 0 ? sliceSize : iterable.size && sliceSize || undefined;

    if (!useKeys && isSeq(iterable) && sliceSize >= 0) {
      sliceSeq.get = function (index, notSetValue) {
        index = wrapIndex(this, index);
        return index >= 0 && index < sliceSize ?
          iterable.get(index + resolvedBegin, notSetValue) :
          notSetValue;
      }
    }

    sliceSeq.__iterateUncached = function(fn, reverse) {var this$0 = this;
      if (sliceSize === 0) {
        return 0;
      }
      if (reverse) {
        return this.cacheResult().__iterate(fn, reverse);
      }
      var skipped = 0;
      var isSkipping = true;
      var iterations = 0;
      iterable.__iterate(function(v, k)  {
        if (!(isSkipping && (isSkipping = skipped++ < resolvedBegin))) {
          iterations++;
          return fn(v, useKeys ? k : iterations - 1, this$0) !== false &&
                 iterations !== sliceSize;
        }
      });
      return iterations;
    };

    sliceSeq.__iteratorUncached = function(type, reverse) {
      if (sliceSize !== 0 && reverse) {
        return this.cacheResult().__iterator(type, reverse);
      }
      // Don't bother instantiating parent iterator if taking 0.
      var iterator = sliceSize !== 0 && iterable.__iterator(type, reverse);
      var skipped = 0;
      var iterations = 0;
      return new Iterator(function()  {
        while (skipped++ < resolvedBegin) {
          iterator.next();
        }
        if (++iterations > sliceSize) {
          return iteratorDone();
        }
        var step = iterator.next();
        if (useKeys || type === ITERATE_VALUES) {
          return step;
        } else if (type === ITERATE_KEYS) {
          return iteratorValue(type, iterations - 1, undefined, step);
        } else {
          return iteratorValue(type, iterations - 1, step.value[1], step);
        }
      });
    }

    return sliceSeq;
  }


  function takeWhileFactory(iterable, predicate, context) {
    var takeSequence = makeSequence(iterable);
    takeSequence.__iterateUncached = function(fn, reverse) {var this$0 = this;
      if (reverse) {
        return this.cacheResult().__iterate(fn, reverse);
      }
      var iterations = 0;
      iterable.__iterate(function(v, k, c) 
        {return predicate.call(context, v, k, c) && ++iterations && fn(v, k, this$0)}
      );
      return iterations;
    };
    takeSequence.__iteratorUncached = function(type, reverse) {var this$0 = this;
      if (reverse) {
        return this.cacheResult().__iterator(type, reverse);
      }
      var iterator = iterable.__iterator(ITERATE_ENTRIES, reverse);
      var iterating = true;
      return new Iterator(function()  {
        if (!iterating) {
          return iteratorDone();
        }
        var step = iterator.next();
        if (step.done) {
          return step;
        }
        var entry = step.value;
        var k = entry[0];
        var v = entry[1];
        if (!predicate.call(context, v, k, this$0)) {
          iterating = false;
          return iteratorDone();
        }
        return type === ITERATE_ENTRIES ? step :
          iteratorValue(type, k, v, step);
      });
    };
    return takeSequence;
  }


  function skipWhileFactory(iterable, predicate, context, useKeys) {
    var skipSequence = makeSequence(iterable);
    skipSequence.__iterateUncached = function (fn, reverse) {var this$0 = this;
      if (reverse) {
        return this.cacheResult().__iterate(fn, reverse);
      }
      var isSkipping = true;
      var iterations = 0;
      iterable.__iterate(function(v, k, c)  {
        if (!(isSkipping && (isSkipping = predicate.call(context, v, k, c)))) {
          iterations++;
          return fn(v, useKeys ? k : iterations - 1, this$0);
        }
      });
      return iterations;
    };
    skipSequence.__iteratorUncached = function(type, reverse) {var this$0 = this;
      if (reverse) {
        return this.cacheResult().__iterator(type, reverse);
      }
      var iterator = iterable.__iterator(ITERATE_ENTRIES, reverse);
      var skipping = true;
      var iterations = 0;
      return new Iterator(function()  {
        var step, k, v;
        do {
          step = iterator.next();
          if (step.done) {
            if (useKeys || type === ITERATE_VALUES) {
              return step;
            } else if (type === ITERATE_KEYS) {
              return iteratorValue(type, iterations++, undefined, step);
            } else {
              return iteratorValue(type, iterations++, step.value[1], step);
            }
          }
          var entry = step.value;
          k = entry[0];
          v = entry[1];
          skipping && (skipping = predicate.call(context, v, k, this$0));
        } while (skipping);
        return type === ITERATE_ENTRIES ? step :
          iteratorValue(type, k, v, step);
      });
    };
    return skipSequence;
  }


  function concatFactory(iterable, values) {
    var isKeyedIterable = isKeyed(iterable);
    var iters = [iterable].concat(values).map(function(v ) {
      if (!isIterable(v)) {
        v = isKeyedIterable ?
          keyedSeqFromValue(v) :
          indexedSeqFromValue(Array.isArray(v) ? v : [v]);
      } else if (isKeyedIterable) {
        v = KeyedIterable(v);
      }
      return v;
    }).filter(function(v ) {return v.size !== 0});

    if (iters.length === 0) {
      return iterable;
    }

    if (iters.length === 1) {
      var singleton = iters[0];
      if (singleton === iterable ||
          isKeyedIterable && isKeyed(singleton) ||
          isIndexed(iterable) && isIndexed(singleton)) {
        return singleton;
      }
    }

    var concatSeq = new ArraySeq(iters);
    if (isKeyedIterable) {
      concatSeq = concatSeq.toKeyedSeq();
    } else if (!isIndexed(iterable)) {
      concatSeq = concatSeq.toSetSeq();
    }
    concatSeq = concatSeq.flatten(true);
    concatSeq.size = iters.reduce(
      function(sum, seq)  {
        if (sum !== undefined) {
          var size = seq.size;
          if (size !== undefined) {
            return sum + size;
          }
        }
      },
      0
    );
    return concatSeq;
  }


  function flattenFactory(iterable, depth, useKeys) {
    var flatSequence = makeSequence(iterable);
    flatSequence.__iterateUncached = function(fn, reverse) {
      var iterations = 0;
      var stopped = false;
      function flatDeep(iter, currentDepth) {var this$0 = this;
        iter.__iterate(function(v, k)  {
          if ((!depth || currentDepth < depth) && isIterable(v)) {
            flatDeep(v, currentDepth + 1);
          } else if (fn(v, useKeys ? k : iterations++, this$0) === false) {
            stopped = true;
          }
          return !stopped;
        }, reverse);
      }
      flatDeep(iterable, 0);
      return iterations;
    }
    flatSequence.__iteratorUncached = function(type, reverse) {
      var iterator = iterable.__iterator(type, reverse);
      var stack = [];
      var iterations = 0;
      return new Iterator(function()  {
        while (iterator) {
          var step = iterator.next();
          if (step.done !== false) {
            iterator = stack.pop();
            continue;
          }
          var v = step.value;
          if (type === ITERATE_ENTRIES) {
            v = v[1];
          }
          if ((!depth || stack.length < depth) && isIterable(v)) {
            stack.push(iterator);
            iterator = v.__iterator(type, reverse);
          } else {
            return useKeys ? step : iteratorValue(type, iterations++, v, step);
          }
        }
        return iteratorDone();
      });
    }
    return flatSequence;
  }


  function flatMapFactory(iterable, mapper, context) {
    var coerce = iterableClass(iterable);
    return iterable.toSeq().map(
      function(v, k)  {return coerce(mapper.call(context, v, k, iterable))}
    ).flatten(true);
  }


  function interposeFactory(iterable, separator) {
    var interposedSequence = makeSequence(iterable);
    interposedSequence.size = iterable.size && iterable.size * 2 -1;
    interposedSequence.__iterateUncached = function(fn, reverse) {var this$0 = this;
      var iterations = 0;
      iterable.__iterate(function(v, k) 
        {return (!iterations || fn(separator, iterations++, this$0) !== false) &&
        fn(v, iterations++, this$0) !== false},
        reverse
      );
      return iterations;
    };
    interposedSequence.__iteratorUncached = function(type, reverse) {
      var iterator = iterable.__iterator(ITERATE_VALUES, reverse);
      var iterations = 0;
      var step;
      return new Iterator(function()  {
        if (!step || iterations % 2) {
          step = iterator.next();
          if (step.done) {
            return step;
          }
        }
        return iterations % 2 ?
          iteratorValue(type, iterations++, separator) :
          iteratorValue(type, iterations++, step.value, step);
      });
    };
    return interposedSequence;
  }


  function sortFactory(iterable, comparator, mapper) {
    if (!comparator) {
      comparator = defaultComparator;
    }
    var isKeyedIterable = isKeyed(iterable);
    var index = 0;
    var entries = iterable.toSeq().map(
      function(v, k)  {return [k, v, index++, mapper ? mapper(v, k, iterable) : v]}
    ).toArray();
    entries.sort(function(a, b)  {return comparator(a[3], b[3]) || a[2] - b[2]}).forEach(
      isKeyedIterable ?
      function(v, i)  { entries[i].length = 2; } :
      function(v, i)  { entries[i] = v[1]; }
    );
    return isKeyedIterable ? KeyedSeq(entries) :
      isIndexed(iterable) ? IndexedSeq(entries) :
      SetSeq(entries);
  }


  function maxFactory(iterable, comparator, mapper) {
    if (!comparator) {
      comparator = defaultComparator;
    }
    if (mapper) {
      var entry = iterable.toSeq()
        .map(function(v, k)  {return [v, mapper(v, k, iterable)]})
        .reduce(function(a, b)  {return maxCompare(comparator, a[1], b[1]) ? b : a});
      return entry && entry[0];
    } else {
      return iterable.reduce(function(a, b)  {return maxCompare(comparator, a, b) ? b : a});
    }
  }

  function maxCompare(comparator, a, b) {
    var comp = comparator(b, a);
    // b is considered the new max if the comparator declares them equal, but
    // they are not equal and b is in fact a nullish value.
    return (comp === 0 && b !== a && (b === undefined || b === null || b !== b)) || comp > 0;
  }


  function zipWithFactory(keyIter, zipper, iters) {
    var zipSequence = makeSequence(keyIter);
    zipSequence.size = new ArraySeq(iters).map(function(i ) {return i.size}).min();
    // Note: this a generic base implementation of __iterate in terms of
    // __iterator which may be more generically useful in the future.
    zipSequence.__iterate = function(fn, reverse) {
      /* generic:
      var iterator = this.__iterator(ITERATE_ENTRIES, reverse);
      var step;
      var iterations = 0;
      while (!(step = iterator.next()).done) {
        iterations++;
        if (fn(step.value[1], step.value[0], this) === false) {
          break;
        }
      }
      return iterations;
      */
      // indexed:
      var iterator = this.__iterator(ITERATE_VALUES, reverse);
      var step;
      var iterations = 0;
      while (!(step = iterator.next()).done) {
        if (fn(step.value, iterations++, this) === false) {
          break;
        }
      }
      return iterations;
    };
    zipSequence.__iteratorUncached = function(type, reverse) {
      var iterators = iters.map(function(i )
        {return (i = Iterable(i), getIterator(reverse ? i.reverse() : i))}
      );
      var iterations = 0;
      var isDone = false;
      return new Iterator(function()  {
        var steps;
        if (!isDone) {
          steps = iterators.map(function(i ) {return i.next()});
          isDone = steps.some(function(s ) {return s.done});
        }
        if (isDone) {
          return iteratorDone();
        }
        return iteratorValue(
          type,
          iterations++,
          zipper.apply(null, steps.map(function(s ) {return s.value}))
        );
      });
    };
    return zipSequence
  }


  // #pragma Helper Functions

  function reify(iter, seq) {
    return isSeq(iter) ? seq : iter.constructor(seq);
  }

  function validateEntry(entry) {
    if (entry !== Object(entry)) {
      throw new TypeError('Expected [K, V] tuple: ' + entry);
    }
  }

  function resolveSize(iter) {
    assertNotInfinite(iter.size);
    return ensureSize(iter);
  }

  function iterableClass(iterable) {
    return isKeyed(iterable) ? KeyedIterable :
      isIndexed(iterable) ? IndexedIterable :
      SetIterable;
  }

  function makeSequence(iterable) {
    return Object.create(
      (
        isKeyed(iterable) ? KeyedSeq :
        isIndexed(iterable) ? IndexedSeq :
        SetSeq
      ).prototype
    );
  }

  function cacheResultThrough() {
    if (this._iter.cacheResult) {
      this._iter.cacheResult();
      this.size = this._iter.size;
      return this;
    } else {
      return Seq.prototype.cacheResult.call(this);
    }
  }

  function defaultComparator(a, b) {
    return a > b ? 1 : a < b ? -1 : 0;
  }

  function forceIterator(keyPath) {
    var iter = getIterator(keyPath);
    if (!iter) {
      // Array might not be iterable in this environment, so we need a fallback
      // to our wrapped type.
      if (!isArrayLike(keyPath)) {
        throw new TypeError('Expected iterable or array-like: ' + keyPath);
      }
      iter = getIterator(Iterable(keyPath));
    }
    return iter;
  }

  createClass(Record, KeyedCollection);

    function Record(defaultValues, name) {
      var hasInitialized;

      var RecordType = function Record(values) {
        if (values instanceof RecordType) {
          return values;
        }
        if (!(this instanceof RecordType)) {
          return new RecordType(values);
        }
        if (!hasInitialized) {
          hasInitialized = true;
          var keys = Object.keys(defaultValues);
          setProps(RecordTypePrototype, keys);
          RecordTypePrototype.size = keys.length;
          RecordTypePrototype._name = name;
          RecordTypePrototype._keys = keys;
          RecordTypePrototype._defaultValues = defaultValues;
        }
        this._map = Map(values);
      };

      var RecordTypePrototype = RecordType.prototype = Object.create(RecordPrototype);
      RecordTypePrototype.constructor = RecordType;

      return RecordType;
    }

    Record.prototype.toString = function() {
      return this.__toString(recordName(this) + ' {', '}');
    };

    // @pragma Access

    Record.prototype.has = function(k) {
      return this._defaultValues.hasOwnProperty(k);
    };

    Record.prototype.get = function(k, notSetValue) {
      if (!this.has(k)) {
        return notSetValue;
      }
      var defaultVal = this._defaultValues[k];
      return this._map ? this._map.get(k, defaultVal) : defaultVal;
    };

    // @pragma Modification

    Record.prototype.clear = function() {
      if (this.__ownerID) {
        this._map && this._map.clear();
        return this;
      }
      var RecordType = this.constructor;
      return RecordType._empty || (RecordType._empty = makeRecord(this, emptyMap()));
    };

    Record.prototype.set = function(k, v) {
      if (!this.has(k)) {
        throw new Error('Cannot set unknown key "' + k + '" on ' + recordName(this));
      }
      var newMap = this._map && this._map.set(k, v);
      if (this.__ownerID || newMap === this._map) {
        return this;
      }
      return makeRecord(this, newMap);
    };

    Record.prototype.remove = function(k) {
      if (!this.has(k)) {
        return this;
      }
      var newMap = this._map && this._map.remove(k);
      if (this.__ownerID || newMap === this._map) {
        return this;
      }
      return makeRecord(this, newMap);
    };

    Record.prototype.wasAltered = function() {
      return this._map.wasAltered();
    };

    Record.prototype.__iterator = function(type, reverse) {var this$0 = this;
      return KeyedIterable(this._defaultValues).map(function(_, k)  {return this$0.get(k)}).__iterator(type, reverse);
    };

    Record.prototype.__iterate = function(fn, reverse) {var this$0 = this;
      return KeyedIterable(this._defaultValues).map(function(_, k)  {return this$0.get(k)}).__iterate(fn, reverse);
    };

    Record.prototype.__ensureOwner = function(ownerID) {
      if (ownerID === this.__ownerID) {
        return this;
      }
      var newMap = this._map && this._map.__ensureOwner(ownerID);
      if (!ownerID) {
        this.__ownerID = ownerID;
        this._map = newMap;
        return this;
      }
      return makeRecord(this, newMap, ownerID);
    };


  var RecordPrototype = Record.prototype;
  RecordPrototype[DELETE] = RecordPrototype.remove;
  RecordPrototype.deleteIn =
  RecordPrototype.removeIn = MapPrototype.removeIn;
  RecordPrototype.merge = MapPrototype.merge;
  RecordPrototype.mergeWith = MapPrototype.mergeWith;
  RecordPrototype.mergeIn = MapPrototype.mergeIn;
  RecordPrototype.mergeDeep = MapPrototype.mergeDeep;
  RecordPrototype.mergeDeepWith = MapPrototype.mergeDeepWith;
  RecordPrototype.mergeDeepIn = MapPrototype.mergeDeepIn;
  RecordPrototype.setIn = MapPrototype.setIn;
  RecordPrototype.update = MapPrototype.update;
  RecordPrototype.updateIn = MapPrototype.updateIn;
  RecordPrototype.withMutations = MapPrototype.withMutations;
  RecordPrototype.asMutable = MapPrototype.asMutable;
  RecordPrototype.asImmutable = MapPrototype.asImmutable;


  function makeRecord(likeRecord, map, ownerID) {
    var record = Object.create(Object.getPrototypeOf(likeRecord));
    record._map = map;
    record.__ownerID = ownerID;
    return record;
  }

  function recordName(record) {
    return record._name || record.constructor.name || 'Record';
  }

  function setProps(prototype, names) {
    try {
      names.forEach(setProp.bind(undefined, prototype));
    } catch (error) {
      // Object.defineProperty failed. Probably IE8.
    }
  }

  function setProp(prototype, name) {
    Object.defineProperty(prototype, name, {
      get: function() {
        return this.get(name);
      },
      set: function(value) {
        invariant(this.__ownerID, 'Cannot set on an immutable record.');
        this.set(name, value);
      }
    });
  }

  createClass(Set, SetCollection);

    // @pragma Construction

    function Set(value) {
      return value === null || value === undefined ? emptySet() :
        isSet(value) && !isOrdered(value) ? value :
        emptySet().withMutations(function(set ) {
          var iter = SetIterable(value);
          assertNotInfinite(iter.size);
          iter.forEach(function(v ) {return set.add(v)});
        });
    }

    Set.of = function(/*...values*/) {
      return this(arguments);
    };

    Set.fromKeys = function(value) {
      return this(KeyedIterable(value).keySeq());
    };

    Set.prototype.toString = function() {
      return this.__toString('Set {', '}');
    };

    // @pragma Access

    Set.prototype.has = function(value) {
      return this._map.has(value);
    };

    // @pragma Modification

    Set.prototype.add = function(value) {
      return updateSet(this, this._map.set(value, true));
    };

    Set.prototype.remove = function(value) {
      return updateSet(this, this._map.remove(value));
    };

    Set.prototype.clear = function() {
      return updateSet(this, this._map.clear());
    };

    // @pragma Composition

    Set.prototype.union = function() {var iters = SLICE$0.call(arguments, 0);
      iters = iters.filter(function(x ) {return x.size !== 0});
      if (iters.length === 0) {
        return this;
      }
      if (this.size === 0 && !this.__ownerID && iters.length === 1) {
        return this.constructor(iters[0]);
      }
      return this.withMutations(function(set ) {
        for (var ii = 0; ii < iters.length; ii++) {
          SetIterable(iters[ii]).forEach(function(value ) {return set.add(value)});
        }
      });
    };

    Set.prototype.intersect = function() {var iters = SLICE$0.call(arguments, 0);
      if (iters.length === 0) {
        return this;
      }
      iters = iters.map(function(iter ) {return SetIterable(iter)});
      var originalSet = this;
      return this.withMutations(function(set ) {
        originalSet.forEach(function(value ) {
          if (!iters.every(function(iter ) {return iter.includes(value)})) {
            set.remove(value);
          }
        });
      });
    };

    Set.prototype.subtract = function() {var iters = SLICE$0.call(arguments, 0);
      if (iters.length === 0) {
        return this;
      }
      iters = iters.map(function(iter ) {return SetIterable(iter)});
      var originalSet = this;
      return this.withMutations(function(set ) {
        originalSet.forEach(function(value ) {
          if (iters.some(function(iter ) {return iter.includes(value)})) {
            set.remove(value);
          }
        });
      });
    };

    Set.prototype.merge = function() {
      return this.union.apply(this, arguments);
    };

    Set.prototype.mergeWith = function(merger) {var iters = SLICE$0.call(arguments, 1);
      return this.union.apply(this, iters);
    };

    Set.prototype.sort = function(comparator) {
      // Late binding
      return OrderedSet(sortFactory(this, comparator));
    };

    Set.prototype.sortBy = function(mapper, comparator) {
      // Late binding
      return OrderedSet(sortFactory(this, comparator, mapper));
    };

    Set.prototype.wasAltered = function() {
      return this._map.wasAltered();
    };

    Set.prototype.__iterate = function(fn, reverse) {var this$0 = this;
      return this._map.__iterate(function(_, k)  {return fn(k, k, this$0)}, reverse);
    };

    Set.prototype.__iterator = function(type, reverse) {
      return this._map.map(function(_, k)  {return k}).__iterator(type, reverse);
    };

    Set.prototype.__ensureOwner = function(ownerID) {
      if (ownerID === this.__ownerID) {
        return this;
      }
      var newMap = this._map.__ensureOwner(ownerID);
      if (!ownerID) {
        this.__ownerID = ownerID;
        this._map = newMap;
        return this;
      }
      return this.__make(newMap, ownerID);
    };


  function isSet(maybeSet) {
    return !!(maybeSet && maybeSet[IS_SET_SENTINEL]);
  }

  Set.isSet = isSet;

  var IS_SET_SENTINEL = '@@__IMMUTABLE_SET__@@';

  var SetPrototype = Set.prototype;
  SetPrototype[IS_SET_SENTINEL] = true;
  SetPrototype[DELETE] = SetPrototype.remove;
  SetPrototype.mergeDeep = SetPrototype.merge;
  SetPrototype.mergeDeepWith = SetPrototype.mergeWith;
  SetPrototype.withMutations = MapPrototype.withMutations;
  SetPrototype.asMutable = MapPrototype.asMutable;
  SetPrototype.asImmutable = MapPrototype.asImmutable;

  SetPrototype.__empty = emptySet;
  SetPrototype.__make = makeSet;

  function updateSet(set, newMap) {
    if (set.__ownerID) {
      set.size = newMap.size;
      set._map = newMap;
      return set;
    }
    return newMap === set._map ? set :
      newMap.size === 0 ? set.__empty() :
      set.__make(newMap);
  }

  function makeSet(map, ownerID) {
    var set = Object.create(SetPrototype);
    set.size = map ? map.size : 0;
    set._map = map;
    set.__ownerID = ownerID;
    return set;
  }

  var EMPTY_SET;
  function emptySet() {
    return EMPTY_SET || (EMPTY_SET = makeSet(emptyMap()));
  }

  createClass(OrderedSet, Set);

    // @pragma Construction

    function OrderedSet(value) {
      return value === null || value === undefined ? emptyOrderedSet() :
        isOrderedSet(value) ? value :
        emptyOrderedSet().withMutations(function(set ) {
          var iter = SetIterable(value);
          assertNotInfinite(iter.size);
          iter.forEach(function(v ) {return set.add(v)});
        });
    }

    OrderedSet.of = function(/*...values*/) {
      return this(arguments);
    };

    OrderedSet.fromKeys = function(value) {
      return this(KeyedIterable(value).keySeq());
    };

    OrderedSet.prototype.toString = function() {
      return this.__toString('OrderedSet {', '}');
    };


  function isOrderedSet(maybeOrderedSet) {
    return isSet(maybeOrderedSet) && isOrdered(maybeOrderedSet);
  }

  OrderedSet.isOrderedSet = isOrderedSet;

  var OrderedSetPrototype = OrderedSet.prototype;
  OrderedSetPrototype[IS_ORDERED_SENTINEL] = true;

  OrderedSetPrototype.__empty = emptyOrderedSet;
  OrderedSetPrototype.__make = makeOrderedSet;

  function makeOrderedSet(map, ownerID) {
    var set = Object.create(OrderedSetPrototype);
    set.size = map ? map.size : 0;
    set._map = map;
    set.__ownerID = ownerID;
    return set;
  }

  var EMPTY_ORDERED_SET;
  function emptyOrderedSet() {
    return EMPTY_ORDERED_SET || (EMPTY_ORDERED_SET = makeOrderedSet(emptyOrderedMap()));
  }

  createClass(Stack, IndexedCollection);

    // @pragma Construction

    function Stack(value) {
      return value === null || value === undefined ? emptyStack() :
        isStack(value) ? value :
        emptyStack().unshiftAll(value);
    }

    Stack.of = function(/*...values*/) {
      return this(arguments);
    };

    Stack.prototype.toString = function() {
      return this.__toString('Stack [', ']');
    };

    // @pragma Access

    Stack.prototype.get = function(index, notSetValue) {
      var head = this._head;
      index = wrapIndex(this, index);
      while (head && index--) {
        head = head.next;
      }
      return head ? head.value : notSetValue;
    };

    Stack.prototype.peek = function() {
      return this._head && this._head.value;
    };

    // @pragma Modification

    Stack.prototype.push = function(/*...values*/) {
      if (arguments.length === 0) {
        return this;
      }
      var newSize = this.size + arguments.length;
      var head = this._head;
      for (var ii = arguments.length - 1; ii >= 0; ii--) {
        head = {
          value: arguments[ii],
          next: head
        };
      }
      if (this.__ownerID) {
        this.size = newSize;
        this._head = head;
        this.__hash = undefined;
        this.__altered = true;
        return this;
      }
      return makeStack(newSize, head);
    };

    Stack.prototype.pushAll = function(iter) {
      iter = IndexedIterable(iter);
      if (iter.size === 0) {
        return this;
      }
      assertNotInfinite(iter.size);
      var newSize = this.size;
      var head = this._head;
      iter.reverse().forEach(function(value ) {
        newSize++;
        head = {
          value: value,
          next: head
        };
      });
      if (this.__ownerID) {
        this.size = newSize;
        this._head = head;
        this.__hash = undefined;
        this.__altered = true;
        return this;
      }
      return makeStack(newSize, head);
    };

    Stack.prototype.pop = function() {
      return this.slice(1);
    };

    Stack.prototype.unshift = function(/*...values*/) {
      return this.push.apply(this, arguments);
    };

    Stack.prototype.unshiftAll = function(iter) {
      return this.pushAll(iter);
    };

    Stack.prototype.shift = function() {
      return this.pop.apply(this, arguments);
    };

    Stack.prototype.clear = function() {
      if (this.size === 0) {
        return this;
      }
      if (this.__ownerID) {
        this.size = 0;
        this._head = undefined;
        this.__hash = undefined;
        this.__altered = true;
        return this;
      }
      return emptyStack();
    };

    Stack.prototype.slice = function(begin, end) {
      if (wholeSlice(begin, end, this.size)) {
        return this;
      }
      var resolvedBegin = resolveBegin(begin, this.size);
      var resolvedEnd = resolveEnd(end, this.size);
      if (resolvedEnd !== this.size) {
        // super.slice(begin, end);
        return IndexedCollection.prototype.slice.call(this, begin, end);
      }
      var newSize = this.size - resolvedBegin;
      var head = this._head;
      while (resolvedBegin--) {
        head = head.next;
      }
      if (this.__ownerID) {
        this.size = newSize;
        this._head = head;
        this.__hash = undefined;
        this.__altered = true;
        return this;
      }
      return makeStack(newSize, head);
    };

    // @pragma Mutability

    Stack.prototype.__ensureOwner = function(ownerID) {
      if (ownerID === this.__ownerID) {
        return this;
      }
      if (!ownerID) {
        this.__ownerID = ownerID;
        this.__altered = false;
        return this;
      }
      return makeStack(this.size, this._head, ownerID, this.__hash);
    };

    // @pragma Iteration

    Stack.prototype.__iterate = function(fn, reverse) {
      if (reverse) {
        return this.reverse().__iterate(fn);
      }
      var iterations = 0;
      var node = this._head;
      while (node) {
        if (fn(node.value, iterations++, this) === false) {
          break;
        }
        node = node.next;
      }
      return iterations;
    };

    Stack.prototype.__iterator = function(type, reverse) {
      if (reverse) {
        return this.reverse().__iterator(type);
      }
      var iterations = 0;
      var node = this._head;
      return new Iterator(function()  {
        if (node) {
          var value = node.value;
          node = node.next;
          return iteratorValue(type, iterations++, value);
        }
        return iteratorDone();
      });
    };


  function isStack(maybeStack) {
    return !!(maybeStack && maybeStack[IS_STACK_SENTINEL]);
  }

  Stack.isStack = isStack;

  var IS_STACK_SENTINEL = '@@__IMMUTABLE_STACK__@@';

  var StackPrototype = Stack.prototype;
  StackPrototype[IS_STACK_SENTINEL] = true;
  StackPrototype.withMutations = MapPrototype.withMutations;
  StackPrototype.asMutable = MapPrototype.asMutable;
  StackPrototype.asImmutable = MapPrototype.asImmutable;
  StackPrototype.wasAltered = MapPrototype.wasAltered;


  function makeStack(size, head, ownerID, hash) {
    var map = Object.create(StackPrototype);
    map.size = size;
    map._head = head;
    map.__ownerID = ownerID;
    map.__hash = hash;
    map.__altered = false;
    return map;
  }

  var EMPTY_STACK;
  function emptyStack() {
    return EMPTY_STACK || (EMPTY_STACK = makeStack(0));
  }

  /**
   * Contributes additional methods to a constructor
   */
  function mixin(ctor, methods) {
    var keyCopier = function(key ) { ctor.prototype[key] = methods[key]; };
    Object.keys(methods).forEach(keyCopier);
    Object.getOwnPropertySymbols &&
      Object.getOwnPropertySymbols(methods).forEach(keyCopier);
    return ctor;
  }

  Iterable.Iterator = Iterator;

  mixin(Iterable, {

    // ### Conversion to other types

    toArray: function() {
      assertNotInfinite(this.size);
      var array = new Array(this.size || 0);
      this.valueSeq().__iterate(function(v, i)  { array[i] = v; });
      return array;
    },

    toIndexedSeq: function() {
      return new ToIndexedSequence(this);
    },

    toJS: function() {
      return this.toSeq().map(
        function(value ) {return value && typeof value.toJS === 'function' ? value.toJS() : value}
      ).__toJS();
    },

    toJSON: function() {
      return this.toSeq().map(
        function(value ) {return value && typeof value.toJSON === 'function' ? value.toJSON() : value}
      ).__toJS();
    },

    toKeyedSeq: function() {
      return new ToKeyedSequence(this, true);
    },

    toMap: function() {
      // Use Late Binding here to solve the circular dependency.
      return Map(this.toKeyedSeq());
    },

    toObject: function() {
      assertNotInfinite(this.size);
      var object = {};
      this.__iterate(function(v, k)  { object[k] = v; });
      return object;
    },

    toOrderedMap: function() {
      // Use Late Binding here to solve the circular dependency.
      return OrderedMap(this.toKeyedSeq());
    },

    toOrderedSet: function() {
      // Use Late Binding here to solve the circular dependency.
      return OrderedSet(isKeyed(this) ? this.valueSeq() : this);
    },

    toSet: function() {
      // Use Late Binding here to solve the circular dependency.
      return Set(isKeyed(this) ? this.valueSeq() : this);
    },

    toSetSeq: function() {
      return new ToSetSequence(this);
    },

    toSeq: function() {
      return isIndexed(this) ? this.toIndexedSeq() :
        isKeyed(this) ? this.toKeyedSeq() :
        this.toSetSeq();
    },

    toStack: function() {
      // Use Late Binding here to solve the circular dependency.
      return Stack(isKeyed(this) ? this.valueSeq() : this);
    },

    toList: function() {
      // Use Late Binding here to solve the circular dependency.
      return List(isKeyed(this) ? this.valueSeq() : this);
    },


    // ### Common JavaScript methods and properties

    toString: function() {
      return '[Iterable]';
    },

    __toString: function(head, tail) {
      if (this.size === 0) {
        return head + tail;
      }
      return head + ' ' + this.toSeq().map(this.__toStringMapper).join(', ') + ' ' + tail;
    },


    // ### ES6 Collection methods (ES6 Array and Map)

    concat: function() {var values = SLICE$0.call(arguments, 0);
      return reify(this, concatFactory(this, values));
    },

    includes: function(searchValue) {
      return this.some(function(value ) {return is(value, searchValue)});
    },

    entries: function() {
      return this.__iterator(ITERATE_ENTRIES);
    },

    every: function(predicate, context) {
      assertNotInfinite(this.size);
      var returnValue = true;
      this.__iterate(function(v, k, c)  {
        if (!predicate.call(context, v, k, c)) {
          returnValue = false;
          return false;
        }
      });
      return returnValue;
    },

    filter: function(predicate, context) {
      return reify(this, filterFactory(this, predicate, context, true));
    },

    find: function(predicate, context, notSetValue) {
      var entry = this.findEntry(predicate, context);
      return entry ? entry[1] : notSetValue;
    },

    findEntry: function(predicate, context) {
      var found;
      this.__iterate(function(v, k, c)  {
        if (predicate.call(context, v, k, c)) {
          found = [k, v];
          return false;
        }
      });
      return found;
    },

    findLastEntry: function(predicate, context) {
      return this.toSeq().reverse().findEntry(predicate, context);
    },

    forEach: function(sideEffect, context) {
      assertNotInfinite(this.size);
      return this.__iterate(context ? sideEffect.bind(context) : sideEffect);
    },

    join: function(separator) {
      assertNotInfinite(this.size);
      separator = separator !== undefined ? '' + separator : ',';
      var joined = '';
      var isFirst = true;
      this.__iterate(function(v ) {
        isFirst ? (isFirst = false) : (joined += separator);
        joined += v !== null && v !== undefined ? v.toString() : '';
      });
      return joined;
    },

    keys: function() {
      return this.__iterator(ITERATE_KEYS);
    },

    map: function(mapper, context) {
      return reify(this, mapFactory(this, mapper, context));
    },

    reduce: function(reducer, initialReduction, context) {
      assertNotInfinite(this.size);
      var reduction;
      var useFirst;
      if (arguments.length < 2) {
        useFirst = true;
      } else {
        reduction = initialReduction;
      }
      this.__iterate(function(v, k, c)  {
        if (useFirst) {
          useFirst = false;
          reduction = v;
        } else {
          reduction = reducer.call(context, reduction, v, k, c);
        }
      });
      return reduction;
    },

    reduceRight: function(reducer, initialReduction, context) {
      var reversed = this.toKeyedSeq().reverse();
      return reversed.reduce.apply(reversed, arguments);
    },

    reverse: function() {
      return reify(this, reverseFactory(this, true));
    },

    slice: function(begin, end) {
      return reify(this, sliceFactory(this, begin, end, true));
    },

    some: function(predicate, context) {
      return !this.every(not(predicate), context);
    },

    sort: function(comparator) {
      return reify(this, sortFactory(this, comparator));
    },

    values: function() {
      return this.__iterator(ITERATE_VALUES);
    },


    // ### More sequential methods

    butLast: function() {
      return this.slice(0, -1);
    },

    isEmpty: function() {
      return this.size !== undefined ? this.size === 0 : !this.some(function()  {return true});
    },

    count: function(predicate, context) {
      return ensureSize(
        predicate ? this.toSeq().filter(predicate, context) : this
      );
    },

    countBy: function(grouper, context) {
      return countByFactory(this, grouper, context);
    },

    equals: function(other) {
      return deepEqual(this, other);
    },

    entrySeq: function() {
      var iterable = this;
      if (iterable._cache) {
        // We cache as an entries array, so we can just return the cache!
        return new ArraySeq(iterable._cache);
      }
      var entriesSequence = iterable.toSeq().map(entryMapper).toIndexedSeq();
      entriesSequence.fromEntrySeq = function()  {return iterable.toSeq()};
      return entriesSequence;
    },

    filterNot: function(predicate, context) {
      return this.filter(not(predicate), context);
    },

    findLast: function(predicate, context, notSetValue) {
      return this.toKeyedSeq().reverse().find(predicate, context, notSetValue);
    },

    first: function() {
      return this.find(returnTrue);
    },

    flatMap: function(mapper, context) {
      return reify(this, flatMapFactory(this, mapper, context));
    },

    flatten: function(depth) {
      return reify(this, flattenFactory(this, depth, true));
    },

    fromEntrySeq: function() {
      return new FromEntriesSequence(this);
    },

    get: function(searchKey, notSetValue) {
      return this.find(function(_, key)  {return is(key, searchKey)}, undefined, notSetValue);
    },

    getIn: function(searchKeyPath, notSetValue) {
      var nested = this;
      // Note: in an ES6 environment, we would prefer:
      // for (var key of searchKeyPath) {
      var iter = forceIterator(searchKeyPath);
      var step;
      while (!(step = iter.next()).done) {
        var key = step.value;
        nested = nested && nested.get ? nested.get(key, NOT_SET) : NOT_SET;
        if (nested === NOT_SET) {
          return notSetValue;
        }
      }
      return nested;
    },

    groupBy: function(grouper, context) {
      return groupByFactory(this, grouper, context);
    },

    has: function(searchKey) {
      return this.get(searchKey, NOT_SET) !== NOT_SET;
    },

    hasIn: function(searchKeyPath) {
      return this.getIn(searchKeyPath, NOT_SET) !== NOT_SET;
    },

    isSubset: function(iter) {
      iter = typeof iter.includes === 'function' ? iter : Iterable(iter);
      return this.every(function(value ) {return iter.includes(value)});
    },

    isSuperset: function(iter) {
      iter = typeof iter.isSubset === 'function' ? iter : Iterable(iter);
      return iter.isSubset(this);
    },

    keySeq: function() {
      return this.toSeq().map(keyMapper).toIndexedSeq();
    },

    last: function() {
      return this.toSeq().reverse().first();
    },

    max: function(comparator) {
      return maxFactory(this, comparator);
    },

    maxBy: function(mapper, comparator) {
      return maxFactory(this, comparator, mapper);
    },

    min: function(comparator) {
      return maxFactory(this, comparator ? neg(comparator) : defaultNegComparator);
    },

    minBy: function(mapper, comparator) {
      return maxFactory(this, comparator ? neg(comparator) : defaultNegComparator, mapper);
    },

    rest: function() {
      return this.slice(1);
    },

    skip: function(amount) {
      return this.slice(Math.max(0, amount));
    },

    skipLast: function(amount) {
      return reify(this, this.toSeq().reverse().skip(amount).reverse());
    },

    skipWhile: function(predicate, context) {
      return reify(this, skipWhileFactory(this, predicate, context, true));
    },

    skipUntil: function(predicate, context) {
      return this.skipWhile(not(predicate), context);
    },

    sortBy: function(mapper, comparator) {
      return reify(this, sortFactory(this, comparator, mapper));
    },

    take: function(amount) {
      return this.slice(0, Math.max(0, amount));
    },

    takeLast: function(amount) {
      return reify(this, this.toSeq().reverse().take(amount).reverse());
    },

    takeWhile: function(predicate, context) {
      return reify(this, takeWhileFactory(this, predicate, context));
    },

    takeUntil: function(predicate, context) {
      return this.takeWhile(not(predicate), context);
    },

    valueSeq: function() {
      return this.toIndexedSeq();
    },


    // ### Hashable Object

    hashCode: function() {
      return this.__hash || (this.__hash = hashIterable(this));
    }


    // ### Internal

    // abstract __iterate(fn, reverse)

    // abstract __iterator(type, reverse)
  });

  // var IS_ITERABLE_SENTINEL = '@@__IMMUTABLE_ITERABLE__@@';
  // var IS_KEYED_SENTINEL = '@@__IMMUTABLE_KEYED__@@';
  // var IS_INDEXED_SENTINEL = '@@__IMMUTABLE_INDEXED__@@';
  // var IS_ORDERED_SENTINEL = '@@__IMMUTABLE_ORDERED__@@';

  var IterablePrototype = Iterable.prototype;
  IterablePrototype[IS_ITERABLE_SENTINEL] = true;
  IterablePrototype[ITERATOR_SYMBOL] = IterablePrototype.values;
  IterablePrototype.__toJS = IterablePrototype.toArray;
  IterablePrototype.__toStringMapper = quoteString;
  IterablePrototype.inspect =
  IterablePrototype.toSource = function() { return this.toString(); };
  IterablePrototype.chain = IterablePrototype.flatMap;
  IterablePrototype.contains = IterablePrototype.includes;

  // Temporary warning about using length
  (function () {
    try {
      Object.defineProperty(IterablePrototype, 'length', {
        get: function () {
          if (!Iterable.noLengthWarning) {
            var stack;
            try {
              throw new Error();
            } catch (error) {
              stack = error.stack;
            }
            if (stack.indexOf('_wrapObject') === -1) {
              console && console.warn && console.warn(
                'iterable.length has been deprecated, '+
                'use iterable.size or iterable.count(). '+
                'This warning will become a silent error in a future version. ' +
                stack
              );
              return this.size;
            }
          }
        }
      });
    } catch (e) {}
  })();



  mixin(KeyedIterable, {

    // ### More sequential methods

    flip: function() {
      return reify(this, flipFactory(this));
    },

    findKey: function(predicate, context) {
      var entry = this.findEntry(predicate, context);
      return entry && entry[0];
    },

    findLastKey: function(predicate, context) {
      return this.toSeq().reverse().findKey(predicate, context);
    },

    keyOf: function(searchValue) {
      return this.findKey(function(value ) {return is(value, searchValue)});
    },

    lastKeyOf: function(searchValue) {
      return this.findLastKey(function(value ) {return is(value, searchValue)});
    },

    mapEntries: function(mapper, context) {var this$0 = this;
      var iterations = 0;
      return reify(this,
        this.toSeq().map(
          function(v, k)  {return mapper.call(context, [k, v], iterations++, this$0)}
        ).fromEntrySeq()
      );
    },

    mapKeys: function(mapper, context) {var this$0 = this;
      return reify(this,
        this.toSeq().flip().map(
          function(k, v)  {return mapper.call(context, k, v, this$0)}
        ).flip()
      );
    }

  });

  var KeyedIterablePrototype = KeyedIterable.prototype;
  KeyedIterablePrototype[IS_KEYED_SENTINEL] = true;
  KeyedIterablePrototype[ITERATOR_SYMBOL] = IterablePrototype.entries;
  KeyedIterablePrototype.__toJS = IterablePrototype.toObject;
  KeyedIterablePrototype.__toStringMapper = function(v, k)  {return JSON.stringify(k) + ': ' + quoteString(v)};



  mixin(IndexedIterable, {

    // ### Conversion to other types

    toKeyedSeq: function() {
      return new ToKeyedSequence(this, false);
    },


    // ### ES6 Collection methods (ES6 Array and Map)

    filter: function(predicate, context) {
      return reify(this, filterFactory(this, predicate, context, false));
    },

    findIndex: function(predicate, context) {
      var entry = this.findEntry(predicate, context);
      return entry ? entry[0] : -1;
    },

    indexOf: function(searchValue) {
      var key = this.toKeyedSeq().keyOf(searchValue);
      return key === undefined ? -1 : key;
    },

    lastIndexOf: function(searchValue) {
      var key = this.toKeyedSeq().reverse().keyOf(searchValue);
      return key === undefined ? -1 : key;

      // var index =
      // return this.toSeq().reverse().indexOf(searchValue);
    },

    reverse: function() {
      return reify(this, reverseFactory(this, false));
    },

    slice: function(begin, end) {
      return reify(this, sliceFactory(this, begin, end, false));
    },

    splice: function(index, removeNum /*, ...values*/) {
      var numArgs = arguments.length;
      removeNum = Math.max(removeNum | 0, 0);
      if (numArgs === 0 || (numArgs === 2 && !removeNum)) {
        return this;
      }
      // If index is negative, it should resolve relative to the size of the
      // collection. However size may be expensive to compute if not cached, so
      // only call count() if the number is in fact negative.
      index = resolveBegin(index, index < 0 ? this.count() : this.size);
      var spliced = this.slice(0, index);
      return reify(
        this,
        numArgs === 1 ?
          spliced :
          spliced.concat(arrCopy(arguments, 2), this.slice(index + removeNum))
      );
    },


    // ### More collection methods

    findLastIndex: function(predicate, context) {
      var key = this.toKeyedSeq().findLastKey(predicate, context);
      return key === undefined ? -1 : key;
    },

    first: function() {
      return this.get(0);
    },

    flatten: function(depth) {
      return reify(this, flattenFactory(this, depth, false));
    },

    get: function(index, notSetValue) {
      index = wrapIndex(this, index);
      return (index < 0 || (this.size === Infinity ||
          (this.size !== undefined && index > this.size))) ?
        notSetValue :
        this.find(function(_, key)  {return key === index}, undefined, notSetValue);
    },

    has: function(index) {
      index = wrapIndex(this, index);
      return index >= 0 && (this.size !== undefined ?
        this.size === Infinity || index < this.size :
        this.indexOf(index) !== -1
      );
    },

    interpose: function(separator) {
      return reify(this, interposeFactory(this, separator));
    },

    interleave: function(/*...iterables*/) {
      var iterables = [this].concat(arrCopy(arguments));
      var zipped = zipWithFactory(this.toSeq(), IndexedSeq.of, iterables);
      var interleaved = zipped.flatten(true);
      if (zipped.size) {
        interleaved.size = zipped.size * iterables.length;
      }
      return reify(this, interleaved);
    },

    last: function() {
      return this.get(-1);
    },

    skipWhile: function(predicate, context) {
      return reify(this, skipWhileFactory(this, predicate, context, false));
    },

    zip: function(/*, ...iterables */) {
      var iterables = [this].concat(arrCopy(arguments));
      return reify(this, zipWithFactory(this, defaultZipper, iterables));
    },

    zipWith: function(zipper/*, ...iterables */) {
      var iterables = arrCopy(arguments);
      iterables[0] = this;
      return reify(this, zipWithFactory(this, zipper, iterables));
    }

  });

  IndexedIterable.prototype[IS_INDEXED_SENTINEL] = true;
  IndexedIterable.prototype[IS_ORDERED_SENTINEL] = true;



  mixin(SetIterable, {

    // ### ES6 Collection methods (ES6 Array and Map)

    get: function(value, notSetValue) {
      return this.has(value) ? value : notSetValue;
    },

    includes: function(value) {
      return this.has(value);
    },


    // ### More sequential methods

    keySeq: function() {
      return this.valueSeq();
    }

  });

  SetIterable.prototype.has = IterablePrototype.includes;


  // Mixin subclasses

  mixin(KeyedSeq, KeyedIterable.prototype);
  mixin(IndexedSeq, IndexedIterable.prototype);
  mixin(SetSeq, SetIterable.prototype);

  mixin(KeyedCollection, KeyedIterable.prototype);
  mixin(IndexedCollection, IndexedIterable.prototype);
  mixin(SetCollection, SetIterable.prototype);


  // #pragma Helper functions

  function keyMapper(v, k) {
    return k;
  }

  function entryMapper(v, k) {
    return [k, v];
  }

  function not(predicate) {
    return function() {
      return !predicate.apply(this, arguments);
    }
  }

  function neg(predicate) {
    return function() {
      return -predicate.apply(this, arguments);
    }
  }

  function quoteString(value) {
    return typeof value === 'string' ? JSON.stringify(value) : value;
  }

  function defaultZipper() {
    return arrCopy(arguments);
  }

  function defaultNegComparator(a, b) {
    return a < b ? 1 : a > b ? -1 : 0;
  }

  function hashIterable(iterable) {
    if (iterable.size === Infinity) {
      return 0;
    }
    var ordered = isOrdered(iterable);
    var keyed = isKeyed(iterable);
    var h = ordered ? 1 : 0;
    var size = iterable.__iterate(
      keyed ?
        ordered ?
          function(v, k)  { h = 31 * h + hashMerge(hash(v), hash(k)) | 0; } :
          function(v, k)  { h = h + hashMerge(hash(v), hash(k)) | 0; } :
        ordered ?
          function(v ) { h = 31 * h + hash(v) | 0; } :
          function(v ) { h = h + hash(v) | 0; }
    );
    return murmurHashOfSize(size, h);
  }

  function murmurHashOfSize(size, h) {
    h = imul(h, 0xCC9E2D51);
    h = imul(h << 15 | h >>> -15, 0x1B873593);
    h = imul(h << 13 | h >>> -13, 5);
    h = (h + 0xE6546B64 | 0) ^ size;
    h = imul(h ^ h >>> 16, 0x85EBCA6B);
    h = imul(h ^ h >>> 13, 0xC2B2AE35);
    h = smi(h ^ h >>> 16);
    return h;
  }

  function hashMerge(a, b) {
    return a ^ b + 0x9E3779B9 + (a << 6) + (a >> 2) | 0; // int
  }

  var Immutable = {

    Iterable: Iterable,

    Seq: Seq,
    Collection: Collection,
    Map: Map,
    OrderedMap: OrderedMap,
    List: List,
    Stack: Stack,
    Set: Set,
    OrderedSet: OrderedSet,

    Record: Record,
    Range: Range,
    Repeat: Repeat,

    is: is,
    fromJS: fromJS

  };

  return Immutable;

}));

/***/ }),

/***/ "./node_modules/fbjs/lib/DataTransfer.js":
/*!***********************************************!*\
  !*** ./node_modules/fbjs/lib/DataTransfer.js ***!
  \***********************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";


/**
 * Copyright (c) 2013-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @typechecks
 */
var PhotosMimeType = __webpack_require__(/*! ./PhotosMimeType */ "./node_modules/fbjs/lib/PhotosMimeType.js");

var createArrayFromMixed = __webpack_require__(/*! ./createArrayFromMixed */ "./node_modules/fbjs/lib/createArrayFromMixed.js");

var emptyFunction = __webpack_require__(/*! ./emptyFunction */ "./node_modules/fbjs/lib/emptyFunction.js");

var CR_LF_REGEX = new RegExp("\r\n", 'g');
var LF_ONLY = "\n";
var RICH_TEXT_TYPES = {
  'text/rtf': 1,
  'text/html': 1
};
/**
 * If DataTransferItem is a file then return the Blob of data.
 *
 * @param {object} item
 * @return {?blob}
 */

function getFileFromDataTransfer(item) {
  if (item.kind == 'file') {
    return item.getAsFile();
  }
}

var DataTransfer =
/*#__PURE__*/
function () {
  /**
   * @param {object} data
   */
  function DataTransfer(data) {
    this.data = data; // Types could be DOMStringList or array

    this.types = data.types ? createArrayFromMixed(data.types) : [];
  }
  /**
   * Is this likely to be a rich text data transfer?
   *
   * @return {boolean}
   */


  var _proto = DataTransfer.prototype;

  _proto.isRichText = function isRichText() {
    // If HTML is available, treat this data as rich text. This way, we avoid
    // using a pasted image if it is packaged with HTML -- this may occur with
    // pastes from MS Word, for example.  However this is only rich text if
    // there's accompanying text.
    if (this.getHTML() && this.getText()) {
      return true;
    } // When an image is copied from a preview window, you end up with two
    // DataTransferItems one of which is a file's metadata as text.  Skip those.


    if (this.isImage()) {
      return false;
    }

    return this.types.some(function (type) {
      return RICH_TEXT_TYPES[type];
    });
  };
  /**
   * Get raw text.
   *
   * @return {?string}
   */


  _proto.getText = function getText() {
    var text;

    if (this.data.getData) {
      if (!this.types.length) {
        text = this.data.getData('Text');
      } else if (this.types.indexOf('text/plain') != -1) {
        text = this.data.getData('text/plain');
      }
    }

    return text ? text.replace(CR_LF_REGEX, LF_ONLY) : null;
  };
  /**
   * Get HTML paste data
   *
   * @return {?string}
   */


  _proto.getHTML = function getHTML() {
    if (this.data.getData) {
      if (!this.types.length) {
        return this.data.getData('Text');
      } else if (this.types.indexOf('text/html') != -1) {
        return this.data.getData('text/html');
      }
    }
  };
  /**
   * Is this a link data transfer?
   *
   * @return {boolean}
   */


  _proto.isLink = function isLink() {
    return this.types.some(function (type) {
      return type.indexOf('Url') != -1 || type.indexOf('text/uri-list') != -1 || type.indexOf('text/x-moz-url');
    });
  };
  /**
   * Get a link url.
   *
   * @return {?string}
   */


  _proto.getLink = function getLink() {
    if (this.data.getData) {
      if (this.types.indexOf('text/x-moz-url') != -1) {
        var url = this.data.getData('text/x-moz-url').split('\n');
        return url[0];
      }

      return this.types.indexOf('text/uri-list') != -1 ? this.data.getData('text/uri-list') : this.data.getData('url');
    }

    return null;
  };
  /**
   * Is this an image data transfer?
   *
   * @return {boolean}
   */


  _proto.isImage = function isImage() {
    var isImage = this.types.some(function (type) {
      // Firefox will have a type of application/x-moz-file for images during
      // dragging
      return type.indexOf('application/x-moz-file') != -1;
    });

    if (isImage) {
      return true;
    }

    var items = this.getFiles();

    for (var i = 0; i < items.length; i++) {
      var type = items[i].type;

      if (!PhotosMimeType.isImage(type)) {
        return false;
      }
    }

    return true;
  };

  _proto.getCount = function getCount() {
    if (this.data.hasOwnProperty('items')) {
      return this.data.items.length;
    } else if (this.data.hasOwnProperty('mozItemCount')) {
      return this.data.mozItemCount;
    } else if (this.data.files) {
      return this.data.files.length;
    }

    return null;
  };
  /**
   * Get files.
   *
   * @return {array}
   */


  _proto.getFiles = function getFiles() {
    if (this.data.items) {
      // createArrayFromMixed doesn't properly handle DataTransferItemLists.
      return Array.prototype.slice.call(this.data.items).map(getFileFromDataTransfer).filter(emptyFunction.thatReturnsArgument);
    } else if (this.data.files) {
      return Array.prototype.slice.call(this.data.files);
    } else {
      return [];
    }
  };
  /**
   * Are there any files to fetch?
   *
   * @return {boolean}
   */


  _proto.hasFiles = function hasFiles() {
    return this.getFiles().length > 0;
  };

  return DataTransfer;
}();

module.exports = DataTransfer;

/***/ }),

/***/ "./node_modules/fbjs/lib/Keys.js":
/*!***************************************!*\
  !*** ./node_modules/fbjs/lib/Keys.js ***!
  \***************************************/
/***/ ((module) => {

"use strict";


/**
 * Copyright (c) 2013-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */
module.exports = {
  BACKSPACE: 8,
  TAB: 9,
  RETURN: 13,
  ALT: 18,
  ESC: 27,
  SPACE: 32,
  PAGE_UP: 33,
  PAGE_DOWN: 34,
  END: 35,
  HOME: 36,
  LEFT: 37,
  UP: 38,
  RIGHT: 39,
  DOWN: 40,
  DELETE: 46,
  COMMA: 188,
  PERIOD: 190,
  A: 65,
  Z: 90,
  ZERO: 48,
  NUMPAD_0: 96,
  NUMPAD_9: 105
};

/***/ }),

/***/ "./node_modules/fbjs/lib/PhotosMimeType.js":
/*!*************************************************!*\
  !*** ./node_modules/fbjs/lib/PhotosMimeType.js ***!
  \*************************************************/
/***/ ((module) => {

"use strict";


/**
 * Copyright (c) 2013-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */
var PhotosMimeType = {
  isImage: function isImage(mimeString) {
    return getParts(mimeString)[0] === 'image';
  },
  isJpeg: function isJpeg(mimeString) {
    var parts = getParts(mimeString);
    return PhotosMimeType.isImage(mimeString) && ( // see http://fburl.com/10972194
    parts[1] === 'jpeg' || parts[1] === 'pjpeg');
  }
};

function getParts(mimeString) {
  return mimeString.split('/');
}

module.exports = PhotosMimeType;

/***/ }),

/***/ "./node_modules/fbjs/lib/Scroll.js":
/*!*****************************************!*\
  !*** ./node_modules/fbjs/lib/Scroll.js ***!
  \*****************************************/
/***/ ((module) => {

"use strict";


/**
 * Copyright (c) 2013-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

/**
 * @param {DOMElement} element
 * @param {DOMDocument} doc
 * @return {boolean}
 */
function _isViewportScrollElement(element, doc) {
  return !!doc && (element === doc.documentElement || element === doc.body);
}
/**
 * Scroll Module. This class contains 4 simple static functions
 * to be used to access Element.scrollTop/scrollLeft properties.
 * To solve the inconsistencies between browsers when either
 * document.body or document.documentElement is supplied,
 * below logic will be used to alleviate the issue:
 *
 * 1. If 'element' is either 'document.body' or 'document.documentElement,
 *    get whichever element's 'scroll{Top,Left}' is larger.
 * 2. If 'element' is either 'document.body' or 'document.documentElement',
 *    set the 'scroll{Top,Left}' on both elements.
 */


var Scroll = {
  /**
   * @param {DOMElement} element
   * @return {number}
   */
  getTop: function getTop(element) {
    var doc = element.ownerDocument;
    return _isViewportScrollElement(element, doc) ? // In practice, they will either both have the same value,
    // or one will be zero and the other will be the scroll position
    // of the viewport. So we can use `X || Y` instead of `Math.max(X, Y)`
    doc.body.scrollTop || doc.documentElement.scrollTop : element.scrollTop;
  },

  /**
   * @param {DOMElement} element
   * @param {number} newTop
   */
  setTop: function setTop(element, newTop) {
    var doc = element.ownerDocument;

    if (_isViewportScrollElement(element, doc)) {
      doc.body.scrollTop = doc.documentElement.scrollTop = newTop;
    } else {
      element.scrollTop = newTop;
    }
  },

  /**
   * @param {DOMElement} element
   * @return {number}
   */
  getLeft: function getLeft(element) {
    var doc = element.ownerDocument;
    return _isViewportScrollElement(element, doc) ? doc.body.scrollLeft || doc.documentElement.scrollLeft : element.scrollLeft;
  },

  /**
   * @param {DOMElement} element
   * @param {number} newLeft
   */
  setLeft: function setLeft(element, newLeft) {
    var doc = element.ownerDocument;

    if (_isViewportScrollElement(element, doc)) {
      doc.body.scrollLeft = doc.documentElement.scrollLeft = newLeft;
    } else {
      element.scrollLeft = newLeft;
    }
  }
};
module.exports = Scroll;

/***/ }),

/***/ "./node_modules/fbjs/lib/Style.js":
/*!****************************************!*\
  !*** ./node_modules/fbjs/lib/Style.js ***!
  \****************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";


/**
 * Copyright (c) 2013-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @typechecks
 */
var getStyleProperty = __webpack_require__(/*! ./getStyleProperty */ "./node_modules/fbjs/lib/getStyleProperty.js");
/**
 * @param {DOMNode} element [description]
 * @param {string} name Overflow style property name.
 * @return {boolean} True if the supplied ndoe is scrollable.
 */


function _isNodeScrollable(element, name) {
  var overflow = Style.get(element, name);
  return overflow === 'auto' || overflow === 'scroll';
}
/**
 * Utilities for querying and mutating style properties.
 */


var Style = {
  /**
   * Gets the style property for the supplied node. This will return either the
   * computed style, if available, or the declared style.
   *
   * @param {DOMNode} node
   * @param {string} name Style property name.
   * @return {?string} Style property value.
   */
  get: getStyleProperty,

  /**
   * Determines the nearest ancestor of a node that is scrollable.
   *
   * NOTE: This can be expensive if used repeatedly or on a node nested deeply.
   *
   * @param {?DOMNode} node Node from which to start searching.
   * @return {?DOMWindow|DOMElement} Scroll parent of the supplied node.
   */
  getScrollParent: function getScrollParent(node) {
    if (!node) {
      return null;
    }

    var ownerDocument = node.ownerDocument;

    while (node && node !== ownerDocument.body) {
      if (_isNodeScrollable(node, 'overflow') || _isNodeScrollable(node, 'overflowY') || _isNodeScrollable(node, 'overflowX')) {
        return node;
      }

      node = node.parentNode;
    }

    return ownerDocument.defaultView || ownerDocument.parentWindow;
  }
};
module.exports = Style;

/***/ }),

/***/ "./node_modules/fbjs/lib/TokenizeUtil.js":
/*!***********************************************!*\
  !*** ./node_modules/fbjs/lib/TokenizeUtil.js ***!
  \***********************************************/
/***/ ((module) => {

"use strict";
/**
 * Copyright (c) 2013-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @typechecks
 * @stub
 * 
 */
 // \u00a1-\u00b1\u00b4-\u00b8\u00ba\u00bb\u00bf
//             is latin supplement punctuation except fractions and superscript
//             numbers
// \u2010-\u2027\u2030-\u205e
//             is punctuation from the general punctuation block:
//             weird quotes, commas, bullets, dashes, etc.
// \u30fb\u3001\u3002\u3008-\u3011\u3014-\u301f
//             is CJK punctuation
// \uff1a-\uff1f\uff01-\uff0f\uff3b-\uff40\uff5b-\uff65
//             is some full-width/half-width punctuation
// \u2E2E\u061f\u066a-\u066c\u061b\u060c\u060d\uFD3e\uFD3F
//             is some Arabic punctuation marks
// \u1801\u0964\u104a\u104b
//             is misc. other language punctuation marks

var PUNCTUATION = '[.,+*?$|#{}()\'\\^\\-\\[\\]\\\\\\/!@%"~=<>_:;' + "\u30FB\u3001\u3002\u3008-\u3011\u3014-\u301F\uFF1A-\uFF1F\uFF01-\uFF0F" + "\uFF3B-\uFF40\uFF5B-\uFF65\u2E2E\u061F\u066A-\u066C\u061B\u060C\u060D" + "\uFD3E\uFD3F\u1801\u0964\u104A\u104B\u2010-\u2027\u2030-\u205E" + "\xA1-\xB1\xB4-\xB8\xBA\xBB\xBF]";
module.exports = {
  getPunctuation: function getPunctuation() {
    return PUNCTUATION;
  }
};

/***/ }),

/***/ "./node_modules/fbjs/lib/URI.js":
/*!**************************************!*\
  !*** ./node_modules/fbjs/lib/URI.js ***!
  \**************************************/
/***/ ((module) => {

"use strict";
/**
 * Copyright (c) 2013-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * 
 */


function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var URI =
/*#__PURE__*/
function () {
  function URI(uri) {
    _defineProperty(this, "_uri", void 0);

    this._uri = uri;
  }

  var _proto = URI.prototype;

  _proto.toString = function toString() {
    return this._uri;
  };

  return URI;
}();

module.exports = URI;

/***/ }),

/***/ "./node_modules/fbjs/lib/UnicodeBidi.js":
/*!**********************************************!*\
  !*** ./node_modules/fbjs/lib/UnicodeBidi.js ***!
  \**********************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";
/**
 * Copyright (c) 2013-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @typechecks
 * 
 */

/**
 * Basic (stateless) API for text direction detection
 *
 * Part of our implementation of Unicode Bidirectional Algorithm (UBA)
 * Unicode Standard Annex #9 (UAX9)
 * http://www.unicode.org/reports/tr9/
 */


var UnicodeBidiDirection = __webpack_require__(/*! ./UnicodeBidiDirection */ "./node_modules/fbjs/lib/UnicodeBidiDirection.js");

var invariant = __webpack_require__(/*! ./invariant */ "./node_modules/fbjs/lib/invariant.js");

/**
 * RegExp ranges of characters with a *Strong* Bidi_Class value.
 *
 * Data is based on DerivedBidiClass.txt in UCD version 7.0.0.
 *
 * NOTE: For performance reasons, we only support Unicode's
 *       Basic Multilingual Plane (BMP) for now.
 */
var RANGE_BY_BIDI_TYPE = {
  L: "A-Za-z\xAA\xB5\xBA\xC0-\xD6\xD8-\xF6\xF8-\u01BA\u01BB" + "\u01BC-\u01BF\u01C0-\u01C3\u01C4-\u0293\u0294\u0295-\u02AF\u02B0-\u02B8" + "\u02BB-\u02C1\u02D0-\u02D1\u02E0-\u02E4\u02EE\u0370-\u0373\u0376-\u0377" + "\u037A\u037B-\u037D\u037F\u0386\u0388-\u038A\u038C\u038E-\u03A1" + "\u03A3-\u03F5\u03F7-\u0481\u0482\u048A-\u052F\u0531-\u0556\u0559" + "\u055A-\u055F\u0561-\u0587\u0589\u0903\u0904-\u0939\u093B\u093D" + "\u093E-\u0940\u0949-\u094C\u094E-\u094F\u0950\u0958-\u0961\u0964-\u0965" + "\u0966-\u096F\u0970\u0971\u0972-\u0980\u0982-\u0983\u0985-\u098C" + "\u098F-\u0990\u0993-\u09A8\u09AA-\u09B0\u09B2\u09B6-\u09B9\u09BD" + "\u09BE-\u09C0\u09C7-\u09C8\u09CB-\u09CC\u09CE\u09D7\u09DC-\u09DD" + "\u09DF-\u09E1\u09E6-\u09EF\u09F0-\u09F1\u09F4-\u09F9\u09FA\u0A03" + "\u0A05-\u0A0A\u0A0F-\u0A10\u0A13-\u0A28\u0A2A-\u0A30\u0A32-\u0A33" + "\u0A35-\u0A36\u0A38-\u0A39\u0A3E-\u0A40\u0A59-\u0A5C\u0A5E\u0A66-\u0A6F" + "\u0A72-\u0A74\u0A83\u0A85-\u0A8D\u0A8F-\u0A91\u0A93-\u0AA8\u0AAA-\u0AB0" + "\u0AB2-\u0AB3\u0AB5-\u0AB9\u0ABD\u0ABE-\u0AC0\u0AC9\u0ACB-\u0ACC\u0AD0" + "\u0AE0-\u0AE1\u0AE6-\u0AEF\u0AF0\u0B02-\u0B03\u0B05-\u0B0C\u0B0F-\u0B10" + "\u0B13-\u0B28\u0B2A-\u0B30\u0B32-\u0B33\u0B35-\u0B39\u0B3D\u0B3E\u0B40" + "\u0B47-\u0B48\u0B4B-\u0B4C\u0B57\u0B5C-\u0B5D\u0B5F-\u0B61\u0B66-\u0B6F" + "\u0B70\u0B71\u0B72-\u0B77\u0B83\u0B85-\u0B8A\u0B8E-\u0B90\u0B92-\u0B95" + "\u0B99-\u0B9A\u0B9C\u0B9E-\u0B9F\u0BA3-\u0BA4\u0BA8-\u0BAA\u0BAE-\u0BB9" + "\u0BBE-\u0BBF\u0BC1-\u0BC2\u0BC6-\u0BC8\u0BCA-\u0BCC\u0BD0\u0BD7" + "\u0BE6-\u0BEF\u0BF0-\u0BF2\u0C01-\u0C03\u0C05-\u0C0C\u0C0E-\u0C10" + "\u0C12-\u0C28\u0C2A-\u0C39\u0C3D\u0C41-\u0C44\u0C58-\u0C59\u0C60-\u0C61" + "\u0C66-\u0C6F\u0C7F\u0C82-\u0C83\u0C85-\u0C8C\u0C8E-\u0C90\u0C92-\u0CA8" + "\u0CAA-\u0CB3\u0CB5-\u0CB9\u0CBD\u0CBE\u0CBF\u0CC0-\u0CC4\u0CC6" + "\u0CC7-\u0CC8\u0CCA-\u0CCB\u0CD5-\u0CD6\u0CDE\u0CE0-\u0CE1\u0CE6-\u0CEF" + "\u0CF1-\u0CF2\u0D02-\u0D03\u0D05-\u0D0C\u0D0E-\u0D10\u0D12-\u0D3A\u0D3D" + "\u0D3E-\u0D40\u0D46-\u0D48\u0D4A-\u0D4C\u0D4E\u0D57\u0D60-\u0D61" + "\u0D66-\u0D6F\u0D70-\u0D75\u0D79\u0D7A-\u0D7F\u0D82-\u0D83\u0D85-\u0D96" + "\u0D9A-\u0DB1\u0DB3-\u0DBB\u0DBD\u0DC0-\u0DC6\u0DCF-\u0DD1\u0DD8-\u0DDF" + "\u0DE6-\u0DEF\u0DF2-\u0DF3\u0DF4\u0E01-\u0E30\u0E32-\u0E33\u0E40-\u0E45" + "\u0E46\u0E4F\u0E50-\u0E59\u0E5A-\u0E5B\u0E81-\u0E82\u0E84\u0E87-\u0E88" + "\u0E8A\u0E8D\u0E94-\u0E97\u0E99-\u0E9F\u0EA1-\u0EA3\u0EA5\u0EA7" + "\u0EAA-\u0EAB\u0EAD-\u0EB0\u0EB2-\u0EB3\u0EBD\u0EC0-\u0EC4\u0EC6" + "\u0ED0-\u0ED9\u0EDC-\u0EDF\u0F00\u0F01-\u0F03\u0F04-\u0F12\u0F13\u0F14" + "\u0F15-\u0F17\u0F1A-\u0F1F\u0F20-\u0F29\u0F2A-\u0F33\u0F34\u0F36\u0F38" + "\u0F3E-\u0F3F\u0F40-\u0F47\u0F49-\u0F6C\u0F7F\u0F85\u0F88-\u0F8C" + "\u0FBE-\u0FC5\u0FC7-\u0FCC\u0FCE-\u0FCF\u0FD0-\u0FD4\u0FD5-\u0FD8" + "\u0FD9-\u0FDA\u1000-\u102A\u102B-\u102C\u1031\u1038\u103B-\u103C\u103F" + "\u1040-\u1049\u104A-\u104F\u1050-\u1055\u1056-\u1057\u105A-\u105D\u1061" + "\u1062-\u1064\u1065-\u1066\u1067-\u106D\u106E-\u1070\u1075-\u1081" + "\u1083-\u1084\u1087-\u108C\u108E\u108F\u1090-\u1099\u109A-\u109C" + "\u109E-\u109F\u10A0-\u10C5\u10C7\u10CD\u10D0-\u10FA\u10FB\u10FC" + "\u10FD-\u1248\u124A-\u124D\u1250-\u1256\u1258\u125A-\u125D\u1260-\u1288" + "\u128A-\u128D\u1290-\u12B0\u12B2-\u12B5\u12B8-\u12BE\u12C0\u12C2-\u12C5" + "\u12C8-\u12D6\u12D8-\u1310\u1312-\u1315\u1318-\u135A\u1360-\u1368" + "\u1369-\u137C\u1380-\u138F\u13A0-\u13F4\u1401-\u166C\u166D-\u166E" + "\u166F-\u167F\u1681-\u169A\u16A0-\u16EA\u16EB-\u16ED\u16EE-\u16F0" + "\u16F1-\u16F8\u1700-\u170C\u170E-\u1711\u1720-\u1731\u1735-\u1736" + "\u1740-\u1751\u1760-\u176C\u176E-\u1770\u1780-\u17B3\u17B6\u17BE-\u17C5" + "\u17C7-\u17C8\u17D4-\u17D6\u17D7\u17D8-\u17DA\u17DC\u17E0-\u17E9" + "\u1810-\u1819\u1820-\u1842\u1843\u1844-\u1877\u1880-\u18A8\u18AA" + "\u18B0-\u18F5\u1900-\u191E\u1923-\u1926\u1929-\u192B\u1930-\u1931" + "\u1933-\u1938\u1946-\u194F\u1950-\u196D\u1970-\u1974\u1980-\u19AB" + "\u19B0-\u19C0\u19C1-\u19C7\u19C8-\u19C9\u19D0-\u19D9\u19DA\u1A00-\u1A16" + "\u1A19-\u1A1A\u1A1E-\u1A1F\u1A20-\u1A54\u1A55\u1A57\u1A61\u1A63-\u1A64" + "\u1A6D-\u1A72\u1A80-\u1A89\u1A90-\u1A99\u1AA0-\u1AA6\u1AA7\u1AA8-\u1AAD" + "\u1B04\u1B05-\u1B33\u1B35\u1B3B\u1B3D-\u1B41\u1B43-\u1B44\u1B45-\u1B4B" + "\u1B50-\u1B59\u1B5A-\u1B60\u1B61-\u1B6A\u1B74-\u1B7C\u1B82\u1B83-\u1BA0" + "\u1BA1\u1BA6-\u1BA7\u1BAA\u1BAE-\u1BAF\u1BB0-\u1BB9\u1BBA-\u1BE5\u1BE7" + "\u1BEA-\u1BEC\u1BEE\u1BF2-\u1BF3\u1BFC-\u1BFF\u1C00-\u1C23\u1C24-\u1C2B" + "\u1C34-\u1C35\u1C3B-\u1C3F\u1C40-\u1C49\u1C4D-\u1C4F\u1C50-\u1C59" + "\u1C5A-\u1C77\u1C78-\u1C7D\u1C7E-\u1C7F\u1CC0-\u1CC7\u1CD3\u1CE1" + "\u1CE9-\u1CEC\u1CEE-\u1CF1\u1CF2-\u1CF3\u1CF5-\u1CF6\u1D00-\u1D2B" + "\u1D2C-\u1D6A\u1D6B-\u1D77\u1D78\u1D79-\u1D9A\u1D9B-\u1DBF\u1E00-\u1F15" + "\u1F18-\u1F1D\u1F20-\u1F45\u1F48-\u1F4D\u1F50-\u1F57\u1F59\u1F5B\u1F5D" + "\u1F5F-\u1F7D\u1F80-\u1FB4\u1FB6-\u1FBC\u1FBE\u1FC2-\u1FC4\u1FC6-\u1FCC" + "\u1FD0-\u1FD3\u1FD6-\u1FDB\u1FE0-\u1FEC\u1FF2-\u1FF4\u1FF6-\u1FFC\u200E" + "\u2071\u207F\u2090-\u209C\u2102\u2107\u210A-\u2113\u2115\u2119-\u211D" + "\u2124\u2126\u2128\u212A-\u212D\u212F-\u2134\u2135-\u2138\u2139" + "\u213C-\u213F\u2145-\u2149\u214E\u214F\u2160-\u2182\u2183-\u2184" + "\u2185-\u2188\u2336-\u237A\u2395\u249C-\u24E9\u26AC\u2800-\u28FF" + "\u2C00-\u2C2E\u2C30-\u2C5E\u2C60-\u2C7B\u2C7C-\u2C7D\u2C7E-\u2CE4" + "\u2CEB-\u2CEE\u2CF2-\u2CF3\u2D00-\u2D25\u2D27\u2D2D\u2D30-\u2D67\u2D6F" + "\u2D70\u2D80-\u2D96\u2DA0-\u2DA6\u2DA8-\u2DAE\u2DB0-\u2DB6\u2DB8-\u2DBE" + "\u2DC0-\u2DC6\u2DC8-\u2DCE\u2DD0-\u2DD6\u2DD8-\u2DDE\u3005\u3006\u3007" + "\u3021-\u3029\u302E-\u302F\u3031-\u3035\u3038-\u303A\u303B\u303C" + "\u3041-\u3096\u309D-\u309E\u309F\u30A1-\u30FA\u30FC-\u30FE\u30FF" + "\u3105-\u312D\u3131-\u318E\u3190-\u3191\u3192-\u3195\u3196-\u319F" + "\u31A0-\u31BA\u31F0-\u31FF\u3200-\u321C\u3220-\u3229\u322A-\u3247" + "\u3248-\u324F\u3260-\u327B\u327F\u3280-\u3289\u328A-\u32B0\u32C0-\u32CB" + "\u32D0-\u32FE\u3300-\u3376\u337B-\u33DD\u33E0-\u33FE\u3400-\u4DB5" + "\u4E00-\u9FCC\uA000-\uA014\uA015\uA016-\uA48C\uA4D0-\uA4F7\uA4F8-\uA4FD" + "\uA4FE-\uA4FF\uA500-\uA60B\uA60C\uA610-\uA61F\uA620-\uA629\uA62A-\uA62B" + "\uA640-\uA66D\uA66E\uA680-\uA69B\uA69C-\uA69D\uA6A0-\uA6E5\uA6E6-\uA6EF" + "\uA6F2-\uA6F7\uA722-\uA76F\uA770\uA771-\uA787\uA789-\uA78A\uA78B-\uA78E" + "\uA790-\uA7AD\uA7B0-\uA7B1\uA7F7\uA7F8-\uA7F9\uA7FA\uA7FB-\uA801" + "\uA803-\uA805\uA807-\uA80A\uA80C-\uA822\uA823-\uA824\uA827\uA830-\uA835" + "\uA836-\uA837\uA840-\uA873\uA880-\uA881\uA882-\uA8B3\uA8B4-\uA8C3" + "\uA8CE-\uA8CF\uA8D0-\uA8D9\uA8F2-\uA8F7\uA8F8-\uA8FA\uA8FB\uA900-\uA909" + "\uA90A-\uA925\uA92E-\uA92F\uA930-\uA946\uA952-\uA953\uA95F\uA960-\uA97C" + "\uA983\uA984-\uA9B2\uA9B4-\uA9B5\uA9BA-\uA9BB\uA9BD-\uA9C0\uA9C1-\uA9CD" + "\uA9CF\uA9D0-\uA9D9\uA9DE-\uA9DF\uA9E0-\uA9E4\uA9E6\uA9E7-\uA9EF" + "\uA9F0-\uA9F9\uA9FA-\uA9FE\uAA00-\uAA28\uAA2F-\uAA30\uAA33-\uAA34" + "\uAA40-\uAA42\uAA44-\uAA4B\uAA4D\uAA50-\uAA59\uAA5C-\uAA5F\uAA60-\uAA6F" + "\uAA70\uAA71-\uAA76\uAA77-\uAA79\uAA7A\uAA7B\uAA7D\uAA7E-\uAAAF\uAAB1" + "\uAAB5-\uAAB6\uAAB9-\uAABD\uAAC0\uAAC2\uAADB-\uAADC\uAADD\uAADE-\uAADF" + "\uAAE0-\uAAEA\uAAEB\uAAEE-\uAAEF\uAAF0-\uAAF1\uAAF2\uAAF3-\uAAF4\uAAF5" + "\uAB01-\uAB06\uAB09-\uAB0E\uAB11-\uAB16\uAB20-\uAB26\uAB28-\uAB2E" + "\uAB30-\uAB5A\uAB5B\uAB5C-\uAB5F\uAB64-\uAB65\uABC0-\uABE2\uABE3-\uABE4" + "\uABE6-\uABE7\uABE9-\uABEA\uABEB\uABEC\uABF0-\uABF9\uAC00-\uD7A3" + "\uD7B0-\uD7C6\uD7CB-\uD7FB\uE000-\uF8FF\uF900-\uFA6D\uFA70-\uFAD9" + "\uFB00-\uFB06\uFB13-\uFB17\uFF21-\uFF3A\uFF41-\uFF5A\uFF66-\uFF6F\uFF70" + "\uFF71-\uFF9D\uFF9E-\uFF9F\uFFA0-\uFFBE\uFFC2-\uFFC7\uFFCA-\uFFCF" + "\uFFD2-\uFFD7\uFFDA-\uFFDC",
  R: "\u0590\u05BE\u05C0\u05C3\u05C6\u05C8-\u05CF\u05D0-\u05EA\u05EB-\u05EF" + "\u05F0-\u05F2\u05F3-\u05F4\u05F5-\u05FF\u07C0-\u07C9\u07CA-\u07EA" + "\u07F4-\u07F5\u07FA\u07FB-\u07FF\u0800-\u0815\u081A\u0824\u0828" + "\u082E-\u082F\u0830-\u083E\u083F\u0840-\u0858\u085C-\u085D\u085E" + "\u085F-\u089F\u200F\uFB1D\uFB1F-\uFB28\uFB2A-\uFB36\uFB37\uFB38-\uFB3C" + "\uFB3D\uFB3E\uFB3F\uFB40-\uFB41\uFB42\uFB43-\uFB44\uFB45\uFB46-\uFB4F",
  AL: "\u0608\u060B\u060D\u061B\u061C\u061D\u061E-\u061F\u0620-\u063F\u0640" + "\u0641-\u064A\u066D\u066E-\u066F\u0671-\u06D3\u06D4\u06D5\u06E5-\u06E6" + "\u06EE-\u06EF\u06FA-\u06FC\u06FD-\u06FE\u06FF\u0700-\u070D\u070E\u070F" + "\u0710\u0712-\u072F\u074B-\u074C\u074D-\u07A5\u07B1\u07B2-\u07BF" + "\u08A0-\u08B2\u08B3-\u08E3\uFB50-\uFBB1\uFBB2-\uFBC1\uFBC2-\uFBD2" + "\uFBD3-\uFD3D\uFD40-\uFD4F\uFD50-\uFD8F\uFD90-\uFD91\uFD92-\uFDC7" + "\uFDC8-\uFDCF\uFDF0-\uFDFB\uFDFC\uFDFE-\uFDFF\uFE70-\uFE74\uFE75" + "\uFE76-\uFEFC\uFEFD-\uFEFE"
};
var REGEX_STRONG = new RegExp('[' + RANGE_BY_BIDI_TYPE.L + RANGE_BY_BIDI_TYPE.R + RANGE_BY_BIDI_TYPE.AL + ']');
var REGEX_RTL = new RegExp('[' + RANGE_BY_BIDI_TYPE.R + RANGE_BY_BIDI_TYPE.AL + ']');
/**
 * Returns the first strong character (has Bidi_Class value of L, R, or AL).
 *
 * @param str  A text block; e.g. paragraph, table cell, tag
 * @return     A character with strong bidi direction, or null if not found
 */

function firstStrongChar(str) {
  var match = REGEX_STRONG.exec(str);
  return match == null ? null : match[0];
}
/**
 * Returns the direction of a block of text, based on the direction of its
 * first strong character (has Bidi_Class value of L, R, or AL).
 *
 * @param str  A text block; e.g. paragraph, table cell, tag
 * @return     The resolved direction
 */


function firstStrongCharDir(str) {
  var strongChar = firstStrongChar(str);

  if (strongChar == null) {
    return UnicodeBidiDirection.NEUTRAL;
  }

  return REGEX_RTL.exec(strongChar) ? UnicodeBidiDirection.RTL : UnicodeBidiDirection.LTR;
}
/**
 * Returns the direction of a block of text, based on the direction of its
 * first strong character (has Bidi_Class value of L, R, or AL), or a fallback
 * direction, if no strong character is found.
 *
 * This function is supposed to be used in respect to Higher-Level Protocol
 * rule HL1. (http://www.unicode.org/reports/tr9/#HL1)
 *
 * @param str       A text block; e.g. paragraph, table cell, tag
 * @param fallback  Fallback direction, used if no strong direction detected
 *                  for the block (default = NEUTRAL)
 * @return          The resolved direction
 */


function resolveBlockDir(str, fallback) {
  fallback = fallback || UnicodeBidiDirection.NEUTRAL;

  if (!str.length) {
    return fallback;
  }

  var blockDir = firstStrongCharDir(str);
  return blockDir === UnicodeBidiDirection.NEUTRAL ? fallback : blockDir;
}
/**
 * Returns the direction of a block of text, based on the direction of its
 * first strong character (has Bidi_Class value of L, R, or AL), or a fallback
 * direction, if no strong character is found.
 *
 * NOTE: This function is similar to resolveBlockDir(), but uses the global
 * direction as the fallback, so it *always* returns a Strong direction,
 * making it useful for integration in places that you need to make the final
 * decision, like setting some CSS class.
 *
 * This function is supposed to be used in respect to Higher-Level Protocol
 * rule HL1. (http://www.unicode.org/reports/tr9/#HL1)
 *
 * @param str             A text block; e.g. paragraph, table cell
 * @param strongFallback  Fallback direction, used if no strong direction
 *                        detected for the block (default = global direction)
 * @return                The resolved Strong direction
 */


function getDirection(str, strongFallback) {
  if (!strongFallback) {
    strongFallback = UnicodeBidiDirection.getGlobalDir();
  }

  !UnicodeBidiDirection.isStrong(strongFallback) ?  true ? invariant(false, 'Fallback direction must be a strong direction') : 0 : void 0;
  return resolveBlockDir(str, strongFallback);
}
/**
 * Returns true if getDirection(arguments...) returns LTR.
 *
 * @param str             A text block; e.g. paragraph, table cell
 * @param strongFallback  Fallback direction, used if no strong direction
 *                        detected for the block (default = global direction)
 * @return                True if the resolved direction is LTR
 */


function isDirectionLTR(str, strongFallback) {
  return getDirection(str, strongFallback) === UnicodeBidiDirection.LTR;
}
/**
 * Returns true if getDirection(arguments...) returns RTL.
 *
 * @param str             A text block; e.g. paragraph, table cell
 * @param strongFallback  Fallback direction, used if no strong direction
 *                        detected for the block (default = global direction)
 * @return                True if the resolved direction is RTL
 */


function isDirectionRTL(str, strongFallback) {
  return getDirection(str, strongFallback) === UnicodeBidiDirection.RTL;
}

var UnicodeBidi = {
  firstStrongChar: firstStrongChar,
  firstStrongCharDir: firstStrongCharDir,
  resolveBlockDir: resolveBlockDir,
  getDirection: getDirection,
  isDirectionLTR: isDirectionLTR,
  isDirectionRTL: isDirectionRTL
};
module.exports = UnicodeBidi;

/***/ }),

/***/ "./node_modules/fbjs/lib/UnicodeBidiDirection.js":
/*!*******************************************************!*\
  !*** ./node_modules/fbjs/lib/UnicodeBidiDirection.js ***!
  \*******************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";
/**
 * Copyright (c) 2013-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @typechecks
 * 
 */

/**
 * Constants to represent text directionality
 *
 * Also defines a *global* direciton, to be used in bidi algorithms as a
 * default fallback direciton, when no better direction is found or provided.
 *
 * NOTE: Use `setGlobalDir()`, or update `initGlobalDir()`, to set the initial
 *       global direction value based on the application.
 *
 * Part of the implementation of Unicode Bidirectional Algorithm (UBA)
 * Unicode Standard Annex #9 (UAX9)
 * http://www.unicode.org/reports/tr9/
 */


var invariant = __webpack_require__(/*! ./invariant */ "./node_modules/fbjs/lib/invariant.js");

var NEUTRAL = 'NEUTRAL'; // No strong direction

var LTR = 'LTR'; // Left-to-Right direction

var RTL = 'RTL'; // Right-to-Left direction

var globalDir = null; // == Helpers ==

/**
 * Check if a directionality value is a Strong one
 */

function isStrong(dir) {
  return dir === LTR || dir === RTL;
}
/**
 * Get string value to be used for `dir` HTML attribute or `direction` CSS
 * property.
 */


function getHTMLDir(dir) {
  !isStrong(dir) ?  true ? invariant(false, '`dir` must be a strong direction to be converted to HTML Direction') : 0 : void 0;
  return dir === LTR ? 'ltr' : 'rtl';
}
/**
 * Get string value to be used for `dir` HTML attribute or `direction` CSS
 * property, but returns null if `dir` has same value as `otherDir`.
 * `null`.
 */


function getHTMLDirIfDifferent(dir, otherDir) {
  !isStrong(dir) ?  true ? invariant(false, '`dir` must be a strong direction to be converted to HTML Direction') : 0 : void 0;
  !isStrong(otherDir) ?  true ? invariant(false, '`otherDir` must be a strong direction to be converted to HTML Direction') : 0 : void 0;
  return dir === otherDir ? null : getHTMLDir(dir);
} // == Global Direction ==

/**
 * Set the global direction.
 */


function setGlobalDir(dir) {
  globalDir = dir;
}
/**
 * Initialize the global direction
 */


function initGlobalDir() {
  setGlobalDir(LTR);
}
/**
 * Get the global direction
 */


function getGlobalDir() {
  if (!globalDir) {
    this.initGlobalDir();
  }

  !globalDir ?  true ? invariant(false, 'Global direction not set.') : 0 : void 0;
  return globalDir;
}

var UnicodeBidiDirection = {
  // Values
  NEUTRAL: NEUTRAL,
  LTR: LTR,
  RTL: RTL,
  // Helpers
  isStrong: isStrong,
  getHTMLDir: getHTMLDir,
  getHTMLDirIfDifferent: getHTMLDirIfDifferent,
  // Global Direction
  setGlobalDir: setGlobalDir,
  initGlobalDir: initGlobalDir,
  getGlobalDir: getGlobalDir
};
module.exports = UnicodeBidiDirection;

/***/ }),

/***/ "./node_modules/fbjs/lib/UnicodeBidiService.js":
/*!*****************************************************!*\
  !*** ./node_modules/fbjs/lib/UnicodeBidiService.js ***!
  \*****************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";
/**
 * Copyright (c) 2013-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @typechecks
 * 
 */

/**
 * Stateful API for text direction detection
 *
 * This class can be used in applications where you need to detect the
 * direction of a sequence of text blocks, where each direction shall be used
 * as the fallback direction for the next one.
 *
 * NOTE: A default direction, if not provided, is set based on the global
 *       direction, as defined by `UnicodeBidiDirection`.
 *
 * == Example ==
 * ```
 * var UnicodeBidiService = require('UnicodeBidiService');
 *
 * var bidiService = new UnicodeBidiService();
 *
 * ...
 *
 * bidiService.reset();
 * for (var para in paragraphs) {
 *   var dir = bidiService.getDirection(para);
 *   ...
 * }
 * ```
 *
 * Part of our implementation of Unicode Bidirectional Algorithm (UBA)
 * Unicode Standard Annex #9 (UAX9)
 * http://www.unicode.org/reports/tr9/
 */


function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var UnicodeBidi = __webpack_require__(/*! ./UnicodeBidi */ "./node_modules/fbjs/lib/UnicodeBidi.js");

var UnicodeBidiDirection = __webpack_require__(/*! ./UnicodeBidiDirection */ "./node_modules/fbjs/lib/UnicodeBidiDirection.js");

var invariant = __webpack_require__(/*! ./invariant */ "./node_modules/fbjs/lib/invariant.js");

var UnicodeBidiService =
/*#__PURE__*/
function () {
  /**
   * Stateful class for paragraph direction detection
   *
   * @param defaultDir  Default direction of the service
   */
  function UnicodeBidiService(defaultDir) {
    _defineProperty(this, "_defaultDir", void 0);

    _defineProperty(this, "_lastDir", void 0);

    if (!defaultDir) {
      defaultDir = UnicodeBidiDirection.getGlobalDir();
    } else {
      !UnicodeBidiDirection.isStrong(defaultDir) ?  true ? invariant(false, 'Default direction must be a strong direction (LTR or RTL)') : 0 : void 0;
    }

    this._defaultDir = defaultDir;
    this.reset();
  }
  /**
   * Reset the internal state
   *
   * Instead of creating a new instance, you can just reset() your instance
   * everytime you start a new loop.
   */


  var _proto = UnicodeBidiService.prototype;

  _proto.reset = function reset() {
    this._lastDir = this._defaultDir;
  };
  /**
   * Returns the direction of a block of text, and remembers it as the
   * fall-back direction for the next paragraph.
   *
   * @param str  A text block, e.g. paragraph, table cell, tag
   * @return     The resolved direction
   */


  _proto.getDirection = function getDirection(str) {
    this._lastDir = UnicodeBidi.getDirection(str, this._lastDir);
    return this._lastDir;
  };

  return UnicodeBidiService;
}();

module.exports = UnicodeBidiService;

/***/ }),

/***/ "./node_modules/fbjs/lib/UnicodeUtils.js":
/*!***********************************************!*\
  !*** ./node_modules/fbjs/lib/UnicodeUtils.js ***!
  \***********************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";
/**
 * Copyright (c) 2013-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @typechecks
 */

/**
 * Unicode-enabled replacesments for basic String functions.
 *
 * All the functions in this module assume that the input string is a valid
 * UTF-16 encoding of a Unicode sequence. If it's not the case, the behavior
 * will be undefined.
 *
 * WARNING: Since this module is typechecks-enforced, you may find new bugs
 * when replacing normal String functions with ones provided here.
 */


var invariant = __webpack_require__(/*! ./invariant */ "./node_modules/fbjs/lib/invariant.js"); // These two ranges are consecutive so anything in [HIGH_START, LOW_END] is a
// surrogate code unit.


var SURROGATE_HIGH_START = 0xD800;
var SURROGATE_HIGH_END = 0xDBFF;
var SURROGATE_LOW_START = 0xDC00;
var SURROGATE_LOW_END = 0xDFFF;
var SURROGATE_UNITS_REGEX = /[\uD800-\uDFFF]/;
/**
 * @param {number} codeUnit   A Unicode code-unit, in range [0, 0x10FFFF]
 * @return {boolean}          Whether code-unit is in a surrogate (hi/low) range
 */

function isCodeUnitInSurrogateRange(codeUnit) {
  return SURROGATE_HIGH_START <= codeUnit && codeUnit <= SURROGATE_LOW_END;
}
/**
 * Returns whether the two characters starting at `index` form a surrogate pair.
 * For example, given the string s = "\uD83D\uDE0A", (s, 0) returns true and
 * (s, 1) returns false.
 *
 * @param {string} str
 * @param {number} index
 * @return {boolean}
 */


function isSurrogatePair(str, index) {
  !(0 <= index && index < str.length) ?  true ? invariant(false, 'isSurrogatePair: Invalid index %s for string length %s.', index, str.length) : 0 : void 0;

  if (index + 1 === str.length) {
    return false;
  }

  var first = str.charCodeAt(index);
  var second = str.charCodeAt(index + 1);
  return SURROGATE_HIGH_START <= first && first <= SURROGATE_HIGH_END && SURROGATE_LOW_START <= second && second <= SURROGATE_LOW_END;
}
/**
 * @param {string} str  Non-empty string
 * @return {boolean}    True if the input includes any surrogate code units
 */


function hasSurrogateUnit(str) {
  return SURROGATE_UNITS_REGEX.test(str);
}
/**
 * Return the length of the original Unicode character at given position in the
 * String by looking into the UTF-16 code unit; that is equal to 1 for any
 * non-surrogate characters in BMP ([U+0000..U+D7FF] and [U+E000, U+FFFF]); and
 * returns 2 for the hi/low surrogates ([U+D800..U+DFFF]), which are in fact
 * representing non-BMP characters ([U+10000..U+10FFFF]).
 *
 * Examples:
 * - '\u0020' => 1
 * - '\u3020' => 1
 * - '\uD835' => 2
 * - '\uD835\uDDEF' => 2
 * - '\uDDEF' => 2
 *
 * @param {string} str  Non-empty string
 * @param {number} pos  Position in the string to look for one code unit
 * @return {number}      Number 1 or 2
 */


function getUTF16Length(str, pos) {
  return 1 + isCodeUnitInSurrogateRange(str.charCodeAt(pos));
}
/**
 * Fully Unicode-enabled replacement for String#length
 *
 * @param {string} str  Valid Unicode string
 * @return {number}     The number of Unicode characters in the string
 */


function strlen(str) {
  // Call the native functions if there's no surrogate char
  if (!hasSurrogateUnit(str)) {
    return str.length;
  }

  var len = 0;

  for (var pos = 0; pos < str.length; pos += getUTF16Length(str, pos)) {
    len++;
  }

  return len;
}
/**
 * Fully Unicode-enabled replacement for String#substr()
 *
 * @param {string} str      Valid Unicode string
 * @param {number} start    Location in Unicode sequence to begin extracting
 * @param {?number} length  The number of Unicode characters to extract
 *                          (default: to the end of the string)
 * @return {string}         Extracted sub-string
 */


function substr(str, start, length) {
  start = start || 0;
  length = length === undefined ? Infinity : length || 0; // Call the native functions if there's no surrogate char

  if (!hasSurrogateUnit(str)) {
    return str.substr(start, length);
  } // Obvious cases


  var size = str.length;

  if (size <= 0 || start > size || length <= 0) {
    return '';
  } // Find the actual starting position


  var posA = 0;

  if (start > 0) {
    for (; start > 0 && posA < size; start--) {
      posA += getUTF16Length(str, posA);
    }

    if (posA >= size) {
      return '';
    }
  } else if (start < 0) {
    for (posA = size; start < 0 && 0 < posA; start++) {
      posA -= getUTF16Length(str, posA - 1);
    }

    if (posA < 0) {
      posA = 0;
    }
  } // Find the actual ending position


  var posB = size;

  if (length < size) {
    for (posB = posA; length > 0 && posB < size; length--) {
      posB += getUTF16Length(str, posB);
    }
  }

  return str.substring(posA, posB);
}
/**
 * Fully Unicode-enabled replacement for String#substring()
 *
 * @param {string} str    Valid Unicode string
 * @param {number} start  Location in Unicode sequence to begin extracting
 * @param {?number} end   Location in Unicode sequence to end extracting
 *                        (default: end of the string)
 * @return {string}       Extracted sub-string
 */


function substring(str, start, end) {
  start = start || 0;
  end = end === undefined ? Infinity : end || 0;

  if (start < 0) {
    start = 0;
  }

  if (end < 0) {
    end = 0;
  }

  var length = Math.abs(end - start);
  start = start < end ? start : end;
  return substr(str, start, length);
}
/**
 * Get a list of Unicode code-points from a String
 *
 * @param {string} str        Valid Unicode string
 * @return {array<number>}    A list of code-points in [0..0x10FFFF]
 */


function getCodePoints(str) {
  var codePoints = [];

  for (var pos = 0; pos < str.length; pos += getUTF16Length(str, pos)) {
    codePoints.push(str.codePointAt(pos));
  }

  return codePoints;
}

var UnicodeUtils = {
  getCodePoints: getCodePoints,
  getUTF16Length: getUTF16Length,
  hasSurrogateUnit: hasSurrogateUnit,
  isCodeUnitInSurrogateRange: isCodeUnitInSurrogateRange,
  isSurrogatePair: isSurrogatePair,
  strlen: strlen,
  substring: substring,
  substr: substr
};
module.exports = UnicodeUtils;

/***/ }),

/***/ "./node_modules/fbjs/lib/UserAgent.js":
/*!********************************************!*\
  !*** ./node_modules/fbjs/lib/UserAgent.js ***!
  \********************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";
/**
 * Copyright (c) 2013-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */


var UserAgentData = __webpack_require__(/*! ./UserAgentData */ "./node_modules/fbjs/lib/UserAgentData.js");

var VersionRange = __webpack_require__(/*! ./VersionRange */ "./node_modules/fbjs/lib/VersionRange.js");

var mapObject = __webpack_require__(/*! ./mapObject */ "./node_modules/fbjs/lib/mapObject.js");

var memoizeStringOnly = __webpack_require__(/*! ./memoizeStringOnly */ "./node_modules/fbjs/lib/memoizeStringOnly.js");
/**
 * Checks to see whether `name` and `version` satisfy `query`.
 *
 * @param {string} name Name of the browser, device, engine or platform
 * @param {?string} version Version of the browser, engine or platform
 * @param {string} query Query of form "Name [range expression]"
 * @param {?function} normalizer Optional pre-processor for range expression
 * @return {boolean}
 */


function compare(name, version, query, normalizer) {
  // check for exact match with no version
  if (name === query) {
    return true;
  } // check for non-matching names


  if (!query.startsWith(name)) {
    return false;
  } // full comparison with version


  var range = query.slice(name.length);

  if (version) {
    range = normalizer ? normalizer(range) : range;
    return VersionRange.contains(range, version);
  }

  return false;
}
/**
 * Normalizes `version` by stripping any "NT" prefix, but only on the Windows
 * platform.
 *
 * Mimics the stripping performed by the `UserAgentWindowsPlatform` PHP class.
 *
 * @param {string} version
 * @return {string}
 */


function normalizePlatformVersion(version) {
  if (UserAgentData.platformName === 'Windows') {
    return version.replace(/^\s*NT/, '');
  }

  return version;
}
/**
 * Provides client-side access to the authoritative PHP-generated User Agent
 * information supplied by the server.
 */


var UserAgent = {
  /**
   * Check if the User Agent browser matches `query`.
   *
   * `query` should be a string like "Chrome" or "Chrome > 33".
   *
   * Valid browser names include:
   *
   * - ACCESS NetFront
   * - AOL
   * - Amazon Silk
   * - Android
   * - BlackBerry
   * - BlackBerry PlayBook
   * - Chrome
   * - Chrome for iOS
   * - Chrome frame
   * - Facebook PHP SDK
   * - Facebook for iOS
   * - Firefox
   * - IE
   * - IE Mobile
   * - Mobile Safari
   * - Motorola Internet Browser
   * - Nokia
   * - Openwave Mobile Browser
   * - Opera
   * - Opera Mini
   * - Opera Mobile
   * - Safari
   * - UIWebView
   * - Unknown
   * - webOS
   * - etc...
   *
   * An authoritative list can be found in the PHP `BrowserDetector` class and
   * related classes in the same file (see calls to `new UserAgentBrowser` here:
   * https://fburl.com/50728104).
   *
   * @note Function results are memoized
   *
   * @param {string} query Query of the form "Name [range expression]"
   * @return {boolean}
   */
  isBrowser: function isBrowser(query) {
    return compare(UserAgentData.browserName, UserAgentData.browserFullVersion, query);
  },

  /**
   * Check if the User Agent browser uses a 32 or 64 bit architecture.
   *
   * @note Function results are memoized
   *
   * @param {string} query Query of the form "32" or "64".
   * @return {boolean}
   */
  isBrowserArchitecture: function isBrowserArchitecture(query) {
    return compare(UserAgentData.browserArchitecture, null, query);
  },

  /**
   * Check if the User Agent device matches `query`.
   *
   * `query` should be a string like "iPhone" or "iPad".
   *
   * Valid device names include:
   *
   * - Kindle
   * - Kindle Fire
   * - Unknown
   * - iPad
   * - iPhone
   * - iPod
   * - etc...
   *
   * An authoritative list can be found in the PHP `DeviceDetector` class and
   * related classes in the same file (see calls to `new UserAgentDevice` here:
   * https://fburl.com/50728332).
   *
   * @note Function results are memoized
   *
   * @param {string} query Query of the form "Name"
   * @return {boolean}
   */
  isDevice: function isDevice(query) {
    return compare(UserAgentData.deviceName, null, query);
  },

  /**
   * Check if the User Agent rendering engine matches `query`.
   *
   * `query` should be a string like "WebKit" or "WebKit >= 537".
   *
   * Valid engine names include:
   *
   * - Gecko
   * - Presto
   * - Trident
   * - WebKit
   * - etc...
   *
   * An authoritative list can be found in the PHP `RenderingEngineDetector`
   * class related classes in the same file (see calls to `new
   * UserAgentRenderingEngine` here: https://fburl.com/50728617).
   *
   * @note Function results are memoized
   *
   * @param {string} query Query of the form "Name [range expression]"
   * @return {boolean}
   */
  isEngine: function isEngine(query) {
    return compare(UserAgentData.engineName, UserAgentData.engineVersion, query);
  },

  /**
   * Check if the User Agent platform matches `query`.
   *
   * `query` should be a string like "Windows" or "iOS 5 - 6".
   *
   * Valid platform names include:
   *
   * - Android
   * - BlackBerry OS
   * - Java ME
   * - Linux
   * - Mac OS X
   * - Mac OS X Calendar
   * - Mac OS X Internet Account
   * - Symbian
   * - SymbianOS
   * - Windows
   * - Windows Mobile
   * - Windows Phone
   * - iOS
   * - iOS Facebook Integration Account
   * - iOS Facebook Social Sharing UI
   * - webOS
   * - Chrome OS
   * - etc...
   *
   * An authoritative list can be found in the PHP `PlatformDetector` class and
   * related classes in the same file (see calls to `new UserAgentPlatform`
   * here: https://fburl.com/50729226).
   *
   * @note Function results are memoized
   *
   * @param {string} query Query of the form "Name [range expression]"
   * @return {boolean}
   */
  isPlatform: function isPlatform(query) {
    return compare(UserAgentData.platformName, UserAgentData.platformFullVersion, query, normalizePlatformVersion);
  },

  /**
   * Check if the User Agent platform is a 32 or 64 bit architecture.
   *
   * @note Function results are memoized
   *
   * @param {string} query Query of the form "32" or "64".
   * @return {boolean}
   */
  isPlatformArchitecture: function isPlatformArchitecture(query) {
    return compare(UserAgentData.platformArchitecture, null, query);
  }
};
module.exports = mapObject(UserAgent, memoizeStringOnly);

/***/ }),

/***/ "./node_modules/fbjs/lib/UserAgentData.js":
/*!************************************************!*\
  !*** ./node_modules/fbjs/lib/UserAgentData.js ***!
  \************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";
/**
 * Copyright (c) 2013-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

/**
 * Usage note:
 * This module makes a best effort to export the same data we would internally.
 * At Facebook we use a server-generated module that does the parsing and
 * exports the data for the client to use. We can't rely on a server-side
 * implementation in open source so instead we make use of an open source
 * library to do the heavy lifting and then make some adjustments as necessary.
 * It's likely there will be some differences. Some we can smooth over.
 * Others are going to be harder.
 */


var UAParser = __webpack_require__(/*! ua-parser-js */ "./node_modules/ua-parser-js/src/ua-parser.js");

var UNKNOWN = 'Unknown';
var PLATFORM_MAP = {
  'Mac OS': 'Mac OS X'
};
/**
 * Convert from UAParser platform name to what we expect.
 */

function convertPlatformName(name) {
  return PLATFORM_MAP[name] || name;
}
/**
 * Get the version number in parts. This is very naive. We actually get major
 * version as a part of UAParser already, which is generally good enough, but
 * let's get the minor just in case.
 */


function getBrowserVersion(version) {
  if (!version) {
    return {
      major: '',
      minor: ''
    };
  }

  var parts = version.split('.');
  return {
    major: parts[0],
    minor: parts[1]
  };
}
/**
 * Get the UA data fom UAParser and then convert it to the format we're
 * expecting for our APIS.
 */


var parser = new UAParser();
var results = parser.getResult(); // Do some conversion first.

var browserVersionData = getBrowserVersion(results.browser.version);
var uaData = {
  browserArchitecture: results.cpu.architecture || UNKNOWN,
  browserFullVersion: results.browser.version || UNKNOWN,
  browserMinorVersion: browserVersionData.minor || UNKNOWN,
  browserName: results.browser.name || UNKNOWN,
  browserVersion: results.browser.major || UNKNOWN,
  deviceName: results.device.model || UNKNOWN,
  engineName: results.engine.name || UNKNOWN,
  engineVersion: results.engine.version || UNKNOWN,
  platformArchitecture: results.cpu.architecture || UNKNOWN,
  platformName: convertPlatformName(results.os.name) || UNKNOWN,
  platformVersion: results.os.version || UNKNOWN,
  platformFullVersion: results.os.version || UNKNOWN
};
module.exports = uaData;

/***/ }),

/***/ "./node_modules/fbjs/lib/VersionRange.js":
/*!***********************************************!*\
  !*** ./node_modules/fbjs/lib/VersionRange.js ***!
  \***********************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";
/**
 * Copyright (c) 2013-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */


var invariant = __webpack_require__(/*! ./invariant */ "./node_modules/fbjs/lib/invariant.js");

var componentRegex = /\./;
var orRegex = /\|\|/;
var rangeRegex = /\s+\-\s+/;
var modifierRegex = /^(<=|<|=|>=|~>|~|>|)?\s*(.+)/;
var numericRegex = /^(\d*)(.*)/;
/**
 * Splits input `range` on "||" and returns true if any subrange matches
 * `version`.
 *
 * @param {string} range
 * @param {string} version
 * @returns {boolean}
 */

function checkOrExpression(range, version) {
  var expressions = range.split(orRegex);

  if (expressions.length > 1) {
    return expressions.some(function (range) {
      return VersionRange.contains(range, version);
    });
  } else {
    range = expressions[0].trim();
    return checkRangeExpression(range, version);
  }
}
/**
 * Splits input `range` on " - " (the surrounding whitespace is required) and
 * returns true if version falls between the two operands.
 *
 * @param {string} range
 * @param {string} version
 * @returns {boolean}
 */


function checkRangeExpression(range, version) {
  var expressions = range.split(rangeRegex);
  !(expressions.length > 0 && expressions.length <= 2) ?  true ? invariant(false, 'the "-" operator expects exactly 2 operands') : 0 : void 0;

  if (expressions.length === 1) {
    return checkSimpleExpression(expressions[0], version);
  } else {
    var startVersion = expressions[0],
        endVersion = expressions[1];
    !(isSimpleVersion(startVersion) && isSimpleVersion(endVersion)) ?  true ? invariant(false, 'operands to the "-" operator must be simple (no modifiers)') : 0 : void 0;
    return checkSimpleExpression('>=' + startVersion, version) && checkSimpleExpression('<=' + endVersion, version);
  }
}
/**
 * Checks if `range` matches `version`. `range` should be a "simple" range (ie.
 * not a compound range using the " - " or "||" operators).
 *
 * @param {string} range
 * @param {string} version
 * @returns {boolean}
 */


function checkSimpleExpression(range, version) {
  range = range.trim();

  if (range === '') {
    return true;
  }

  var versionComponents = version.split(componentRegex);

  var _getModifierAndCompon = getModifierAndComponents(range),
      modifier = _getModifierAndCompon.modifier,
      rangeComponents = _getModifierAndCompon.rangeComponents;

  switch (modifier) {
    case '<':
      return checkLessThan(versionComponents, rangeComponents);

    case '<=':
      return checkLessThanOrEqual(versionComponents, rangeComponents);

    case '>=':
      return checkGreaterThanOrEqual(versionComponents, rangeComponents);

    case '>':
      return checkGreaterThan(versionComponents, rangeComponents);

    case '~':
    case '~>':
      return checkApproximateVersion(versionComponents, rangeComponents);

    default:
      return checkEqual(versionComponents, rangeComponents);
  }
}
/**
 * Checks whether `a` is less than `b`.
 *
 * @param {array<string>} a
 * @param {array<string>} b
 * @returns {boolean}
 */


function checkLessThan(a, b) {
  return compareComponents(a, b) === -1;
}
/**
 * Checks whether `a` is less than or equal to `b`.
 *
 * @param {array<string>} a
 * @param {array<string>} b
 * @returns {boolean}
 */


function checkLessThanOrEqual(a, b) {
  var result = compareComponents(a, b);
  return result === -1 || result === 0;
}
/**
 * Checks whether `a` is equal to `b`.
 *
 * @param {array<string>} a
 * @param {array<string>} b
 * @returns {boolean}
 */


function checkEqual(a, b) {
  return compareComponents(a, b) === 0;
}
/**
 * Checks whether `a` is greater than or equal to `b`.
 *
 * @param {array<string>} a
 * @param {array<string>} b
 * @returns {boolean}
 */


function checkGreaterThanOrEqual(a, b) {
  var result = compareComponents(a, b);
  return result === 1 || result === 0;
}
/**
 * Checks whether `a` is greater than `b`.
 *
 * @param {array<string>} a
 * @param {array<string>} b
 * @returns {boolean}
 */


function checkGreaterThan(a, b) {
  return compareComponents(a, b) === 1;
}
/**
 * Checks whether `a` is "reasonably close" to `b` (as described in
 * https://www.npmjs.org/doc/misc/semver.html). For example, if `b` is "1.3.1"
 * then "reasonably close" is defined as ">= 1.3.1 and < 1.4".
 *
 * @param {array<string>} a
 * @param {array<string>} b
 * @returns {boolean}
 */


function checkApproximateVersion(a, b) {
  var lowerBound = b.slice();
  var upperBound = b.slice();

  if (upperBound.length > 1) {
    upperBound.pop();
  }

  var lastIndex = upperBound.length - 1;
  var numeric = parseInt(upperBound[lastIndex], 10);

  if (isNumber(numeric)) {
    upperBound[lastIndex] = numeric + 1 + '';
  }

  return checkGreaterThanOrEqual(a, lowerBound) && checkLessThan(a, upperBound);
}
/**
 * Extracts the optional modifier (<, <=, =, >=, >, ~, ~>) and version
 * components from `range`.
 *
 * For example, given `range` ">= 1.2.3" returns an object with a `modifier` of
 * `">="` and `components` of `[1, 2, 3]`.
 *
 * @param {string} range
 * @returns {object}
 */


function getModifierAndComponents(range) {
  var rangeComponents = range.split(componentRegex);
  var matches = rangeComponents[0].match(modifierRegex);
  !matches ?  true ? invariant(false, 'expected regex to match but it did not') : 0 : void 0;
  return {
    modifier: matches[1],
    rangeComponents: [matches[2]].concat(rangeComponents.slice(1))
  };
}
/**
 * Determines if `number` is a number.
 *
 * @param {mixed} number
 * @returns {boolean}
 */


function isNumber(number) {
  return !isNaN(number) && isFinite(number);
}
/**
 * Tests whether `range` is a "simple" version number without any modifiers
 * (">", "~" etc).
 *
 * @param {string} range
 * @returns {boolean}
 */


function isSimpleVersion(range) {
  return !getModifierAndComponents(range).modifier;
}
/**
 * Zero-pads array `array` until it is at least `length` long.
 *
 * @param {array} array
 * @param {number} length
 */


function zeroPad(array, length) {
  for (var i = array.length; i < length; i++) {
    array[i] = '0';
  }
}
/**
 * Normalizes `a` and `b` in preparation for comparison by doing the following:
 *
 * - zero-pads `a` and `b`
 * - marks any "x", "X" or "*" component in `b` as equivalent by zero-ing it out
 *   in both `a` and `b`
 * - marks any final "*" component in `b` as a greedy wildcard by zero-ing it
 *   and all of its successors in `a`
 *
 * @param {array<string>} a
 * @param {array<string>} b
 * @returns {array<array<string>>}
 */


function normalizeVersions(a, b) {
  a = a.slice();
  b = b.slice();
  zeroPad(a, b.length); // mark "x" and "*" components as equal

  for (var i = 0; i < b.length; i++) {
    var matches = b[i].match(/^[x*]$/i);

    if (matches) {
      b[i] = a[i] = '0'; // final "*" greedily zeros all remaining components

      if (matches[0] === '*' && i === b.length - 1) {
        for (var j = i; j < a.length; j++) {
          a[j] = '0';
        }
      }
    }
  }

  zeroPad(b, a.length);
  return [a, b];
}
/**
 * Returns the numerical -- not the lexicographical -- ordering of `a` and `b`.
 *
 * For example, `10-alpha` is greater than `2-beta`.
 *
 * @param {string} a
 * @param {string} b
 * @returns {number} -1, 0 or 1 to indicate whether `a` is less than, equal to,
 * or greater than `b`, respectively
 */


function compareNumeric(a, b) {
  var aPrefix = a.match(numericRegex)[1];
  var bPrefix = b.match(numericRegex)[1];
  var aNumeric = parseInt(aPrefix, 10);
  var bNumeric = parseInt(bPrefix, 10);

  if (isNumber(aNumeric) && isNumber(bNumeric) && aNumeric !== bNumeric) {
    return compare(aNumeric, bNumeric);
  } else {
    return compare(a, b);
  }
}
/**
 * Returns the ordering of `a` and `b`.
 *
 * @param {string|number} a
 * @param {string|number} b
 * @returns {number} -1, 0 or 1 to indicate whether `a` is less than, equal to,
 * or greater than `b`, respectively
 */


function compare(a, b) {
  !(typeof a === typeof b) ?  true ? invariant(false, '"a" and "b" must be of the same type') : 0 : void 0;

  if (a > b) {
    return 1;
  } else if (a < b) {
    return -1;
  } else {
    return 0;
  }
}
/**
 * Compares arrays of version components.
 *
 * @param {array<string>} a
 * @param {array<string>} b
 * @returns {number} -1, 0 or 1 to indicate whether `a` is less than, equal to,
 * or greater than `b`, respectively
 */


function compareComponents(a, b) {
  var _normalizeVersions = normalizeVersions(a, b),
      aNormalized = _normalizeVersions[0],
      bNormalized = _normalizeVersions[1];

  for (var i = 0; i < bNormalized.length; i++) {
    var result = compareNumeric(aNormalized[i], bNormalized[i]);

    if (result) {
      return result;
    }
  }

  return 0;
}

var VersionRange = {
  /**
   * Checks whether `version` satisfies the `range` specification.
   *
   * We support a subset of the expressions defined in
   * https://www.npmjs.org/doc/misc/semver.html:
   *
   *    version   Must match version exactly
   *    =version  Same as just version
   *    >version  Must be greater than version
   *    >=version Must be greater than or equal to version
   *    <version  Must be less than version
   *    <=version Must be less than or equal to version
   *    ~version  Must be at least version, but less than the next significant
   *              revision above version:
   *              "~1.2.3" is equivalent to ">= 1.2.3 and < 1.3"
   *    ~>version Equivalent to ~version
   *    1.2.x     Must match "1.2.x", where "x" is a wildcard that matches
   *              anything
   *    1.2.*     Similar to "1.2.x", but "*" in the trailing position is a
   *              "greedy" wildcard, so will match any number of additional
   *              components:
   *              "1.2.*" will match "1.2.1", "1.2.1.1", "1.2.1.1.1" etc
   *    *         Any version
   *    ""        (Empty string) Same as *
   *    v1 - v2   Equivalent to ">= v1 and <= v2"
   *    r1 || r2  Passes if either r1 or r2 are satisfied
   *
   * @param {string} range
   * @param {string} version
   * @returns {boolean}
   */
  contains: function contains(range, version) {
    return checkOrExpression(range.trim(), version.trim());
  }
};
module.exports = VersionRange;

/***/ }),

/***/ "./node_modules/fbjs/lib/camelize.js":
/*!*******************************************!*\
  !*** ./node_modules/fbjs/lib/camelize.js ***!
  \*******************************************/
/***/ ((module) => {

"use strict";


/**
 * Copyright (c) 2013-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @typechecks
 */
var _hyphenPattern = /-(.)/g;
/**
 * Camelcases a hyphenated string, for example:
 *
 *   > camelize('background-color')
 *   < "backgroundColor"
 *
 * @param {string} string
 * @return {string}
 */

function camelize(string) {
  return string.replace(_hyphenPattern, function (_, character) {
    return character.toUpperCase();
  });
}

module.exports = camelize;

/***/ }),

/***/ "./node_modules/fbjs/lib/containsNode.js":
/*!***********************************************!*\
  !*** ./node_modules/fbjs/lib/containsNode.js ***!
  \***********************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";


/**
 * Copyright (c) 2013-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * 
 */
var isTextNode = __webpack_require__(/*! ./isTextNode */ "./node_modules/fbjs/lib/isTextNode.js");
/*eslint-disable no-bitwise */

/**
 * Checks if a given DOM node contains or is another DOM node.
 */


function containsNode(outerNode, innerNode) {
  if (!outerNode || !innerNode) {
    return false;
  } else if (outerNode === innerNode) {
    return true;
  } else if (isTextNode(outerNode)) {
    return false;
  } else if (isTextNode(innerNode)) {
    return containsNode(outerNode, innerNode.parentNode);
  } else if ('contains' in outerNode) {
    return outerNode.contains(innerNode);
  } else if (outerNode.compareDocumentPosition) {
    return !!(outerNode.compareDocumentPosition(innerNode) & 16);
  } else {
    return false;
  }
}

module.exports = containsNode;

/***/ }),

/***/ "./node_modules/fbjs/lib/createArrayFromMixed.js":
/*!*******************************************************!*\
  !*** ./node_modules/fbjs/lib/createArrayFromMixed.js ***!
  \*******************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";


/**
 * Copyright (c) 2013-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @typechecks
 */
var invariant = __webpack_require__(/*! ./invariant */ "./node_modules/fbjs/lib/invariant.js");
/**
 * Convert array-like objects to arrays.
 *
 * This API assumes the caller knows the contents of the data type. For less
 * well defined inputs use createArrayFromMixed.
 *
 * @param {object|function|filelist} obj
 * @return {array}
 */


function toArray(obj) {
  var length = obj.length; // Some browsers builtin objects can report typeof 'function' (e.g. NodeList
  // in old versions of Safari).

  !(!Array.isArray(obj) && (typeof obj === 'object' || typeof obj === 'function')) ?  true ? invariant(false, 'toArray: Array-like object expected') : 0 : void 0;
  !(typeof length === 'number') ?  true ? invariant(false, 'toArray: Object needs a length property') : 0 : void 0;
  !(length === 0 || length - 1 in obj) ?  true ? invariant(false, 'toArray: Object should have keys for indices') : 0 : void 0;
  !(typeof obj.callee !== 'function') ?  true ? invariant(false, 'toArray: Object can\'t be `arguments`. Use rest params ' + '(function(...args) {}) or Array.from() instead.') : 0 : void 0; // Old IE doesn't give collections access to hasOwnProperty. Assume inputs
  // without method will throw during the slice call and skip straight to the
  // fallback.

  if (obj.hasOwnProperty) {
    try {
      return Array.prototype.slice.call(obj);
    } catch (e) {// IE < 9 does not support Array#slice on collections objects
    }
  } // Fall back to copying key by key. This assumes all keys have a value,
  // so will not preserve sparsely populated inputs.


  var ret = Array(length);

  for (var ii = 0; ii < length; ii++) {
    ret[ii] = obj[ii];
  }

  return ret;
}
/**
 * Perform a heuristic test to determine if an object is "array-like".
 *
 *   A monk asked Joshu, a Zen master, "Has a dog Buddha nature?"
 *   Joshu replied: "Mu."
 *
 * This function determines if its argument has "array nature": it returns
 * true if the argument is an actual array, an `arguments' object, or an
 * HTMLCollection (e.g. node.childNodes or node.getElementsByTagName()).
 *
 * It will return false for other array-like objects like Filelist.
 *
 * @param {*} obj
 * @return {boolean}
 */


function hasArrayNature(obj) {
  return (// not null/false
    !!obj && ( // arrays are objects, NodeLists are functions in Safari
    typeof obj == 'object' || typeof obj == 'function') && // quacks like an array
    'length' in obj && // not window
    !('setInterval' in obj) && // no DOM node should be considered an array-like
    // a 'select' element has 'length' and 'item' properties on IE8
    typeof obj.nodeType != 'number' && ( // a real array
    Array.isArray(obj) || // arguments
    'callee' in obj || // HTMLCollection/NodeList
    'item' in obj)
  );
}
/**
 * Ensure that the argument is an array by wrapping it in an array if it is not.
 * Creates a copy of the argument if it is already an array.
 *
 * This is mostly useful idiomatically:
 *
 *   var createArrayFromMixed = require('createArrayFromMixed');
 *
 *   function takesOneOrMoreThings(things) {
 *     things = createArrayFromMixed(things);
 *     ...
 *   }
 *
 * This allows you to treat `things' as an array, but accept scalars in the API.
 *
 * If you need to convert an array-like object, like `arguments`, into an array
 * use toArray instead.
 *
 * @param {*} obj
 * @return {array}
 */


function createArrayFromMixed(obj) {
  if (!hasArrayNature(obj)) {
    return [obj];
  } else if (Array.isArray(obj)) {
    return obj.slice();
  } else {
    return toArray(obj);
  }
}

module.exports = createArrayFromMixed;

/***/ }),

/***/ "./node_modules/fbjs/lib/cx.js":
/*!*************************************!*\
  !*** ./node_modules/fbjs/lib/cx.js ***!
  \*************************************/
/***/ ((module) => {

"use strict";


/**
 * Copyright (c) 2013-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

/**
 * This function is used to mark string literals representing CSS class names
 * so that they can be transformed statically. This allows for modularization
 * and minification of CSS class names.
 *
 * In static_upstream, this function is actually implemented, but it should
 * eventually be replaced with something more descriptive, and the transform
 * that is used in the main stack should be ported for use elsewhere.
 *
 * @param string|object className to modularize, or an object of key/values.
 *                      In the object case, the values are conditions that
 *                      determine if the className keys should be included.
 * @param [string ...]  Variable list of classNames in the string case.
 * @return string       Renderable space-separated CSS className.
 */
function cx(classNames) {
  if (typeof classNames == 'object') {
    return Object.keys(classNames).filter(function (className) {
      return classNames[className];
    }).map(replace).join(' ');
  }

  return Array.prototype.map.call(arguments, replace).join(' ');
}

function replace(str) {
  return str.replace(/\//g, '-');
}

module.exports = cx;

/***/ }),

/***/ "./node_modules/fbjs/lib/emptyFunction.js":
/*!************************************************!*\
  !*** ./node_modules/fbjs/lib/emptyFunction.js ***!
  \************************************************/
/***/ ((module) => {

"use strict";


/**
 * Copyright (c) 2013-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * 
 */
function makeEmptyFunction(arg) {
  return function () {
    return arg;
  };
}
/**
 * This function accepts and discards inputs; it has no side effects. This is
 * primarily useful idiomatically for overridable function endpoints which
 * always need to be callable, since JS lacks a null-call idiom ala Cocoa.
 */


var emptyFunction = function emptyFunction() {};

emptyFunction.thatReturns = makeEmptyFunction;
emptyFunction.thatReturnsFalse = makeEmptyFunction(false);
emptyFunction.thatReturnsTrue = makeEmptyFunction(true);
emptyFunction.thatReturnsNull = makeEmptyFunction(null);

emptyFunction.thatReturnsThis = function () {
  return this;
};

emptyFunction.thatReturnsArgument = function (arg) {
  return arg;
};

module.exports = emptyFunction;

/***/ }),

/***/ "./node_modules/fbjs/lib/getActiveElement.js":
/*!***************************************************!*\
  !*** ./node_modules/fbjs/lib/getActiveElement.js ***!
  \***************************************************/
/***/ ((module) => {

"use strict";


/**
 * Copyright (c) 2013-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @typechecks
 */

/* eslint-disable fb-www/typeof-undefined */

/**
 * Same as document.activeElement but wraps in a try-catch block. In IE it is
 * not safe to call document.activeElement if there is nothing focused.
 *
 * The activeElement will be null only if the document or document body is not
 * yet defined.
 *
 * @param {?DOMDocument} doc Defaults to current document.
 * @return {?DOMElement}
 */
function getActiveElement(doc)
/*?DOMElement*/
{
  doc = doc || (typeof document !== 'undefined' ? document : undefined);

  if (typeof doc === 'undefined') {
    return null;
  }

  try {
    return doc.activeElement || doc.body;
  } catch (e) {
    return doc.body;
  }
}

module.exports = getActiveElement;

/***/ }),

/***/ "./node_modules/fbjs/lib/getDocumentScrollElement.js":
/*!***********************************************************!*\
  !*** ./node_modules/fbjs/lib/getDocumentScrollElement.js ***!
  \***********************************************************/
/***/ ((module) => {

"use strict";
/**
 * Copyright (c) 2013-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @typechecks
 */


var isWebkit = typeof navigator !== 'undefined' && navigator.userAgent.indexOf('AppleWebKit') > -1;
/**
 * Gets the element with the document scroll properties such as `scrollLeft` and
 * `scrollHeight`. This may differ across different browsers.
 *
 * NOTE: The return value can be null if the DOM is not yet ready.
 *
 * @param {?DOMDocument} doc Defaults to current document.
 * @return {?DOMElement}
 */

function getDocumentScrollElement(doc) {
  doc = doc || document;

  if (doc.scrollingElement) {
    return doc.scrollingElement;
  }

  return !isWebkit && doc.compatMode === 'CSS1Compat' ? doc.documentElement : doc.body;
}

module.exports = getDocumentScrollElement;

/***/ }),

/***/ "./node_modules/fbjs/lib/getElementPosition.js":
/*!*****************************************************!*\
  !*** ./node_modules/fbjs/lib/getElementPosition.js ***!
  \*****************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";


/**
 * Copyright (c) 2013-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @typechecks
 */
var getElementRect = __webpack_require__(/*! ./getElementRect */ "./node_modules/fbjs/lib/getElementRect.js");
/**
 * Gets an element's position in pixels relative to the viewport. The returned
 * object represents the position of the element's top left corner.
 *
 * @param {DOMElement} element
 * @return {object}
 */


function getElementPosition(element) {
  var rect = getElementRect(element);
  return {
    x: rect.left,
    y: rect.top,
    width: rect.right - rect.left,
    height: rect.bottom - rect.top
  };
}

module.exports = getElementPosition;

/***/ }),

/***/ "./node_modules/fbjs/lib/getElementRect.js":
/*!*************************************************!*\
  !*** ./node_modules/fbjs/lib/getElementRect.js ***!
  \*************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";


/**
 * Copyright (c) 2013-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @typechecks
 */
var containsNode = __webpack_require__(/*! ./containsNode */ "./node_modules/fbjs/lib/containsNode.js");
/**
 * Gets an element's bounding rect in pixels relative to the viewport.
 *
 * @param {DOMElement} elem
 * @return {object}
 */


function getElementRect(elem) {
  var docElem = elem.ownerDocument.documentElement; // FF 2, Safari 3 and Opera 9.5- do not support getBoundingClientRect().
  // IE9- will throw if the element is not in the document.

  if (!('getBoundingClientRect' in elem) || !containsNode(docElem, elem)) {
    return {
      left: 0,
      right: 0,
      top: 0,
      bottom: 0
    };
  } // Subtracts clientTop/Left because IE8- added a 2px border to the
  // <html> element (see http://fburl.com/1493213). IE 7 in
  // Quicksmode does not report clientLeft/clientTop so there
  // will be an unaccounted offset of 2px when in quirksmode


  var rect = elem.getBoundingClientRect();
  return {
    left: Math.round(rect.left) - docElem.clientLeft,
    right: Math.round(rect.right) - docElem.clientLeft,
    top: Math.round(rect.top) - docElem.clientTop,
    bottom: Math.round(rect.bottom) - docElem.clientTop
  };
}

module.exports = getElementRect;

/***/ }),

/***/ "./node_modules/fbjs/lib/getScrollPosition.js":
/*!****************************************************!*\
  !*** ./node_modules/fbjs/lib/getScrollPosition.js ***!
  \****************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";
/**
 * Copyright (c) 2013-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @typechecks
 */


var getDocumentScrollElement = __webpack_require__(/*! ./getDocumentScrollElement */ "./node_modules/fbjs/lib/getDocumentScrollElement.js");

var getUnboundedScrollPosition = __webpack_require__(/*! ./getUnboundedScrollPosition */ "./node_modules/fbjs/lib/getUnboundedScrollPosition.js");
/**
 * Gets the scroll position of the supplied element or window.
 *
 * The return values are bounded. This means that if the scroll position is
 * negative or exceeds the element boundaries (which is possible using inertial
 * scrolling), you will get zero or the maximum scroll position, respectively.
 *
 * If you need the unbound scroll position, use `getUnboundedScrollPosition`.
 *
 * @param {DOMWindow|DOMElement} scrollable
 * @return {object} Map with `x` and `y` keys.
 */


function getScrollPosition(scrollable) {
  var documentScrollElement = getDocumentScrollElement(scrollable.ownerDocument || scrollable.document);

  if (scrollable.Window && scrollable instanceof scrollable.Window) {
    scrollable = documentScrollElement;
  }

  var scrollPosition = getUnboundedScrollPosition(scrollable);
  var viewport = scrollable === documentScrollElement ? scrollable.ownerDocument.documentElement : scrollable;
  var xMax = scrollable.scrollWidth - viewport.clientWidth;
  var yMax = scrollable.scrollHeight - viewport.clientHeight;
  scrollPosition.x = Math.max(0, Math.min(scrollPosition.x, xMax));
  scrollPosition.y = Math.max(0, Math.min(scrollPosition.y, yMax));
  return scrollPosition;
}

module.exports = getScrollPosition;

/***/ }),

/***/ "./node_modules/fbjs/lib/getStyleProperty.js":
/*!***************************************************!*\
  !*** ./node_modules/fbjs/lib/getStyleProperty.js ***!
  \***************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";


/**
 * Copyright (c) 2013-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @typechecks
 */
var camelize = __webpack_require__(/*! ./camelize */ "./node_modules/fbjs/lib/camelize.js");

var hyphenate = __webpack_require__(/*! ./hyphenate */ "./node_modules/fbjs/lib/hyphenate.js");

function asString(value)
/*?string*/
{
  return value == null ? value : String(value);
}

function getStyleProperty(
/*DOMNode*/
node,
/*string*/
name)
/*?string*/
{
  var computedStyle; // W3C Standard

  if (window.getComputedStyle) {
    // In certain cases such as within an iframe in FF3, this returns null.
    computedStyle = window.getComputedStyle(node, null);

    if (computedStyle) {
      return asString(computedStyle.getPropertyValue(hyphenate(name)));
    }
  } // Safari


  if (document.defaultView && document.defaultView.getComputedStyle) {
    computedStyle = document.defaultView.getComputedStyle(node, null); // A Safari bug causes this to return null for `display: none` elements.

    if (computedStyle) {
      return asString(computedStyle.getPropertyValue(hyphenate(name)));
    }

    if (name === 'display') {
      return 'none';
    }
  } // Internet Explorer


  if (node.currentStyle) {
    if (name === 'float') {
      return asString(node.currentStyle.cssFloat || node.currentStyle.styleFloat);
    }

    return asString(node.currentStyle[camelize(name)]);
  }

  return asString(node.style && node.style[camelize(name)]);
}

module.exports = getStyleProperty;

/***/ }),

/***/ "./node_modules/fbjs/lib/getUnboundedScrollPosition.js":
/*!*************************************************************!*\
  !*** ./node_modules/fbjs/lib/getUnboundedScrollPosition.js ***!
  \*************************************************************/
/***/ ((module) => {

"use strict";
/**
 * Copyright (c) 2013-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @typechecks
 */

/**
 * Gets the scroll position of the supplied element or window.
 *
 * The return values are unbounded, unlike `getScrollPosition`. This means they
 * may be negative or exceed the element boundaries (which is possible using
 * inertial scrolling).
 *
 * @param {DOMWindow|DOMElement} scrollable
 * @return {object} Map with `x` and `y` keys.
 */

function getUnboundedScrollPosition(scrollable) {
  if (scrollable.Window && scrollable instanceof scrollable.Window) {
    return {
      x: scrollable.pageXOffset || scrollable.document.documentElement.scrollLeft,
      y: scrollable.pageYOffset || scrollable.document.documentElement.scrollTop
    };
  }

  return {
    x: scrollable.scrollLeft,
    y: scrollable.scrollTop
  };
}

module.exports = getUnboundedScrollPosition;

/***/ }),

/***/ "./node_modules/fbjs/lib/getViewportDimensions.js":
/*!********************************************************!*\
  !*** ./node_modules/fbjs/lib/getViewportDimensions.js ***!
  \********************************************************/
/***/ ((module) => {

"use strict";


/**
 * Copyright (c) 2013-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * 
 * @typechecks
 */
function getViewportWidth() {
  var width;

  if (document.documentElement) {
    width = document.documentElement.clientWidth;
  }

  if (!width && document.body) {
    width = document.body.clientWidth;
  }

  return width || 0;
}

function getViewportHeight() {
  var height;

  if (document.documentElement) {
    height = document.documentElement.clientHeight;
  }

  if (!height && document.body) {
    height = document.body.clientHeight;
  }

  return height || 0;
}
/**
 * Gets the viewport dimensions including any scrollbars.
 */


function getViewportDimensions() {
  return {
    width: window.innerWidth || getViewportWidth(),
    height: window.innerHeight || getViewportHeight()
  };
}
/**
 * Gets the viewport dimensions excluding any scrollbars.
 */


getViewportDimensions.withoutScrollbars = function () {
  return {
    width: getViewportWidth(),
    height: getViewportHeight()
  };
};

module.exports = getViewportDimensions;

/***/ }),

/***/ "./node_modules/fbjs/lib/hyphenate.js":
/*!********************************************!*\
  !*** ./node_modules/fbjs/lib/hyphenate.js ***!
  \********************************************/
/***/ ((module) => {

"use strict";


/**
 * Copyright (c) 2013-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @typechecks
 */
var _uppercasePattern = /([A-Z])/g;
/**
 * Hyphenates a camelcased string, for example:
 *
 *   > hyphenate('backgroundColor')
 *   < "background-color"
 *
 * For CSS style names, use `hyphenateStyleName` instead which works properly
 * with all vendor prefixes, including `ms`.
 *
 * @param {string} string
 * @return {string}
 */

function hyphenate(string) {
  return string.replace(_uppercasePattern, '-$1').toLowerCase();
}

module.exports = hyphenate;

/***/ }),

/***/ "./node_modules/fbjs/lib/invariant.js":
/*!********************************************!*\
  !*** ./node_modules/fbjs/lib/invariant.js ***!
  \********************************************/
/***/ ((module) => {

"use strict";
/**
 * Copyright (c) 2013-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * 
 */


var validateFormat =  true ? function (format) {
  if (format === undefined) {
    throw new Error('invariant(...): Second argument must be a string.');
  }
} : 0;
/**
 * Use invariant() to assert state which your program assumes to be true.
 *
 * Provide sprintf-style format (only %s is supported) and arguments to provide
 * information about what broke and what you were expecting.
 *
 * The invariant message will be stripped in production, but the invariant will
 * remain to ensure logic does not differ in production.
 */

function invariant(condition, format) {
  for (var _len = arguments.length, args = new Array(_len > 2 ? _len - 2 : 0), _key = 2; _key < _len; _key++) {
    args[_key - 2] = arguments[_key];
  }

  validateFormat(format);

  if (!condition) {
    var error;

    if (format === undefined) {
      error = new Error('Minified exception occurred; use the non-minified dev environment ' + 'for the full error message and additional helpful warnings.');
    } else {
      var argIndex = 0;
      error = new Error(format.replace(/%s/g, function () {
        return String(args[argIndex++]);
      }));
      error.name = 'Invariant Violation';
    }

    error.framesToPop = 1; // Skip invariant's own stack frame.

    throw error;
  }
}

module.exports = invariant;

/***/ }),

/***/ "./node_modules/fbjs/lib/isNode.js":
/*!*****************************************!*\
  !*** ./node_modules/fbjs/lib/isNode.js ***!
  \*****************************************/
/***/ ((module) => {

"use strict";


/**
 * Copyright (c) 2013-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @typechecks
 */

/**
 * @param {*} object The object to check.
 * @return {boolean} Whether or not the object is a DOM node.
 */
function isNode(object) {
  var doc = object ? object.ownerDocument || object : document;
  var defaultView = doc.defaultView || window;
  return !!(object && (typeof defaultView.Node === 'function' ? object instanceof defaultView.Node : typeof object === 'object' && typeof object.nodeType === 'number' && typeof object.nodeName === 'string'));
}

module.exports = isNode;

/***/ }),

/***/ "./node_modules/fbjs/lib/isTextNode.js":
/*!*********************************************!*\
  !*** ./node_modules/fbjs/lib/isTextNode.js ***!
  \*********************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";


/**
 * Copyright (c) 2013-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @typechecks
 */
var isNode = __webpack_require__(/*! ./isNode */ "./node_modules/fbjs/lib/isNode.js");
/**
 * @param {*} object The object to check.
 * @return {boolean} Whether or not the object is a DOM text node.
 */


function isTextNode(object) {
  return isNode(object) && object.nodeType == 3;
}

module.exports = isTextNode;

/***/ }),

/***/ "./node_modules/fbjs/lib/joinClasses.js":
/*!**********************************************!*\
  !*** ./node_modules/fbjs/lib/joinClasses.js ***!
  \**********************************************/
/***/ ((module) => {

"use strict";
/**
 * Copyright (c) 2013-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * 
 * @typechecks static-only
 */

/**
 * Combines multiple className strings into one.
 */

function joinClasses(className) {
  var newClassName = className || '';
  var argLength = arguments.length;

  if (argLength > 1) {
    for (var index = 1; index < argLength; index++) {
      var nextClass = arguments[index];

      if (nextClass) {
        newClassName = (newClassName ? newClassName + ' ' : '') + nextClass;
      }
    }
  }

  return newClassName;
}

module.exports = joinClasses;

/***/ }),

/***/ "./node_modules/fbjs/lib/mapObject.js":
/*!********************************************!*\
  !*** ./node_modules/fbjs/lib/mapObject.js ***!
  \********************************************/
/***/ ((module) => {

"use strict";
/**
 * Copyright (c) 2013-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */


var hasOwnProperty = Object.prototype.hasOwnProperty;
/**
 * Executes the provided `callback` once for each enumerable own property in the
 * object and constructs a new object from the results. The `callback` is
 * invoked with three arguments:
 *
 *  - the property value
 *  - the property name
 *  - the object being traversed
 *
 * Properties that are added after the call to `mapObject` will not be visited
 * by `callback`. If the values of existing properties are changed, the value
 * passed to `callback` will be the value at the time `mapObject` visits them.
 * Properties that are deleted before being visited are not visited.
 *
 * @grep function objectMap()
 * @grep function objMap()
 *
 * @param {?object} object
 * @param {function} callback
 * @param {*} context
 * @return {?object}
 */

function mapObject(object, callback, context) {
  if (!object) {
    return null;
  }

  var result = {};

  for (var name in object) {
    if (hasOwnProperty.call(object, name)) {
      result[name] = callback.call(context, object[name], name, object);
    }
  }

  return result;
}

module.exports = mapObject;

/***/ }),

/***/ "./node_modules/fbjs/lib/memoizeStringOnly.js":
/*!****************************************************!*\
  !*** ./node_modules/fbjs/lib/memoizeStringOnly.js ***!
  \****************************************************/
/***/ ((module) => {

"use strict";
/**
 * Copyright (c) 2013-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * 
 * @typechecks static-only
 */

/**
 * Memoizes the return value of a function that accepts one string argument.
 */

function memoizeStringOnly(callback) {
  var cache = {};
  return function (string) {
    if (!cache.hasOwnProperty(string)) {
      cache[string] = callback.call(this, string);
    }

    return cache[string];
  };
}

module.exports = memoizeStringOnly;

/***/ }),

/***/ "./node_modules/fbjs/lib/nullthrows.js":
/*!*********************************************!*\
  !*** ./node_modules/fbjs/lib/nullthrows.js ***!
  \*********************************************/
/***/ ((module) => {

"use strict";


/**
 * Copyright (c) 2013-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * 
 */
var nullthrows = function nullthrows(x) {
  if (x != null) {
    return x;
  }

  throw new Error("Got unexpected null or undefined");
};

module.exports = nullthrows;

/***/ }),

/***/ "./node_modules/fbjs/lib/setImmediate.js":
/*!***********************************************!*\
  !*** ./node_modules/fbjs/lib/setImmediate.js ***!
  \***********************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";
/**
 * Copyright (c) 2013-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */
 // setimmediate adds setImmediate to the global. We want to make sure we export
// the actual function.

__webpack_require__(/*! setimmediate */ "./node_modules/setimmediate/setImmediate.js");

module.exports = __webpack_require__.g.setImmediate;

/***/ }),

/***/ "./node_modules/fbjs/lib/warning.js":
/*!******************************************!*\
  !*** ./node_modules/fbjs/lib/warning.js ***!
  \******************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";
/**
 * Copyright (c) 2014-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */


var emptyFunction = __webpack_require__(/*! ./emptyFunction */ "./node_modules/fbjs/lib/emptyFunction.js");
/**
 * Similar to invariant but only logs a warning if the condition is not met.
 * This can be used to log issues in development environments in critical
 * paths. Removing the logging code for production environments will keep the
 * same logic and follow the same code paths.
 */


function printWarning(format) {
  for (var _len = arguments.length, args = new Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
    args[_key - 1] = arguments[_key];
  }

  var argIndex = 0;
  var message = 'Warning: ' + format.replace(/%s/g, function () {
    return args[argIndex++];
  });

  if (typeof console !== 'undefined') {
    console.error(message);
  }

  try {
    // --- Welcome to debugging React ---
    // This error was thrown as a convenience so that you can use this stack
    // to find the callsite that caused this warning to fire.
    throw new Error(message);
  } catch (x) {}
}

var warning =  true ? function (condition, format) {
  if (format === undefined) {
    throw new Error('`warning(condition, format, ...args)` requires a warning ' + 'message argument');
  }

  if (!condition) {
    for (var _len2 = arguments.length, args = new Array(_len2 > 2 ? _len2 - 2 : 0), _key2 = 2; _key2 < _len2; _key2++) {
      args[_key2 - 2] = arguments[_key2];
    }

    printWarning.apply(void 0, [format].concat(args));
  }
} : 0;
module.exports = warning;

/***/ }),

/***/ "./node_modules/object-assign/index.js":
/*!*********************************************!*\
  !*** ./node_modules/object-assign/index.js ***!
  \*********************************************/
/***/ ((module) => {

"use strict";
/*
object-assign
(c) Sindre Sorhus
@license MIT
*/


/* eslint-disable no-unused-vars */
var getOwnPropertySymbols = Object.getOwnPropertySymbols;
var hasOwnProperty = Object.prototype.hasOwnProperty;
var propIsEnumerable = Object.prototype.propertyIsEnumerable;

function toObject(val) {
	if (val === null || val === undefined) {
		throw new TypeError('Object.assign cannot be called with null or undefined');
	}

	return Object(val);
}

function shouldUseNative() {
	try {
		if (!Object.assign) {
			return false;
		}

		// Detect buggy property enumeration order in older V8 versions.

		// https://bugs.chromium.org/p/v8/issues/detail?id=4118
		var test1 = new String('abc');  // eslint-disable-line no-new-wrappers
		test1[5] = 'de';
		if (Object.getOwnPropertyNames(test1)[0] === '5') {
			return false;
		}

		// https://bugs.chromium.org/p/v8/issues/detail?id=3056
		var test2 = {};
		for (var i = 0; i < 10; i++) {
			test2['_' + String.fromCharCode(i)] = i;
		}
		var order2 = Object.getOwnPropertyNames(test2).map(function (n) {
			return test2[n];
		});
		if (order2.join('') !== '0123456789') {
			return false;
		}

		// https://bugs.chromium.org/p/v8/issues/detail?id=3056
		var test3 = {};
		'abcdefghijklmnopqrst'.split('').forEach(function (letter) {
			test3[letter] = letter;
		});
		if (Object.keys(Object.assign({}, test3)).join('') !==
				'abcdefghijklmnopqrst') {
			return false;
		}

		return true;
	} catch (err) {
		// We don't expect any of the above to throw, but better to be safe.
		return false;
	}
}

module.exports = shouldUseNative() ? Object.assign : function (target, source) {
	var from;
	var to = toObject(target);
	var symbols;

	for (var s = 1; s < arguments.length; s++) {
		from = Object(arguments[s]);

		for (var key in from) {
			if (hasOwnProperty.call(from, key)) {
				to[key] = from[key];
			}
		}

		if (getOwnPropertySymbols) {
			symbols = getOwnPropertySymbols(from);
			for (var i = 0; i < symbols.length; i++) {
				if (propIsEnumerable.call(from, symbols[i])) {
					to[symbols[i]] = from[symbols[i]];
				}
			}
		}
	}

	return to;
};


/***/ }),

/***/ "./node_modules/process/browser.js":
/*!*****************************************!*\
  !*** ./node_modules/process/browser.js ***!
  \*****************************************/
/***/ ((module) => {

// shim for using process in browser
var process = module.exports = {};

// cached from whatever global is present so that test runners that stub it
// don't break things.  But we need to wrap it in a try catch in case it is
// wrapped in strict mode code which doesn't define any globals.  It's inside a
// function because try/catches deoptimize in certain engines.

var cachedSetTimeout;
var cachedClearTimeout;

function defaultSetTimout() {
    throw new Error('setTimeout has not been defined');
}
function defaultClearTimeout () {
    throw new Error('clearTimeout has not been defined');
}
(function () {
    try {
        if (typeof setTimeout === 'function') {
            cachedSetTimeout = setTimeout;
        } else {
            cachedSetTimeout = defaultSetTimout;
        }
    } catch (e) {
        cachedSetTimeout = defaultSetTimout;
    }
    try {
        if (typeof clearTimeout === 'function') {
            cachedClearTimeout = clearTimeout;
        } else {
            cachedClearTimeout = defaultClearTimeout;
        }
    } catch (e) {
        cachedClearTimeout = defaultClearTimeout;
    }
} ())
function runTimeout(fun) {
    if (cachedSetTimeout === setTimeout) {
        //normal enviroments in sane situations
        return setTimeout(fun, 0);
    }
    // if setTimeout wasn't available but was latter defined
    if ((cachedSetTimeout === defaultSetTimout || !cachedSetTimeout) && setTimeout) {
        cachedSetTimeout = setTimeout;
        return setTimeout(fun, 0);
    }
    try {
        // when when somebody has screwed with setTimeout but no I.E. maddness
        return cachedSetTimeout(fun, 0);
    } catch(e){
        try {
            // When we are in I.E. but the script has been evaled so I.E. doesn't trust the global object when called normally
            return cachedSetTimeout.call(null, fun, 0);
        } catch(e){
            // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error
            return cachedSetTimeout.call(this, fun, 0);
        }
    }


}
function runClearTimeout(marker) {
    if (cachedClearTimeout === clearTimeout) {
        //normal enviroments in sane situations
        return clearTimeout(marker);
    }
    // if clearTimeout wasn't available but was latter defined
    if ((cachedClearTimeout === defaultClearTimeout || !cachedClearTimeout) && clearTimeout) {
        cachedClearTimeout = clearTimeout;
        return clearTimeout(marker);
    }
    try {
        // when when somebody has screwed with setTimeout but no I.E. maddness
        return cachedClearTimeout(marker);
    } catch (e){
        try {
            // When we are in I.E. but the script has been evaled so I.E. doesn't  trust the global object when called normally
            return cachedClearTimeout.call(null, marker);
        } catch (e){
            // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error.
            // Some versions of I.E. have different rules for clearTimeout vs setTimeout
            return cachedClearTimeout.call(this, marker);
        }
    }



}
var queue = [];
var draining = false;
var currentQueue;
var queueIndex = -1;

function cleanUpNextTick() {
    if (!draining || !currentQueue) {
        return;
    }
    draining = false;
    if (currentQueue.length) {
        queue = currentQueue.concat(queue);
    } else {
        queueIndex = -1;
    }
    if (queue.length) {
        drainQueue();
    }
}

function drainQueue() {
    if (draining) {
        return;
    }
    var timeout = runTimeout(cleanUpNextTick);
    draining = true;

    var len = queue.length;
    while(len) {
        currentQueue = queue;
        queue = [];
        while (++queueIndex < len) {
            if (currentQueue) {
                currentQueue[queueIndex].run();
            }
        }
        queueIndex = -1;
        len = queue.length;
    }
    currentQueue = null;
    draining = false;
    runClearTimeout(timeout);
}

process.nextTick = function (fun) {
    var args = new Array(arguments.length - 1);
    if (arguments.length > 1) {
        for (var i = 1; i < arguments.length; i++) {
            args[i - 1] = arguments[i];
        }
    }
    queue.push(new Item(fun, args));
    if (queue.length === 1 && !draining) {
        runTimeout(drainQueue);
    }
};

// v8 likes predictible objects
function Item(fun, array) {
    this.fun = fun;
    this.array = array;
}
Item.prototype.run = function () {
    this.fun.apply(null, this.array);
};
process.title = 'browser';
process.browser = true;
process.env = {};
process.argv = [];
process.version = ''; // empty string to avoid regexp issues
process.versions = {};

function noop() {}

process.on = noop;
process.addListener = noop;
process.once = noop;
process.off = noop;
process.removeListener = noop;
process.removeAllListeners = noop;
process.emit = noop;
process.prependListener = noop;
process.prependOnceListener = noop;

process.listeners = function (name) { return [] }

process.binding = function (name) {
    throw new Error('process.binding is not supported');
};

process.cwd = function () { return '/' };
process.chdir = function (dir) {
    throw new Error('process.chdir is not supported');
};
process.umask = function() { return 0; };


/***/ }),

/***/ "./node_modules/react-toastify/node_modules/clsx/dist/clsx.m.js":
/*!**********************************************************************!*\
  !*** ./node_modules/react-toastify/node_modules/clsx/dist/clsx.m.js ***!
  \**********************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   clsx: () => (/* binding */ clsx),
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
function r(e){var t,f,n="";if("string"==typeof e||"number"==typeof e)n+=e;else if("object"==typeof e)if(Array.isArray(e))for(t=0;t<e.length;t++)e[t]&&(f=r(e[t]))&&(n&&(n+=" "),n+=f);else for(t in e)e[t]&&(n&&(n+=" "),n+=t);return n}function clsx(){for(var e,t,f=0,n="";f<arguments.length;)(e=arguments[f++])&&(t=r(e))&&(n&&(n+=" "),n+=t);return n}/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (clsx);

/***/ }),

/***/ "./node_modules/scheduler/cjs/scheduler-tracing.development.js":
/*!*********************************************************************!*\
  !*** ./node_modules/scheduler/cjs/scheduler-tracing.development.js ***!
  \*********************************************************************/
/***/ ((__unused_webpack_module, exports) => {

"use strict";
/** @license React v0.20.2
 * scheduler-tracing.development.js
 *
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */



if (true) {
  (function() {
'use strict';

var DEFAULT_THREAD_ID = 0; // Counters used to generate unique IDs.

var interactionIDCounter = 0;
var threadIDCounter = 0; // Set of currently traced interactions.
// Interactions "stack"–
// Meaning that newly traced interactions are appended to the previously active set.
// When an interaction goes out of scope, the previous set (if any) is restored.

exports.__interactionsRef = null; // Listener(s) to notify when interactions begin and end.

exports.__subscriberRef = null;

{
  exports.__interactionsRef = {
    current: new Set()
  };
  exports.__subscriberRef = {
    current: null
  };
}
function unstable_clear(callback) {

  var prevInteractions = exports.__interactionsRef.current;
  exports.__interactionsRef.current = new Set();

  try {
    return callback();
  } finally {
    exports.__interactionsRef.current = prevInteractions;
  }
}
function unstable_getCurrent() {
  {
    return exports.__interactionsRef.current;
  }
}
function unstable_getThreadID() {
  return ++threadIDCounter;
}
function unstable_trace(name, timestamp, callback) {
  var threadID = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : DEFAULT_THREAD_ID;

  var interaction = {
    __count: 1,
    id: interactionIDCounter++,
    name: name,
    timestamp: timestamp
  };
  var prevInteractions = exports.__interactionsRef.current; // Traced interactions should stack/accumulate.
  // To do that, clone the current interactions.
  // The previous set will be restored upon completion.

  var interactions = new Set(prevInteractions);
  interactions.add(interaction);
  exports.__interactionsRef.current = interactions;
  var subscriber = exports.__subscriberRef.current;
  var returnValue;

  try {
    if (subscriber !== null) {
      subscriber.onInteractionTraced(interaction);
    }
  } finally {
    try {
      if (subscriber !== null) {
        subscriber.onWorkStarted(interactions, threadID);
      }
    } finally {
      try {
        returnValue = callback();
      } finally {
        exports.__interactionsRef.current = prevInteractions;

        try {
          if (subscriber !== null) {
            subscriber.onWorkStopped(interactions, threadID);
          }
        } finally {
          interaction.__count--; // If no async work was scheduled for this interaction,
          // Notify subscribers that it's completed.

          if (subscriber !== null && interaction.__count === 0) {
            subscriber.onInteractionScheduledWorkCompleted(interaction);
          }
        }
      }
    }
  }

  return returnValue;
}
function unstable_wrap(callback) {
  var threadID = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : DEFAULT_THREAD_ID;

  var wrappedInteractions = exports.__interactionsRef.current;
  var subscriber = exports.__subscriberRef.current;

  if (subscriber !== null) {
    subscriber.onWorkScheduled(wrappedInteractions, threadID);
  } // Update the pending async work count for the current interactions.
  // Update after calling subscribers in case of error.


  wrappedInteractions.forEach(function (interaction) {
    interaction.__count++;
  });
  var hasRun = false;

  function wrapped() {
    var prevInteractions = exports.__interactionsRef.current;
    exports.__interactionsRef.current = wrappedInteractions;
    subscriber = exports.__subscriberRef.current;

    try {
      var returnValue;

      try {
        if (subscriber !== null) {
          subscriber.onWorkStarted(wrappedInteractions, threadID);
        }
      } finally {
        try {
          returnValue = callback.apply(undefined, arguments);
        } finally {
          exports.__interactionsRef.current = prevInteractions;

          if (subscriber !== null) {
            subscriber.onWorkStopped(wrappedInteractions, threadID);
          }
        }
      }

      return returnValue;
    } finally {
      if (!hasRun) {
        // We only expect a wrapped function to be executed once,
        // But in the event that it's executed more than once–
        // Only decrement the outstanding interaction counts once.
        hasRun = true; // Update pending async counts for all wrapped interactions.
        // If this was the last scheduled async work for any of them,
        // Mark them as completed.

        wrappedInteractions.forEach(function (interaction) {
          interaction.__count--;

          if (subscriber !== null && interaction.__count === 0) {
            subscriber.onInteractionScheduledWorkCompleted(interaction);
          }
        });
      }
    }
  }

  wrapped.cancel = function cancel() {
    subscriber = exports.__subscriberRef.current;

    try {
      if (subscriber !== null) {
        subscriber.onWorkCanceled(wrappedInteractions, threadID);
      }
    } finally {
      // Update pending async counts for all wrapped interactions.
      // If this was the last scheduled async work for any of them,
      // Mark them as completed.
      wrappedInteractions.forEach(function (interaction) {
        interaction.__count--;

        if (subscriber && interaction.__count === 0) {
          subscriber.onInteractionScheduledWorkCompleted(interaction);
        }
      });
    }
  };

  return wrapped;
}

var subscribers = null;

{
  subscribers = new Set();
}

function unstable_subscribe(subscriber) {
  {
    subscribers.add(subscriber);

    if (subscribers.size === 1) {
      exports.__subscriberRef.current = {
        onInteractionScheduledWorkCompleted: onInteractionScheduledWorkCompleted,
        onInteractionTraced: onInteractionTraced,
        onWorkCanceled: onWorkCanceled,
        onWorkScheduled: onWorkScheduled,
        onWorkStarted: onWorkStarted,
        onWorkStopped: onWorkStopped
      };
    }
  }
}
function unstable_unsubscribe(subscriber) {
  {
    subscribers.delete(subscriber);

    if (subscribers.size === 0) {
      exports.__subscriberRef.current = null;
    }
  }
}

function onInteractionTraced(interaction) {
  var didCatchError = false;
  var caughtError = null;
  subscribers.forEach(function (subscriber) {
    try {
      subscriber.onInteractionTraced(interaction);
    } catch (error) {
      if (!didCatchError) {
        didCatchError = true;
        caughtError = error;
      }
    }
  });

  if (didCatchError) {
    throw caughtError;
  }
}

function onInteractionScheduledWorkCompleted(interaction) {
  var didCatchError = false;
  var caughtError = null;
  subscribers.forEach(function (subscriber) {
    try {
      subscriber.onInteractionScheduledWorkCompleted(interaction);
    } catch (error) {
      if (!didCatchError) {
        didCatchError = true;
        caughtError = error;
      }
    }
  });

  if (didCatchError) {
    throw caughtError;
  }
}

function onWorkScheduled(interactions, threadID) {
  var didCatchError = false;
  var caughtError = null;
  subscribers.forEach(function (subscriber) {
    try {
      subscriber.onWorkScheduled(interactions, threadID);
    } catch (error) {
      if (!didCatchError) {
        didCatchError = true;
        caughtError = error;
      }
    }
  });

  if (didCatchError) {
    throw caughtError;
  }
}

function onWorkStarted(interactions, threadID) {
  var didCatchError = false;
  var caughtError = null;
  subscribers.forEach(function (subscriber) {
    try {
      subscriber.onWorkStarted(interactions, threadID);
    } catch (error) {
      if (!didCatchError) {
        didCatchError = true;
        caughtError = error;
      }
    }
  });

  if (didCatchError) {
    throw caughtError;
  }
}

function onWorkStopped(interactions, threadID) {
  var didCatchError = false;
  var caughtError = null;
  subscribers.forEach(function (subscriber) {
    try {
      subscriber.onWorkStopped(interactions, threadID);
    } catch (error) {
      if (!didCatchError) {
        didCatchError = true;
        caughtError = error;
      }
    }
  });

  if (didCatchError) {
    throw caughtError;
  }
}

function onWorkCanceled(interactions, threadID) {
  var didCatchError = false;
  var caughtError = null;
  subscribers.forEach(function (subscriber) {
    try {
      subscriber.onWorkCanceled(interactions, threadID);
    } catch (error) {
      if (!didCatchError) {
        didCatchError = true;
        caughtError = error;
      }
    }
  });

  if (didCatchError) {
    throw caughtError;
  }
}

exports.unstable_clear = unstable_clear;
exports.unstable_getCurrent = unstable_getCurrent;
exports.unstable_getThreadID = unstable_getThreadID;
exports.unstable_subscribe = unstable_subscribe;
exports.unstable_trace = unstable_trace;
exports.unstable_unsubscribe = unstable_unsubscribe;
exports.unstable_wrap = unstable_wrap;
  })();
}


/***/ }),

/***/ "./node_modules/scheduler/cjs/scheduler.development.js":
/*!*************************************************************!*\
  !*** ./node_modules/scheduler/cjs/scheduler.development.js ***!
  \*************************************************************/
/***/ ((__unused_webpack_module, exports) => {

"use strict";
/** @license React v0.20.2
 * scheduler.development.js
 *
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */



if (true) {
  (function() {
'use strict';

var enableSchedulerDebugging = false;
var enableProfiling = false;

var requestHostCallback;
var requestHostTimeout;
var cancelHostTimeout;
var requestPaint;
var hasPerformanceNow = typeof performance === 'object' && typeof performance.now === 'function';

if (hasPerformanceNow) {
  var localPerformance = performance;

  exports.unstable_now = function () {
    return localPerformance.now();
  };
} else {
  var localDate = Date;
  var initialTime = localDate.now();

  exports.unstable_now = function () {
    return localDate.now() - initialTime;
  };
}

if ( // If Scheduler runs in a non-DOM environment, it falls back to a naive
// implementation using setTimeout.
typeof window === 'undefined' || // Check if MessageChannel is supported, too.
typeof MessageChannel !== 'function') {
  // If this accidentally gets imported in a non-browser environment, e.g. JavaScriptCore,
  // fallback to a naive implementation.
  var _callback = null;
  var _timeoutID = null;

  var _flushCallback = function () {
    if (_callback !== null) {
      try {
        var currentTime = exports.unstable_now();
        var hasRemainingTime = true;

        _callback(hasRemainingTime, currentTime);

        _callback = null;
      } catch (e) {
        setTimeout(_flushCallback, 0);
        throw e;
      }
    }
  };

  requestHostCallback = function (cb) {
    if (_callback !== null) {
      // Protect against re-entrancy.
      setTimeout(requestHostCallback, 0, cb);
    } else {
      _callback = cb;
      setTimeout(_flushCallback, 0);
    }
  };

  requestHostTimeout = function (cb, ms) {
    _timeoutID = setTimeout(cb, ms);
  };

  cancelHostTimeout = function () {
    clearTimeout(_timeoutID);
  };

  exports.unstable_shouldYield = function () {
    return false;
  };

  requestPaint = exports.unstable_forceFrameRate = function () {};
} else {
  // Capture local references to native APIs, in case a polyfill overrides them.
  var _setTimeout = window.setTimeout;
  var _clearTimeout = window.clearTimeout;

  if (typeof console !== 'undefined') {
    // TODO: Scheduler no longer requires these methods to be polyfilled. But
    // maybe we want to continue warning if they don't exist, to preserve the
    // option to rely on it in the future?
    var requestAnimationFrame = window.requestAnimationFrame;
    var cancelAnimationFrame = window.cancelAnimationFrame;

    if (typeof requestAnimationFrame !== 'function') {
      // Using console['error'] to evade Babel and ESLint
      console['error']("This browser doesn't support requestAnimationFrame. " + 'Make sure that you load a ' + 'polyfill in older browsers. https://reactjs.org/link/react-polyfills');
    }

    if (typeof cancelAnimationFrame !== 'function') {
      // Using console['error'] to evade Babel and ESLint
      console['error']("This browser doesn't support cancelAnimationFrame. " + 'Make sure that you load a ' + 'polyfill in older browsers. https://reactjs.org/link/react-polyfills');
    }
  }

  var isMessageLoopRunning = false;
  var scheduledHostCallback = null;
  var taskTimeoutID = -1; // Scheduler periodically yields in case there is other work on the main
  // thread, like user events. By default, it yields multiple times per frame.
  // It does not attempt to align with frame boundaries, since most tasks don't
  // need to be frame aligned; for those that do, use requestAnimationFrame.

  var yieldInterval = 5;
  var deadline = 0; // TODO: Make this configurable

  {
    // `isInputPending` is not available. Since we have no way of knowing if
    // there's pending input, always yield at the end of the frame.
    exports.unstable_shouldYield = function () {
      return exports.unstable_now() >= deadline;
    }; // Since we yield every frame regardless, `requestPaint` has no effect.


    requestPaint = function () {};
  }

  exports.unstable_forceFrameRate = function (fps) {
    if (fps < 0 || fps > 125) {
      // Using console['error'] to evade Babel and ESLint
      console['error']('forceFrameRate takes a positive int between 0 and 125, ' + 'forcing frame rates higher than 125 fps is not supported');
      return;
    }

    if (fps > 0) {
      yieldInterval = Math.floor(1000 / fps);
    } else {
      // reset the framerate
      yieldInterval = 5;
    }
  };

  var performWorkUntilDeadline = function () {
    if (scheduledHostCallback !== null) {
      var currentTime = exports.unstable_now(); // Yield after `yieldInterval` ms, regardless of where we are in the vsync
      // cycle. This means there's always time remaining at the beginning of
      // the message event.

      deadline = currentTime + yieldInterval;
      var hasTimeRemaining = true;

      try {
        var hasMoreWork = scheduledHostCallback(hasTimeRemaining, currentTime);

        if (!hasMoreWork) {
          isMessageLoopRunning = false;
          scheduledHostCallback = null;
        } else {
          // If there's more work, schedule the next message event at the end
          // of the preceding one.
          port.postMessage(null);
        }
      } catch (error) {
        // If a scheduler task throws, exit the current browser task so the
        // error can be observed.
        port.postMessage(null);
        throw error;
      }
    } else {
      isMessageLoopRunning = false;
    } // Yielding to the browser will give it a chance to paint, so we can
  };

  var channel = new MessageChannel();
  var port = channel.port2;
  channel.port1.onmessage = performWorkUntilDeadline;

  requestHostCallback = function (callback) {
    scheduledHostCallback = callback;

    if (!isMessageLoopRunning) {
      isMessageLoopRunning = true;
      port.postMessage(null);
    }
  };

  requestHostTimeout = function (callback, ms) {
    taskTimeoutID = _setTimeout(function () {
      callback(exports.unstable_now());
    }, ms);
  };

  cancelHostTimeout = function () {
    _clearTimeout(taskTimeoutID);

    taskTimeoutID = -1;
  };
}

function push(heap, node) {
  var index = heap.length;
  heap.push(node);
  siftUp(heap, node, index);
}
function peek(heap) {
  var first = heap[0];
  return first === undefined ? null : first;
}
function pop(heap) {
  var first = heap[0];

  if (first !== undefined) {
    var last = heap.pop();

    if (last !== first) {
      heap[0] = last;
      siftDown(heap, last, 0);
    }

    return first;
  } else {
    return null;
  }
}

function siftUp(heap, node, i) {
  var index = i;

  while (true) {
    var parentIndex = index - 1 >>> 1;
    var parent = heap[parentIndex];

    if (parent !== undefined && compare(parent, node) > 0) {
      // The parent is larger. Swap positions.
      heap[parentIndex] = node;
      heap[index] = parent;
      index = parentIndex;
    } else {
      // The parent is smaller. Exit.
      return;
    }
  }
}

function siftDown(heap, node, i) {
  var index = i;
  var length = heap.length;

  while (index < length) {
    var leftIndex = (index + 1) * 2 - 1;
    var left = heap[leftIndex];
    var rightIndex = leftIndex + 1;
    var right = heap[rightIndex]; // If the left or right node is smaller, swap with the smaller of those.

    if (left !== undefined && compare(left, node) < 0) {
      if (right !== undefined && compare(right, left) < 0) {
        heap[index] = right;
        heap[rightIndex] = node;
        index = rightIndex;
      } else {
        heap[index] = left;
        heap[leftIndex] = node;
        index = leftIndex;
      }
    } else if (right !== undefined && compare(right, node) < 0) {
      heap[index] = right;
      heap[rightIndex] = node;
      index = rightIndex;
    } else {
      // Neither child is smaller. Exit.
      return;
    }
  }
}

function compare(a, b) {
  // Compare sort index first, then task id.
  var diff = a.sortIndex - b.sortIndex;
  return diff !== 0 ? diff : a.id - b.id;
}

// TODO: Use symbols?
var ImmediatePriority = 1;
var UserBlockingPriority = 2;
var NormalPriority = 3;
var LowPriority = 4;
var IdlePriority = 5;

function markTaskErrored(task, ms) {
}

/* eslint-disable no-var */
// Math.pow(2, 30) - 1
// 0b111111111111111111111111111111

var maxSigned31BitInt = 1073741823; // Times out immediately

var IMMEDIATE_PRIORITY_TIMEOUT = -1; // Eventually times out

var USER_BLOCKING_PRIORITY_TIMEOUT = 250;
var NORMAL_PRIORITY_TIMEOUT = 5000;
var LOW_PRIORITY_TIMEOUT = 10000; // Never times out

var IDLE_PRIORITY_TIMEOUT = maxSigned31BitInt; // Tasks are stored on a min heap

var taskQueue = [];
var timerQueue = []; // Incrementing id counter. Used to maintain insertion order.

var taskIdCounter = 1; // Pausing the scheduler is useful for debugging.
var currentTask = null;
var currentPriorityLevel = NormalPriority; // This is set while performing work, to prevent re-entrancy.

var isPerformingWork = false;
var isHostCallbackScheduled = false;
var isHostTimeoutScheduled = false;

function advanceTimers(currentTime) {
  // Check for tasks that are no longer delayed and add them to the queue.
  var timer = peek(timerQueue);

  while (timer !== null) {
    if (timer.callback === null) {
      // Timer was cancelled.
      pop(timerQueue);
    } else if (timer.startTime <= currentTime) {
      // Timer fired. Transfer to the task queue.
      pop(timerQueue);
      timer.sortIndex = timer.expirationTime;
      push(taskQueue, timer);
    } else {
      // Remaining timers are pending.
      return;
    }

    timer = peek(timerQueue);
  }
}

function handleTimeout(currentTime) {
  isHostTimeoutScheduled = false;
  advanceTimers(currentTime);

  if (!isHostCallbackScheduled) {
    if (peek(taskQueue) !== null) {
      isHostCallbackScheduled = true;
      requestHostCallback(flushWork);
    } else {
      var firstTimer = peek(timerQueue);

      if (firstTimer !== null) {
        requestHostTimeout(handleTimeout, firstTimer.startTime - currentTime);
      }
    }
  }
}

function flushWork(hasTimeRemaining, initialTime) {


  isHostCallbackScheduled = false;

  if (isHostTimeoutScheduled) {
    // We scheduled a timeout but it's no longer needed. Cancel it.
    isHostTimeoutScheduled = false;
    cancelHostTimeout();
  }

  isPerformingWork = true;
  var previousPriorityLevel = currentPriorityLevel;

  try {
    if (enableProfiling) {
      try {
        return workLoop(hasTimeRemaining, initialTime);
      } catch (error) {
        if (currentTask !== null) {
          var currentTime = exports.unstable_now();
          markTaskErrored(currentTask, currentTime);
          currentTask.isQueued = false;
        }

        throw error;
      }
    } else {
      // No catch in prod code path.
      return workLoop(hasTimeRemaining, initialTime);
    }
  } finally {
    currentTask = null;
    currentPriorityLevel = previousPriorityLevel;
    isPerformingWork = false;
  }
}

function workLoop(hasTimeRemaining, initialTime) {
  var currentTime = initialTime;
  advanceTimers(currentTime);
  currentTask = peek(taskQueue);

  while (currentTask !== null && !(enableSchedulerDebugging )) {
    if (currentTask.expirationTime > currentTime && (!hasTimeRemaining || exports.unstable_shouldYield())) {
      // This currentTask hasn't expired, and we've reached the deadline.
      break;
    }

    var callback = currentTask.callback;

    if (typeof callback === 'function') {
      currentTask.callback = null;
      currentPriorityLevel = currentTask.priorityLevel;
      var didUserCallbackTimeout = currentTask.expirationTime <= currentTime;

      var continuationCallback = callback(didUserCallbackTimeout);
      currentTime = exports.unstable_now();

      if (typeof continuationCallback === 'function') {
        currentTask.callback = continuationCallback;
      } else {

        if (currentTask === peek(taskQueue)) {
          pop(taskQueue);
        }
      }

      advanceTimers(currentTime);
    } else {
      pop(taskQueue);
    }

    currentTask = peek(taskQueue);
  } // Return whether there's additional work


  if (currentTask !== null) {
    return true;
  } else {
    var firstTimer = peek(timerQueue);

    if (firstTimer !== null) {
      requestHostTimeout(handleTimeout, firstTimer.startTime - currentTime);
    }

    return false;
  }
}

function unstable_runWithPriority(priorityLevel, eventHandler) {
  switch (priorityLevel) {
    case ImmediatePriority:
    case UserBlockingPriority:
    case NormalPriority:
    case LowPriority:
    case IdlePriority:
      break;

    default:
      priorityLevel = NormalPriority;
  }

  var previousPriorityLevel = currentPriorityLevel;
  currentPriorityLevel = priorityLevel;

  try {
    return eventHandler();
  } finally {
    currentPriorityLevel = previousPriorityLevel;
  }
}

function unstable_next(eventHandler) {
  var priorityLevel;

  switch (currentPriorityLevel) {
    case ImmediatePriority:
    case UserBlockingPriority:
    case NormalPriority:
      // Shift down to normal priority
      priorityLevel = NormalPriority;
      break;

    default:
      // Anything lower than normal priority should remain at the current level.
      priorityLevel = currentPriorityLevel;
      break;
  }

  var previousPriorityLevel = currentPriorityLevel;
  currentPriorityLevel = priorityLevel;

  try {
    return eventHandler();
  } finally {
    currentPriorityLevel = previousPriorityLevel;
  }
}

function unstable_wrapCallback(callback) {
  var parentPriorityLevel = currentPriorityLevel;
  return function () {
    // This is a fork of runWithPriority, inlined for performance.
    var previousPriorityLevel = currentPriorityLevel;
    currentPriorityLevel = parentPriorityLevel;

    try {
      return callback.apply(this, arguments);
    } finally {
      currentPriorityLevel = previousPriorityLevel;
    }
  };
}

function unstable_scheduleCallback(priorityLevel, callback, options) {
  var currentTime = exports.unstable_now();
  var startTime;

  if (typeof options === 'object' && options !== null) {
    var delay = options.delay;

    if (typeof delay === 'number' && delay > 0) {
      startTime = currentTime + delay;
    } else {
      startTime = currentTime;
    }
  } else {
    startTime = currentTime;
  }

  var timeout;

  switch (priorityLevel) {
    case ImmediatePriority:
      timeout = IMMEDIATE_PRIORITY_TIMEOUT;
      break;

    case UserBlockingPriority:
      timeout = USER_BLOCKING_PRIORITY_TIMEOUT;
      break;

    case IdlePriority:
      timeout = IDLE_PRIORITY_TIMEOUT;
      break;

    case LowPriority:
      timeout = LOW_PRIORITY_TIMEOUT;
      break;

    case NormalPriority:
    default:
      timeout = NORMAL_PRIORITY_TIMEOUT;
      break;
  }

  var expirationTime = startTime + timeout;
  var newTask = {
    id: taskIdCounter++,
    callback: callback,
    priorityLevel: priorityLevel,
    startTime: startTime,
    expirationTime: expirationTime,
    sortIndex: -1
  };

  if (startTime > currentTime) {
    // This is a delayed task.
    newTask.sortIndex = startTime;
    push(timerQueue, newTask);

    if (peek(taskQueue) === null && newTask === peek(timerQueue)) {
      // All tasks are delayed, and this is the task with the earliest delay.
      if (isHostTimeoutScheduled) {
        // Cancel an existing timeout.
        cancelHostTimeout();
      } else {
        isHostTimeoutScheduled = true;
      } // Schedule a timeout.


      requestHostTimeout(handleTimeout, startTime - currentTime);
    }
  } else {
    newTask.sortIndex = expirationTime;
    push(taskQueue, newTask);
    // wait until the next time we yield.


    if (!isHostCallbackScheduled && !isPerformingWork) {
      isHostCallbackScheduled = true;
      requestHostCallback(flushWork);
    }
  }

  return newTask;
}

function unstable_pauseExecution() {
}

function unstable_continueExecution() {

  if (!isHostCallbackScheduled && !isPerformingWork) {
    isHostCallbackScheduled = true;
    requestHostCallback(flushWork);
  }
}

function unstable_getFirstCallbackNode() {
  return peek(taskQueue);
}

function unstable_cancelCallback(task) {
  // remove from the queue because you can't remove arbitrary nodes from an
  // array based heap, only the first one.)


  task.callback = null;
}

function unstable_getCurrentPriorityLevel() {
  return currentPriorityLevel;
}

var unstable_requestPaint = requestPaint;
var unstable_Profiling =  null;

exports.unstable_IdlePriority = IdlePriority;
exports.unstable_ImmediatePriority = ImmediatePriority;
exports.unstable_LowPriority = LowPriority;
exports.unstable_NormalPriority = NormalPriority;
exports.unstable_Profiling = unstable_Profiling;
exports.unstable_UserBlockingPriority = UserBlockingPriority;
exports.unstable_cancelCallback = unstable_cancelCallback;
exports.unstable_continueExecution = unstable_continueExecution;
exports.unstable_getCurrentPriorityLevel = unstable_getCurrentPriorityLevel;
exports.unstable_getFirstCallbackNode = unstable_getFirstCallbackNode;
exports.unstable_next = unstable_next;
exports.unstable_pauseExecution = unstable_pauseExecution;
exports.unstable_requestPaint = unstable_requestPaint;
exports.unstable_runWithPriority = unstable_runWithPriority;
exports.unstable_scheduleCallback = unstable_scheduleCallback;
exports.unstable_wrapCallback = unstable_wrapCallback;
  })();
}


/***/ }),

/***/ "./node_modules/scheduler/index.js":
/*!*****************************************!*\
  !*** ./node_modules/scheduler/index.js ***!
  \*****************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";


if (false) {} else {
  module.exports = __webpack_require__(/*! ./cjs/scheduler.development.js */ "./node_modules/scheduler/cjs/scheduler.development.js");
}


/***/ }),

/***/ "./node_modules/scheduler/tracing.js":
/*!*******************************************!*\
  !*** ./node_modules/scheduler/tracing.js ***!
  \*******************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";


if (false) {} else {
  module.exports = __webpack_require__(/*! ./cjs/scheduler-tracing.development.js */ "./node_modules/scheduler/cjs/scheduler-tracing.development.js");
}


/***/ }),

/***/ "./node_modules/setimmediate/setImmediate.js":
/*!***************************************************!*\
  !*** ./node_modules/setimmediate/setImmediate.js ***!
  \***************************************************/
/***/ (function(__unused_webpack_module, __unused_webpack_exports, __webpack_require__) {

/* provided dependency */ var process = __webpack_require__(/*! process/browser.js */ "./node_modules/process/browser.js");
(function (global, undefined) {
    "use strict";

    if (global.setImmediate) {
        return;
    }

    var nextHandle = 1; // Spec says greater than zero
    var tasksByHandle = {};
    var currentlyRunningATask = false;
    var doc = global.document;
    var registerImmediate;

    function setImmediate(callback) {
      // Callback can either be a function or a string
      if (typeof callback !== "function") {
        callback = new Function("" + callback);
      }
      // Copy function arguments
      var args = new Array(arguments.length - 1);
      for (var i = 0; i < args.length; i++) {
          args[i] = arguments[i + 1];
      }
      // Store and register the task
      var task = { callback: callback, args: args };
      tasksByHandle[nextHandle] = task;
      registerImmediate(nextHandle);
      return nextHandle++;
    }

    function clearImmediate(handle) {
        delete tasksByHandle[handle];
    }

    function run(task) {
        var callback = task.callback;
        var args = task.args;
        switch (args.length) {
        case 0:
            callback();
            break;
        case 1:
            callback(args[0]);
            break;
        case 2:
            callback(args[0], args[1]);
            break;
        case 3:
            callback(args[0], args[1], args[2]);
            break;
        default:
            callback.apply(undefined, args);
            break;
        }
    }

    function runIfPresent(handle) {
        // From the spec: "Wait until any invocations of this algorithm started before this one have completed."
        // So if we're currently running a task, we'll need to delay this invocation.
        if (currentlyRunningATask) {
            // Delay by doing a setTimeout. setImmediate was tried instead, but in Firefox 7 it generated a
            // "too much recursion" error.
            setTimeout(runIfPresent, 0, handle);
        } else {
            var task = tasksByHandle[handle];
            if (task) {
                currentlyRunningATask = true;
                try {
                    run(task);
                } finally {
                    clearImmediate(handle);
                    currentlyRunningATask = false;
                }
            }
        }
    }

    function installNextTickImplementation() {
        registerImmediate = function(handle) {
            process.nextTick(function () { runIfPresent(handle); });
        };
    }

    function canUsePostMessage() {
        // The test against `importScripts` prevents this implementation from being installed inside a web worker,
        // where `global.postMessage` means something completely different and can't be used for this purpose.
        if (global.postMessage && !global.importScripts) {
            var postMessageIsAsynchronous = true;
            var oldOnMessage = global.onmessage;
            global.onmessage = function() {
                postMessageIsAsynchronous = false;
            };
            global.postMessage("", "*");
            global.onmessage = oldOnMessage;
            return postMessageIsAsynchronous;
        }
    }

    function installPostMessageImplementation() {
        // Installs an event handler on `global` for the `message` event: see
        // * https://developer.mozilla.org/en/DOM/window.postMessage
        // * http://www.whatwg.org/specs/web-apps/current-work/multipage/comms.html#crossDocumentMessages

        var messagePrefix = "setImmediate$" + Math.random() + "$";
        var onGlobalMessage = function(event) {
            if (event.source === global &&
                typeof event.data === "string" &&
                event.data.indexOf(messagePrefix) === 0) {
                runIfPresent(+event.data.slice(messagePrefix.length));
            }
        };

        if (global.addEventListener) {
            global.addEventListener("message", onGlobalMessage, false);
        } else {
            global.attachEvent("onmessage", onGlobalMessage);
        }

        registerImmediate = function(handle) {
            global.postMessage(messagePrefix + handle, "*");
        };
    }

    function installMessageChannelImplementation() {
        var channel = new MessageChannel();
        channel.port1.onmessage = function(event) {
            var handle = event.data;
            runIfPresent(handle);
        };

        registerImmediate = function(handle) {
            channel.port2.postMessage(handle);
        };
    }

    function installReadyStateChangeImplementation() {
        var html = doc.documentElement;
        registerImmediate = function(handle) {
            // Create a <script> element; its readystatechange event will be fired asynchronously once it is inserted
            // into the document. Do so, thus queuing up the task. Remember to clean up once it's been called.
            var script = doc.createElement("script");
            script.onreadystatechange = function () {
                runIfPresent(handle);
                script.onreadystatechange = null;
                html.removeChild(script);
                script = null;
            };
            html.appendChild(script);
        };
    }

    function installSetTimeoutImplementation() {
        registerImmediate = function(handle) {
            setTimeout(runIfPresent, 0, handle);
        };
    }

    // If supported, we should attach to the prototype of global, since that is where setTimeout et al. live.
    var attachTo = Object.getPrototypeOf && Object.getPrototypeOf(global);
    attachTo = attachTo && attachTo.setTimeout ? attachTo : global;

    // Don't get fooled by e.g. browserify environments.
    if ({}.toString.call(global.process) === "[object process]") {
        // For Node.js before 0.9
        installNextTickImplementation();

    } else if (canUsePostMessage()) {
        // For non-IE10 modern browsers
        installPostMessageImplementation();

    } else if (global.MessageChannel) {
        // For web workers, where supported
        installMessageChannelImplementation();

    } else if (doc && "onreadystatechange" in doc.createElement("script")) {
        // For IE 6–8
        installReadyStateChangeImplementation();

    } else {
        // For older browsers
        installSetTimeoutImplementation();
    }

    attachTo.setImmediate = setImmediate;
    attachTo.clearImmediate = clearImmediate;
}(typeof self === "undefined" ? typeof __webpack_require__.g === "undefined" ? this : __webpack_require__.g : self));


/***/ }),

/***/ "./node_modules/react-toastify/dist/ReactToastify.css":
/*!************************************************************!*\
  !*** ./node_modules/react-toastify/dist/ReactToastify.css ***!
  \************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! !../../style-loader/dist/runtime/injectStylesIntoStyleTag.js */ "./node_modules/style-loader/dist/runtime/injectStylesIntoStyleTag.js");
/* harmony import */ var _style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _css_loader_dist_cjs_js_ruleSet_1_rules_7_oneOf_1_use_1_postcss_loader_dist_cjs_js_ruleSet_1_rules_7_oneOf_1_use_2_ReactToastify_css__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! !!../../css-loader/dist/cjs.js??ruleSet[1].rules[7].oneOf[1].use[1]!../../postcss-loader/dist/cjs.js??ruleSet[1].rules[7].oneOf[1].use[2]!./ReactToastify.css */ "./node_modules/css-loader/dist/cjs.js??ruleSet[1].rules[7].oneOf[1].use[1]!./node_modules/postcss-loader/dist/cjs.js??ruleSet[1].rules[7].oneOf[1].use[2]!./node_modules/react-toastify/dist/ReactToastify.css");

            

var options = {};

options.insert = "head";
options.singleton = false;

var update = _style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0___default()(_css_loader_dist_cjs_js_ruleSet_1_rules_7_oneOf_1_use_1_postcss_loader_dist_cjs_js_ruleSet_1_rules_7_oneOf_1_use_2_ReactToastify_css__WEBPACK_IMPORTED_MODULE_1__["default"], options);



/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (_css_loader_dist_cjs_js_ruleSet_1_rules_7_oneOf_1_use_1_postcss_loader_dist_cjs_js_ruleSet_1_rules_7_oneOf_1_use_2_ReactToastify_css__WEBPACK_IMPORTED_MODULE_1__["default"].locals || {});

/***/ }),

/***/ "./node_modules/style-loader/dist/runtime/injectStylesIntoStyleTag.js":
/*!****************************************************************************!*\
  !*** ./node_modules/style-loader/dist/runtime/injectStylesIntoStyleTag.js ***!
  \****************************************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";


var isOldIE = function isOldIE() {
  var memo;
  return function memorize() {
    if (typeof memo === 'undefined') {
      // Test for IE <= 9 as proposed by Browserhacks
      // @see http://browserhacks.com/#hack-e71d8692f65334173fee715c222cb805
      // Tests for existence of standard globals is to allow style-loader
      // to operate correctly into non-standard environments
      // @see https://github.com/webpack-contrib/style-loader/issues/177
      memo = Boolean(window && document && document.all && !window.atob);
    }

    return memo;
  };
}();

var getTarget = function getTarget() {
  var memo = {};
  return function memorize(target) {
    if (typeof memo[target] === 'undefined') {
      var styleTarget = document.querySelector(target); // Special case to return head of iframe instead of iframe itself

      if (window.HTMLIFrameElement && styleTarget instanceof window.HTMLIFrameElement) {
        try {
          // This will throw an exception if access to iframe is blocked
          // due to cross-origin restrictions
          styleTarget = styleTarget.contentDocument.head;
        } catch (e) {
          // istanbul ignore next
          styleTarget = null;
        }
      }

      memo[target] = styleTarget;
    }

    return memo[target];
  };
}();

var stylesInDom = [];

function getIndexByIdentifier(identifier) {
  var result = -1;

  for (var i = 0; i < stylesInDom.length; i++) {
    if (stylesInDom[i].identifier === identifier) {
      result = i;
      break;
    }
  }

  return result;
}

function modulesToDom(list, options) {
  var idCountMap = {};
  var identifiers = [];

  for (var i = 0; i < list.length; i++) {
    var item = list[i];
    var id = options.base ? item[0] + options.base : item[0];
    var count = idCountMap[id] || 0;
    var identifier = "".concat(id, " ").concat(count);
    idCountMap[id] = count + 1;
    var index = getIndexByIdentifier(identifier);
    var obj = {
      css: item[1],
      media: item[2],
      sourceMap: item[3]
    };

    if (index !== -1) {
      stylesInDom[index].references++;
      stylesInDom[index].updater(obj);
    } else {
      stylesInDom.push({
        identifier: identifier,
        updater: addStyle(obj, options),
        references: 1
      });
    }

    identifiers.push(identifier);
  }

  return identifiers;
}

function insertStyleElement(options) {
  var style = document.createElement('style');
  var attributes = options.attributes || {};

  if (typeof attributes.nonce === 'undefined') {
    var nonce =  true ? __webpack_require__.nc : 0;

    if (nonce) {
      attributes.nonce = nonce;
    }
  }

  Object.keys(attributes).forEach(function (key) {
    style.setAttribute(key, attributes[key]);
  });

  if (typeof options.insert === 'function') {
    options.insert(style);
  } else {
    var target = getTarget(options.insert || 'head');

    if (!target) {
      throw new Error("Couldn't find a style target. This probably means that the value for the 'insert' parameter is invalid.");
    }

    target.appendChild(style);
  }

  return style;
}

function removeStyleElement(style) {
  // istanbul ignore if
  if (style.parentNode === null) {
    return false;
  }

  style.parentNode.removeChild(style);
}
/* istanbul ignore next  */


var replaceText = function replaceText() {
  var textStore = [];
  return function replace(index, replacement) {
    textStore[index] = replacement;
    return textStore.filter(Boolean).join('\n');
  };
}();

function applyToSingletonTag(style, index, remove, obj) {
  var css = remove ? '' : obj.media ? "@media ".concat(obj.media, " {").concat(obj.css, "}") : obj.css; // For old IE

  /* istanbul ignore if  */

  if (style.styleSheet) {
    style.styleSheet.cssText = replaceText(index, css);
  } else {
    var cssNode = document.createTextNode(css);
    var childNodes = style.childNodes;

    if (childNodes[index]) {
      style.removeChild(childNodes[index]);
    }

    if (childNodes.length) {
      style.insertBefore(cssNode, childNodes[index]);
    } else {
      style.appendChild(cssNode);
    }
  }
}

function applyToTag(style, options, obj) {
  var css = obj.css;
  var media = obj.media;
  var sourceMap = obj.sourceMap;

  if (media) {
    style.setAttribute('media', media);
  } else {
    style.removeAttribute('media');
  }

  if (sourceMap && typeof btoa !== 'undefined') {
    css += "\n/*# sourceMappingURL=data:application/json;base64,".concat(btoa(unescape(encodeURIComponent(JSON.stringify(sourceMap)))), " */");
  } // For old IE

  /* istanbul ignore if  */


  if (style.styleSheet) {
    style.styleSheet.cssText = css;
  } else {
    while (style.firstChild) {
      style.removeChild(style.firstChild);
    }

    style.appendChild(document.createTextNode(css));
  }
}

var singleton = null;
var singletonCounter = 0;

function addStyle(obj, options) {
  var style;
  var update;
  var remove;

  if (options.singleton) {
    var styleIndex = singletonCounter++;
    style = singleton || (singleton = insertStyleElement(options));
    update = applyToSingletonTag.bind(null, style, styleIndex, false);
    remove = applyToSingletonTag.bind(null, style, styleIndex, true);
  } else {
    style = insertStyleElement(options);
    update = applyToTag.bind(null, style, options);

    remove = function remove() {
      removeStyleElement(style);
    };
  }

  update(obj);
  return function updateStyle(newObj) {
    if (newObj) {
      if (newObj.css === obj.css && newObj.media === obj.media && newObj.sourceMap === obj.sourceMap) {
        return;
      }

      update(obj = newObj);
    } else {
      remove();
    }
  };
}

module.exports = function (list, options) {
  options = options || {}; // Force single-tag solution on IE6-9, which has a hard limit on the # of <style>
  // tags it will allow on a page

  if (!options.singleton && typeof options.singleton !== 'boolean') {
    options.singleton = isOldIE();
  }

  list = list || [];
  var lastIdentifiers = modulesToDom(list, options);
  return function update(newList) {
    newList = newList || [];

    if (Object.prototype.toString.call(newList) !== '[object Array]') {
      return;
    }

    for (var i = 0; i < lastIdentifiers.length; i++) {
      var identifier = lastIdentifiers[i];
      var index = getIndexByIdentifier(identifier);
      stylesInDom[index].references--;
    }

    var newLastIdentifiers = modulesToDom(newList, options);

    for (var _i = 0; _i < lastIdentifiers.length; _i++) {
      var _identifier = lastIdentifiers[_i];

      var _index = getIndexByIdentifier(_identifier);

      if (stylesInDom[_index].references === 0) {
        stylesInDom[_index].updater();

        stylesInDom.splice(_index, 1);
      }
    }

    lastIdentifiers = newLastIdentifiers;
  };
};

/***/ }),

/***/ "./node_modules/ua-parser-js/src/ua-parser.js":
/*!****************************************************!*\
  !*** ./node_modules/ua-parser-js/src/ua-parser.js ***!
  \****************************************************/
/***/ (function(module, exports, __webpack_require__) {

var __WEBPACK_AMD_DEFINE_RESULT__;/////////////////////////////////////////////////////////////////////////////////
/* UAParser.js v0.7.35
   Copyright © 2012-2021 Faisal Salman <f@faisalman.com>
   MIT License *//*
   Detect Browser, Engine, OS, CPU, and Device type/model from User-Agent data.
   Supports browser & node.js environment. 
   Demo   : https://faisalman.github.io/ua-parser-js
   Source : https://github.com/faisalman/ua-parser-js */
/////////////////////////////////////////////////////////////////////////////////

(function (window, undefined) {

    'use strict';

    //////////////
    // Constants
    /////////////


    var LIBVERSION  = '0.7.35',
        EMPTY       = '',
        UNKNOWN     = '?',
        FUNC_TYPE   = 'function',
        UNDEF_TYPE  = 'undefined',
        OBJ_TYPE    = 'object',
        STR_TYPE    = 'string',
        MAJOR       = 'major',
        MODEL       = 'model',
        NAME        = 'name',
        TYPE        = 'type',
        VENDOR      = 'vendor',
        VERSION     = 'version',
        ARCHITECTURE= 'architecture',
        CONSOLE     = 'console',
        MOBILE      = 'mobile',
        TABLET      = 'tablet',
        SMARTTV     = 'smarttv',
        WEARABLE    = 'wearable',
        EMBEDDED    = 'embedded',
        UA_MAX_LENGTH = 350;

    var AMAZON  = 'Amazon',
        APPLE   = 'Apple',
        ASUS    = 'ASUS',
        BLACKBERRY = 'BlackBerry',
        BROWSER = 'Browser',
        CHROME  = 'Chrome',
        EDGE    = 'Edge',
        FIREFOX = 'Firefox',
        GOOGLE  = 'Google',
        HUAWEI  = 'Huawei',
        LG      = 'LG',
        MICROSOFT = 'Microsoft',
        MOTOROLA  = 'Motorola',
        OPERA   = 'Opera',
        SAMSUNG = 'Samsung',
        SHARP   = 'Sharp',
        SONY    = 'Sony',
        VIERA   = 'Viera',
        XIAOMI  = 'Xiaomi',
        ZEBRA   = 'Zebra',
        FACEBOOK    = 'Facebook',
        CHROMIUM_OS = 'Chromium OS',
        MAC_OS  = 'Mac OS';

    ///////////
    // Helper
    //////////

    var extend = function (regexes, extensions) {
            var mergedRegexes = {};
            for (var i in regexes) {
                if (extensions[i] && extensions[i].length % 2 === 0) {
                    mergedRegexes[i] = extensions[i].concat(regexes[i]);
                } else {
                    mergedRegexes[i] = regexes[i];
                }
            }
            return mergedRegexes;
        },
        enumerize = function (arr) {
            var enums = {};
            for (var i=0; i<arr.length; i++) {
                enums[arr[i].toUpperCase()] = arr[i];
            }
            return enums;
        },
        has = function (str1, str2) {
            return typeof str1 === STR_TYPE ? lowerize(str2).indexOf(lowerize(str1)) !== -1 : false;
        },
        lowerize = function (str) {
            return str.toLowerCase();
        },
        majorize = function (version) {
            return typeof(version) === STR_TYPE ? version.replace(/[^\d\.]/g, EMPTY).split('.')[0] : undefined;
        },
        trim = function (str, len) {
            if (typeof(str) === STR_TYPE) {
                str = str.replace(/^\s\s*/, EMPTY);
                return typeof(len) === UNDEF_TYPE ? str : str.substring(0, UA_MAX_LENGTH);
            }
    };

    ///////////////
    // Map helper
    //////////////

    var rgxMapper = function (ua, arrays) {

            var i = 0, j, k, p, q, matches, match;

            // loop through all regexes maps
            while (i < arrays.length && !matches) {

                var regex = arrays[i],       // even sequence (0,2,4,..)
                    props = arrays[i + 1];   // odd sequence (1,3,5,..)
                j = k = 0;

                // try matching uastring with regexes
                while (j < regex.length && !matches) {

                    if (!regex[j]) { break; }
                    matches = regex[j++].exec(ua);

                    if (!!matches) {
                        for (p = 0; p < props.length; p++) {
                            match = matches[++k];
                            q = props[p];
                            // check if given property is actually array
                            if (typeof q === OBJ_TYPE && q.length > 0) {
                                if (q.length === 2) {
                                    if (typeof q[1] == FUNC_TYPE) {
                                        // assign modified match
                                        this[q[0]] = q[1].call(this, match);
                                    } else {
                                        // assign given value, ignore regex match
                                        this[q[0]] = q[1];
                                    }
                                } else if (q.length === 3) {
                                    // check whether function or regex
                                    if (typeof q[1] === FUNC_TYPE && !(q[1].exec && q[1].test)) {
                                        // call function (usually string mapper)
                                        this[q[0]] = match ? q[1].call(this, match, q[2]) : undefined;
                                    } else {
                                        // sanitize match using given regex
                                        this[q[0]] = match ? match.replace(q[1], q[2]) : undefined;
                                    }
                                } else if (q.length === 4) {
                                        this[q[0]] = match ? q[3].call(this, match.replace(q[1], q[2])) : undefined;
                                }
                            } else {
                                this[q] = match ? match : undefined;
                            }
                        }
                    }
                }
                i += 2;
            }
        },

        strMapper = function (str, map) {

            for (var i in map) {
                // check if current value is array
                if (typeof map[i] === OBJ_TYPE && map[i].length > 0) {
                    for (var j = 0; j < map[i].length; j++) {
                        if (has(map[i][j], str)) {
                            return (i === UNKNOWN) ? undefined : i;
                        }
                    }
                } else if (has(map[i], str)) {
                    return (i === UNKNOWN) ? undefined : i;
                }
            }
            return str;
    };

    ///////////////
    // String map
    //////////////

    // Safari < 3.0
    var oldSafariMap = {
            '1.0'   : '/8',
            '1.2'   : '/1',
            '1.3'   : '/3',
            '2.0'   : '/412',
            '2.0.2' : '/416',
            '2.0.3' : '/417',
            '2.0.4' : '/419',
            '?'     : '/'
        },
        windowsVersionMap = {
            'ME'        : '4.90',
            'NT 3.11'   : 'NT3.51',
            'NT 4.0'    : 'NT4.0',
            '2000'      : 'NT 5.0',
            'XP'        : ['NT 5.1', 'NT 5.2'],
            'Vista'     : 'NT 6.0',
            '7'         : 'NT 6.1',
            '8'         : 'NT 6.2',
            '8.1'       : 'NT 6.3',
            '10'        : ['NT 6.4', 'NT 10.0'],
            'RT'        : 'ARM'
    };

    //////////////
    // Regex map
    /////////////

    var regexes = {

        browser : [[

            /\b(?:crmo|crios)\/([\w\.]+)/i                                      // Chrome for Android/iOS
            ], [VERSION, [NAME, 'Chrome']], [
            /edg(?:e|ios|a)?\/([\w\.]+)/i                                       // Microsoft Edge
            ], [VERSION, [NAME, 'Edge']], [

            // Presto based
            /(opera mini)\/([-\w\.]+)/i,                                        // Opera Mini
            /(opera [mobiletab]{3,6})\b.+version\/([-\w\.]+)/i,                 // Opera Mobi/Tablet
            /(opera)(?:.+version\/|[\/ ]+)([\w\.]+)/i                           // Opera
            ], [NAME, VERSION], [
            /opios[\/ ]+([\w\.]+)/i                                             // Opera mini on iphone >= 8.0
            ], [VERSION, [NAME, OPERA+' Mini']], [
            /\bopr\/([\w\.]+)/i                                                 // Opera Webkit
            ], [VERSION, [NAME, OPERA]], [

            // Mixed
            /(kindle)\/([\w\.]+)/i,                                             // Kindle
            /(lunascape|maxthon|netfront|jasmine|blazer)[\/ ]?([\w\.]*)/i,      // Lunascape/Maxthon/Netfront/Jasmine/Blazer
            // Trident based
            /(avant |iemobile|slim)(?:browser)?[\/ ]?([\w\.]*)/i,               // Avant/IEMobile/SlimBrowser
            /(ba?idubrowser)[\/ ]?([\w\.]+)/i,                                  // Baidu Browser
            /(?:ms|\()(ie) ([\w\.]+)/i,                                         // Internet Explorer

            // Webkit/KHTML based                                               // Flock/RockMelt/Midori/Epiphany/Silk/Skyfire/Bolt/Iron/Iridium/PhantomJS/Bowser/QupZilla/Falkon
            /(flock|rockmelt|midori|epiphany|silk|skyfire|bolt|iron|vivaldi|iridium|phantomjs|bowser|quark|qupzilla|falkon|rekonq|puffin|brave|whale(?!.+naver)|qqbrowserlite|qq|duckduckgo)\/([-\w\.]+)/i,
                                                                                // Rekonq/Puffin/Brave/Whale/QQBrowserLite/QQ, aka ShouQ
            /(heytap|ovi)browser\/([\d\.]+)/i,                                  // Heytap/Ovi
            /(weibo)__([\d\.]+)/i                                               // Weibo
            ], [NAME, VERSION], [
            /(?:\buc? ?browser|(?:juc.+)ucweb)[\/ ]?([\w\.]+)/i                 // UCBrowser
            ], [VERSION, [NAME, 'UC'+BROWSER]], [
            /microm.+\bqbcore\/([\w\.]+)/i,                                     // WeChat Desktop for Windows Built-in Browser
            /\bqbcore\/([\w\.]+).+microm/i
            ], [VERSION, [NAME, 'WeChat(Win) Desktop']], [
            /micromessenger\/([\w\.]+)/i                                        // WeChat
            ], [VERSION, [NAME, 'WeChat']], [
            /konqueror\/([\w\.]+)/i                                             // Konqueror
            ], [VERSION, [NAME, 'Konqueror']], [
            /trident.+rv[: ]([\w\.]{1,9})\b.+like gecko/i                       // IE11
            ], [VERSION, [NAME, 'IE']], [
            /ya(?:search)?browser\/([\w\.]+)/i                                  // Yandex
            ], [VERSION, [NAME, 'Yandex']], [
            /(avast|avg)\/([\w\.]+)/i                                           // Avast/AVG Secure Browser
            ], [[NAME, /(.+)/, '$1 Secure '+BROWSER], VERSION], [
            /\bfocus\/([\w\.]+)/i                                               // Firefox Focus
            ], [VERSION, [NAME, FIREFOX+' Focus']], [
            /\bopt\/([\w\.]+)/i                                                 // Opera Touch
            ], [VERSION, [NAME, OPERA+' Touch']], [
            /coc_coc\w+\/([\w\.]+)/i                                            // Coc Coc Browser
            ], [VERSION, [NAME, 'Coc Coc']], [
            /dolfin\/([\w\.]+)/i                                                // Dolphin
            ], [VERSION, [NAME, 'Dolphin']], [
            /coast\/([\w\.]+)/i                                                 // Opera Coast
            ], [VERSION, [NAME, OPERA+' Coast']], [
            /miuibrowser\/([\w\.]+)/i                                           // MIUI Browser
            ], [VERSION, [NAME, 'MIUI '+BROWSER]], [
            /fxios\/([-\w\.]+)/i                                                // Firefox for iOS
            ], [VERSION, [NAME, FIREFOX]], [
            /\bqihu|(qi?ho?o?|360)browser/i                                     // 360
            ], [[NAME, '360 '+BROWSER]], [
            /(oculus|samsung|sailfish|huawei)browser\/([\w\.]+)/i
            ], [[NAME, /(.+)/, '$1 '+BROWSER], VERSION], [                      // Oculus/Samsung/Sailfish/Huawei Browser
            /(comodo_dragon)\/([\w\.]+)/i                                       // Comodo Dragon
            ], [[NAME, /_/g, ' '], VERSION], [
            /(electron)\/([\w\.]+) safari/i,                                    // Electron-based App
            /(tesla)(?: qtcarbrowser|\/(20\d\d\.[-\w\.]+))/i,                   // Tesla
            /m?(qqbrowser|baiduboxapp|2345Explorer)[\/ ]?([\w\.]+)/i            // QQBrowser/Baidu App/2345 Browser
            ], [NAME, VERSION], [
            /(metasr)[\/ ]?([\w\.]+)/i,                                         // SouGouBrowser
            /(lbbrowser)/i,                                                     // LieBao Browser
            /\[(linkedin)app\]/i                                                // LinkedIn App for iOS & Android
            ], [NAME], [

            // WebView
            /((?:fban\/fbios|fb_iab\/fb4a)(?!.+fbav)|;fbav\/([\w\.]+);)/i       // Facebook App for iOS & Android
            ], [[NAME, FACEBOOK], VERSION], [
            /(kakao(?:talk|story))[\/ ]([\w\.]+)/i,                             // Kakao App
            /(naver)\(.*?(\d+\.[\w\.]+).*\)/i,                                  // Naver InApp
            /safari (line)\/([\w\.]+)/i,                                        // Line App for iOS
            /\b(line)\/([\w\.]+)\/iab/i,                                        // Line App for Android
            /(chromium|instagram)[\/ ]([-\w\.]+)/i                              // Chromium/Instagram
            ], [NAME, VERSION], [
            /\bgsa\/([\w\.]+) .*safari\//i                                      // Google Search Appliance on iOS
            ], [VERSION, [NAME, 'GSA']], [
            /musical_ly(?:.+app_?version\/|_)([\w\.]+)/i                        // TikTok
            ], [VERSION, [NAME, 'TikTok']], [

            /headlesschrome(?:\/([\w\.]+)| )/i                                  // Chrome Headless
            ], [VERSION, [NAME, CHROME+' Headless']], [

            / wv\).+(chrome)\/([\w\.]+)/i                                       // Chrome WebView
            ], [[NAME, CHROME+' WebView'], VERSION], [

            /droid.+ version\/([\w\.]+)\b.+(?:mobile safari|safari)/i           // Android Browser
            ], [VERSION, [NAME, 'Android '+BROWSER]], [

            /(chrome|omniweb|arora|[tizenoka]{5} ?browser)\/v?([\w\.]+)/i       // Chrome/OmniWeb/Arora/Tizen/Nokia
            ], [NAME, VERSION], [

            /version\/([\w\.\,]+) .*mobile\/\w+ (safari)/i                      // Mobile Safari
            ], [VERSION, [NAME, 'Mobile Safari']], [
            /version\/([\w(\.|\,)]+) .*(mobile ?safari|safari)/i                // Safari & Safari Mobile
            ], [VERSION, NAME], [
            /webkit.+?(mobile ?safari|safari)(\/[\w\.]+)/i                      // Safari < 3.0
            ], [NAME, [VERSION, strMapper, oldSafariMap]], [

            /(webkit|khtml)\/([\w\.]+)/i
            ], [NAME, VERSION], [

            // Gecko based
            /(navigator|netscape\d?)\/([-\w\.]+)/i                              // Netscape
            ], [[NAME, 'Netscape'], VERSION], [
            /mobile vr; rv:([\w\.]+)\).+firefox/i                               // Firefox Reality
            ], [VERSION, [NAME, FIREFOX+' Reality']], [
            /ekiohf.+(flow)\/([\w\.]+)/i,                                       // Flow
            /(swiftfox)/i,                                                      // Swiftfox
            /(icedragon|iceweasel|camino|chimera|fennec|maemo browser|minimo|conkeror|klar)[\/ ]?([\w\.\+]+)/i,
                                                                                // IceDragon/Iceweasel/Camino/Chimera/Fennec/Maemo/Minimo/Conkeror/Klar
            /(seamonkey|k-meleon|icecat|iceape|firebird|phoenix|palemoon|basilisk|waterfox)\/([-\w\.]+)$/i,
                                                                                // Firefox/SeaMonkey/K-Meleon/IceCat/IceApe/Firebird/Phoenix
            /(firefox)\/([\w\.]+)/i,                                            // Other Firefox-based
            /(mozilla)\/([\w\.]+) .+rv\:.+gecko\/\d+/i,                         // Mozilla

            // Other
            /(polaris|lynx|dillo|icab|doris|amaya|w3m|netsurf|sleipnir|obigo|mosaic|(?:go|ice|up)[\. ]?browser)[-\/ ]?v?([\w\.]+)/i,
                                                                                // Polaris/Lynx/Dillo/iCab/Doris/Amaya/w3m/NetSurf/Sleipnir/Obigo/Mosaic/Go/ICE/UP.Browser
            /(links) \(([\w\.]+)/i,                                             // Links
            /panasonic;(viera)/i                                                // Panasonic Viera
            ], [NAME, VERSION], [
            
            /(cobalt)\/([\w\.]+)/i                                              // Cobalt
            ], [NAME, [VERSION, /master.|lts./, ""]]
        ],

        cpu : [[

            /(?:(amd|x(?:(?:86|64)[-_])?|wow|win)64)[;\)]/i                     // AMD64 (x64)
            ], [[ARCHITECTURE, 'amd64']], [

            /(ia32(?=;))/i                                                      // IA32 (quicktime)
            ], [[ARCHITECTURE, lowerize]], [

            /((?:i[346]|x)86)[;\)]/i                                            // IA32 (x86)
            ], [[ARCHITECTURE, 'ia32']], [

            /\b(aarch64|arm(v?8e?l?|_?64))\b/i                                 // ARM64
            ], [[ARCHITECTURE, 'arm64']], [

            /\b(arm(?:v[67])?ht?n?[fl]p?)\b/i                                   // ARMHF
            ], [[ARCHITECTURE, 'armhf']], [

            // PocketPC mistakenly identified as PowerPC
            /windows (ce|mobile); ppc;/i
            ], [[ARCHITECTURE, 'arm']], [

            /((?:ppc|powerpc)(?:64)?)(?: mac|;|\))/i                            // PowerPC
            ], [[ARCHITECTURE, /ower/, EMPTY, lowerize]], [

            /(sun4\w)[;\)]/i                                                    // SPARC
            ], [[ARCHITECTURE, 'sparc']], [

            /((?:avr32|ia64(?=;))|68k(?=\))|\barm(?=v(?:[1-7]|[5-7]1)l?|;|eabi)|(?=atmel )avr|(?:irix|mips|sparc)(?:64)?\b|pa-risc)/i
                                                                                // IA64, 68K, ARM/64, AVR/32, IRIX/64, MIPS/64, SPARC/64, PA-RISC
            ], [[ARCHITECTURE, lowerize]]
        ],

        device : [[

            //////////////////////////
            // MOBILES & TABLETS
            /////////////////////////

            // Samsung
            /\b(sch-i[89]0\d|shw-m380s|sm-[ptx]\w{2,4}|gt-[pn]\d{2,4}|sgh-t8[56]9|nexus 10)/i
            ], [MODEL, [VENDOR, SAMSUNG], [TYPE, TABLET]], [
            /\b((?:s[cgp]h|gt|sm)-\w+|sc[g-]?[\d]+a?|galaxy nexus)/i,
            /samsung[- ]([-\w]+)/i,
            /sec-(sgh\w+)/i
            ], [MODEL, [VENDOR, SAMSUNG], [TYPE, MOBILE]], [

            // Apple
            /(?:\/|\()(ip(?:hone|od)[\w, ]*)(?:\/|;)/i                          // iPod/iPhone
            ], [MODEL, [VENDOR, APPLE], [TYPE, MOBILE]], [
            /\((ipad);[-\w\),; ]+apple/i,                                       // iPad
            /applecoremedia\/[\w\.]+ \((ipad)/i,
            /\b(ipad)\d\d?,\d\d?[;\]].+ios/i
            ], [MODEL, [VENDOR, APPLE], [TYPE, TABLET]], [
            /(macintosh);/i
            ], [MODEL, [VENDOR, APPLE]], [

            // Sharp
            /\b(sh-?[altvz]?\d\d[a-ekm]?)/i
            ], [MODEL, [VENDOR, SHARP], [TYPE, MOBILE]], [

            // Huawei
            /\b((?:ag[rs][23]?|bah2?|sht?|btv)-a?[lw]\d{2})\b(?!.+d\/s)/i
            ], [MODEL, [VENDOR, HUAWEI], [TYPE, TABLET]], [
            /(?:huawei|honor)([-\w ]+)[;\)]/i,
            /\b(nexus 6p|\w{2,4}e?-[atu]?[ln][\dx][012359c][adn]?)\b(?!.+d\/s)/i
            ], [MODEL, [VENDOR, HUAWEI], [TYPE, MOBILE]], [

            // Xiaomi
            /\b(poco[\w ]+)(?: bui|\))/i,                                       // Xiaomi POCO
            /\b; (\w+) build\/hm\1/i,                                           // Xiaomi Hongmi 'numeric' models
            /\b(hm[-_ ]?note?[_ ]?(?:\d\w)?) bui/i,                             // Xiaomi Hongmi
            /\b(redmi[\-_ ]?(?:note|k)?[\w_ ]+)(?: bui|\))/i,                   // Xiaomi Redmi
            /\b(mi[-_ ]?(?:a\d|one|one[_ ]plus|note lte|max|cc)?[_ ]?(?:\d?\w?)[_ ]?(?:plus|se|lite)?)(?: bui|\))/i // Xiaomi Mi
            ], [[MODEL, /_/g, ' '], [VENDOR, XIAOMI], [TYPE, MOBILE]], [
            /\b(mi[-_ ]?(?:pad)(?:[\w_ ]+))(?: bui|\))/i                        // Mi Pad tablets
            ],[[MODEL, /_/g, ' '], [VENDOR, XIAOMI], [TYPE, TABLET]], [

            // OPPO
            /; (\w+) bui.+ oppo/i,
            /\b(cph[12]\d{3}|p(?:af|c[al]|d\w|e[ar])[mt]\d0|x9007|a101op)\b/i
            ], [MODEL, [VENDOR, 'OPPO'], [TYPE, MOBILE]], [

            // Vivo
            /vivo (\w+)(?: bui|\))/i,
            /\b(v[12]\d{3}\w?[at])(?: bui|;)/i
            ], [MODEL, [VENDOR, 'Vivo'], [TYPE, MOBILE]], [

            // Realme
            /\b(rmx[12]\d{3})(?: bui|;|\))/i
            ], [MODEL, [VENDOR, 'Realme'], [TYPE, MOBILE]], [

            // Motorola
            /\b(milestone|droid(?:[2-4x]| (?:bionic|x2|pro|razr))?:?( 4g)?)\b[\w ]+build\//i,
            /\bmot(?:orola)?[- ](\w*)/i,
            /((?:moto[\w\(\) ]+|xt\d{3,4}|nexus 6)(?= bui|\)))/i
            ], [MODEL, [VENDOR, MOTOROLA], [TYPE, MOBILE]], [
            /\b(mz60\d|xoom[2 ]{0,2}) build\//i
            ], [MODEL, [VENDOR, MOTOROLA], [TYPE, TABLET]], [

            // LG
            /((?=lg)?[vl]k\-?\d{3}) bui| 3\.[-\w; ]{10}lg?-([06cv9]{3,4})/i
            ], [MODEL, [VENDOR, LG], [TYPE, TABLET]], [
            /(lm(?:-?f100[nv]?|-[\w\.]+)(?= bui|\))|nexus [45])/i,
            /\blg[-e;\/ ]+((?!browser|netcast|android tv)\w+)/i,
            /\blg-?([\d\w]+) bui/i
            ], [MODEL, [VENDOR, LG], [TYPE, MOBILE]], [

            // Lenovo
            /(ideatab[-\w ]+)/i,
            /lenovo ?(s[56]000[-\w]+|tab(?:[\w ]+)|yt[-\d\w]{6}|tb[-\d\w]{6})/i
            ], [MODEL, [VENDOR, 'Lenovo'], [TYPE, TABLET]], [

            // Nokia
            /(?:maemo|nokia).*(n900|lumia \d+)/i,
            /nokia[-_ ]?([-\w\.]*)/i
            ], [[MODEL, /_/g, ' '], [VENDOR, 'Nokia'], [TYPE, MOBILE]], [

            // Google
            /(pixel c)\b/i                                                      // Google Pixel C
            ], [MODEL, [VENDOR, GOOGLE], [TYPE, TABLET]], [
            /droid.+; (pixel[\daxl ]{0,6})(?: bui|\))/i                         // Google Pixel
            ], [MODEL, [VENDOR, GOOGLE], [TYPE, MOBILE]], [

            // Sony
            /droid.+ (a?\d[0-2]{2}so|[c-g]\d{4}|so[-gl]\w+|xq-a\w[4-7][12])(?= bui|\).+chrome\/(?![1-6]{0,1}\d\.))/i
            ], [MODEL, [VENDOR, SONY], [TYPE, MOBILE]], [
            /sony tablet [ps]/i,
            /\b(?:sony)?sgp\w+(?: bui|\))/i
            ], [[MODEL, 'Xperia Tablet'], [VENDOR, SONY], [TYPE, TABLET]], [

            // OnePlus
            / (kb2005|in20[12]5|be20[12][59])\b/i,
            /(?:one)?(?:plus)? (a\d0\d\d)(?: b|\))/i
            ], [MODEL, [VENDOR, 'OnePlus'], [TYPE, MOBILE]], [

            // Amazon
            /(alexa)webm/i,
            /(kf[a-z]{2}wi|aeo[c-r]{2})( bui|\))/i,                             // Kindle Fire without Silk / Echo Show
            /(kf[a-z]+)( bui|\)).+silk\//i                                      // Kindle Fire HD
            ], [MODEL, [VENDOR, AMAZON], [TYPE, TABLET]], [
            /((?:sd|kf)[0349hijorstuw]+)( bui|\)).+silk\//i                     // Fire Phone
            ], [[MODEL, /(.+)/g, 'Fire Phone $1'], [VENDOR, AMAZON], [TYPE, MOBILE]], [

            // BlackBerry
            /(playbook);[-\w\),; ]+(rim)/i                                      // BlackBerry PlayBook
            ], [MODEL, VENDOR, [TYPE, TABLET]], [
            /\b((?:bb[a-f]|st[hv])100-\d)/i,
            /\(bb10; (\w+)/i                                                    // BlackBerry 10
            ], [MODEL, [VENDOR, BLACKBERRY], [TYPE, MOBILE]], [

            // Asus
            /(?:\b|asus_)(transfo[prime ]{4,10} \w+|eeepc|slider \w+|nexus 7|padfone|p00[cj])/i
            ], [MODEL, [VENDOR, ASUS], [TYPE, TABLET]], [
            / (z[bes]6[027][012][km][ls]|zenfone \d\w?)\b/i
            ], [MODEL, [VENDOR, ASUS], [TYPE, MOBILE]], [

            // HTC
            /(nexus 9)/i                                                        // HTC Nexus 9
            ], [MODEL, [VENDOR, 'HTC'], [TYPE, TABLET]], [
            /(htc)[-;_ ]{1,2}([\w ]+(?=\)| bui)|\w+)/i,                         // HTC

            // ZTE
            /(zte)[- ]([\w ]+?)(?: bui|\/|\))/i,
            /(alcatel|geeksphone|nexian|panasonic(?!(?:;|\.))|sony(?!-bra))[-_ ]?([-\w]*)/i         // Alcatel/GeeksPhone/Nexian/Panasonic/Sony
            ], [VENDOR, [MODEL, /_/g, ' '], [TYPE, MOBILE]], [

            // Acer
            /droid.+; ([ab][1-7]-?[0178a]\d\d?)/i
            ], [MODEL, [VENDOR, 'Acer'], [TYPE, TABLET]], [

            // Meizu
            /droid.+; (m[1-5] note) bui/i,
            /\bmz-([-\w]{2,})/i
            ], [MODEL, [VENDOR, 'Meizu'], [TYPE, MOBILE]], [

            // MIXED
            /(blackberry|benq|palm(?=\-)|sonyericsson|acer|asus|dell|meizu|motorola|polytron)[-_ ]?([-\w]*)/i,
                                                                                // BlackBerry/BenQ/Palm/Sony-Ericsson/Acer/Asus/Dell/Meizu/Motorola/Polytron
            /(hp) ([\w ]+\w)/i,                                                 // HP iPAQ
            /(asus)-?(\w+)/i,                                                   // Asus
            /(microsoft); (lumia[\w ]+)/i,                                      // Microsoft Lumia
            /(lenovo)[-_ ]?([-\w]+)/i,                                          // Lenovo
            /(jolla)/i,                                                         // Jolla
            /(oppo) ?([\w ]+) bui/i                                             // OPPO
            ], [VENDOR, MODEL, [TYPE, MOBILE]], [

            /(kobo)\s(ereader|touch)/i,                                         // Kobo
            /(archos) (gamepad2?)/i,                                            // Archos
            /(hp).+(touchpad(?!.+tablet)|tablet)/i,                             // HP TouchPad
            /(kindle)\/([\w\.]+)/i,                                             // Kindle
            /(nook)[\w ]+build\/(\w+)/i,                                        // Nook
            /(dell) (strea[kpr\d ]*[\dko])/i,                                   // Dell Streak
            /(le[- ]+pan)[- ]+(\w{1,9}) bui/i,                                  // Le Pan Tablets
            /(trinity)[- ]*(t\d{3}) bui/i,                                      // Trinity Tablets
            /(gigaset)[- ]+(q\w{1,9}) bui/i,                                    // Gigaset Tablets
            /(vodafone) ([\w ]+)(?:\)| bui)/i                                   // Vodafone
            ], [VENDOR, MODEL, [TYPE, TABLET]], [

            /(surface duo)/i                                                    // Surface Duo
            ], [MODEL, [VENDOR, MICROSOFT], [TYPE, TABLET]], [
            /droid [\d\.]+; (fp\du?)(?: b|\))/i                                 // Fairphone
            ], [MODEL, [VENDOR, 'Fairphone'], [TYPE, MOBILE]], [
            /(u304aa)/i                                                         // AT&T
            ], [MODEL, [VENDOR, 'AT&T'], [TYPE, MOBILE]], [
            /\bsie-(\w*)/i                                                      // Siemens
            ], [MODEL, [VENDOR, 'Siemens'], [TYPE, MOBILE]], [
            /\b(rct\w+) b/i                                                     // RCA Tablets
            ], [MODEL, [VENDOR, 'RCA'], [TYPE, TABLET]], [
            /\b(venue[\d ]{2,7}) b/i                                            // Dell Venue Tablets
            ], [MODEL, [VENDOR, 'Dell'], [TYPE, TABLET]], [
            /\b(q(?:mv|ta)\w+) b/i                                              // Verizon Tablet
            ], [MODEL, [VENDOR, 'Verizon'], [TYPE, TABLET]], [
            /\b(?:barnes[& ]+noble |bn[rt])([\w\+ ]*) b/i                       // Barnes & Noble Tablet
            ], [MODEL, [VENDOR, 'Barnes & Noble'], [TYPE, TABLET]], [
            /\b(tm\d{3}\w+) b/i
            ], [MODEL, [VENDOR, 'NuVision'], [TYPE, TABLET]], [
            /\b(k88) b/i                                                        // ZTE K Series Tablet
            ], [MODEL, [VENDOR, 'ZTE'], [TYPE, TABLET]], [
            /\b(nx\d{3}j) b/i                                                   // ZTE Nubia
            ], [MODEL, [VENDOR, 'ZTE'], [TYPE, MOBILE]], [
            /\b(gen\d{3}) b.+49h/i                                              // Swiss GEN Mobile
            ], [MODEL, [VENDOR, 'Swiss'], [TYPE, MOBILE]], [
            /\b(zur\d{3}) b/i                                                   // Swiss ZUR Tablet
            ], [MODEL, [VENDOR, 'Swiss'], [TYPE, TABLET]], [
            /\b((zeki)?tb.*\b) b/i                                              // Zeki Tablets
            ], [MODEL, [VENDOR, 'Zeki'], [TYPE, TABLET]], [
            /\b([yr]\d{2}) b/i,
            /\b(dragon[- ]+touch |dt)(\w{5}) b/i                                // Dragon Touch Tablet
            ], [[VENDOR, 'Dragon Touch'], MODEL, [TYPE, TABLET]], [
            /\b(ns-?\w{0,9}) b/i                                                // Insignia Tablets
            ], [MODEL, [VENDOR, 'Insignia'], [TYPE, TABLET]], [
            /\b((nxa|next)-?\w{0,9}) b/i                                        // NextBook Tablets
            ], [MODEL, [VENDOR, 'NextBook'], [TYPE, TABLET]], [
            /\b(xtreme\_)?(v(1[045]|2[015]|[3469]0|7[05])) b/i                  // Voice Xtreme Phones
            ], [[VENDOR, 'Voice'], MODEL, [TYPE, MOBILE]], [
            /\b(lvtel\-)?(v1[12]) b/i                                           // LvTel Phones
            ], [[VENDOR, 'LvTel'], MODEL, [TYPE, MOBILE]], [
            /\b(ph-1) /i                                                        // Essential PH-1
            ], [MODEL, [VENDOR, 'Essential'], [TYPE, MOBILE]], [
            /\b(v(100md|700na|7011|917g).*\b) b/i                               // Envizen Tablets
            ], [MODEL, [VENDOR, 'Envizen'], [TYPE, TABLET]], [
            /\b(trio[-\w\. ]+) b/i                                              // MachSpeed Tablets
            ], [MODEL, [VENDOR, 'MachSpeed'], [TYPE, TABLET]], [
            /\btu_(1491) b/i                                                    // Rotor Tablets
            ], [MODEL, [VENDOR, 'Rotor'], [TYPE, TABLET]], [
            /(shield[\w ]+) b/i                                                 // Nvidia Shield Tablets
            ], [MODEL, [VENDOR, 'Nvidia'], [TYPE, TABLET]], [
            /(sprint) (\w+)/i                                                   // Sprint Phones
            ], [VENDOR, MODEL, [TYPE, MOBILE]], [
            /(kin\.[onetw]{3})/i                                                // Microsoft Kin
            ], [[MODEL, /\./g, ' '], [VENDOR, MICROSOFT], [TYPE, MOBILE]], [
            /droid.+; (cc6666?|et5[16]|mc[239][23]x?|vc8[03]x?)\)/i             // Zebra
            ], [MODEL, [VENDOR, ZEBRA], [TYPE, TABLET]], [
            /droid.+; (ec30|ps20|tc[2-8]\d[kx])\)/i
            ], [MODEL, [VENDOR, ZEBRA], [TYPE, MOBILE]], [

            ///////////////////
            // SMARTTVS
            ///////////////////

            /smart-tv.+(samsung)/i                                              // Samsung
            ], [VENDOR, [TYPE, SMARTTV]], [
            /hbbtv.+maple;(\d+)/i
            ], [[MODEL, /^/, 'SmartTV'], [VENDOR, SAMSUNG], [TYPE, SMARTTV]], [
            /(nux; netcast.+smarttv|lg (netcast\.tv-201\d|android tv))/i        // LG SmartTV
            ], [[VENDOR, LG], [TYPE, SMARTTV]], [
            /(apple) ?tv/i                                                      // Apple TV
            ], [VENDOR, [MODEL, APPLE+' TV'], [TYPE, SMARTTV]], [
            /crkey/i                                                            // Google Chromecast
            ], [[MODEL, CHROME+'cast'], [VENDOR, GOOGLE], [TYPE, SMARTTV]], [
            /droid.+aft(\w)( bui|\))/i                                          // Fire TV
            ], [MODEL, [VENDOR, AMAZON], [TYPE, SMARTTV]], [
            /\(dtv[\);].+(aquos)/i,
            /(aquos-tv[\w ]+)\)/i                                               // Sharp
            ], [MODEL, [VENDOR, SHARP], [TYPE, SMARTTV]],[
            /(bravia[\w ]+)( bui|\))/i                                              // Sony
            ], [MODEL, [VENDOR, SONY], [TYPE, SMARTTV]], [
            /(mitv-\w{5}) bui/i                                                 // Xiaomi
            ], [MODEL, [VENDOR, XIAOMI], [TYPE, SMARTTV]], [
            /Hbbtv.*(technisat) (.*);/i                                         // TechniSAT
            ], [VENDOR, MODEL, [TYPE, SMARTTV]], [
            /\b(roku)[\dx]*[\)\/]((?:dvp-)?[\d\.]*)/i,                          // Roku
            /hbbtv\/\d+\.\d+\.\d+ +\([\w\+ ]*; *([\w\d][^;]*);([^;]*)/i         // HbbTV devices
            ], [[VENDOR, trim], [MODEL, trim], [TYPE, SMARTTV]], [
            /\b(android tv|smart[- ]?tv|opera tv|tv; rv:)\b/i                   // SmartTV from Unidentified Vendors
            ], [[TYPE, SMARTTV]], [

            ///////////////////
            // CONSOLES
            ///////////////////

            /(ouya)/i,                                                          // Ouya
            /(nintendo) ([wids3utch]+)/i                                        // Nintendo
            ], [VENDOR, MODEL, [TYPE, CONSOLE]], [
            /droid.+; (shield) bui/i                                            // Nvidia
            ], [MODEL, [VENDOR, 'Nvidia'], [TYPE, CONSOLE]], [
            /(playstation [345portablevi]+)/i                                   // Playstation
            ], [MODEL, [VENDOR, SONY], [TYPE, CONSOLE]], [
            /\b(xbox(?: one)?(?!; xbox))[\); ]/i                                // Microsoft Xbox
            ], [MODEL, [VENDOR, MICROSOFT], [TYPE, CONSOLE]], [

            ///////////////////
            // WEARABLES
            ///////////////////

            /((pebble))app/i                                                    // Pebble
            ], [VENDOR, MODEL, [TYPE, WEARABLE]], [
            /(watch)(?: ?os[,\/]|\d,\d\/)[\d\.]+/i                              // Apple Watch
            ], [MODEL, [VENDOR, APPLE], [TYPE, WEARABLE]], [
            /droid.+; (glass) \d/i                                              // Google Glass
            ], [MODEL, [VENDOR, GOOGLE], [TYPE, WEARABLE]], [
            /droid.+; (wt63?0{2,3})\)/i
            ], [MODEL, [VENDOR, ZEBRA], [TYPE, WEARABLE]], [
            /(quest( 2| pro)?)/i                                                // Oculus Quest
            ], [MODEL, [VENDOR, FACEBOOK], [TYPE, WEARABLE]], [

            ///////////////////
            // EMBEDDED
            ///////////////////

            /(tesla)(?: qtcarbrowser|\/[-\w\.]+)/i                              // Tesla
            ], [VENDOR, [TYPE, EMBEDDED]], [
            /(aeobc)\b/i                                                        // Echo Dot
            ], [MODEL, [VENDOR, AMAZON], [TYPE, EMBEDDED]], [

            ////////////////////
            // MIXED (GENERIC)
            ///////////////////

            /droid .+?; ([^;]+?)(?: bui|\) applew).+? mobile safari/i           // Android Phones from Unidentified Vendors
            ], [MODEL, [TYPE, MOBILE]], [
            /droid .+?; ([^;]+?)(?: bui|\) applew).+?(?! mobile) safari/i       // Android Tablets from Unidentified Vendors
            ], [MODEL, [TYPE, TABLET]], [
            /\b((tablet|tab)[;\/]|focus\/\d(?!.+mobile))/i                      // Unidentifiable Tablet
            ], [[TYPE, TABLET]], [
            /(phone|mobile(?:[;\/]| [ \w\/\.]*safari)|pda(?=.+windows ce))/i    // Unidentifiable Mobile
            ], [[TYPE, MOBILE]], [
            /(android[-\w\. ]{0,9});.+buil/i                                    // Generic Android Device
            ], [MODEL, [VENDOR, 'Generic']]
        ],

        engine : [[

            /windows.+ edge\/([\w\.]+)/i                                       // EdgeHTML
            ], [VERSION, [NAME, EDGE+'HTML']], [

            /webkit\/537\.36.+chrome\/(?!27)([\w\.]+)/i                         // Blink
            ], [VERSION, [NAME, 'Blink']], [

            /(presto)\/([\w\.]+)/i,                                             // Presto
            /(webkit|trident|netfront|netsurf|amaya|lynx|w3m|goanna)\/([\w\.]+)/i, // WebKit/Trident/NetFront/NetSurf/Amaya/Lynx/w3m/Goanna
            /ekioh(flow)\/([\w\.]+)/i,                                          // Flow
            /(khtml|tasman|links)[\/ ]\(?([\w\.]+)/i,                           // KHTML/Tasman/Links
            /(icab)[\/ ]([23]\.[\d\.]+)/i,                                      // iCab
            /\b(libweb)/i
            ], [NAME, VERSION], [

            /rv\:([\w\.]{1,9})\b.+(gecko)/i                                     // Gecko
            ], [VERSION, NAME]
        ],

        os : [[

            // Windows
            /microsoft (windows) (vista|xp)/i                                   // Windows (iTunes)
            ], [NAME, VERSION], [
            /(windows) nt 6\.2; (arm)/i,                                        // Windows RT
            /(windows (?:phone(?: os)?|mobile))[\/ ]?([\d\.\w ]*)/i,            // Windows Phone
            /(windows)[\/ ]?([ntce\d\. ]+\w)(?!.+xbox)/i
            ], [NAME, [VERSION, strMapper, windowsVersionMap]], [
            /(win(?=3|9|n)|win 9x )([nt\d\.]+)/i
            ], [[NAME, 'Windows'], [VERSION, strMapper, windowsVersionMap]], [

            // iOS/macOS
            /ip[honead]{2,4}\b(?:.*os ([\w]+) like mac|; opera)/i,              // iOS
            /ios;fbsv\/([\d\.]+)/i,
            /cfnetwork\/.+darwin/i
            ], [[VERSION, /_/g, '.'], [NAME, 'iOS']], [
            /(mac os x) ?([\w\. ]*)/i,
            /(macintosh|mac_powerpc\b)(?!.+haiku)/i                             // Mac OS
            ], [[NAME, MAC_OS], [VERSION, /_/g, '.']], [

            // Mobile OSes
            /droid ([\w\.]+)\b.+(android[- ]x86|harmonyos)/i                    // Android-x86/HarmonyOS
            ], [VERSION, NAME], [                                               // Android/WebOS/QNX/Bada/RIM/Maemo/MeeGo/Sailfish OS
            /(android|webos|qnx|bada|rim tablet os|maemo|meego|sailfish)[-\/ ]?([\w\.]*)/i,
            /(blackberry)\w*\/([\w\.]*)/i,                                      // Blackberry
            /(tizen|kaios)[\/ ]([\w\.]+)/i,                                     // Tizen/KaiOS
            /\((series40);/i                                                    // Series 40
            ], [NAME, VERSION], [
            /\(bb(10);/i                                                        // BlackBerry 10
            ], [VERSION, [NAME, BLACKBERRY]], [
            /(?:symbian ?os|symbos|s60(?=;)|series60)[-\/ ]?([\w\.]*)/i         // Symbian
            ], [VERSION, [NAME, 'Symbian']], [
            /mozilla\/[\d\.]+ \((?:mobile|tablet|tv|mobile; [\w ]+); rv:.+ gecko\/([\w\.]+)/i // Firefox OS
            ], [VERSION, [NAME, FIREFOX+' OS']], [
            /web0s;.+rt(tv)/i,
            /\b(?:hp)?wos(?:browser)?\/([\w\.]+)/i                              // WebOS
            ], [VERSION, [NAME, 'webOS']], [
            /watch(?: ?os[,\/]|\d,\d\/)([\d\.]+)/i                              // watchOS
            ], [VERSION, [NAME, 'watchOS']], [

            // Google Chromecast
            /crkey\/([\d\.]+)/i                                                 // Google Chromecast
            ], [VERSION, [NAME, CHROME+'cast']], [
            /(cros) [\w]+(?:\)| ([\w\.]+)\b)/i                                  // Chromium OS
            ], [[NAME, CHROMIUM_OS], VERSION],[

            // Smart TVs
            /panasonic;(viera)/i,                                               // Panasonic Viera
            /(netrange)mmh/i,                                                   // Netrange
            /(nettv)\/(\d+\.[\w\.]+)/i,                                         // NetTV

            // Console
            /(nintendo|playstation) ([wids345portablevuch]+)/i,                 // Nintendo/Playstation
            /(xbox); +xbox ([^\);]+)/i,                                         // Microsoft Xbox (360, One, X, S, Series X, Series S)

            // Other
            /\b(joli|palm)\b ?(?:os)?\/?([\w\.]*)/i,                            // Joli/Palm
            /(mint)[\/\(\) ]?(\w*)/i,                                           // Mint
            /(mageia|vectorlinux)[; ]/i,                                        // Mageia/VectorLinux
            /([kxln]?ubuntu|debian|suse|opensuse|gentoo|arch(?= linux)|slackware|fedora|mandriva|centos|pclinuxos|red ?hat|zenwalk|linpus|raspbian|plan 9|minix|risc os|contiki|deepin|manjaro|elementary os|sabayon|linspire)(?: gnu\/linux)?(?: enterprise)?(?:[- ]linux)?(?:-gnu)?[-\/ ]?(?!chrom|package)([-\w\.]*)/i,
                                                                                // Ubuntu/Debian/SUSE/Gentoo/Arch/Slackware/Fedora/Mandriva/CentOS/PCLinuxOS/RedHat/Zenwalk/Linpus/Raspbian/Plan9/Minix/RISCOS/Contiki/Deepin/Manjaro/elementary/Sabayon/Linspire
            /(hurd|linux) ?([\w\.]*)/i,                                         // Hurd/Linux
            /(gnu) ?([\w\.]*)/i,                                                // GNU
            /\b([-frentopcghs]{0,5}bsd|dragonfly)[\/ ]?(?!amd|[ix346]{1,2}86)([\w\.]*)/i, // FreeBSD/NetBSD/OpenBSD/PC-BSD/GhostBSD/DragonFly
            /(haiku) (\w+)/i                                                    // Haiku
            ], [NAME, VERSION], [
            /(sunos) ?([\w\.\d]*)/i                                             // Solaris
            ], [[NAME, 'Solaris'], VERSION], [
            /((?:open)?solaris)[-\/ ]?([\w\.]*)/i,                              // Solaris
            /(aix) ((\d)(?=\.|\)| )[\w\.])*/i,                                  // AIX
            /\b(beos|os\/2|amigaos|morphos|openvms|fuchsia|hp-ux|serenityos)/i, // BeOS/OS2/AmigaOS/MorphOS/OpenVMS/Fuchsia/HP-UX/SerenityOS
            /(unix) ?([\w\.]*)/i                                                // UNIX
            ], [NAME, VERSION]
        ]
    };

    /////////////////
    // Constructor
    ////////////////

    var UAParser = function (ua, extensions) {

        if (typeof ua === OBJ_TYPE) {
            extensions = ua;
            ua = undefined;
        }

        if (!(this instanceof UAParser)) {
            return new UAParser(ua, extensions).getResult();
        }

        var _navigator = (typeof window !== UNDEF_TYPE && window.navigator) ? window.navigator : undefined;
        var _ua = ua || ((_navigator && _navigator.userAgent) ? _navigator.userAgent : EMPTY);
        var _uach = (_navigator && _navigator.userAgentData) ? _navigator.userAgentData : undefined;
        var _rgxmap = extensions ? extend(regexes, extensions) : regexes;
        var _isSelfNav = _navigator && _navigator.userAgent == _ua;

        this.getBrowser = function () {
            var _browser = {};
            _browser[NAME] = undefined;
            _browser[VERSION] = undefined;
            rgxMapper.call(_browser, _ua, _rgxmap.browser);
            _browser[MAJOR] = majorize(_browser[VERSION]);
            // Brave-specific detection
            if (_isSelfNav && _navigator && _navigator.brave && typeof _navigator.brave.isBrave == FUNC_TYPE) {
                _browser[NAME] = 'Brave';
            }
            return _browser;
        };
        this.getCPU = function () {
            var _cpu = {};
            _cpu[ARCHITECTURE] = undefined;
            rgxMapper.call(_cpu, _ua, _rgxmap.cpu);
            return _cpu;
        };
        this.getDevice = function () {
            var _device = {};
            _device[VENDOR] = undefined;
            _device[MODEL] = undefined;
            _device[TYPE] = undefined;
            rgxMapper.call(_device, _ua, _rgxmap.device);
            if (_isSelfNav && !_device[TYPE] && _uach && _uach.mobile) {
                _device[TYPE] = MOBILE;
            }
            // iPadOS-specific detection: identified as Mac, but has some iOS-only properties
            if (_isSelfNav && _device[MODEL] == 'Macintosh' && _navigator && typeof _navigator.standalone !== UNDEF_TYPE && _navigator.maxTouchPoints && _navigator.maxTouchPoints > 2) {
                _device[MODEL] = 'iPad';
                _device[TYPE] = TABLET;
            }
            return _device;
        };
        this.getEngine = function () {
            var _engine = {};
            _engine[NAME] = undefined;
            _engine[VERSION] = undefined;
            rgxMapper.call(_engine, _ua, _rgxmap.engine);
            return _engine;
        };
        this.getOS = function () {
            var _os = {};
            _os[NAME] = undefined;
            _os[VERSION] = undefined;
            rgxMapper.call(_os, _ua, _rgxmap.os);
            if (_isSelfNav && !_os[NAME] && _uach && _uach.platform != 'Unknown') {
                _os[NAME] = _uach.platform  
                                    .replace(/chrome os/i, CHROMIUM_OS)
                                    .replace(/macos/i, MAC_OS);           // backward compatibility
            }
            return _os;
        };
        this.getResult = function () {
            return {
                ua      : this.getUA(),
                browser : this.getBrowser(),
                engine  : this.getEngine(),
                os      : this.getOS(),
                device  : this.getDevice(),
                cpu     : this.getCPU()
            };
        };
        this.getUA = function () {
            return _ua;
        };
        this.setUA = function (ua) {
            _ua = (typeof ua === STR_TYPE && ua.length > UA_MAX_LENGTH) ? trim(ua, UA_MAX_LENGTH) : ua;
            return this;
        };
        this.setUA(_ua);
        return this;
    };

    UAParser.VERSION = LIBVERSION;
    UAParser.BROWSER =  enumerize([NAME, VERSION, MAJOR]);
    UAParser.CPU = enumerize([ARCHITECTURE]);
    UAParser.DEVICE = enumerize([MODEL, VENDOR, TYPE, CONSOLE, MOBILE, SMARTTV, TABLET, WEARABLE, EMBEDDED]);
    UAParser.ENGINE = UAParser.OS = enumerize([NAME, VERSION]);

    ///////////
    // Export
    //////////

    // check js environment
    if (typeof(exports) !== UNDEF_TYPE) {
        // nodejs env
        if ("object" !== UNDEF_TYPE && module.exports) {
            exports = module.exports = UAParser;
        }
        exports.UAParser = UAParser;
    } else {
        // requirejs env (optional)
        if ("function" === FUNC_TYPE && __webpack_require__.amdO) {
            !(__WEBPACK_AMD_DEFINE_RESULT__ = (function () {
                return UAParser;
            }).call(exports, __webpack_require__, exports, module),
		__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));
        } else if (typeof window !== UNDEF_TYPE) {
            // browser env
            window.UAParser = UAParser;
        }
    }

    // jQuery/Zepto specific (optional)
    // Note:
    //   In AMD env the global scope should be kept clean, but jQuery is an exception.
    //   jQuery always exports to global scope, unless jQuery.noConflict(true) is used,
    //   and we should catch that.
    var $ = typeof window !== UNDEF_TYPE && (window.jQuery || window.Zepto);
    if ($ && !$.ua) {
        var parser = new UAParser();
        $.ua = parser.getResult();
        $.ua.get = function () {
            return parser.getUA();
        };
        $.ua.set = function (ua) {
            parser.setUA(ua);
            var result = parser.getResult();
            for (var prop in result) {
                $.ua[prop] = result[prop];
            }
        };
    }

})(typeof window === 'object' ? window : this);


/***/ }),

/***/ "./node_modules/react-toastify/dist/react-toastify.esm.mjs":
/*!*****************************************************************!*\
  !*** ./node_modules/react-toastify/dist/react-toastify.esm.mjs ***!
  \*****************************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   Bounce: () => (/* binding */ R),
/* harmony export */   Flip: () => (/* binding */ $),
/* harmony export */   Icons: () => (/* binding */ E),
/* harmony export */   Slide: () => (/* binding */ w),
/* harmony export */   ToastContainer: () => (/* binding */ k),
/* harmony export */   Zoom: () => (/* binding */ x),
/* harmony export */   collapseToast: () => (/* binding */ g),
/* harmony export */   cssTransition: () => (/* binding */ h),
/* harmony export */   toast: () => (/* binding */ Q),
/* harmony export */   useToast: () => (/* binding */ _),
/* harmony export */   useToastContainer: () => (/* binding */ C)
/* harmony export */ });
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "./node_modules/react/index.js");
/* harmony import */ var clsx__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! clsx */ "./node_modules/react-toastify/node_modules/clsx/dist/clsx.m.js");
'use client';
const u=t=>"number"==typeof t&&!isNaN(t),d=t=>"string"==typeof t,p=t=>"function"==typeof t,m=t=>d(t)||p(t)?t:null,f=t=>(0,react__WEBPACK_IMPORTED_MODULE_0__.isValidElement)(t)||d(t)||p(t)||u(t);function g(t,e,n){void 0===n&&(n=300);const{scrollHeight:o,style:s}=t;requestAnimationFrame(()=>{s.minHeight="initial",s.height=o+"px",s.transition=`all ${n}ms`,requestAnimationFrame(()=>{s.height="0",s.padding="0",s.margin="0",setTimeout(e,n)})})}function h(e){let{enter:a,exit:r,appendPosition:i=!1,collapse:l=!0,collapseDuration:c=300}=e;return function(e){let{children:u,position:d,preventExitTransition:p,done:m,nodeRef:f,isIn:h}=e;const y=i?`${a}--${d}`:a,v=i?`${r}--${d}`:r,T=(0,react__WEBPACK_IMPORTED_MODULE_0__.useRef)(0);return (0,react__WEBPACK_IMPORTED_MODULE_0__.useLayoutEffect)(()=>{const t=f.current,e=y.split(" "),n=o=>{o.target===f.current&&(t.dispatchEvent(new Event("d")),t.removeEventListener("animationend",n),t.removeEventListener("animationcancel",n),0===T.current&&"animationcancel"!==o.type&&t.classList.remove(...e))};t.classList.add(...e),t.addEventListener("animationend",n),t.addEventListener("animationcancel",n)},[]),(0,react__WEBPACK_IMPORTED_MODULE_0__.useEffect)(()=>{const t=f.current,e=()=>{t.removeEventListener("animationend",e),l?g(t,m,c):m()};h||(p?e():(T.current=1,t.className+=` ${v}`,t.addEventListener("animationend",e)))},[h]),react__WEBPACK_IMPORTED_MODULE_0__.createElement(react__WEBPACK_IMPORTED_MODULE_0__.Fragment,null,u)}}function y(t,e){return null!=t?{content:t.content,containerId:t.props.containerId,id:t.props.toastId,theme:t.props.theme,type:t.props.type,data:t.props.data||{},isLoading:t.props.isLoading,icon:t.props.icon,status:e}:{}}const v={list:new Map,emitQueue:new Map,on(t,e){return this.list.has(t)||this.list.set(t,[]),this.list.get(t).push(e),this},off(t,e){if(e){const n=this.list.get(t).filter(t=>t!==e);return this.list.set(t,n),this}return this.list.delete(t),this},cancelEmit(t){const e=this.emitQueue.get(t);return e&&(e.forEach(clearTimeout),this.emitQueue.delete(t)),this},emit(t){this.list.has(t)&&this.list.get(t).forEach(e=>{const n=setTimeout(()=>{e(...[].slice.call(arguments,1))},0);this.emitQueue.has(t)||this.emitQueue.set(t,[]),this.emitQueue.get(t).push(n)})}},T=e=>{let{theme:n,type:o,...s}=e;return react__WEBPACK_IMPORTED_MODULE_0__.createElement("svg",{viewBox:"0 0 24 24",width:"100%",height:"100%",fill:"colored"===n?"currentColor":`var(--toastify-icon-color-${o})`,...s})},E={info:function(e){return react__WEBPACK_IMPORTED_MODULE_0__.createElement(T,{...e},react__WEBPACK_IMPORTED_MODULE_0__.createElement("path",{d:"M12 0a12 12 0 1012 12A12.013 12.013 0 0012 0zm.25 5a1.5 1.5 0 11-1.5 1.5 1.5 1.5 0 011.5-1.5zm2.25 13.5h-4a1 1 0 010-2h.75a.25.25 0 00.25-.25v-4.5a.25.25 0 00-.25-.25h-.75a1 1 0 010-2h1a2 2 0 012 2v4.75a.25.25 0 00.25.25h.75a1 1 0 110 2z"}))},warning:function(e){return react__WEBPACK_IMPORTED_MODULE_0__.createElement(T,{...e},react__WEBPACK_IMPORTED_MODULE_0__.createElement("path",{d:"M23.32 17.191L15.438 2.184C14.728.833 13.416 0 11.996 0c-1.42 0-2.733.833-3.443 2.184L.533 17.448a4.744 4.744 0 000 4.368C1.243 23.167 2.555 24 3.975 24h16.05C22.22 24 24 22.044 24 19.632c0-.904-.251-1.746-.68-2.44zm-9.622 1.46c0 1.033-.724 1.823-1.698 1.823s-1.698-.79-1.698-1.822v-.043c0-1.028.724-1.822 1.698-1.822s1.698.79 1.698 1.822v.043zm.039-12.285l-.84 8.06c-.057.581-.408.943-.897.943-.49 0-.84-.367-.896-.942l-.84-8.065c-.057-.624.25-1.095.779-1.095h1.91c.528.005.84.476.784 1.1z"}))},success:function(e){return react__WEBPACK_IMPORTED_MODULE_0__.createElement(T,{...e},react__WEBPACK_IMPORTED_MODULE_0__.createElement("path",{d:"M12 0a12 12 0 1012 12A12.014 12.014 0 0012 0zm6.927 8.2l-6.845 9.289a1.011 1.011 0 01-1.43.188l-4.888-3.908a1 1 0 111.25-1.562l4.076 3.261 6.227-8.451a1 1 0 111.61 1.183z"}))},error:function(e){return react__WEBPACK_IMPORTED_MODULE_0__.createElement(T,{...e},react__WEBPACK_IMPORTED_MODULE_0__.createElement("path",{d:"M11.983 0a12.206 12.206 0 00-8.51 3.653A11.8 11.8 0 000 12.207 11.779 11.779 0 0011.8 24h.214A12.111 12.111 0 0024 11.791 11.766 11.766 0 0011.983 0zM10.5 16.542a1.476 1.476 0 011.449-1.53h.027a1.527 1.527 0 011.523 1.47 1.475 1.475 0 01-1.449 1.53h-.027a1.529 1.529 0 01-1.523-1.47zM11 12.5v-6a1 1 0 012 0v6a1 1 0 11-2 0z"}))},spinner:function(){return react__WEBPACK_IMPORTED_MODULE_0__.createElement("div",{className:"Toastify__spinner"})}};function C(t){const[,o]=(0,react__WEBPACK_IMPORTED_MODULE_0__.useReducer)(t=>t+1,0),[l,c]=(0,react__WEBPACK_IMPORTED_MODULE_0__.useState)([]),g=(0,react__WEBPACK_IMPORTED_MODULE_0__.useRef)(null),h=(0,react__WEBPACK_IMPORTED_MODULE_0__.useRef)(new Map).current,T=t=>-1!==l.indexOf(t),C=(0,react__WEBPACK_IMPORTED_MODULE_0__.useRef)({toastKey:1,displayedToast:0,count:0,queue:[],props:t,containerId:null,isToastActive:T,getToast:t=>h.get(t)}).current;function b(t){let{containerId:e}=t;const{limit:n}=C.props;!n||e&&C.containerId!==e||(C.count-=C.queue.length,C.queue=[])}function I(t){c(e=>null==t?[]:e.filter(e=>e!==t))}function _(){const{toastContent:t,toastProps:e,staleId:n}=C.queue.shift();O(t,e,n)}function L(t,n){let{delay:s,staleId:r,...i}=n;if(!f(t)||function(t){return!g.current||C.props.enableMultiContainer&&t.containerId!==C.props.containerId||h.has(t.toastId)&&null==t.updateId}(i))return;const{toastId:l,updateId:c,data:T}=i,{props:b}=C,L=()=>I(l),N=null==c;N&&C.count++;const M={...b,style:b.toastStyle,key:C.toastKey++,...Object.fromEntries(Object.entries(i).filter(t=>{let[e,n]=t;return null!=n})),toastId:l,updateId:c,data:T,closeToast:L,isIn:!1,className:m(i.className||b.toastClassName),bodyClassName:m(i.bodyClassName||b.bodyClassName),progressClassName:m(i.progressClassName||b.progressClassName),autoClose:!i.isLoading&&(R=i.autoClose,w=b.autoClose,!1===R||u(R)&&R>0?R:w),deleteToast(){const t=y(h.get(l),"removed");h.delete(l),v.emit(4,t);const e=C.queue.length;if(C.count=null==l?C.count-C.displayedToast:C.count-1,C.count<0&&(C.count=0),e>0){const t=null==l?C.props.limit:1;if(1===e||1===t)C.displayedToast++,_();else{const n=t>e?e:t;C.displayedToast=n;for(let t=0;t<n;t++)_()}}else o()}};var R,w;M.iconOut=function(t){let{theme:n,type:o,isLoading:s,icon:r}=t,i=null;const l={theme:n,type:o};return!1===r||(p(r)?i=r(l):(0,react__WEBPACK_IMPORTED_MODULE_0__.isValidElement)(r)?i=(0,react__WEBPACK_IMPORTED_MODULE_0__.cloneElement)(r,l):d(r)||u(r)?i=r:s?i=E.spinner():(t=>t in E)(o)&&(i=E[o](l))),i}(M),p(i.onOpen)&&(M.onOpen=i.onOpen),p(i.onClose)&&(M.onClose=i.onClose),M.closeButton=b.closeButton,!1===i.closeButton||f(i.closeButton)?M.closeButton=i.closeButton:!0===i.closeButton&&(M.closeButton=!f(b.closeButton)||b.closeButton);let x=t;(0,react__WEBPACK_IMPORTED_MODULE_0__.isValidElement)(t)&&!d(t.type)?x=(0,react__WEBPACK_IMPORTED_MODULE_0__.cloneElement)(t,{closeToast:L,toastProps:M,data:T}):p(t)&&(x=t({closeToast:L,toastProps:M,data:T})),b.limit&&b.limit>0&&C.count>b.limit&&N?C.queue.push({toastContent:x,toastProps:M,staleId:r}):u(s)?setTimeout(()=>{O(x,M,r)},s):O(x,M,r)}function O(t,e,n){const{toastId:o}=e;n&&h.delete(n);const s={content:t,props:e};h.set(o,s),c(t=>[...t,o].filter(t=>t!==n)),v.emit(4,y(s,null==s.props.updateId?"added":"updated"))}return (0,react__WEBPACK_IMPORTED_MODULE_0__.useEffect)(()=>(C.containerId=t.containerId,v.cancelEmit(3).on(0,L).on(1,t=>g.current&&I(t)).on(5,b).emit(2,C),()=>{h.clear(),v.emit(3,C)}),[]),(0,react__WEBPACK_IMPORTED_MODULE_0__.useEffect)(()=>{C.props=t,C.isToastActive=T,C.displayedToast=l.length}),{getToastToRender:function(e){const n=new Map,o=Array.from(h.values());return t.newestOnTop&&o.reverse(),o.forEach(t=>{const{position:e}=t.props;n.has(e)||n.set(e,[]),n.get(e).push(t)}),Array.from(n,t=>e(t[0],t[1]))},containerRef:g,isToastActive:T}}function b(t){return t.targetTouches&&t.targetTouches.length>=1?t.targetTouches[0].clientX:t.clientX}function I(t){return t.targetTouches&&t.targetTouches.length>=1?t.targetTouches[0].clientY:t.clientY}function _(t){const[o,a]=(0,react__WEBPACK_IMPORTED_MODULE_0__.useState)(!1),[r,l]=(0,react__WEBPACK_IMPORTED_MODULE_0__.useState)(!1),c=(0,react__WEBPACK_IMPORTED_MODULE_0__.useRef)(null),u=(0,react__WEBPACK_IMPORTED_MODULE_0__.useRef)({start:0,x:0,y:0,delta:0,removalDistance:0,canCloseOnClick:!0,canDrag:!1,boundingRect:null,didMove:!1}).current,d=(0,react__WEBPACK_IMPORTED_MODULE_0__.useRef)(t),{autoClose:m,pauseOnHover:f,closeToast:g,onClick:h,closeOnClick:y}=t;function v(e){if(t.draggable){"touchstart"===e.nativeEvent.type&&e.nativeEvent.preventDefault(),u.didMove=!1,document.addEventListener("mousemove",_),document.addEventListener("mouseup",L),document.addEventListener("touchmove",_),document.addEventListener("touchend",L);const n=c.current;u.canCloseOnClick=!0,u.canDrag=!0,u.boundingRect=n.getBoundingClientRect(),n.style.transition="",u.x=b(e.nativeEvent),u.y=I(e.nativeEvent),"x"===t.draggableDirection?(u.start=u.x,u.removalDistance=n.offsetWidth*(t.draggablePercent/100)):(u.start=u.y,u.removalDistance=n.offsetHeight*(80===t.draggablePercent?1.5*t.draggablePercent:t.draggablePercent/100))}}function T(e){if(u.boundingRect){const{top:n,bottom:o,left:s,right:a}=u.boundingRect;"touchend"!==e.nativeEvent.type&&t.pauseOnHover&&u.x>=s&&u.x<=a&&u.y>=n&&u.y<=o?C():E()}}function E(){a(!0)}function C(){a(!1)}function _(e){const n=c.current;u.canDrag&&n&&(u.didMove=!0,o&&C(),u.x=b(e),u.y=I(e),u.delta="x"===t.draggableDirection?u.x-u.start:u.y-u.start,u.start!==u.x&&(u.canCloseOnClick=!1),n.style.transform=`translate${t.draggableDirection}(${u.delta}px)`,n.style.opacity=""+(1-Math.abs(u.delta/u.removalDistance)))}function L(){document.removeEventListener("mousemove",_),document.removeEventListener("mouseup",L),document.removeEventListener("touchmove",_),document.removeEventListener("touchend",L);const e=c.current;if(u.canDrag&&u.didMove&&e){if(u.canDrag=!1,Math.abs(u.delta)>u.removalDistance)return l(!0),void t.closeToast();e.style.transition="transform 0.2s, opacity 0.2s",e.style.transform=`translate${t.draggableDirection}(0)`,e.style.opacity="1"}}(0,react__WEBPACK_IMPORTED_MODULE_0__.useEffect)(()=>{d.current=t}),(0,react__WEBPACK_IMPORTED_MODULE_0__.useEffect)(()=>(c.current&&c.current.addEventListener("d",E,{once:!0}),p(t.onOpen)&&t.onOpen((0,react__WEBPACK_IMPORTED_MODULE_0__.isValidElement)(t.children)&&t.children.props),()=>{const t=d.current;p(t.onClose)&&t.onClose((0,react__WEBPACK_IMPORTED_MODULE_0__.isValidElement)(t.children)&&t.children.props)}),[]),(0,react__WEBPACK_IMPORTED_MODULE_0__.useEffect)(()=>(t.pauseOnFocusLoss&&(document.hasFocus()||C(),window.addEventListener("focus",E),window.addEventListener("blur",C)),()=>{t.pauseOnFocusLoss&&(window.removeEventListener("focus",E),window.removeEventListener("blur",C))}),[t.pauseOnFocusLoss]);const O={onMouseDown:v,onTouchStart:v,onMouseUp:T,onTouchEnd:T};return m&&f&&(O.onMouseEnter=C,O.onMouseLeave=E),y&&(O.onClick=t=>{h&&h(t),u.canCloseOnClick&&g()}),{playToast:E,pauseToast:C,isRunning:o,preventExitTransition:r,toastRef:c,eventHandlers:O}}function L(e){let{closeToast:n,theme:o,ariaLabel:s="close"}=e;return react__WEBPACK_IMPORTED_MODULE_0__.createElement("button",{className:`Toastify__close-button Toastify__close-button--${o}`,type:"button",onClick:t=>{t.stopPropagation(),n(t)},"aria-label":s},react__WEBPACK_IMPORTED_MODULE_0__.createElement("svg",{"aria-hidden":"true",viewBox:"0 0 14 16"},react__WEBPACK_IMPORTED_MODULE_0__.createElement("path",{fillRule:"evenodd",d:"M7.71 8.23l3.75 3.75-1.48 1.48-3.75-3.75-3.75 3.75L1 11.98l3.75-3.75L1 4.48 2.48 3l3.75 3.75L9.98 3l1.48 1.48-3.75 3.75z"})))}function O(e){let{delay:n,isRunning:o,closeToast:s,type:a="default",hide:r,className:i,style:l,controlledProgress:u,progress:d,rtl:m,isIn:f,theme:g}=e;const h=r||u&&0===d,y={...l,animationDuration:`${n}ms`,animationPlayState:o?"running":"paused",opacity:h?0:1};u&&(y.transform=`scaleX(${d})`);const v=(0,clsx__WEBPACK_IMPORTED_MODULE_1__["default"])("Toastify__progress-bar",u?"Toastify__progress-bar--controlled":"Toastify__progress-bar--animated",`Toastify__progress-bar-theme--${g}`,`Toastify__progress-bar--${a}`,{"Toastify__progress-bar--rtl":m}),T=p(i)?i({rtl:m,type:a,defaultClassName:v}):(0,clsx__WEBPACK_IMPORTED_MODULE_1__["default"])(v,i);return react__WEBPACK_IMPORTED_MODULE_0__.createElement("div",{role:"progressbar","aria-hidden":h?"true":"false","aria-label":"notification timer",className:T,style:y,[u&&d>=1?"onTransitionEnd":"onAnimationEnd"]:u&&d<1?null:()=>{f&&s()}})}const N=n=>{const{isRunning:o,preventExitTransition:s,toastRef:r,eventHandlers:i}=_(n),{closeButton:l,children:u,autoClose:d,onClick:m,type:f,hideProgressBar:g,closeToast:h,transition:y,position:v,className:T,style:E,bodyClassName:C,bodyStyle:b,progressClassName:I,progressStyle:N,updateId:M,role:R,progress:w,rtl:x,toastId:$,deleteToast:k,isIn:P,isLoading:B,iconOut:D,closeOnClick:A,theme:z}=n,F=(0,clsx__WEBPACK_IMPORTED_MODULE_1__["default"])("Toastify__toast",`Toastify__toast-theme--${z}`,`Toastify__toast--${f}`,{"Toastify__toast--rtl":x},{"Toastify__toast--close-on-click":A}),H=p(T)?T({rtl:x,position:v,type:f,defaultClassName:F}):(0,clsx__WEBPACK_IMPORTED_MODULE_1__["default"])(F,T),S=!!w||!d,q={closeToast:h,type:f,theme:z};let Q=null;return!1===l||(Q=p(l)?l(q):(0,react__WEBPACK_IMPORTED_MODULE_0__.isValidElement)(l)?(0,react__WEBPACK_IMPORTED_MODULE_0__.cloneElement)(l,q):L(q)),react__WEBPACK_IMPORTED_MODULE_0__.createElement(y,{isIn:P,done:k,position:v,preventExitTransition:s,nodeRef:r},react__WEBPACK_IMPORTED_MODULE_0__.createElement("div",{id:$,onClick:m,className:H,...i,style:E,ref:r},react__WEBPACK_IMPORTED_MODULE_0__.createElement("div",{...P&&{role:R},className:p(C)?C({type:f}):(0,clsx__WEBPACK_IMPORTED_MODULE_1__["default"])("Toastify__toast-body",C),style:b},null!=D&&react__WEBPACK_IMPORTED_MODULE_0__.createElement("div",{className:(0,clsx__WEBPACK_IMPORTED_MODULE_1__["default"])("Toastify__toast-icon",{"Toastify--animate-icon Toastify__zoom-enter":!B})},D),react__WEBPACK_IMPORTED_MODULE_0__.createElement("div",null,u)),Q,react__WEBPACK_IMPORTED_MODULE_0__.createElement(O,{...M&&!S?{key:`pb-${M}`}:{},rtl:x,theme:z,delay:d,isRunning:o,isIn:P,closeToast:h,hide:g,type:f,style:N,className:I,controlledProgress:S,progress:w||0})))},M=function(t,e){return void 0===e&&(e=!1),{enter:`Toastify--animate Toastify__${t}-enter`,exit:`Toastify--animate Toastify__${t}-exit`,appendPosition:e}},R=h(M("bounce",!0)),w=h(M("slide",!0)),x=h(M("zoom")),$=h(M("flip")),k=(0,react__WEBPACK_IMPORTED_MODULE_0__.forwardRef)((e,n)=>{const{getToastToRender:o,containerRef:a,isToastActive:r}=C(e),{className:i,style:l,rtl:u,containerId:d}=e;function f(t){const e=(0,clsx__WEBPACK_IMPORTED_MODULE_1__["default"])("Toastify__toast-container",`Toastify__toast-container--${t}`,{"Toastify__toast-container--rtl":u});return p(i)?i({position:t,rtl:u,defaultClassName:e}):(0,clsx__WEBPACK_IMPORTED_MODULE_1__["default"])(e,m(i))}return (0,react__WEBPACK_IMPORTED_MODULE_0__.useEffect)(()=>{n&&(n.current=a.current)},[]),react__WEBPACK_IMPORTED_MODULE_0__.createElement("div",{ref:a,className:"Toastify",id:d},o((e,n)=>{const o=n.length?{...l}:{...l,pointerEvents:"none"};return react__WEBPACK_IMPORTED_MODULE_0__.createElement("div",{className:f(e),style:o,key:`container-${e}`},n.map((e,o)=>{let{content:s,props:a}=e;return react__WEBPACK_IMPORTED_MODULE_0__.createElement(N,{...a,isIn:r(a.toastId),style:{...a.style,"--nth":o+1,"--len":n.length},key:`toast-${a.key}`},s)}))}))});k.displayName="ToastContainer",k.defaultProps={position:"top-right",transition:R,autoClose:5e3,closeButton:L,pauseOnHover:!0,pauseOnFocusLoss:!0,closeOnClick:!0,draggable:!0,draggablePercent:80,draggableDirection:"x",role:"alert",theme:"light"};let P,B=new Map,D=[],A=1;function z(){return""+A++}function F(t){return t&&(d(t.toastId)||u(t.toastId))?t.toastId:z()}function H(t,e){return B.size>0?v.emit(0,t,e):D.push({content:t,options:e}),e.toastId}function S(t,e){return{...e,type:e&&e.type||t,toastId:F(e)}}function q(t){return(e,n)=>H(e,S(t,n))}function Q(t,e){return H(t,S("default",e))}Q.loading=(t,e)=>H(t,S("default",{isLoading:!0,autoClose:!1,closeOnClick:!1,closeButton:!1,draggable:!1,...e})),Q.promise=function(t,e,n){let o,{pending:s,error:a,success:r}=e;s&&(o=d(s)?Q.loading(s,n):Q.loading(s.render,{...n,...s}));const i={isLoading:null,autoClose:null,closeOnClick:null,closeButton:null,draggable:null},l=(t,e,s)=>{if(null==e)return void Q.dismiss(o);const a={type:t,...i,...n,data:s},r=d(e)?{render:e}:e;return o?Q.update(o,{...a,...r}):Q(r.render,{...a,...r}),s},c=p(t)?t():t;return c.then(t=>l("success",r,t)).catch(t=>l("error",a,t)),c},Q.success=q("success"),Q.info=q("info"),Q.error=q("error"),Q.warning=q("warning"),Q.warn=Q.warning,Q.dark=(t,e)=>H(t,S("default",{theme:"dark",...e})),Q.dismiss=t=>{B.size>0?v.emit(1,t):D=D.filter(e=>null!=t&&e.options.toastId!==t)},Q.clearWaitingQueue=function(t){return void 0===t&&(t={}),v.emit(5,t)},Q.isActive=t=>{let e=!1;return B.forEach(n=>{n.isToastActive&&n.isToastActive(t)&&(e=!0)}),e},Q.update=function(t,e){void 0===e&&(e={}),setTimeout(()=>{const n=function(t,e){let{containerId:n}=e;const o=B.get(n||P);return o&&o.getToast(t)}(t,e);if(n){const{props:o,content:s}=n,a={delay:100,...o,...e,toastId:e.toastId||t,updateId:z()};a.toastId!==t&&(a.staleId=t);const r=a.render||s;delete a.render,H(r,a)}},0)},Q.done=t=>{Q.update(t,{progress:1})},Q.onChange=t=>(v.on(4,t),()=>{v.off(4,t)}),Q.POSITION={TOP_LEFT:"top-left",TOP_RIGHT:"top-right",TOP_CENTER:"top-center",BOTTOM_LEFT:"bottom-left",BOTTOM_RIGHT:"bottom-right",BOTTOM_CENTER:"bottom-center"},Q.TYPE={INFO:"info",SUCCESS:"success",WARNING:"warning",ERROR:"error",DEFAULT:"default"},v.on(2,t=>{P=t.containerId||t,B.set(P,t),D.forEach(t=>{v.emit(0,t.content,t.options)}),D=[]}).on(3,t=>{B.delete(t.containerId||t),0===B.size&&v.off(0).off(1).off(5)});
//# sourceMappingURL=react-toastify.esm.mjs.map


/***/ }),

/***/ "./node_modules/axios/package.json":
/*!*****************************************!*\
  !*** ./node_modules/axios/package.json ***!
  \*****************************************/
/***/ ((module) => {

"use strict";
module.exports = JSON.parse('{"name":"axios","version":"0.21.4","description":"Promise based HTTP client for the browser and node.js","main":"index.js","scripts":{"test":"grunt test","start":"node ./sandbox/server.js","build":"NODE_ENV=production grunt build","preversion":"npm test","version":"npm run build && grunt version && git add -A dist && git add CHANGELOG.md bower.json package.json","postversion":"git push && git push --tags","examples":"node ./examples/server.js","coveralls":"cat coverage/lcov.info | ./node_modules/coveralls/bin/coveralls.js","fix":"eslint --fix lib/**/*.js"},"repository":{"type":"git","url":"https://github.com/axios/axios.git"},"keywords":["xhr","http","ajax","promise","node"],"author":"Matt Zabriskie","license":"MIT","bugs":{"url":"https://github.com/axios/axios/issues"},"homepage":"https://axios-http.com","devDependencies":{"coveralls":"^3.0.0","es6-promise":"^4.2.4","grunt":"^1.3.0","grunt-banner":"^0.6.0","grunt-cli":"^1.2.0","grunt-contrib-clean":"^1.1.0","grunt-contrib-watch":"^1.0.0","grunt-eslint":"^23.0.0","grunt-karma":"^4.0.0","grunt-mocha-test":"^0.13.3","grunt-ts":"^6.0.0-beta.19","grunt-webpack":"^4.0.2","istanbul-instrumenter-loader":"^1.0.0","jasmine-core":"^2.4.1","karma":"^6.3.2","karma-chrome-launcher":"^3.1.0","karma-firefox-launcher":"^2.1.0","karma-jasmine":"^1.1.1","karma-jasmine-ajax":"^0.1.13","karma-safari-launcher":"^1.0.0","karma-sauce-launcher":"^4.3.6","karma-sinon":"^1.0.5","karma-sourcemap-loader":"^0.3.8","karma-webpack":"^4.0.2","load-grunt-tasks":"^3.5.2","minimist":"^1.2.0","mocha":"^8.2.1","sinon":"^4.5.0","terser-webpack-plugin":"^4.2.3","typescript":"^4.0.5","url-search-params":"^0.10.0","webpack":"^4.44.2","webpack-dev-server":"^3.11.0"},"browser":{"./lib/adapters/http.js":"./lib/adapters/xhr.js"},"jsdelivr":"dist/axios.min.js","unpkg":"dist/axios.min.js","typings":"./index.d.ts","dependencies":{"follow-redirects":"^1.14.0"},"bundlesize":[{"path":"./dist/axios.min.js","threshold":"5kB"}]}');

/***/ })

},
/******/ __webpack_require__ => { // webpackRuntimeModules
/******/ var __webpack_exec__ = (moduleId) => (__webpack_require__(__webpack_require__.s = moduleId))
/******/ __webpack_require__.O(0, ["/js/vendor"], () => (__webpack_exec__("./resources/js/react/StartEndPoll/index.js")));
/******/ var __webpack_exports__ = __webpack_require__.O();
/******/ }
]);