---
{
  "name": "Bundling with Webpack",
  "culture": "en-US",
  "description": "Before deploying your app to production, you'll want to bundle the assets for efficient use of the network.",
  "engines" : { "aurelia-doc" : "^1.0.0" },
  "author": {
  	"name": "Bazyli Brzóska",
  	"url": "https://invent.life"
  },
  "contributors": [],
  "translators": [],
  "keywords": ["Deploy", "Bundling", "Webpack"]
}
---
## [Introduction](aurelia-doc://section/1/version/1.0.0)

Most of the current major browsers limit the number of simultaneous connections per hostname to six. This means that while six requests are being processed, additional requests for assets on a host will be queued by the browser. In the image below, the Chrome F12 developer tools network tab shows the timing for assets required by the `welcome view` of the unbundled, JSPM-based skeleton-navigation application.

![No of requests made by unbundled application](img/unbundled-aurelia-application.jpg)

As we can see, there are over 95 requests being made to load the first view. While the first few requests are being processed the others are waiting, ultimately taking almost 2.39s on a local machine.

In the past, the most common browser limit has been 2 connections. This may have been sufficient in the beginning of the web when most of the content was delivered in a single page load. However, it can soon become the bottleneck when building rich client applications with frameworks like Aurelia and others.

You may wonder: If this limit can have such a great impact on performance, then why don't browsers give us a higher limit? Most well-known browsers choose not to grant this wish in order to prevent the server from being overloaded by a small number of browsers. Such activity would be similar in nature to a DDOS attack.

## [Bundling & Minification](aurelia-doc://section/2/version/1.0.0)

This connection limit will not cause slowness in our application if we can manage resources well enough to avoid it. When the page is first loaded, this is the initial request that returns HTML content. When the browser processes the HTML content, it spawns more requests to load resources like JS, CSS and images. It also executes JavaScript and sends AJAX requests to the server.

To make this process efficient, we need to compress the assets and make fewer (possibly less than 6) requests to load everything we need. Fortunately, static resources can be cached and only downloaded the first time. If they cause slowness, it happens on the first page load only and may be tolerable.

Bundling along with minification are techniques that can also be used to improve load time. Bundling and minification improve load time by reducing the number of requests to the server as well as reducing the size of requested assets such as views, view-models and CSS.

## [Bundling an Aurelia Webpack Application](aurelia-doc://section/3/version/1.0.0)

In the following example, we will use the `skeleton-navigation` as our app to bundle. If you don't have that set up. Follow [these steps](https://github.com/aurelia/skeleton-navigation#running-the-app).

Now that we have our app running, let's try to build the preconfigured bundle. Webpack, as opposed to JSPM, is not a loader, which means it always creates bundles before loading a page is possible. By default there are two versions of bundles you can create: the development bundle and the production bundle.

To build the development bundle execute:

```shell
npm run build
```

To build an optimized, minified production bundle execute:

```shell
npm run build:prod
```

You can find the configuration for both of these bundles in the `webpack.config.js` file. We'll look into it in a bit.

After the bundle is created, by default you'll find the output in the `dist` folder.

> Warning
> The `dist` folder is automatically deleted before a new bundle is built.

To start a simple web server and test either the development or production build execute:

```shell
npm run server:prod
```

After executing the command, you'll see a link which will run your bundled application.

## [Entry Bundles](aurelia-doc://section/4/version/1.0.0)

The skeleton-navigation is configured to create 3 explicit entry bundles by default: 
- `aurelia-bootstrap` - contains modules needed to be loaded first, such as polyfills and Aurelia's Platform Abstraction Layer
- `aurelia` - contains all of the aurelia's modules
- `app` - contains files from within the `src` folder and their dependencies

However, you are free to define as many entry bundles as we want, by listing adding the packages as entry points of `webpack.config.js`:

