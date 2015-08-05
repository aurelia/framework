'use strict';

exports.__esModule = true;

function _defaults(obj, defaults) { var keys = Object.getOwnPropertyNames(defaults); for (var i = 0; i < keys.length; i++) { var key = keys[i]; var value = Object.getOwnPropertyDescriptor(defaults, key); if (value && value.configurable && obj[key] === undefined) { Object.defineProperty(obj, key, value); } } return obj; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj['default'] = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var _coreJs = require('core-js');

var _coreJs2 = _interopRequireDefault(_coreJs);

var _aureliaLogging = require('aurelia-logging');

var TheLogManager = _interopRequireWildcard(_aureliaLogging);

var _aureliaMetadata = require('aurelia-metadata');

var _aureliaDependencyInjection = require('aurelia-dependency-injection');

var _aureliaLoader = require('aurelia-loader');

var _aureliaPath = require('aurelia-path');

var _aureliaTemplating = require('aurelia-templating');

var logger = TheLogManager.getLogger('aurelia');

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

var Plugins = (function () {
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

  Plugins.prototype.defaultBindingLanguage = function defaultBindingLanguage() {
    var _this2 = this;

    this.aurelia.addPreStartTask(function () {
      return System.normalize('aurelia-templating-binding', _this2.bootstrapperName).then(function (name) {
        _this2.aurelia.use.plugin(name);
      });
    });

    return this;
  };

  Plugins.prototype.router = function router() {
    var _this3 = this;

    this.aurelia.addPreStartTask(function () {
      return System.normalize('aurelia-templating-router', _this3.bootstrapperName).then(function (name) {
        _this3.aurelia.use.plugin(name);
      });
    });

    return this;
  };

  Plugins.prototype.history = function history() {
    var _this4 = this;

    this.aurelia.addPreStartTask(function () {
      return System.normalize('aurelia-history-browser', _this4.bootstrapperName).then(function (name) {
        _this4.aurelia.use.plugin(name);
      });
    });

    return this;
  };

  Plugins.prototype.defaultResources = function defaultResources() {
    var _this5 = this;

    this.aurelia.addPreStartTask(function () {
      return System.normalize('aurelia-templating-resources', _this5.bootstrapperName).then(function (name) {
        System.map['aurelia-templating-resources'] = name;
        _this5.aurelia.use.plugin(name);
      });
    });

    return this;
  };

  Plugins.prototype.eventAggregator = function eventAggregator() {
    var _this6 = this;

    this.aurelia.addPreStartTask(function () {
      return System.normalize('aurelia-event-aggregator', _this6.bootstrapperName).then(function (name) {
        System.map['aurelia-event-aggregator'] = name;
        _this6.aurelia.use.plugin(name);
      });
    });

    return this;
  };

  Plugins.prototype.standardConfiguration = function standardConfiguration() {
    return this.aurelia.use.defaultBindingLanguage().defaultResources().history().router().eventAggregator();
  };

  Plugins.prototype.developmentLogging = function developmentLogging() {
    var _this7 = this;

    this.aurelia.addPreStartTask(function () {
      return System.normalize('aurelia-logging-console', _this7.bootstrapperName).then(function (name) {
        return _this7.aurelia.loader.loadModule(name).then(function (m) {
          TheLogManager.addAppender(new m.ConsoleAppender());
          TheLogManager.setLevel(TheLogManager.logLevel.debug);
        });
      });
    });

    return this;
  };

  Plugins.prototype._process = function _process() {
    var _this8 = this;

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

      _this8.processed = true;
      return Promise.resolve();
    };

    return next();
  };

  return Plugins;
})();

exports.Plugins = Plugins;

var logger = TheLogManager.getLogger('aurelia'),
    slice = Array.prototype.slice;

