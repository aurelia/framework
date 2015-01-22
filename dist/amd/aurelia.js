define(["exports", "aurelia-logging", "aurelia-dependency-injection", "aurelia-loader", "aurelia-templating", "./plugins"], function (exports, _aureliaLogging, _aureliaDependencyInjection, _aureliaLoader, _aureliaTemplating, _plugins) {
  "use strict";

  var _prototypeProperties = function (child, staticProps, instanceProps) {
    if (staticProps) Object.defineProperties(child, staticProps);
    if (instanceProps) Object.defineProperties(child.prototype, instanceProps);
  };

  var LogManager = _aureliaLogging;
  var Container = _aureliaDependencyInjection.Container;
  var Loader = _aureliaLoader.Loader;
  var BindingLanguage = _aureliaTemplating.BindingLanguage;
  var ResourceCoordinator = _aureliaTemplating.ResourceCoordinator;
  var ViewSlot = _aureliaTemplating.ViewSlot;
  var ResourceRegistry = _aureliaTemplating.ResourceRegistry;
  var CompositionEngine = _aureliaTemplating.CompositionEngine;
  var Plugins = _plugins.Plugins;


  var logger = LogManager.getLogger("aurelia"),
      slice = Array.prototype.slice;

  function loadResources(container, resourcesToLoad, appResources) {
    var next = function () {
      if (current = resourcesToLoad.shift()) {
        return resourceCoordinator.importResources(current, current.resourceManifestUrl).then(function (resources) {
          resources.forEach(function (x) {
            return x.register(appResources);
          });
          return next();
        });
      }

      return Promise.resolve();
    };

    var resourceCoordinator = container.get(ResourceCoordinator),
        current;

    return next();
  }

  var Aurelia = (function () {
    function Aurelia(loader, container, resources) {
      this.loader = loader || Loader.createDefaultLoader();
      this.container = container || new Container();
      this.resources = resources || new ResourceRegistry();
      this.resourcesToLoad = [];
      this.use = new Plugins(this);

      if (!this.resources.baseResourcePath) {
        this.resources.baseResourcePath = System.baseUrl || "";
      }

      this.withInstance(Aurelia, this);
      this.withInstance(Loader, this.loader);
      this.withInstance(ResourceRegistry, this.resources);
    }

    _prototypeProperties(Aurelia, null, {
      withInstance: {
        value: function withInstance(type, instance) {
          this.container.registerInstance(type, instance);
          return this;
        },
        writable: true,
        enumerable: true,
        configurable: true
      },
      withSingleton: {
        value: function withSingleton(type, implementation) {
          this.container.registerSingleton(type, implementation);
          return this;
        },
        writable: true,
        enumerable: true,
        configurable: true
      },
      withResources: {
        value: function withResources(resources) {
          var toAdd = Array.isArray(resources) ? resources : slice.call(arguments);
          toAdd.resourceManifestUrl = this.currentPluginId;
          this.resourcesToLoad.push(toAdd);
          return this;
        },
        writable: true,
        enumerable: true,
        configurable: true
      },
      start: {
        value: function start() {
          var _this = this;
          if (this.started) {
            return Promise.resolve(this);
          }

          this.started = true;
          logger.info("Aurelia Starting");

          return this.use._process().then(function () {
            if (!_this.container.hasHandler(BindingLanguage)) {
              logger.error("You must configure Aurelia with a BindingLanguage implementation.");
            }

            return loadResources(_this.container, _this.resourcesToLoad, _this.resources).then(function () {
              logger.info("Aurelia Started");
              return _this;
            });
          });
        },
        writable: true,
        enumerable: true,
        configurable: true
      },
      setRoot: {
        value: function setRoot(root, applicationHost) {
          var _this2 = this;
          var compositionEngine,
              instruction = {};

          if (!applicationHost || typeof applicationHost == "string") {
            this.host = document.getElementById(applicationHost || "applicationHost") || document.body;
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
            return _this2;
          });
        },
        writable: true,
        enumerable: true,
        configurable: true
      }
    });

    return Aurelia;
  })();

  exports.Aurelia = Aurelia;
});