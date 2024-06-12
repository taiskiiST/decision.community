(self["webpackChunk"] = self["webpackChunk"] || []).push([["/js/ChildrenAndParentsInformationSchool"],{

/***/ "./resources/js/react/ChildrenAndParentsInformationSchool/ChildrenAndParentsInformationSchool.js":
/*!*******************************************************************************************************!*\
  !*** ./resources/js/react/ChildrenAndParentsInformationSchool/ChildrenAndParentsInformationSchool.js ***!
  \*******************************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "./node_modules/react/index.js");
/* harmony import */ var react_debounce_input__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! react-debounce-input */ "./node_modules/react-debounce-input/lib/index.js");
/* harmony import */ var react_debounce_input__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(react_debounce_input__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var uuid__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! uuid */ "./node_modules/uuid/dist/esm-browser/v4.js");
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! react/jsx-runtime */ "./node_modules/react/jsx-runtime.js");
function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _unsupportedIterableToArray(arr, i) || _nonIterableRest(); }
function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }
function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }
function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) arr2[i] = arr[i]; return arr2; }
function _iterableToArrayLimit(arr, i) { var _i = null == arr ? null : "undefined" != typeof Symbol && arr[Symbol.iterator] || arr["@@iterator"]; if (null != _i) { var _s, _e, _x, _r, _arr = [], _n = !0, _d = !1; try { if (_x = (_i = _i.call(arr)).next, 0 === i) { if (Object(_i) !== _i) return; _n = !1; } else for (; !(_n = (_s = _x.call(_i)).done) && (_arr.push(_s.value), _arr.length !== i); _n = !0); } catch (err) { _d = !0, _e = err; } finally { try { if (!_n && null != _i["return"] && (_r = _i["return"](), Object(_r) !== _r)) return; } finally { if (_d) throw _e; } } return _arr; } }
function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }





var CHILDREN_CHECK_NOT_VALID = 0;
var CHILDREN_CHECK_VALID = 1;
var CHILDREN_SEX_WOMAN = 'Жен';
var _ref = window.TSN || {},
  csrf_token = _ref.csrf_token;
