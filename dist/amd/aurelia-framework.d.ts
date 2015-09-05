declare module 'aurelia-framework' {
  import * as core from 'core-js';
  import * as TheLogManager from 'aurelia-logging';
  import { ViewEngine, BindingLanguage, ViewSlot, ViewResources, CompositionEngine, Animator, DOMBoundary }  from 'aurelia-templating';
  import { join }  from 'aurelia-path';
  import { Container }  from 'aurelia-dependency-injection';
  import { Loader }  from 'aurelia-loader';
  
  /**
   * Manages configuring the aurelia framework instance.
   * @param {Aurelia} aurelia An instance of Aurelia.
   */
  export class FrameworkConfiguration {
    container: Container;
    aurelia: Aurelia;
    constructor(aurelia: Aurelia);
    
    /**
       * Adds an existing object to the framework's dependency injection container.
       * @param type The object type of the dependency that the framework will inject.
       * @param instance The existing instance of the dependency that the framework will inject.
       * @return Returns the current FrameworkConfiguration instance.
       */
    instance(type: any, instance: any): FrameworkConfiguration;
    
    /**
       * Adds a singleton to the framework's dependency injection container.
       * @param type The object type of the dependency that the framework will inject.
       * @param implementation The constructor function of the dependency that the framework will inject.
       * @return Returns the current FrameworkConfiguration instance.
       */
    singleton(type: any, implementation?: Function): FrameworkConfiguration;
    
    /**
       * Adds a transient to the framework's dependency injection container.
       * @param type The object type of the dependency that the framework will inject.
       * @param implementation The constructor function of the dependency that the framework will inject.
       * @return Returns the current FrameworkConfiguration instance.
       */
    transient(type: any, implementation?: Function): FrameworkConfiguration;
    
    /**
       * Adds an async function that runs before the plugins are run.
       * @param task The function to run before start.
       * @return Returns the current FrameworkConfiguration instance.
       */
    preTask(task: Function): FrameworkConfiguration;
    
    /**
       * Adds an async function that runs after the plugins are run.
       * @param task The function to run after start.
       * @return Returns the current FrameworkConfiguration instance.
       */
    postTask(task: Function): FrameworkConfiguration;
    
    /**
       * Configures an internal feature plugin before Aurelia starts.
       * @param plugin The folder for the internal plugin to configure (expects an index.js in that folder).
       * @param config The configuration for the specified plugin.
       * @return Returns the current FrameworkConfiguration instance.
      */
    feature(plugin: string, config?: any): FrameworkConfiguration;
    
    /**
       * Adds globally available view resources to be imported into the Aurelia framework.
       * @param resources The relative module id to the resource. (Relative to the plugin's installer.)
       * @return Returns the current FrameworkConfiguration instance.
       */
    globalResources(resources: string | string[]): FrameworkConfiguration;
    
    /**
       * Renames a global resource that was imported.
       * @param resourcePath The path to the resource.
       * @param newName The new name.
       * @return Returns the current FrameworkConfiguration instance.
       */
    globalName(resourcePath: string, newName: string): FrameworkConfiguration;
    
    /**
       * Configures an external, 3rd party plugin before Aurelia starts.
       * @param plugin The ID of the 3rd party plugin to configure.
       * @param config The configuration for the specified plugin.
       * @return Returns the current FrameworkConfiguration instance.
     */
    plugin(plugin: string, config?: any): FrameworkConfiguration;
    
    /**
       * Plugs in the default binding language from aurelia-templating-binding.
       * @return Returns the current FrameworkConfiguration instance.
      */
    defaultBindingLanguage(): FrameworkConfiguration;
    
    /**
       * Plugs in the router from aurelia-templating-router.
       * @return Returns the current FrameworkConfiguration instance.
      */
    router(): FrameworkConfiguration;
    
    /**
       * Plugs in the default history implementation from aurelia-history-browser.
       * @return Returns the current FrameworkConfiguration instance.
      */
    history(): FrameworkConfiguration;
    
    /**
       * Plugs in the default templating resources (if, repeat, show, compose, etc.) from aurelia-templating-resources.
       * @return Returns the current FrameworkConfiguration instance.
      */
    defaultResources(): FrameworkConfiguration;
    
    /**
       * Plugs in the event aggregator from aurelia-event-aggregator.
       * @return Returns the current FrameworkConfiguration instance.
      */
    eventAggregator(): FrameworkConfiguration;
    
    /**
       * Sets up the Aurelia configuration. This is equivalent to calling `.defaultBindingLanguage().defaultResources().history().router().eventAggregator();`
       * @return Returns the current FrameworkConfiguration instance.
      */
    standardConfiguration(): FrameworkConfiguration;
    
    /**
       * Plugs in the ConsoleAppender and sets the log level to debug.
       * @return {FrameworkConfiguration} Returns the current FrameworkConfiguration instance.
      */
    developmentLogging(): FrameworkConfiguration;
    
    /**
       * Loads and configures the plugins registered with this instance.
       * @return Returns a promise which resolves when all plugins are loaded and configured.
      */
    apply(): Promise<void>;
  }
  
  /**
   * The framework core that provides the main Aurelia object.
   * @param loader The loader for this Aurelia instance to use. If a loader is not specified, Aurelia will use a defaultLoader.
   * @param container The dependency injection container for this Aurelia instance to use. If a container is not specified, Aurelia will create an empty container.
   * @param resources The resource registry for this Aurelia instance to use. If a resource registry is not specified, Aurelia will create an empty registry.
   */
  export class Aurelia {
    loader: Loader;
    container: Container;
    resources: ViewResources;
    use: FrameworkConfiguration;
    constructor(loader?: Loader, container?: Container, resources?: ViewResources);
    
    /**
       * Loads plugins, then resources, and then starts the Aurelia instance.
       * @return Returns the started Aurelia instance.
       */
    start(): Promise<Aurelia>;
    
    /**
       * Enhances the host's existing elements with behaviors and bindings.
       * @param bindingContext A binding context for the enhanced elements.
       * @param applicationHost The DOM object that Aurelia will enhance.
       * @return Returns the current Aurelia instance.
       */
    enhance(bindingContext?: Object, applicationHost?: any): Promise<Aurelia>;
    
    /**
       * Instantiates the root view-model and view and add them to the DOM.
       * @param root The root view-model to load upon bootstrap.
       * @param applicationHost The DOM object that Aurelia will attach to.
       * @return Returns the current Aurelia instance.
       */
    setRoot(root?: string, applicationHost?: any): Promise<Aurelia>;
  }
  export * from 'aurelia-dependency-injection';
  export * from 'aurelia-binding';
  export * from 'aurelia-metadata';
  export * from 'aurelia-templating';
  export * from 'aurelia-loader';
  export * from 'aurelia-task-queue';
  export * from 'aurelia-path';
  export const LogManager: any;
}