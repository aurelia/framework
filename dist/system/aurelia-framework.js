System.register(['core-js', 'aurelia-logging', 'aurelia-metadata', 'aurelia-dependency-injection', 'aurelia-loader', 'aurelia-path', 'aurelia-templating', 'aurelia-binding', 'aurelia-task-queue'], function (_export) {
  'use strict';

  var core, TheLogManager, Metadata, Container, Loader, join, relativeToFile, BindingLanguage, ViewEngine, ViewSlot, ResourceRegistry, CompositionEngine, Animator, DOMBoundary, logger, Plugins, logger, slice, CustomEvent, Aurelia, LogManager;

  function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

  function loadPlugin(aurelia, loader, info) {
    logger.debug('Loading plugin ' + info.moduleId + '.');
    aurelia.currentPluginId = info.moduleId.endsWith('.js') || info.moduleId.endsWith('.ts') ? info.moduleId.substring(0, info.moduleId.length - 3) : info.moduleId;

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

  function preventActionlessFormSubmit() {
    document.body.addEventListener('submit', function (evt) {
      var target = evt.target;
      var action = target.action;

      if (target.tagName.toLowerCase() === 'form' && !action) {
        evt.preventDefault();
      }
    });
  }

  function loadResources(container, resourcesToLoad, appResources) {
    var viewEngine = container.get(ViewEngine),
        importIds = Object.keys(resourcesToLoad),
        names = new Array(importIds.length),
        i,
        ii;

    for (i = 0, ii = importIds.length; i < ii; ++i) {
      names[i] = resourcesToLoad[importIds[i]];
    }

    return viewEngine.importViewResources(importIds, names, appResources);
  }

  return {
    setters: [function (_coreJs) {
      core = _coreJs['default'];
    }, function (_aureliaLogging) {
      TheLogManager = _aureliaLogging;
    }, function (_aureliaMetadata) {
      Metadata = _aureliaMetadata.Metadata;

      for (var _key3 in _aureliaMetadata) {
        _export(_key3, _aureliaMetadata[_key3]);
      }
    }, function (_aureliaDependencyInjection) {
      Container = _aureliaDependencyInjection.Container;

      for (var _key in _aureliaDependencyInjection) {
        _export(_key, _aureliaDependencyInjection[_key]);
      }
    }, function (_aureliaLoader) {
      Loader = _aureliaLoader.Loader;

      for (var _key5 in _aureliaLoader) {
        _export(_key5, _aureliaLoader[_key5]);
      }
    }, function (_aureliaPath) {
      join = _aureliaPath.join;
      relativeToFile = _aureliaPath.relativeToFile;

      for (var _key7 in _aureliaPath) {
        _export(_key7, _aureliaPath[_key7]);
      }
    }, function (_aureliaTemplating) {
      BindingLanguage = _aureliaTemplating.BindingLanguage;
      ViewEngine = _aureliaTemplating.ViewEngine;
      ViewSlot = _aureliaTemplating.ViewSlot;
      ResourceRegistry = _aureliaTemplating.ResourceRegistry;
      CompositionEngine = _aureliaTemplating.CompositionEngine;
      Animator = _aureliaTemplating.Animator;
      DOMBoundary = _aureliaTemplating.DOMBoundary;

      for (var _key4 in _aureliaTemplating) {
        _export(_key4, _aureliaTemplating[_key4]);
      }
    }, function (_aureliaBinding) {
      for (var _key2 in _aureliaBinding) {
        _export(_key2, _aureliaBinding[_key2]);
      }
    }, function (_aureliaTaskQueue) {
      for (var _key6 in _aureliaTaskQueue) {
        _export(_key6, _aureliaTaskQueue[_key6]);
      }
    }],
    execute: function () {
      logger = TheLogManager.getLogger('aurelia');

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

      logger = TheLogManager.getLogger('aurelia');
      slice = Array.prototype.slice;

      if (!window.CustomEvent || typeof window.CustomEvent !== 'function') {
        CustomEvent = function CustomEvent(event, params) {
          var params = params || {
            bubbles: false,
            cancelable: false,
            detail: undefined
          };

          var evt = document.createEvent('CustomEvent');
          evt.initCustomEvent(event, params.bubbles, params.cancelable, params.detail);
          return evt;
        };

        CustomEvent.prototype = window.Event.prototype;
        window.CustomEvent = CustomEvent;
      }
      Aurelia = (function () {
        function Aurelia(loader, container, resources) {
          _classCallCheck(this, Aurelia);

          this.loader = loader || new window.AureliaLoader();
          this.container = container || new Container();
          this.resources = resources || new ResourceRegistry();
          this.use = new Plugins(this);
          this.resourcesToLoad = {};

          this.withInstance(Aurelia, this);
          this.withInstance(Loader, this.loader);
          this.withInstance(ResourceRegistry, this.resources);

          this.container.makeGlobal();
        }

        Aurelia.prototype.withInstance = function withInstance(type, instance) {
          this.container.registerInstance(type, instance);
          return this;
        };

        Aurelia.prototype.withSingleton = function withSingleton(type, implementation) {
          this.container.registerSingleton(type, implementation);
          return this;
        };

        Aurelia.prototype.withTransient = function withTransient(type, implementation) {
          this.container.registerTransient(type, implementation);
          return this;
        };

        Aurelia.prototype.globalizeResources = function globalizeResources(resources) {
          var toAdd = Array.isArray(resources) ? resources : arguments,
              i,
              ii,
              resource,
              pluginPath = this.currentPluginId || '',
              path,
              internalPlugin = pluginPath.startsWith('./');

          for (i = 0, ii = toAdd.length; i < ii; ++i) {
            resource = toAdd[i];
            if (typeof resource != 'string') {
              throw new Error('Invalid resource path [' + resource + ']. Resources must be specified as relative module IDs.');
            }

            path = internalPlugin ? relativeToFile(resource, pluginPath) : join(pluginPath, resource);

            this.resourcesToLoad[path] = this.resourcesToLoad[path];
          }

          return this;
        };

        Aurelia.prototype.renameGlobalResource = function renameGlobalResource(resourcePath, newName) {
          this.resourcesToLoad[resourcePath] = newName;
          return this;
        };

        Aurelia.prototype.start = function start() {
          var _this2 = this;

          if (this.started) {
            return Promise.resolve(this);
          }

          this.started = true;
          logger.info('Aurelia Starting');

          preventActionlessFormSubmit();

          return this.use._process().then(function () {
            if (!_this2.container.hasHandler(BindingLanguage)) {
              var message = 'You must configure Aurelia with a BindingLanguage implementation.';
              logger.error(message);
              throw new Error(message);
            }

            if (!_this2.container.hasHandler(Animator)) {
              Animator.configureDefault(_this2.container);
            }

            return loadResources(_this2.container, _this2.resourcesToLoad, _this2.resources).then(function () {
              logger.info('Aurelia Started');
              var evt = new window.CustomEvent('aurelia-started', { bubbles: true, cancelable: true });
              document.dispatchEvent(evt);
              return _this2;
            });
          });
        };

        Aurelia.prototype.setRoot = function setRoot() {
          var _this3 = this;

          var root = arguments[0] === undefined ? 'app' : arguments[0];
          var applicationHost = arguments[1] === undefined ? null : arguments[1];

          var compositionEngine,
              instruction = {};

          applicationHost = applicationHost || this.host;

          if (!applicationHost || typeof applicationHost == 'string') {
            this.host = document.getElementById(applicationHost || 'applicationHost') || document.body;
          } else {
            this.host = applicationHost;
          }

          this.host.aurelia = this;
          this.container.registerInstance(DOMBoundary, this.host);

          compositionEngine = this.container.get(CompositionEngine);
          instruction.viewModel = root;
          instruction.container = instruction.childContainer = this.container;
          instruction.viewSlot = new ViewSlot(this.host, true);
          instruction.viewSlot.transformChildNodesIntoView();
          instruction.host = this.host;

          return compositionEngine.compose(instruction).then(function (root) {
            _this3.root = root;
            instruction.viewSlot.attached();
            var evt = new window.CustomEvent('aurelia-composed', { bubbles: true, cancelable: true });
            setTimeout(function () {
              return document.dispatchEvent(evt);
            }, 1);
            return _this3;
          });
        };

        return Aurelia;
      })();

      _export('Aurelia', Aurelia);

      LogManager = TheLogManager;

      _export('LogManager', LogManager);
    }
  };
});