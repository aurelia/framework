System.register(['core-js', 'aurelia-logging', 'aurelia-metadata'], function (_export) {
  var core, LogManager, Metadata, _classCallCheck, _createClass, logger, Plugins;

  function loadPlugin(aurelia, loader, info) {
    logger.debug('Loading plugin ' + info.moduleId + '.');

    aurelia.currentPluginId = info.moduleId;

    return loader.loadModule(info.moduleId).then(function (exportedValue) {
      if ('install' in exportedValue) {
        var result = exportedValue.install(aurelia, info.config || {});

        if (result) {
          return result.then(function () {
            aurelia.currentPluginId = null;
            logger.debug('Installed plugin ' + info.moduleId + '.');
          });
        } else {
          logger.debug('Installed plugin ' + info.moduleId + '.');
        }
      } else {
        logger.debug('Loaded plugin ' + info.moduleId + '.');
      }

      aurelia.currentPluginId = null;
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
      'use strict';

      _classCallCheck = function (instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } };

      _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

      logger = LogManager.getLogger('aurelia');

      Plugins = (function () {
        function Plugins(aurelia) {
          _classCallCheck(this, Plugins);

          this.aurelia = aurelia;
          this.info = [];
          this.processed = false;
        }

        _createClass(Plugins, [{
          key: 'plugin',
          value: (function (_plugin) {
            function plugin(_x, _x2) {
              return _plugin.apply(this, arguments);
            }

            plugin.toString = function () {
              return _plugin.toString();
            };

            return plugin;
          })(function (moduleId, config) {
            var plugin = { moduleId: moduleId, config: config || {} };

            if (this.processed) {
              loadPlugin(this.aurelia, this.aurelia.loader, plugin);
            } else {
              this.info.push(plugin);
            }

            return this;
          })
        }, {
          key: 'es5',
          value: function es5() {
            Function.prototype.computed = function (computedProperties) {
              for (var key in computedProperties) {
                if (computedProperties.hasOwnProperty(key)) {
                  Object.defineProperty(this.prototype, key, { get: computedProperties[key], enumerable: true });
                }
              }
            };

            return this;
          }
        }, {
          key: '_process',
          value: function _process() {
            var _this = this;

            var aurelia = this.aurelia,
                loader = aurelia.loader,
                info = this.info,
                current;

            if (this.processed) {
              return;
            }

            var next = (function (_next) {
              function next() {
                return _next.apply(this, arguments);
              }

              next.toString = function () {
                return _next.toString();
              };

              return next;
            })(function () {
              if (current = info.shift()) {
                return loadPlugin(aurelia, loader, current).then(next);
              }

              _this.processed = true;
              return Promise.resolve();
            });

            return next();
          }
        }]);

        return Plugins;
      })();

      _export('Plugins', Plugins);
    }
  };
});