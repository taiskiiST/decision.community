(self["webpackChunk"] = self["webpackChunk"] || []).push([["/js/GlobalSearchQuestionsSmallScreen"],{

/***/ "./resources/js/react/GlobalSearchQuestionsSmallScreen/GlobalSearchQuestionsSmallScreen.js":
/*!*************************************************************************************************!*\
  !*** ./resources/js/react/GlobalSearchQuestionsSmallScreen/GlobalSearchQuestionsSmallScreen.js ***!
  \*************************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "./node_modules/react/index.js");
/* harmony import */ var react_dom__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! react-dom */ "./node_modules/react-dom/index.js");
/* harmony import */ var react_highlight_words__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! react-highlight-words */ "./node_modules/react-highlight-words/dist/main.js");
/* harmony import */ var react_highlight_words__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(react_highlight_words__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var react_debounce_input__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! react-debounce-input */ "./node_modules/react-debounce-input/lib/index.js");
/* harmony import */ var react_debounce_input__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(react_debounce_input__WEBPACK_IMPORTED_MODULE_3__);
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! react/jsx-runtime */ "./node_modules/react/jsx-runtime.js");
function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _unsupportedIterableToArray(arr, i) || _nonIterableRest(); }
function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }
function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }
function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) arr2[i] = arr[i]; return arr2; }
function _iterableToArrayLimit(arr, i) { var _i = null == arr ? null : "undefined" != typeof Symbol && arr[Symbol.iterator] || arr["@@iterator"]; if (null != _i) { var _s, _e, _x, _r, _arr = [], _n = !0, _d = !1; try { if (_x = (_i = _i.call(arr)).next, 0 === i) { if (Object(_i) !== _i) return; _n = !1; } else for (; !(_n = (_s = _x.call(_i)).done) && (_arr.push(_s.value), _arr.length !== i); _n = !0); } catch (err) { _d = !0, _e = err; } finally { try { if (!_n && null != _i["return"] && (_r = _i["return"](), Object(_r) !== _r)) return; } finally { if (_d) throw _e; } } return _arr; } }
function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }






var _ref = window.TSN || {},
  all_questions = _ref.all_questions,
  itemsNameHash = _ref.itemsNameHash,
  itemsPollNameHash = _ref.itemsPollNameHash,
  cnt_files_in_question = _ref.cnt_files_in_question;
function SearchQuestionsSmallScreen() {
  var _useState = (0,react__WEBPACK_IMPORTED_MODULE_0__.useState)(''),
    _useState2 = _slicedToArray(_useState, 2),
    searchTerm = _useState2[0],
    setSearchTerm = _useState2[1];
  var _useState3 = (0,react__WEBPACK_IMPORTED_MODULE_0__.useState)(all_questions),
    _useState4 = _slicedToArray(_useState3, 2),
    searchResults = _useState4[0],
    setSearchResults = _useState4[1];
  var handleChangeQuestionsFilter = function handleChangeQuestionsFilter(event) {
    setSearchTerm(event.target.value);
  };
  (0,react__WEBPACK_IMPORTED_MODULE_0__.useEffect)(function () {
    var results = all_questions.filter(function (question) {
      var _itemsNameHash$questi, _itemsPollNameHash$qu;
      var searchTermLowerCased = searchTerm.toLowerCase();
      return question.text.toLowerCase().includes(searchTermLowerCased) || ((_itemsNameHash$questi = itemsNameHash[question.author]) === null || _itemsNameHash$questi === void 0 || (_itemsNameHash$questi = _itemsNameHash$questi.toLowerCase()) === null || _itemsNameHash$questi === void 0 ? void 0 : _itemsNameHash$questi.includes(searchTermLowerCased)) || ((_itemsPollNameHash$qu = itemsPollNameHash[question.poll_id]) === null || _itemsPollNameHash$qu === void 0 || (_itemsPollNameHash$qu = _itemsPollNameHash$qu.toLowerCase()) === null || _itemsPollNameHash$qu === void 0 ? void 0 : _itemsPollNameHash$qu.includes(searchTermLowerCased));
    });
    setSearchResults(results);
  }, [searchTerm]);
  return /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsxs)("div", {
    className: "relative w-64",
    children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsxs)("div", {
      children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsx)("div", {
        children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsx)(react_debounce_input__WEBPACK_IMPORTED_MODULE_3__.DebounceInput, {
          className: "focus:shadow-outline w-30 mr-2 appearance-none border py-2 pr-4 text-gray-500 shadow focus:outline-none",
          type: "search",
          placeholder: "\u041F\u043E\u0438\u0441\u043A \u043F\u043E \u0433\u043E\u043B\u043E\u0441\u043E\u0432\u0430\u043D\u0438\u044F\u043C",
          debounceTimeout: 500,
          onChange: handleChangeQuestionsFilter,
          value: searchTerm
        })
      }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsx)("div", {
        children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsx)("button", {
          type: "submit",
          className: "absolute inset-y-0 right-0 flex items-center bg-indigo-600 text-sm text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2",
          children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsx)("svg", {
            className: "h-4 w-10",
            xmlns: "http://www.w3.org/2000/svg",
            fill: "currentColor",
            viewBox: "0 0 20 20",
            stroke: "currentColor",
            children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsx)("path", {
              fillRule: "evenodd",
              d: "M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z",
              clipRule: "evenodd"
            })
          })
        })
      })]
    }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsx)("div", {
      className: "absolute z-50 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8",
      children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsx)("div", {
        className: "min-w-full py-2 align-middle sm:px-1 lg:px-8",
        children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsxs)("div", {
          className: "overflow-hidden border-b border-gray-200 shadow sm:rounded-lg",
          children: [searchTerm && searchResults.length > 0 && /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsx)("table", {
            className: "flex min-w-full flex-col divide-y divide-gray-200",
            children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsx)("tbody", {
              children: searchResults.map(function (question, index) {
                return /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsx)("tr", {
                  className: "flex flex-col border-b border-gray-400 bg-gray-100 bg-white",
                  children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsxs)("td", {
                    colSpan: "3",
                    children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsxs)("div", {
                      className: "whitespace-wrap text-wrap px-6 py-4 text-left text-sm text-gray-900",
                      children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsxs)("div", {
                        className: "inline-flex",
                        children: [index + 1, ".\xA0", /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsx)((react_highlight_words__WEBPACK_IMPORTED_MODULE_2___default()), {
                          highlightClassName: "Highlight",
                          searchWords: [searchTerm],
                          autoEscape: true,
                          textToHighlight: question.text
                        })]
                      }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsx)("i", {
                        children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsxs)("p", {
                          className: "text-xs",
                          children: ["(", /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsx)((react_highlight_words__WEBPACK_IMPORTED_MODULE_2___default()), {
                            highlightClassName: "Highlight",
                            searchWords: [searchTerm],
                            autoEscape: true,
                            textToHighlight: itemsPollNameHash[question.poll_id]
                          }), ")"]
                        })
                      })]
                    }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsx)("div", {
                      className: "whitespace-wrap text-wrap bg-gray-200 px-6 py-4 text-left text-sm font-medium",
                      children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsx)((react_highlight_words__WEBPACK_IMPORTED_MODULE_2___default()), {
                        highlightClassName: "Highlight",
                        searchWords: [searchTerm],
                        autoEscape: true,
                        textToHighlight: itemsNameHash[question.author]
                      })
                    }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsxs)("div", {
                      className: "whitespace-wrap text-wrap px-6 py-4 text-left text-sm font-medium text-green-600",
                      children: ["\u041A\u043E\u043B\u0438\u0447\u0435\u0441\u0442\u0432\u043E \u0444\u0430\u0439\u043B\u043E\u0432 -", ' ', cnt_files_in_question[question.id]]
                    }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsx)("div", {
                      className: "whitespace-wrap text-wrap bg-gray-200 px-6 py-4 text-left text-sm font-medium text-green-600",
                      children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsx)("a", {
                        href: "/polls/view/question/".concat(question.id),
                        className: "text-indigo-600 hover:text-indigo-900",
                        children: "\u0420\u0435\u0437\u0443\u043B\u044C\u0442\u0430\u0442\u044B \u0433\u043E\u043B\u043E\u0441\u043E\u0432\u0430\u043D\u0438\u044F"
                      })
                    })]
                  })
                }, index);
              })
            })
          }), searchTerm && !searchResults.length && /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsx)("div", {
            className: "whitespace-wrap bg-white px-6 py-4 text-sm font-medium text-gray-900",
            children: "\u041D\u0438\u0447\u0435\u0433\u043E \u043D\u0435 \u043D\u0430\u0439\u0434\u0435\u043D\u043E!"
          })]
        })
      })
    })]
  });
}
react_dom__WEBPACK_IMPORTED_MODULE_1__.render( /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsx)(SearchQuestionsSmallScreen, {}), document.getElementById('searchQuestionsSmallScreen'));

/***/ }),

/***/ "./node_modules/lodash.debounce/index.js":
/*!***********************************************!*\
  !*** ./node_modules/lodash.debounce/index.js ***!
  \***********************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

/**
 * lodash (Custom Build) <https://lodash.com/>
 * Build: `lodash modularize exports="npm" -o ./`
 * Copyright jQuery Foundation and other contributors <https://jquery.org/>
 * Released under MIT license <https://lodash.com/license>
 * Based on Underscore.js 1.8.3 <http://underscorejs.org/LICENSE>
 * Copyright Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
 */

/** Used as the `TypeError` message for "Functions" methods. */
var FUNC_ERROR_TEXT = 'Expected a function';

/** Used as references for various `Number` constants. */
var NAN = 0 / 0;

/** `Object#toString` result references. */
var symbolTag = '[object Symbol]';

/** Used to match leading and trailing whitespace. */
var reTrim = /^\s+|\s+$/g;

