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

    it("should load a plugin and call it's configure function if it's defined", (done) => {
      var config = {};
      pluginSpy.configure = jasmine.createSpy("configure").and.returnValue(null);

      plugins.plugin("plugin", config)._process()
        .then(() => {
          expect(loadModule).toHaveBeenCalledWith("plugin");
          expect(pluginSpy.configure).toHaveBeenCalledWith(aureliaMock, config);
        })
        .catch((reason) => expect(false).toBeTruthy(reason))
        .then(done);
    });

    it("should load a plugin, call it's configure function and resolve the returned promise if defined", (done) => {
      var config = {};
      var resolved = false;
      pluginSpy.configure = jasmine.createSpy("configure").and.returnValue(new Promise((resolve) => {
        resolved = true;
        resolve();
      }));

      plugins.plugin("plugin", config)._process()
        .then(() => {
          expect(loadModule).toHaveBeenCalledWith("plugin");
          expect(pluginSpy.configure).toHaveBeenCalledWith(aureliaMock, config);
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
});
