import { Container } from 'aurelia-dependency-injection';
import { Loader } from 'aurelia-loader';
import { DOM, PLATFORM } from 'aurelia-pal';
import { BindingLanguage, ViewResources, ViewSlot, inlineView } from 'aurelia-templating';
import { Aurelia } from '../src/aurelia';
import { FrameworkConfiguration } from '../src/framework-configuration';
import './setup';

describe('aurelia', () => {
  describe("constructor", () => {

    it("should have good defaults", () => {
      let mockLoader = {};
      PLATFORM.Loader = function(){
        return mockLoader;
      }
      let aurelia = new Aurelia();

      expect(aurelia.loader).toBe(mockLoader);
      expect(aurelia.container).toEqual(jasmine.any(Container));
      expect(aurelia.resources).toEqual(jasmine.any(ViewResources));
      expect(aurelia.use).toEqual(jasmine.any(FrameworkConfiguration));
      expect(aurelia.started).toBeFalsy();
    });

    it("will take in a loader, container and resource registry", () => {
      let mockLoader = jasmine.createSpy('loader');
      let mockResources = jasmine.createSpy('viewResources');
      let mockContainer = jasmine.createSpyObj('container', ['registerInstance', 'makeGlobal']);

      let aurelia = new Aurelia(mockLoader, mockContainer, mockResources);
      expect(aurelia.loader).toBe(mockLoader);
      expect(aurelia.container).toBe(mockContainer);
      expect(aurelia.resources).toBe(mockResources);
      expect(aurelia.use).toEqual(jasmine.any(FrameworkConfiguration));
      expect(aurelia.started).toBeFalsy();

      //Lets check the container was called
      expect(mockContainer.registerInstance).toHaveBeenCalledWith(Aurelia, aurelia);
      expect(mockContainer.registerInstance).toHaveBeenCalledWith(Loader, mockLoader);
      expect(mockContainer.registerInstance).toHaveBeenCalledWith(ViewResources, mockResources);
    });

  });

  describe('start()', () => {
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

      mockPlugin = jasmine.createSpyObj('plugin', ['apply']);
      mockPlugin.apply.and.returnValue(new Promise((resolve, error) => {
        resolve();
      }));

      aurelia = new Aurelia(mockLoader, mockContainer, mockResources);
      aurelia.use = mockPlugin;
    });

    it("will return if it's already started", (done) => {
      aurelia.started = true;
      aurelia.start()
        .catch((reason) => expect(true).toBeFalsy(reason))
        .then(done);
    });

    it("will fail if the plugin loader fails", (done) => {
      mockPlugin.apply.and.returnValue(new Promise((resolve, error) => {
        error();
      }));

      aurelia.start()
        .then(() => expect(true).toBeFalsy("Startup should have failed"))
        .catch(() => expect(mockPlugin.apply).toHaveBeenCalled())
        .then(done);
    });

    //I'm going to assume start should fail in this case.
    it("should check for a binding language and log an error if one is not set", (done) => {
      mockContainer.hasResolver.and.returnValue(false);
      aurelia.start()
        .then(() => expect(true).toBeFalsy("Should have not started up"))
        .catch(() => expect(mockContainer.hasResolver).toHaveBeenCalledWith(BindingLanguage))
        .then(done);
    });

    it("should fire a custom event when started", (done) => {
      var documentSpy = spyOn(document, "dispatchEvent").and.callThrough();
      aurelia.start()
        .then((result) => {
          expect(result).toBe(aurelia);
          expect(documentSpy).toHaveBeenCalled();
          var event = documentSpy.calls.mostRecent().args[0];
          expect(event).toEqual(jasmine.any(window.Event));
          expect(event.type).toEqual("aurelia-started");
        })
        .catch(() => expect(true).toBeFalsy("Starting shouldn't have failed"))
        .then(done);
    });
  });

  describe('setRoot()', () => {
    let aurelia, mockContainer, mockLoader, mockCompositionEngine, rootModel, composePromise, composeListener;

    beforeEach(() => {
      mockLoader = jasmine.createSpy("loader");
      mockContainer = jasmine.createSpyObj("container", ["get", "registerInstance", 'makeGlobal']);
      mockCompositionEngine = jasmine.createSpyObj("compositionEngine", ["compose"]);

      rootModel = {};
      composePromise = new Promise((resolve, error) => {
        resolve(rootModel)
      });

      mockContainer.get.and.returnValue(mockCompositionEngine);
      mockCompositionEngine.compose.and.returnValue(composePromise);

      aurelia = new Aurelia(mockLoader, mockContainer);
    });

    afterEach(() => {
      delete document.body.aurelia;
      if (composeListener) {
        document.removeEventListener("aurelia-composed", composeListener);
      }
    });

    it("should try and find the element with an id of applicationHost if one is not supplied", (done) => {
      let documentSpy = spyOn(document, "getElementById").and.returnValue(document.body);
      aurelia.setRoot(rootModel)
        .then((result) => {
          expect(result).toBe(aurelia);
          expect(aurelia.host).toBe(document.body);
          expect(document.body.aurelia).toBe(aurelia);
          expect(documentSpy).toHaveBeenCalledWith("applicationHost");
        })
        .catch((reason) => expect(false).toBeTruthy(reason))
        .then(done);
    });

    it("should use the applicationHost if it's not a string as the host", (done) => {
      //This wouldn't have succeeded because registerInstance checks the type
      //But the function doesn't guard against applicationHost so this test is valid
      let host = { firstChild:{} };
      aurelia.setRoot(rootModel, host)
        .then((result) => {
          expect(result).toBe(aurelia);
          expect(aurelia.host).toBe(host);
          expect(host.aurelia).toBe(aurelia);
        })
        .catch((reason) => expect(false).toBeTruthy(reason))
        .then(done);
    });

    it("should call the compose function of the composition instance with a well formed instruction", (done) => {
      let attachedSpy;
      let documentSpy = spyOn(document, "getElementById").and.returnValue(document.body);
      mockCompositionEngine.compose.and.callFake((instruction) => {
        attachedSpy = spyOn(instruction.viewSlot, 'attached');
        return composePromise;
      });

      aurelia.setRoot(rootModel)
        .then((result) => {
          expect(result).toBe(aurelia);
          expect(mockCompositionEngine.compose).toHaveBeenCalled();

          let instruction = mockCompositionEngine.compose.calls.mostRecent().args[0];

          expect(instruction.viewModel).toBe(rootModel);
          expect(instruction.container).toBe(mockContainer);
          expect(instruction.childContainer).toBe(mockContainer);
          expect(instruction.viewSlot).toEqual(jasmine.any(ViewSlot));
        })
        .catch((reason) => expect(false).toBeTruthy(reason))
        .then(done);
    });

    it("should fire a custom aurelia-composed event when it's done", (done) => {
      let documentSpy = spyOn(document, "getElementById").and.returnValue(document.body);
      composeListener = (event) => {
        expect(event).toEqual(jasmine.any(window.Event));
        expect(event.type).toEqual("aurelia-composed");
        done();
      };

      //Can't do the same trick with aurelia-start because it waits till after the promise is resolved to fire the event
      document.addEventListener("aurelia-composed", composeListener);
      aurelia.setRoot(rootModel)
        .catch((reason) => {
          expect(false).toBeTruthy(reason);
          done();
        });

    });

    it('should accept view model class as root', (done) => {

      const emptyMetadata = Object.freeze({});
      const metadataContainerKey = '__metadata__';
  
      Reflect.getOwnMetadata = function(metadataKey, target, targetKey) {
        if (target.hasOwnProperty(metadataContainerKey)) {
          return (target[metadataContainerKey][targetKey] || emptyMetadata)[metadataKey];
        }
      };
  
      Reflect.defineMetadata = function(metadataKey, metadataValue, target, targetKey) {
        let metadataContainer = target.hasOwnProperty(metadataContainerKey) ? target[metadataContainerKey] : (target[metadataContainerKey] = {});
        let targetContainer = metadataContainer[targetKey] || (metadataContainer[targetKey] = {});
        targetContainer[metadataKey] = metadataValue;
      };
  
      Reflect.metadata = function(metadataKey, metadataValue) {
        return function(target, targetKey) {
          Reflect.defineMetadata(metadataKey, metadataValue, target, targetKey);
        };
      };

      let documentSpy = spyOn(document, "getElementById").and.returnValue(document.body);

      @inlineView('<template>Hello</template>')
      class App {}

      aurelia = new Aurelia({});
      aurelia.use.instance(BindingLanguage, {
        inspectTextContent() {
          return null;
        }
      })

      aurelia.setRoot(App)
        .then(aurelia => {
          expect(documentSpy).toHaveBeenCalledWith("applicationHost");
          expect(aurelia.root.viewModel.constructor).toBe(App);
        })
        .catch((ex) => {
          expect(ex).toBeFalsy("It should have composed");
        })
        .then(() => {
          Reflect.getOwnMetadata = null;
          Reflect.defineMetadata = null;
          Reflect.metadata = null;
          done();
        });
    });
  });

  describe('enhance()', () => {
    let aurelia, mockContainer, mockLoader, mockResources, mockPlugin, mockViewEngine, mockTemplatingEngine;
    let rootStub = {
      attached() {}
    };

    beforeEach(() => {
      mockLoader = jasmine.createSpy('loader');

      mockViewEngine = jasmine.createSpyObj("viewEngine", ['importViewResources', 'enhance']);
      mockViewEngine.importViewResources.and.returnValue(new Promise((resolve, error) => {
        resolve();
      }));

      mockViewEngine.enhance.and.returnValue(rootStub);

      mockContainer = jasmine.createSpyObj('container', ['registerInstance', 'hasResolver', 'get', 'makeGlobal']);
      mockContainer.hasResolver.and.returnValue(true);
      mockContainer.get.and.returnValue(mockViewEngine);

      mockResources = jasmine.createSpy('viewResources');

      mockPlugin = jasmine.createSpyObj('plugin', ['apply']);
      mockPlugin.apply.and.returnValue(new Promise((resolve, error) => {
        resolve();
      }));

      aurelia = new Aurelia(mockLoader, mockContainer, mockResources);
      aurelia.use = mockPlugin;
    });

    describe('when passing in no arguments', () => {
      let result;

      it('configures body as host', () => {
        let documentSpy = spyOn(document, "querySelectorAll").and.returnValue([document.body]);
        spyOn(aurelia, '_configureHost');
        result = aurelia.enhance();
        expect(aurelia._configureHost).toHaveBeenCalledWith(document.body);
      });
    });

    describe('when passing in bindingContext and string for Id', () => {
      let result;

      it('configures body as host', () => {
        let elId = 'Testing';
        let fakeElement = DOM.createElement('div');
        fakeElement.setAttribute('id', elId);
        let documentSpy = spyOn(document, "getElementById").and.returnValue(fakeElement);
        result = aurelia.enhance({}, elId);
        expect(aurelia.host).toBe(fakeElement);
      });
    });

    describe('when passing in bindingContext and an element', () => {
      let result;

      it('configures body as host', () => {
        let elId = 'Testing';
        let fakeElement = DOM.createElement('div');
        fakeElement.setAttribute('id', fakeElement);
        result = aurelia.enhance({}, fakeElement);
        expect(aurelia.host).toBe(fakeElement);
      });
    });
  });



});
