"use strict";

var _interopRequireWildcard = function (obj) { return obj && obj.__esModule ? obj : { "default": obj }; };

var _defaults = function (obj, defaults) { for (var key in defaults) { if (obj[key] === undefined) { obj[key] = defaults[key]; } } return obj; };

exports.Aurelia = require("./aurelia").Aurelia;
_defaults(exports, _interopRequireWildcard(require("aurelia-dependency-injection")));

_defaults(exports, _interopRequireWildcard(require("aurelia-binding")));

_defaults(exports, _interopRequireWildcard(require("aurelia-metadata")));

_defaults(exports, _interopRequireWildcard(require("aurelia-templating")));

_defaults(exports, _interopRequireWildcard(require("aurelia-loader")));

_defaults(exports, _interopRequireWildcard(require("aurelia-task-queue")));

var TheLogManager = _interopRequireWildcard(require("aurelia-logging"));

var LogManager = exports.LogManager = TheLogManager;
exports.__esModule = true;