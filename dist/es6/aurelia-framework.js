import core from 'core-js';
import * as TheLogManager from 'aurelia-logging';
import {Metadata} from 'aurelia-metadata';
import {Container} from 'aurelia-dependency-injection';
import {Loader} from 'aurelia-loader';
import {join,relativeToFile} from 'aurelia-path';
import {BindingLanguage,ViewEngine,ViewSlot,ResourceRegistry,CompositionEngine,Animator,DOMBoundary} from 'aurelia-templating';

var logger = TheLogManager.getLogger('aurelia');

function loadPlugin(aurelia, loader, info){
  logger.debug(`Loading plugin ${info.moduleId}.`);
  aurelia.resourcesRelativeTo = info.resourcesRelativeTo;

  return loader.loadModule(info.moduleId).then(m => {
    if('configure' in m){
      return Promise.resolve(m.configure(aurelia, info.config || {})).then(() => {
        aurelia.resourcesRelativeTo = null;
        logger.debug(`Configured plugin ${info.moduleId}.`);
      });
    }else{
      aurelia.resourcesRelativeTo = null;
      logger.debug(`Loaded plugin ${info.moduleId}.`);
    }
  });
}

/**
 * Manages loading and configuring plugins.
 *
 * @class Plugins
 * @constructor
 * @param {Aurelia} aurelia An instance of Aurelia.
 */
export class Plugins {
  constructor(aurelia:Aurelia){
    this.aurelia = aurelia;
    this.info = [];
    this.processed = false;

    aurelia.addPreStartTask(() => System.normalize('aurelia-bootstrapper').then(bootstrapperName => this.bootstrapperName = bootstrapperName));
  }

  /**
   * Configures an internal feature plugin before Aurelia starts.
   *
   * @method feature
   * @param {string} plugin The folder for the internal plugin to configure (expects an index.js in that folder).
   * @param {config} config The configuration for the specified plugin.
   * @return {Plugins} Returns the current Plugins instance.
  */
  feature(plugin:string, config:any):Plugins{
    plugin = plugin.endsWith('.js') || plugin.endsWith('.ts') ? plugin.substring(0, plugin.length - 3) : plugin;
    return this.plugin({ moduleId: plugin + '/index', resourcesRelativeTo: plugin, config: config || {} });
  }

  /**
   * Configures an external, 3rd party plugin before Aurelia starts.
   *
   * @method plugin
   * @param {string} plugin The ID of the 3rd party plugin to configure.
   * @param {config} config The configuration for the specified plugin.
   * @return {Plugins} Returns the current Plugins instance.
 */
  plugin(plugin:string, config:any):Plugins{
    if(typeof(plugin) === 'string'){
      plugin = plugin.endsWith('.js') || plugin.endsWith('.ts') ? plugin.substring(0, plugin.length - 3) : plugin;
      return this.plugin({ moduleId: plugin, resourcesRelativeTo: plugin, config: config || {} });
    }

    if (this.processed) {
      loadPlugin(this.aurelia, this.aurelia.loader, plugin);
    } else {
      this.info.push(plugin);
    }

    return this;
  }

  _addNormalizedPlugin(name, config){
    var plugin = { moduleId: name, resourcesRelativeTo: name, config: config || {} };

    this.plugin(plugin);

    this.aurelia.addPreStartTask(() => {
      return System.normalize(name, this.bootstrapperName).then(normalizedName => {
        normalizedName = normalizedName.endsWith('.js') || normalizedName.endsWith('.ts')
          ? normalizedName.substring(0, normalizedName.length - 3) : normalizedName;

        plugin.moduleId = normalizedName;
        plugin.resourcesRelativeTo = normalizedName;
        System.map[name] = normalizedName;
      });
    });

    return this;
  }

  /**
   * Plugs in the default binding language from aurelia-templating-binding.
   *
   * @method defaultBindingLanguage
   * @return {Plugins} Returns the current Plugins instance.
  */
  defaultBindingLanguage():Plugins{
    return this._addNormalizedPlugin('aurelia-templating-binding');
  };

  /**
   * Plugs in the router from aurelia-templating-router.
   *
   * @method router
   * @return {Plugins} Returns the current Plugins instance.
  */
  router():Plugins{
    return this._addNormalizedPlugin('aurelia-templating-router');
  }

  /**
   * Plugs in the default history implementation from aurelia-history-browser.
   *
   * @method history
   * @return {Plugins} Returns the current Plugins instance.
  */
  history():Plugins{
    return this._addNormalizedPlugin('aurelia-history-browser');
  }

  /**
   * Plugs in the default templating resources (if, repeat, show, compose, etc.) from aurelia-templating-resources.
   *
   * @method defaultResources
   * @return {Plugins} Returns the current Plugins instance.
  */
  defaultResources():Plugins{
    return this._addNormalizedPlugin('aurelia-templating-resources');
  }

  /**
   * Plugs in the event aggregator from aurelia-event-aggregator.
   *
   * @method eventAggregator
   * @return {Plugins} Returns the current Plugins instance.
  */
  eventAggregator():Plugins{
    return this._addNormalizedPlugin('aurelia-event-aggregator');
  }

