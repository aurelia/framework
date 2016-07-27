'use strict';

System.register(['aurelia-logging', 'aurelia-dependency-injection', 'aurelia-loader', 'aurelia-templating', 'aurelia-pal', 'aurelia-path', 'aurelia-binding', 'aurelia-metadata', 'aurelia-task-queue'], function (_export, _context) {
  "use strict";

  var TheLogManager, Container, Loader, BindingLanguage, ViewSlot, ViewResources, TemplatingEngine, CompositionTransaction, ViewEngine, DOM, PLATFORM, relativeToFile, join, Aurelia, logger, extPattern, FrameworkConfiguration, LogManager;



  function preventActionlessFormSubmit() {
    DOM.addEventListener('submit', function (evt) {
      var target = evt.target;
      var action = target.action;

      if (target.tagName.toLowerCase() === 'form' && !action) {
        evt.preventDefault();
      }
    });
  }

  function runTasks(config, tasks) {
    var current = void 0;
    var next = function next() {
      current = tasks.shift();
      if (current) {
        return Promise.resolve(current(config)).then(next);
      }

      return Promise.resolve();
    };

    return next();
  }

  function loadPlugin(config, loader, info) {
    logger.debug('Loading plugin ' + info.moduleId + '.');
    config.resourcesRelativeTo = info.resourcesRelativeTo;

    var id = info.moduleId;

    if (info.resourcesRelativeTo.length > 1) {
      return loader.normalize(info.moduleId, info.resourcesRelativeTo[1]).then(function (normalizedId) {
        return _loadPlugin(normalizedId);
      });
    }

    return _loadPlugin(id);

    function _loadPlugin(moduleId) {
      return loader.loadModule(moduleId).then(function (m) {
        if ('configure' in m) {
          return Promise.resolve(m.configure(config, info.config || {})).then(function () {
            config.resourcesRelativeTo = null;
            logger.debug('Configured plugin ' + info.moduleId + '.');
          });
        }

        config.resourcesRelativeTo = null;
        logger.debug('Loaded plugin ' + info.moduleId + '.');
      });
    }
  }

  function loadResources(aurelia, resourcesToLoad, appResources) {
    var viewEngine = aurelia.container.get(ViewEngine);

    return Promise.all(Object.keys(resourcesToLoad).map(function (n) {
      return _normalize(resourcesToLoad[n]);
    })).then(function (loads) {
      var names = [];
      var importIds = [];

      loads.forEach(function (l) {
        names.push(undefined);
        importIds.push(l.importId);
      });

      return viewEngine.importViewResources(importIds, names, appResources);
    });

    function _normalize(load) {
      var moduleId = load.moduleId;
      var ext = getExt(moduleId);

      if (isOtherResource(moduleId)) {
        moduleId = removeExt(moduleId);
      }

      return aurelia.loader.normalize(moduleId, load.relativeTo).then(function (normalized) {
        return {
          name: load.moduleId,
          importId: isOtherResource(load.moduleId) ? addOriginalExt(normalized, ext) : normalized
        };
      });
    }

    function isOtherResource(name) {
      var ext = getExt(name);
      if (!ext) return false;
      if (ext === '') return false;
      if (ext === '.js' || ext === '.ts') return false;
      return true;
    }

    function removeExt(name) {
      return name.replace(extPattern, '');
    }

    function addOriginalExt(normalized, ext) {
      return removeExt(normalized) + '.' + ext;
    }
  }

  function getExt(name) {
    var match = name.match(extPattern);
    if (match && match.length > 0) {
      return match[0].split('.')[1];
    }
  }

  function assertProcessed(plugins) {
    if (plugins.processed) {
      throw new Error('This config instance has already been applied. To load more plugins or global resources, create a new FrameworkConfiguration instance.');
    }
  }

  return {
    setters: [function (_aureliaLogging) {
      TheLogManager = _aureliaLogging;
    }, function (_aureliaDependencyInjection) {
      Container = _aureliaDependencyInjection.Container;
      var _exportObj = {};

      for (var _key in _aureliaDependencyInjection) {
        if (_key !== "default" && _key !== "__esModule") _exportObj[_key] = _aureliaDependencyInjection[_key];
      }

      _export(_exportObj);
    }, function (_aureliaLoader) {
      Loader = _aureliaLoader.Loader;
      var _exportObj2 = {};

      for (var _key2 in _aureliaLoader) {
        if (_key2 !== "default" && _key2 !== "__esModule") _exportObj2[_key2] = _aureliaLoader[_key2];
      }

      _export(_exportObj2);
    }, function (_aureliaTemplating) {
      BindingLanguage = _aureliaTemplating.BindingLanguage;
      ViewSlot = _aureliaTemplating.ViewSlot;
      ViewResources = _aureliaTemplating.ViewResources;
      TemplatingEngine = _aureliaTemplating.TemplatingEngine;
      CompositionTransaction = _aureliaTemplating.CompositionTransaction;
      ViewEngine = _aureliaTemplating.ViewEngine;
      var _exportObj3 = {};

      for (var _key3 in _aureliaTemplating) {
        if (_key3 !== "default" && _key3 !== "__esModule") _exportObj3[_key3] = _aureliaTemplating[_key3];
      }

      _export(_exportObj3);
    }, function (_aureliaPal) {
      DOM = _aureliaPal.DOM;
      PLATFORM = _aureliaPal.PLATFORM;
      var _exportObj4 = {};

      for (var _key4 in _aureliaPal) {
        if (_key4 !== "default" && _key4 !== "__esModule") _exportObj4[_key4] = _aureliaPal[_key4];
      }

      _export(_exportObj4);
    }, function (_aureliaPath) {
      relativeToFile = _aureliaPath.relativeToFile;
      join = _aureliaPath.join;
      var _exportObj5 = {};

      for (var _key5 in _aureliaPath) {
        if (_key5 !== "default" && _key5 !== "__esModule") _exportObj5[_key5] = _aureliaPath[_key5];
      }

      _export(_exportObj5);
    }, function (_aureliaBinding) {
      var _exportObj6 = {};

      for (var _key6 in _aureliaBinding) {
        if (_key6 !== "default" && _key6 !== "__esModule") _exportObj6[_key6] = _aureliaBinding[_key6];
      }

      _export(_exportObj6);
    }, function (_aureliaMetadata) {
      var _exportObj7 = {};

      for (var _key7 in _aureliaMetadata) {
        if (_key7 !== "default" && _key7 !== "__esModule") _exportObj7[_key7] = _aureliaMetadata[_key7];
      }

      _export(_exportObj7);
    }, function (_aureliaTaskQueue) {
      var _exportObj8 = {};

      for (var _key8 in _aureliaTaskQueue) {
        if (_key8 !== "default" && _key8 !== "__esModule") _exportObj8[_key8] = _aureliaTaskQueue[_key8];
      }

      _export(_exportObj8);
    }],
    execute: function () {
      _export('Aurelia', Aurelia = function () {
        function Aurelia(loader, container, resources) {


          this.loader = loader || new PLATFORM.Loader();
          this.container = container || new Container().makeGlobal();
          this.resources = resources || new ViewResources();
          this.use = new FrameworkConfiguration(this);
          this.logger = TheLogManager.getLogger('aurelia');
          this.hostConfigured = false;
          this.host = null;

          this.use.instance(Aurelia, this);
          this.use.instance(Loader, this.loader);
          this.use.instance(ViewResources, this.resources);
        }

        Aurelia.prototype.start = function start() {
          var _this = this;

          if (this.started) {
            return Promise.resolve(this);
          }

          this.started = true;
          this.logger.info('Aurelia Starting');

          return this.use.apply().then(function () {
            preventActionlessFormSubmit();

            if (!_this.container.hasResolver(BindingLanguage)) {
              var message = 'You must configure Aurelia with a BindingLanguage implementation.';
              _this.logger.error(message);
              throw new Error(message);
            }

            _this.logger.info('Aurelia Started');
            var evt = DOM.createCustomEvent('aurelia-started', { bubbles: true, cancelable: true });
            DOM.dispatchEvent(evt);
            return _this;
          });
        };

        Aurelia.prototype.enhance = function enhance() {
          var _this2 = this;

          var bindingContext = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];
          var applicationHost = arguments.length <= 1 || arguments[1] === undefined ? null : arguments[1];

          this._configureHost(applicationHost || DOM.querySelectorAll('body')[0]);

          return new Promise(function (resolve) {
            var engine = _this2.container.get(TemplatingEngine);
            _this2.root = engine.enhance({ container: _this2.container, element: _this2.host, resources: _this2.resources, bindingContext: bindingContext });
            _this2.root.attached();
            _this2._onAureliaComposed();
            resolve(_this2);
          });
        };

        Aurelia.prototype.setRoot = function setRoot() {
          var _this3 = this;

          var root = arguments.length <= 0 || arguments[0] === undefined ? null : arguments[0];
          var applicationHost = arguments.length <= 1 || arguments[1] === undefined ? null : arguments[1];

          var instruction = {};

          if (this.root && this.root.viewModel && this.root.viewModel.router) {
            this.root.viewModel.router.deactivate();
            this.root.viewModel.router.reset();
          }

          this._configureHost(applicationHost);

          var engine = this.container.get(TemplatingEngine);
          var transaction = this.container.get(CompositionTransaction);
          delete transaction.initialComposition;

          if (!root) {
            if (this.configModuleId) {
              root = relativeToFile('./app', this.configModuleId);
            } else {
              root = 'app';
            }
          }

          instruction.viewModel = root;
          instruction.container = instruction.childContainer = this.container;
          instruction.viewSlot = this.hostSlot;
          instruction.host = this.host;

          return engine.compose(instruction).then(function (r) {
            _this3.root = r;
            instruction.viewSlot.attached();
            _this3._onAureliaComposed();
            return _this3;
          });
        };

        Aurelia.prototype._configureHost = function _configureHost(applicationHost) {
          if (this.hostConfigured) {
            return;
          }
          applicationHost = applicationHost || this.host;

          if (!applicationHost || typeof applicationHost === 'string') {
            this.host = DOM.getElementById(applicationHost || 'applicationHost');
          } else {
            this.host = applicationHost;
          }

          if (!this.host) {
            throw new Error('No applicationHost was specified.');
          }

          this.hostConfigured = true;
          this.host.aurelia = this;
          this.hostSlot = new ViewSlot(this.host, true);
          this.hostSlot.transformChildNodesIntoView();
          this.container.registerInstance(DOM.boundary, this.host);
        };

        Aurelia.prototype._onAureliaComposed = function _onAureliaComposed() {
          var evt = DOM.createCustomEvent('aurelia-composed', { bubbles: true, cancelable: true });
          setTimeout(function () {
            return DOM.dispatchEvent(evt);
          }, 1);
        };

        return Aurelia;
      }());

      _export('Aurelia', Aurelia);

      logger = TheLogManager.getLogger('aurelia');
      extPattern = /\.[^/.]+$/;

      _export('FrameworkConfiguration', FrameworkConfiguration = function () {
        function FrameworkConfiguration(aurelia) {
          var _this4 = this;



          this.aurelia = aurelia;
          this.container = aurelia.container;
          this.info = [];
          this.processed = false;
          this.preTasks = [];
          this.postTasks = [];
          this.resourcesToLoad = {};
          this.preTask(function () {
            return aurelia.loader.normalize('aurelia-bootstrapper').then(function (name) {
              return _this4.bootstrapperName = name;
            });
          });
          this.postTask(function () {
            return loadResources(aurelia, _this4.resourcesToLoad, aurelia.resources);
          });
        }

        FrameworkConfiguration.prototype.instance = function instance(type, _instance) {
          this.container.registerInstance(type, _instance);
          return this;
        };

        FrameworkConfiguration.prototype.singleton = function singleton(type, implementation) {
          this.container.registerSingleton(type, implementation);
          return this;
        };

        FrameworkConfiguration.prototype.transient = function transient(type, implementation) {
          this.container.registerTransient(type, implementation);
          return this;
        };

        FrameworkConfiguration.prototype.preTask = function preTask(task) {
          assertProcessed(this);
          this.preTasks.push(task);
          return this;
        };

        FrameworkConfiguration.prototype.postTask = function postTask(task) {
          assertProcessed(this);
          this.postTasks.push(task);
          return this;
        };

        FrameworkConfiguration.prototype.feature = function feature(plugin, config) {
          if (getExt(plugin)) {
            return this.plugin({ moduleId: plugin, resourcesRelativeTo: [plugin, ''], config: config || {} });
          }

          return this.plugin({ moduleId: plugin + '/index', resourcesRelativeTo: [plugin, ''], config: config || {} });
        };

        FrameworkConfiguration.prototype.globalResources = function globalResources(resources) {
          assertProcessed(this);

          var toAdd = Array.isArray(resources) ? resources : arguments;
          var resource = void 0;
          var resourcesRelativeTo = this.resourcesRelativeTo || ['', ''];

          for (var i = 0, ii = toAdd.length; i < ii; ++i) {
            resource = toAdd[i];
            if (typeof resource !== 'string') {
              throw new Error('Invalid resource path [' + resource + ']. Resources must be specified as relative module IDs.');
            }

            var parent = resourcesRelativeTo[0];
            var grandParent = resourcesRelativeTo[1];
            var name = resource;

            if ((resource.startsWith('./') || resource.startsWith('../')) && parent !== '') {
              name = join(parent, resource);
            }

            this.resourcesToLoad[name] = { moduleId: name, relativeTo: grandParent };
          }

          return this;
        };

        FrameworkConfiguration.prototype.globalName = function globalName(resourcePath, newName) {
          assertProcessed(this);
          this.resourcesToLoad[resourcePath] = { moduleId: newName, relativeTo: '' };
          return this;
        };

        FrameworkConfiguration.prototype.plugin = function plugin(_plugin, config) {
          assertProcessed(this);

          if (typeof _plugin === 'string') {
            return this.plugin({ moduleId: _plugin, resourcesRelativeTo: [_plugin, ''], config: config || {} });
          }

          this.info.push(_plugin);
          return this;
        };

        FrameworkConfiguration.prototype._addNormalizedPlugin = function _addNormalizedPlugin(name, config) {
          var _this5 = this;

          var plugin = { moduleId: name, resourcesRelativeTo: [name, ''], config: config || {} };
          this.plugin(plugin);

          this.preTask(function () {
            var relativeTo = [name, _this5.bootstrapperName];
            plugin.moduleId = name;
            plugin.resourcesRelativeTo = relativeTo;
            return Promise.resolve();
          });

          return this;
        };

        FrameworkConfiguration.prototype.defaultBindingLanguage = function defaultBindingLanguage() {
          return this._addNormalizedPlugin('aurelia-templating-binding');
        };

        FrameworkConfiguration.prototype.router = function router() {
          return this._addNormalizedPlugin('aurelia-templating-router');
        };

        FrameworkConfiguration.prototype.history = function history() {
          return this._addNormalizedPlugin('aurelia-history-browser');
        };

        FrameworkConfiguration.prototype.defaultResources = function defaultResources() {
          return this._addNormalizedPlugin('aurelia-templating-resources');
        };

        FrameworkConfiguration.prototype.eventAggregator = function eventAggregator() {
          return this._addNormalizedPlugin('aurelia-event-aggregator');
        };

        FrameworkConfiguration.prototype.basicConfiguration = function basicConfiguration() {
          return this.defaultBindingLanguage().defaultResources().eventAggregator();
        };

        FrameworkConfiguration.prototype.standardConfiguration = function standardConfiguration() {
          return this.basicConfiguration().history().router();
        };

        FrameworkConfiguration.prototype.developmentLogging = function developmentLogging() {
          var _this6 = this;

          this.preTask(function () {
            return _this6.aurelia.loader.normalize('aurelia-logging-console', _this6.bootstrapperName).then(function (name) {
              return _this6.aurelia.loader.loadModule(name).then(function (m) {
                TheLogManager.addAppender(new m.ConsoleAppender());
                TheLogManager.setLevel(TheLogManager.logLevel.debug);
              });
            });
          });

          return this;
        };

        FrameworkConfiguration.prototype.apply = function apply() {
          var _this7 = this;

          if (this.processed) {
            return Promise.resolve();
          }

          return runTasks(this, this.preTasks).then(function () {
            var loader = _this7.aurelia.loader;
            var info = _this7.info;
            var current = void 0;

            var next = function next() {
              current = info.shift();
              if (current) {
                return loadPlugin(_this7, loader, current).then(next);
              }

              _this7.processed = true;
              return Promise.resolve();
            };

            return next().then(function () {
              return runTasks(_this7, _this7.postTasks);
            });
          });
        };

        return FrameworkConfiguration;
      }());

      _export('FrameworkConfiguration', FrameworkConfiguration);

      _export('LogManager', LogManager = TheLogManager);

      _export('LogManager', LogManager);
    }
  };
});
