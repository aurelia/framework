import * as TheLogManager from 'aurelia-logging';
import { camelCase, ValueConverterResource, BindingBehaviorResource } from 'aurelia-binding';
import {ViewEngine, ViewResources, HtmlBehaviorResource, _hyphenate} from 'aurelia-templating';
import {join} from 'aurelia-path';
import {Container} from 'aurelia-dependency-injection';
import { metadata } from 'aurelia-metadata';


/**
 * @typedef ConfigInfo
 * @prop {string} moduleId
 * @prop {string[]} resourcesRelativeTo
 * @prop {any} config
 */

 /**
  * @typedef GlobalResources
  * @prop {Function[]} valueConverters
  * @prop {Function[]} bindingBehaviors
  * @prop {Function[]} customElements
  * @prop {Function[]} customAttributes
  */

const logger = TheLogManager.getLogger('aurelia');
const extPattern = /\.[^/.]+$/;

function runTasks(config, tasks) {
  let current;
  let next = () => {
    current = tasks.shift();
    if (current) {
      return Promise.resolve(current(config)).then(next);
    }

    return Promise.resolve();
  };

  return next();
}

function loadPlugin(config: FrameworkConfiguration, loader, info: ConfigInfo) {
  logger.debug(`Loading plugin ${info.moduleId}.`);
  config.resourcesRelativeTo = info.resourcesRelativeTo;

  let id = info.moduleId; // General plugins installed/configured by the end user.

  if (info.resourcesRelativeTo.length > 1 ) { // In case of bootstrapper installed plugins like `aurelia-templating-resources` or `aurelia-history-browser`.
    return loader.normalize(info.moduleId, info.resourcesRelativeTo[1])
      .then(normalizedId => _loadPlugin(normalizedId));
  }

  return _loadPlugin(id);

  function _loadPlugin(moduleId) {
    return loader.loadModule(moduleId).then(m => { // eslint-disable-line consistent-return
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
}

function loadResources(aurelia, resourcesToLoad, appResources: ViewResources) {
  let viewEngine = aurelia.container.get(ViewEngine);

  return Promise.all(Object.keys(resourcesToLoad).map(n => _normalize(resourcesToLoad[n])))
    .then(loads => {
      let names = [];
      let importIds = [];

      loads.forEach(l => {
        names.push(undefined);
        importIds.push(l.importId);
      });

      return viewEngine.importViewResources(importIds, names, appResources);
    });

  function _normalize(load) {
    let moduleId = load.moduleId;
    let ext = getExt(moduleId);

    if (isOtherResource(moduleId)) {
      moduleId = removeExt(moduleId);
    }

    return aurelia.loader.normalize(moduleId, load.relativeTo)
      .then(normalized => {
        return {
          name: load.moduleId,
          importId: isOtherResource(load.moduleId) ? addOriginalExt(normalized, ext) : normalized
        };
      });
  }

  function isOtherResource(name) {
    let ext = getExt(name);
    if (!ext) return false;
    if (ext === '') return false;
    if (ext === '.js' || ext === '.ts') return false;
    return true;
  }

  function removeExt(name) {
    return name.replace(extPattern, '');
  }

  function addOriginalExt(normalized, ext) {
    return removeExt(normalized) + '.' + ext;
  }
}

function loadBehaviors(container: Container, behaviors: HtmlBehaviorResource[]) {
  let current;
  let next = () => {
    current = behaviors.shift();
    if (current) {
      return current.load(container, current.target).then(next);
    }

    return Promise.resolve();
  };

  return next();
}

function getExt(name) { // eslint-disable-line consistent-return
  let match = name.match(extPattern);
  if (match && match.length > 0) {
    return (match[0].split('.'))[1];
  }
}

function assertProcessed(plugins: FrameworkConfiguration) {
  if (plugins.processed) {
    throw new Error('This config instance has already been applied. To load more plugins or global resources, create a new FrameworkConfiguration instance.');
  }
}

/**
 * Manages configuring the aurelia framework instance.
 */
export class FrameworkConfiguration {
  /**
   * The root DI container used by the application.
   */
  container: Container;

  /**
   * The aurelia instance.
   */
  aurelia: Aurelia;

  /**
   * Creates an instance of FrameworkConfiguration.
   * @param aurelia An instance of Aurelia.
   */
  constructor(aurelia: Aurelia) {
    this.aurelia = aurelia;
    this.container = aurelia.container;
    /**@type {ConfigInfo[]} */
    this.info = [];
    /**@type {HtmlBehaviorResource[]} */
    this.globalBehaviors = [];
    this.processed = false;
    this.preTasks = [];
    this.postTasks = [];
    this.resourcesToLoad = {};
    this.preTask(() => aurelia.loader.normalize('aurelia-bootstrapper').then(name => this.bootstrapperName = name));
    this.postTask(() => loadResources(aurelia, this.resourcesToLoad, aurelia.resources)
      .then(() => loadBehaviors(this.container, this.globalBehaviors))
    );
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
  feature(plugin: string, config?: any = {}): FrameworkConfiguration {
    let hasIndex = /\/index$/i.test(plugin);
    let moduleId = hasIndex || getExt(plugin) ? plugin : plugin + '/index';
    let root = hasIndex ? plugin.substr(0, plugin.length - 6) : plugin;
    return this.plugin({ moduleId, resourcesRelativeTo: [root, ''], config });
  }

  /**
   * Adds globally available view resources to be imported into the Aurelia framework.
   * @param {GlobalResources | string | | Function | (string | Function)[]} resources The relative module id to the resource. (Relative to the plugin's installer.)
   * @return Returns the current FrameworkConfiguration instance.
   */
  globalResources(resources): FrameworkConfiguration {
    assertProcessed(this);

    if (arguments.length === 1) {
      let firstArg = arguments[0];
      // When there is only one argument, and it's an object, and not an array
      // it's the shape on explicit global()
      if (firstArg && typeof firstArg === 'object' && !Array.isArray(firstArg)) {
        this.global(firstArg);
        return this;
      }
    }

    let toAdd = Array.isArray(resources) ? resources : arguments;
    let resource;
    let resourcesRelativeTo = this.resourcesRelativeTo || ['', ''];

    for (let i = 0, ii = toAdd.length; i < ii; ++i) {
      resource = toAdd[i];
      if (!resource) {
        throw new Error('Invalid resource declaration. Expected module name or a class');
      }
      if (typeof resource === 'string') {
        let parent = resourcesRelativeTo[0];
        let grandParent = resourcesRelativeTo[1];
        let name = resource;

        if ((resource.startsWith('./') || resource.startsWith('../')) && parent !== '') {
          name = join(parent, resource);
        }

        this.resourcesToLoad[name] = { moduleId: name, relativeTo: grandParent };
      } else {
        // here we don't lookup the hierarchy, each custom element should have their own metadata defined
        // otherwise we may end up using parent class metadata for sub classes
        let resourceTypeMeta = metadata.get(metadata.resource, resource);

        if (resourceTypeMeta) {
          // Sometimes the resources might have been declared lazily, without a
          // reliable name. Going through their corresponding resource resigration ensures it
          if (resourceTypeMeta instanceof HtmlBehaviorResource) {
            // When it's either custom element or custom attribute
            if (resourceTypeMeta.attributeName !== null) {
              this.customAttribute(resource);
            } else {
              this.customElement(resource);
            }
          } else if (resourceTypeMeta instanceof BindingBehaviorResource) {
            this.bindingBehavior(resource);
          } else if (resourceTypeMeta instanceof ValueConverterResource) {
            this.valueConverter(resource);
          } else {
            logger.warn(`Invalid resource registered for ${resource.name}`);
          }
        } else {
          // When there is no explicit resources defined
          let className = resource.name;
          if (resourceTypeMeta = HtmlBehaviorResource.convention(className)
            || BindingBehaviorResource.convention(className)
            || ValueConverterResource.convention(className)
          ) {
            resourceTypeMeta.initialize(this.container, resource);
            resourceTypeMeta.register(this.aurelia.resources);

            metadata.define(metadata.resource, resourceTypeMeta, resource);

            if (resourceTypeMeta.elementName !== null) {
              this.globalBehaviors.push(resourceTypeMeta);
            }
          } else {
            // When there is no explicit configuration and there is no convention
            // It's a custom element
            this.customElement(resource);
          }
        }
      }
    }
    return this;
  }

  global(resources: GlobalResources) {
    if (!resources || typeof resources !== 'object') {
      logger.warn('No global resources declared.');
      return;
    }
    const elements = resources.customElements;
    if (elements) {
      elements.forEach(this.customElement, this);
    }
    const attributes = resources.customAttributes;
    if (attributes) {
      attributes.forEach(this.customAttribute, this);
    }
    const bindingBehaviors = resources.bindingBehaviors;
    if (bindingBehaviors) {
      bindingBehaviors.forEach(this.bindingBehavior, this);
    }
    const valueConverters = resources.valueConverters;
    if (valueConverters) {
      valueConverters.forEach(this.valueConverter, this);
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
    this.resourcesToLoad[resourcePath] = { moduleId: newName, relativeTo: '' };
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

    if (typeof (plugin) === 'string') {
      return this.plugin({ moduleId: plugin, resourcesRelativeTo: [plugin, ''], config: config || {} });
    }

    this.info.push(plugin);
    return this;
  }

  _addNormalizedPlugin(name, config) {
    let plugin = { moduleId: name, resourcesRelativeTo: [name, ''], config: config || {} };
    this.plugin(plugin);

    this.preTask(() => {
      let relativeTo = [name, this.bootstrapperName];
      plugin.moduleId = name;
      plugin.resourcesRelativeTo = relativeTo;
      return Promise.resolve();
    });

    return this;
  }

  // Default configuration helpers
  // Note: Please do NOT add PLATFORM.moduleName() around those module names.
  //       Those functions are not guaranteed to be called, they are here to faciliate
  //       common configurations. If they are not called, we don't want to include a
  //       static dependency on those modules.
  //       Including those modules in the bundle or not is a decision that must be
  //       taken by the bundling tool, at build time.

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
   * Sets up a basic Aurelia configuration. This is equivalent to calling `.defaultBindingLanguage().defaultResources().eventAggregator();`
   * @return Returns the current FrameworkConfiguration instance.
  */
  basicConfiguration(): FrameworkConfiguration {
    return this.defaultBindingLanguage().defaultResources().eventAggregator();
  }

  /**
   * Sets up the standard Aurelia configuration. This is equivalent to calling `.defaultBindingLanguage().defaultResources().eventAggregator().history().router();`
   * @return Returns the current FrameworkConfiguration instance.
  */
  standardConfiguration(): FrameworkConfiguration {
    return this.basicConfiguration().history().router();
  }

  /**
   * Plugs in the ConsoleAppender and sets the log level to debug.
   * @param level The log level (none/error/warn/info/debug), default to 'debug'.
   * @return {FrameworkConfiguration} Returns the current FrameworkConfiguration instance.
  */
  developmentLogging(level?: String): FrameworkConfiguration {
    let logLevel = level ? TheLogManager.logLevel[level] : undefined
    if (logLevel === undefined) {
      logLevel = TheLogManager.logLevel.debug;
    }

    this.preTask(() => {
      return this.aurelia.loader.normalize('aurelia-logging-console', this.bootstrapperName).then(name => {
        return this.aurelia.loader.loadModule(name).then(m => {
          TheLogManager.addAppender(new m.ConsoleAppender());
          TheLogManager.setLevel(logLevel);
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
        current = info.shift();
        if (current) {
          return loadPlugin(this, loader, current).then(next);
        }

        this.processed = true;
        return Promise.resolve();
      };

      return next().then(() => runTasks(this, this.postTasks));
    });
  }

  customElement(impl: Function) {
    const aurelia = this.aurelia;
    let resource = metadata.getOwn(metadata.resource, impl);
    if (!resource) {
      resource = new HtmlBehaviorResource();
      metadata.define(metadata.resource, resource, impl);
    } else if (!(resource instanceof HtmlBehaviorResource)) {
      throw new Error(`Resource defined at ${impl.name} is not a custom element.`);
    }
    if (resource.elementName === null) {
      resource.elementName = _hyphenate(impl.name);
    }
    resource.initialize(aurelia.container, impl);
    resource.register(aurelia.resources);
    this.globalBehaviors.push(resource);
  }

  customAttribute(impl: Function) {
    const aurelia = this.aurelia;
    let resource = metadata.getOwn(metadata.resource, impl);
    if (!resource) {
      resource = new HtmlBehaviorResource();
      metadata.define(metadata.resource, resource, impl);
    } else if (!(resource instanceof HtmlBehaviorResource)) {
      throw new Error(`Resource defined at ${impl.name} is not a custom attribute.`);
    }
    if (resource.attributeName === null) {
      resource.attributeName = _hyphenate(impl.name);
    }
    resource.initialize(aurelia.container, impl);
    resource.register(aurelia.resources);
  }

  bindingBehavior(impl: Function) {
    const aurelia = this.aurelia;
    let resource = metadata.getOwn(metadata.resource, impl);
    if (!resource) {
      resource = new BindingBehaviorResource(camelCase(impl.name));
    } else if (!(resource instanceof BindingBehaviorResource)) {
      throw new Error(`Resource defined at ${impl.name} is not a binding behavior.`);
    }
    resource.initialize(aurelia.container, impl);
    resource.register(aurelia.resources);
  }

  valueConverter(impl: Function) {
    const aurelia = this.aurelia;
    let resource = metadata.getOwn(metadata.resource, impl);
    if (!resource) {
      resource = new ValueConverterResource(camelCase(impl.name));
      metadata.define(metadata.resource, resource, impl);
    } else if (!(resource instanceof ValueConverterResource)) {
      throw new Error(`Resource defined at ${impl.name} is not a value converter.`);
    }
    resource.initialize(aurelia.container, impl);
    resource.register(aurelia.resources);
  }
}
