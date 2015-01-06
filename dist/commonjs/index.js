"use strict";

var _interopRequireWildcard = function (obj) {
  return obj && obj.constructor === Object ? obj : {
    "default": obj
  };
};

var _exportsWildcard = function (obj) {
  for (var i in obj) {
    if (exports[i] !== undefined) {
      exports[i] = obj[i];
    }
  }
};

exports.Aurelia = require("./aurelia").Aurelia;
_exportsWildcard(_interopRequireWildcard(require("aurelia-dependency-injection")));

_exportsWildcard(_interopRequireWildcard(require("aurelia-binding")));

_exportsWildcard(_interopRequireWildcard(require("aurelia-metadata")));

_exportsWildcard(_interopRequireWildcard(require("aurelia-templating")));

_exportsWildcard(_interopRequireWildcard(require("aurelia-loader")));

_exportsWildcard(_interopRequireWildcard(require("aurelia-task-queue")));

var TheLogManager = _interopRequireWildcard(require("aurelia-logging"));

var LogManager = exports.LogManager = TheLogManager;