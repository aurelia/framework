System.register(["aurelia-logging"], function (_export) {
  "use strict";

  var LogManager, logger, Plugins;


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
      logger = LogManager.getLogger("aurelia");
      Plugins = function Plugins(aurelia) {
        this.aurelia = aurelia;
        this.info = [];
        this.hasProcessed = false;
      };

      Plugins.prototype.install = function (moduleId, config) {
        this.info.push({ moduleId: moduleId, config: config });
        return this;
      };

      Plugins.prototype.process = function () {
        var toLoad = [], aurelia = this.aurelia, loader = aurelia.loader, info = this.info, i, ii;

        if (this.hasProcessed) {
          return Promise.resolve();
        }

        this.hasProcessed = true;

        for (i = 0, ii = info.length; i < ii; ++i) {
          toLoad.push(loadPlugin(aurelia, loader, info[i]));
        }

        return Promise.all(toLoad);
      };

      _export("Plugins", Plugins);
    }
  };
});