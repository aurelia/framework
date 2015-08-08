import core from 'core-js';
import * as TheLogManager from 'aurelia-logging';
import {Metadata} from 'aurelia-metadata';

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
