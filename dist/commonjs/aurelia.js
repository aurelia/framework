"use strict";

var LogManager = require('aurelia-logging');

var Container = require('aurelia-dependency-injection').Container;
var Loader = require('aurelia-loader').Loader;
var BindingLanguage = require('aurelia-templating').BindingLanguage;
var ResourceCoordinator = require('aurelia-templating').ResourceCoordinator;
var ViewSlot = require('aurelia-templating').ViewSlot;
var ResourceRegistry = require('aurelia-templating').ResourceRegistry;
var EventAggregator = require('aurelia-event-aggregator').EventAggregator;
var includeEventsIn = require('aurelia-event-aggregator').includeEventsIn;


var logger = LogManager.getLogger("aurelia");

var Aurelia = (function () {
  var Aurelia = function Aurelia(loader, container, resources) {
    this.loader = loader || Loader.createDefaultLoader();
    this.container = container || new Container();
    this.resources = resources || new ResourceRegistry();
    this.resourcesToLoad = [];

    this.withInstance(Aurelia, this);
    this.withInstance(Loader, this.loader);
    this.withInstance(ResourceRegistry, this.resources);
    this.withInstance(EventAggregator, includeEventsIn(this));
  };

  Aurelia.prototype.withInstance = function (type, instance) {
    this.container.registerInstance(type, instance);
    return this;
  };

  Aurelia.prototype.withSingleton = function (type, implementation) {
    this.container.registerSingleton(type, implementation);
    return this;
  };

  Aurelia.prototype.withBindingLanguage = function (languageType) {
    this.container.registerSingleton(BindingLanguage, languageType);
    return this;
  };

  Aurelia.prototype.withPlugins = function (config, baseUrl) {
    logger.error("withPlugins is not yet implemented");
    return this;
  };

  Aurelia.prototype.withResources = function (resources) {
    if (Array.isArray(resources)) {
      this.resourcesToLoad = this.resourcesToLoad.concat(resources);
    } else {
      this.resourcesToLoad = this.resourcesToLoad.concat(Array.prototype.slice.call(arguments));
    }

    return this;
  };

  Aurelia.prototype.start = function () {
    var _this = this;
    if (this.started) {
      return;
    }

    this.started = true;
    logger.info("Aurelia Starting");

    if (!this.container.hasHandler(BindingLanguage)) {
      logger.error("You must configure Aurelia with a BindingLanguage implementation.");
    }

    return this.container.get(ResourceCoordinator).importResources(this.resourcesToLoad).then(function (resources) {
      resources.forEach(function (x) {
        return x.register(_this.resources);
      });
      logger.info("Aurelia Started");
      return _this;
    });
  };

  Aurelia.prototype.setRoot = function (root, transition, applicationHost) {
    var _this2 = this;
    if (!applicationHost || typeof applicationHost == "string") {
      this.host = document.getElementById(applicationHost || "applicationHost") || document.body;
    } else {
      this.host = applicationHost;
    }

    this.host.aurelia = this;

    return this.container.get(ResourceCoordinator).loadElement(root).then(function (type) {
      _this2.root = type.create(_this2.container);
      var slot = new ViewSlot(_this2.host, true);
      slot.swap(_this2.root.view);
      slot.attached();
      return _this2;
    });
  };

  return Aurelia;
})();

exports.Aurelia = Aurelia;