---
{
  "name": "App Configuration and Startup",
  "culture": "en-US",
  "description": "In this article you'll learn the various ways to bootstrap and configure Aurelia, along with different mechanisms for controlling the initial render strategy.",
  "engines" : { "aurelia-doc" : "^1.0.0" },
  "author": {
  	"name": "Rob Eisenberg",
  	"url": "http://robeisenberg.com"
  },
  "contributors": [],
  "translators": [],
  "keywords": ["Framework", "Configuration", "Startup"]
}
---
## [Bootstrapping Aurelia](aurelia-doc://section/1/version/1.0.0)

Most platforms have a "main" or entry point for code execution. Aurelia is no different. If you've read the Quick Start, then you've seen the `aurelia-app` attribute. Simply place this on an HTML element and Aurelia's bootstrapper will load an _app${context.language.fileExtension}_ and _app.html_, databind them together and inject them into the DOM element on which you placed that attribute.

Often times you want to configure the framework or run some code prior to displaying anything to the user though. So chances are, as your project progresses, you will migrate towards needing some startup configuration. In order to do this, you can provide a value for the `aurelia-app` attribute that points to a configuration module. This module should export a single function named `configure`. Aurelia invokes your `configure` function, passing it the Aurelia object which you can then use to configure the framework yourself and decide what, when, and where to display your UI. Here's an example configuration file showing the standard configuration, the same configuration that is equivalent to what you would get when using `aurelia-app` without a value:

<code-listing heading="Standard Configuration">
  <source-code lang="ES 2015/2016">
    export function configure(aurelia) {
      aurelia.use
        .standardConfiguration()
        .developmentLogging();

      aurelia.start().then(() => aurelia.setRoot());
    }
  </source-code>
  <source-code lang="TypeScript">
    import {Aurelia} from 'aurelia-framework';

    export function configure(aurelia: Aurelia): void {
      aurelia.use
        .standardConfiguration()
        .developmentLogging();

      aurelia.start().then(() => aurelia.setRoot());
    }
  </source-code>
</code-listing>

So, if you want to keep all the default settings, it's really easy. Just call `standardConfiguration()` to configure the standard set of plugins. Then call `developmentLogging()` to turn on logging in debug mode, output to the `console`.

The `use` property on the `aurelia` instance is an instance of `FrameworkConfiguration`. It has many helper methods for configuring Aurelia. For example, if you wanted to manually configure all the standard plugins without using the `standardConfiguration()` helper method to do so and you wanted to configure logging without using the helper method for that, this is how you would utilize the `FrameworkConfiguration` instance:

<code-listing heading="Manual Configuration">
  <source-code lang="ES 2015/2016">
    import {LogManager} from 'aurelia-framework';
    import {ConsoleAppender} from 'aurelia-logging-console';

    LogManager.addAppender(new ConsoleAppender());
    LogManager.setLevel(LogManager.logLevel.debug);

    export function configure(aurelia) {
      aurelia.use
        .defaultBindingLanguage()
        .defaultResources()
        .history()
        .router()
        .eventAggregator();

      aurelia.start().then(() => aurelia.setRoot());
    }
  </source-code>
  <source-code lang="TypeScript">
    import {Aurelia, LogManager} from 'aurelia-framework';
    import {ConsoleAppender} from 'aurelia-logging-console';

    LogManager.addAppender(new ConsoleAppender());
    LogManager.setLevel(LogManager.logLevel.debug);

    export function configure(aurelia: Aurelia): void {
      aurelia.use
        .defaultBindingLanguage()
        .defaultResources()
        .history()
        .router()
        .eventAggregator();

      aurelia.start().then(() => aurelia.setRoot());
    }
  </source-code>
</code-listing>

