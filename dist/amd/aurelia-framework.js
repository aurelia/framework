define(['exports', 'core-js', 'aurelia-logging', 'aurelia-templating', 'aurelia-path', 'aurelia-dependency-injection', 'aurelia-loader', 'aurelia-binding', 'aurelia-metadata', 'aurelia-task-queue'], function (exports, _coreJs, _aureliaLogging, _aureliaTemplating, _aureliaPath, _aureliaDependencyInjection, _aureliaLoader, _aureliaBinding, _aureliaMetadata, _aureliaTaskQueue) {
  'use strict';

  exports.__esModule = true;

  function _interopExportWildcard(obj, defaults) { var newObj = defaults({}, obj); delete newObj['default']; return newObj; }

  function _defaults(obj, defaults) { var keys = Object.getOwnPropertyNames(defaults); for (var i = 0; i < keys.length; i++) { var key = keys[i]; var value = Object.getOwnPropertyDescriptor(defaults, key); if (value && value.configurable && obj[key] === undefined) { Object.defineProperty(obj, key, value); } } return obj; }

  function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

  var logger = _aureliaLogging.getLogger('aurelia');

  function runTasks(config, tasks) {
    var current = undefined;
    var next = function next() {
      if (current = tasks.shift()) {
        return Promise.resolve(current(config)).then(next);
      }

      return Promise.resolve();
    };

    return next();
  }

  function loadPlugin(config, loader, info) {
    logger.debug('Loading plugin ' + info.moduleId + '.');
    config.resourcesRelativeTo = info.resourcesRelativeTo;

    return loader.loadModule(info.moduleId).then(function (m) {
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

  function loadResources(container, resourcesToLoad, appResources) {
    var viewEngine = container.get(_aureliaTemplating.ViewEngine);
    var importIds = Object.keys(resourcesToLoad);
    var names = new Array(importIds.length);

    for (var i = 0, ii = importIds.length; i < ii; ++i) {
      names[i] = resourcesToLoad[importIds[i]];
    }

    return viewEngine.importViewResources(importIds, names, appResources);
  }

  function assertProcessed(plugins) {
    if (plugins.processed) {
      throw new Error('This config instance has already been applied. To load more plugins or global resources, create a new FrameworkConfiguration instance.');
    }
  }

  var FrameworkConfiguration = (function () {
    function FrameworkConfiguration(aurelia) {
      var _this = this;

      _classCallCheck(this, FrameworkConfiguration);

      this.aurelia = aurelia;
      this.container = aurelia.container;
      this.info = [];
      this.processed = false;
      this.preTasks = [];
      this.postTasks = [];
      this.resourcesToLoad = {};
      this.preTask(function () {
        return System.normalize('aurelia-bootstrapper').then(function (bootstrapperName) {
          return _this.bootstrapperName = bootstrapperName;
        });
      });
      this.postTask(function () {
        return loadResources(aurelia.container, _this.resourcesToLoad, aurelia.resources);
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
      plugin = plugin.endsWith('.js') || plugin.endsWith('.ts') ? plugin.substring(0, plugin.length - 3) : plugin;
      return this.plugin({ moduleId: plugin + '/index', resourcesRelativeTo: plugin, config: config || {} });
    };

    FrameworkConfiguration.prototype.globalResources = function globalResources(resources) {
      assertProcessed(this);

      var toAdd = Array.isArray(resources) ? resources : arguments;
      var resource = undefined;
      var path = undefined;
      var resourcesRelativeTo = this.resourcesRelativeTo || '';

      for (var i = 0, ii = toAdd.length; i < ii; ++i) {
        resource = toAdd[i];
        if (typeof resource !== 'string') {
          throw new Error('Invalid resource path [' + resource + ']. Resources must be specified as relative module IDs.');
        }

        path = _aureliaPath.join(resourcesRelativeTo, resource);
        this.resourcesToLoad[path] = this.resourcesToLoad[path];
      }

      return this;
    };

    FrameworkConfiguration.prototype.globalName = function globalName(resourcePath, newName) {
      assertProcessed(this);
      this.resourcesToLoad[resourcePath] = newName;
      return this;
    };

    FrameworkConfiguration.prototype.plugin = function plugin(_plugin, config) {
      assertProcessed(this);

      if (typeof _plugin === 'string') {
        _plugin = _plugin.endsWith('.js') || _plugin.endsWith('.ts') ? _plugin.substring(0, _plugin.length - 3) : _plugin;
        return this.plugin({ moduleId: _plugin, resourcesRelativeTo: _plugin, config: config || {} });
      }

      this.info.push(_plugin);
      return this;
    };

    FrameworkConfiguration.prototype._addNormalizedPlugin = function _addNormalizedPlugin(name, config) {
      var _this2 = this;

      var plugin = { moduleId: name, resourcesRelativeTo: name, config: config || {} };

      this.plugin(plugin);
      this.preTask(function () {
        return System.normalize(name, _this2.bootstrapperName).then(function (normalizedName) {
          normalizedName = normalizedName.endsWith('.js') || normalizedName.endsWith('.ts') ? normalizedName.substring(0, normalizedName.length - 3) : normalizedName;

          plugin.moduleId = normalizedName;
          plugin.resourcesRelativeTo = normalizedName;
          System.map[name] = normalizedName;
        });
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

    FrameworkConfiguration.prototype.standardConfiguration = function standardConfiguration() {
      return this.defaultBindingLanguage().defaultResources().history().router().eventAggregator();
    };

    FrameworkConfiguration.prototype.developmentLogging = function developmentLogging() {
      var _this3 = this;

      this.preTask(function () {
        return System.normalize('aurelia-logging-console', _this3.bootstrapperName).then(function (name) {
          return _this3.aurelia.loader.loadModule(name).then(function (m) {
            _aureliaLogging.addAppender(new m.ConsoleAppender());
            _aureliaLogging.setLevel(_aureliaLogging.logLevel.debug);
          });
        });
      });

      return this;
    };

    FrameworkConfiguration.prototype.apply = function apply() {
      var _this4 = this;

      if (this.processed) {
        return Promise.resolve();
      }

      return runTasks(this, this.preTasks).then(function () {
        var loader = _this4.aurelia.loader;
        var info = _this4.info;
        var current = undefined;

        var next = function next() {
          if (current = info.shift()) {
            return loadPlugin(_this4, loader, current).then(next);
          }

          _this4.processed = true;
          return Promise.resolve();
        };

        return next().then(function () {
          return runTasks(_this4, _this4.postTasks);
        });
      });
    };

    return FrameworkConfiguration;
  })();

  exports.FrameworkConfiguration = FrameworkConfiguration;

  if (!window.CustomEvent || typeof window.CustomEvent !== 'function') {
    var _CustomEvent = function _CustomEvent(event, params) {
      params = params || {
        bubbles: false,
        cancelable: false,
        detail: undefined
      };

      var evt = document.createEvent('CustomEvent');
      evt.initCustomEvent(event, params.bubbles, params.cancelable, params.detail);
      return evt;
    };

    _CustomEvent.prototype = window.Event.prototype;
    window.CustomEvent = _CustomEvent;
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

  var Aurelia = (function () {
    function Aurelia(loader, container, resources) {
      _classCallCheck(this, Aurelia);

      this.loader = loader || new window.AureliaLoader();
      this.container = container || new _aureliaDependencyInjection.Container();
      this.resources = resources || new _aureliaTemplating.ViewResources();
      this.use = new FrameworkConfiguration(this);
      this.logger = _aureliaLogging.getLogger('aurelia');
      this.hostConfigured = false;
      this.host = null;

      this.use.instance(Aurelia, this);
      this.use.instance(_aureliaLoader.Loader, this.loader);
      this.use.instance(_aureliaTemplating.ViewResources, this.resources);
      this.container.makeGlobal();
    }

    Aurelia.prototype.start = function start() {
      var _this5 = this;

      if (this.started) {
        return Promise.resolve(this);
      }

      this.started = true;
      this.logger.info('Aurelia Starting');

      return this.use.apply().then(function () {
        preventActionlessFormSubmit();

        if (!_this5.container.hasHandler(_aureliaTemplating.BindingLanguage)) {
          var message = 'You must configure Aurelia with a BindingLanguage implementation.';
          _this5.logger.error(message);
          throw new Error(message);
        }

        if (!_this5.container.hasHandler(_aureliaTemplating.Animator)) {
          _aureliaTemplating.Animator.configureDefault(_this5.container);
        }

        _this5.logger.info('Aurelia Started');
        var evt = new window.CustomEvent('aurelia-started', { bubbles: true, cancelable: true });
        document.dispatchEvent(evt);
        return _this5;
      });
    };

    Aurelia.prototype.enhance = function enhance() {
      var _this6 = this;

      var bindingContext = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];
      var applicationHost = arguments.length <= 1 || arguments[1] === undefined ? null : arguments[1];

      this._configureHost(applicationHost);

      return new Promise(function (resolve) {
        var viewEngine = _this6.container.get(_aureliaTemplating.ViewEngine);
        _this6.root = viewEngine.enhance(_this6.container, _this6.host, _this6.resources, bindingContext);
        _this6.root.attached();
        _this6._onAureliaComposed();
        return _this6;
      });
    };

    Aurelia.prototype.setRoot = function setRoot() {
      var _this7 = this;

      var root = arguments.length <= 0 || arguments[0] === undefined ? 'app' : arguments[0];
      var applicationHost = arguments.length <= 1 || arguments[1] === undefined ? null : arguments[1];

      var compositionEngine = undefined;
      var instruction = {};

      this._configureHost(applicationHost);

      compositionEngine = this.container.get(_aureliaTemplating.CompositionEngine);
      instruction.viewModel = root;
      instruction.container = instruction.childContainer = this.container;
      instruction.viewSlot = this.hostSlot;
      instruction.host = this.host;

      return compositionEngine.compose(instruction).then(function (r) {
        _this7.root = r;
        instruction.viewSlot.attached();
        _this7._onAureliaComposed();
        return _this7;
      });
    };

    Aurelia.prototype._configureHost = function _configureHost(applicationHost) {
      if (this.hostConfigured) {
        return;
      }

      applicationHost = applicationHost || this.host;

      if (!applicationHost || typeof applicationHost === 'string') {
        this.host = document.getElementById(applicationHost || 'applicationHost') || document.body;
      } else {
        this.host = applicationHost;
      }

      this.hostConfigured = true;
      this.host.aurelia = this;
      this.hostSlot = new _aureliaTemplating.ViewSlot(this.host, true);
      this.hostSlot.transformChildNodesIntoView();
      this.container.registerInstance(_aureliaTemplating.DOMBoundary, this.host);
    };

    Aurelia.prototype._onAureliaComposed = function _onAureliaComposed() {
      var evt = new window.CustomEvent('aurelia-composed', { bubbles: true, cancelable: true });
      setTimeout(function () {
        return document.dispatchEvent(evt);
      }, 1);
    };

    return Aurelia;
  })();

  exports.Aurelia = Aurelia;

  _defaults(exports, _interopExportWildcard(_aureliaDependencyInjection, _defaults));

  _defaults(exports, _interopExportWildcard(_aureliaBinding, _defaults));

  _defaults(exports, _interopExportWildcard(_aureliaMetadata, _defaults));

  _defaults(exports, _interopExportWildcard(_aureliaTemplating, _defaults));

  _defaults(exports, _interopExportWildcard(_aureliaLoader, _defaults));

  _defaults(exports, _interopExportWildcard(_aureliaTaskQueue, _defaults));

  _defaults(exports, _interopExportWildcard(_aureliaPath, _defaults));

  var LogManager = _aureliaLogging;
  exports.LogManager = LogManager;
});