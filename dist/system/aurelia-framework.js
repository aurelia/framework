System.register(['core-js', 'aurelia-logging', 'aurelia-metadata', 'aurelia-dependency-injection', 'aurelia-loader', 'aurelia-path', 'aurelia-templating', 'aurelia-binding', 'aurelia-task-queue'], function (_export) {
  'use strict';

  var core, TheLogManager, Metadata, Container, Loader, join, relativeToFile, BindingLanguage, ViewEngine, ViewSlot, ResourceRegistry, CompositionEngine, Animator, DOMBoundary, logger, Plugins, logger, slice, CustomEvent, Aurelia, LogManager;

  function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

  function loadPlugin(aurelia, loader, info) {
    logger.debug('Loading plugin ' + info.moduleId + '.');
    aurelia.resourcesRelativeTo = info.resourcesRelativeTo;

    return loader.loadModule(info.moduleId).then(function (m) {
      if ('configure' in m) {
        return Promise.resolve(m.configure(aurelia, info.config || {})).then(function () {
          aurelia.resourcesRelativeTo = null;
          logger.debug('Configured plugin ' + info.moduleId + '.');
        });
      } else {
        aurelia.resourcesRelativeTo = null;
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

  function runTasks(aurelia, tasks) {
    var current = undefined,
        next = function next() {
      if (current = tasks.shift()) {
        return Promise.resolve(current(aurelia)).then(next);
      }

      return Promise.resolve();
    };

    return next();
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
          var _this = this;

          _classCallCheck(this, Plugins);

          this.aurelia = aurelia;
          this.info = [];
          this.processed = false;

          aurelia.addPreStartTask(function () {
            return System.normalize('aurelia-bootstrapper').then(function (bootstrapperName) {
              return _this.bootstrapperName = bootstrapperName;
            });
          });
        }

        Plugins.prototype.feature = function feature(plugin, config) {
          plugin = plugin.endsWith('.js') || plugin.endsWith('.ts') ? plugin.substring(0, plugin.length - 3) : plugin;
          return this.plugin({ moduleId: plugin + '/index', resourcesRelativeTo: plugin, config: config || {} });
        };

        Plugins.prototype.plugin = function plugin(_plugin, config) {
          if (typeof _plugin === 'string') {
            _plugin = _plugin.endsWith('.js') || _plugin.endsWith('.ts') ? _plugin.substring(0, _plugin.length - 3) : _plugin;
            return this.plugin({ moduleId: _plugin, resourcesRelativeTo: _plugin, config: config || {} });
          }

          if (this.processed) {
            loadPlugin(this.aurelia, this.aurelia.loader, _plugin);
          } else {
            this.info.push(_plugin);
          }

          return this;
        };

        Plugins.prototype._addNormalizedPlugin = function _addNormalizedPlugin(name, config) {
          var _this2 = this;

          var plugin = { moduleId: name, resourcesRelativeTo: name, config: config || {} };

          this.plugin(plugin);

          this.aurelia.addPreStartTask(function () {
            return System.normalize(name, _this2.bootstrapperName).then(function (normalizedName) {
              normalizedName = normalizedName.endsWith('.js') || normalizedName.endsWith('.ts') ? normalizedName.substring(0, normalizedName.length - 3) : normalizedName;

              plugin.moduleId = normalizedName;
              plugin.resourcesRelativeTo = normalizedName;
              System.map[name] = normalizedName;
            });
          });

          return this;
        };

        Plugins.prototype.defaultBindingLanguage = function defaultBindingLanguage() {
          return this._addNormalizedPlugin('aurelia-templating-binding');
        };

        Plugins.prototype.router = function router() {
          return this._addNormalizedPlugin('aurelia-templating-router');
        };

        Plugins.prototype.history = function history() {
          return this._addNormalizedPlugin('aurelia-history-browser');
        };

        Plugins.prototype.defaultResources = function defaultResources() {
          return this._addNormalizedPlugin('aurelia-templating-resources');
        };

        Plugins.prototype.eventAggregator = function eventAggregator() {
          return this._addNormalizedPlugin('aurelia-event-aggregator');
        };

        Plugins.prototype.standardConfiguration = function standardConfiguration() {
          return this.aurelia.use.defaultBindingLanguage().defaultResources().history().router().eventAggregator();
        };

        Plugins.prototype.developmentLogging = function developmentLogging() {
          var _this3 = this;

          this.aurelia.addPreStartTask(function () {
            return System.normalize('aurelia-logging-console', _this3.bootstrapperName).then(function (name) {
              return _this3.aurelia.loader.loadModule(name).then(function (m) {
                TheLogManager.addAppender(new m.ConsoleAppender());
                TheLogManager.setLevel(TheLogManager.logLevel.debug);
              });
            });
          });

          return this;
        };

        Plugins.prototype._process = function _process() {
          var _this4 = this;

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

            _this4.processed = true;
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

          this.resourcesToLoad = {};
          this.preStartTasks = [];
          this.postStartTasks = [];
          this.loader = loader || new window.AureliaLoader();
          this.container = container || new Container();
          this.resources = resources || new ResourceRegistry();
          this.use = new Plugins(this);

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
              path,
              resourcesRelativeTo = this.resourcesRelativeTo || '';

          for (i = 0, ii = toAdd.length; i < ii; ++i) {
            resource = toAdd[i];
            if (typeof resource != 'string') {
              throw new Error('Invalid resource path [' + resource + ']. Resources must be specified as relative module IDs.');
            }

            path = join(resourcesRelativeTo, resource);
            this.resourcesToLoad[path] = this.resourcesToLoad[path];
          }

          return this;
        };

        Aurelia.prototype.renameGlobalResource = function renameGlobalResource(resourcePath, newName) {
          this.resourcesToLoad[resourcePath] = newName;
          return this;
        };

        Aurelia.prototype.addPreStartTask = function addPreStartTask(task) {
          this.preStartTasks.push(task);
          return this;
        };

        Aurelia.prototype.addPostStartTask = function addPostStartTask(task) {
          this.postStartTasks.push(task);
          return this;
        };

        Aurelia.prototype.start = function start() {
          var _this5 = this;

          if (this.started) {
            return Promise.resolve(this);
          }

          this.started = true;
          logger.info('Aurelia Starting');

          preventActionlessFormSubmit();

          return runTasks(this, this.preStartTasks).then(function () {
            return _this5.use._process().then(function () {
              if (!_this5.container.hasHandler(BindingLanguage)) {
                var message = 'You must configure Aurelia with a BindingLanguage implementation.';
                logger.error(message);
                throw new Error(message);
              }

              if (!_this5.container.hasHandler(Animator)) {
                Animator.configureDefault(_this5.container);
              }

              return loadResources(_this5.container, _this5.resourcesToLoad, _this5.resources);
            }).then(function () {
              return runTasks(_this5, _this5.postStartTasks).then(function () {
                logger.info('Aurelia Started');
                var evt = new window.CustomEvent('aurelia-started', { bubbles: true, cancelable: true });
                document.dispatchEvent(evt);
                return _this5;
              });
            });
          });
        };

        Aurelia.prototype.enhance = function enhance() {
          var _this6 = this;

          var bindingContext = arguments[0] === undefined ? {} : arguments[0];
          var applicationHost = arguments[1] === undefined ? null : arguments[1];

          this._configureHost(applicationHost);

          return new Promise(function (resolve) {
            var viewEngine = _this6.container.get(ViewEngine);
            _this6.root = viewEngine.enhance(_this6.container, _this6.host, _this6.resources, bindingContext);
            _this6.root.attached();
            _this6._onAureliaComposed();
            return _this6;
          });
        };

        Aurelia.prototype.setRoot = function setRoot() {
          var _this7 = this;

          var root = arguments[0] === undefined ? 'app' : arguments[0];
          var applicationHost = arguments[1] === undefined ? null : arguments[1];

          var compositionEngine,
              instruction = {};

          this._configureHost(applicationHost);

          compositionEngine = this.container.get(CompositionEngine);
          instruction.viewModel = root;
          instruction.container = instruction.childContainer = this.container;
          instruction.viewSlot = new ViewSlot(this.host, true);
          instruction.viewSlot.transformChildNodesIntoView();
          instruction.host = this.host;

          return compositionEngine.compose(instruction).then(function (root) {
            _this7.root = root;
            instruction.viewSlot.attached();
            _this7._onAureliaComposed();
            return _this7;
          });
        };

        Aurelia.prototype._configureHost = function _configureHost(applicationHost) {
          applicationHost = applicationHost || this.host;

          if (!applicationHost || typeof applicationHost == 'string') {
            this.host = document.getElementById(applicationHost || 'applicationHost') || document.body;
          } else {
            this.host = applicationHost;
          }

          this.host.aurelia = this;
          this.container.registerInstance(DOMBoundary, this.host);
        };

        Aurelia.prototype._onAureliaComposed = function _onAureliaComposed() {
          var evt = new window.CustomEvent('aurelia-composed', { bubbles: true, cancelable: true });
          setTimeout(function () {
            return document.dispatchEvent(evt);
          }, 1);
        };

        return Aurelia;
      })();

      _export('Aurelia', Aurelia);

      LogManager = TheLogManager;

      _export('LogManager', LogManager);
    }
  };
});