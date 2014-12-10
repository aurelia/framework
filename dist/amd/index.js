define(["exports", "./aurelia", "aurelia-dependency-injection", "aurelia-binding", "aurelia-metadata", "aurelia-templating", "aurelia-loader", "aurelia-task-queue", "aurelia-event-aggregator", "aurelia-logging"], function (exports, _aurelia, _aureliaDependencyInjection, _aureliaBinding, _aureliaMetadata, _aureliaTemplating, _aureliaLoader, _aureliaTaskQueue, _aureliaEventAggregator, _aureliaLogging) {
  "use strict";

  exports.Aurelia = _aurelia.Aurelia;
  (function (obj) {
    for (var i in obj) {
      exports[i] = obj[i];
    }
  })(_aureliaDependencyInjection);

  (function (obj) {
    for (var i in obj) {
      exports[i] = obj[i];
    }
  })(_aureliaBinding);

  (function (obj) {
    for (var i in obj) {
      exports[i] = obj[i];
    }
  })(_aureliaMetadata);

  (function (obj) {
    for (var i in obj) {
      exports[i] = obj[i];
    }
  })(_aureliaTemplating);

  (function (obj) {
    for (var i in obj) {
      exports[i] = obj[i];
    }
  })(_aureliaLoader);

  (function (obj) {
    for (var i in obj) {
      exports[i] = obj[i];
    }
  })(_aureliaTaskQueue);

  (function (obj) {
    for (var i in obj) {
      exports[i] = obj[i];
    }
  })(_aureliaEventAggregator);

  var TheLogManager = _aureliaLogging;
  var LogManager = exports.LogManager = TheLogManager;
});