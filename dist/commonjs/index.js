'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _aureliaFramework = require('./aurelia-framework');

Object.keys(_aureliaFramework).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function get() {
      return _aureliaFramework[key];
    }
  });
});