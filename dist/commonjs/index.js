'use strict';

var _defaults = function (obj, defaults) { var keys = Object.getOwnPropertyNames(defaults); for (var i = 0; i < keys.length; i++) { var key = keys[i]; var value = Object.getOwnPropertyDescriptor(defaults, key); if (value && value.configurable && obj[key] === undefined) { Object.defineProperty(obj, key, value); } } return obj; };

var _interopRequireWildcard = function (obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (typeof obj === 'object' && obj !== null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj['default'] = obj; return newObj; } };

exports.__esModule = true;

var _import = require('aurelia-logging');

var TheLogManager = _interopRequireWildcard(_import);

var _Aurelia = require('./aurelia');

exports.Aurelia = _Aurelia.Aurelia;

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