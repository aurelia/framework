'use strict';

exports.__esModule = true;

function _defaults(obj, defaults) { var keys = Object.getOwnPropertyNames(defaults); for (var i = 0; i < keys.length; i++) { var key = keys[i]; var value = Object.getOwnPropertyDescriptor(defaults, key); if (value && value.configurable && obj[key] === undefined) { Object.defineProperty(obj, key, value); } } return obj; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj['default'] = obj; return newObj; } }

var _aureliaLogging = require('aurelia-logging');

var TheLogManager = _interopRequireWildcard(_aureliaLogging);

var _aurelia = require('./aurelia');

exports.Aurelia = _aurelia.Aurelia;

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

var _aureliaPath = require('aurelia-path');

_defaults(exports, _interopRequireWildcard(_aureliaPath));

var LogManager = TheLogManager;
exports.LogManager = LogManager;