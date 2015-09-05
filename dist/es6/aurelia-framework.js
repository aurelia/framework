import * as core from 'core-js';
import * as TheLogManager from 'aurelia-logging';
import {ViewEngine,BindingLanguage,ViewSlot,ViewResources,CompositionEngine,Animator,DOMBoundary} from 'aurelia-templating';
import {join} from 'aurelia-path';
import {Container} from 'aurelia-dependency-injection';
import {Loader} from 'aurelia-loader';

/*eslint no-unused-vars:0, no-cond-assign:0*/
const logger = TheLogManager.getLogger('aurelia');

function runTasks(config, tasks) {
  let current;
  let next = () => {
    if (current = tasks.shift()) {
      return Promise.resolve(current(config)).then(next);
    }

    return Promise.resolve();
  };

  return next();
}

function loadPlugin(config, loader, info) {
  logger.debug(`Loading plugin ${info.moduleId}.`);
  config.resourcesRelativeTo = info.resourcesRelativeTo;

  return loader.loadModule(info.moduleId).then(m => {
    if ('configure' in m) {
      return Promise.resolve(m.configure(config, info.config || {})).then(() => {
        config.resourcesRelativeTo = null;
        logger.debug(`Configured plugin ${info.moduleId}.`);
      });
    }

    config.resourcesRelativeTo = null;
    logger.debug(`Loaded plugin ${info.moduleId}.`);
  });
}

function loadResources(container, resourcesToLoad, appResources) {
  let viewEngine = container.get(ViewEngine);
  let importIds = Object.keys(resourcesToLoad);
  let names = new Array(importIds.length);

  for (let i = 0, ii = importIds.length; i < ii; ++i) {
    names[i] = resourcesToLoad[importIds[i]];
  }

  return viewEngine.importViewResources(importIds, names, appResources);
}

function assertProcessed(plugins) {
  if (plugins.processed) {
    throw new Error('This config instance has already been applied. To load more plugins or global resources, create a new FrameworkConfiguration instance.');
  }
}

/**
 * Manages configuring the aurelia framework instance.
 * @param {Aurelia} aurelia An instance of Aurelia.
 */
export class FrameworkConfiguration {
  container: Container;
  aurelia: Aurelia;

  constructor(aurelia: Aurelia) {
    this.aurelia = aurelia;
    this.container = aurelia.container;
    this.info = [];
    this.processed = false;
    this.preTasks = [];
    this.postTasks = [];
    this.resourcesToLoad = {};
    this.preTask(() => System.normalize('aurelia-bootstrapper').then(bootstrapperName => this.bootstrapperName = bootstrapperName));
    this.postTask(() => loadResources(aurelia.container, this.resourcesToLoad, aurelia.resources));
  }

  /**
   * Adds an existing object to the framework's dependency injection container.
   * @param type The object type of the dependency that the framework will inject.
   * @param instance The existing instance of the dependency that the framework will inject.
   * @return Returns the current FrameworkConfiguration instance.
   */
  instance(type: any, instance: any): FrameworkConfiguration {
    this.container.registerInstance(type, instance);
    return this;
  }

  /**
   * Adds a singleton to the framework's dependency injection container.
   * @param type The object type of the dependency that the framework will inject.
   * @param implementation The constructor function of the dependency that the framework will inject.
   * @return Returns the current FrameworkConfiguration instance.
   */
  singleton(type: any, implementation?: Function): FrameworkConfiguration {
    this.container.registerSingleton(type, implementation);
    return this;
  }

  /**
   * Adds a transient to the framework's dependency injection container.
   * @param type The object type of the dependency that the framework will inject.
   * @param implementation The constructor function of the dependency that the framework will inject.
   * @return Returns the current FrameworkConfiguration instance.
   */
  transient(type: any, implementation?: Function): FrameworkConfiguration {
    this.container.registerTransient(type, implementation);
    return this;
  }

  /**
   * Adds an async function that runs before the plugins are run.
   * @param task The function to run before start.
   * @return Returns the current FrameworkConfiguration instance.
   */
  preTask(task: Function): FrameworkConfiguration {
    assertProcessed(this);
    this.preTasks.push(task);
    return this;
  }

  /**
   * Adds an async function that runs after the plugins are run.
   * @param task The function to run after start.
   * @return Returns the current FrameworkConfiguration instance.
   */
  postTask(task: Function): FrameworkConfiguration {
    assertProcessed(this);
    this.postTasks.push(task);
    return this;
  }

  /**
   * Configures an internal feature plugin before Aurelia starts.
   * @param plugin The folder for the internal plugin to configure (expects an index.js in that folder).
   * @param config The configuration for the specified plugin.
   * @return Returns the current FrameworkConfiguration instance.
  */
  feature(plugin: string, config?: any): FrameworkConfiguration {
    plugin = plugin.endsWith('.js') || plugin.endsWith('.ts') ? plugin.substring(0, plugin.length - 3) : plugin;
    return this.plugin({ moduleId: plugin + '/index', resourcesRelativeTo: plugin, config: config || {} });
  }

  /**
   * Adds globally available view resources to be imported into the Aurelia framework.
   * @param resources The relative module id to the resource. (Relative to the plugin's installer.)
   * @return Returns the current FrameworkConfiguration instance.
   */
  globalResources(resources: string|string[]): FrameworkConfiguration {
    assertProcessed(this);

    let toAdd = Array.isArray(resources) ? resources : arguments;
    let resource;
    let path;
    let resourcesRelativeTo = this.resourcesRelativeTo || '';

    for (let i = 0, ii = toAdd.length; i < ii; ++i) {
      resource = toAdd[i];
      if (typeof resource !== 'string') {
        throw new Error(`Invalid resource path [${resource}]. Resources must be specified as relative module IDs.`);
      }

      path = join(resourcesRelativeTo, resource);
      this.resourcesToLoad[path] = this.resourcesToLoad[path];
    }

    return this;
  }

