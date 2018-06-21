import * as TheLogManager from 'aurelia-logging';
import { Container } from 'aurelia-dependency-injection';
import { Loader } from 'aurelia-loader';
import { BindingLanguage, ViewSlot, ViewResources, TemplatingEngine, CompositionTransaction, ViewEngine, HtmlBehaviorResource } from 'aurelia-templating';
import { DOM, PLATFORM } from 'aurelia-pal';
import { relativeToFile, join } from 'aurelia-path';

function preventActionlessFormSubmit() {
  DOM.addEventListener('submit', evt => {
    const target = evt.target;
    const action = target.action;

    if (target.tagName.toLowerCase() === 'form' && !action) {
      evt.preventDefault();
    }
  });
}

export let Aurelia = class Aurelia {
  constructor(loader, container, resources) {
    this.loader = loader || new PLATFORM.Loader();
    this.container = container || new Container().makeGlobal();
    this.resources = resources || new ViewResources();
    this.use = new FrameworkConfiguration(this);
    this.logger = TheLogManager.getLogger('aurelia');
    this.hostConfigured = false;
    this.host = null;

    this.use.instance(Aurelia, this);
    this.use.instance(Loader, this.loader);
    this.use.instance(ViewResources, this.resources);
  }

  start() {
    if (this._started) {
      return this._started;
    }

    this.logger.info('Aurelia Starting');
    return this._started = this.use.apply().then(() => {
      preventActionlessFormSubmit();

      if (!this.container.hasResolver(BindingLanguage)) {
        let message = 'You must configure Aurelia with a BindingLanguage implementation.';
        this.logger.error(message);
        throw new Error(message);
      }

      this.logger.info('Aurelia Started');
      let evt = DOM.createCustomEvent('aurelia-started', { bubbles: true, cancelable: true });
      DOM.dispatchEvent(evt);
      return this;
    });
  }

  enhance(bindingContext = {}, applicationHost = null) {
    this._configureHost(applicationHost || DOM.querySelectorAll('body')[0]);

    return new Promise(resolve => {
      let engine = this.container.get(TemplatingEngine);
      this.root = engine.enhance({ container: this.container, element: this.host, resources: this.resources, bindingContext: bindingContext });
      this.root.attached();
      this._onAureliaComposed();
      resolve(this);
    });
  }

  setRoot(root = null, applicationHost = null) {
    let instruction = {};

    if (this.root && this.root.viewModel && this.root.viewModel.router) {
      this.root.viewModel.router.deactivate();
      this.root.viewModel.router.reset();
    }

    this._configureHost(applicationHost);

    let engine = this.container.get(TemplatingEngine);
    let transaction = this.container.get(CompositionTransaction);
    delete transaction.initialComposition;

    if (!root) {
      if (this.configModuleId) {
        root = relativeToFile('./app', this.configModuleId);
      } else {
        root = 'app';
      }
    }

    instruction.viewModel = root;
    instruction.container = instruction.childContainer = this.container;
    instruction.viewSlot = this.hostSlot;
    instruction.host = this.host;

    return engine.compose(instruction).then(r => {
      this.root = r;
      instruction.viewSlot.attached();
      this._onAureliaComposed();
      return this;
    });
  }

  _configureHost(applicationHost) {
    if (this.hostConfigured) {
      return;
    }
    applicationHost = applicationHost || this.host;

    if (!applicationHost || typeof applicationHost === 'string') {
      this.host = DOM.getElementById(applicationHost || 'applicationHost');
    } else {
      this.host = applicationHost;
    }

    if (!this.host) {
      throw new Error('No applicationHost was specified.');
    }

    this.hostConfigured = true;
    this.host.aurelia = this;
    this.hostSlot = new ViewSlot(this.host, true);
    this.hostSlot.transformChildNodesIntoView();
    this.container.registerInstance(DOM.boundary, this.host);
  }

  _onAureliaComposed() {
    let evt = DOM.createCustomEvent('aurelia-composed', { bubbles: true, cancelable: true });
    setTimeout(() => DOM.dispatchEvent(evt), 1);
  }
};

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

