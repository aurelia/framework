/*eslint no-unused-vars:0*/
import 'core-js';
import * as TheLogManager from 'aurelia-logging';
import {Container} from 'aurelia-dependency-injection';
import {Loader} from 'aurelia-loader';
import {BindingLanguage, ViewEngine, ViewSlot, ViewResources, CompositionEngine, Animator, templatingEngine} from 'aurelia-templating';
import {DOM, PLATFORM} from 'aurelia-pal';
import {FrameworkConfiguration} from './framework-configuration';

function preventActionlessFormSubmit() {
  DOM.addEventListener('submit', evt => {
    const target = evt.target;
    const action = target.action;

    if (target.tagName.toLowerCase() === 'form' && !action) {
      evt.preventDefault();
    }
  });
}

/**
 * The framework core that provides the main Aurelia object.
 * @param loader The loader for this Aurelia instance to use. If a loader is not specified, Aurelia will use a defaultLoader.
 * @param container The dependency injection container for this Aurelia instance to use. If a container is not specified, Aurelia will create an empty container.
 * @param resources The resource registry for this Aurelia instance to use. If a resource registry is not specified, Aurelia will create an empty registry.
 */
export class Aurelia {
  loader: Loader;
  container: Container;
  resources: ViewResources;
  use: FrameworkConfiguration;

  constructor(loader?: Loader, container?: Container, resources?: ViewResources) {
    this.loader = loader || new PLATFORM.Loader();
    this.container = container || new Container();
    this.resources = resources || new ViewResources();
    this.use = new FrameworkConfiguration(this);
    this.logger = TheLogManager.getLogger('aurelia');
    this.hostConfigured = false;
    this.host = null;

    this.use.instance(Aurelia, this);
    this.use.instance(Loader, this.loader);
    this.use.instance(ViewResources, this.resources);
    this.container.makeGlobal();
  }

  /**
   * Loads plugins, then resources, and then starts the Aurelia instance.
   * @return Returns the started Aurelia instance.
   */
  start(): Promise<Aurelia> {
    if (this.started) {
      return Promise.resolve(this);
    }

    this.started = true;
    this.logger.info('Aurelia Starting');

    return this.use.apply().then(() => {
      preventActionlessFormSubmit();

      if (!this.container.hasResolver(BindingLanguage)) {
        let message = 'You must configure Aurelia with a BindingLanguage implementation.';
        this.logger.error(message);
        throw new Error(message);
      }

      if (!this.container.hasResolver(Animator)) {
        Animator.configureDefault(this.container);
      }

      templatingEngine.initialize(this.container);

      this.logger.info('Aurelia Started');
      let evt = DOM.createCustomEvent('aurelia-started', { bubbles: true, cancelable: true });
      DOM.dispatchEvent(evt);
      return this;
    });
  }

  /**
   * Enhances the host's existing elements with behaviors and bindings.
   * @param bindingContext A binding context for the enhanced elements.
   * @param applicationHost The DOM object that Aurelia will enhance.
   * @return Returns the current Aurelia instance.
   */
  enhance(bindingContext: Object = {}, applicationHost = null): Promise<Aurelia> {
    this._configureHost(applicationHost);

    return new Promise(resolve => {
      let viewEngine = this.container.get(ViewEngine);
      this.root = viewEngine.enhance(this.container, this.host, this.resources, bindingContext);
      this.root.attached();
      this._onAureliaComposed();
      return this;
    });
  }

  /**
   * Instantiates the root view-model and view and add them to the DOM.
   * @param root The root view-model to load upon bootstrap.
   * @param applicationHost The DOM object that Aurelia will attach to.
   * @return Returns the current Aurelia instance.
   */
  setRoot(root: string = 'app', applicationHost = null): Promise<Aurelia> {
    let compositionEngine;
    let instruction = {};

    this._configureHost(applicationHost);

    compositionEngine = this.container.get(CompositionEngine);
    instruction.viewModel = root;
    instruction.container = instruction.childContainer = this.container;
    instruction.viewSlot = this.hostSlot;
    instruction.host = this.host;

    return compositionEngine.compose(instruction).then(r => {
      this.root = r;
      instruction.viewSlot.attached();
      this._onAureliaComposed();
      return this;
    });
  }

  _configureHost(applicationHost) {
    if (this.hostConfigured) {
      return;
    }

    applicationHost = applicationHost || this.host;

    if (!applicationHost || typeof applicationHost === 'string') {
      this.host = DOM.getElementById(applicationHost || 'applicationHost');
    } else {
      this.host = applicationHost;
    }

    if (!this.host) {
      throw new Error('No applicationHost was specified.');
    }

    this.hostConfigured = true;
    this.host.aurelia = this;
    this.hostSlot = new ViewSlot(this.host, true);
    this.hostSlot.transformChildNodesIntoView();
    this.container.registerInstance(DOM.boundary, this.host);
  }

  _onAureliaComposed() {
    let evt = DOM.createCustomEvent('aurelia-composed', { bubbles: true, cancelable: true });
    setTimeout(() => DOM.dispatchEvent(evt), 1);
  }
}
