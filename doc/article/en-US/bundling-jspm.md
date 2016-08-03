---
{
  "name": "Bundling with JSPM",
  "culture": "en-US",
  "description": "Before deploying your app to production, you'll want to bundle the assets for efficient use of the network.",
  "engines" : { "aurelia-doc" : "^1.0.0" },
  "author": {
  	"name": "Shuhel Ahmed",
  	"url": "https://github.com/ahmedshuhel"
  },
  "contributors": [],
  "translators": [],
  "keywords": ["Deploy", "Bundling"]
}
---
## [Introduction](aurelia-doc://section/1/version/1.0.0)

Most of the current major browsers limit the number of simultaneous connections per hostname to six. This means that while six requests are being processed, additional requests for assets on a host will be queued by the browser. In the image below, the Chrome F12 developer tools network tab shows the timing for assets required by the `welcome view` of the skeleton-navigation application.

![No of requests made by unbundled application](img/unbundled-aurelia-application.jpg)

As we can see, there are over 95 requests being made to load the first view. While the first few requests are being processed the others are waiting, ultimately taking almost 2.39s on a local machine.

In the past, the most common browser limit has been 2 connections. This may have been sufficient in the beginning of the web when most of the content was delivered in a single page load. However, it can soon become the bottleneck when building rich client applications with frameworks like Aurelia and others.

You may wonder: If this limit can have such a great impact on performance, then why don't browsers give us a higher limit? Most well-known browsers choose not to grant this wish in order to prevent the server from being overloaded by a small number of browsers. Such activity would be similar in nature to a DDOS attack.

## [Bundling & Minification](aurelia-doc://section/2/version/1.0.0)

This connection limit will not cause slowness in our application if we can manage resources well enough to avoid it. When the page is first loaded, this is the initial request that returns HTML content. When the browser processes the HTML content, it spawns more requests to load resources like JS, CSS and images. It also executes JavaScript and sends AJAX requests to the server.

To make this process efficient, we need to compress the assets and make fewer (possibly less than 6) requests to load everything we need. Fortunately, static resources can be cached and only downloaded the first time. If they cause slowness, it happens on the first page load only and may be tolerable.

Bundling along with minification are techniques that can also be used to improve load time. Bundling and minification improve load time by reducing the number of requests to the server as well as reducing the size of requested assets such as views, view-models and CSS.

## [Bundling an Aurelia JSPM Application](aurelia-doc://section/3/version/1.0.0)