/** Used to detect bad signed hexadecimal string values. */
var reIsBadHex = /^[-+]0x[0-9a-f]+$/i;

/** Used to detect binary string values. */
var reIsBinary = /^0b[01]+$/i;

/** Used to detect octal string values. */
var reIsOctal = /^0o[0-7]+$/i;

/** Built-in method references without a dependency on `root`. */
var freeParseInt = parseInt;

/** Detect free variable `global` from Node.js. */
var freeGlobal = typeof __webpack_require__.g == 'object' && __webpack_require__.g && __webpack_require__.g.Object === Object && __webpack_require__.g;

/** Detect free variable `self`. */
var freeSelf = typeof self == 'object' && self && self.Object === Object && self;

/** Used as a reference to the global object. */
var root = freeGlobal || freeSelf || Function('return this')();

/** Used for built-in method references. */
var objectProto = Object.prototype;

/**
 * Used to resolve the
 * [`toStringTag`](http://ecma-international.org/ecma-262/7.0/#sec-object.prototype.tostring)
 * of values.
 */
var objectToString = objectProto.toString;

/* Built-in method references for those with the same name as other `lodash` methods. */
var nativeMax = Math.max,
    nativeMin = Math.min;

/**
 * Gets the timestamp of the number of milliseconds that have elapsed since
 * the Unix epoch (1 January 1970 00:00:00 UTC).
 *
 * @static
 * @memberOf _
 * @since 2.4.0
 * @category Date
 * @returns {number} Returns the timestamp.
 * @example
 *
 * _.defer(function(stamp) {
 *   console.log(_.now() - stamp);
 * }, _.now());
 * // => Logs the number of milliseconds it took for the deferred invocation.
 */
var now = function() {
  return root.Date.now();
};

/**
 * Creates a debounced function that delays invoking `func` until after `wait`
 * milliseconds have elapsed since the last time the debounced function was
 * invoked. The debounced function comes with a `cancel` method to cancel
 * delayed `func` invocations and a `flush` method to immediately invoke them.
 * Provide `options` to indicate whether `func` should be invoked on the
 * leading and/or trailing edge of the `wait` timeout. The `func` is invoked
 * with the last arguments provided to the debounced function. Subsequent
 * calls to the debounced function return the result of the last `func`
 * invocation.
 *
 * **Note:** If `leading` and `trailing` options are `true`, `func` is
 * invoked on the trailing edge of the timeout only if the debounced function
 * is invoked more than once during the `wait` timeout.
 *
 * If `wait` is `0` and `leading` is `false`, `func` invocation is deferred
 * until to the next tick, similar to `setTimeout` with a timeout of `0`.
 *
 * See [David Corbacho's article](https://css-tricks.com/debouncing-throttling-explained-examples/)
 * for details over the differences between `_.debounce` and `_.throttle`.
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Function
 * @param {Function} func The function to debounce.
 * @param {number} [wait=0] The number of milliseconds to delay.
 * @param {Object} [options={}] The options object.
 * @param {boolean} [options.leading=false]
 *  Specify invoking on the leading edge of the timeout.
 * @param {number} [options.maxWait]
 *  The maximum time `func` is allowed to be delayed before it's invoked.
 * @param {boolean} [options.trailing=true]
 *  Specify invoking on the trailing edge of the timeout.
 * @returns {Function} Returns the new debounced function.
 * @example
 *
 * // Avoid costly calculations while the window size is in flux.
 * jQuery(window).on('resize', _.debounce(calculateLayout, 150));
 *
 * // Invoke `sendMail` when clicked, debouncing subsequent calls.
 * jQuery(element).on('click', _.debounce(sendMail, 300, {
 *   'leading': true,
 *   'trailing': false
 * }));
 *
 * // Ensure `batchLog` is invoked once after 1 second of debounced calls.
 * var debounced = _.debounce(batchLog, 250, { 'maxWait': 1000 });
 * var source = new EventSource('/stream');
 * jQuery(source).on('message', debounced);
 *
 * // Cancel the trailing debounced invocation.
 * jQuery(window).on('popstate', debounced.cancel);
 */
function debounce(func, wait, options) {
  var lastArgs,
      lastThis,
      maxWait,
      result,
      timerId,
      lastCallTime,
      lastInvokeTime = 0,
      leading = false,
      maxing = false,
      trailing = true;

  if (typeof func != 'function') {
    throw new TypeError(FUNC_ERROR_TEXT);
  }
  wait = toNumber(wait) || 0;
  if (isObject(options)) {
    leading = !!options.leading;
    maxing = 'maxWait' in options;
    maxWait = maxing ? nativeMax(toNumber(options.maxWait) || 0, wait) : maxWait;
    trailing = 'trailing' in options ? !!options.trailing : trailing;
  }

  function invokeFunc(time) {
    var args = lastArgs,
        thisArg = lastThis;

    lastArgs = lastThis = undefined;
    lastInvokeTime = time;
    result = func.apply(thisArg, args);
    return result;
  }

  function leadingEdge(time) {
    // Reset any `maxWait` timer.
    lastInvokeTime = time;
    // Start the timer for the trailing edge.
    timerId = setTimeout(timerExpired, wait);
    // Invoke the leading edge.
    return leading ? invokeFunc(time) : result;
  }

  function remainingWait(time) {
    var timeSinceLastCall = time - lastCallTime,
        timeSinceLastInvoke = time - lastInvokeTime,
        result = wait - timeSinceLastCall;

    return maxing ? nativeMin(result, maxWait - timeSinceLastInvoke) : result;
  }

  function shouldInvoke(time) {
    var timeSinceLastCall = time - lastCallTime,
        timeSinceLastInvoke = time - lastInvokeTime;

    // Either this is the first call, activity has stopped and we're at the
    // trailing edge, the system time has gone backwards and we're treating
    // it as the trailing edge, or we've hit the `maxWait` limit.
    return (lastCallTime === undefined || (timeSinceLastCall >= wait) ||
      (timeSinceLastCall < 0) || (maxing && timeSinceLastInvoke >= maxWait));
  }

  function timerExpired() {
    var time = now();
    if (shouldInvoke(time)) {
      return trailingEdge(time);
    }
    // Restart the timer.
    timerId = setTimeout(timerExpired, remainingWait(time));
  }

  function trailingEdge(time) {
    timerId = undefined;

    // Only invoke if we have `lastArgs` which means `func` has been
    // debounced at least once.
    if (trailing && lastArgs) {
      return invokeFunc(time);
    }
    lastArgs = lastThis = undefined;
    return result;
  }

  function cancel() {
    if (timerId !== undefined) {
      clearTimeout(timerId);
    }
    lastInvokeTime = 0;
    lastArgs = lastCallTime = lastThis = timerId = undefined;
  }

  function flush() {
    return timerId === undefined ? result : trailingEdge(now());
  }

  function debounced() {
    var time = now(),
        isInvoking = shouldInvoke(time);

    lastArgs = arguments;
    lastThis = this;
    lastCallTime = time;

    if (isInvoking) {
      if (timerId === undefined) {
        return leadingEdge(lastCallTime);
      }
      if (maxing) {
        // Handle invocations in a tight loop.
        timerId = setTimeout(timerExpired, wait);
        return invokeFunc(lastCallTime);
      }
    }
    if (timerId === undefined) {
      timerId = setTimeout(timerExpired, wait);
    }
    return result;
  }
  debounced.cancel = cancel;
  debounced.flush = flush;
  return debounced;
}

/**
 * Checks if `value` is the
 * [language type](http://www.ecma-international.org/ecma-262/7.0/#sec-ecmascript-language-types)
 * of `Object`. (e.g. arrays, functions, objects, regexes, `new Number(0)`, and `new String('')`)
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is an object, else `false`.
 * @example
 *
 * _.isObject({});
 * // => true
 *
 * _.isObject([1, 2, 3]);
 * // => true
 *
 * _.isObject(_.noop);
 * // => true
 *
 * _.isObject(null);
 * // => false
 */
function isObject(value) {
  var type = typeof value;
  return !!value && (type == 'object' || type == 'function');
}

/**
 * Checks if `value` is object-like. A value is object-like if it's not `null`
 * and has a `typeof` result of "object".
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is object-like, else `false`.
 * @example
 *
 * _.isObjectLike({});
 * // => true
 *
 * _.isObjectLike([1, 2, 3]);
 * // => true
 *
 * _.isObjectLike(_.noop);
 * // => false
 *
 * _.isObjectLike(null);
 * // => false
 */
function isObjectLike(value) {
  return !!value && typeof value == 'object';
}

/**
 * Checks if `value` is classified as a `Symbol` primitive or object.
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a symbol, else `false`.
 * @example
 *
 * _.isSymbol(Symbol.iterator);
 * // => true
 *
 * _.isSymbol('abc');
 * // => false
 */
function isSymbol(value) {
  return typeof value == 'symbol' ||
    (isObjectLike(value) && objectToString.call(value) == symbolTag);
}

/**
 * Converts `value` to a number.
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Lang
 * @param {*} value The value to process.
 * @returns {number} Returns the number.
 * @example
 *
 * _.toNumber(3.2);
 * // => 3.2
 *
 * _.toNumber(Number.MIN_VALUE);
 * // => 5e-324
 *
 * _.toNumber(Infinity);
 * // => Infinity
 *
 * _.toNumber('3.2');
 * // => 3.2
 */
function toNumber(value) {
  if (typeof value == 'number') {
    return value;
  }
  if (isSymbol(value)) {
    return NAN;
  }
  if (isObject(value)) {
    var other = typeof value.valueOf == 'function' ? value.valueOf() : value;
    value = isObject(other) ? (other + '') : other;
  }
  if (typeof value != 'string') {
    return value === 0 ? value : +value;
  }
  value = value.replace(reTrim, '');
  var isBinary = reIsBinary.test(value);
  return (isBinary || reIsOctal.test(value))
    ? freeParseInt(value.slice(2), isBinary ? 2 : 8)
    : (reIsBadHex.test(value) ? NAN : +value);
}

