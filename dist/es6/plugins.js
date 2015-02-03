import * as LogManager from 'aurelia-logging';
import {Metadata} from 'aurelia-metadata';

var logger = LogManager.getLogger('aurelia');

function loadPlugin(aurelia, loader, info){
  logger.debug(`Loading plugin ${info.moduleId}.`);

  aurelia.currentPluginId = info.moduleId;

  var baseUrl = info.moduleId.startsWith('./') ? undefined : "";

  return loader.loadModule(info.moduleId, baseUrl).then(exportedValue => {
    if('install' in exportedValue){
      var result = exportedValue.install(aurelia, info.config || {});

      if(result){
        return result.then(() =>{
          aurelia.currentPluginId = null;
          logger.debug(`Installed plugin ${info.moduleId}.`);
        });
      }else{
        logger.debug(`Installed plugin ${info.moduleId}.`);
      }
    }else{
      logger.debug(`Loaded plugin ${info.moduleId}.`);
    }

    aurelia.currentPluginId = null;
  });
}

/**
 * Manages loading and installing plugins.
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
   * Installs a plugin before Aurelia starts.
   *
   * @method plugin
   * @param {moduleId} moduleId The ID of the module to install.
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

  /**
   * Installs special support for ES5 authoring.
   *
   * @method es5
   * @return {Plugins} Returns the current Plugins instance.
 */
  es5(){
    Function.prototype.computed = function(computedProperties){
      for(var key in computedProperties){
        if(computedProperties.hasOwnProperty(key)){
          Object.defineProperty(this.prototype, key, { get: computedProperties[key], enumerable: true }); 
        }
      }
    }

    return this;
  }

  /**
   * Installs special support for AtScript authoring.
   *
   * @method atscript
   * @return {Plugins} Returns the current Plugins instance.
 */
  atscript(){
    this.aurelia.container.supportAtScript();
    Metadata.configure.locator(fn => fn['annotate'] || fn['annotations']);
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