if (!window.CustomEvent || typeof window.CustomEvent !== 'function') {
  var CustomEvent = function CustomEvent(event, params) {
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
  var viewEngine = container.get(_aureliaTemplating.ViewEngine),
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

var Aurelia = (function () {
  function Aurelia(loader, container, resources) {
    _classCallCheck(this, Aurelia);

    this.resourcesToLoad = {};
    this.preStartTasks = [];
    this.postStartTasks = [];
    this.loader = loader || new window.AureliaLoader();
    this.container = container || new _aureliaDependencyInjection.Container();
    this.resources = resources || new _aureliaTemplating.ResourceRegistry();
    this.use = new Plugins(this);

    this.withInstance(Aurelia, this);
    this.withInstance(_aureliaLoader.Loader, this.loader);
    this.withInstance(_aureliaTemplating.ResourceRegistry, this.resources);

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

      path = _aureliaPath.join(resourcesRelativeTo, resource);
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
    var _this9 = this;

    if (this.started) {
      return Promise.resolve(this);
    }

    this.started = true;
    logger.info('Aurelia Starting');

    preventActionlessFormSubmit();

    return runTasks(this, this.preStartTasks).then(function () {
      return _this9.use._process().then(function () {
        if (!_this9.container.hasHandler(_aureliaTemplating.BindingLanguage)) {
          var message = 'You must configure Aurelia with a BindingLanguage implementation.';
          logger.error(message);
          throw new Error(message);
        }

        if (!_this9.container.hasHandler(_aureliaTemplating.Animator)) {
          _aureliaTemplating.Animator.configureDefault(_this9.container);
        }

        return loadResources(_this9.container, _this9.resourcesToLoad, _this9.resources);
      }).then(function () {
        return runTasks(_this9, _this9.postStartTasks).then(function () {
          logger.info('Aurelia Started');
          var evt = new window.CustomEvent('aurelia-started', { bubbles: true, cancelable: true });
          document.dispatchEvent(evt);
          return _this9;
        });
      });
    });
  };

  Aurelia.prototype.enhance = function enhance() {
    var _this10 = this;

    var bindingContext = arguments[0] === undefined ? {} : arguments[0];
    var applicationHost = arguments[1] === undefined ? null : arguments[1];

    this._configureHost(applicationHost);

    return new Promise(function (resolve) {
      var viewEngine = _this10.container.get(_aureliaTemplating.ViewEngine);
      _this10.root = viewEngine.enhance(_this10.container, _this10.host, _this10.resources, bindingContext);
      _this10.root.attached();
      _this10._onAureliaComposed();
      return _this10;
    });
  };

  Aurelia.prototype.setRoot = function setRoot() {
    var _this11 = this;

    var root = arguments[0] === undefined ? 'app' : arguments[0];
    var applicationHost = arguments[1] === undefined ? null : arguments[1];

    var compositionEngine,
        instruction = {};

    this._configureHost(applicationHost);

    compositionEngine = this.container.get(_aureliaTemplating.CompositionEngine);
    instruction.viewModel = root;
    instruction.container = instruction.childContainer = this.container;
    instruction.viewSlot = new _aureliaTemplating.ViewSlot(this.host, true);
    instruction.viewSlot.transformChildNodesIntoView();
    instruction.host = this.host;

    return compositionEngine.compose(instruction).then(function (root) {
      _this11.root = root;
      instruction.viewSlot.attached();
      _this11._onAureliaComposed();
      return _this11;
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

_defaults(exports, _interopRequireWildcard(_aureliaDependencyInjection));

var _aureliaBinding = require('aurelia-binding');

_defaults(exports, _interopRequireWildcard(_aureliaBinding));

_defaults(exports, _interopRequireWildcard(_aureliaMetadata));

_defaults(exports, _interopRequireWildcard(_aureliaTemplating));

_defaults(exports, _interopRequireWildcard(_aureliaLoader));

var _aureliaTaskQueue = require('aurelia-task-queue');

_defaults(exports, _interopRequireWildcard(_aureliaTaskQueue));

_defaults(exports, _interopRequireWildcard(_aureliaPath));

var LogManager = TheLogManager;
exports.LogManager = LogManager;