import { Container } from 'aurelia-dependency-injection';
import { Loader } from 'aurelia-loader';
import { DOM, PLATFORM } from 'aurelia-pal';
import { BindingLanguage, ViewResources, ViewSlot, inlineView } from 'aurelia-templating';
import { Aurelia } from '../src/aurelia';
import { FrameworkConfiguration } from '../src/framework-configuration';
import './setup';

type AureliaAppHost = HTMLElement & { aurelia?: Aurelia };

declare global {
  namespace Reflect {
    export let getOwnMetadata: (metadataKey, target, targetKey) => any;
    export let defineMetadata: (metadataKey, metadataValue, target, targetKey) => void;
    export let metadata: (metadataKey, metadataValue) => any;
  }
}

describe('aurelia', () => {
  const document = window.document as Document & { body: AureliaAppHost };

  describe('constructor', () => {
    it('should have good defaults', () => {
      const mockLoader = {} as Loader;
      PLATFORM.Loader = function() {
        return mockLoader;
      };
      const aurelia = new Aurelia();

      expect(aurelia.loader).toBe(mockLoader);
      expect(aurelia.container).toEqual(jasmine.any(Container));
      expect(aurelia.resources).toEqual(jasmine.any(ViewResources));
      expect(aurelia.use).toEqual(jasmine.any(FrameworkConfiguration));
      expect(aurelia['started']).toBeFalsy();
    });

    it('will take in a loader, container and resource registry', () => {
      const mockLoader = jasmine.createSpy('loader') as Loader & jasmine.Spy;
      const mockResources = jasmine.createSpy('viewResources') as ViewResources & jasmine.Spy;
      const mockContainer = jasmine.createSpyObj('container', ['registerInstance', 'makeGlobal']);

      const aurelia = new Aurelia(mockLoader, mockContainer, mockResources);
      expect(aurelia.loader).toBe(mockLoader);
      expect(aurelia.container).toBe(mockContainer);
      expect(aurelia.resources).toBe(mockResources);
      expect(aurelia.use).toEqual(jasmine.any(FrameworkConfiguration));
      expect(aurelia['started']).toBeFalsy();

      //Lets check the container was called
      expect(mockContainer.registerInstance).toHaveBeenCalledWith(Aurelia, aurelia);
      expect(mockContainer.registerInstance).toHaveBeenCalledWith(Loader, mockLoader);
      expect(mockContainer.registerInstance).toHaveBeenCalledWith(ViewResources, mockResources);
    });
  });

  describe('start()', () => {
    // eslint-disable-next-line one-var
    let aurelia: Aurelia, mockContainer, mockLoader, mockResources, mockPlugin, mockViewEngine;

    beforeEach(() => {
      mockLoader = jasmine.createSpy('loader');
      mockResources = jasmine.createSpy('viewResources');

      mockViewEngine = jasmine.createSpyObj('viewEngine', ['importViewResources']);
      mockViewEngine.importViewResources.and.returnValue(new Promise<void>((resolve) => {
        resolve();
      }));

      mockContainer = jasmine.createSpyObj('container', ['registerInstance', 'hasResolver', 'get', 'makeGlobal']);
      mockContainer.hasResolver.and.returnValue(true);
      mockContainer.get.and.returnValue(mockViewEngine);

      mockPlugin = jasmine.createSpyObj('plugin', ['apply']);
      mockPlugin.apply.and.returnValue(new Promise<void>((resolve) => {
        resolve();
      }));

      aurelia = new Aurelia(mockLoader, mockContainer, mockResources);
      aurelia.use = mockPlugin;
    });

    it("will return if it's already started", () => {
      aurelia._started = Promise.resolve(aurelia);
      return aurelia.start()
        .catch((reason) => expect(true).toBeFalsy(reason));
    });

    it('will fail if the plugin loader fails', (done) => {
      mockPlugin.apply.and.returnValue(new Promise((resolve, error) => {
        error();
      }));

      aurelia.start()
        .then(() => expect(true).toBeFalsy('Startup should have failed'))
        .catch(() => expect(mockPlugin.apply).toHaveBeenCalled())
        .then(done);
    });

    //I'm going to assume start should fail in this case.
    it('should check for a binding language and log an error if one is not set', (done) => {
      mockContainer.hasResolver.and.returnValue(false);
      aurelia.start()
        .then(() => expect(true).toBeFalsy('Should have not started up'))
        .catch(() => expect(mockContainer.hasResolver).toHaveBeenCalledWith(BindingLanguage))
        .then(done);
    });

    it('should fire a custom event when started', (done) => {
      const documentSpy = spyOn(document, 'dispatchEvent').and.callThrough();
      aurelia.start()
        .then((result) => {
          expect(result).toBe(aurelia);
          expect(documentSpy).toHaveBeenCalled();
          const event = documentSpy.calls.mostRecent().args[0];
          expect(event).toEqual(jasmine.any(window.Event));
          expect(event.type).toEqual('aurelia-started');
        })
        .catch(() => expect(true).toBeFalsy("Starting shouldn't have failed"))
        .then(done);
    });
  });

  describe('setRoot()', () => {
    // eslint-disable-next-line one-var
    let aurelia, mockContainer, mockLoader, mockCompositionEngine, rootModel, composePromise, composeListener;

    beforeEach(() => {
      mockLoader = jasmine.createSpy('loader');
      mockContainer = jasmine.createSpyObj('container', ['get', 'registerInstance', 'makeGlobal']);
      mockCompositionEngine = jasmine.createSpyObj('compositionEngine', ['compose']);

      rootModel = {};
      composePromise = new Promise((resolve) => {
        resolve(rootModel);
      });

      mockContainer.get.and.returnValue(mockCompositionEngine);
      mockCompositionEngine.compose.and.returnValue(composePromise);

      aurelia = new Aurelia(mockLoader, mockContainer);
    });

    afterEach(() => {
      delete document.body.aurelia;
      if (composeListener) {
        document.removeEventListener('aurelia-composed', composeListener);
      }
    });

    it('should try and find the element with an id of applicationHost if one is not supplied', (done) => {
      const documentSpy = spyOn(document, 'getElementById').and.returnValue(document.body);
      aurelia.setRoot(rootModel)
        .then((result) => {
          expect(result).toBe(aurelia);
          expect(aurelia.host).toBe(document.body);
          expect(document.body.aurelia).toBe(aurelia);
          expect(documentSpy).toHaveBeenCalledWith('applicationHost');
        })
        .catch((reason) => expect(false).toBeTruthy(reason))
        .then(done);
    });

    it("should use the applicationHost if it's not a string as the host", (done) => {
      //This wouldn't have succeeded because registerInstance checks the type
      //But the function doesn't guard against applicationHost so this test is valid
      const host = { firstChild: {} } as AureliaAppHost;
      aurelia.setRoot(rootModel, host)
        .then((result) => {
          expect(result).toBe(aurelia);
          expect(aurelia.host).toBe(host);
          expect(host.aurelia).toBe(aurelia);
        })
        .catch((reason) => expect(false).toBeTruthy(reason))
        .then(done);
    });

    it('should call the compose function of the composition instance with a well formed instruction', (done) => {
      let attachedSpy;
      spyOn(document, 'getElementById').and.returnValue(document.body);
      mockCompositionEngine.compose.and.callFake((instruction) => {
        attachedSpy = spyOn(instruction.viewSlot, 'attached');
        return composePromise;
      });

      aurelia.setRoot(rootModel)
        .then((result) => {
          expect(result).toBe(aurelia);
          expect(mockCompositionEngine.compose).toHaveBeenCalled();

          const instruction = mockCompositionEngine.compose.calls.mostRecent().args[0];

          expect(instruction.viewModel).toBe(rootModel);
          expect(instruction.container).toBe(mockContainer);
          expect(instruction.childContainer).toBe(mockContainer);
          expect(instruction.viewSlot).toEqual(jasmine.any(ViewSlot));
          expect(attachedSpy).toHaveBeenCalledTimes(1);
        })
        .catch((reason) => expect(false).toBeTruthy(reason))
        .then(done);
    });

    it("should fire a custom aurelia-composed event when it's done", (done) => {
      spyOn(document, 'getElementById').and.returnValue(document.body);
      composeListener = (event) => {
        expect(event).toEqual(jasmine.any(window.Event));
        expect(event.type).toEqual('aurelia-composed');
        done();
      };

      //Can't do the same trick with aurelia-start because it waits till after the promise is resolved to fire the event
      document.addEventListener('aurelia-composed', composeListener);
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
        const metadataContainer = target.hasOwnProperty(metadataContainerKey) ? target[metadataContainerKey] : (target[metadataContainerKey] = {});
        const targetContainer = metadataContainer[targetKey] || (metadataContainer[targetKey] = {});
        targetContainer[metadataKey] = metadataValue;
      };

      Reflect.metadata = function(metadataKey, metadataValue) {
        return function(target, targetKey) {
          Reflect.defineMetadata(metadataKey, metadataValue, target, targetKey);
        };
      };

      const documentSpy = spyOn(document, 'getElementById').and.returnValue(document.body);

      @inlineView('<template>Hello</template>')
      class App {}

      aurelia = new Aurelia({} as Loader);
      aurelia.use.instance(BindingLanguage, {
        inspectTextContent() {
          return null;
        }
      });

      aurelia.setRoot(App)
        .then(aurelia => {
          expect(documentSpy).toHaveBeenCalledWith('applicationHost');
          expect(aurelia.root.viewModel.constructor).toBe(App);
        })
        .catch((ex) => {
          expect(ex).toBeFalsy('It should have composed');
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
    let aurelia, mockContainer, mockLoader, mockResources, mockPlugin, mockViewEngine;
    const rootStub = {
      attached() {}
    };

    beforeEach(() => {
      mockLoader = jasmine.createSpy('loader');

      mockViewEngine = jasmine.createSpyObj('viewEngine', ['importViewResources', 'enhance']);
      mockViewEngine.importViewResources.and.returnValue(new Promise<void>((resolve) => {
        resolve();
      }));

      mockViewEngine.enhance.and.returnValue(rootStub);

      mockContainer = jasmine.createSpyObj('container', ['registerInstance', 'hasResolver', 'get', 'makeGlobal']);
      mockContainer.hasResolver.and.returnValue(true);
      mockContainer.get.and.returnValue(mockViewEngine);

      mockResources = jasmine.createSpy('viewResources');

      mockPlugin = jasmine.createSpyObj('plugin', ['apply']);
      mockPlugin.apply.and.returnValue(new Promise<void>((resolve) => {
        resolve();
      }));

      aurelia = new Aurelia(mockLoader, mockContainer, mockResources);
      aurelia.use = mockPlugin;
    });

    describe('when passing in no arguments', () => {
      it('configures body as host', () => {
        spyOn(document, 'querySelectorAll').and.returnValue([document.body] as unknown as NodeListOf<HTMLElement>);
        spyOn(aurelia, '_configureHost');
        aurelia.enhance();
        expect(aurelia._configureHost).toHaveBeenCalledWith(document.body);
      });
    });

    describe('when passing in bindingContext and string for Id', () => {
      it('configures body as host', () => {
        const elId = 'Testing';
        const fakeElement = DOM.createElement('div');
        fakeElement.setAttribute('id', elId);
        spyOn(document, 'getElementById').and.returnValue(fakeElement);
        aurelia.enhance({}, elId);
        expect(aurelia.host).toBe(fakeElement);
      });
    });

    describe('when passing in bindingContext and an element', () => {
      it('configures body as host', () => {
        const fakeElement = DOM.createElement('div');
        aurelia.enhance({}, fakeElement);
        expect(aurelia.host).toBe(fakeElement);
      });
    });
  });
});
