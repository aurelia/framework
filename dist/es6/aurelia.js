import * as LogManager from 'aurelia-logging';
import {Container} from 'aurelia-dependency-injection';
import {Loader} from 'aurelia-loader';
import {BindingLanguage, ResourceCoordinator, ViewSlot, ResourceRegistry, CompositionEngine} from 'aurelia-templating';
import {Plugins} from './plugins';

var logger = LogManager.getLogger('aurelia'),
    slice = Array.prototype.slice;

function loadResources(container, resourcesToLoad, appResources){
  var resourceCoordinator = container.get(ResourceCoordinator), 
      current;

  function next(){
    if(current = resourcesToLoad.shift()){
      return resourceCoordinator.importResources(current, current.resourceManifestUrl).then(resources => {
        resources.forEach(x => x.register(appResources));
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
export class Aurelia {
  constructor(loader, container, resources){
    this.loader = loader || Loader.createDefaultLoader();
    this.container = container || new Container();
    this.resources = resources || new ResourceRegistry();
    this.resourcesToLoad = [];
    this.use = new Plugins(this);

    if(!this.resources.baseResourcePath){
      this.resources.baseResourcePath = System.baseUrl || '';
    }

    this.withInstance(Aurelia, this);
    this.withInstance(Loader, this.loader);
    this.withInstance(ResourceRegistry, this.resources);
  }

  /**
   * Adds an existing object to the framework's dependency injection container.
   *
   * @method withInstance
   * @param {Class} type The object type of the dependency that the framework will inject.
   * @param {Object} instance The existing instance of the dependency that the framework will inject.
   * @return {Aurelia} Returns the current Aurelia instance.
   */
  withInstance(type, instance){
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
  withSingleton(type, implementation){
    this.container.registerSingleton(type, implementation);
    return this;
  }

  /**
   * Adds a resource to be imported into the Aurelia framework.
   *
   * @method withResources
   * @param {Object|Array} resources The constructor function(s) to use when the dependency needs to be instantiated.
   * @return {Aurelia} Returns the current Aurelia instance.
   */
  withResources(resources){
    var toAdd = Array.isArray(resources) ? resources : slice.call(arguments);
    toAdd.resourceManifestUrl = this.currentPluginId;
    this.resourcesToLoad.push(toAdd);
    return this;
  }

  /**
   * Loads plugins, then resources, and then starts the Aurelia instance.
   *
   * @method start
   * @return {Aurelia} Returns the started Aurelia instance.
   */
  start(){
    if(this.started){
      return Promise.resolve(this);
    }

    this.started = true;
    logger.info('Aurelia Starting');

    var resourcesToLoad = this.resourcesToLoad;
    this.resourcesToLoad = [];

    return this.use._process().then(() => {
      if(!this.container.hasHandler(BindingLanguage)){
        logger.error('You must configure Aurelia with a BindingLanguage implementation.');
      }

      this.resourcesToLoad = this.resourcesToLoad.concat(resourcesToLoad);

      return loadResources(this.container, this.resourcesToLoad, this.resources).then(() => {
        logger.info('Aurelia Started');
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
   * @return {Aurelia} Returns the current Aurelia instance.
   */
  setRoot(root, applicationHost){
    var compositionEngine, instruction = {};

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

    return compositionEngine.compose(instruction).then(root => {
      this.root = root;
      instruction.viewSlot.attached();
      return this;
    });
  }
}