You can see that this code configures the default data-binding language (.bind, .trigger, etc.), the default set of view resources (repeat, if, compose, etc.) the history module (integration with the browser's history API), the router (mapping routes to components) and the event aggregator (app-wide pub/sub messaging). If, for example, you were building an app that didn't need to use the router or event aggregator, but did want debug logging, you could do that very easily with this configuration:

<code-listing heading="Minimal Configuration">
  <source-code lang="ES 2015/2016">
    export function configure(aurelia) {
      aurelia.use
        .defaultBindingLanguage()
        .defaultResources()
        .developmentLogging();

      aurelia.start().then(() => aurelia.setRoot());
    }
  </source-code>
  <source-code lang="TypeScript">
    import {Aurelia} from 'aurelia-framework';

    export function configure(aurelia: Aurelia): void {
      aurelia.use
        .defaultBindingLanguage()
        .defaultResources()
        .developmentLogging();

      aurelia.start().then(() => aurelia.setRoot());
    }
  </source-code>
</code-listing>

Once you've configured the framework, you need to start things up by calling `aurelia.start()`. This API returns a promise. Once it's resolved, the framework is ready, including all plugins, and it is now safe to interact with the services and begin rendering.

## [Rendering the Root Component](aurelia-doc://section/2/version/1.0.0)

The root component is set by calling `aurelia.setRoot()`. If no values are provided, this defaults to treating the element with the `aurelia-app` attribute as the DOM host for your app and `app${context.language.fileExtension}`/`app.html` as the source for the root component. However, you can specify whatever you want, just like this:

<code-listing heading="Manual Root Component">
  <source-code lang="ES 2015/2016">
    export function configure(aurelia) {
      aurelia.use
        .standardConfiguration()
        .developmentLogging();

      aurelia.start().then(() => aurelia.setRoot('my-root', document.getElementById('some-element'));
    }
  </source-code>
  <source-code lang="TypeScript">
    import {Aurelia} from 'aurelia-framework';

    export function configure(aurelia: Aurelia): void {
      aurelia.use
        .standardConfiguration()
        .developmentLogging();

      aurelia.start().then(() => aurelia.setRoot('my-root', document.getElementById('some-element'));
    }
  </source-code>
</code-listing>

This causes the `my-root${context.language.fileExtension}`/`my-root.html` to be loaded as the root component and injected into the `some-element` HTML element.

## [Bootstrapping Older Browsers](aurelia-doc://section/3/version/1.0.0)

Aurelia was originally designed for Evergreen Browsers. This includes Chrome, Firefox, IE11 and Safari 8. However, we also support IE9 and above through the use of additional polyfills. To support these earlier browsers, you need the [requestAnimationFrame Polyfill](https://www.npmjs.com/package/raf) and the [MutationObserver polyfill](https://github.com/webcomponents/webcomponentsjs/tree/master/src). Once you have installed these, you'll need to adjust your code to load them before Aurelia is initialized.

In case you are using Webpack, create a bootstrapper file, e.g. `bootstrapper.js`:

<code-listing heading="Polyfill Configuration">
  <source-code lang="HTML">
    import 'webcomponents/webcomponentsjs/MutationObserver';
    import 'raf/polyfill';
  </source-code>
</code-listing>

After you have created the file, add it as the first file in your `aurelia-bootstrapper` bundle. You can find bundle configuration in the `webpack.config.js` file.

If you are using JSPM change your `index.html` startup code as follows:

<code-listing heading="Polyfill Configuration">
  <source-code lang="HTML">
    <!doctype html>
    <html>
      <head>
        <title>My App</title>
      </head>
      <body>
        <script src="jspm_packages/system.js"></script>
        <script src="config.js"></script>
        <script>
          SystemJS.import('raf/polyfill').then(function() {
            return SystemJS.import('aurelia-polyfills');
          }).then(function() {
            return SystemJS.import('webcomponents/webcomponentsjs/MutationObserver');
          }).then(function() {
            SystemJS.import('aurelia-bootstrapper');
          });
        </script>
      </body>
    </html>
  </source-code>
</code-listing>

> Note: Module Loaders and Bundlers
> The code in this article demonstrates loading via SystemJS. However, these techniques can be accomplished with other module loaders just as readily. Be sure to lookup the appropriate APIs for your chosen loader or bundler in order to translate these samples into the required code for your own app.

> Warning: Promises in Edge
> Currently, the Edge browser has a serious performance problem with its Promise implementation. This deficiency can greatly increase startup time of your app. If you are targeting the Edge browser, it is highly recommended that you use the [bluebird promise](http://bluebirdjs.com/docs/getting-started.html) library to replace Edge's native implementation. You can do this by simply referencing the library prior to loading other libraries.

## [Manual Bootstrapping](aurelia-doc://section/4/version/1.0.0)

So far, we've been bootstrapping our app declaratively by using the `aurelia-app` attribute. That's not the only way though. You can manually bootstrap the framework as well. In case of JSPM, here's how you would change your HTML file to use manual bootstrapping:

<code-listing heading="Manual Bootstrapping with JSPM">
  <source-code lang="HTML">
    <!doctype html>
    <html>
      <head>
        <title>My App</title>
      </head>
      <body>
        <script src="jspm_packages/system.js"></script>
        <script src="config.js"></script>
        <script>
          SystemJS.import('aurelia-bootstrapper').then(bootstrapper => {
            bootstrapper.bootstrap(function(aurelia) {
              aurelia.use
                .standardConfiguration()
                .developmentLogging();

              aurelia.start().then(() => aurelia.setRoot('app', document.body));
            });
          });
        </script>
      </body>
    </html>
  </source-code>
</code-listing>

In case you use Webpack, you can replace the `aurelia-bootstrapper-webpack` package with the `./src/main` entry file in the `aurelia-bootstrapper` bundle defined inside of `webpack.config.js`, and call the bootstrapper manually:


<code-listing heading="Manual Bootstrapping with Webpack">
  <source-code lang="ES 2015/2016">
    import {bootstrap} from 'aurelia-bootstrapper-webpack';

    bootstrap(async aurelia => {
      aurelia.use
        .standardConfiguration()
        .developmentLogging();

      await aurelia.start();
      aurelia.setRoot('app', document.body);
    });
  </source-code>
  <source-code lang="TypeScript">
    import {Aurelia} from 'aurelia-framework';
    import {bootstrap} from 'aurelia-bootstrapper-webpack';

    bootstrap(async (aurelia: Aurelia) => {
      aurelia.use
        .standardConfiguration()
        .developmentLogging();

      await aurelia.start();
      aurelia.setRoot('app', document.body);
    });
  </source-code>
</code-listing>

The function you pass to the `bootstrap` method is the same as the `configure` function from the examples above.

## [Making Resources Global](aurelia-doc://section/5/version/1.0.0)

When you create a view in Aurelia, it is completely encapsulated. In the same way that you must `import` modules into an ES2015/TypeScript module, you must also import or `require` components into an Aurelia view. However, certain components are used so frequently across views that it can become very tedious to import them over and over again. To solve this problem, Aurelia lets you explicitly declare certain "view resources" as global. In fact, the configuration helper method `defaultResources()` mentioned above does just that. It takes the default set of view resources, such as `repeat`, `if`, `compose`, etc, and makes them globally usable in every view. You can do the same with your own components. Here's how we could make the `my-component` custom element, located in a _resources_ subfolder of your project, globally available in all views.

<code-listing heading="Make a Component Global">
  <source-code lang="ES 2015/2016">
    export function configure(aurelia) {
      aurelia.use
        .standardConfiguration()
        .developmentLogging()
        .globalResources('resources/my-component');

      aurelia.start().then(() => aurelia.setRoot());
    }
  </source-code>
  <source-code lang="TypeScript">
    import {Aurelia} from 'aurelia-framework';

    export function configure(aurelia: Aurelia): void {
      aurelia.use
        .standardConfiguration()
        .developmentLogging()
        .globalResources('resources/my-component');

      aurelia.start().then(() => aurelia.setRoot());
    }
  </source-code>
</code-listing>

## [Organizing Your App with Features](aurelia-doc://section/6/version/1.0.0)

Sometimes you have whole group of components or related functionality that collectively form a "feature". This "feature" may even be owned by a particular set of developers on your team. You want these developers to be able to manage the configuration and resources of their own feature, without interfering with the other parts of the app. For this scenario, Aurelia provides the "feature" feature.

Imagine, as above, that we have a `my-component` component. Imagine that that was then one of a dozen components that formed a logical feature in your app called `my-feature`. Rather than place the feature's configuration logic inside the app's configuration module, we can place the feature's configuration inside its own feature configuration module.

To create a "feature", simply create a folder in your app; in the case of our example: `my-feature`. Inside that folder, place all the components and other code that pertain to that feature. Finally, create an `index${context.language.fileExtension}` file at the root of the `my-feature` folder. The `index${context.language.fileExtension}` file should export a single `configure` function. Here's what our code might look like for our hypothetical `my-feature` feature:

<code-listing heading="A Feature Module (index${context.language.fileExtension})">
  <source-code lang="ES 2015/2016">
    export function configure(config) {
      config.globalResources(['./my-component', './my-component-2', 'my-component-3', 'etc.']);
    }
  </source-code>
  <source-code lang="TypeScript">
    import {FrameworkConfiguration} from 'aurelia-framework';

    export function configure(config: FrameworkConfiguration): void {
      config.globalResources(['./my-component', './my-component-2', 'my-component-3', 'etc.']);
    }
  </source-code>
</code-listing>

The `configure` method receives an instance of the same `FrameworkConfiguration` object as the `aurelia.use` property. So, the feature can configure your app in any way it needs. An important note is that resources should be configured using paths relative to the `index${context.language.fileExtension}` itself.

How then do we turn this feature on in our app? Here's an app configuration file that shows:

<code-listing heading="Using a Feature">
  <source-code lang="ES 2015/2016">
    export function configure(aurelia) {
      aurelia.use
        .standardConfiguration()
        .developmentLogging()
        .feature('my-feature');

      aurelia.start().then(() => aurelia.setRoot());
    }
  </source-code>
  <source-code lang="TypeScript">
    import {Aurelia} from 'aurelia-framework';

    export function configure(aurelia: Aurelia): void {
      aurelia.use
        .standardConfiguration()
        .developmentLogging()
        .feature('my-feature');

      aurelia.start().then(() => aurelia.setRoot());
    }
  </source-code>
</code-listing>

## [Installing Plugins](aurelia-doc://section/7/version/1.0.0)

Similar to features, you can install 3rd party plugins. The main difference is that a "feature" is provided internally by your application, while a plugin is installed from a 3rd party source through your package manager.

To use a plugin, you first install the package. For example `jspm install my-plugin` would use jspm to install the `my-plugin` package. Once the package is installed, you must configure it in your application. Here's some code that shows how that works.

<code-listing heading="Using a Plugin">
  <source-code lang="ES 2015/2016">
    export function configure(aurelia) {
      aurelia.use
        .standardConfiguration()
        .developmentLogging()
        .plugin('my-plugin', pluginConfiguration);

      aurelia.start().then(() => aurelia.setRoot());
    }
  </source-code>
  <source-code lang="TypeScript">
    import {Aurelia} from 'aurelia-framework';

    export function configure(aurelia: Aurelia): void {
      aurelia.use
        .standardConfiguration()
        .developmentLogging()
        .plugin('my-plugin', pluginConfiguration);

      aurelia.start().then(() => aurelia.setRoot());
    }
  </source-code>
</code-listing>

Simply provide the same name used during installation, to the plugin API. Some plugins may require configuration (see the plugin's documentation for details). If so, pass the configuration object or configuration callback function as the second parameter of the `plugin` API.

## [Leveraging Progressive Enhancement](aurelia-doc://section/8/version/1.0.0)

So far you've seen Aurelia replacing a portion of the DOM with a root component. However, that's not the only way to render with Aurelia. Aurelia can also progressively enhance existing HTML.

Imagine that you want to generate your home page on the server, including using your server-side templating engine to render out HTML. Perhaps you've got custom components you created with Aurelia, but you want to render the custom elements on the server with some content, in order to make things a bit more SEO friendly. Or perhaps you have an existing, traditional web app, that you want to incrementally start adding Aurelia to. When the HTML is rendered in the browser, you want to progressively enhance that HTML and "bring it to life" by activating all the Aurelia component's rich behavior.

All this is possible with Aurelia, using a single method call: `enhance`. Instead of using `aurelia-app` let's use manual bootstrapping for this example. To progressively enhance the entire `body` of your HTML page, you can do something like this (JSPM-based example):

<code-listing heading="Progressive Enhancement">
  <source-code lang="HTML">
    <!doctype html>
    <html>
      <head>
        <title>My App</title>
      </head>
      <body>
        <my-component message="Enhance Me"></my-component>

        <script src="jspm_packages/system.js"></script>
        <script src="config.js"></script>
        <script>
          SystemJS.import('aurelia-bootstrapper').then(bootstrapper => {
            bootstrapper.bootstrap(function(aurelia){
              aurelia.use
                .defaultBindingLanguage()
                .defaultResources()
                .developmentLogging()
                .globalResources('resources/my-component');

              aurelia.start().then(() => aurelia.enhance());
            });
          });
        </script>
      </body>
    </html>
  </source-code>
</code-listing>

It's important to note that, in order for `enhance` to identify components to enhance in your HTML page, you need to declare those components as global resources, as we have above with the `my-component` component.

Optionally, you can provide an object instance to use as the data-binding context for the enhancement, or provide a specific part of the DOM to enhance. Here's an example that shows both (JSPM-based):

<code-listing heading="Customized Progressive Enhancement">
  <source-code lang="HTML">
    <!doctype html>
    <html>
      <head>
        <title>My App</title>
      </head>
      <body>
        <my-component message.bind="message"></my-component>

        <script src="jspm_packages/system.js"></script>
        <script src="config.js"></script>
        <script>
          SystemJS.import('aurelia-bootstrapper').then(bootstrapper => {
            bootstrapper.bootstrap(function(aurelia){
              aurelia.use
                .defaultBindingLanguage()
                .defaultResources()
                .developmentLogging()
                .globalResources('resources/my-component');

              var viewModel = {
                message: 'Enhanced'
              };

              aurelia.start().then(() => aurelia.enhance(viewModel, document.body));
            });
          });
        </script>
      </body>
    </html>
  </source-code>
</code-listing>

## [Customizing Conventions](aurelia-doc://section/9/version/1.0.0)

There are many things you may want to customize or configure as part of your application's bootstrap process. Once you have your main `configure` method in place and `aurelia-app` is pointing to that module, you can do just about anything you want. One of the most common aspects of Aurelia that developers may want to customize, is its conventions.


### Configuring the View Location Convention

Aurelia uses a _View Strategy_ to locate the view that is associated with a particular component's view-model. If the component doesn't specify its own view strategy, then Aurelia's `ViewLocator` service will use a fallback view strategy. The fallback strategy that is used is named `ConventionalViewStrategy`. This strategy uses the view-model's module id to conventionally map to its view id. For example, if the module id is "welcome${context.language.fileExtension}" then this strategy will look for the view at "welcome.html". The conventional strategy's mapping logic can be changed if a different convention is desired. To do this, during bootstrap, import the `ViewLocator` and replace its `convertOriginToViewUrl` method with your own implementation. Here's some example code:

<code-listing heading="Custom View Location Convention">
  <source-code lang="ES 2015/2016">
    import {ViewLocator} from 'aurelia-framework';

    export function configure(aurelia) {
      aurelia.use
        .standardConfiguration()
        .developmentLogging();

      ViewLocator.prototype.convertOriginToViewUrl = (origin) => {
        let moduleId = origin.moduleId;
        ...
        return "view.html";
      };

      aurelia.start().then(a => a.setRoot());
    }
  </source-code>
  <source-code lang="TypeScript">
    import {ViewLocator, Aurelia, Origin} from 'aurelia-framework';

    export function configure(aurelia: Aurelia): void {
      aurelia.use
        .standardConfiguration()
        .developmentLogging();

      ViewLocator.prototype.convertOriginToViewUrl = (origin: Origin): string => {
        let moduleId = origin.moduleId;
        ...
        return "view.html";
      };

      aurelia.start().then(a => a.setRoot());
    }
  </source-code>
</code-listing>

In this example, you would simply replace "..." with your own mapping logic and return the resulting view path that was desired.

If you're using Webpack with a HTML templating engine such as Jade, you'd have to configure Aurelia to look for the `.jade` extension instead of `.html`. This is due to Webpack keeping the original sourcemaps and lets loader plugins take care of transpiling the source. Here's the code to configure Aurelias' `ViewLocator` for Jade:

<code-listing heading="Custom Jade View Location">
  <source-code lang="ES 2015/2016">
    import {ViewLocator} from 'aurelia-framework';

    export function configure(aurelia) {
      aurelia.use
        .standardConfiguration()
        .developmentLogging();

      ViewLocator.prototype.convertOriginToViewUrl = (origin) => {
        let moduleId = origin.moduleId;
        let id = (moduleId.endsWith('.js') || moduleId.endsWith('.ts')) ? moduleId.substring(0, moduleId.length - 3) : moduleId;
        return id + '.jade';
      };

      aurelia.start().then(a => a.setRoot());
    }
  </source-code>
  <source-code lang="TypeScript">
    import {ViewLocator, Aurelia, Origin} from 'aurelia-framework';

    export function configure(aurelia: Aurelia): void {
      aurelia.use
        .standardConfiguration()
        .developmentLogging();

      ViewLocator.prototype.convertOriginToViewUrl = (origin: Origin): string => {
        let moduleId = origin.moduleId;
        let id = (moduleId.endsWith('.js') || moduleId.endsWith('.ts')) ? moduleId.substring(0, moduleId.length - 3) : moduleId;
        return id + '.jade';
      };

      aurelia.start().then(a => a.setRoot());
    }
  </source-code>
</code-listing>

### Configuring the Fallback View Location Strategy

In addition to customizing the mapping logic of the `ConventionalViewStrategy` you can also replace the entire fallback view strategy. To do this, replace the `createFallbackViewStrategy` of the `ViewLocator` with your own implementation. Here's some sample code for that:

<code-listing heading="Custom View Fallback">
  <source-code lang="ES 2015/2016">
    import {ViewLocator} from 'aurelia-framework';

    export function configure(aurelia) {
      aurelia.use
        .standardConfiguration()
        .developmentLogging();

      ViewLocator.prototype.createFallbackViewStrategy = (origin) => {
        return new CustomViewStrategy(origin);
      };

      aurelia.start().then(a => a.setRoot());
    }
  </source-code>
  <source-code lang="TypeScript">
    import {ViewLocator, Aurelia, Origin} from 'aurelia-framework';

    export function configure(aurelia: Aurelia): void {
      aurelia.use
        .standardConfiguration()
        .developmentLogging();

      ViewLocator.prototype.createFallbackViewStrategy = (origin: Origin) => {
        return new CustomViewStrategy(origin);
      };

      aurelia.start().then(a => a.setRoot());
    }
  </source-code>
</code-listing>

## [Logging](aurelia-doc://section/10/version/1.0.0)

Aurelia has a simple logging abstraction that the framework itself uses. By default it is a no-op. The configuration in the above examples shows how to install an appender which will take the log data and output it to the console. Here's the code again, for convenience:

<code-listing heading="Configuring Logging">
  <source-code lang="ES 2015/2016">
    import {LogManager} from 'aurelia-framework';
    import {ConsoleAppender} from 'aurelia-logging-console';

    LogManager.addAppender(new ConsoleAppender());
    LogManager.setLevel(LogManager.logLevel.debug);

    export function configure(aurelia) {
      aurelia.use
        .standardConfiguration;

      aurelia.start().then(() => aurelia.setRoot());
    }
  </source-code>
  <source-code lang="TypeScript">
    import {LogManager, Aurelia} from 'aurelia-framework';
    import {ConsoleAppender} from 'aurelia-logging-console';

    LogManager.addAppender(new ConsoleAppender());
    LogManager.setLevel(LogManager.logLevel.debug);

    export function configure(aurelia: Aurelia): void {
      aurelia.use
        .standardConfiguration;

      aurelia.start().then(() => aurelia.setRoot());
    }
  </source-code>
</code-listing>

You can also see how to set the log level. Values for the `logLevel` include: `none`, `error`, `warn`, `info` and `debug`.

The above example uses our provided `ConsoleAppender`, but you can easily create your own appenders. Simply implement a class that matches the `Appender` interface from the logging library.