```js
const baseConfig = {
  entry: {
    'app': [],
    // (...) //
    'vendor': ['moment'] 
  },
  output: {
    path: outDir,
  }
}
```

In the above example we created an explicit bundle called `vendor` that only contains the package: `moment`.

Defining entry bundles is only useful when you want to be able to make use of client-server file caching, because it means that you can only update the bundles which contain the changes, instead of all of them.

To make it easier to see whether it's necessary to update a certain bundle, the production bundles by default contain a hash in their filename.

## [Code-Splitting: Chunks / Async Bundles](aurelia-doc://section/5/version/1.0.0)

By default, all of our application code is contained in the `app` entry bundle. If our application is small enough, we can keep using just that single bundle, however the number of bundles we would like to have should mostly depend on our application structure and the usage patterns of our app. For example, if our app was built in a modular fashion, such that it is a collection of child-app/sections, then a `common` bundle for third-party libraries and a `bundle per section` makes much more sense and performs better than a huge single bundle that needs to be loaded up front.

This is because such "implicit bundles" are loaded asynchronously, on demand.

There are two ways to define code-splitting bundles:

- centralized, in the `package.json`
- as parameters of the `<require>` tag of your `.html` View files

For most use-cases, I recommend using the centralized approach, as it makes it easier for you to analyze the output structure.

### Centralized Approach

Let's say we want to separate out the View and ViewModel: `src/users` contained in the skeleton and defer its loading to when the user clicks on a link to that route, you could define an async bundle as follows:

<code-listing heading="package.json">
  <source-code lang="JavaScript">
    "aurelia": {
      "build": {
        "resources": [
          {
            "bundle": "users",
            "path": "users",
            "lazy": true
          }
        ]
      }
    }
  </source-code>
</code-listing>

> Info
> Note that `path` is relative to the `src` of our application, but can also be an external path, such as `bootstrap/css/bootstrap.css` or `aurelia-plugin/some-resource.html`. If no extension is specified, all of `.js`, `.ts` and `.html` are tried. The `path` property may also be an `Array` with a list of paths to be contained in a bundle.

Such a definition will create a Webpack split-point, meaning the bundle will only be loaded when it is needed (so-called "lazy-loading").

> Warning
> It is imperative to remember that the code will not end-up in the bundle, or the bundle will end-up being loaded prematurely, if you statically `import` anything from the files specified for implicit bundling.

Webpack is intelligent enough to resolve any further dependencies that those files and modules depend on (regardless if they are JavaScript files, modules with their own `package.json` declarations or additional HTML or CSS resources). In our example, the `users` ViewModel also requires the `blur-image` Custom Attribute, and thus would also be contained within it the `users` bundle.

When the bundler plugin analyzes the `users` file it will find `aurelia-framework` and `aurelia-fetch-client` as it's dependencies and include them in the bundle. But the bundler does not stop there. It will recursively find the dependencies of `aurelia-framework` and `aurelia-fetch-client` and will go on until there is nothing left. But since those dependencies are already in the `aurelia` entry bundle, it will not duplicate them in the `users` bundle, thanks to the `@easy-webpack/config-common-chunks-simple` present in the default configuration (more on that later on).

### In-View Approach

For quickly declaring a certain `<require>` as lazy (deferred loading), or in testing scenarios, you can use Webpack-specific custom attributes that will be analyzed by Aurelia's Webpack plugin and forwarded as bundling information to Webpack:

<code-listing heading="View">
  <source-code lang="HTML">
    <template>
      <require from="./blur-image" lazy bundle="blur-image">
    </template>
  </source-code>
</code-listing>

Both the `lazy` and the `bundle` attributes are optional.
If you do not specify the bundle name, the chunk number will be used instead.

## [Declaring Build Resources](aurelia-doc://section/6/version/1.0.0)

By default, all the production dependencies declared in the `package.json` that have a `main` entry file are considered as build resources.

In case Aurelia is supposed to load an external file or an external module that was not defined as a resource by any of its the dependencies, resources must also be specified manually.

