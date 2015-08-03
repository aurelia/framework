import core from 'core-js';
import * as TheLogManager from 'aurelia-logging';
import {Metadata} from 'aurelia-metadata';

var logger = TheLogManager.getLogger('aurelia');

function loadPlugin(aurelia, loader, info){
  logger.debug(`Loading plugin ${info.moduleId}.`);
  aurelia.currentPluginId = (info.moduleId.endsWith('.js') || info.moduleId.endsWith('.ts')) ? info.moduleId.substring(0, info.moduleId.length - 3) : info.moduleId;

  return loader.loadModule(info.moduleId).then(m => {
    if('configure' in m){
      return Promise.resolve(m.configure(aurelia, info.config || {})).then(() => {
        aurelia.currentPluginId = null;
        logger.debug(`Configured plugin ${info.moduleId}.`);
      });
    }else{
      aurelia.currentPluginId = null;
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
   * Configures a plugin before Aurelia starts.
   *
   * @method plugin
   * @param {moduleId} moduleId The ID of the module to configure.
   * @param {config} config The configuration for the specified module.
   * @return {Plugins} Returns the current Plugins instance.
 */
  plugin(moduleId:string, config:any):Plugins{
    var plugin = {moduleId:moduleId, config:config || {}};

    if(this.processed){
      loadPlugin(this.aurelia, this.aurelia.loader, plugin);
    }else{
      this.info.push(plugin);
    }

    return this;
  }

  /**
   * Plugs in the default binding language from aurelia-templating-binding.
   *
   * @method defaultBindingLanguage
   * @return {Plugins} Returns the current Plugins instance.
  */
  defaultBindingLanguage():Plugins{
    this.aurelia.addPreStartTask(() => {
      return System.normalize('aurelia-templating-binding', this.bootstrapperName).then(name => {
        this.aurelia.use.plugin(name);
      });
    });

    return this;
  };

  /**
   * Plugs in the router from aurelia-templating-router.
   *
   * @method router
   * @return {Plugins} Returns the current Plugins instance.
  */
  router():Plugins{
    this.aurelia.addPreStartTask(() => {
      return System.normalize('aurelia-templating-router', this.bootstrapperName).then(name => {
        this.aurelia.use.plugin(name);
      });
    });

    return this;
  }

  /**
   * Plugs in the default history implementation from aurelia-history-browser.
   *
   * @method history
   * @return {Plugins} Returns the current Plugins instance.
  */
  history():Plugins{
    this.aurelia.addPreStartTask(() => {
      return System.normalize('aurelia-history-browser', this.bootstrapperName).then(name => {
        this.aurelia.use.plugin(name);
      });
    });

    return this;
  }

  /**
   * Plugs in the default templating resources (if, repeat, show, compose, etc.) from aurelia-templating-resources.
   *
   * @method defaultResources
   * @return {Plugins} Returns the current Plugins instance.
  */
  defaultResources():Plugins{
    this.aurelia.addPreStartTask(() => {
      return System.normalize('aurelia-templating-resources', this.bootstrapperName).then(name => {
        System.map['aurelia-templating-resources'] = name;
        this.aurelia.use.plugin(name);
      });
    });

    return this;
  }

  /**
   * Plugs in the event aggregator from aurelia-event-aggregator.
   *
   * @method eventAggregator
   * @return {Plugins} Returns the current Plugins instance.
  */
  eventAggregator():Plugins{
    this.aurelia.addPreStartTask(() => {
      return System.normalize('aurelia-event-aggregator', this.bootstrapperName).then(name => {
        System.map['aurelia-event-aggregator'] = name;
        this.aurelia.use.plugin(name);
      });
    });

    return this;
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
