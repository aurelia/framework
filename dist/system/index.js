System.register(['aurelia-logging', './aurelia', 'aurelia-dependency-injection', 'aurelia-binding', 'aurelia-metadata', 'aurelia-templating', 'aurelia-loader', 'aurelia-task-queue'], function (_export) {
  var TheLogManager, LogManager;
  return {
    setters: [function (_aureliaLogging) {
      TheLogManager = _aureliaLogging;
    }, function (_aurelia) {
      _export('Aurelia', _aurelia.Aurelia);
    }, function (_aureliaDependencyInjection) {
      for (var _key in _aureliaDependencyInjection) {
        _export(_key, _aureliaDependencyInjection[_key]);
      }
    }, function (_aureliaBinding) {
      for (var _key2 in _aureliaBinding) {
        _export(_key2, _aureliaBinding[_key2]);
      }
    }, function (_aureliaMetadata) {
      for (var _key3 in _aureliaMetadata) {
        _export(_key3, _aureliaMetadata[_key3]);
      }
    }, function (_aureliaTemplating) {
      for (var _key4 in _aureliaTemplating) {
        _export(_key4, _aureliaTemplating[_key4]);
      }
    }, function (_aureliaLoader) {
      for (var _key5 in _aureliaLoader) {
        _export(_key5, _aureliaLoader[_key5]);
      }
    }, function (_aureliaTaskQueue) {
      for (var _key6 in _aureliaTaskQueue) {
        _export(_key6, _aureliaTaskQueue[_key6]);
      }
    }],
    execute: function () {
      'use strict';

      LogManager = TheLogManager;

      _export('LogManager', LogManager);
    }
  };
});