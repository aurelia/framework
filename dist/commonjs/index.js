"use strict";

var _interopRequireWildcard = function (obj) { return obj && obj.__esModule ? obj : { "default": obj }; };

var _defaults = function (obj, defaults) { var keys = Object.getOwnPropertyNames(defaults); for (var i = 0; i < keys.length; i++) { var key = keys[i]; var value = Object.getOwnPropertyDescriptor(defaults, key); if (value && value.configurable && obj[key] === undefined) { Object.defineProperty(obj, key, value); } } return obj; };

/**
 * The aurelia framework brings together all the required core aurelia libraries into a ready-to-go application-building platform.
 *
 * @module framework
 */

exports.Aurelia = require("./aurelia").Aurelia;

_defaults(exports, _interopRequireWildcard(require("aurelia-dependency-injection")));

_defaults(exports, _interopRequireWildcard(require("aurelia-binding")));

_defaults(exports, _interopRequireWildcard(require("aurelia-metadata")));

_defaults(exports, _interopRequireWildcard(require("aurelia-templating")));

_defaults(exports, _interopRequireWildcard(require("aurelia-loader")));

_defaults(exports, _interopRequireWildcard(require("aurelia-task-queue")));

var TheLogManager = _interopRequireWildcard(require("aurelia-logging"));

var LogManager = exports.LogManager = TheLogManager;
Object.defineProperty(exports, "__esModule", {
  value: true
});