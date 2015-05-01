import core from 'core-js';
import * as LogManager from 'aurelia-logging';
import {Metadata} from 'aurelia-metadata';

var logger = LogManager.getLogger('aurelia');

function loadPlugin(aurelia, loader, info){
  logger.debug(`Loading plugin ${info.moduleId}.`);
  aurelia.currentPluginId = info.moduleId;

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
  constructor(aurelia){
    this.aurelia = aurelia;
    this.info = [];
    this.processed = false;
  }

  /**
   * Configures a plugin before Aurelia starts.
   *
   * @method plugin
   * @param {moduleId} moduleId The ID of the module to configure.
   * @param {config} config The configuration for the specified module.
   * @return {Plugins} Returns the current Plugins instance.
 */
  plugin(moduleId, config){
    var plugin = {moduleId:moduleId, config:config || {}};

    if(this.processed){
      loadPlugin(this.aurelia, this.aurelia.loader, plugin);
    }else{
      this.info.push(plugin);
    }

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
