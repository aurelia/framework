import * as core from 'core-js';
import * as TheLogManager from 'aurelia-logging';
import {Container} from 'aurelia-dependency-injection';
import {Loader} from 'aurelia-loader';
import {FrameworkConfiguration} from './framework-configuration';
import {
  BindingLanguage,
  ViewEngine,
  ViewSlot,
  ViewResources,
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

/**
 * The framework core that provides the main Aurelia object.
 *
 * @class Aurelia
 * @constructor
 * @param {Loader} loader The loader for this Aurelia instance to use. If a loader is not specified, Aurelia will use a defaultLoader.
 * @param {Container} container The dependency injection container for this Aurelia instance to use. If a container is not specified, Aurelia will create an empty container.
 * @param {ViewResources} resources The resource registry for this Aurelia instance to use. If a resource registry is not specified, Aurelia will create an empty registry.
 */
export class Aurelia {
  loader:Loader;
  container:Container;
  resources:ViewResources;
  use:FrameworkConfiguration;

  constructor(loader?:Loader, container?:Container, resources?:ViewResources){
    this.loader = loader || new window.AureliaLoader();
    this.container = container || new Container();
    this.resources = resources || new ViewResources();
    this.use = new FrameworkConfiguration(this);
    this.hostConfigured = false;
    this.host = null;

    this.use.instance(Aurelia, this);
    this.use.instance(Loader, this.loader);
    this.use.instance(ViewResources, this.resources);
    this.container.makeGlobal();
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

    return this.use.apply().then(() => {
      preventActionlessFormSubmit();

      if(!this.container.hasHandler(BindingLanguage)){
        var message = 'You must configure Aurelia with a BindingLanguage implementation.';
        logger.error(message);
        throw new Error(message);
      }

      if(!this.container.hasHandler(Animator)){
        Animator.configureDefault(this.container);
      }

      logger.info('Aurelia Started');
      var evt = new window.CustomEvent('aurelia-started', { bubbles: true, cancelable: true });
      document.dispatchEvent(evt);
      return this;
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
    instruction.viewSlot = this.hostSlot;
    instruction.host = this.host;

    return compositionEngine.compose(instruction).then(root => {
      this.root = root;
      instruction.viewSlot.attached();
      this._onAureliaComposed();
      return this;
    });
  }

  _configureHost(applicationHost){
    if(this.hostConfigured){
      return;
    }

    applicationHost = applicationHost || this.host;

    if (!applicationHost || typeof applicationHost == 'string') {
      this.host = document.getElementById(applicationHost || 'applicationHost') || document.body;
    } else {
      this.host = applicationHost;
    }

    this.hostConfigured = true;
    this.host.aurelia = this;
    this.hostSlot = new ViewSlot(this.host, true);
    this.hostSlot.transformChildNodesIntoView();
    this.container.registerInstance(DOMBoundary, this.host);
  }

  _onAureliaComposed(){
    var evt = new window.CustomEvent('aurelia-composed', { bubbles: true, cancelable: true });
    setTimeout(() => document.dispatchEvent(evt), 1);
  }
}
