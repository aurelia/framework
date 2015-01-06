define(["exports", "./aurelia", "aurelia-dependency-injection", "aurelia-binding", "aurelia-metadata", "aurelia-templating", "aurelia-loader", "aurelia-task-queue", "aurelia-logging"], function (exports, _aurelia, _aureliaDependencyInjection, _aureliaBinding, _aureliaMetadata, _aureliaTemplating, _aureliaLoader, _aureliaTaskQueue, _aureliaLogging) {
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

  exports.Aurelia = _aurelia.Aurelia;
  _exportsWildcard(_interopRequireWildcard(_aureliaDependencyInjection));

  _exportsWildcard(_interopRequireWildcard(_aureliaBinding));

  _exportsWildcard(_interopRequireWildcard(_aureliaMetadata));

  _exportsWildcard(_interopRequireWildcard(_aureliaTemplating));

  _exportsWildcard(_interopRequireWildcard(_aureliaLoader));

  _exportsWildcard(_interopRequireWildcard(_aureliaTaskQueue));

  var TheLogManager = _aureliaLogging;
  var LogManager = exports.LogManager = TheLogManager;
});