var ChildrenAndParentsInformationSchool = function ChildrenAndParentsInformationSchool() {
  var childrenArr = [{
    id: (0,uuid__WEBPACK_IMPORTED_MODULE_3__["default"])(),
    name: '',
    sex: 'men',
    date_of_birthday: ''
  }];
  var _useState = (0,react__WEBPACK_IMPORTED_MODULE_0__.useState)(childrenArr),
    _useState2 = _slicedToArray(_useState, 2),
    children = _useState2[0],
    setChildren = _useState2[1];
  var _useState3 = (0,react__WEBPACK_IMPORTED_MODULE_0__.useState)({
      status: CHILDREN_CHECK_NOT_VALID,
      "class": 'bg-gray-600 hover:bg-gray-700'
    }),
    _useState4 = _slicedToArray(_useState3, 2),
    validationResult = _useState4[0],
    setValidationResult = _useState4[1];
  var _useState5 = (0,react__WEBPACK_IMPORTED_MODULE_0__.useState)(false),
    _useState6 = _slicedToArray(_useState5, 2),
    validFlagChild = _useState6[0],
    setValidFlagChild = _useState6[1];
  var _useState7 = (0,react__WEBPACK_IMPORTED_MODULE_0__.useState)(false),
    _useState8 = _slicedToArray(_useState7, 2),
    validFlagParent = _useState8[0],
    setValidFlagParent = _useState8[1];
  var validateChildren = function validateChildren(children) {
    var mapValidChildren = children.map(function (child, index) {
      if (child.name && child.name.length > 0 && child.date_of_birthday && child.date_of_birthday.length > 0) {
        return {
          status: CHILDREN_CHECK_VALID
        };
      } else {
        return {
          status: CHILDREN_CHECK_NOT_VALID
        };
      }
    });
    var localFlag = true;
    mapValidChildren.forEach(function (valid) {
      if (valid.status == 0) localFlag = false;
    });
    if (localFlag) {
      setValidFlagChild(true);
      globalValidate(true, validFlagParent);
    } else {
      setValidFlagChild(false);
      globalValidate(false, validFlagParent);
    }
  };
  var validateParent = function validateParent() {
    // if ( (document.getElementById('parent_name') && document.getElementById('parent_name').value.length > 0) &&
    //     (document.getElementById('parent_relationship') && document.getElementById('parent_relationship').value.length > 0) &&
    //     (document.getElementById('parent_address') && document.getElementById('parent_address').value.length > 0) &&
    //     (document.getElementById('parent_phone') && document.getElementById('parent_phone').value.length > 0) ) {
    //     setValidFlagParent (true );
    //     globalValidate(validFlagChild, true);
    // }else {
    //     setValidFlagParent (false);
    //     globalValidate(validFlagChild, false);
    // }
  };
  var globalValidate = function globalValidate(validFlagChild, validFlagParent) {
    if (validFlagChild && validFlagParent) {
      setValidationResult({
        status: CHILDREN_CHECK_VALID,
        "class": 'bg-green-600 hover:bg-green-700'
      });
    } else {
      setValidationResult({
        status: CHILDREN_CHECK_NOT_VALID,
        "class": 'bg-gray-600 hover:bg-gray-700'
      });
    }
  };
  var onChildNameChange = function onChildNameChange(e) {
    //  const newChildId = e.target.id;
    //  const newChildName = e.target.value;
    //
    //  const newChild = children.map((child, index) => {
    //      return index == newChildId
    //          ? {
    //              ...child,
    //              name: newChildName
    //          }
    //          : child;
    //
    //  });
    //
    //  setChildren(newChild);
    //
    //
    // validateChildren(newChild);
  };
  var onChildSexChange = function onChildSexChange(e) {
    // const newChildId = e.target.id;
    // const newChildSex = e.target.value;
    //
    // const newChild = children.map((child, index) => {
    //     return index == newChildId
    //         ? {
    //             ...child,
    //             sex: newChildSex
    //         }
    //         : child;
    //
    // });
    //
    // setChildren(newChild);
  };
  var onChildDateOfBirthdayChange = function onChildDateOfBirthdayChange(e) {
    // const newChildId = e.target.id;
    // const newChildDateOfBirthday = e.target.value;
    //
    // const newChild = children.map((child, index) => {
    //     return index == newChildId
    //         ? {
    //             ...child,
    //             date_of_birthday: newChildDateOfBirthday
    //         }
    //         : child;
    //
    // });
    //
    // setChildren(newChild);
    //
    // validateChildren(newChild);
  };
  var onSchoolInformationEdit = function onSchoolInformationEdit(e) {};
  var onChildAdd = function onChildAdd(e) {
    var newChildren = children;
    console.log(children);
    newChildren.push({
      id: (0,uuid__WEBPACK_IMPORTED_MODULE_3__["default"])(),
      name: '',
      sex: 'men',
      date_of_birthday: ''
    });
    setChildren(newChildren);
    validateChildren(newChildren);
  };
  var onDelChild = function onDelChild(e) {
    var childId = e.target.id;
    var newChildren = children.filter(function (_ref2) {
      var id = _ref2.id;
      return id !== childId;
    });
    setChildren(newChildren);
    validateChildren(newChildren);
  };
  return /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__.jsx)("div", {
    className: "container px-4",
    children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__.jsxs)("form", {
      id: "form_id",
      action: "/children-and-parents-information-school-submit",
      method: "POST",
      children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__.jsx)("input", {
        type: "hidden",
        name: "_token",
        value: csrf_token
      }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__.jsxs)("div", {
        className: "col-span-6 sm:col-span-3 mt-2 border-t-8 border-double border-gray-400",
        children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__.jsx)("h1", {
          className: "text-lg leading-6 font-bold text-gray-900 text-center mt-3",
          children: "\u0414\u0430\u043D\u043D\u044B\u0435 \u043E\u0442\u0432\u0435\u0442\u0441\u0442\u0432\u0435\u043D\u043D\u043E\u0433\u043E \u0440\u043E\u0434\u0438\u0442\u0435\u043B\u044F \u0438\u043B\u0438 \u043B\u0438\u0446\u0430, \u0435\u0433\u043E \u0437\u0430\u043C\u0435\u0449\u0430\u044E\u0449\u0435\u0435."
        }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__.jsx)("div", {
          className: "inline-flex flex-row w-full",
          children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__.jsx)("label", {
            htmlFor: "parent_name",
            className: "mt-3 block text-sm font-medium text-gray-700",
            children: "\u0412\u0432\u0435\u0434\u0438\u0442\u0435 \u043F\u043E\u043B\u043D\u043E\u0435 \u0424\u0418\u041E \u0440\u043E\u0434\u0438\u0442\u0435\u043B\u044F \u0438\u043B\u0438 \u0440\u043E\u0434\u0441\u0442\u0432\u0435\u043D\u043D\u0438\u043A\u0430 \u0438\u043B\u0438 \u043B\u0438\u0446\u0430 \u0438\u0445 \u0437\u0430\u043C\u0435\u0449\u0430\u044E\u0449\u0435\u0433\u043E"
          })
        }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__.jsx)("input", {
          type: "text",
          name: "parent_name",
          id: "parent_name",
          className: "mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md",
          onChange: validateParent,
          required: true
        }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__.jsx)("div", {
          className: "inline-flex flex-row w-full",
          children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__.jsx)("label", {
            htmlFor: "parent_relationship",
            className: "mt-3 block text-sm font-medium text-gray-700",
            children: "\u0423\u043A\u0430\u0436\u0438\u0442\u0435 \u0441\u043F\u0435\u043D\u044C \u0440\u043E\u0434\u0441\u0442\u0432\u0430 (\u043F\u0430\u043F\u0430, \u043C\u0430\u043C\u0430, \u0431\u0430\u0431\u0443\u0448\u043A\u0430, \u0431\u0440\u0430\u0442, \u0441\u0435\u0441\u0442\u0440\u0430 \u0438 \u0442.\u043F.)"
          })
        }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__.jsx)("input", {
          type: "text",
          name: "parent_relationship",
          id: "parent_relationship",
          className: "mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md",
          onChange: validateParent,
          required: true
        }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__.jsx)("div", {
          className: "inline-flex flex-row w-full",
          children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__.jsx)("label", {
            htmlFor: "parent_address",
            className: "mt-3 block text-sm font-medium text-gray-700",
            children: "\u0423\u043A\u0430\u0436\u0438\u0442\u0435 \u0443\u043B\u0438\u0446\u0443 \u043F\u0440\u043E\u0436\u0438\u0432\u0430\u043D\u0438\u044F \u043D\u0430 \u043F\u043E\u0441\u0435\u043B\u043A\u0435 \u0438 \u043D\u043E\u043C\u0435\u0440 \u0434\u043E\u043C\u0430"
          })
        }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__.jsx)("input", {
          type: "text",
          name: "parent_address",
          id: "parent_address",
          className: "mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md",
          onChange: validateParent,
          required: true
        }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__.jsxs)("div", {
          className: "inline-flex flex-row w-full",
          children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__.jsxs)("label", {
            htmlFor: "parent_phone",
            className: "mt-3 block text-sm font-medium text-gray-700",
            children: ["\u0423\u043A\u0430\u0436\u0438\u0442\u0435 \u043A\u043E\u043D\u0442\u0430\u043A\u0442\u043D\u044B\u0439 \u043D\u043E\u043C\u0435\u0440 \u0442\u0435\u043B\u0435\u0444\u043E\u043D\u0430 \u0440\u043E\u0434\u0438\u0442\u0435\u043B\u044F \u0438\u043B\u0438 \u0440\u043E\u0434\u0441\u0442\u0432\u0435\u043D\u043D\u0438\u043A\u0430 \u0438\u043B\u0438 \u043B\u0438\u0446\u0430 \u0438\u0445 \u0437\u0430\u043C\u0435\u0449\u0430\u044E\u0449\u0435\u0433\u043E \u0432 \u0444\u043E\u0440\u043C\u0430\u0442\u0435  ", /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__.jsx)("b", {
              children: "89XXXXXXXXX"
            })]
          }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__.jsx)("span", {
            className: "validity"
          })]
        }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__.jsx)("input", {
          type: "tel",
          pattern: "89[0-9]{9}",
          name: "parent_phone",
          id: "parent_phone",
          className: "mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md",
          onChange: validateParent,
          required: true
        })]
      }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__.jsxs)("div", {
        className: "col-span-6 sm:col-span-3 mt-5 border-t-8 border-dotted border-gray-400",
        children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__.jsx)("h1", {
          className: "text-lg leading-6 font-bold text-gray-900 text-center mt-3",
          children: "\u0414\u0430\u043D\u043D\u044B\u0435 \u0434\u0435\u0442\u0435\u0439 \u0438 \u0448\u043A\u043E\u043B\u044B"
        }), children.map(function (child, index) {
          return /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__.jsxs)("div", {
            className: "col-span-6 sm:col-span-3 mt-2 border-t-4 border-gray-400",
            children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__.jsxs)("div", {
              className: "inline-flex flex-row w-full",
              children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__.jsx)("label", {
                htmlFor: "child-name-".concat(index),
                className: "mt-3 block text-sm font-medium text-gray-700",
                children: "\u0412\u0432\u0435\u0434\u0438\u0442\u0435 \u043F\u043E\u043B\u043D\u043E\u0435 \u0424\u0418\u041E \u0440\u0435\u0431\u0435\u043D\u043A\u0430"
              }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__.jsx)("div", {
                className: "flex-row-reverse contents",
                children: index != 0 && /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__.jsx)("button", {
                  className: "ml-auto text-red-800",
                  type: "button",
                  onClick: onDelChild,
                  children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__.jsx)("svg", {
                    id: child.id,
                    className: "h-8 w-8",
                    xmlns: "http://www.w3.org/2000/svg",
                    fill: "none",
                    viewBox: "0 0 24 24",
                    stroke: "currentColor",
                    "aria-hidden": "true",
                    children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__.jsx)("path", {
                      strokeLinecap: "round",
                      strokeLinejoin: "round",
                      strokeWidth: "2",
                      d: "M6 18L18 6M6 6l12 12"
                    })
                  })
                })
              })]
            }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__.jsx)(react_debounce_input__WEBPACK_IMPORTED_MODULE_1__.DebounceInput, {
              className: "mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md",
              type: "text",
              debounceTimeout: 700,
              onChange: onChildNameChange,
              value: child.name,
              name: "child-name-".concat(index),
              required: true,
              id: "child-name-".concat(index)
            }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__.jsxs)("div", {
              className: "inline-flex flex-row w-full",
              children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__.jsx)("label", {
                htmlFor: "child-sex-".concat(index),
                className: "mt-3 block text-sm font-medium text-gray-700",
                children: "\u0423\u043A\u0430\u0436\u0438\u0442\u0435 \u043F\u043E\u043B \u0440\u0435\u0431\u0435\u043D\u043A\u0430"
              }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__.jsxs)("div", {
                className: "mx-2",
                children: [child.sex !== CHILDREN_SEX_WOMAN && /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__.jsxs)("select", {
                  name: "child-sex-".concat(index),
                  className: "mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md",
                  onChange: onChildSexChange,
                  defaultValue: "\u043C\u0443\u0436\u0441\u043A\u043E\u0439",
                  id: "child-sex-".concat(index),
                  children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__.jsx)("option", {
                    value: "\u043C\u0443\u0436\u0441\u043A\u043E\u0439",
                    children: "\u041C\u0443\u0436"
                  }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__.jsx)("option", {
                    value: "\u0436\u0435\u043D\u0441\u043A\u0438\u0439",
                    children: "\u0416\u0435\u043D"
                  })]
                }), child.sex == CHILDREN_SEX_WOMAN && /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__.jsxs)("select", {
                  name: "child-sex-".concat(index),
                  className: "mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md",
                  onChange: onChildSexChange,
                  defaultValue: "\u0436\u0435\u043D\u0441\u043A\u0438\u0439",
                  id: "child-sex-".concat(index),
                  children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__.jsx)("option", {
                    value: "\u043C\u0443\u0436\u0441\u043A\u043E\u0439",
                    children: "\u041C\u0443\u0436"
                  }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__.jsx)("option", {
                    value: "\u0436\u0435\u043D\u0441\u043A\u0438\u0439",
                    children: "\u0416\u0435\u043D"
                  })]
                })]
              })]
            }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__.jsxs)("div", {
              className: "inline-flex flex-row w-full",
              children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__.jsx)("label", {
                htmlFor: "date-birthday-".concat(index),
                className: "mt-3 block text-sm font-medium text-gray-700",
                children: "\u0412\u0432\u0435\u0434\u0438\u0442\u0435 \u0434\u0430\u0442\u0443 \u0440\u043E\u0436\u0434\u0435\u043D\u0438\u044F \u0440\u0435\u0431\u0435\u043D\u043A\u0430"
              }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__.jsx)(react_debounce_input__WEBPACK_IMPORTED_MODULE_1__.DebounceInput, {
                className: "mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md",
                type: "date",
                debounceTimeout: 700,
                onChange: onChildDateOfBirthdayChange,
                value: child.date_of_birthday,
                name: "date-birthday-".concat(index),
                id: "date-birthday-".concat(index),
                required: true
              })]
            }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__.jsx)("div", {
              className: "inline-flex flex-row w-full",
              children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__.jsx)("label", {
                htmlFor: "school-name-".concat(index),
                className: "mt-3 block text-sm font-medium text-gray-700",
                children: "\u0412\u0432\u0435\u0434\u0438\u0442\u0435 \u043D\u0430\u0437\u0432\u0430\u043D\u0438\u0435 \u0438\u043B\u0438 \u043D\u043E\u043C\u0435\u0440 \u0448\u043A\u043E\u043B\u044B (\u0441\u0430\u0434\u0438\u043A\u0430)"
              })
            }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__.jsx)(react_debounce_input__WEBPACK_IMPORTED_MODULE_1__.DebounceInput, {
              className: "mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md",
              type: "text",
              debounceTimeout: 700,
              onChange: onSchoolInformationEdit,
              value: "",
              name: "school-name-".concat(index),
              id: "school-name-".concat(index),
              required: true
            }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__.jsx)("div", {
              className: "inline-flex flex-row w-full",
              children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__.jsx)("label", {
                htmlFor: "school-address-".concat(index),
                className: "mt-3 block text-sm font-medium text-gray-700",
                children: "\u0412\u0432\u0435\u0434\u0438\u0442\u0435 \u0430\u0434\u0440\u0435\u0441 \u0448\u043A\u043E\u043B\u044B (\u0441\u0430\u0434\u0438\u043A\u0430)"
              })
            }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__.jsx)(react_debounce_input__WEBPACK_IMPORTED_MODULE_1__.DebounceInput, {
              className: "mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md",
              type: "text",
              debounceTimeout: 700,
              onChange: onSchoolInformationEdit,
              value: "",
              name: "school-address-".concat(index),
              id: "school-address-".concat(index),
              required: true
            }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__.jsx)("div", {
              className: "inline-flex flex-row w-full",
              children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__.jsx)("label", {
                htmlFor: "school-time-to-".concat(index),
                className: "mt-3 block text-sm font-medium text-gray-700",
                children: "\u0412\u0432\u0435\u0434\u0438\u0442\u0435 \u043F\u043E \u043A\u0430\u043A\u043E\u043C\u0443 \u0433\u0440\u0430\u0444\u0438\u043A\u0443 \u0438 \u043A\u043E \u0441\u043A\u043E\u043B\u044C\u043A\u0438 \u043F\u043E \u0432\u0440\u0435\u043C\u0435\u043D\u0438 \u0432\u044B \u0432\u043E\u0437\u0435\u0442\u0435 \u0440\u0435\u0431\u0435\u043D\u043A\u0430 \u0432 \u0448\u043A\u043E\u043B\u0443 (\u0441\u0430\u0434\u0438\u043A)"
              })
            }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__.jsx)(react_debounce_input__WEBPACK_IMPORTED_MODULE_1__.DebounceInput, {
              className: "mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md",
              type: "text",
              debounceTimeout: 700,
              onChange: onSchoolInformationEdit,
              value: "",
              name: "school-time-to-".concat(index),
              id: "school-time-to-".concat(index),
              required: true
            }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__.jsx)("div", {
              className: "inline-flex flex-row w-full",
              children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__.jsx)("label", {
                htmlFor: "school-time-from-".concat(index),
                className: "mt-3 block text-sm font-medium text-gray-700",
                children: "\u0412\u0432\u0435\u0434\u0438\u0442\u0435 \u043F\u043E \u043A\u0430\u043A\u043E\u043C\u0443 \u0433\u0440\u0430\u0444\u0438\u043A\u0443 \u0438 \u0432 \u043A\u0430\u043A\u043E\u0435 \u0432\u0440\u0435\u043C\u0435\u043D\u044F \u0432\u044B \u0437\u0430\u0431\u0438\u0440\u0430\u0435\u0442\u0435 \u0440\u0435\u0431\u0435\u043D\u043A\u0430 \u0438\u0437 \u0448\u043A\u043E\u043B\u044B (\u0441\u0430\u0434\u0438\u043A\u0430)"
              })
            }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__.jsx)(react_debounce_input__WEBPACK_IMPORTED_MODULE_1__.DebounceInput, {
              className: "mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md",
              type: "text",
              debounceTimeout: 700,
              onChange: onSchoolInformationEdit,
              value: "",
              name: "school-time-from-".concat(index),
              id: "school-time-from-".concat(index),
              required: true
            })]
          }, "child_".concat(index));
        })]
      }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__.jsx)("div", {
        className: "mt-3",
        children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__.jsx)("button", {
          type: "button",
          className: "inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 mt-2",
          onClick: onChildAdd,
          children: "\u0414\u043E\u0431\u0430\u0432\u0438\u0442\u044C \u0434\u0430\u043D\u043D\u044B\u0435 \u0435\u0449\u0435 \u043E\u0434\u043D\u043E\u0433\u043E \u0440\u0435\u0431\u0435\u043D\u043A\u0430"
        })
      }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__.jsx)("div", {
        className: "inline-flex w-full flex-row place-content-center",
        children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__.jsx)("div", {
          className: "bg-gray-50 px-4 py-3  sm:px-6",
          children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__.jsx)("button", {
            type: "submit",
            className: "justify-center rounded-md border border-transparent px-4 py-2 text-sm font-medium text-white shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 bg-green-600 hover:bg-green-700",
            children: "\u041E\u0442\u043F\u0440\u0430\u0432\u0438\u0442\u044C \u0434\u0430\u043D\u043D\u044B\u0435"
          })
        })
      })]
    })
  });
};
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (ChildrenAndParentsInformationSchool);

