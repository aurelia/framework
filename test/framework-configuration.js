import './setup';
import {FrameworkConfiguration} from '../src/framework-configuration';
import {Aurelia} from '../src/aurelia';
import {Metadata} from 'aurelia-metadata';

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
    let configSpy,
        loadModule,
        config;

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
  });
});