  /**
   * Renames a global resource that was imported.
   * @param resourcePath The path to the resource.
   * @param newName The new name.
   * @return Returns the current FrameworkConfiguration instance.
   */
  globalName(resourcePath: string, newName: string): FrameworkConfiguration {
    assertProcessed(this);
    this.resourcesToLoad[resourcePath] = newName;
    return this;
  }

  /**
   * Configures an external, 3rd party plugin before Aurelia starts.
   * @param plugin The ID of the 3rd party plugin to configure.
   * @param config The configuration for the specified plugin.
   * @return Returns the current FrameworkConfiguration instance.
 */
  plugin(plugin: string, config?: any): FrameworkConfiguration {
    assertProcessed(this);

    if (typeof(plugin) === 'string') {
      plugin = plugin.endsWith('.js') || plugin.endsWith('.ts') ? plugin.substring(0, plugin.length - 3) : plugin;
      return this.plugin({ moduleId: plugin, resourcesRelativeTo: plugin, config: config || {} });
    }

    this.info.push(plugin);
    return this;
  }

  _addNormalizedPlugin(name, config) {
    let plugin = { moduleId: name, resourcesRelativeTo: name, config: config || {} };

    this.plugin(plugin);
    this.preTask(() => {
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
   * @return Returns the current FrameworkConfiguration instance.
  */
  defaultBindingLanguage(): FrameworkConfiguration {
    return this._addNormalizedPlugin('aurelia-templating-binding');
  }

  /**
   * Plugs in the router from aurelia-templating-router.
   * @return Returns the current FrameworkConfiguration instance.
  */
  router(): FrameworkConfiguration {
    return this._addNormalizedPlugin('aurelia-templating-router');
  }

  /**
   * Plugs in the default history implementation from aurelia-history-browser.
   * @return Returns the current FrameworkConfiguration instance.
  */
  history(): FrameworkConfiguration {
    return this._addNormalizedPlugin('aurelia-history-browser');
  }

  /**
   * Plugs in the default templating resources (if, repeat, show, compose, etc.) from aurelia-templating-resources.
   * @return Returns the current FrameworkConfiguration instance.
  */
  defaultResources(): FrameworkConfiguration {
    return this._addNormalizedPlugin('aurelia-templating-resources');
  }

  /**
   * Plugs in the event aggregator from aurelia-event-aggregator.
   * @return Returns the current FrameworkConfiguration instance.
  */
  eventAggregator(): FrameworkConfiguration {
    return this._addNormalizedPlugin('aurelia-event-aggregator');
  }

  /**
   * Sets up the Aurelia configuration. This is equivalent to calling `.defaultBindingLanguage().defaultResources().history().router().eventAggregator();`
   * @return Returns the current FrameworkConfiguration instance.
  */
  standardConfiguration(): FrameworkConfiguration {
    return this.defaultBindingLanguage().defaultResources().history().router().eventAggregator();
  }

  /**
   * Plugs in the ConsoleAppender and sets the log level to debug.
   * @return {FrameworkConfiguration} Returns the current FrameworkConfiguration instance.
  */
  developmentLogging(): FrameworkConfiguration {
    this.preTask(() => {
      return System.normalize('aurelia-logging-console', this.bootstrapperName).then(name => {
        return this.aurelia.loader.loadModule(name).then(m => {
          TheLogManager.addAppender(new m.ConsoleAppender());
          TheLogManager.setLevel(TheLogManager.logLevel.debug);
        });
      });
    });

    return this;
  }

  /**
   * Loads and configures the plugins registered with this instance.
   * @return Returns a promise which resolves when all plugins are loaded and configured.
  */
  apply(): Promise<void> {
    if (this.processed) {
      return Promise.resolve();
    }

    return runTasks(this, this.preTasks).then(() => {
      let loader = this.aurelia.loader;
      let info = this.info;
      let current;

      let next = () => {
        if (current = info.shift()) {
          return loadPlugin(this, loader, current).then(next);
        }

        this.processed = true;
        return Promise.resolve();
      };

      return next().then(() => runTasks(this, this.postTasks));
    });
  }
}

/*eslint no-unused-vars:0*/
if (!window.CustomEvent || typeof window.CustomEvent !== 'function') {
  let CustomEvent = function(event, params) {
    params = params || {
      bubbles: false,
      cancelable: false,
      detail: undefined
    };

    let evt = document.createEvent('CustomEvent');
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
    this.loader = loader || new window.AureliaLoader();
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

      if (!this.container.hasHandler(BindingLanguage)) {
        let message = 'You must configure Aurelia with a BindingLanguage implementation.';
        this.logger.error(message);
        throw new Error(message);
      }

      if (!this.container.hasHandler(Animator)) {
        Animator.configureDefault(this.container);
      }

      this.logger.info('Aurelia Started');
      let evt = new window.CustomEvent('aurelia-started', { bubbles: true, cancelable: true });
      document.dispatchEvent(evt);
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

  _onAureliaComposed() {
    let evt = new window.CustomEvent('aurelia-composed', { bubbles: true, cancelable: true });
    setTimeout(() => document.dispatchEvent(evt), 1);
  }
}

export * from 'aurelia-dependency-injection';
export * from 'aurelia-binding';
export * from 'aurelia-metadata';
export * from 'aurelia-templating';
export * from 'aurelia-loader';
export * from 'aurelia-task-queue';
export * from 'aurelia-path';

export const LogManager = TheLogManager;