/***/ }),

/***/ "./resources/js/react/ChildrenAndParentsInformationSchool/index.js":
/*!*************************************************************************!*\
  !*** ./resources/js/react/ChildrenAndParentsInformationSchool/index.js ***!
  \*************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "./node_modules/react/index.js");
/* harmony import */ var react_dom__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! react-dom */ "./node_modules/react-dom/index.js");
/* harmony import */ var _ChildrenAndParentsInformationSchool__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./ChildrenAndParentsInformationSchool */ "./resources/js/react/ChildrenAndParentsInformationSchool/ChildrenAndParentsInformationSchool.js");
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! react/jsx-runtime */ "./node_modules/react/jsx-runtime.js");




var App = function App() {
  return /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsx)(_ChildrenAndParentsInformationSchool__WEBPACK_IMPORTED_MODULE_2__["default"], {});
};
react_dom__WEBPACK_IMPORTED_MODULE_1__.render( /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsx)(App, {}), document.getElementById('children-and-parents-information-school'));

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

/***/ "./node_modules/uuid/dist/esm-browser/regex.js":
/*!*****************************************************!*\
  !*** ./node_modules/uuid/dist/esm-browser/regex.js ***!
  \*****************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (/^(?:[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}|00000000-0000-0000-0000-000000000000)$/i);

/***/ }),