  /**
   * Sets up the Aurelia configuration. This is equivalent to calling `.defaultBindingLanguage().defaultResources().history().router().eventAggregator();`
   *
   * @method standardConfiguration
   * @return {Plugins} Returns the current Plugins instance.
  */
  standardConfiguration():Plugins{
    return this.aurelia.use
      .defaultBindingLanguage()
      .defaultResources()
      .history()
      .router()
      .eventAggregator();
  }

  /**
   * Plugs in the ConsoleAppender and sets the log level to debug.
   *
   * @method developmentLogging
   * @return {Plugins} Returns the current Plugins instance.
  */
  developmentLogging():Plugins{
    this.aurelia.addPreStartTask(() => {
      return System.normalize('aurelia-logging-console', this.bootstrapperName).then(name => {
        return this.aurelia.loader.loadModule(name).then(m => {
          TheLogManager.addAppender(new m.ConsoleAppender());
          TheLogManager.setLevel(TheLogManager.logLevel.debug);
        });
      });
    });

    return this;
  }

  _process(){
    var aurelia = this.aurelia,
        loader = aurelia.loader,
        info = this.info,
        current;

    if(this.processed){
      return;
    }

    var next = () => {
      if(current = info.shift()){
        return loadPlugin(aurelia, loader, current).then(next);
      }

      this.processed = true;
      return Promise.resolve();
    };

    return next();
  }
}

var logger = TheLogManager.getLogger('aurelia'),
    slice = Array.prototype.slice;

