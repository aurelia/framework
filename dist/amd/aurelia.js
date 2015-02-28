define(["exports", "aurelia-logging", "aurelia-dependency-injection", "aurelia-loader", "aurelia-templating", "./plugins"], function (exports, _aureliaLogging, _aureliaDependencyInjection, _aureliaLoader, _aureliaTemplating, _plugins) {
  "use strict";

  var _prototypeProperties = function (child, staticProps, instanceProps) { if (staticProps) Object.defineProperties(child, staticProps); if (instanceProps) Object.defineProperties(child.prototype, instanceProps); };

  var _classCallCheck = function (instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } };

  var LogManager = _aureliaLogging;
  var Container = _aureliaDependencyInjection.Container;
  var Loader = _aureliaLoader.Loader;
  var BindingLanguage = _aureliaTemplating.BindingLanguage;
  var ResourceCoordinator = _aureliaTemplating.ResourceCoordinator;
  var ViewSlot = _aureliaTemplating.ViewSlot;
  var ResourceRegistry = _aureliaTemplating.ResourceRegistry;
  var CompositionEngine = _aureliaTemplating.CompositionEngine;
  var Animator = _aureliaTemplating.Animator;
  var Plugins = _plugins.Plugins;

  var logger = LogManager.getLogger("aurelia"),
      slice = Array.prototype.slice;

  if (!window.CustomEvent || typeof window.CustomEvent !== "function") {
    var CustomEvent = function CustomEvent(event, params) {
      var params = params || {
        bubbles: false,
        cancelable: false,
        detail: undefined
      };

      var evt = document.createEvent("CustomEvent");
      evt.initCustomEvent(event, params.bubbles, params.cancelable, params.detail);
      return evt;
    };

    CustomEvent.prototype = window.Event.prototype;
    window.CustomEvent = CustomEvent;
  }

  function preventActionlessFormSubmit() {
    document.body.addEventListener("submit", function (evt) {
      var target = evt.target;
      var action = target.action;

      if (target.tagName.toLowerCase() === "form" && !action) {
        evt.preventDefault();
      }
    });
  }

  function loadResources(container, resourcesToLoad, appResources) {
    var resourceCoordinator = container.get(ResourceCoordinator),
        current;

    function next() {
      if (current = resourcesToLoad.shift()) {
        return resourceCoordinator.importResources(current, current.resourceManifestUrl).then(function (resources) {
          resources.forEach(function (x) {
            return x.register(appResources);
          });
          return next();
        });
      }

      return Promise.resolve();
    }

    return next();
  }

  /**
   * The framework core that provides the main Aurelia object.
   *
   * @class Aurelia
   * @constructor
   * @param {Loader} loader The loader for this Aurelia instance to use. If a loader is not specified, Aurelia will use a defaultLoader.
   * @param {Container} container The dependency injection container for this Aurelia instance to use. If a container is not specified, Aurelia will create an empty container.
   * @param {ResourceRegistry} resources The resource registry for this Aurelia instance to use. If a resource registry is not specified, Aurelia will create an empty registry.
   */

  var Aurelia = exports.Aurelia = (function () {
    function Aurelia(loader, container, resources) {
      _classCallCheck(this, Aurelia);

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

        /**
         * Adds an existing object to the framework's dependency injection container.
         *
         * @method withInstance
         * @param {Class} type The object type of the dependency that the framework will inject.
         * @param {Object} instance The existing instance of the dependency that the framework will inject.
         * @return {Aurelia} Returns the current Aurelia instance.
         */

        value: function withInstance(type, instance) {
          this.container.registerInstance(type, instance);
          return this;
        },
        writable: true,
        configurable: true
      },
      withSingleton: {

        /**
         * Adds a singleton to the framework's dependency injection container.
         *
         * @method withSingleton
         * @param {Class} type The object type of the dependency that the framework will inject.
         * @param {Object} implementation The constructor function of the dependency that the framework will inject.
         * @return {Aurelia} Returns the current Aurelia instance.
         */

        value: function withSingleton(type, implementation) {
          this.container.registerSingleton(type, implementation);
          return this;
        },
        writable: true,
        configurable: true
      },
      withResources: {

        /**
         * Adds a resource to be imported into the Aurelia framework.
         *
         * @method withResources
         * @param {Object|Array} resources The constructor function(s) to use when the dependency needs to be instantiated.
         * @return {Aurelia} Returns the current Aurelia instance.
         */

        value: function withResources(resources) {
          var toAdd = Array.isArray(resources) ? resources : slice.call(arguments);
          toAdd.resourceManifestUrl = this.currentPluginId;
          this.resourcesToLoad.push(toAdd);
          return this;
        },
        writable: true,
        configurable: true
      },
      start: {

        /**
         * Loads plugins, then resources, and then starts the Aurelia instance.
         *
         * @method start
         * @return {Aurelia} Returns the started Aurelia instance.
         */

        value: function start() {
          var _this = this;

          if (this.started) {
            return Promise.resolve(this);
          }

          this.started = true;
          logger.info("Aurelia Starting");

          preventActionlessFormSubmit();

          var resourcesToLoad = this.resourcesToLoad;
          this.resourcesToLoad = [];

          return this.use._process().then(function () {
            if (!_this.container.hasHandler(BindingLanguage)) {
              var message = "You must configure Aurelia with a BindingLanguage implementation.";
              logger.error(message);
              throw new Error(message);
            }

            if (!_this.container.hasHandler(Animator)) {
              _this.withInstance(Animator, new Animator());
            }

            _this.resourcesToLoad = _this.resourcesToLoad.concat(resourcesToLoad);

            return loadResources(_this.container, _this.resourcesToLoad, _this.resources).then(function () {
              logger.info("Aurelia Started");
              var evt = new window.CustomEvent("aurelia-started", { bubbles: true, cancelable: true });
              document.dispatchEvent(evt);
              return _this;
            });
          });
        },
        writable: true,
        configurable: true
      },
      setRoot: {

        /**
         * Instantiates the root view-model and view and add them to the DOM.
         *
         * @method withSingleton
         * @param {Object} root The root view-model to load upon bootstrap.
         * @param {string|Object} applicationHost The DOM object that Aurelia will attach to.
         * @return {Aurelia} Returns the current Aurelia instance.
         */

        value: function setRoot(root, applicationHost) {
          var _this = this;

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
            _this.root = root;
            instruction.viewSlot.attached();
            var evt = new window.CustomEvent("aurelia-composed", { bubbles: true, cancelable: true });
            setTimeout(function () {
              return document.dispatchEvent(evt);
            }, 1);
            return _this;
          });
        },
        writable: true,
        configurable: true
      }
    });

    return Aurelia;
  })();

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
});