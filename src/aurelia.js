import core from 'core-js';
import * as TheLogManager from 'aurelia-logging';
import {Container} from 'aurelia-dependency-injection';
import {Loader} from 'aurelia-loader';
import {join,relativeToFile} from 'aurelia-path';
import {Plugins} from './plugins';
import {
  BindingLanguage,
  ViewEngine,
  ViewSlot,
  ResourceRegistry,
  CompositionEngine,
  Animator,
  DOMBoundary
} from 'aurelia-templating';

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
    this.loader = loader || new window.AureliaLoader();
    this.container = container || new Container();
    this.resources = resources || new ResourceRegistry();
    this.use = new Plugins(this);
    this.resourcesToLoad = {};

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
        i, ii, resource, pluginPath = this.currentPluginId || '', path,
        internalPlugin = pluginPath.startsWith('./');

    for(i = 0, ii = toAdd.length; i < ii; ++i){
      resource = toAdd[i];
      if(typeof resource != 'string'){
        throw new Error(`Invalid resource path [${resource}]. Resources must be specified as relative module IDs.`);
      }

      path = internalPlugin
        ? relativeToFile(resource, pluginPath)
        : join(pluginPath, resource);

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

    return this.use._process().then(() => {
      if(!this.container.hasHandler(BindingLanguage)){
        var message = 'You must configure Aurelia with a BindingLanguage implementation.';
        logger.error(message);
        throw new Error(message);
      }

      if(!this.container.hasHandler(Animator)){
        Animator.configureDefault(this.container);
      }

      return loadResources(this.container, this.resourcesToLoad, this.resources).then(() => {
        logger.info('Aurelia Started');
        var evt = new window.CustomEvent('aurelia-started', { bubbles: true, cancelable: true });
        document.dispatchEvent(evt);
        return this;
      });
    });
  }

  /**
   * Instantiates the root view-model and view and add them to the DOM.
   *
   * @method withSingleton
   * @param {Object} root The root view-model to load upon bootstrap.
   * @param {string|Object} applicationHost The DOM object that Aurelia will attach to.
   * @return {Promise<Aurelia>} Returns the current Aurelia instance.
   */
  setRoot(root:string='app', applicationHost=null):Promise<Aurelia>{
    var compositionEngine, instruction = {};

    applicationHost = applicationHost || this.host;

    if (!applicationHost || typeof applicationHost == 'string') {
      this.host = document.getElementById(applicationHost || 'applicationHost') || document.body;
    } else {
      this.host = applicationHost;
    }

    this.host.aurelia = this;
    this.container.registerInstance(DOMBoundary, this.host);

    compositionEngine = this.container.get(CompositionEngine);
    instruction.viewModel = root;
    instruction.container = instruction.childContainer = this.container;
    instruction.viewSlot = new ViewSlot(this.host, true);
    instruction.viewSlot.transformChildNodesIntoView();
    instruction.host = this.host;

    return compositionEngine.compose(instruction).then(root => {
      this.root = root;
      instruction.viewSlot.attached();
      var evt = new window.CustomEvent('aurelia-composed', { bubbles: true, cancelable: true });
      setTimeout(() => document.dispatchEvent(evt), 1);
      return this;
    });
  }
}
