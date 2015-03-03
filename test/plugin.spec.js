import {Plugins} from '../src/plugins';
import {Metadata} from 'aurelia-metadata';

describe('the plugin loader', () => {
  let plugins,
    aureliaMock;

  beforeEach(() => {
    aureliaMock = jasmine.createSpyObj('aureliaMock', ['loader']);
    plugins = new Plugins(aureliaMock);
  });

  it('should initialize', () => {
    expect(plugins).toBeDefined();
    expect(plugins.aurelia).toBe(aureliaMock);
    expect(plugins.info).toEqual(jasmine.any(Array));
    expect(plugins.info.length).toEqual(0);
    expect(plugins.processed).toBeFalsy();
  });

  describe('plugin()', () => {
    let pluginSpy,
      loadModule;

    beforeEach(() => {
      pluginSpy = jasmine.createSpy("plugin");

      loadModule = jasmine.createSpy('loadModule').and.callFake((moduleId) => {
        return new Promise((resolve, reject) => {
          if (moduleId === "plugin")
            resolve(pluginSpy);
          else
            reject("Couldn't find plugin");
        });
      });

      aureliaMock.loader.loadModule = loadModule;
    });

    it("should default config to an empty object if not provided", () => {
      plugins.plugin('noPlugin');
      expect(plugins.info.length).toBe(1);

      var info = plugins.info[0];
      expect(info.moduleId).toBe('noPlugin');
      expect(info.config).toBeDefined();
    });

    it('should lazily add plugins if plugins has not been processed', (done) => {
      var config = {};
      plugins.plugin('noPlugin', config);
      expect(plugins.info.length).toBe(1);

      var info = plugins.info[0];
      expect(info.moduleId).toBe('noPlugin');
      expect(info.config).toBe(config);

      setTimeout(() => {
        expect(aureliaMock.loader.loadModule).not.toHaveBeenCalled();
        done();
      })
    });

    it("should load a plugin when processed", (done) => {
      plugins.plugin("plugin")._process()
        .then(() => expect(loadModule).toHaveBeenCalledWith("plugin"))
        .catch((reason) => expect(false).toBeTruthy(reason))
        .then(done);
    });

    it("should load a plugin and call it's install function if it's defined", (done) => {
      var config = {};
      pluginSpy.install = jasmine.createSpy("install").and.returnValue(null);

      plugins.plugin("plugin", config)._process()
        .then(() => {
          expect(loadModule).toHaveBeenCalledWith("plugin");
          expect(pluginSpy.install).toHaveBeenCalledWith(aureliaMock, config);
        })
        .catch((reason) => expect(false).toBeTruthy(reason))
        .then(done);
    });

    it("should load a plugin, call it's install function and resolve the returned promise if defined", (done) => {
      var config = {};
      var resolved = false;
      pluginSpy.install = jasmine.createSpy("install").and.returnValue(new Promise((resolve) => {
        resolved = true;
        resolve();
      }));

      plugins.plugin("plugin", config)._process()
        .then(() => {
          expect(loadModule).toHaveBeenCalledWith("plugin");
          expect(pluginSpy.install).toHaveBeenCalledWith(aureliaMock, config);
          expect(resolved).toBeTruthy();
        })
        .catch((reason) => expect(false).toBeTruthy(reason))
        .then(done);
    });

    it("should reject if the plugin fails to load", (done) => {
      plugins.plugin("failedLoad")._process()
        .then(() => expect(true).toBeFalsy("This should have failed"))
        .catch(() => expect(loadModule).toHaveBeenCalledWith("failedLoad"))
        .then(done);
    });

    it("should eagerly process if the plugin loader has been processed", (done) => {
      plugins._process();
      expect(plugins.processed).toBeTruthy();
      plugins.plugin("plugin");
      expect(aureliaMock.currentPluginId).toBe("plugin");
      //There is no promise to hook onto here so the best option is to do an instant timeout
      setTimeout(() => {
        expect(aureliaMock.loader.loadModule).toHaveBeenCalledWith("plugin");
        expect(aureliaMock.currentPluginId).toBeNull();
        done();
      });
    });


  });

  describe("es5()", () => {
    afterEach(() => Function.prototype.computed = undefined);

    it("adds the computed function on the Function prototype", () => {
      expect(Function.prototype.computed).toBeUndefined();
      plugins.es5();
      expect(Function.prototype.computed).toEqual(jasmine.any(Function));
    });

    it("Function.prototype.computed adds read only object keys to a function", () => {
      plugins.es5();
      function TestFn() {}

      var metaData = {intProp: () => 1, boolProp: () => false};
      TestFn.computed(metaData);
      var testFn = new TestFn();

      expect(testFn.intProp).toBe(1);
      expect(testFn.boolProp).toBeFalsy();
    });
  });

  describe("atscript()", () => {
    let containerMock;

    beforeEach(() => {
      containerMock = jasmine.createSpyObj('container',['supportAtScript']);
      aureliaMock.container = containerMock;
      spyOn(Metadata.configure,'locator').and.callThrough();
    });

    it("should add support for atScript", () => {
      plugins.atscript();
      expect(containerMock.supportAtScript).toHaveBeenCalled();
      expect(Metadata.configure.locator).toHaveBeenCalled();
      //Let's also ensure that the locator is working correctly seeing that it's defined in plugins
      var locator = Metadata.configure.locator.calls.mostRecent().args[0];
      expect(locator({annotate : 'annotation'})).toBe("annotation");
      expect(locator({annotations : 'annotations'})).toBe("annotations");
    });
  });
});