/***/ "./node_modules/uuid/dist/esm-browser/rng.js":
/*!***************************************************!*\
  !*** ./node_modules/uuid/dist/esm-browser/rng.js ***!
  \***************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ rng)
/* harmony export */ });
// Unique ID creation requires a high quality random # generator. In the browser we therefore
// require the crypto API and do not support built-in fallback to lower quality random number
// generators (like Math.random()).
var getRandomValues;
var rnds8 = new Uint8Array(16);
function rng() {
  // lazy load so that environments that need to polyfill have a chance to do so
  if (!getRandomValues) {
    // getRandomValues needs to be invoked in a context where "this" is a Crypto implementation. Also,
    // find the complete implementation of crypto (msCrypto) on IE11.
    getRandomValues = typeof crypto !== 'undefined' && crypto.getRandomValues && crypto.getRandomValues.bind(crypto) || typeof msCrypto !== 'undefined' && typeof msCrypto.getRandomValues === 'function' && msCrypto.getRandomValues.bind(msCrypto);

    if (!getRandomValues) {
      throw new Error('crypto.getRandomValues() not supported. See https://github.com/uuidjs/uuid#getrandomvalues-not-supported');
    }
  }

  return getRandomValues(rnds8);
}

/***/ }),

/***/ "./node_modules/uuid/dist/esm-browser/stringify.js":
/*!*********************************************************!*\
  !*** ./node_modules/uuid/dist/esm-browser/stringify.js ***!
  \*********************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _validate_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./validate.js */ "./node_modules/uuid/dist/esm-browser/validate.js");

