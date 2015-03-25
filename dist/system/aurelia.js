System.register(["aurelia-logging", "aurelia-dependency-injection", "aurelia-loader", "aurelia-path", "./plugins", "aurelia-templating"], function (_export) {
  var LogManager, Container, Loader, join, relativeToFile, Plugins, BindingLanguage, ViewEngine, ViewSlot, ResourceRegistry, CompositionEngine, Animator, _prototypeProperties, _classCallCheck, logger, slice, CustomEvent, Aurelia;

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
    setters: [function (_aureliaLogging) {
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
      "use strict";

      _prototypeProperties = function (child, staticProps, instanceProps) { if (staticProps) Object.defineProperties(child, staticProps); if (instanceProps) Object.defineProperties(child.prototype, instanceProps); };

      _classCallCheck = function (instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } };

      logger = LogManager.getLogger("aurelia");
      slice = Array.prototype.slice;

      if (!window.CustomEvent || typeof window.CustomEvent !== "function") {
        CustomEvent = function CustomEvent(event, params) {
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
      } /**
         * The framework core that provides the main Aurelia object.
         *
         * @class Aurelia
         * @constructor
         * @param {Loader} loader The loader for this Aurelia instance to use. If a loader is not specified, Aurelia will use a defaultLoader.
         * @param {Container} container The dependency injection container for this Aurelia instance to use. If a container is not specified, Aurelia will create an empty container.
         * @param {ResourceRegistry} resources The resource registry for this Aurelia instance to use. If a resource registry is not specified, Aurelia will create an empty registry.
         */
      Aurelia = _export("Aurelia", (function () {
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
          globalizeResources: {

            /**
             * Adds globally available view resources to be imported into the Aurelia framework.
             *
             * @method globalizeResources
             * @param {Object|Array} resources The relative module id to the resource. (Relative to the plugin's installer.)
             * @return {Aurelia} Returns the current Aurelia instance.
             */

            value: function globalizeResources(resources) {
              var toAdd = Array.isArray(resources) ? resources : arguments,
                  i,
                  ii,
                  pluginPath = this.currentPluginId || "",
                  path,
                  internalPlugin = pluginPath.startsWith("./");

              for (i = 0, ii = toAdd.length; i < ii; ++i) {
                path = internalPlugin ? relativeToFile(toAdd[i], pluginPath) : join(pluginPath, toAdd[i]);

                this.resourcesToLoad[path] = this.resourcesToLoad[path];
              }

              return this;
            },
            writable: true,
            configurable: true
          },
          renameGlobalResource: {

            /**
             * Renames a global resource that was imported.
             *
             * @method renameGlobalResource
             * @param {String} resourcePath The path to the resource.
             * @param {String} newName The new name.
             * @return {Aurelia} Returns the current Aurelia instance.
             */

            value: function renameGlobalResource(resourcePath, newName) {
              this.resourcesToLoad[resourcePath] = newName;
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

              return this.use._process().then(function () {
                if (!_this.container.hasHandler(BindingLanguage)) {
                  var message = "You must configure Aurelia with a BindingLanguage implementation.";
                  logger.error(message);
                  throw new Error(message);
                }

                if (!_this.container.hasHandler(Animator)) {
                  Animator.configureDefault(_this.container);
                }

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

            value: function setRoot() {
              var _this = this;

              var root = arguments[0] === undefined ? "app" : arguments[0];
              var applicationHost = arguments[1] === undefined ? null : arguments[1];

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
      })());
    }
  };
});