module.exports = debounce;


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

/***/ "./node_modules/react-debounce-input/lib/Component.js":
/*!************************************************************!*\
  !*** ./node_modules/react-debounce-input/lib/Component.js ***!
  \************************************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";


function _typeof(obj) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (obj) { return typeof obj; } : function (obj) { return obj && "function" == typeof Symbol && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }, _typeof(obj); }

Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports.DebounceInput = void 0;

var _react = _interopRequireDefault(__webpack_require__(/*! react */ "./node_modules/react/index.js"));

var _lodash = _interopRequireDefault(__webpack_require__(/*! lodash.debounce */ "./node_modules/lodash.debounce/index.js"));

var _excluded = ["element", "onChange", "value", "minLength", "debounceTimeout", "forceNotifyByEnter", "forceNotifyOnBlur", "onKeyDown", "onBlur", "inputRef"];

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _objectWithoutProperties(source, excluded) { if (source == null) return {}; var target = _objectWithoutPropertiesLoose(source, excluded); var key, i; if (Object.getOwnPropertySymbols) { var sourceSymbolKeys = Object.getOwnPropertySymbols(source); for (i = 0; i < sourceSymbolKeys.length; i++) { key = sourceSymbolKeys[i]; if (excluded.indexOf(key) >= 0) continue; if (!Object.prototype.propertyIsEnumerable.call(source, key)) continue; target[key] = source[key]; } } return target; }

function _objectWithoutPropertiesLoose(source, excluded) { if (source == null) return {}; var target = {}; var sourceKeys = Object.keys(source); var key, i; for (i = 0; i < sourceKeys.length; i++) { key = sourceKeys[i]; if (excluded.indexOf(key) >= 0) continue; target[key] = source[key]; } return target; }

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); enumerableOnly && (symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; })), keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = null != arguments[i] ? arguments[i] : {}; i % 2 ? ownKeys(Object(source), !0).forEach(function (key) { _defineProperty(target, key, source[key]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)) : ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } return target; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); Object.defineProperty(Constructor, "prototype", { writable: false }); return Constructor; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); Object.defineProperty(subClass, "prototype", { writable: false }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

function _createSuper(Derived) { var hasNativeReflectConstruct = _isNativeReflectConstruct(); return function _createSuperInternal() { var Super = _getPrototypeOf(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = _getPrototypeOf(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return _possibleConstructorReturn(this, result); }; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } else if (call !== void 0) { throw new TypeError("Derived constructors may only return object or undefined"); } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {})); return true; } catch (e) { return false; } }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var DebounceInput = /*#__PURE__*/function (_React$PureComponent) {
  _inherits(DebounceInput, _React$PureComponent);

  var _super = _createSuper(DebounceInput);

  function DebounceInput(props) {
    var _this;

    _classCallCheck(this, DebounceInput);

    _this = _super.call(this, props);

    _defineProperty(_assertThisInitialized(_this), "onChange", function (event) {
      event.persist();
      var oldValue = _this.state.value;
      var minLength = _this.props.minLength;

      _this.setState({
        value: event.target.value
      }, function () {
        var value = _this.state.value;

        if (value.length >= minLength) {
          _this.notify(event);

          return;
        } // If user hits backspace and goes below minLength consider it cleaning the value


        if (oldValue.length > value.length) {
          _this.notify(_objectSpread(_objectSpread({}, event), {}, {
            target: _objectSpread(_objectSpread({}, event.target), {}, {
              value: ''
            })
          }));
        }
      });
    });

    _defineProperty(_assertThisInitialized(_this), "onKeyDown", function (event) {
      if (event.key === 'Enter') {
        _this.forceNotify(event);
      } // Invoke original onKeyDown if present


      var onKeyDown = _this.props.onKeyDown;

      if (onKeyDown) {
        event.persist();
        onKeyDown(event);
      }
    });

    _defineProperty(_assertThisInitialized(_this), "onBlur", function (event) {
      _this.forceNotify(event); // Invoke original onBlur if present


      var onBlur = _this.props.onBlur;

      if (onBlur) {
        event.persist();
        onBlur(event);
      }
    });

    _defineProperty(_assertThisInitialized(_this), "createNotifier", function (debounceTimeout) {
      if (debounceTimeout < 0) {
        _this.notify = function () {
          return null;
        };
      } else if (debounceTimeout === 0) {
        _this.notify = _this.doNotify;
      } else {
        var debouncedChangeFunc = (0, _lodash["default"])(function (event) {
          _this.isDebouncing = false;

          _this.doNotify(event);
        }, debounceTimeout);

        _this.notify = function (event) {
          _this.isDebouncing = true;
          debouncedChangeFunc(event);
        };

        _this.flush = function () {
          return debouncedChangeFunc.flush();
        };

        _this.cancel = function () {
          _this.isDebouncing = false;
          debouncedChangeFunc.cancel();
        };
      }
    });

    _defineProperty(_assertThisInitialized(_this), "doNotify", function () {
      var onChange = _this.props.onChange;
      onChange.apply(void 0, arguments);
    });

    _defineProperty(_assertThisInitialized(_this), "forceNotify", function (event) {
      var debounceTimeout = _this.props.debounceTimeout;

      if (!_this.isDebouncing && debounceTimeout > 0) {
        return;
      }

      if (_this.cancel) {
        _this.cancel();
      }

      var value = _this.state.value;
      var minLength = _this.props.minLength;

      if (value.length >= minLength) {
        _this.doNotify(event);
      } else {
        _this.doNotify(_objectSpread(_objectSpread({}, event), {}, {
          target: _objectSpread(_objectSpread({}, event.target), {}, {
            value: value
          })
        }));
      }
    });

    _this.isDebouncing = false;
    _this.state = {
      value: typeof props.value === 'undefined' || props.value === null ? '' : props.value
    };
    var _debounceTimeout2 = _this.props.debounceTimeout;

    _this.createNotifier(_debounceTimeout2);

    return _this;
  }

  _createClass(DebounceInput, [{
    key: "componentDidUpdate",
    value: function componentDidUpdate(prevProps) {
      if (this.isDebouncing) {
        return;
      }

      var _this$props = this.props,
          value = _this$props.value,
          debounceTimeout = _this$props.debounceTimeout;
      var oldTimeout = prevProps.debounceTimeout,
          oldValue = prevProps.value;
      var stateValue = this.state.value;

      if (typeof value !== 'undefined' && oldValue !== value && stateValue !== value) {
        // Update state.value if new value passed via props, yep re-render should happen
        // eslint-disable-next-line react/no-did-update-set-state
        this.setState({
          value: value
        });
      }

      if (debounceTimeout !== oldTimeout) {
        this.createNotifier(debounceTimeout);
      }
    }
  }, {
    key: "componentWillUnmount",
    value: function componentWillUnmount() {
      if (this.flush) {
        this.flush();
      }
    }
  }, {
    key: "render",
    value: function render() {
      var _this$props2 = this.props,
          element = _this$props2.element,
          _onChange = _this$props2.onChange,
          _value = _this$props2.value,
          _minLength = _this$props2.minLength,
          _debounceTimeout = _this$props2.debounceTimeout,
          forceNotifyByEnter = _this$props2.forceNotifyByEnter,
          forceNotifyOnBlur = _this$props2.forceNotifyOnBlur,
          onKeyDown = _this$props2.onKeyDown,
          onBlur = _this$props2.onBlur,
          inputRef = _this$props2.inputRef,
          props = _objectWithoutProperties(_this$props2, _excluded);

      var value = this.state.value;
      var maybeOnKeyDown;

      if (forceNotifyByEnter) {
        maybeOnKeyDown = {
          onKeyDown: this.onKeyDown
        };
      } else if (onKeyDown) {
        maybeOnKeyDown = {
          onKeyDown: onKeyDown
        };
      } else {
        maybeOnKeyDown = {};
      }

      var maybeOnBlur;

      if (forceNotifyOnBlur) {
        maybeOnBlur = {
          onBlur: this.onBlur
        };
      } else if (onBlur) {
        maybeOnBlur = {
          onBlur: onBlur
        };
      } else {
        maybeOnBlur = {};
      }

      var maybeRef = inputRef ? {
        ref: inputRef
      } : {};
      return /*#__PURE__*/_react["default"].createElement(element, _objectSpread(_objectSpread(_objectSpread(_objectSpread({}, props), {}, {
        onChange: this.onChange,
        value: value
      }, maybeOnKeyDown), maybeOnBlur), maybeRef));
    }
  }]);

  return DebounceInput;
}(_react["default"].PureComponent);

exports.DebounceInput = DebounceInput;

_defineProperty(DebounceInput, "defaultProps", {
  element: 'input',
  type: 'text',
  onKeyDown: undefined,
  onBlur: undefined,
  value: undefined,
  minLength: 0,
  debounceTimeout: 100,
  forceNotifyByEnter: true,
  forceNotifyOnBlur: true,
  inputRef: undefined
});

/***/ }),

/***/ "./node_modules/react-debounce-input/lib/index.js":
/*!********************************************************!*\
  !*** ./node_modules/react-debounce-input/lib/index.js ***!
  \********************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";


var _require = __webpack_require__(/*! ./Component */ "./node_modules/react-debounce-input/lib/Component.js"),
    DebounceInput = _require.DebounceInput;

DebounceInput.DebounceInput = DebounceInput;
module.exports = DebounceInput;

/***/ }),

