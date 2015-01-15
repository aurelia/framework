import * as LogManager from 'aurelia-logging';

var logger = LogManager.getLogger('aurelia');

function loadPlugin(aurelia, loader, info){
  logger.debug(`Loading plugin ${info.moduleId}.`);

  return loader.loadModule(info.moduleId, '').then(exportedValue => {
    if('install' in exportedValue){
      var result = exportedValue.install(aurelia, info.config || {});

      if(result){
        return result.then(() =>{
          logger.debug(`Installed plugin ${info.moduleId}.`);
        });
      }else{
        logger.debug(`Installed plugin ${info.moduleId}.`);
      }
    }else{
      logger.debug(`Loaded plugin ${info.moduleId}.`);
    }
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
  }

  /**
   * Installs a plugin before Aurelia starts.
   *
   * @method install
   * @param {moduleId} moduleId The ID of the module to install.
   * @param {config} config The configuration for the specified module.
   * @return {Plugins} Returns the current Plugins instance.
 */
  install(moduleId, config){
    this.info.push({moduleId:moduleId, config:config});
    return this;
  }

  process(){
    var aurelia = this.aurelia,
        loader = aurelia.loader,
        info = this.info,
        current;

    var next = function(){
      if(current = info.shift()){
        return loadPlugin(aurelia, loader, current).then(next);
      }

      return Promise.resolve();
    }

    return next();
  }
}