> Warning
> Since the syntax is still relatively new, many Aurelia plugins do not declare their resources. If you are developing an Aurelia plugin, make sure you do this, so that your users do not have to. The `package.json` syntax is similar, with the one exception that resources are relative to the root directory of the plugin, as there is no `src` folder. 

There might reasons not to declare those resources in all cases,for example when the plugin is to be partially consumed (e.g. only one Button element from a package containing multiple Aurelia elements).

If we'd like to consume such external resources, we should declare them ourselves, for example:

<code-listing heading="package.json">
  <source-code lang="JavaScript">
    "aurelia": {
      "build": {
        "resources": [
          "aurelia-some-ui-plugin/dropdown",
          "aurelia-some-ui-plugin/checkbox"
        ]
      }
    }
  </source-code>
</code-listing>

You can also combine both features to separate out plugins or resources for lazy-loading:

<code-listing heading="package.json">
  <source-code lang="JavaScript">
    "aurelia": {
      "build": {
        "resources": [
          {
            "path": "aurelia-animator-css",
            "bundle": "animator",
            "lazy": true
          },
          {
            "path": [
              // lets say we only use the checkbox from within subpage1
              // we want those to be bundled together in a bundle called: "subpage1"
              "aurelia-some-ui-plugin/checkbox",
              "./items/subpage1"
            ],
            "bundle": "subpage1",
            "lazy": true
          },
          "aurelia-some-ui-plugin/dropdown"
        ]
      }
    }
  </source-code>
</code-listing>

## [Chunking Code When It Is Not Loaded By Aurelia](aurelia-doc://section/7/version/1.0.0)

If you have code that you'd like to load asynchronously in your ${context.language.name} files, you can make use of the System loader compliant syntax to create split-points.
Example use-cases for this are: conditionally loading foreign language support based on the user's selection or conditionally polyfilling certain features.

Such code-splitting is used to polyfill fetch support in the `users` file of skeleton-navigation. Let's take a look at how it works:

<code-listing heading="users.js">
  <source-code lang="JavaScript">
    const fetch = !self.fetch ? System.import('isomorphic-fetch') : Promise.resolve(self.fetch);
  </source-code>
</code-listing>

The `System.import` method is the asynchronous equivalent of the ES2015 `import`. It returns a `Promise`. The example above will only load the `isomorphic-fetch` polyfill in case `fetch` is not already available in the browser.

### System.import and TypeScript

When using TypeScript and the `System.import` API means you do not get any Typing information. As a workaround you can add custom definitions in a stub file, defining all of the asynchronous imports explicitly. To allow Typings for asynchronously loaded `aurelia-framework` and `isomorphic-fetch` packages, see the following example:

<code-listing heading="custom_typings/system.d.ts">
  <source-code lang="TypeScript">
    declare module 'system' {
      import fetch = require('isomorphic-fetch');
      import * as Aurelia from 'aurelia-framework';

      /**
       * List your dynamically imported modules to get typing support
       */
      interface System {
        import(name: string): Promise<any>;
        import(name: 'aurelia-framework'): Promise<typeof Aurelia>;
        import(name: 'isomorphic-fetch'): Promise<typeof fetch>;
      }

      global {
        var System: System;
      }
    }
  </source-code>
</code-listing>

## [Duplicate Modules in Multiple Bundles](aurelia-doc://section/8/version/1.0.0)

By default, the `webpack.config.js` uses the `CommonsChunkPlugin` under the hood, to eliminate code duplication across bundles by placing common code in the `app` bundle. If you have additional custom entry bundles, or somehow misused or misconfigured them, you may end up with duplicated modules in multiple bundles.

Creating multiple bundles requires us to be extra careful because multiple bundles may contain duplicate modules. Before explaining that, we need to understand how bundling works behind the scenes a bit. Let's consider the example modules `A` and `B` below:

