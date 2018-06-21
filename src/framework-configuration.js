import * as TheLogManager from 'aurelia-logging';
import {ViewEngine, HtmlBehaviorResource} from 'aurelia-templating';
import {join} from 'aurelia-path';
import {Container} from 'aurelia-dependency-injection';

const logger = TheLogManager.getLogger('aurelia');
const extPattern = /\.[^/.]+$/;

function runTasks(config: FrameworkConfiguration, tasks) {
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

interface FrameworkPluginInfo {
  moduleId?: string;
  resourcesRelativeTo?: string[];
  configure?: (config: FrameworkConfiguration, pluginConfig?: any) => any;
  config?: any;
}

function loadPlugin(fwConfig: FrameworkConfiguration, loader: Loader, info: FrameworkPluginInfo) {
  logger.debug(`Loading plugin ${info.moduleId}.`);
  if (typeof info.moduleId === 'string') {
    fwConfig.resourcesRelativeTo = info.resourcesRelativeTo;

    let id = info.moduleId; // General plugins installed/configured by the end user.

    if (info.resourcesRelativeTo.length > 1 ) { // In case of bootstrapper installed plugins like `aurelia-templating-resources` or `aurelia-history-browser`.
      return loader.normalize(info.moduleId, info.resourcesRelativeTo[1])
        .then(normalizedId => _loadPlugin(normalizedId));
    }

    return _loadPlugin(id);
  } else if (typeof info.configure === 'function') {
    if (fwConfig.configuredPlugins.indexOf(info.configure) !== -1) {
      return Promise.resolve();
    }
    fwConfig.configuredPlugins.push(info.configure);
    // use info.config || {} to keep behavior consistent with loading from string
    return Promise.resolve(info.configure.call(null, fwConfig, info.config || {}));
  }
  throw new Error(invalidConfigMsg(info.moduleId || info.configure, 'plugin'));

  function _loadPlugin(moduleId) {
    return loader.loadModule(moduleId).then(m => { // eslint-disable-line consistent-return
      if ('configure' in m) {
        if (fwConfig.configuredPlugins.indexOf(m.configure) !== -1) {
          return Promise.resolve();
        }
        return Promise.resolve(m.configure(fwConfig, info.config || {})).then(() => {
          fwConfig.configuredPlugins.push(m.configure);
          fwConfig.resourcesRelativeTo = null;
          logger.debug(`Configured plugin ${info.moduleId}.`);
        });
      }

      fwConfig.resourcesRelativeTo = null;
      logger.debug(`Loaded plugin ${info.moduleId}.`);
    });
  }
}

function loadResources(aurelia, resourcesToLoad, appResources) {
  // if devs want to go all in static, and remove loader
  // the code after this fucntion shouldn't run
  // add a check to make sure it only runs when there is something to do so
  if (Object.keys(resourcesToLoad).length === 0) {
    return Promise.resolve();
  }
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

function getExt(name: string) { // eslint-disable-line consistent-return
  let match = name.match(extPattern);
  if (match && match.length > 0) {
    return (match[0].split('.'))[1];
  }
}

function loadBehaviors(config: FrameworkConfiguration) {
  return Promise.all(config.behaviorsToLoad.map(m => m.load(config.container, m.target))).then(() => {
    config.behaviorsToLoad = null;
  });
}

function assertProcessed(plugins: FrameworkConfiguration) {
  if (plugins.processed) {
    throw new Error('This config instance has already been applied. To load more plugins or global resources, create a new FrameworkConfiguration instance.');
  }
}

function invalidConfigMsg(cfg: any, type: string) {
  return `Invalid ${type} [${cfg}], ${type} must be specified as functions or relative module IDs.`;
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
    /**
     * Plugin / feature loading instruction
     * @type {FrameworkPluginInfo[]}
     */
    this.info = [];
    this.processed = false;
    this.preTasks = [];
    this.postTasks = [];
    /**
     * Custom element's metadata queue for loading view factory
     * @type {HtmlBehaviorResource[]}
     */
    this.behaviorsToLoad = [];
    /**
     * Plugin configure functions temporary cache for avoid duplicate calls
     * @type {Function[]}
     */
    this.configuredPlugins = [];
    this.resourcesToLoad = {};
    this.preTask(() => aurelia.loader.normalize('aurelia-bootstrapper').then(name => this.bootstrapperName = name));
    this.postTask(() => loadResources(aurelia, this.resourcesToLoad, aurelia.resources));
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
  feature(plugin: string | ((config: FrameworkConfiguration, pluginConfig?: any) => any), config?: any = {}): FrameworkConfiguration {
    switch (typeof plugin) {
    case 'string':
      let hasIndex = /\/index$/i.test(plugin);
      let moduleId = hasIndex || getExt(plugin) ? plugin : plugin + '/index';
      let root = hasIndex ? plugin.substr(0, plugin.length - 6) : plugin;
      this.info.push({ moduleId, resourcesRelativeTo: [root, ''], config });
      break;
      // return this.plugin({ moduleId, resourcesRelativeTo: [root, ''], config });
    case 'function':
      this.info.push({ configure: plugin, config: config || {} });
      break;
    default:
      throw new Error(invalidConfigMsg(plugin, 'feature'));
    }
    return this;
    // return this.plugin(plugin, config);
  }

  /**
   * Adds globally available view resources to be imported into the Aurelia framework.
   * @param resources The relative module id to the resource. (Relative to the plugin's installer.)
   * @return Returns the current FrameworkConfiguration instance.
   */
  globalResources(resources: string | Function | Array<string | Function>): FrameworkConfiguration {
    assertProcessed(this);

    let toAdd = Array.isArray(resources) ? resources : arguments;
    let resource;
    let resourcesRelativeTo = this.resourcesRelativeTo || ['', ''];

    for (let i = 0, ii = toAdd.length; i < ii; ++i) {
      resource = toAdd[i];
      switch (typeof resource) {
      case 'string':
        let parent = resourcesRelativeTo[0];
        let grandParent = resourcesRelativeTo[1];
        let name = resource;

        if ((resource.startsWith('./') || resource.startsWith('../')) && parent !== '') {
          name = join(parent, resource);
        }

        this.resourcesToLoad[name] = { moduleId: name, relativeTo: grandParent };
        break;
      case 'function':
        let meta = this.aurelia.resources.autoRegister(this.container, resource);
        if (meta instanceof HtmlBehaviorResource && meta.elementName !== null) {
          if (this.behaviorsToLoad.push(meta) === 1) {
            this.postTask(() => loadBehaviors(this));
          }
        }
        break;
      default:
        throw new Error(invalidConfigMsg(resource, 'resource'));
      }
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
   * @param pluginConfig The configuration for the specified plugin.
   * @return Returns the current FrameworkConfiguration instance.
 */
  plugin(
    plugin: string | ((frameworkConfig: FrameworkConfiguration) => any) | FrameworkPluginInfo,
    pluginConfig?: any
  ): FrameworkConfiguration {
    assertProcessed(this);

    let info: FrameworkPluginInfo;
    switch (typeof plugin) {
    case 'string':
      info = { moduleId: plugin, resourcesRelativeTo: [plugin, ''], config: pluginConfig || {} };
      break;
    case 'function':
      info = { configure: plugin, config: pluginConfig || {} };
      break;
    default:
      throw new Error(invalidConfigMsg(plugin, 'plugin'));
    }
    this.info.push(info);
    return this;
  }

  _addNormalizedPlugin(name, config) {
    let plugin = { moduleId: name, resourcesRelativeTo: [name, ''], config: config || {} };
    this.info.push(plugin);

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
    let logLevel = level ? TheLogManager.logLevel[level] : undefined;

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
        this.configuredPlugins = null;
        return Promise.resolve();
      };

      return next().then(() => runTasks(this, this.postTasks));
    });
  }
}