function loadPlugin(fwConfig, loader, info) {
  logger.debug(`Loading plugin ${info.moduleId}.`);
  if (typeof info.moduleId === 'string') {
    fwConfig.resourcesRelativeTo = info.resourcesRelativeTo;

    let id = info.moduleId;

    if (info.resourcesRelativeTo.length > 1) {
      return loader.normalize(info.moduleId, info.resourcesRelativeTo[1]).then(normalizedId => _loadPlugin(normalizedId));
    }

    return _loadPlugin(id);
  } else if (typeof info.configure === 'function') {
    if (fwConfig.configuredPlugins.indexOf(info.configure) !== -1) {
      return Promise.resolve();
    }
    fwConfig.configuredPlugins.push(info.configure);

    return Promise.resolve(info.configure.call(null, fwConfig, info.config || {}));
  }
  throw new Error(invalidConfigMsg(info.moduleId || info.configure, 'plugin'));

  function _loadPlugin(moduleId) {
    return loader.loadModule(moduleId).then(m => {
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
  if (Object.keys(resourcesToLoad).length === 0) {
    return Promise.resolve();
  }
  let viewEngine = aurelia.container.get(ViewEngine);

  return Promise.all(Object.keys(resourcesToLoad).map(n => _normalize(resourcesToLoad[n]))).then(loads => {
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

    return aurelia.loader.normalize(moduleId, load.relativeTo).then(normalized => {
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

function getExt(name) {
  let match = name.match(extPattern);
  if (match && match.length > 0) {
    return match[0].split('.')[1];
  }
}

function loadBehaviors(config) {
  return Promise.all(config.behaviorsToLoad.map(m => m.load(config.container, m.target))).then(() => {
    config.behaviorsToLoad = null;
  });
}

function assertProcessed(plugins) {
  if (plugins.processed) {
    throw new Error('This config instance has already been applied. To load more plugins or global resources, create a new FrameworkConfiguration instance.');
  }
}

function invalidConfigMsg(cfg, type) {
  return `Invalid ${type} [${cfg}], ${type} must be specified as functions or relative module IDs.`;
}

export let FrameworkConfiguration = class FrameworkConfiguration {
  constructor(aurelia) {
    this.aurelia = aurelia;
    this.container = aurelia.container;

    this.info = [];
    this.processed = false;
    this.preTasks = [];
    this.postTasks = [];

    this.behaviorsToLoad = [];

    this.configuredPlugins = [];
    this.resourcesToLoad = {};
    this.preTask(() => aurelia.loader.normalize('aurelia-bootstrapper').then(name => this.bootstrapperName = name));
    this.postTask(() => loadResources(aurelia, this.resourcesToLoad, aurelia.resources));
  }

  instance(type, instance) {
    this.container.registerInstance(type, instance);
    return this;
  }

  singleton(type, implementation) {
    this.container.registerSingleton(type, implementation);
    return this;
  }

  transient(type, implementation) {
    this.container.registerTransient(type, implementation);
    return this;
  }

  preTask(task) {
    assertProcessed(this);
    this.preTasks.push(task);
    return this;
  }

  postTask(task) {
    assertProcessed(this);
    this.postTasks.push(task);
    return this;
  }

  feature(plugin, config = {}) {
    switch (typeof plugin) {
      case 'string':
        let hasIndex = /\/index$/i.test(plugin);
        let moduleId = hasIndex || getExt(plugin) ? plugin : plugin + '/index';
        let root = hasIndex ? plugin.substr(0, plugin.length - 6) : plugin;
        this.info.push({ moduleId, resourcesRelativeTo: [root, ''], config });
        break;

      case 'function':
        this.info.push({ configure: plugin, config: config || {} });
        break;
      default:
        throw new Error(invalidConfigMsg(plugin, 'feature'));
    }
    return this;
  }

  globalResources(resources) {
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

  globalName(resourcePath, newName) {
    assertProcessed(this);
    this.resourcesToLoad[resourcePath] = { moduleId: newName, relativeTo: '' };
    return this;
  }

  plugin(plugin, pluginConfig) {
    assertProcessed(this);

    let info;
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

  defaultBindingLanguage() {
    return this._addNormalizedPlugin('aurelia-templating-binding');
  }

  router() {
    return this._addNormalizedPlugin('aurelia-templating-router');
  }

  history() {
    return this._addNormalizedPlugin('aurelia-history-browser');
  }

  defaultResources() {
    return this._addNormalizedPlugin('aurelia-templating-resources');
  }

  eventAggregator() {
    return this._addNormalizedPlugin('aurelia-event-aggregator');
  }

  basicConfiguration() {
    return this.defaultBindingLanguage().defaultResources().eventAggregator();
  }

  standardConfiguration() {
    return this.basicConfiguration().history().router();
  }

  developmentLogging(level) {
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

  apply() {
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
};

export * from 'aurelia-dependency-injection';
export * from 'aurelia-binding';
export * from 'aurelia-metadata';
export * from 'aurelia-templating';
export * from 'aurelia-loader';
export * from 'aurelia-task-queue';
export * from 'aurelia-path';
export * from 'aurelia-pal';

export const LogManager = TheLogManager;