/***/ "./node_modules/react-highlight-words/dist/main.js":
/*!*********************************************************!*\
  !*** ./node_modules/react-highlight-words/dist/main.js ***!
  \*********************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

module.exports =
/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __nested_webpack_require_187__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;
/******/
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __nested_webpack_require_187__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__nested_webpack_require_187__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__nested_webpack_require_187__.c = installedModules;
/******/
/******/ 	// __webpack_public_path__
/******/ 	__nested_webpack_require_187__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __nested_webpack_require_187__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __nested_webpack_require_1468__) {

	module.exports = __nested_webpack_require_1468__(1);


/***/ }),
/* 1 */
/***/ (function(module, exports, __nested_webpack_require_1587__) {

	'use strict';
	
	Object.defineProperty(exports, '__esModule', {
	  value: true
	});
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }
	
	var _Highlighter = __nested_webpack_require_1587__(2);
	
	var _Highlighter2 = _interopRequireDefault(_Highlighter);

	exports['default'] = _Highlighter2['default'];
	module.exports = exports['default'];

/***/ }),
/* 2 */
/***/ (function(module, exports, __nested_webpack_require_2043__) {

	'use strict';
	
	Object.defineProperty(exports, '__esModule', {
	  value: true
	});
	
	var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };
	
	exports['default'] = Highlighter;
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }
	
	function _objectWithoutProperties(obj, keys) { var target = {}; for (var i in obj) { if (keys.indexOf(i) >= 0) continue; if (!Object.prototype.hasOwnProperty.call(obj, i)) continue; target[i] = obj[i]; } return target; }
	
	var _highlightWordsCore = __nested_webpack_require_2043__(3);
	
	var _propTypes = __nested_webpack_require_2043__(4);
	
	var _propTypes2 = _interopRequireDefault(_propTypes);
	
	var _react = __nested_webpack_require_2043__(14);
	
	var _memoizeOne = __nested_webpack_require_2043__(15);
	
	var _memoizeOne2 = _interopRequireDefault(_memoizeOne);
	
	Highlighter.propTypes = {
	  activeClassName: _propTypes2['default'].string,
	  activeIndex: _propTypes2['default'].number,
	  activeStyle: _propTypes2['default'].object,
	  autoEscape: _propTypes2['default'].bool,
	  className: _propTypes2['default'].string,
	  findChunks: _propTypes2['default'].func,
	  highlightClassName: _propTypes2['default'].oneOfType([_propTypes2['default'].object, _propTypes2['default'].string]),
	  highlightStyle: _propTypes2['default'].object,
	  highlightTag: _propTypes2['default'].oneOfType([_propTypes2['default'].node, _propTypes2['default'].func, _propTypes2['default'].string]),
	  sanitize: _propTypes2['default'].func,
	  searchWords: _propTypes2['default'].arrayOf(_propTypes2['default'].oneOfType([_propTypes2['default'].string, _propTypes2['default'].instanceOf(RegExp)])).isRequired,
	  textToHighlight: _propTypes2['default'].string.isRequired,
	  unhighlightTag: _propTypes2['default'].oneOfType([_propTypes2['default'].node, _propTypes2['default'].func, _propTypes2['default'].string]),
	  unhighlightClassName: _propTypes2['default'].string,
	  unhighlightStyle: _propTypes2['default'].object
	};
	
	/**
	 * Highlights all occurrences of search terms (searchText) within a string (textToHighlight).
	 * This function returns an array of strings and <span>s (wrapping highlighted words).
	 */
	
	function Highlighter(_ref) {
	  var _ref$activeClassName = _ref.activeClassName;
	  var activeClassName = _ref$activeClassName === undefined ? '' : _ref$activeClassName;
	  var _ref$activeIndex = _ref.activeIndex;
	  var activeIndex = _ref$activeIndex === undefined ? -1 : _ref$activeIndex;
	  var activeStyle = _ref.activeStyle;
	  var autoEscape = _ref.autoEscape;
	  var _ref$caseSensitive = _ref.caseSensitive;
	  var caseSensitive = _ref$caseSensitive === undefined ? false : _ref$caseSensitive;
	  var className = _ref.className;
	  var findChunks = _ref.findChunks;
	  var _ref$highlightClassName = _ref.highlightClassName;
	  var highlightClassName = _ref$highlightClassName === undefined ? '' : _ref$highlightClassName;
	  var _ref$highlightStyle = _ref.highlightStyle;
	  var highlightStyle = _ref$highlightStyle === undefined ? {} : _ref$highlightStyle;
	  var _ref$highlightTag = _ref.highlightTag;
	  var highlightTag = _ref$highlightTag === undefined ? 'mark' : _ref$highlightTag;
	  var sanitize = _ref.sanitize;
	  var searchWords = _ref.searchWords;
	  var textToHighlight = _ref.textToHighlight;
	  var _ref$unhighlightTag = _ref.unhighlightTag;
	  var unhighlightTag = _ref$unhighlightTag === undefined ? 'span' : _ref$unhighlightTag;
	  var _ref$unhighlightClassName = _ref.unhighlightClassName;
	  var unhighlightClassName = _ref$unhighlightClassName === undefined ? '' : _ref$unhighlightClassName;
	  var unhighlightStyle = _ref.unhighlightStyle;
	
	  var rest = _objectWithoutProperties(_ref, ['activeClassName', 'activeIndex', 'activeStyle', 'autoEscape', 'caseSensitive', 'className', 'findChunks', 'highlightClassName', 'highlightStyle', 'highlightTag', 'sanitize', 'searchWords', 'textToHighlight', 'unhighlightTag', 'unhighlightClassName', 'unhighlightStyle']);
	
	  var chunks = (0, _highlightWordsCore.findAll)({
	    autoEscape: autoEscape,
	    caseSensitive: caseSensitive,
	    findChunks: findChunks,
	    sanitize: sanitize,
	    searchWords: searchWords,
	    textToHighlight: textToHighlight
	  });
	  var HighlightTag = highlightTag;
	  var highlightIndex = -1;
	  var highlightClassNames = '';
	  var highlightStyles = undefined;
	
	  var lowercaseProps = function lowercaseProps(object) {
	    var mapped = {};
	    for (var key in object) {
	      mapped[key.toLowerCase()] = object[key];
	    }
	    return mapped;
	  };
	  var memoizedLowercaseProps = (0, _memoizeOne2['default'])(lowercaseProps);
	
	  return (0, _react.createElement)('span', _extends({
	    className: className
	  }, rest, {
	    children: chunks.map(function (chunk, index) {
	      var text = textToHighlight.substr(chunk.start, chunk.end - chunk.start);
	
	      if (chunk.highlight) {
	        highlightIndex++;
	
	        var highlightClass = undefined;
	        if (typeof highlightClassName === 'object') {
	          if (!caseSensitive) {
	            highlightClassName = memoizedLowercaseProps(highlightClassName);
	            highlightClass = highlightClassName[text.toLowerCase()];
	          } else {
	            highlightClass = highlightClassName[text];
	          }
	        } else {
	          highlightClass = highlightClassName;
	        }
	
	        var isActive = highlightIndex === +activeIndex;
	
	        highlightClassNames = highlightClass + ' ' + (isActive ? activeClassName : '');
	        highlightStyles = isActive === true && activeStyle != null ? Object.assign({}, highlightStyle, activeStyle) : highlightStyle;
	
	        var props = {
	          children: text,
	          className: highlightClassNames,
	          key: index,
	          style: highlightStyles
	        };
	
	        // Don't attach arbitrary props to DOM elements; this triggers React DEV warnings (https://fb.me/react-unknown-prop)
	        // Only pass through the highlightIndex attribute for custom components.
	        if (typeof HighlightTag !== 'string') {
	          props.highlightIndex = highlightIndex;
	        }
	
	        return (0, _react.createElement)(HighlightTag, props);
	      } else {
	        return (0, _react.createElement)(unhighlightTag, {
	          children: text,
	          className: unhighlightClassName,
	          key: index,
	          style: unhighlightStyle
	        });
	      }
	    })
	  }));
	}
	
	module.exports = exports['default'];