/**
 * Convert array of 16 byte values to UUID string format of the form:
 * XXXXXXXX-XXXX-XXXX-XXXX-XXXXXXXXXXXX
 */

var byteToHex = [];

for (var i = 0; i < 256; ++i) {
  byteToHex.push((i + 0x100).toString(16).substr(1));
}

function stringify(arr) {
  var offset = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;
  // Note: Be careful editing this code!  It's been tuned for performance
  // and works in ways you may not expect. See https://github.com/uuidjs/uuid/pull/434
  var uuid = (byteToHex[arr[offset + 0]] + byteToHex[arr[offset + 1]] + byteToHex[arr[offset + 2]] + byteToHex[arr[offset + 3]] + '-' + byteToHex[arr[offset + 4]] + byteToHex[arr[offset + 5]] + '-' + byteToHex[arr[offset + 6]] + byteToHex[arr[offset + 7]] + '-' + byteToHex[arr[offset + 8]] + byteToHex[arr[offset + 9]] + '-' + byteToHex[arr[offset + 10]] + byteToHex[arr[offset + 11]] + byteToHex[arr[offset + 12]] + byteToHex[arr[offset + 13]] + byteToHex[arr[offset + 14]] + byteToHex[arr[offset + 15]]).toLowerCase(); // Consistency check for valid UUID.  If this throws, it's likely due to one
  // of the following:
  // - One or more input array values don't map to a hex octet (leading to
  // "undefined" in the uuid)
  // - Invalid input values for the RFC `version` or `variant` fields

  if (!(0,_validate_js__WEBPACK_IMPORTED_MODULE_0__["default"])(uuid)) {
    throw TypeError('Stringified UUID is invalid');
  }

  return uuid;
}

