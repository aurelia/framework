define(["exports", "aurelia-logging", "aurelia-metadata"], function (exports, _aureliaLogging, _aureliaMetadata) {
  "use strict";

  var _prototypeProperties = function (child, staticProps, instanceProps) { if (staticProps) Object.defineProperties(child, staticProps); if (instanceProps) Object.defineProperties(child.prototype, instanceProps); };

  var _classCallCheck = function (instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } };

  var LogManager = _aureliaLogging;
  var Metadata = _aureliaMetadata.Metadata;

  var logger = LogManager.getLogger("aurelia");

  function loadPlugin(aurelia, loader, info) {
    logger.debug("Loading plugin " + info.moduleId + ".");

    aurelia.currentPluginId = info.moduleId;

    return loader.loadModule(info.moduleId).then(function (exportedValue) {
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

  /**
   * Manages loading and installing plugins.
   *
   * @class Plugins
   * @constructor
   * @param {Aurelia} aurelia An instance of Aurelia.
   */

  var Plugins = exports.Plugins = (function () {
    function Plugins(aurelia) {
      _classCallCheck(this, Plugins);

      this.aurelia = aurelia;
      this.info = [];
      this.processed = false;
    }

    _prototypeProperties(Plugins, null, {
      plugin: {

        /**
         * Installs a plugin before Aurelia starts.
         *
         * @method plugin
         * @param {moduleId} moduleId The ID of the module to install.
         * @param {config} config The configuration for the specified module.
         * @return {Plugins} Returns the current Plugins instance.
        */

        value: (function (_plugin) {
          var _pluginWrapper = function plugin(_x, _x2) {
            return _plugin.apply(this, arguments);
          };

          _pluginWrapper.toString = function () {
            return _plugin.toString();
          };

          return _pluginWrapper;
        })(function (moduleId, config) {
          var plugin = { moduleId: moduleId, config: config || {} };

          if (this.processed) {
            loadPlugin(this.aurelia, this.aurelia.loader, plugin);
          } else {
            this.info.push(plugin);
          }

          return this;
        }),
        writable: true,
        configurable: true
      },
      es5: {

        /**
         * Installs special support for ES5 authoring.
         *
         * @method es5
         * @return {Plugins} Returns the current Plugins instance.
        */

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

        /**
         * Installs special support for AtScript authoring.
         *
         * @method atscript
         * @return {Plugins} Returns the current Plugins instance.
        */

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

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
});