/***/ }),
/* 3 */
/***/ (function(module, exports) {

	module.exports =
	/******/ (function(modules) { // webpackBootstrap
	/******/ 	// The module cache
	/******/ 	var installedModules = {};
	/******/
	/******/ 	// The require function
	/******/ 	function __nested_webpack_require_8969__(moduleId) {
	/******/
	/******/ 		// Check if module is in cache
	/******/ 		if(installedModules[moduleId])
	/******/ 			return installedModules[moduleId].exports;
	/******/
	/******/ 		// Create a new module (and put it into the cache)
	/******/ 		var module = installedModules[moduleId] = {
	/******/ 			exports: {},
	/******/ 			id: moduleId,
	/******/ 			loaded: false
	/******/ 		};
	/******/
	/******/ 		// Execute the module function
	/******/ 		modules[moduleId].call(module.exports, module, module.exports, __nested_webpack_require_8969__);
	/******/
	/******/ 		// Flag the module as loaded
	/******/ 		module.loaded = true;
	/******/
	/******/ 		// Return the exports of the module
	/******/ 		return module.exports;
	/******/ 	}
	/******/
	/******/
	/******/ 	// expose the modules object (__webpack_modules__)
	/******/ 	__nested_webpack_require_8969__.m = modules;
	/******/
	/******/ 	// expose the module cache
	/******/ 	__nested_webpack_require_8969__.c = installedModules;
	/******/
	/******/ 	// __webpack_public_path__
	/******/ 	__nested_webpack_require_8969__.p = "";
	/******/
	/******/ 	// Load entry module and return exports
	/******/ 	return __nested_webpack_require_8969__(0);
	/******/ })
	/************************************************************************/
	/******/ ([
	/* 0 */
	/***/ (function(module, exports, __nested_webpack_require_10289__) {
	
		module.exports = __nested_webpack_require_10289__(1);
	
	
	/***/ }),
	/* 1 */
	/***/ (function(module, exports, __nested_webpack_require_10415__) {
	
		'use strict';
		
		Object.defineProperty(exports, "__esModule", {
		  value: true
		});
		
		var _utils = __nested_webpack_require_10415__(2);
		
		Object.defineProperty(exports, 'combineChunks', {
		  enumerable: true,
		  get: function get() {
		    return _utils.combineChunks;
		  }
		});
		Object.defineProperty(exports, 'fillInChunks', {
		  enumerable: true,
		  get: function get() {
		    return _utils.fillInChunks;
		  }
		});
		Object.defineProperty(exports, 'findAll', {
		  enumerable: true,
		  get: function get() {
		    return _utils.findAll;
		  }
		});
		Object.defineProperty(exports, 'findChunks', {
		  enumerable: true,
		  get: function get() {
		    return _utils.findChunks;
		  }
		});
	
	/***/ }),
	/* 2 */
	/***/ (function(module, exports) {
	
		'use strict';
		
		Object.defineProperty(exports, "__esModule", {
		  value: true
		});
		/**
		 * Creates an array of chunk objects representing both higlightable and non highlightable pieces of text that match each search word.
		 * @return Array of "chunks" (where a Chunk is { start:number, end:number, highlight:boolean })
		 */
		var findAll = exports.findAll = function findAll(_ref) {
		  var autoEscape = _ref.autoEscape,
		      _ref$caseSensitive = _ref.caseSensitive,
		      caseSensitive = _ref$caseSensitive === undefined ? false : _ref$caseSensitive,
		      _ref$findChunks = _ref.findChunks,
		      findChunks = _ref$findChunks === undefined ? defaultFindChunks : _ref$findChunks,
		      sanitize = _ref.sanitize,
		      searchWords = _ref.searchWords,
		      textToHighlight = _ref.textToHighlight;
		  return fillInChunks({
		    chunksToHighlight: combineChunks({
		      chunks: findChunks({
		        autoEscape: autoEscape,
		        caseSensitive: caseSensitive,
		        sanitize: sanitize,
		        searchWords: searchWords,
		        textToHighlight: textToHighlight
		      })
		    }),
		    totalLength: textToHighlight ? textToHighlight.length : 0
		  });
		};
		
		/**
		 * Takes an array of {start:number, end:number} objects and combines chunks that overlap into single chunks.
		 * @return {start:number, end:number}[]
		 */
		var combineChunks = exports.combineChunks = function combineChunks(_ref2) {
		  var chunks = _ref2.chunks;
		
		  chunks = chunks.sort(function (first, second) {
		    return first.start - second.start;
		  }).reduce(function (processedChunks, nextChunk) {
		    // First chunk just goes straight in the array...
		    if (processedChunks.length === 0) {
		      return [nextChunk];
		    } else {
		      // ... subsequent chunks get checked to see if they overlap...
		      var prevChunk = processedChunks.pop();
		      if (nextChunk.start <= prevChunk.end) {
		        // It may be the case that prevChunk completely surrounds nextChunk, so take the
		        // largest of the end indeces.
		        var endIndex = Math.max(prevChunk.end, nextChunk.end);
		        processedChunks.push({ start: prevChunk.start, end: endIndex });
		      } else {
		        processedChunks.push(prevChunk, nextChunk);
		      }
		      return processedChunks;
		    }
		  }, []);
		
		  return chunks;
		};
		
		/**
		 * Examine text for any matches.
		 * If we find matches, add them to the returned array as a "chunk" object ({start:number, end:number}).
		 * @return {start:number, end:number}[]
		 */
		var defaultFindChunks = function defaultFindChunks(_ref3) {
		  var autoEscape = _ref3.autoEscape,
		      caseSensitive = _ref3.caseSensitive,
		      _ref3$sanitize = _ref3.sanitize,
		      sanitize = _ref3$sanitize === undefined ? identity : _ref3$sanitize,
		      searchWords = _ref3.searchWords,
		      textToHighlight = _ref3.textToHighlight;
		
		  textToHighlight = sanitize(textToHighlight);
		
		  return searchWords.filter(function (searchWord) {
		    return searchWord;
		  }) // Remove empty words
		  .reduce(function (chunks, searchWord) {
		    searchWord = sanitize(searchWord);
		
		    if (autoEscape) {
		      searchWord = escapeRegExpFn(searchWord);
		    }
		
		    var regex = new RegExp(searchWord, caseSensitive ? 'g' : 'gi');
		
		    var match = void 0;
		    while (match = regex.exec(textToHighlight)) {
		      var start = match.index;
		      var end = regex.lastIndex;
		      // We do not return zero-length matches
		      if (end > start) {
		        chunks.push({ start: start, end: end });
		      }
		
		      // Prevent browsers like Firefox from getting stuck in an infinite loop
		      // See http://www.regexguru.com/2008/04/watch-out-for-zero-length-matches/
		      if (match.index == regex.lastIndex) {
		        regex.lastIndex++;
		      }
		    }
		
		    return chunks;
		  }, []);
		};
		// Allow the findChunks to be overridden in findAll,
		// but for backwards compatibility we export as the old name
		exports.findChunks = defaultFindChunks;
		
		/**
		 * Given a set of chunks to highlight, create an additional set of chunks
		 * to represent the bits of text between the highlighted text.
		 * @param chunksToHighlight {start:number, end:number}[]
		 * @param totalLength number
		 * @return {start:number, end:number, highlight:boolean}[]
		 */
		
		var fillInChunks = exports.fillInChunks = function fillInChunks(_ref4) {
		  var chunksToHighlight = _ref4.chunksToHighlight,
		      totalLength = _ref4.totalLength;
		
		  var allChunks = [];
		  var append = function append(start, end, highlight) {
		    if (end - start > 0) {
		      allChunks.push({
		        start: start,
		        end: end,
		        highlight: highlight
		      });
		    }
		  };
		
		  if (chunksToHighlight.length === 0) {
		    append(0, totalLength, false);
		  } else {
		    var lastIndex = 0;
		    chunksToHighlight.forEach(function (chunk) {
		      append(lastIndex, chunk.start, false);
		      append(chunk.start, chunk.end, true);
		      lastIndex = chunk.end;
		    });
		    append(lastIndex, totalLength, false);
		  }
		  return allChunks;
		};
		
		function identity(value) {
		  return value;
		}
		
		function escapeRegExpFn(str) {
		  return str.replace(/[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g, '\\$&');
		}
	
	/***/ })
	/******/ ]);
	//# sourceMappingURL=index.js.map

/***/ }),
/* 4 */
/***/ (function(module, exports, __nested_webpack_require_16653__) {

	/* WEBPACK VAR INJECTION */(function(process) {/**
	 * Copyright (c) 2013-present, Facebook, Inc.
	 *
	 * This source code is licensed under the MIT license found in the
	 * LICENSE file in the root directory of this source tree.
	 */
	
	if (process.env.NODE_ENV !== 'production') {
	  var REACT_ELEMENT_TYPE = (typeof Symbol === 'function' &&
	    Symbol.for &&
	    Symbol.for('react.element')) ||
	    0xeac7;
	
	  var isValidElement = function(object) {
	    return typeof object === 'object' &&
	      object !== null &&
	      object.$$typeof === REACT_ELEMENT_TYPE;
	  };
	
	  // By explicitly using `prop-types` you are opting into new development behavior.
	  // http://fb.me/prop-types-in-prod
	  var throwOnDirectAccess = true;
	  module.exports = __nested_webpack_require_16653__(6)(isValidElement, throwOnDirectAccess);
	} else {
	  // By explicitly using `prop-types` you are opting into new production behavior.
	  // http://fb.me/prop-types-in-prod
	  module.exports = __nested_webpack_require_16653__(13)();
	}
	
	/* WEBPACK VAR INJECTION */}.call(exports, __nested_webpack_require_16653__(5)))

/***/ }),
/* 5 */
/***/ (function(module, exports) {

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
/* 6 */
/***/ (function(module, exports, __nested_webpack_require_23461__) {

	/* WEBPACK VAR INJECTION */(function(process) {/**
	 * Copyright (c) 2013-present, Facebook, Inc.
	 *
	 * This source code is licensed under the MIT license found in the
	 * LICENSE file in the root directory of this source tree.
	 */
	
	'use strict';
	
	var emptyFunction = __nested_webpack_require_23461__(7);
	var invariant = __nested_webpack_require_23461__(8);
	var warning = __nested_webpack_require_23461__(9);
	var assign = __nested_webpack_require_23461__(10);
	
	var ReactPropTypesSecret = __nested_webpack_require_23461__(11);
	var checkPropTypes = __nested_webpack_require_23461__(12);
	
	module.exports = function(isValidElement, throwOnDirectAccess) {
	  /* global Symbol */
	  var ITERATOR_SYMBOL = typeof Symbol === 'function' && Symbol.iterator;
	  var FAUX_ITERATOR_SYMBOL = '@@iterator'; // Before Symbol spec.
	
	  /**
	   * Returns the iterator method function contained on the iterable object.
	   *
	   * Be sure to invoke the function with the iterable as context:
	   *
	   *     var iteratorFn = getIteratorFn(myIterable);
	   *     if (iteratorFn) {
	   *       var iterator = iteratorFn.call(myIterable);
	   *       ...
	   *     }
	   *
	   * @param {?object} maybeIterable
	   * @return {?function}
	   */
	  function getIteratorFn(maybeIterable) {
	    var iteratorFn = maybeIterable && (ITERATOR_SYMBOL && maybeIterable[ITERATOR_SYMBOL] || maybeIterable[FAUX_ITERATOR_SYMBOL]);
	    if (typeof iteratorFn === 'function') {
	      return iteratorFn;
	    }
	  }
	
	  /**
	   * Collection of methods that allow declaration and validation of props that are
	   * supplied to React components. Example usage:
	   *
	   *   var Props = require('ReactPropTypes');
	   *   var MyArticle = React.createClass({
	   *     propTypes: {
	   *       // An optional string prop named "description".
	   *       description: Props.string,
	   *
	   *       // A required enum prop named "category".
	   *       category: Props.oneOf(['News','Photos']).isRequired,
	   *
	   *       // A prop named "dialog" that requires an instance of Dialog.
	   *       dialog: Props.instanceOf(Dialog).isRequired
	   *     },
	   *     render: function() { ... }
	   *   });
	   *
	   * A more formal specification of how these methods are used:
	   *
	   *   type := array|bool|func|object|number|string|oneOf([...])|instanceOf(...)
	   *   decl := ReactPropTypes.{type}(.isRequired)?
	   *
	   * Each and every declaration produces a function with the same signature. This
	   * allows the creation of custom validation functions. For example:
	   *
	   *  var MyLink = React.createClass({
	   *    propTypes: {
	   *      // An optional string or URI prop named "href".
	   *      href: function(props, propName, componentName) {
	   *        var propValue = props[propName];
	   *        if (propValue != null && typeof propValue !== 'string' &&
	   *            !(propValue instanceof URI)) {
	   *          return new Error(
	   *            'Expected a string or an URI for ' + propName + ' in ' +
	   *            componentName
	   *          );
	   *        }
	   *      }
	   *    },
	   *    render: function() {...}
	   *  });
	   *
	   * @internal
	   */
	
	  var ANONYMOUS = '<<anonymous>>';
	
	  // Important!
	  // Keep this list in sync with production version in `./factoryWithThrowingShims.js`.
	  var ReactPropTypes = {
	    array: createPrimitiveTypeChecker('array'),
	    bool: createPrimitiveTypeChecker('boolean'),
	    func: createPrimitiveTypeChecker('function'),
	    number: createPrimitiveTypeChecker('number'),
	    object: createPrimitiveTypeChecker('object'),
	    string: createPrimitiveTypeChecker('string'),
	    symbol: createPrimitiveTypeChecker('symbol'),
	
	    any: createAnyTypeChecker(),
	    arrayOf: createArrayOfTypeChecker,
	    element: createElementTypeChecker(),
	    instanceOf: createInstanceTypeChecker,
	    node: createNodeChecker(),
	    objectOf: createObjectOfTypeChecker,
	    oneOf: createEnumTypeChecker,
	    oneOfType: createUnionTypeChecker,
	    shape: createShapeTypeChecker,
	    exact: createStrictShapeTypeChecker,
	  };
	
	  /**
	   * inlined Object.is polyfill to avoid requiring consumers ship their own
	   * https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/is
	   */
	  /*eslint-disable no-self-compare*/
	  function is(x, y) {
	    // SameValue algorithm
	    if (x === y) {
	      // Steps 1-5, 7-10
	      // Steps 6.b-6.e: +0 != -0
	      return x !== 0 || 1 / x === 1 / y;
	    } else {
	      // Step 6.a: NaN == NaN
	      return x !== x && y !== y;
	    }
	  }
	  /*eslint-enable no-self-compare*/
	
	  /**
	   * We use an Error-like object for backward compatibility as people may call
	   * PropTypes directly and inspect their output. However, we don't use real
	   * Errors anymore. We don't inspect their stack anyway, and creating them
	   * is prohibitively expensive if they are created too often, such as what
	   * happens in oneOfType() for any type before the one that matched.
	   */
	  function PropTypeError(message) {
	    this.message = message;
	    this.stack = '';
	  }
	  // Make `instanceof Error` still work for returned errors.
	  PropTypeError.prototype = Error.prototype;
	
	  function createChainableTypeChecker(validate) {
	    if (process.env.NODE_ENV !== 'production') {
	      var manualPropTypeCallCache = {};
	      var manualPropTypeWarningCount = 0;
	    }
	    function checkType(isRequired, props, propName, componentName, location, propFullName, secret) {
	      componentName = componentName || ANONYMOUS;
	      propFullName = propFullName || propName;
	
	      if (secret !== ReactPropTypesSecret) {
	        if (throwOnDirectAccess) {
	          // New behavior only for users of `prop-types` package
	          invariant(
	            false,
	            'Calling PropTypes validators directly is not supported by the `prop-types` package. ' +
	            'Use `PropTypes.checkPropTypes()` to call them. ' +
	            'Read more at http://fb.me/use-check-prop-types'
	          );
	        } else if (process.env.NODE_ENV !== 'production' && typeof console !== 'undefined') {
	          // Old behavior for people using React.PropTypes
	          var cacheKey = componentName + ':' + propName;
	          if (
	            !manualPropTypeCallCache[cacheKey] &&
	            // Avoid spamming the console because they are often not actionable except for lib authors
	            manualPropTypeWarningCount < 3
	          ) {
	            warning(
	              false,
	              'You are manually calling a React.PropTypes validation ' +
	              'function for the `%s` prop on `%s`. This is deprecated ' +
	              'and will throw in the standalone `prop-types` package. ' +
	              'You may be seeing this warning due to a third-party PropTypes ' +
	              'library. See https://fb.me/react-warning-dont-call-proptypes ' + 'for details.',
	              propFullName,
	              componentName
	            );
	            manualPropTypeCallCache[cacheKey] = true;
	            manualPropTypeWarningCount++;
	          }
	        }
	      }
	      if (props[propName] == null) {
	        if (isRequired) {
	          if (props[propName] === null) {
	            return new PropTypeError('The ' + location + ' `' + propFullName + '` is marked as required ' + ('in `' + componentName + '`, but its value is `null`.'));
	          }
	          return new PropTypeError('The ' + location + ' `' + propFullName + '` is marked as required in ' + ('`' + componentName + '`, but its value is `undefined`.'));
	        }
	        return null;
	      } else {
	        return validate(props, propName, componentName, location, propFullName);
	      }
	    }
	
	    var chainedCheckType = checkType.bind(null, false);
	    chainedCheckType.isRequired = checkType.bind(null, true);
	
	    return chainedCheckType;
	  }
	
	  function createPrimitiveTypeChecker(expectedType) {
	    function validate(props, propName, componentName, location, propFullName, secret) {
	      var propValue = props[propName];
	      var propType = getPropType(propValue);
	      if (propType !== expectedType) {
	        // `propValue` being instance of, say, date/regexp, pass the 'object'
	        // check, but we can offer a more precise error message here rather than
	        // 'of type `object`'.
	        var preciseType = getPreciseType(propValue);
	
	        return new PropTypeError('Invalid ' + location + ' `' + propFullName + '` of type ' + ('`' + preciseType + '` supplied to `' + componentName + '`, expected ') + ('`' + expectedType + '`.'));
	      }
	      return null;
	    }
	    return createChainableTypeChecker(validate);
	  }
	
	  function createAnyTypeChecker() {
	    return createChainableTypeChecker(emptyFunction.thatReturnsNull);
	  }
	
	  function createArrayOfTypeChecker(typeChecker) {
	    function validate(props, propName, componentName, location, propFullName) {
	      if (typeof typeChecker !== 'function') {
	        return new PropTypeError('Property `' + propFullName + '` of component `' + componentName + '` has invalid PropType notation inside arrayOf.');
	      }
	      var propValue = props[propName];
	      if (!Array.isArray(propValue)) {
	        var propType = getPropType(propValue);
	        return new PropTypeError('Invalid ' + location + ' `' + propFullName + '` of type ' + ('`' + propType + '` supplied to `' + componentName + '`, expected an array.'));
	      }
	      for (var i = 0; i < propValue.length; i++) {
	        var error = typeChecker(propValue, i, componentName, location, propFullName + '[' + i + ']', ReactPropTypesSecret);
	        if (error instanceof Error) {
	          return error;
	        }
	      }
	      return null;
	    }
	    return createChainableTypeChecker(validate);
	  }
	
	  function createElementTypeChecker() {
	    function validate(props, propName, componentName, location, propFullName) {
	      var propValue = props[propName];
	      if (!isValidElement(propValue)) {
	        var propType = getPropType(propValue);
	        return new PropTypeError('Invalid ' + location + ' `' + propFullName + '` of type ' + ('`' + propType + '` supplied to `' + componentName + '`, expected a single ReactElement.'));
	      }
	      return null;
	    }
	    return createChainableTypeChecker(validate);
	  }
	
	  function createInstanceTypeChecker(expectedClass) {
	    function validate(props, propName, componentName, location, propFullName) {
	      if (!(props[propName] instanceof expectedClass)) {
	        var expectedClassName = expectedClass.name || ANONYMOUS;
	        var actualClassName = getClassName(props[propName]);
	        return new PropTypeError('Invalid ' + location + ' `' + propFullName + '` of type ' + ('`' + actualClassName + '` supplied to `' + componentName + '`, expected ') + ('instance of `' + expectedClassName + '`.'));
	      }
	      return null;
	    }
	    return createChainableTypeChecker(validate);
	  }
	
	  function createEnumTypeChecker(expectedValues) {
	    if (!Array.isArray(expectedValues)) {
	      process.env.NODE_ENV !== 'production' ? warning(false, 'Invalid argument supplied to oneOf, expected an instance of array.') : void 0;
	      return emptyFunction.thatReturnsNull;
	    }
	
	    function validate(props, propName, componentName, location, propFullName) {
	      var propValue = props[propName];
	      for (var i = 0; i < expectedValues.length; i++) {
	        if (is(propValue, expectedValues[i])) {
	          return null;
	        }
	      }
	
	      var valuesString = JSON.stringify(expectedValues);
	      return new PropTypeError('Invalid ' + location + ' `' + propFullName + '` of value `' + propValue + '` ' + ('supplied to `' + componentName + '`, expected one of ' + valuesString + '.'));
	    }
	    return createChainableTypeChecker(validate);
	  }
	
	  function createObjectOfTypeChecker(typeChecker) {
	    function validate(props, propName, componentName, location, propFullName) {
	      if (typeof typeChecker !== 'function') {
	        return new PropTypeError('Property `' + propFullName + '` of component `' + componentName + '` has invalid PropType notation inside objectOf.');
	      }
	      var propValue = props[propName];
	      var propType = getPropType(propValue);
	      if (propType !== 'object') {
	        return new PropTypeError('Invalid ' + location + ' `' + propFullName + '` of type ' + ('`' + propType + '` supplied to `' + componentName + '`, expected an object.'));
	      }
	      for (var key in propValue) {
	        if (propValue.hasOwnProperty(key)) {
	          var error = typeChecker(propValue, key, componentName, location, propFullName + '.' + key, ReactPropTypesSecret);
	          if (error instanceof Error) {
	            return error;
	          }
	        }
	      }
	      return null;
	    }
	    return createChainableTypeChecker(validate);
	  }
	
	  function createUnionTypeChecker(arrayOfTypeCheckers) {
	    if (!Array.isArray(arrayOfTypeCheckers)) {
	      process.env.NODE_ENV !== 'production' ? warning(false, 'Invalid argument supplied to oneOfType, expected an instance of array.') : void 0;
	      return emptyFunction.thatReturnsNull;
	    }
	
	    for (var i = 0; i < arrayOfTypeCheckers.length; i++) {
	      var checker = arrayOfTypeCheckers[i];
	      if (typeof checker !== 'function') {
	        warning(
	          false,
	          'Invalid argument supplied to oneOfType. Expected an array of check functions, but ' +
	          'received %s at index %s.',
	          getPostfixForTypeWarning(checker),
	          i
	        );
	        return emptyFunction.thatReturnsNull;
	      }
	    }
	
	    function validate(props, propName, componentName, location, propFullName) {
	      for (var i = 0; i < arrayOfTypeCheckers.length; i++) {
	        var checker = arrayOfTypeCheckers[i];
	        if (checker(props, propName, componentName, location, propFullName, ReactPropTypesSecret) == null) {
	          return null;
	        }
	      }
	
	      return new PropTypeError('Invalid ' + location + ' `' + propFullName + '` supplied to ' + ('`' + componentName + '`.'));
	    }
	    return createChainableTypeChecker(validate);
	  }
	
	  function createNodeChecker() {
	    function validate(props, propName, componentName, location, propFullName) {
	      if (!isNode(props[propName])) {
	        return new PropTypeError('Invalid ' + location + ' `' + propFullName + '` supplied to ' + ('`' + componentName + '`, expected a ReactNode.'));
	      }
	      return null;
	    }
	    return createChainableTypeChecker(validate);
	  }
	
	  function createShapeTypeChecker(shapeTypes) {
	    function validate(props, propName, componentName, location, propFullName) {
	      var propValue = props[propName];
	      var propType = getPropType(propValue);
	      if (propType !== 'object') {
	        return new PropTypeError('Invalid ' + location + ' `' + propFullName + '` of type `' + propType + '` ' + ('supplied to `' + componentName + '`, expected `object`.'));
	      }
	      for (var key in shapeTypes) {
	        var checker = shapeTypes[key];
	        if (!checker) {
	          continue;
	        }
	        var error = checker(propValue, key, componentName, location, propFullName + '.' + key, ReactPropTypesSecret);
	        if (error) {
	          return error;
	        }
	      }
	      return null;
	    }
	    return createChainableTypeChecker(validate);
	  }
	
	  function createStrictShapeTypeChecker(shapeTypes) {
	    function validate(props, propName, componentName, location, propFullName) {
	      var propValue = props[propName];
	      var propType = getPropType(propValue);
	      if (propType !== 'object') {
	        return new PropTypeError('Invalid ' + location + ' `' + propFullName + '` of type `' + propType + '` ' + ('supplied to `' + componentName + '`, expected `object`.'));
	      }
	      // We need to check all keys in case some are required but missing from
	      // props.
	      var allKeys = assign({}, props[propName], shapeTypes);
	      for (var key in allKeys) {
	        var checker = shapeTypes[key];
	        if (!checker) {
	          return new PropTypeError(
	            'Invalid ' + location + ' `' + propFullName + '` key `' + key + '` supplied to `' + componentName + '`.' +
	            '\nBad object: ' + JSON.stringify(props[propName], null, '  ') +
	            '\nValid keys: ' +  JSON.stringify(Object.keys(shapeTypes), null, '  ')
	          );
	        }
	        var error = checker(propValue, key, componentName, location, propFullName + '.' + key, ReactPropTypesSecret);
	        if (error) {
	          return error;
	        }
	      }
	      return null;
	    }
	
	    return createChainableTypeChecker(validate);
	  }
	
	  function isNode(propValue) {
	    switch (typeof propValue) {
	      case 'number':
	      case 'string':
	      case 'undefined':
	        return true;
	      case 'boolean':
	        return !propValue;
	      case 'object':
	        if (Array.isArray(propValue)) {
	          return propValue.every(isNode);
	        }
	        if (propValue === null || isValidElement(propValue)) {
	          return true;
	        }
	
	        var iteratorFn = getIteratorFn(propValue);
	        if (iteratorFn) {
	          var iterator = iteratorFn.call(propValue);
	          var step;
	          if (iteratorFn !== propValue.entries) {
	            while (!(step = iterator.next()).done) {
	              if (!isNode(step.value)) {
	                return false;
	              }
	            }
	          } else {
	            // Iterator will provide entry [k,v] tuples rather than values.
	            while (!(step = iterator.next()).done) {
	              var entry = step.value;
	              if (entry) {
	                if (!isNode(entry[1])) {
	                  return false;
	                }
	              }
	            }
	          }
	        } else {
	          return false;
	        }
	
	        return true;
	      default:
	        return false;
	    }
	  }
	
	  function isSymbol(propType, propValue) {
	    // Native Symbol.
	    if (propType === 'symbol') {
	      return true;
	    }
	
	    // 19.4.3.5 Symbol.prototype[@@toStringTag] === 'Symbol'
	    if (propValue['@@toStringTag'] === 'Symbol') {
	      return true;
	    }
	
	    // Fallback for non-spec compliant Symbols which are polyfilled.
	    if (typeof Symbol === 'function' && propValue instanceof Symbol) {
	      return true;
	    }
	
	    return false;
	  }
	
	  // Equivalent of `typeof` but with special handling for array and regexp.
	  function getPropType(propValue) {
	    var propType = typeof propValue;
	    if (Array.isArray(propValue)) {
	      return 'array';
	    }
	    if (propValue instanceof RegExp) {
	      // Old webkits (at least until Android 4.0) return 'function' rather than
	      // 'object' for typeof a RegExp. We'll normalize this here so that /bla/
	      // passes PropTypes.object.
	      return 'object';
	    }
	    if (isSymbol(propType, propValue)) {
	      return 'symbol';
	    }
	    return propType;
	  }
	
	  // This handles more types than `getPropType`. Only used for error messages.
	  // See `createPrimitiveTypeChecker`.
	  function getPreciseType(propValue) {
	    if (typeof propValue === 'undefined' || propValue === null) {
	      return '' + propValue;
	    }
	    var propType = getPropType(propValue);
	    if (propType === 'object') {
	      if (propValue instanceof Date) {
	        return 'date';
	      } else if (propValue instanceof RegExp) {
	        return 'regexp';
	      }
	    }
	    return propType;
	  }
	
	  // Returns a string that is postfixed to a warning about an invalid type.
	  // For example, "undefined" or "of type array"
	  function getPostfixForTypeWarning(value) {
	    var type = getPreciseType(value);
	    switch (type) {
	      case 'array':
	      case 'object':
	        return 'an ' + type;
	      case 'boolean':
	      case 'date':
	      case 'regexp':
	        return 'a ' + type;
	      default:
	        return type;
	    }
	  }
	
	  // Returns class name of the object, if any.
	  function getClassName(propValue) {
	    if (!propValue.constructor || !propValue.constructor.name) {
	      return ANONYMOUS;
	    }
	    return propValue.constructor.name;
	  }
	
	  ReactPropTypes.checkPropTypes = checkPropTypes;
	  ReactPropTypes.PropTypes = ReactPropTypes;
	
	  return ReactPropTypes;
	};
	
	/* WEBPACK VAR INJECTION */}.call(exports, __nested_webpack_require_23461__(5)))

/***/ }),
/* 7 */
/***/ (function(module, exports) {

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
/* 8 */
/***/ (function(module, exports, __nested_webpack_require_45053__) {

	/* WEBPACK VAR INJECTION */(function(process) {/**
	 * Copyright (c) 2013-present, Facebook, Inc.
	 *
	 * This source code is licensed under the MIT license found in the
	 * LICENSE file in the root directory of this source tree.
	 *
	 */
	
	'use strict';
	
	/**
	 * Use invariant() to assert state which your program assumes to be true.
	 *
	 * Provide sprintf-style format (only %s is supported) and arguments
	 * to provide information about what broke and what you were
	 * expecting.
	 *
	 * The invariant message will be stripped in production, but the invariant
	 * will remain to ensure logic does not differ in production.
	 */
	
	var validateFormat = function validateFormat(format) {};
	
	if (process.env.NODE_ENV !== 'production') {
	  validateFormat = function validateFormat(format) {
	    if (format === undefined) {
	      throw new Error('invariant requires an error message argument');
	    }
	  };
	}
	
	function invariant(condition, format, a, b, c, d, e, f) {
	  validateFormat(format);
	
	  if (!condition) {
	    var error;
	    if (format === undefined) {
	      error = new Error('Minified exception occurred; use the non-minified dev environment ' + 'for the full error message and additional helpful warnings.');
	    } else {
	      var args = [a, b, c, d, e, f];
	      var argIndex = 0;
	      error = new Error(format.replace(/%s/g, function () {
	        return args[argIndex++];
	      }));
	      error.name = 'Invariant Violation';
	    }
	
	    error.framesToPop = 1; // we don't care about invariant's own frame
	    throw error;
	  }
	}
	
	module.exports = invariant;
	/* WEBPACK VAR INJECTION */}.call(exports, __nested_webpack_require_45053__(5)))

/***/ }),
/* 9 */
/***/ (function(module, exports, __nested_webpack_require_46805__) {

	/* WEBPACK VAR INJECTION */(function(process) {/**
	 * Copyright (c) 2014-present, Facebook, Inc.
	 *
	 * This source code is licensed under the MIT license found in the
	 * LICENSE file in the root directory of this source tree.
	 *
	 */
	
	'use strict';
	
	var emptyFunction = __nested_webpack_require_46805__(7);
	
	/**
	 * Similar to invariant but only logs a warning if the condition is not met.
	 * This can be used to log issues in development environments in critical
	 * paths. Removing the logging code for production environments will keep the
	 * same logic and follow the same code paths.
	 */
	
	var warning = emptyFunction;
	
	if (process.env.NODE_ENV !== 'production') {
	  var printWarning = function printWarning(format) {
	    for (var _len = arguments.length, args = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
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
	  };
	
	  warning = function warning(condition, format) {
	    if (format === undefined) {
	      throw new Error('`warning(condition, format, ...args)` requires a warning ' + 'message argument');
	    }
	
	    if (format.indexOf('Failed Composite propType: ') === 0) {
	      return; // Ignore CompositeComponent proptype check.
	    }
	
	    if (!condition) {
	      for (var _len2 = arguments.length, args = Array(_len2 > 2 ? _len2 - 2 : 0), _key2 = 2; _key2 < _len2; _key2++) {
	        args[_key2 - 2] = arguments[_key2];
	      }
	
	      printWarning.apply(undefined, [format].concat(args));
	    }
	  };
	}
	
	module.exports = warning;
	/* WEBPACK VAR INJECTION */}.call(exports, __nested_webpack_require_46805__(5)))

/***/ }),
/* 10 */
/***/ (function(module, exports) {

	/*
	object-assign
	(c) Sindre Sorhus
	@license MIT
	*/
	
	'use strict';
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
/* 11 */
/***/ (function(module, exports) {

	/**
	 * Copyright (c) 2013-present, Facebook, Inc.
	 *
	 * This source code is licensed under the MIT license found in the
	 * LICENSE file in the root directory of this source tree.
	 */
	
	'use strict';
	
	var ReactPropTypesSecret = 'SECRET_DO_NOT_PASS_THIS_OR_YOU_WILL_BE_FIRED';
	
	module.exports = ReactPropTypesSecret;


/***/ }),
/* 12 */
/***/ (function(module, exports, __nested_webpack_require_51592__) {

	/* WEBPACK VAR INJECTION */(function(process) {/**
	 * Copyright (c) 2013-present, Facebook, Inc.
	 *
	 * This source code is licensed under the MIT license found in the
	 * LICENSE file in the root directory of this source tree.
	 */
	
	'use strict';
	
	if (process.env.NODE_ENV !== 'production') {
	  var invariant = __nested_webpack_require_51592__(8);
	  var warning = __nested_webpack_require_51592__(9);
	  var ReactPropTypesSecret = __nested_webpack_require_51592__(11);
	  var loggedTypeFailures = {};
	}
	
	/**
	 * Assert that the values match with the type specs.
	 * Error messages are memorized and will only be shown once.
	 *
	 * @param {object} typeSpecs Map of name to a ReactPropType
	 * @param {object} values Runtime values that need to be type-checked
	 * @param {string} location e.g. "prop", "context", "child context"
	 * @param {string} componentName Name of the component for error messages.
	 * @param {?Function} getStack Returns the component stack.
	 * @private
	 */
	function checkPropTypes(typeSpecs, values, location, componentName, getStack) {
	  if (process.env.NODE_ENV !== 'production') {
	    for (var typeSpecName in typeSpecs) {
	      if (typeSpecs.hasOwnProperty(typeSpecName)) {
	        var error;
	        // Prop type validation may throw. In case they do, we don't want to
	        // fail the render phase where it didn't fail before. So we log it.
	        // After these have been cleaned up, we'll let them throw.
	        try {
	          // This is intentionally an invariant that gets caught. It's the same
	          // behavior as without this statement except with a better message.
	          invariant(typeof typeSpecs[typeSpecName] === 'function', '%s: %s type `%s` is invalid; it must be a function, usually from ' + 'the `prop-types` package, but received `%s`.', componentName || 'React class', location, typeSpecName, typeof typeSpecs[typeSpecName]);
	          error = typeSpecs[typeSpecName](values, typeSpecName, componentName, location, null, ReactPropTypesSecret);
	        } catch (ex) {
	          error = ex;
	        }
	        warning(!error || error instanceof Error, '%s: type specification of %s `%s` is invalid; the type checker ' + 'function must return `null` or an `Error` but returned a %s. ' + 'You may have forgotten to pass an argument to the type checker ' + 'creator (arrayOf, instanceOf, objectOf, oneOf, oneOfType, and ' + 'shape all require an argument).', componentName || 'React class', location, typeSpecName, typeof error);
	        if (error instanceof Error && !(error.message in loggedTypeFailures)) {
	          // Only monitor this failure once because there tends to be a lot of the
	          // same error.
	          loggedTypeFailures[error.message] = true;
	
	          var stack = getStack ? getStack() : '';
	
	          warning(false, 'Failed %s type: %s%s', location, error.message, stack != null ? stack : '');
	        }
	      }
	    }
	  }
	}
	
	module.exports = checkPropTypes;
	
	/* WEBPACK VAR INJECTION */}.call(exports, __nested_webpack_require_51592__(5)))

/***/ }),
/* 13 */
/***/ (function(module, exports, __nested_webpack_require_54693__) {

	/**
	 * Copyright (c) 2013-present, Facebook, Inc.
	 *
	 * This source code is licensed under the MIT license found in the
	 * LICENSE file in the root directory of this source tree.
	 */
	
	'use strict';
	
	var emptyFunction = __nested_webpack_require_54693__(7);
	var invariant = __nested_webpack_require_54693__(8);
	var ReactPropTypesSecret = __nested_webpack_require_54693__(11);
	
	module.exports = function() {
	  function shim(props, propName, componentName, location, propFullName, secret) {
	    if (secret === ReactPropTypesSecret) {
	      // It is still safe when called from React.
	      return;
	    }
	    invariant(
	      false,
	      'Calling PropTypes validators directly is not supported by the `prop-types` package. ' +
	      'Use PropTypes.checkPropTypes() to call them. ' +
	      'Read more at http://fb.me/use-check-prop-types'
	    );
	  };
	  shim.isRequired = shim;
	  function getShim() {
	    return shim;
	  };
	  // Important!
	  // Keep this list in sync with production version in `./factoryWithTypeCheckers.js`.
	  var ReactPropTypes = {
	    array: shim,
	    bool: shim,
	    func: shim,
	    number: shim,
	    object: shim,
	    string: shim,
	    symbol: shim,
	
	    any: shim,
	    arrayOf: getShim,
	    element: shim,
	    instanceOf: getShim,
	    node: shim,
	    objectOf: getShim,
	    oneOf: getShim,
	    oneOfType: getShim,
	    shape: getShim,
	    exact: getShim
	  };
	
	  ReactPropTypes.checkPropTypes = emptyFunction;
	  ReactPropTypes.PropTypes = ReactPropTypes;
	
	  return ReactPropTypes;
	};


/***/ }),
/* 14 */
/***/ (function(module, exports) {

	module.exports = __webpack_require__(/*! react */ "./node_modules/react/index.js");

/***/ }),
/* 15 */
/***/ (function(module, exports) {

	'use strict';
	
	var simpleIsEqual = function simpleIsEqual(a, b) {
	  return a === b;
	};
	
	function index (resultFn) {
	  var isEqual = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : simpleIsEqual;
	
	  var lastThis = void 0;
	  var lastArgs = [];
	  var lastResult = void 0;
	  var calledOnce = false;
	
	  var isNewArgEqualToLast = function isNewArgEqualToLast(newArg, index) {
	    return isEqual(newArg, lastArgs[index]);
	  };
	
	  var result = function result() {
	    for (var _len = arguments.length, newArgs = Array(_len), _key = 0; _key < _len; _key++) {
	      newArgs[_key] = arguments[_key];
	    }
	
	    if (calledOnce && lastThis === this && newArgs.length === lastArgs.length && newArgs.every(isNewArgEqualToLast)) {
	      return lastResult;
	    }
	
	    calledOnce = true;
	    lastThis = this;
	    lastArgs = newArgs;
	    lastResult = resultFn.apply(this, newArgs);
	    return lastResult;
	  };
	
	  return result;
	}
	
	module.exports = index;


/***/ })
/******/ ]);
//# sourceMappingURL=main.js.map

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


/***/ })

},
/******/ __webpack_require__ => { // webpackRuntimeModules
/******/ var __webpack_exec__ = (moduleId) => (__webpack_require__(__webpack_require__.s = moduleId))
/******/ __webpack_require__.O(0, ["/js/vendor"], () => (__webpack_exec__("./resources/js/react/GlobalSearchQuestionsSmallScreen/GlobalSearchQuestionsSmallScreen.js")));
/******/ var __webpack_exports__ = __webpack_require__.O();
/******/ }
]);