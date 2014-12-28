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

export class Plugins {
  constructor(aurelia){
    this.aurelia = aurelia;
    this.info = [];
  }

  install(moduleId, config){
    this.info.push({moduleId:moduleId, config:config});
    return this;
  }

  process(){
    var toLoad = [], 
        aurelia = this.aurelia,
        loader = aurelia.loader,
        info = this.info,
        i, ii, current, result;

    for(i = 0, ii = info.length; i < ii; ++i){
      toLoad.push(loadPlugin(aurelia, loader, info[i]));
    }

    return Promise.all(toLoad);
  }
}