define(['exports', 'core-js', 'aurelia-logging', 'aurelia-metadata', 'aurelia-dependency-injection', 'aurelia-loader', 'aurelia-path', 'aurelia-templating', 'aurelia-binding', 'aurelia-task-queue'], function (exports, _coreJs, _aureliaLogging, _aureliaMetadata, _aureliaDependencyInjection, _aureliaLoader, _aureliaPath, _aureliaTemplating, _aureliaBinding, _aureliaTaskQueue) {
  'use strict';

  exports.__esModule = true;

  function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj['default'] = obj; return newObj; } }

  function _defaults(obj, defaults) { var keys = Object.getOwnPropertyNames(defaults); for (var i = 0; i < keys.length; i++) { var key = keys[i]; var value = Object.getOwnPropertyDescriptor(defaults, key); if (value && value.configurable && obj[key] === undefined) { Object.defineProperty(obj, key, value); } } return obj; }

  function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

  function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

  var _core = _interopRequireDefault(_coreJs);

  var logger = _aureliaLogging.getLogger('aurelia');

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

  var Plugins = (function () {
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

  exports.Plugins = Plugins;

  var logger = _aureliaLogging.getLogger('aurelia'),
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

  var Aurelia = (function () {
    function Aurelia(loader, container, resources) {
      _classCallCheck(this, Aurelia);

      this.loader = loader || new window.AureliaLoader();
      this.container = container || new _aureliaDependencyInjection.Container();
      this.resources = resources || new _aureliaTemplating.ResourceRegistry();
      this.use = new Plugins(this);
      this.resourcesToLoad = {};

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
          pluginPath = this.currentPluginId || '',
          path,
          internalPlugin = pluginPath.startsWith('./');

      for (i = 0, ii = toAdd.length; i < ii; ++i) {
        resource = toAdd[i];
        if (typeof resource != 'string') {
          throw new Error('Invalid resource path [' + resource + ']. Resources must be specified as relative module IDs.');
        }

        path = internalPlugin ? _aureliaPath.relativeToFile(resource, pluginPath) : _aureliaPath.join(pluginPath, resource);

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
        if (!_this2.container.hasHandler(_aureliaTemplating.BindingLanguage)) {
          var message = 'You must configure Aurelia with a BindingLanguage implementation.';
          logger.error(message);
          throw new Error(message);
        }

        if (!_this2.container.hasHandler(_aureliaTemplating.Animator)) {
          _aureliaTemplating.Animator.configureDefault(_this2.container);
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
      this.container.registerInstance(_aureliaTemplating.DOMBoundary, this.host);

      compositionEngine = this.container.get(_aureliaTemplating.CompositionEngine);
      instruction.viewModel = root;
      instruction.container = instruction.childContainer = this.container;
      instruction.viewSlot = new _aureliaTemplating.ViewSlot(this.host, true);
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

  exports.Aurelia = Aurelia;

  _defaults(exports, _interopRequireWildcard(_aureliaDependencyInjection));

  _defaults(exports, _interopRequireWildcard(_aureliaBinding));

  _defaults(exports, _interopRequireWildcard(_aureliaMetadata));

  _defaults(exports, _interopRequireWildcard(_aureliaTemplating));

  _defaults(exports, _interopRequireWildcard(_aureliaLoader));

  _defaults(exports, _interopRequireWildcard(_aureliaTaskQueue));

  _defaults(exports, _interopRequireWildcard(_aureliaPath));

  var LogManager = _aureliaLogging;
  exports.LogManager = LogManager;
});