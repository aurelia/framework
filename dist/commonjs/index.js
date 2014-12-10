"use strict";

exports.Aurelia = require("./aurelia").Aurelia;
(function (obj) {
  for (var i in obj) {
    exports[i] = obj[i];
  }
})(require("aurelia-dependency-injection"));

(function (obj) {
  for (var i in obj) {
    exports[i] = obj[i];
  }
})(require("aurelia-binding"));

(function (obj) {
  for (var i in obj) {
    exports[i] = obj[i];
  }
})(require("aurelia-metadata"));

(function (obj) {
  for (var i in obj) {
    exports[i] = obj[i];
  }
})(require("aurelia-templating"));

(function (obj) {
  for (var i in obj) {
    exports[i] = obj[i];
  }
})(require("aurelia-loader"));

(function (obj) {
  for (var i in obj) {
    exports[i] = obj[i];
  }
})(require("aurelia-task-queue"));

(function (obj) {
  for (var i in obj) {
    exports[i] = obj[i];
  }
})(require("aurelia-event-aggregator"));

var TheLogManager = require('aurelia-logging');

var LogManager = exports.LogManager = TheLogManager;