import './setup';
import {FrameworkConfiguration} from '../src/framework-configuration';
import {Aurelia} from '../src/aurelia';
import { HtmlBehaviorResource } from 'aurelia-templating';

describe('the framework config', () => {
  it('should initialize', () => {
    let aureliaMock = jasmine.createSpyObj('aureliaMock', ['loader']);
    let config = new FrameworkConfiguration(aureliaMock);

    expect(config).toBeDefined();
    expect(config.aurelia).toBe(aureliaMock);
    expect(config.info).toEqual(jasmine.any(Array));
    expect(config.info.length).toEqual(0);
    expect(config.processed).toBeFalsy();
  });

  describe('with', () => {
    let aurelia, mockContainer, testInstance;

    class TestClass {
    }

    beforeEach(() => {
      mockContainer = jasmine.createSpyObj('container', ['registerInstance', 'registerSingleton', 'makeGlobal']);
      aurelia = new Aurelia({}, mockContainer);
      testInstance = new TestClass();
    });

    it('instance will register a instance with the container', () => {
      expect(aurelia.use.instance(TestClass, testInstance)).toBe(aurelia.use);
      expect(mockContainer.registerInstance).toHaveBeenCalledWith(TestClass, testInstance);
    });

    it('singleton will register a singleton with the container', () => {
      expect(aurelia.use.singleton(TestClass, testInstance)).toBe(aurelia.use);
      expect(mockContainer.registerSingleton).toHaveBeenCalledWith(TestClass, testInstance);
    });

    it("globalResources will add an array of paths", () => {
      let resourceName = './someResource';
      expect(aurelia.use.globalResources([resourceName])).toBe(aurelia.use);
      expect(aurelia.use.resourcesToLoad[resourceName].moduleId).toEqual(resourceName);
    });

    it("globalResources will add resources to lookup", () => {
      expect(aurelia.use.globalResources('./someResource', './andAnother')).toBe(aurelia.use);
      expect('./someResource' in aurelia.use.resourcesToLoad).toEqual(true);
      expect('./andAnother' in aurelia.use.resourcesToLoad).toEqual(true);
    });

    it('globalResources will make relative to resourcesRelativeTo if set on config', () => {
      aurelia.use.resourcesRelativeTo = ['plugin', 'bootstrapper'];

      let resourceName = './someResource';

      expect(aurelia.use.globalResources([resourceName])).toBe(aurelia.use);

      expect('plugin/someResource' in aurelia.use.resourcesToLoad).toEqual(true);
      expect(aurelia.use.resourcesToLoad['plugin/someResource'].relativeTo).toEqual('bootstrapper');

    });

  });

  describe('plugin()', () => {
    let configSpy;
    let loadModule;
    /**@type {FrameworkConfiguration} */
    let config;
    /**@type {Aurelia} */
    let aurelia, mockContainer, mockLoader, mockResources, mockPlugin, mockViewEngine;

    beforeEach(() => {
      mockLoader = jasmine.createSpy('loader');
      mockResources = jasmine.createSpy('viewResources');

      mockViewEngine = jasmine.createSpyObj("viewEngine", ["importViewResources"]);
      mockViewEngine.importViewResources.and.returnValue(new Promise((resolve, error) => {
        resolve();
      }));

      mockContainer = jasmine.createSpyObj('container', ['registerInstance', 'hasResolver', 'get', 'makeGlobal']);
      mockContainer.hasResolver.and.returnValue(true);
      mockContainer.get.and.returnValue(mockViewEngine);

      aurelia = new Aurelia(mockLoader, mockContainer, mockResources);
      config = aurelia.use;

      configSpy = jasmine.createSpy("config");

      loadModule = jasmine.createSpy('loadModule').and.callFake((moduleId) => {
        return new Promise((resolve, reject) => {
          if (moduleId === "plugin")
            resolve(configSpy);
          else
            reject("Couldn't find plugin");
        });
      });

      aurelia.loader.normalize = jasmine.createSpy('normalize').and.callFake(input => Promise.resolve(input));
      aurelia.loader.loadModule = loadModule;
    });

    it("should default config to an empty object if not provided", () => {
      config.plugin('noPlugin');
      expect(config.info.length).toBe(1);

      var info = config.info[0];
      expect(info.moduleId).toBe('noPlugin');
      expect(info.config).toBeDefined();
    });

    it('should lazily add config if config has not been processed', (done) => {
      var pluginConfig = {};
      config.plugin('noPlugin', pluginConfig);
      expect(config.info.length).toBe(1);

      var info = config.info[0];
      expect(info.moduleId).toBe('noPlugin');
      expect(info.config).toBe(pluginConfig);

      setTimeout(() => {
        expect(loadModule).not.toHaveBeenCalled();
        done();
      })
    });

    it("should load a plugin when processed", (done) => {
      config.plugin("plugin").apply()
        .then(() => expect(loadModule).toHaveBeenCalledWith("plugin"))
        .catch((reason) => expect(false).toBeTruthy(reason))
        .then(done);
    });

    it("should load a plugin and call its configure function if it's defined", (done) => {
      var pluginConfig = {};
      configSpy.configure = jasmine.createSpy("configure").and.returnValue(null);

      config.plugin("plugin", pluginConfig).apply()
        .then(() => {
          expect(loadModule).toHaveBeenCalledWith("plugin");
          expect(configSpy.configure).toHaveBeenCalledWith(config, pluginConfig);
        })
        .catch((reason) => expect(false).toBeTruthy(reason))
        .then(done);
    });

    it("should load a plugin, call it's configure function and resolve the returned promise if defined", (done) => {
      var pluginConfig = {};
      var resolved = false;
      configSpy.configure = jasmine.createSpy("configure").and.returnValue(new Promise((resolve) => {
        resolved = true;
        resolve();
      }));

      config.plugin("plugin", pluginConfig).apply()
        .then(() => {
          expect(loadModule).toHaveBeenCalledWith("plugin");
          expect(configSpy.configure).toHaveBeenCalledWith(config, pluginConfig);
          expect(resolved).toBeTruthy();
        })
        .catch((reason) => expect(false).toBeTruthy(reason))
        .then(done);
    });

    it("should reject if the plugin fails to load", (done) => {
      config.plugin("failedLoad").apply()
        .then(() => expect(true).toBeFalsy("This should have failed"))
        .catch(() => expect(loadModule).toHaveBeenCalledWith("failedLoad"))
        .then(done);
    });

    it("should throw if the plugin loader has been processed", (done) => {
      config.apply().then(() => {
        expect(config.processed).toBeTruthy();
        expect(() => config.plugin("plugin")).toThrow(new Error('This config instance has already been applied. To load more plugins or global resources, create a new FrameworkConfiguration instance.'));
        done();
      });
    });

    it('should normalize configure function for plugin', () => {
      function configure() {}
      config.plugin(configure);
      expect(config.info.length).toBe(1);

      var info = config.info[0];
      expect(info.moduleId).toBe(undefined, 'info.moduleId should have been undefined when using configure fn');
      expect(info.configure).toBe(configure);
      expect(info.config).toBeDefined('info.config should have been an empty object when not specified');
    });

    it('should normalize configure function for feature', () => {
      function configure() {}
      config.feature(configure);
      expect(config.info.length).toBe(1);

      var info = config.info[0];
      expect(info.moduleId).toBe(undefined, 'info.moduleId should have been undefined when using configure fn');
      expect(info.configure).toBe(configure);
      expect(info.config).toBeDefined('info.config should have been an empty object when not specified');
    });

    it('should queue loading behavior task when calling globalResources on custom element', () => {
      aurelia.resources.autoRegister = function() {
        const meta = new HtmlBehaviorResource();
        meta.elementName = 'el';
        return meta;
      };
      config.globalResources(class El {});
      expect(config.behaviorsToLoad.length).toBe(1);
    });
  });

  describe('apply()', () => {
    let aurelia, mockContainer, mockLoader, mockResources, mockPlugin, mockViewEngine;

    beforeEach(() => {
      mockLoader = jasmine.createSpy('loader');
      mockResources = jasmine.createSpy('viewResources');

      mockViewEngine = jasmine.createSpyObj("viewEngine", ["importViewResources"]);
      mockViewEngine.importViewResources.and.returnValue(new Promise((resolve, error) => {
        resolve();
      }));

      mockContainer = jasmine.createSpyObj('container', ['registerInstance', 'hasResolver', 'get', 'makeGlobal']);
      mockContainer.hasResolver.and.returnValue(true);
      mockContainer.get.and.returnValue(mockViewEngine);

      mockLoader.normalize = jasmine.createSpy('normalize').and.callFake(input => Promise.resolve(input));
      aurelia = new Aurelia(mockLoader, mockContainer, mockResources);
    });

    it("should load resources that are defined and register them with the resource registry", (done) => {
      aurelia.use.resourcesToLoad["./aResource"] = {moduleId: './aResource', relativeTo: ''};

      let resource = jasmine.createSpyObj("resource", ["register"]);

      mockViewEngine.importViewResources.and.returnValue(new Promise((resolve, error) => {
        resolve([resource]);
      }));

      aurelia.start().then(() => {
        expect(mockViewEngine.importViewResources).toHaveBeenCalledWith(["./aResource"], [undefined], mockResources);
      })
      .catch((reason) => expect(true).toBeFalsy(reason))
      .then(done);
    });

    it('should not call loadResources when there\'s none', (done) => {
      const mockLoadResources = jasmine.createSpy();
      const mockLoadResourcesTask = jasmine.createSpy(undefined, function() {
        if (Object.keys(config.resourcesToLoad).length) {
          return mockLoadResources();
        }
      });
      const config = aurelia.use;

      aurelia.resources.autoRegister = function() {};
      config.postTasks.splice(0, 1, mockLoadResourcesTask);
      config.plugin(function(cfg) {
        cfg.globalResources(class El {});
      });
      config.apply()
        .then(
          () => expect(mockLoadResources).not.toHaveBeenCalled(),
          () => expect(true).toBeFalsy('FrameworkConfiguration should have been applied')
        )
        .then(done);
    });

    it('should queue and load html behavior when calling globalResources with custom element classes', done => {
      const mockLoadResources = jasmine.createSpy();
      const mockLoadResourcesTask = jasmine.createSpy(undefined, function() {
        if (Object.keys(config.resourcesToLoad).length) {
          return mockLoadResources();
        }
      });

      const config = aurelia.use;

      let behaviorQueued = false;
      let behaviorLoaded = false;
      
      aurelia.resources.autoRegister = function() {
        const meta = new HtmlBehaviorResource();
        meta.elementName = 'el';
        meta.load = function() {
          behaviorLoaded = true;
        };
        return meta;
      };

      config.behaviorsToLoad.push = function() {
        behaviorQueued = true;
        return [].push.apply(this, arguments);
      };
      config.postTasks.splice(0, 1, mockLoadResourcesTask);
      config.plugin(function(cfg) {
        cfg.globalResources(class El {});
      });

      config
        .apply()
        .then(
          () => {
            expect(behaviorQueued).toBe(true, 'It should haved queued html behavior to load');
            expect(behaviorLoaded).toBe(true, 'It should have loaded behavior');
          },
          () => expect(true).toBeFalsy('FrameworkConfiguration should have been applied')
        )
        .then(done);
    });

    it('should not call the same plugin configure twice', (done) => {
      let count = 0;
      function configurePluginA() {
        count++;
      }
      function configurePluginB(config) {
        config.plugin(configurePluginA);
      }
      
      aurelia.use
        .plugin(configurePluginB)
        .plugin(configurePluginA)
        .apply()
        .then(
          () => {
            expect(count).toBe(1, 'It should haved called configurePluginA once');
            expect(aurelia.use.configuredPlugins).toBe(null, 'It should haved cleaned configured plugins cache');
          },
          () => expect(true).toBeFalsy('FrameworkConfiguration should have been applied')
        )
        .then(done);
    });

    it('should not call the same plugin configure twice when using both module id and fns', done => {
      let count = 0;
      function module1Configure(config) {
        config
          .plugin('c.js')
          .plugin('b.js');
      }
      function module2Configure(config) {
        config
          .plugin('c.js')
      }
      function module3Configure(config) {
        count++;
      }
      const modules = {
        'a.js': {
          configure: module1Configure
        },
        'b.js': {
          configure: module2Configure,
        },
        'c.js': {
          configure: module3Configure
        }
      };
      mockLoader.loadModule = function(moduleId) {
        return Promise.resolve(modules[moduleId]);
      };
      aurelia.use
        .plugin('a.js')
        .plugin('b.js')
        .plugin(module3Configure)
        .apply()
        .then(() => {
          expect(count).toBe(1);
        })
        .catch(() => expect(true).toBeFalsy('This should have configured'))
        .then(done);
    });
  });
});
