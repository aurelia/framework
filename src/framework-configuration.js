import * as core from 'core-js';
import * as TheLogManager from 'aurelia-logging';
import {Metadata} from 'aurelia-metadata';
import {ViewEngine} from 'aurelia-templating';
import {join} from 'aurelia-path';

var logger = TheLogManager.getLogger('aurelia');

function runTasks(config, tasks){
  let current, next = () => {
    if(current = tasks.shift()){
      return Promise.resolve(current(config)).then(next);
    }

    return Promise.resolve();
  };

  return next();
}

function loadPlugin(config, loader, info){
  logger.debug(`Loading plugin ${info.moduleId}.`);
  config.resourcesRelativeTo = info.resourcesRelativeTo;

  return loader.loadModule(info.moduleId).then(m => {
    if('configure' in m){
      return Promise.resolve(m.configure(config, info.config || {})).then(() => {
        config.resourcesRelativeTo = null;
        logger.debug(`Configured plugin ${info.moduleId}.`);
      });
    }else{
      config.resourcesRelativeTo = null;
      logger.debug(`Loaded plugin ${info.moduleId}.`);
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

function assertProcessed(plugins){
  if(plugins.processed) {
    throw new Error('This config instance has already been applied. To load more plugins or global resources, create a new FrameworkConfiguration instance.')
  }
}

/**
 * Manages configuring the aurelia framework instance.
 *
 * @class FrameworkConfiguration
 * @constructor
 * @param {Aurelia} aurelia An instance of Aurelia.
 */
export class FrameworkConfiguration {
  constructor(aurelia:Aurelia){
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
   *
   * @method instance
   * @param {Class} type The object type of the dependency that the framework will inject.
   * @param {Object} instance The existing instance of the dependency that the framework will inject.
   * @return {FrameworkConfiguration} Returns the current FrameworkConfiguration instance.
   */
  instance(type:any, instance:any):FrameworkConfiguration{
    this.container.registerInstance(type, instance);
    return this;
  }

  /**
   * Adds a singleton to the framework's dependency injection container.
   *
   * @method singleton
   * @param {Class} type The object type of the dependency that the framework will inject.
   * @param {Object} implementation The constructor function of the dependency that the framework will inject.
   * @return {FrameworkConfiguration} Returns the current FrameworkConfiguration instance.
   */
  singleton(type:any, implementation?:Function):FrameworkConfiguration{
    this.container.registerSingleton(type, implementation);
    return this;
  }

  /**
   * Adds a transient to the framework's dependency injection container.
   *
   * @method transient
   * @param {Class} type The object type of the dependency that the framework will inject.
   * @param {Object} implementation The constructor function of the dependency that the framework will inject.
   * @return {FrameworkConfiguration} Returns the current FrameworkConfiguration instance.
   */
  transient(type:any, implementation?:Function):FrameworkConfiguration{
    this.container.registerTransient(type, implementation);
    return this;
  }

  /**
   * Adds an async function that runs before the plugins are run.
   *
   * @method addPreStartTask
   * @param {Function} task The function to run before start.
   * @return {FrameworkConfiguration} Returns the current FrameworkConfiguration instance.
   */
  preTask(task:Function):FrameworkConfiguration{
    assertProcessed(this);
    this.preTasks.push(task);
    return this;
  }

  /**
   * Adds an async function that runs after the plugins are run.
   *
   * @method addPostStartTask
   * @param {Function} task The function to run after start.
   * @return {FrameworkConfiguration} Returns the current FrameworkConfiguration instance.
   */
  postTask(task:Function):FrameworkConfiguration{
    assertProcessed(this);
    this.postTasks.push(task);
    return this;
  }

  /**
   * Configures an internal feature plugin before Aurelia starts.
   *
   * @method feature
   * @param {string} plugin The folder for the internal plugin to configure (expects an index.js in that folder).
   * @param {config} config The configuration for the specified plugin.
   * @return {FrameworkConfiguration} Returns the current FrameworkConfiguration instance.
  */
  feature(plugin:string, config:any):FrameworkConfiguration{
    plugin = plugin.endsWith('.js') || plugin.endsWith('.ts') ? plugin.substring(0, plugin.length - 3) : plugin;
    return this.plugin({ moduleId: plugin + '/index', resourcesRelativeTo: plugin, config: config || {} });
  }

  /**
   * Adds globally available view resources to be imported into the Aurelia framework.
   *
   * @method globalResources
   * @param {Object|Array} resources The relative module id to the resource. (Relative to the plugin's installer.)
   * @return {FrameworkConfiguration} Returns the current FrameworkConfiguration instance.
   */
   globalResources(resources:string|string[]):FrameworkConfiguration{
    assertProcessed(this);

    let toAdd = Array.isArray(resources) ? resources : arguments,
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
   * @method globalName
   * @param {String} resourcePath The path to the resource.
   * @param {String} newName The new name.
   * @return {FrameworkConfiguration} Returns the current FrameworkConfiguration instance.
   */
  globalName(resourcePath:string, newName:string):FrameworkConfiguration{
    assertProcessed(this);
    this.resourcesToLoad[resourcePath] = newName;
    return this;
  }

  /**
   * Configures an external, 3rd party plugin before Aurelia starts.
   *
   * @method plugin
   * @param {string} plugin The ID of the 3rd party plugin to configure.
   * @param {config} config The configuration for the specified plugin.
   * @return {FrameworkConfiguration} Returns the current FrameworkConfiguration instance.
 */
  plugin(plugin:string, config:any):FrameworkConfiguration{
    assertProcessed(this);

    if(typeof(plugin) === 'string'){
      plugin = plugin.endsWith('.js') || plugin.endsWith('.ts') ? plugin.substring(0, plugin.length - 3) : plugin;
      return this.plugin({ moduleId: plugin, resourcesRelativeTo: plugin, config: config || {} });
    }

    this.info.push(plugin);
    return this;
  }

  _addNormalizedPlugin(name, config){
    var plugin = { moduleId: name, resourcesRelativeTo: name, config: config || {} };

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
   *
   * @method defaultBindingLanguage
   * @return {FrameworkConfiguration} Returns the current FrameworkConfiguration instance.
  */
  defaultBindingLanguage():FrameworkConfiguration{
    return this._addNormalizedPlugin('aurelia-templating-binding');
  };

  /**
   * Plugs in the router from aurelia-templating-router.
   *
   * @method router
   * @return {FrameworkConfiguration} Returns the current FrameworkConfiguration instance.
  */
  router():FrameworkConfiguration{
    return this._addNormalizedPlugin('aurelia-templating-router');
  }

  /**
   * Plugs in the default history implementation from aurelia-history-browser.
   *
   * @method history
   * @return {FrameworkConfiguration} Returns the current FrameworkConfiguration instance.
  */
  history():FrameworkConfiguration{
    return this._addNormalizedPlugin('aurelia-history-browser');
  }

  /**
   * Plugs in the default templating resources (if, repeat, show, compose, etc.) from aurelia-templating-resources.
   *
   * @method defaultResources
   * @return {FrameworkConfiguration} Returns the current FrameworkConfiguration instance.
  */
  defaultResources():FrameworkConfiguration{
    return this._addNormalizedPlugin('aurelia-templating-resources');
  }

  /**
   * Plugs in the event aggregator from aurelia-event-aggregator.
   *
   * @method eventAggregator
   * @return {FrameworkConfiguration} Returns the current FrameworkConfiguration instance.
  */
  eventAggregator():FrameworkConfiguration{
    return this._addNormalizedPlugin('aurelia-event-aggregator');
  }

  /**
   * Sets up the Aurelia configuration. This is equivalent to calling `.defaultBindingLanguage().defaultResources().history().router().eventAggregator();`
   *
   * @method standardConfiguration
   * @return {FrameworkConfiguration} Returns the current FrameworkConfiguration instance.
  */
  standardConfiguration():FrameworkConfiguration{
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
   * @return {FrameworkConfiguration} Returns the current FrameworkConfiguration instance.
  */
  developmentLogging():FrameworkConfiguration{
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
   *
   * @method apply
   * @return Returns a promise which resolves when all plugins are loaded and configured.
  */
  apply():Promise<void>{
    if(this.processed){
      return Promise.resolve();
    }

    return runTasks(this, this.preTasks).then(() => {
      let loader = this.aurelia.loader,
          info = this.info,
          current;

      let next = () => {
        if(current = info.shift()){
          return loadPlugin(this, loader, current).then(next);
        }

        this.processed = true;
        return Promise.resolve();
      };

      return next().then(() => runTasks(this, this.postTasks));
    });
  }
}
