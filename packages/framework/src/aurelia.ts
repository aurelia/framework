import * as TheLogManager from 'aurelia-logging';
import { Container } from 'aurelia-dependency-injection';
import { Loader } from 'aurelia-loader';
import { BindingLanguage, ViewSlot, ViewResources, TemplatingEngine, CompositionTransaction } from 'aurelia-templating';
import { DOM, PLATFORM } from 'aurelia-pal';
import { relativeToFile } from 'aurelia-path';
import { FrameworkConfiguration } from './framework-configuration';

function preventActionlessFormSubmit() {
  DOM.addEventListener('submit', (evt: any) => {
    const target = evt.target;
    const action = target.action;

    if (target.tagName.toLowerCase() === 'form' && !action) {
      evt.preventDefault();
    }
  }, false);
}

/**
 * The framework core that provides the main Aurelia object.
 */
export class Aurelia {
  /**
   * The DOM Element that Aurelia will attach to.
   */
  public host: Element;
  /**
   * The loader used by the application.
   */
  public loader: Loader;
  /**
   * The root DI container used by the application.
   */
  public container: Container;
  /**
   * The global view resources used by the application.
   */
  public resources: ViewResources;

  /**
   * The configuration used during application startup.
   */
  public use: FrameworkConfiguration;

  public started: any;

  private logger: TheLogManager.Logger;
  private hostConfigured = false;
  private root: any;
  private configModuleId: any;
  private hostSlot: any;

  /**
   * Creates an instance of Aurelia.
   *
   * @param loader The loader for this Aurelia instance to use. If a loader is not specified, Aurelia will use the
   * loader type specified by PLATFORM.Loader.
   * @param container The dependency injection container for this Aurelia instance to use. If a container is not
   * specified, Aurelia will create an empty, global container.
   * @param resources The resource registry for this Aurelia instance to use. If a resource registry is not specified,
   * Aurelia will create an empty registry.
   */
  constructor(loader?: Loader, container?: Container, resources?: ViewResources) {
    this.loader = loader || new PLATFORM.Loader();
    this.container = container || (new Container()).makeGlobal();
    this.resources = resources || new ViewResources();
    this.use = new FrameworkConfiguration(this);
    this.logger = TheLogManager.getLogger('aurelia');
    this.hostConfigured = false;

    this.use.instance(Aurelia, this);
    this.use.instance(Loader, this.loader);
    this.use.instance(ViewResources, this.resources);
  }

  /**
   * Loads plugins, then resources, and then starts the Aurelia instance.
   * @return Returns a Promise with the started Aurelia instance.
   */
  public async start(): Promise<Aurelia> {
    if (!this.started) {
      this.logger.info('Aurelia Starting');

      await this.use.apply().then(() => {
        preventActionlessFormSubmit();

        if (!this.container.hasResolver(BindingLanguage)) {
          const message = 'You must configure Aurelia with a BindingLanguage implementation.';
          this.logger.error(message);
          throw new Error(message);
        }

        this.logger.info('Aurelia Started');
        const evt = DOM.createCustomEvent('aurelia-started', { bubbles: true, cancelable: true });
        DOM.dispatchEvent(evt);

        this.started = this;
      });
    }

    return this.started;
  }

  /**
   * Enhances the host's existing elements with behaviors and bindings.
   * @param bindingContext A binding context for the enhanced elements.
   * @param applicationHost The DOM object that Aurelia will enhance.
   * @return Returns a Promise for the current Aurelia instance.
   */
  public enhance(bindingContext: object = {}, applicationHost?: string | Element): Promise<Aurelia> {
    this.configureHost(applicationHost || DOM.querySelectorAll('body')[0]);

    return new Promise(resolve => {
      const engine = this.container.get(TemplatingEngine);
      this.root = engine.enhance({
        container: this.container,
        element: this.host,
        resources: this.resources,
        bindingContext
      });
      this.root.attached();
      this.onAureliaComposed();
      resolve(this);
    });
  }

  /**
   * Instantiates the root component and adds it to the DOM.
   * @param root The root component to load upon bootstrap.
   * @param applicationHost The DOM object that Aurelia will attach to.
   * @return Returns a Promise of the current Aurelia instance.
   */
  public async setRoot(root?: string, applicationHost?: string | Element): Promise<Aurelia> {
    const instruction: any = {};

    if (this.root && this.root.viewModel && this.root.viewModel.router) {
      this.root.viewModel.router.deactivate();
      this.root.viewModel.router.reset();
    }

    this.configureHost(applicationHost);

    const engine = this.container.get(TemplatingEngine);
    const transaction = this.container.get(CompositionTransaction);

    delete transaction.initialComposition;

    if (!root) {
      if (this.configModuleId) {
        root = relativeToFile('./app', this.configModuleId);
      } else {
        root = 'app';
      }
    }

    instruction.viewModel = root;
    instruction.container = instruction.childContainer = this.container;
    instruction.viewSlot = this.hostSlot;
    instruction.host = this.host;

    return engine.compose(instruction).then((r: any) => {
      this.root = r;
      instruction.viewSlot.attached();
      this.onAureliaComposed();
      return this;
    });
  }

  private configureHost(applicationHost: any) {
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
    (this.host as any).aurelia = this;
    this.hostSlot = new ViewSlot(this.host, true);
    this.hostSlot.transformChildNodesIntoView();
    this.container.registerInstance(DOM.boundary, this.host);
  }

  private onAureliaComposed() {
    const evt = DOM.createCustomEvent('aurelia-composed', { bubbles: true, cancelable: true });
    setTimeout(() => DOM.dispatchEvent(evt), 1);
  }
}
