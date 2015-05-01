System.register(['core-js', 'aurelia-logging', 'aurelia-dependency-injection', 'aurelia-loader', 'aurelia-path', './plugins', 'aurelia-templating'], function (_export) {
  var core, LogManager, Container, Loader, join, relativeToFile, Plugins, BindingLanguage, ViewEngine, ViewSlot, ResourceRegistry, CompositionEngine, Animator, _classCallCheck, logger, slice, CustomEvent, Aurelia;

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
      LogManager = _aureliaLogging;
    }, function (_aureliaDependencyInjection) {
      Container = _aureliaDependencyInjection.Container;
    }, function (_aureliaLoader) {
      Loader = _aureliaLoader.Loader;
    }, function (_aureliaPath) {
      join = _aureliaPath.join;
      relativeToFile = _aureliaPath.relativeToFile;
    }, function (_plugins) {
      Plugins = _plugins.Plugins;
    }, function (_aureliaTemplating) {
      BindingLanguage = _aureliaTemplating.BindingLanguage;
      ViewEngine = _aureliaTemplating.ViewEngine;
      ViewSlot = _aureliaTemplating.ViewSlot;
      ResourceRegistry = _aureliaTemplating.ResourceRegistry;
      CompositionEngine = _aureliaTemplating.CompositionEngine;
      Animator = _aureliaTemplating.Animator;
    }],
    execute: function () {
      'use strict';

      _classCallCheck = function (instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } };

      logger = LogManager.getLogger('aurelia');
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
        }

        Aurelia.prototype.withInstance = function withInstance(type, instance) {
          this.container.registerInstance(type, instance);
          return this;
        };

        Aurelia.prototype.withSingleton = function withSingleton(type, implementation) {
          this.container.registerSingleton(type, implementation);
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
          var _this = this;

          if (this.started) {
            return Promise.resolve(this);
          }

          this.started = true;
          logger.info('Aurelia Starting');

          preventActionlessFormSubmit();

          return this.use._process().then(function () {
            if (!_this.container.hasHandler(BindingLanguage)) {
              var message = 'You must configure Aurelia with a BindingLanguage implementation.';
              logger.error(message);
              throw new Error(message);
            }

            if (!_this.container.hasHandler(Animator)) {
              Animator.configureDefault(_this.container);
            }

            return loadResources(_this.container, _this.resourcesToLoad, _this.resources).then(function () {
              logger.info('Aurelia Started');
              var evt = new window.CustomEvent('aurelia-started', { bubbles: true, cancelable: true });
              document.dispatchEvent(evt);
              return _this;
            });
          });
        };

        Aurelia.prototype.setRoot = function setRoot() {
          var _this2 = this;

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
          this.container.registerInstance(Element, this.host);

          compositionEngine = this.container.get(CompositionEngine);
          instruction.viewModel = root;
          instruction.container = instruction.childContainer = this.container;
          instruction.viewSlot = new ViewSlot(this.host, true);
          instruction.viewSlot.transformChildNodesIntoView();

          return compositionEngine.compose(instruction).then(function (root) {
            _this2.root = root;
            instruction.viewSlot.attached();
            var evt = new window.CustomEvent('aurelia-composed', { bubbles: true, cancelable: true });
            setTimeout(function () {
              return document.dispatchEvent(evt);
            }, 1);
            return _this2;
          });
        };

        return Aurelia;
      })();

      _export('Aurelia', Aurelia);
    }
  };
});