<code-listing heading="a.js">
  <source-code lang="JavaScript">
    import b from './b';
    console.log('Hi, I am module A');
  </source-code>
</code-listing>

<code-listing heading="b.js">
  <source-code lang="JavaScript">
    console.log('Hi, I am module B');
  </source-code>
</code-listing>

When we want to bundle `a.js`, Webpack will analyze the source code of the module and find the dependencies by tracing the `import` statements. In this case, Webpack will yield `b.js` as the dependency of `a.js` and ultimately place `b.js` in the bundle.

To have full control over how Webpack distributes and de-duplicates the modules in the chunks, please refer to [Webpack documentation](https://github.com/webpack/docs/wiki/optimization#multi-page-app) on the matter and replace the `@easy-webpack/config-common-chunks-simple` configuration with a custom one.

## [Bundle Configuration and Easy Webpack](aurelia-doc://section/9/version/1.0.0)

Webpack is a very advanced piece technology, but it can be quite intimidating to beginners and hard to re-configure even for seasoned users. For this very reason, the skeleton-navigation example uses a package called [Easy Webpack](https://github.com/easy-webpack/core) that allows us to quickly stich together a number of configuration objects and supports presets. In more advanced use-cases, we can still override its configuration values, or replace the presets with custom configuration.

Let's take a look at how a configuration file can be put together:

<code-listing heading="webpack.config.js">
  <source-code lang="JavaScript">
    const generateConfig = require('@easy-webpack/core').default;

    // ...
    // let's assume these variables are defined:
    //   rootDir, srcDir, title, baseUrl
    // ...

    const baseConfig = {
      // here we'd put our base configuration
      // such as the entry bundles and output path
    };
    config = generateConfig(
      baseConfig,

      require('@easy-webpack/config-env-production')(),
        
      require('@easy-webpack/config-aurelia')
        ({root: rootDir, src: srcDir, title: title, baseUrl: baseUrl}),

      require('@easy-webpack/config-javascript')(),
      require('@easy-webpack/config-html')(),

      require('@easy-webpack/config-css')
        ({ filename: 'styles.css', allChunks: true, sourceMap: false }),

      require('@easy-webpack/config-fonts-and-images')(),
      require('@easy-webpack/config-global-bluebird')(),
      require('@easy-webpack/config-global-jquery')(),
      require('@easy-webpack/config-global-regenerator')(),
      require('@easy-webpack/config-generate-index-html')
        ({minify: true}),

      require('@easy-webpack/config-uglify')
        ({debug: false}),

      require('@easy-webpack/config-common-chunks-simple')
      ({appChunkName: 'app', firstChunk: 'aurelia-bootstrap'})

      {
        // here we can override or append any setting or plugin
        // that can be manually set in a webpack.config.js file
      }
    );

    module.exports = config;
  </source-code>
</code-listing>

As you can see, adding each `easy-webpack` preset package is like adding a "feature" to the configuration file, without needing to know much more.

The names of the packages are self-explanatory. The skeleton-navigation config file is a bit more advanced, in that it generates different configs depending on the set environment, since you might want slightly different settings for production, testing and development. For example, you'd want to minify resources in production, but keep fast loading Source Maps in development.

You can easily replace all the preset packages with your own configuration objects. Please refer to the [Easy Webpack](https://github.com/easy-webpack/core) documentation for more information about its capabilities.

## [Conclusion](aurelia-doc://section/10/version/1.0.0)

In this article, you've learned both the why and how of bundling with Webpack. We've covered how to configure Webpack's configuration file for use with Aurelia and demonstrated several different scenarios for asynchonous loading of parts of your code. To bundle your own app, we recommend that you begin with the skeleton-navigation configuration file and customize it. You may have a small app that makes sense as a single bundle or a larger one that can be broken down into features. Each application is different, but Webpack is extremely flexible and should help you to create the optimal deployment for your unique scenarios.
