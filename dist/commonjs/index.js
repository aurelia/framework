'use strict';

var _defaults = function (obj, defaults) { var keys = Object.getOwnPropertyNames(defaults); for (var i = 0; i < keys.length; i++) { var key = keys[i]; var value = Object.getOwnPropertyDescriptor(defaults, key); if (value && value.configurable && obj[key] === undefined) { Object.defineProperty(obj, key, value); } } return obj; };

var _interopRequireWildcard = function (obj) { return obj && obj.__esModule ? obj : { 'default': obj }; };

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _import = require('aurelia-logging');

var TheLogManager = _interopRequireWildcard(_import);

var _Aurelia = require('./aurelia');

Object.defineProperty(exports, 'Aurelia', {
  enumerable: true,
  get: function get() {
    return _Aurelia.Aurelia;
  }
});

var _aureliaDependencyInjection = require('aurelia-dependency-injection');

_defaults(exports, _interopRequireWildcard(_aureliaDependencyInjection));

var _aureliaBinding = require('aurelia-binding');

_defaults(exports, _interopRequireWildcard(_aureliaBinding));

var _aureliaMetadata = require('aurelia-metadata');

_defaults(exports, _interopRequireWildcard(_aureliaMetadata));

var _aureliaTemplating = require('aurelia-templating');

_defaults(exports, _interopRequireWildcard(_aureliaTemplating));

var _aureliaLoader = require('aurelia-loader');

_defaults(exports, _interopRequireWildcard(_aureliaLoader));

var _aureliaTaskQueue = require('aurelia-task-queue');

_defaults(exports, _interopRequireWildcard(_aureliaTaskQueue));

var LogManager = TheLogManager;
exports.LogManager = LogManager;