/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (stringify);

/***/ }),

/***/ "./node_modules/uuid/dist/esm-browser/v4.js":
/*!**************************************************!*\
  !*** ./node_modules/uuid/dist/esm-browser/v4.js ***!
  \**************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _rng_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./rng.js */ "./node_modules/uuid/dist/esm-browser/rng.js");
/* harmony import */ var _stringify_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./stringify.js */ "./node_modules/uuid/dist/esm-browser/stringify.js");



function v4(options, buf, offset) {
  options = options || {};
  var rnds = options.random || (options.rng || _rng_js__WEBPACK_IMPORTED_MODULE_0__["default"])(); // Per 4.4, set bits for version and `clock_seq_hi_and_reserved`

  rnds[6] = rnds[6] & 0x0f | 0x40;
  rnds[8] = rnds[8] & 0x3f | 0x80; // Copy bytes to buffer, if provided

  if (buf) {
    offset = offset || 0;

    for (var i = 0; i < 16; ++i) {
      buf[offset + i] = rnds[i];
    }

    return buf;
  }

  return (0,_stringify_js__WEBPACK_IMPORTED_MODULE_1__["default"])(rnds);
}

/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (v4);

/***/ }),

/***/ "./node_modules/uuid/dist/esm-browser/validate.js":
/*!********************************************************!*\
  !*** ./node_modules/uuid/dist/esm-browser/validate.js ***!
  \********************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _regex_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./regex.js */ "./node_modules/uuid/dist/esm-browser/regex.js");


function validate(uuid) {
  return typeof uuid === 'string' && _regex_js__WEBPACK_IMPORTED_MODULE_0__["default"].test(uuid);
}

/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (validate);

/***/ })

},
/******/ __webpack_require__ => { // webpackRuntimeModules
/******/ var __webpack_exec__ = (moduleId) => (__webpack_require__(__webpack_require__.s = moduleId))
/******/ __webpack_require__.O(0, ["/js/vendor"], () => (__webpack_exec__("./resources/js/react/ChildrenAndParentsInformationSchool/index.js")));
/******/ var __webpack_exports__ = __webpack_require__.O();
/******/ }
]);