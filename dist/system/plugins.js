System.register(['core-js', 'aurelia-logging', 'aurelia-metadata'], function (_export) {
  'use strict';

  var core, LogManager, Metadata, logger, Plugins;

  function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

  function loadPlugin(aurelia, loader, info) {
    logger.debug('Loading plugin ' + info.moduleId + '.');
    aurelia.currentPluginId = info.moduleId;

    return loader.loadModule(info.moduleId).then(function (m) {
      if ('configure' in m) {
        return Promise.resolve(m.configure(aurelia, info.config || {})).then(function () {
          aurelia.currentPluginId = null;
          logger.debug('Configured plugin ' + info.moduleId + '.');
        });
      } else {
        aurelia.currentPluginId = null;
        logger.debug('Loaded plugin ' + info.moduleId + '.');
      }
    });
  }

  return {
    setters: [function (_coreJs) {
      core = _coreJs['default'];
    }, function (_aureliaLogging) {
      LogManager = _aureliaLogging;
    }, function (_aureliaMetadata) {
      Metadata = _aureliaMetadata.Metadata;
    }],
    execute: function () {
      logger = LogManager.getLogger('aurelia');

      Plugins = (function () {
        function Plugins(aurelia) {
          _classCallCheck(this, Plugins);

          this.aurelia = aurelia;
          this.info = [];
          this.processed = false;
        }

        Plugins.prototype.plugin = function plugin(moduleId, config) {
          var plugin = { moduleId: moduleId, config: config || {} };

          if (this.processed) {
            loadPlugin(this.aurelia, this.aurelia.loader, plugin);
          } else {
            this.info.push(plugin);
          }

          return this;
        };

        Plugins.prototype._process = function _process() {
          var _this = this;

          var aurelia = this.aurelia,
              loader = aurelia.loader,
              info = this.info,
              current;

          if (this.processed) {
            return;
          }

          var next = function next() {
            if (current = info.shift()) {
              return loadPlugin(aurelia, loader, current).then(next);
            }

            _this.processed = true;
            return Promise.resolve();
          };

          return next();
        };

        return Plugins;
      })();

      _export('Plugins', Plugins);
    }
  };
});