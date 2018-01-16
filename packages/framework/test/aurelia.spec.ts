import './setup';
import { Aurelia } from '../src/aurelia';
import { Container } from 'aurelia-dependency-injection';
import { Loader } from 'aurelia-loader';
import { BindingLanguage, ViewSlot, ViewResources } from 'aurelia-templating';
import { FrameworkConfiguration } from '../src/framework-configuration';
import { DOM, PLATFORM } from 'aurelia-pal';

describe('aurelia', () => {
  describe('constructor', () => {

    it('should have good defaults', () => {
      const mockLoader: any = {};
      PLATFORM.Loader = () => {
        return mockLoader;
      };
      const aurelia = new Aurelia();

      expect(aurelia.loader).toBe(mockLoader);
      expect(aurelia.container).toEqual(jasmine.any(Container));
      expect(aurelia.resources).toEqual(jasmine.any(ViewResources));
      expect(aurelia.use).toEqual(jasmine.any(FrameworkConfiguration));
      expect(aurelia.started).toBeFalsy();
    });

    it('will take in a loader, container and resource registry', () => {
      const mockLoader = jasmine.createSpy('loader');
      const mockResources = jasmine.createSpy('viewResources');
      const mockContainer = jasmine.createSpyObj('container', ['registerInstance', 'makeGlobal']);

      const aurelia = new Aurelia(mockLoader as any, mockContainer, mockResources as any);
      expect(aurelia.loader).toBe(mockLoader);
      expect(aurelia.container).toBe(mockContainer);
      expect(aurelia.resources).toBe(mockResources);
      expect(aurelia.use).toEqual(jasmine.any(FrameworkConfiguration));
      expect(aurelia.started).toBeFalsy();

      // Lets check the container was called
      expect(mockContainer.registerInstance).toHaveBeenCalledWith(Aurelia, aurelia);
      expect(mockContainer.registerInstance).toHaveBeenCalledWith(Loader, mockLoader);
      expect(mockContainer.registerInstance).toHaveBeenCalledWith(ViewResources, mockResources);
    });

  });

  describe('start()', () => {
    let aurelia;
    let mockContainer;
    let mockLoader;
    let mockResources;
    let mockPlugin;
    let mockViewEngine;

    beforeEach(() => {
      mockLoader = jasmine.createSpy('loader');
      mockResources = jasmine.createSpy('viewResources');

      mockViewEngine = jasmine.createSpyObj('viewEngine', ['importViewResources']);
      mockViewEngine.importViewResources.and.returnValue(new Promise((resolve) => {
        resolve();
      }));

      mockContainer = jasmine.createSpyObj('container', ['registerInstance', 'hasResolver', 'get', 'makeGlobal']);
      mockContainer.hasResolver.and.returnValue(true);
      mockContainer.get.and.returnValue(mockViewEngine);

      mockPlugin = jasmine.createSpyObj('plugin', ['apply']);
      mockPlugin.apply.and.returnValue(new Promise((resolve) => {
        resolve();
      }));

      aurelia = new Aurelia(mockLoader, mockContainer, mockResources);
      aurelia.use = mockPlugin;
    });

    it('will return if it\'s already started', (done) => {
      aurelia.started = true;
      aurelia.start()
        .catch((reason) => expect(true).toBeFalsy(reason))
        .then(done);
    });

    it('will fail if the plugin loader fails', (done) => {
      mockPlugin.apply.and.returnValue(new Promise((_resolve, error) => { //tslint:disable-line
        error();
      }));

      aurelia.start()
        .then(() => expect(true).toBeFalsy('Startup should have failed'))
        .catch(() => expect(mockPlugin.apply).toHaveBeenCalled())
        .then(done);
    });

    // I'm going to assume start should fail in this case.
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
          expect(event).toEqual(jasmine.any((window as any).Event)); // (window as any).Event
          expect(event.type).toEqual('aurelia-started');
        })
        .catch(() => expect(true).toBeFalsy('Starting shouldn\'t have failed'))
        .then(done);
    });
  });

  describe('setRoot()', () => {
    let aurelia;
    let mockContainer;
    let mockLoader;
    let mockCompositionEngine;
    let rootModel;
    let composePromise;
    let composeListener;

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
      delete (document.body as any).aurelia;
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
          expect((document.body as any).aurelia).toBe(aurelia);
          expect(documentSpy).toHaveBeenCalledWith('applicationHost');
        })
        .catch((reason) => expect(false).toBeTruthy(reason))
        .then(done);
    });

    it('should use the applicationHost if it\'s not a string as the host', (done) => {
      // This wouldn't have succeeded because registerInstance checks the type
      // But the function doesn't guard against applicationHost so this test is valid
      const host: any = { firstChild: {} };
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
      spyOn(document, 'getElementById').and.returnValue(document.body);
      mockCompositionEngine.compose.and.callFake((instruction) => {
        spyOn(instruction.viewSlot, 'attached');
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
        })
        .catch((reason) => expect(false).toBeTruthy(reason))
        .then(done);
    });

    it('should fire a custom aurelia-composed event when it\'s done', (done) => {
      spyOn(document, 'getElementById').and.returnValue(document.body);
      composeListener = (event) => {
        expect(event).toEqual(jasmine.any((window as any).Event));
        expect(event.type).toEqual('aurelia-composed');
        done();
      };

      // Can't do the same trick with aurelia-start because it waits till
      // after the promise is resolved to fire the event
      document.addEventListener('aurelia-composed', composeListener);
      aurelia.setRoot(rootModel)
        .catch((reason) => {
          expect(false).toBeTruthy(reason);
          done();
        });

    });
  });

  describe('enhance()', () => {
    let aurelia;
    let mockContainer;
    let mockLoader;
    let mockResources;
    let mockPlugin;
    let mockViewEngine;
    const rootStub = {
      attached() {
        // no-longer-empty
      },
    };

    beforeEach(() => {
      mockLoader = jasmine.createSpy('loader');

      mockViewEngine = jasmine.createSpyObj('viewEngine', ['importViewResources', 'enhance']);
      mockViewEngine.importViewResources.and.returnValue(new Promise((resolve) => {
        resolve();
      }));

      mockViewEngine.enhance.and.returnValue(rootStub);

      mockContainer = jasmine.createSpyObj('container', ['registerInstance', 'hasResolver', 'get', 'makeGlobal']);
      mockContainer.hasResolver.and.returnValue(true);
      mockContainer.get.and.returnValue(mockViewEngine);

      mockResources = jasmine.createSpy('viewResources');

      mockPlugin = jasmine.createSpyObj('plugin', ['apply']);
      mockPlugin.apply.and.returnValue(new Promise((resolve) => {
        resolve();
      }));

      aurelia = new Aurelia(mockLoader, mockContainer, mockResources);
      aurelia.use = mockPlugin;
    });

    describe('when passing in no arguments', () => {

      it('configures body as host', () => {
        spyOn(document, 'querySelectorAll').and.returnValue([document.body]);
        spyOn(aurelia, 'configureHost');
        aurelia.enhance();
        expect(aurelia.configureHost).toHaveBeenCalledWith(document.body);
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
        const elId = 'Testing';
        const fakeElement = DOM.createElement('div');
        fakeElement.setAttribute('id', elId);
        aurelia.enhance({}, fakeElement);
        expect(aurelia.host).toBe(fakeElement);
      });
    });
  });
});
