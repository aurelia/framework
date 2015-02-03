"use strict";

var _interopRequireWildcard = function (obj) { return obj && obj.__esModule ? obj : { "default": obj }; };

var _prototypeProperties = function (child, staticProps, instanceProps) { if (staticProps) Object.defineProperties(child, staticProps); if (instanceProps) Object.defineProperties(child.prototype, instanceProps); };

var LogManager = _interopRequireWildcard(require("aurelia-logging"));

var Container = require("aurelia-dependency-injection").Container;
var Loader = require("aurelia-loader").Loader;
var _aureliaTemplating = require("aurelia-templating");

var BindingLanguage = _aureliaTemplating.BindingLanguage;
var ResourceCoordinator = _aureliaTemplating.ResourceCoordinator;
var ViewSlot = _aureliaTemplating.ViewSlot;
var ResourceRegistry = _aureliaTemplating.ResourceRegistry;
var CompositionEngine = _aureliaTemplating.CompositionEngine;
var Plugins = require("./plugins").Plugins;


var logger = LogManager.getLogger("aurelia"),
    slice = Array.prototype.slice;

if (!window.CustomEvent || typeof window.CustomEvent !== "function") {
  var CustomEvent = function (event, params) {
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

var Aurelia = exports.Aurelia = (function () {
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
      configurable: true
    },
    withSingleton: {
      value: function withSingleton(type, implementation) {
        this.container.registerSingleton(type, implementation);
        return this;
      },
      writable: true,
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

        var resourcesToLoad = this.resourcesToLoad;
        this.resourcesToLoad = [];

        return this.use._process().then(function () {
          if (!_this.container.hasHandler(BindingLanguage)) {
            logger.error("You must configure Aurelia with a BindingLanguage implementation.");
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
exports.__esModule = true;