if (!window.CustomEvent || typeof window.CustomEvent !== 'function') {
  var CustomEvent = function(event, params) {
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
  document.body.addEventListener('submit', evt => {
    const target = evt.target;
    const action = target.action;

    if (target.tagName.toLowerCase() === 'form' && !action){
      evt.preventDefault();
    }
  });
}

function loadResources(container, resourcesToLoad, appResources){
  var viewEngine = container.get(ViewEngine),
      importIds = Object.keys(resourcesToLoad),
      names = new Array(importIds.length),
      i, ii;

  for(i = 0, ii = importIds.length; i < ii; ++i){
    names[i] = resourcesToLoad[importIds[i]];
  }

  return viewEngine.importViewResources(importIds, names, appResources);
}

function runTasks(aurelia, tasks){
  let current, next = () => {
    if(current = tasks.shift()){
      return Promise.resolve(current(aurelia)).then(next);
    }

    return Promise.resolve();
  };

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
export class Aurelia {
  loader:Loader;
  container:Container;
  resources:ResourceRegistry;
  use:Plugins;

  constructor(loader?:Loader, container?:Container, resources?:ResourceRegistry){
    this.resourcesToLoad = {};
    this.preStartTasks = [];
    this.postStartTasks = [];
    this.loader = loader || new window.AureliaLoader();
    this.container = container || new Container();
    this.resources = resources || new ResourceRegistry();
    this.use = new Plugins(this);

    this.withInstance(Aurelia, this);
    this.withInstance(Loader, this.loader);
    this.withInstance(ResourceRegistry, this.resources);

    this.container.makeGlobal();
  }

  /**
   * Adds an existing object to the framework's dependency injection container.
   *
   * @method withInstance
   * @param {Class} type The object type of the dependency that the framework will inject.
   * @param {Object} instance The existing instance of the dependency that the framework will inject.
   * @return {Aurelia} Returns the current Aurelia instance.
   */
  withInstance(type:any, instance:any):Aurelia{
    this.container.registerInstance(type, instance);
    return this;
  }

  /**
   * Adds a singleton to the framework's dependency injection container.
   *
   * @method withSingleton
   * @param {Class} type The object type of the dependency that the framework will inject.
   * @param {Object} implementation The constructor function of the dependency that the framework will inject.
   * @return {Aurelia} Returns the current Aurelia instance.
   */
  withSingleton(type:any, implementation?:Function):Aurelia{
    this.container.registerSingleton(type, implementation);
    return this;
  }

  /**
   * Adds a transient to the framework's dependency injection container.
   *
   * @method withTransient
   * @param {Class} type The object type of the dependency that the framework will inject.
   * @param {Object} implementation The constructor function of the dependency that the framework will inject.
   * @return {Aurelia} Returns the current Aurelia instance.
   */
  withTransient(type:any, implementation?:Function):Aurelia{
    this.container.registerTransient(type, implementation);
    return this;
  }

  /**
   * Adds globally available view resources to be imported into the Aurelia framework.
   *
   * @method globalizeResources
   * @param {Object|Array} resources The relative module id to the resource. (Relative to the plugin's installer.)
   * @return {Aurelia} Returns the current Aurelia instance.
   */
   globalizeResources(resources:string|string[]):Aurelia{
    var toAdd = Array.isArray(resources) ? resources : arguments,
        i, ii, resource, path,
        resourcesRelativeTo = this.resourcesRelativeTo || '';

    for(i = 0, ii = toAdd.length; i < ii; ++i){
      resource = toAdd[i];
      if(typeof resource != 'string'){
        throw new Error(`Invalid resource path [${resource}]. Resources must be specified as relative module IDs.`);
      }

      path = join(resourcesRelativeTo, resource);
      this.resourcesToLoad[path] = this.resourcesToLoad[path];
    }

    return this;
  }

  /**
   * Renames a global resource that was imported.
   *
   * @method renameGlobalResource
   * @param {String} resourcePath The path to the resource.
   * @param {String} newName The new name.
   * @return {Aurelia} Returns the current Aurelia instance.
   */
  renameGlobalResource(resourcePath:string, newName:string):Aurelia{
    this.resourcesToLoad[resourcePath] = newName;
    return this;
  }

  /**
   * Adds an async function that runs before the plugins are run.
   *
   * @method addPreStartTask
   * @param {Function} task The function to run before start.
   * @return {Aurelia} Returns the current Aurelia instance.
   */
  addPreStartTask(task:Function):Aurelia{
    this.preStartTasks.push(task);
    return this;
  }

  /**
   * Adds an async function that runs after the plugins are run.
   *
   * @method addPostStartTask
   * @param {Function} task The function to run after start.
   * @return {Aurelia} Returns the current Aurelia instance.
   */
  addPostStartTask(task:Function):Aurelia{
    this.postStartTasks.push(task);
    return this;
  }

  /**
   * Loads plugins, then resources, and then starts the Aurelia instance.
   *
   * @method start
   * @return {Promise<Aurelia>} Returns the started Aurelia instance.
   */
  start():Promise<Aurelia>{
    if(this.started){
      return Promise.resolve(this);
    }

    this.started = true;
    logger.info('Aurelia Starting');

    preventActionlessFormSubmit();

    return runTasks(this, this.preStartTasks).then(() => {
      return this.use._process().then(() => {
        if(!this.container.hasHandler(BindingLanguage)){
          var message = 'You must configure Aurelia with a BindingLanguage implementation.';
          logger.error(message);
          throw new Error(message);
        }

        if(!this.container.hasHandler(Animator)){
          Animator.configureDefault(this.container);
        }

        return loadResources(this.container, this.resourcesToLoad, this.resources);
      }).then(() => {
        return runTasks(this, this.postStartTasks).then(() => {
          logger.info('Aurelia Started');
          var evt = new window.CustomEvent('aurelia-started', { bubbles: true, cancelable: true });
          document.dispatchEvent(evt);
          return this;
        });
      });
    });
  }

  /**
   * Enhances the host's existing elements with behaviors and bindings.
   *
   * @method enhance
   * @param {Object} bindingContext A binding context for the enhanced elements.
   * @param {string|Object} applicationHost The DOM object that Aurelia will enhance.
   * @return {Promise<Aurelia>} Returns the current Aurelia instance.
   */
  enhance(bindingContext:Object={}, applicationHost=null):Promise<Aurelia>{
    this._configureHost(applicationHost);

    return new Promise((resolve) => {
      let viewEngine = this.container.get(ViewEngine);
      this.root = viewEngine.enhance(this.container, this.host, this.resources, bindingContext);
      this.root.attached();
      this._onAureliaComposed();
      return this;
    });
  }

  /**
   * Instantiates the root view-model and view and add them to the DOM.
   *
   * @method setRoot
   * @param {Object} root The root view-model to load upon bootstrap.
   * @param {string|Object} applicationHost The DOM object that Aurelia will attach to.
   * @return {Promise<Aurelia>} Returns the current Aurelia instance.
   */
  setRoot(root:string='app', applicationHost=null):Promise<Aurelia>{
    var compositionEngine, instruction = {};

    this._configureHost(applicationHost);

    compositionEngine = this.container.get(CompositionEngine);
    instruction.viewModel = root;
    instruction.container = instruction.childContainer = this.container;
    instruction.viewSlot = new ViewSlot(this.host, true);
    instruction.viewSlot.transformChildNodesIntoView();
    instruction.host = this.host;

    return compositionEngine.compose(instruction).then(root => {
      this.root = root;
      instruction.viewSlot.attached();
      this._onAureliaComposed();
      return this;
    });
  }

  _configureHost(applicationHost){
    applicationHost = applicationHost || this.host;

    if (!applicationHost || typeof applicationHost == 'string') {
      this.host = document.getElementById(applicationHost || 'applicationHost') || document.body;
    } else {
      this.host = applicationHost;
    }

    this.host.aurelia = this;
    this.container.registerInstance(DOMBoundary, this.host);
  }

  _onAureliaComposed(){
    var evt = new window.CustomEvent('aurelia-composed', { bubbles: true, cancelable: true });
    setTimeout(() => document.dispatchEvent(evt), 1);
  }
}

/**
 * The aurelia framework brings together all the required core aurelia libraries into a ready-to-go application-building platform.
 *
 * @module framework
 */

export * from 'aurelia-dependency-injection';
export * from 'aurelia-binding';
export * from 'aurelia-metadata';
export * from 'aurelia-templating';
export * from 'aurelia-loader';
export * from 'aurelia-task-queue';
export * from 'aurelia-path';

export var LogManager = TheLogManager;
