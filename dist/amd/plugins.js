define(["exports", "aurelia-logging", "aurelia-metadata"], function (exports, _aureliaLogging, _aureliaMetadata) {
  "use strict";

  var _prototypeProperties = function (child, staticProps, instanceProps) { if (staticProps) Object.defineProperties(child, staticProps); if (instanceProps) Object.defineProperties(child.prototype, instanceProps); };

  var LogManager = _aureliaLogging;
  var Metadata = _aureliaMetadata.Metadata;


  var logger = LogManager.getLogger("aurelia");

  function loadPlugin(aurelia, loader, info) {
    logger.debug("Loading plugin " + info.moduleId + ".");

    aurelia.currentPluginId = info.moduleId;

    var baseUrl = info.moduleId.startsWith("./") ? undefined : "";

    return loader.loadModule(info.moduleId, baseUrl).then(function (exportedValue) {
      if ("install" in exportedValue) {
        var result = exportedValue.install(aurelia, info.config || {});

        if (result) {
          return result.then(function () {
            aurelia.currentPluginId = null;
            logger.debug("Installed plugin " + info.moduleId + ".");
          });
        } else {
          logger.debug("Installed plugin " + info.moduleId + ".");
        }
      } else {
        logger.debug("Loaded plugin " + info.moduleId + ".");
      }

      aurelia.currentPluginId = null;
    });
  }

  var Plugins = exports.Plugins = (function () {
    function Plugins(aurelia) {
      this.aurelia = aurelia;
      this.info = [];
      this.processed = false;
    }

    _prototypeProperties(Plugins, null, {
      plugin: {
        value: function plugin(moduleId, config) {
          var plugin = { moduleId: moduleId, config: config || {} };

          if (this.processed) {
            loadPlugin(this.aurelia, this.aurelia.loader, plugin);
          } else {
            this.info.push(plugin);
          }

          return this;
        },
        writable: true,
        configurable: true
      },
      es5: {
        value: function es5() {
          Function.prototype.computed = function (computedProperties) {
            for (var key in computedProperties) {
              if (computedProperties.hasOwnProperty(key)) {
                Object.defineProperty(this.prototype, key, { get: computedProperties[key], enumerable: true });
              }
            }
          };

          return this;
        },
        writable: true,
        configurable: true
      },
      atscript: {
        value: function atscript() {
          this.aurelia.container.supportAtScript();
          Metadata.configure.locator(function (fn) {
            return fn.annotate || fn.annotations;
          });
          return this;
        },
        writable: true,
        configurable: true
      },
      _process: {
        value: function _process() {
          var _this = this;
          var aurelia = this.aurelia,
              loader = aurelia.loader,
              info = this.info,
              current;

          if (this.processed) {
            return;
          }

          var next = function () {
            if (current = info.shift()) {
              return loadPlugin(aurelia, loader, current).then(next);
            }

            _this.processed = true;
            return Promise.resolve();
          };

          return next();
        },
        writable: true,
        configurable: true
      }
    });

    return Plugins;
  })();
  exports.__esModule = true;
});