We can  use [Aurelia Bundler](http://github.com/aurelia/bundler) to create a gulp task for bundling our JSPM app. Let's jump right into it. We will use the `skeleton-navigation` as our app to bundle. If you don't have that set up. Follow [these steps](https://github.com/aurelia/skeleton-navigation#running-the-app).

Now that we have our app running, let's start by installing `aurelia-bundler`. To do so `cd` into `skeleton-navigation` and run the following command:

```shell
npm install aurelia-bundler --save-dev
```

Now, let's create a `bundle.js` file in `build/tasks/bundle.js` as follows:

<code-listing heading="bundle.js">
  <source-code lang="JavaScript">

    var gulp = require('gulp');
    var bundle = require('aurelia-bundler').bundle;

    var config = {
      force: true,
      baseURL: '.',                   // baseURL of the application
      configPath: './config.js',      // config.js file. Must be within `baseURL`
      bundles: {
        "dist/app-build": {           // bundle name/path. Must be within `baseURL`. Final path is: `baseURL/dist/app-build.js`.
          includes: [
            '[*.js]',
            '*.html!text',
            '*.css!text'        
          ],
          options: {
            inject: true,
            minify: true
          }
        },
        "dist/vendor-build": {
          includes: [
            'aurelia-bootstrapper',
            'aurelia-fetch-client',
            'aurelia-router',
            'aurelia-animator-css',
            'github:aurelia/templating-binding',
            'github:aurelia/templating-resources',
            'github:aurelia/templating-router',
            'github:aurelia/loader-default',
            'github:aurelia/history-browser',
            'github:aurelia/logging-console',
            'bootstrap/css/bootstrap.css!text'
          ],
          options: {
            inject: true,
            minify: true
          }
        }
      }
    };

    gulp.task('bundle', function() {
      return bundle(config);
    });
  </source-code>
</code-listing>


> Info
> The bundle function returns a Promise for proper integration into async task engines like Gulp.

With that file in place, let's run the command below:

```shell
gulp bundle
```

Here are the things that should have happened after Gulp is finished executing the bundle task:

* A file, `dist/app-build.js` is created.
* A file, `dist/vendor-build.js` is created.
* `config.js` is updated.

Now, if we refresh/reload the app from the browser, we will see much less network traffic. This means that our app is properly bundled.

![No of requests made by bundled application](img/bundled-aurelia-application.jpg)

Just 9 requests tells the story. We have also managed to minimize the size from 1.2MB to just 773KB here.

## [Multiple Bundles](aurelia-doc://section/4/version/1.0.0)

We can create as many bundles as we want. Here we have created two: one for our application code and another for Aurelia and third-party libraries.

We can create just a single bundle, if we want, that combines both application code and third-party libraries. The number of bundles we would like to have mostly depends on our application structure and the usage patterns of our app. For example, if our app was built in a modular fashion, such that it is a collection of child-app/sections, then a `common` bundle for third-party libraries and a `bundle per section` makes much more sense and performs better than a huge single bundle that needs to be loaded up front.

## [Bundling a JSPM v0.17 App](aurelia-doc://section/5/version/1.0.0)

In a JSPM v0.17 style app, we have two separate config files: `jspm.browser.js` and `jspm.config.js`. In such case the `configPath` in the bundle config should look like: `configPath: ['./jspm.browser.js', './jspm.config.js']`. We also have to add another `injectionConfigPath` to indicate which config file should host the bundle and depCache injection. Here is a typical bundle configuration for a `JSPM v0.17` app.

<code-listing heading="bundle.js">
  <source-code lang="JavaScript">

    var config = {
      force: true,
      baseURL: '.',             // baseURL of the application
      configPath: [             // SystemJS/JSPM configuration files
        './jspm.browser.js',
        './jspm.config.js'
      ],        
      injectionConfigPath: './jspm.config.js',  // Configuration file path where bundle and depCache meta will be injected.
      bundles: {
        "dist/app-build": {     // bundle name/path. Must be within `baseURL`. Output path will look like: `baseURL/dist/app-build.js`.
          includes: [
            '[*.js]',
            '*.html!text',
            '*.css!text'        
          ],
          options: {
            inject: true,
            minify: true
          }
        }
      }
    }
  </source-code>
</code-listing>

## [Duplicate Modules in Multiple Bundles](aurelia-doc://section/6/version/1.0.0)

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

When we want to bundle `a.js`, the bundler will analyze the source code of the module and find the dependencies by tracing the `import` statements. In this case, the bundler will yield `b.js` as the dependency of `a.js` and ultimately place `b.js` in the bundle.

Let us now take a closer look at the `config` object. We will skip `force` and `packagePath` for the moment. `bundles` is where we will focus now, specifically the `includes`.

<code-listing heading="Includes">
  <source-code lang="JavaScript">
    bundles: {
      "dist/app-build": {
        includes: [
          '[*.js]',
          '*.html!text',
          '*.css!text'        
        ],
  </source-code>
</code-listing>

Please pay attention to the pattern `[*.js]`. The bundler supports some glob patterns like `*.js`, `*/**/*.js` etc. `*.js` here means, we are interested in bundling all the `js` assets in the `dist` folder (considering the `path` in `config.js`). So what does `[*.js]` mean here? Well, as we know, the bundler will trace the module dependencies from the import statements. Lot's of our code refers to the modules of `Aurelia` via `import` statements. For example:

<code-listing heading="users.js">
  <source-code lang="JavaScript">
    import {inject} from 'aurelia-framework';
    import {HttpClient} from 'aurelia-fetch-client';
    import 'fetch';

    @inject(HttpClient)
    export class Users{
      heading = 'Github Users';
      users = [];

      constructor(http){
        http.configure(config => {
          config
            .useStandardConfiguration()
            .withBaseUrl('https://api.github.com/');
        });

        this.http = http;
      }

      activate(){
        return this.http.fetch('users')
          .then(response => response.json())
          .then(users => this.users = users);
      }
    }
  </source-code>
</code-listing>

When the bundler analyzes this file it will find `aurelia-framework` and `aurelia-fetch-client` as it's dependencies and include them in the bundle. But the bundler does not stop there. It will recursively find the dependencies of `aurelia-framework` and `aurelia-fetch-client` and will go on until there is nothing left.

<code-listing heading="Includes">
  <source-code lang="JavaScript">
    bundles: {
      "dist/app-build": {
        includes: [
          '*.js',
          '*.html!text',
          '*.css!text'        
        ],
  </source-code>
</code-listing>

Having `*.js` in the above config will create a bundle containing lots of `Aurelia` libraries including `aurelia-framework` and `aurelia-fetch-client`. If we consider the second bundle config `dist/vendor-build`, we have 'aurelia-bootstrapper' and 'aurelia-fetch-client'. `aurelia-bootstrapper` will yield `aurelia-framework`. Ultimately, we will end up with duplicate modules in both the bundles.

Our goal is to create a bundle of our application code only. We have to somehow instruct the bundler not to recursively trace the dependencies. Guess what? `[*.js]` is how we do it.   

`[*.js]` will exclude the dependencies of each module that the glob pattern `*.js` yields. In the above case it will exclude `aurelia-framework`, `aurelia-fetch-client` and so on.

## [Bundle Configuration](aurelia-doc://section/7/version/1.0.0)

Here is a typical bundle configuration in all its glory:

<code-listing heading="Typical Bundle Configuration">
  <source-code lang="JavaScript">
    "dist/app-build": {
      includes: [
        '[*.js]',
        '*.html!text',
        '*.css!text',
        'bootstrap/css/bootstrap.css!text'
      ],
      excludes: [
        'npm:core-js',
        'github:jspm/nodelibs-process'
      ],
      options: {
        inject: true,
        minify: true,
        rev: true
      }
    }
  </source-code>
</code-listing>

- **dist/app-build** : This is the name of the bundle and also where the bundle file will be placed. The name of the bundle file will be `app-build.js`. As the `baseURL` for `skeleton-navigation` pointed to `dist` folder, we named it `dist/app-build`.
- **includes** : We will specify all the modules/files that we want to include here. Since all our JavaScript is in the `dist` folder and we have the `path` rule configured in `config.js` that points to the `dist` folder. If we simply specify `*` all our `js` modules will be included. We can specify `*/**/*` here if we want to include all the subfolders.
- **`*.html!text`**: This includes all the templates/views in the bundle. The `!text` tells the Bundler and Loader that these files will be bundled and loaded using the `text` plugin.   
- **`*.css!text`**: Like html templates, we are including all the css here. If you have previously used `plugin-css`, note that we are not using `!css` here. The Aurelia Loader uses `text` plugin for loading css to analyze and do other interesting things like `scoping` etc.
- **excludes**: This is where we specify what we want to exclude from the bundle. For example, `*` includes all the JS files in the `dist` folder. For example, if for some reason we want `app.js` to be excluded from the bundle, we would write:

<code-listing heading="Excludes">
  <source-code lang="JavaScript">
    excludes : [
       'app'
    ]
  </source-code>
</code-listing>

> Warning
> Exclusion of files that are being used in the project but are not part of it (e.g. CDN URLs, URLs relative to the host, etc.) is done automatically. For bundling to work, do not add them to the **excludes** section. It will cause an error.

- **inject**: If set to `true`, this will inject the bundle in `config.js`, so whenever the application needs a file within that bundle, the loader will load the entire bundle the first time. This is how we can achieve lazy bundle loading. For a large app with multiple sub sections, this will help us avoid loading everything upfront.
- **minify**: As the name suggests, if this is set to `true`, the the source files will be minified as well.
- **rev**: If this is set to `true`, an unique revision number will be appended to the bundle file name.
- **force** : If this is set to `true` the task will overwrite any existing file/bundle with the same name. Set it to false if you are not sure about it.
- **packagePath** : By default it is `'.'`, You can change this if your `package.json` file is somewhere else other than the base of your app. `aurelia-bundler` uses this file to find `config.js`, `baseURL`, the `jspm_packages` folder and other important project configuration.

## [Bundling HTML Imports](aurelia-doc://section/8/version/1.0.0)

At this point, if you are thinking: "Well, this is all good but we have already developed an application that uses Polymer and  `HTML Imports` extensively. We want to bundle them as well." As you may already know, we have created a separate plugin [aurelia-html-import-template-loader](https://github.com/aurelia/html-import-template-loader) exclusively for this use case. We have bundling support for that too. This is how we can do it. It's actually a two part process. First let's install the `aurelia-html-import-template-loader` plugin with the command below:

```shell
 jspm install aurelia-html-import-template-loader
```

Now, let's open `src/main.js` and add this line:

```javascript
aurelia.use.plugin('aurelia-html-import-template-loader')
```

After the change `main.js` should look like this:

<code-listing heading="main.js">
  <source-code lang="JavaScript">
    import 'bootstrap';

    export function configure(aurelia) {
      aurelia.use
        .standardConfiguration()
        .developmentLogging();

      aurelia.use.plugin('aurelia-html-import-template-loader')

      aurelia.start().then(a => a.setRoot());
    }
  </source-code>
</code-listing>

With this little change Aurelia Loader will now use `HTML Imports` to load all the views. Now, back in our bundle task, we will add a `config` like this:

<code-listing heading="HTML Import Config">
  <source-code lang="JavaScript">

    "dist/view-bundle": {
      htmlimports: true,
      includes: 'dist/*.html',
      options: {
        inject: {
          indexFile : 'index.html',
          destFile : 'dest_index.html'
        }
      }
    }
  </source-code>
</code-listing>

We will also change the first bundle a little bit to exclude all the `html` and `css` files. Finally our `bundle.js` file should look like this:

<code-listing heading="Full HTML Import Bundle Config">
  <source-code lang="JavaScript">

    var gulp = require('gulp');
    var bundle = require('aurelia-bundler').bundle;

    var config = {
      force: true,
      packagePath: '.',
      bundles: {
        "dist/app-build": {
          includes: [
            '[*.js]'
          ],
          options: {
            inject: true,
            minify: true
          }
        },
        "dist/aurelia": {
          includes: [
            'aurelia-bootstrapper',
            'aurelia-fetch-client',
            'aurelia-router',
            'aurelia-animator-css',
            'github:aurelia/templating-binding',
            'github:aurelia/templating-resources',
            'github:aurelia/templating-router',
            'github:aurelia/loader-default',
            'github:aurelia/history-browser',
            'github:aurelia/logging-console'
          ],
          options: {
            inject: true,
            minify: true
          }
        },
        "dist/view-bundle": {
          htmlimport: true,
          includes: 'dist/*.html',
          options: {
            inject: {
              indexFile : 'index.html',
              destFile : 'dest_index.html'
            }
          }
        }
      }
    };
  </source-code>
</code-listing>

We have changed the source code (src/main.js), so we need to rebuild our app. The command below should do that:

```shell
 gulp serve
```

> Info
> The `serve` task is already configured in such a way that it runs the `build` task first.

Now, let's run `gulp bundle` from another console/tab. If we now refresh/reload our app from the browser, keeping the developer tools open, we should see the difference.

> Warning
> The order in which the tasks are run is important. The `build` removes all the files in `dist` folder. As a result, any bundle file in that folder will be deleted too. This is why we always have to run the `gulp bundle` after the `build` task is finished. If you are using `watch` you will have to be extra careful here. Every change you make in the source file will trigger a `build` task that clears the `dist` folder and any bundles as well.

Let's examine the configuration one property at a time:

- **dist/view-bundle** : The name of the bundle file is `view-bundle.html` and will be placed in `dist` folder.
- **htmlimport** : This is what makes it different from other bundles. If this is set to `true` the bundler will treat it as a html import based bundle and Aurelia loader will give it a different treatment as well.
- **includes**: This is where we will specify what goes in the bundle. All the glob patterns are supported here including arrays of patterns and `!` based exclusion. For example:

<code-listing heading="Glob Patterns">
  <source-code lang="JavaScript">
    includes : ['dist/**/*.html', '!dist/movie/*.html']
  </source-code>
</code-listing>

The above pattern will bundle all the views in `dist` and its child folders except everything in the `dist/movie` folder.

- **options** : if `inject` is set to `true` then a `<link rel="import" href="path/of/bundle.html" >` will be injected in the body of `index.html`. If you would like to keep your `index.html` clean and create a separate index file then you have to set `indexFile` and `destFile`.

<code-listing heading="HTML Import Injection Options">
  <source-code lang="JavaScript">
    indexFile: 'index.html',
    destFile : 'dest_index.html'
  </source-code>
</code-listing>

## [Conclusion](aurelia-doc://section/9/version/1.0.0)

In this article, you've learned both the why and how of bundling. We've covered the `bundler` library, how to configure it for use with Gulp and demonstrated several different scenarios. To bundle your own app, we recommend that you begin with one of the configurations above and customize it. You may have a small app that makes sense as a single bundle or a larger one that can be broken down into features. Each application is different, but the bundler will help you to create the optimal deployment for your unique scenarios.
