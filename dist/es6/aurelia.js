import * as LogManager from 'aurelia-logging';
import {Container} from 'aurelia-dependency-injection';
import {Loader} from 'aurelia-loader';
import {
  BindingLanguage, 
  ResourceCoordinator, 
  ViewSlot, 
  ResourceRegistry,
  CompositionEngine
} from 'aurelia-templating';
import {Plugins} from './plugins';

var logger = LogManager.getLogger('aurelia');

export class Aurelia {
  constructor(loader, container, resources){
    this.loader = loader || Loader.createDefaultLoader();
    this.container = container || new Container();
    this.resources = resources || new ResourceRegistry();
    this.resourcesToLoad = [];
    this.plugins = new Plugins(this);

    this.withInstance(Aurelia, this);
    this.withInstance(Loader, this.loader);
    this.withInstance(ResourceRegistry, this.resources);
  }

  withInstance(type, instance){
    this.container.registerInstance(type, instance);
    return this;
  }

  withSingleton(type, implementation){
    this.container.registerSingleton(type, implementation);
    return this;
  }

  withResources(resources){
    if(Array.isArray(resources)){
      this.resourcesToLoad = this.resourcesToLoad.concat(resources);
    }else{
      this.resourcesToLoad = this.resourcesToLoad.concat(Array.prototype.slice.call(arguments));
    }

    return this;
  }

  start(){
    if(this.started){
      return;
    }

    this.started = true;
    logger.info('Aurelia Starting');

    return this.plugins.process().then(() => {
      if(!this.container.hasHandler(BindingLanguage)){
        logger.error('You must configure Aurelia with a BindingLanguage implementation.');
      }

      return this.container.get(ResourceCoordinator)
        .importResources(this.resourcesToLoad).then(resources => {
          resources.forEach(x => x.register(this.resources));
          logger.info('Aurelia Started');
          return this;
        });
    });
  }

  setRoot(root, applicationHost){
    var compositionEngine, instruction = {};

    if (!applicationHost || typeof applicationHost == 'string') {
      this.host = document.getElementById(applicationHost || 'applicationHost') || document.body;
    } else {
      this.host = applicationHost;
    }

    this.host.aurelia = this;
    this.container.registerInstance(Element, this.host);

    compositionEngine = this.container.get(CompositionEngine);
    instruction.viewModel = root;
    instruction.viewSlot = new ViewSlot(this.host, true);
    instruction.container = instruction.childContainer = this.container;

    return compositionEngine.compose(instruction).then(root => {
      this.root = root;
      instruction.viewSlot.attached();
      return this;
    });
  }
}