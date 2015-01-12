System.register(["aurelia-logging"], function (_export) {
  "use strict";

  var LogManager, _prototypeProperties, logger, Plugins;


  function loadPlugin(aurelia, loader, info) {
    logger.debug("Loading plugin " + info.moduleId + ".");

    return loader.loadModule(info.moduleId, "").then(function (exportedValue) {
      if ("install" in exportedValue) {
        var result = exportedValue.install(aurelia, info.config || {});

        if (result) {
          return result.then(function () {
            logger.debug("Installed plugin " + info.moduleId + ".");
          });
        } else {
          logger.debug("Installed plugin " + info.moduleId + ".");
        }
      } else {
        logger.debug("Loaded plugin " + info.moduleId + ".");
      }
    });
  }

  return {
    setters: [function (_aureliaLogging) {
      LogManager = _aureliaLogging;
    }],
    execute: function () {
      _prototypeProperties = function (child, staticProps, instanceProps) {
        if (staticProps) Object.defineProperties(child, staticProps);
        if (instanceProps) Object.defineProperties(child.prototype, instanceProps);
      };

      logger = LogManager.getLogger("aurelia");
      Plugins = (function () {
        function Plugins(aurelia) {
          this.aurelia = aurelia;
          this.info = [];
        }

        _prototypeProperties(Plugins, null, {
          install: {
            value: function (moduleId, config) {
              this.info.push({ moduleId: moduleId, config: config });
              return this;
            },
            writable: true,
            enumerable: true,
            configurable: true
          },
          process: {
            value: function () {
              var aurelia = this.aurelia,
                  loader = aurelia.loader,
                  info = this.info,
                  current;

              var next = function () {
                if (current = info.shift()) {
                  return loadPlugin(aurelia, loader, current).then(next);
                }

                return Promise.resolve();
              };

              return next();
            },
            writable: true,
            enumerable: true,
            configurable: true
          }
        });

        return Plugins;
      })();
      _export("Plugins", Plugins);
    }
  };
});