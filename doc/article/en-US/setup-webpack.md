---
{
  "name": "Setup with Webpack",
  "culture": "en-US",
  "description": "If you're interested in getting setup with Webpack to build projects, this article will take you through setting up both your machine and a production quality starter project.",
  "engines" : { "aurelia-doc" : "^1.0.0" },
  "author": {
  	"name": "Bazyli Brzóska",
  	"url": "https://invent.life"
  },
  "contributors": [],
  "translators": [],
  "keywords": ["JavaScript", "TypeScript", "SPA", "Setup", "Webpack"]
}
---
## [Configuring Your Environment](aurelia-doc://section/1/version/1.0.0)

Let's start by getting you set up with a great set of tools that you can use to build modern ${context.language.name} applications. All our tooling is built on [Node.js](http://nodejs.org/). If you have that installed already, great! If not, you should go to [the official web site](http://nodejs.org/), download and install it. Everything else we need will be installed via Node's package manager ([npm](https://docs.npmjs.com/getting-started/what-is-npm)). If you already have npm installed, make sure you've got the [latest version](https://github.com/npm/npm/wiki/Troubleshooting#try-the-latest-stable-version-of-node) to avoid any issues with the other tools.

> Info
> For command-line operations, we recommend Windows users to use Git Bash or Git Shell.

## [Setting up the Project Structure and Build](aurelia-doc://section/2/version/1.0.0)

We'll begin by downloading a skeleton. We've got several versions available for you based on your language and tooling preferences. Please download the latest skeletons now.

<div style="text-align: center;">
  <a class="au-button" href="https://github.com/aurelia/skeleton-navigation/releases/latest" style="text-decoration: none; margin: 32px 8px 42px 8px;" target="_blank">Download the Skeletons</a>
</div>

Once the download has completed, unzip it and look inside. The readme file contained therein will explain the various options available to you. Please select one of the skeletons and copy it to the location on your file system that you wish your code to reside. Be sure to rename the folder to appropriately represent the app you want to build.

You will now find everything you need inside the folder, including a basic build, package configuration, styles and more. With all this in place, let's run some commands.

1. Open a console and change directory into your app's directory.
2. Execute the following command to install the dependencies listed in the _dependencies_ and _devDependencies_ sections of the package manifest:
  ```shell
  npm install
  ```
Everything we've done so far is standard Node.js build and package management procedures. It doesn't have anything specific to do with Aurelia itself. We're just walking you through setting up a modern ${context.language.name} project and build configuration from scratch.

> Info
> Bootstrap and Font-Awesome are **not** dependencies of Aurelia. We only leverage them as part of the starter kit in order to help you quickly achieve a decent look out-of-the-box. You can easily replace them with whatever your favorite CSS framework and/or icon library is.
> Similarly, Bluebird is recommended, but not required. Note however that the `Promise` implementation in certain Microsoft Edge versions are extremely slow, thus keeping an alternative `Promise` implementation is recommended.

## [Running The App](aurelia-doc://section/3/version/1.0.0)

If you've followed along this far, you now have all the libraries, build configuration and tools you need to create amazing ${context.language.name} apps with Aurelia. The next thing to do is run the sample app. To see this in action, on your console, use the following command to build and launch the server:
```shell
npm start
```
You can now browse to [http://localhost:9000/](http://localhost:9000/) to see the app.

> Info
> The Skeleton App uses Webpack's Development Server for automated page refreshes on code/markup changes, meaning you do not need to restart the command every time you make a change.

## [Running The Unit Tests](aurelia-doc://section/4/version/1.0.0)

To run the unit tests, first ensure that you have followed the steps above in order to install all dependencies and successfully build the library. Once you have done that, you may run the tests with the following command:

```shell
npm test
```

## [Running The E2E Tests](aurelia-doc://section/5/version/1.0.0)

Integration tests are performed with [Protractor](http://angular.github.io/protractor/#/).

1. Place your E2E-Tests into the folder ```test/e2e/src```

2. Run the tests by invoking
  ```shell
  npm run e2e
  ```

## [Running E2E Tests Manually](aurelia-doc://section/6/version/1.0.0)

1. Make sure your app runs and is accessible:
  ```shell
  WEBPACK_PORT=19876 npm start
  ```

2. Once bundle is ready, run the E2E-Tests in another console:
  
  ```shell
  npm run e2e:start
  ```

## [Using Standard Webpack Configuration](aurelia-doc://section/7/version/1.0.0)

#### 1. Basic Usage

1. Dependencies
    * After downloading skeleton-esnext-webpack from Aurelia github,
    we replace any reference to `@easy-webpack` with the normal webpack modules.<br/>
    In `package.json`,  remove all modules that start with `@easy-webpack` in `devDependencies`:<br/><br/>

    ```json
      "@easy-webpack/config-aurelia": "^2.0.1",
      "@easy-webpack/config-babel": "^2.0.2",
      "@easy-webpack/config-common-chunks-simple": "^2.0.1",
      "@easy-webpack/config-copy-files": "^1.0.0",
      "@easy-webpack/config-css": "^2.3.2",
      "@easy-webpack/config-env-development": "^2.1.1",
      "@easy-webpack/config-env-production": "^2.1.0",
      "@easy-webpack/config-external-source-maps": "^2.0.1",
      "@easy-webpack/config-fonts-and-images": "^1.2.1",
      "@easy-webpack/config-generate-index-html": "^2.0.1",
      "@easy-webpack/config-global-bluebird": "^1.2.0",
      "@easy-webpack/config-global-jquery": "^1.2.0",
      "@easy-webpack/config-global-regenerator": "^1.2.0",
      "@easy-webpack/config-html": "^2.0.2",
      "@easy-webpack/config-json": "^2.0.2",
      "@easy-webpack/config-test-coverage-istanbul": "^2.0.2",
      "@easy-webpack/config-uglify": "^2.1.0",
      "@easy-webpack/core": "^1.3.2",
    ```

    with the following:

    ```json
      "aurelia-webpack-plugin": "^1.1.0",
      "copy-webpack-plugin": "^3.0.1",
      "html-webpack-plugin": "^2.22.0",
      "babel-core": "^6.17.0",
      "babel-loader": "^6.2.5",
      "babel-polyfill": "^6.16.0",
      "css-loader": "^0.25.0",
      "file-loader": "^0.9.0",
      "sourcemap-istanbul-instrumenter-loader": "^0.2.0",
      "style-loader": "^0.13.1",
      "url-loader": "^0.5.7",
      "html-loader": "^0.4.4"
    ```

    Also, change bundler (webpack) to the latest version by replacing:
    ```json
      "webpack": "^2.1.0-beta.22"
    ```
    with

    ```json
      "webpack": "^2.1.0-beta.25"
    ```

2. Configuration

  ```js
    const path = require('path');
    const webpack = require('webpack');
    const HtmlWebpackPlugin = require('html-webpack-plugin');
    const CopyWebpackPlugin = require('copy-webpack-plugin');
    const AureliaWebpackPlugin = require('aurelia-webpack-plugin'); 
    const project = require('./package.json');

    const ENV = process.env.NODE_ENV && process.env.NODE_ENV.toLowerCase() || 'development';
    const DEBUG = ENV !== 'production';
    const title = 'Aurelia Navigation Skeleton';
    const baseUrl = '/';
    const rootDir = path.resolve();
    const srcDir = path.resolve('src');
    const outDir = path.resolve('dist');

    const aureliaBootstrap = [
        'aurelia-bootstrapper-webpack',
        'aurelia-polyfills',
        'aurelia-pal-browser',
        'regenerator-runtime'
    ];

    const aureliaModules = Object.keys(project.dependencies).filter(dep => dep.startsWith('aurelia-'));
    const metadata = {
        port: process.env.WEBPACK_PORT || 9000,
        host: process.env.WEBPACK_HOST || 'localhost',
        ENV: ENV,
        HMR: process.argv.join('').indexOf('hot') >= 0 || !!process.env.WEBPACK_HMR
    };

    module.exports = {
        entry: {
            'app': [], // <-- this array will be filled by the aurelia-webpack-plugin
            'aurelia-bootstrap': aureliaBootstrap,
            'aurelia': aureliaModules.filter(pkg => aureliaBootstrap.indexOf(pkg) === -1)
        },
        output: {
            path: outDir,
            filename: DEBUG ? '[name].bundle.js' : '[name].[chunkhash].bundle.js',
            sourceMapFilename: DEBUG ? '[name].bundle.map' : '[name].[chunkhash].bundle.map',

            /** The filename of non-entry chunks as relative path
            * inside the output.path directory.
            *
            * See: http://webpack.github.io/docs/configuration.html#output-chunkfilename
            */
            chunkFilename: DEBUG ? '[id].chunk.js' : '[id].[chunkhash].chunk.js'
        },
        resolve: {
            modules: [
                srcDir, // This enables simple import path for our module in deep tree
                'node_modules', 
                // 'bower_components' // <--- Uncomment this line to enable simpler import path for bower components
            ]
        },
        module: {
            rules: [
                {
                    test: /\.js$/,
                    exclude: /node_modules/, // include: path.resolve('src'),
                    use: {
                        loader: 'babel-loader',
                        query: {
                            presets: [
                                [ 'es2015', {
                                    loose: true, // this helps simplify ESnext transformation
                                    module: false // this helps enable tree shaking for webpack 2
                                }],
                                'stage-1'
                            ],
                            plugins: ['transform-decorators-legacy']
                        }
                    }
                },
                {
                    test: /\.html$/,
                    exclude: /index\.html$/, // index.html will be taken care by HtmlWebpackPlugin
                    use: 'html-loader'
                },
                {
                    test: /\.css$/, 
                    use: [
                        {
                            loader: 'style-loader',
                            options: {
                                singleton: true
                            }
                        },
                        'css-loader'
                    ]
                },
                {
                    test: /\.(png|jpe?g|gif|svg|eot|woff|woff2|ttf)$/,
                    use: {
                        loader: 'url-loader',
                        query: {
                            limit: 10000,
                            name: '[name].[ext]'
                        }
                    }
                }
            ]
        },
        devServer: {
            port: metadata.port,
            host: metadata.host,
            historyApiFallback: true,
            watchOptions: {
                aggregateTimeout: 300,
                poll: 1000
            },
            progress: true,
            outputPath: outDir
        },
        plugins: [
            new webpack.ProvidePlugin({
                regeneratorRuntime: 'regenerator-runtime', // to support await/async syntax
                Promise: 'bluebird', // because Edge browser has slow native Promise object
                $: 'jquery', // because 'bootstrap' by Twitter depends on this
                jQuery: 'jquery', // just an alias
                'window.jQuery': 'jquery' // this doesn't expose jQuery property for window, but exposes it to every module
            }),
            new HtmlWebpackPlugin({
                inject: 'head', // this helps put all scripts into document head to avoid flash of unstyled content (FOUC) when app starts 
                title: title,
                template: 'index.html',
                chunksSortMode: 'dependency'
            }),
            new AureliaWebpackPlugin({
                root: rootDir,
                src: srcDir,
                title: title,
                baseUrl: baseUrl
            }),
            new CopyWebpackPlugin([{
                from: 'favicon.ico',
                to: 'favicon.ico'
            }]),
            new webpack.optimize.CommonsChunkPlugin({
                name: ['aurelia', 'aurelia-bootstrap']
            }),
            new webpack.DefinePlugin({
                '__DEV__': true,
                'ENV': metadata.ENV,
                'HMR': metadata.HMR,
                'process.env': {
                    'ENV': metadata.ENV,
                    'NODE_ENV': metadata.ENV,
                    'HMR': metadata.HMR,
                    'WEBPACK_HOST': metadata.host,
                    'WEBPACK_PORT': metadata.port
                }
            })
        ].concat(DEBUG ? [

        ] : [
            /**
            * Plugin: DedupePlugin
            * Description: Prevents the inclusion of duplicate code into your bundle
            * and instead applies a copy of the function at runtime.
            *
            * See: https://webpack.github.io/docs/list-of-plugins.html#defineplugin
            * See: https://github.com/webpack/docs/wiki/optimization#deduplication
            */
            new webpack.optimize.DedupePlugin(),
            /**
            * Plugin: Uglifyjs
            */
            new webpack.optimize.UglifyJsPlugin({
                mangle: { screw_ie8: true, keep_fnames: true},
                dead_code: true,
                unused: true,
                comments: true,
                compress: {
                    screw_ie8: true,
                    keep_fnames: true,
                    drop_debugger: false,
                    dead_code: false,
                    unused: false,
                    warnings: false
                }
            })
        ])
    };
  ```

3. Change `index.html` to

  ```html
  <!DOCTYPE html>
  <html>
    <head>
      <title><%- htmlWebpackPlugin.options.title %></title>
      <meta name="viewport" content="width=device-width, initial-scale=1">
      <base href="<%- htmlWebpackPlugin.options.baseUrl %>">
      <!-- imported CSS are concatenated and added automatically -->
      <meta name="apple-mobile-web-app-capable" content="yes">
      <meta name="format-detection" content="telephone=no">
    </head>
    <body aurelia-app="main">
      <div class="splash">
        <div class="message"><%- htmlWebpackPlugin.options.title %></div>
        <i class="fa fa-spinner fa-spin"></i>
      </div>
      <% if (process.env.ENV === 'development') { %>
      <!-- Webpack Dev Server reload -->
      <script src="/webpack-dev-server.js"></script>
      <% } %>
    </body>
  </html>
  ```

4. Install dependencies

  ```shell
  npm install
  ```

5. Adjust development tasks<br/>
  Modify the dev task so it doesn't throw an error,
  by replacing old dev task in `package.json` 
  with the slightly different version (without `--progress`)<br/>
    Replace:

    ```json
    "server:dev": "cross-env NODE_ENV=development node ./node_modules/webpack-dev-server/bin/webpack-dev-server --inline --progress --profile --watch",
    "server:dev2": "cross-env NODE_ENV=development node ./node_modules/webpack-dev-server/bin/webpack-dev-server --inline --progress --profile --watch",
    ```

    With:

    ```json
    "server:dev": "cross-env NODE_ENV=development node ./node_modules/webpack-dev-server/bin/webpack-dev-server --inline --profile --watch",
    "server:dev2": "cross-env NODE_ENV=development node ./node_modules/webpack-dev-server/bin/webpack-dev-server --inline --profile --watch",
    ```

6. Start development

  ```shell
  npm start
  ```

#### 2. Advanced Usage

1. **Template optimization**
    * Additional dependencies for handling template,
    as Aurelia templates need to be optimized to reduce bundle size:
      ```json
      "raw-loader": "^0.5.1",
      "html-minifier": "^3.1.0",
      "html-minifier-loader": "^1.3.3",
      ```
    * **IMPORTANT**: Start from `webpack@2.1.0-beta.23` (current version: `@beta.25`), custom properties are no longer allowed
  on base config object, So we will be using `webpack.LoaderOptionsPlugin` to provide
  some config options for `html-minifier-loader`.

    * Modify our config in `webpack.config.js`<br/>
      Replace:

      ```js
      {
          test: /\.html$/,
          exclude: /index\.html$/, // index.html will be taken care by HtmlWebpackPlugin
          use: [
              'raw-loader',
              'html-minifier-loader'
          ]
      }
      ```

      With:

      ```js
      {
          test: /\.html$/,
          exclude: /index\.html$/, // index.html will be taken care by HtmlWebpackPlugin
          use: [
              'raw-loader',
              'html-minifier-loader'
          ]
      }
      ```

      Also add to `plugins` config:

      ```js
      new webpack.LoaderOptionsPlugin({
          options: {
              context: __dirname,
              'html-minifier-loader': {
                  removeComments: true, // remove all comments
                  collapseWhitespace: true, // collapse white space between block elements (div, header, footer, p etc...)
                  collapseInlineTagWhitespace: true, // collapse white space between inline elements (button, span, i, b, a etc...)
                  collapseBooleanAttributes: true, // <input required="required"/> => <input required />
                  removeAttributeQuotes: true, // <input class="abcd" /> => <input class=abcd />
                  minifyCSS: true, // <input style="display: inline-block; width: 50px;" /> => <input style="display:inline-block;width:50px;"/>
                  minifyJS: true, // same with CSS but for javascript
                  removeScriptTypeAttributes: true, // <script type="text/javascript"> => <script>
                  removeStyleLinkTypeAttributes: true // <link type="text/css" /> => <link />
              }
          }
      })
      ```

2. **Using CSS pre-processor**: `less`, `sass` and `stylus`
  * **IMPORTANT**: You can't require style with different extension than `css` like this:
    ```html
    <!-- invalid require -->
    <require from='./style.less'></require>
    ```

    So we have to require our style (`less`, `sass` or `styl`) in our javascript like this:
    ```js
    import './style.less'; 
    ```
    
  * Based on the choice of pre-processor, use corresponding dependencies:

      * `less`:
      ```shell
      npm install --save-dev less less-loader
      ```
      * `sass`:
      ```shell
      npm install --save-dev node-sass sass-loader
      ```
      * `styl`:
      ```json
      npm install --save-dev stylus stylus-loader 
      ```
  
  * Modify style loading rule by adding chosen loader and file extension, it should look like this for `less`:

    ```js
    {
        test: /\.(less|css)$/, // <--- This was /\.css$/ for only css
        use: [
            {
                loader: 'style-loader',
                options: {
                    singleton: true
                }
            },
            'css-loader',
            'less-loader' // <--- This was added to enable "import 'style.less'"
        ]
    },
    ```

3. **Using plugins**
  * Plugins registry repository: [Plugins](https://github.com/aurelia/registry)
  * To bundle plugins' dependencies properly, all sub modules of a plugin has to be put in `aurelia.build.resources` in either that plugin's `package.json` or your project's `packag.json`
  This is crucial but not all aurelia plugins were aware of this matters / or built before this standard configuration. If you want to use a plugin, follow these steps:

  1. Install a plugin like normal. Ex. `npm install aurelia-dialog --save`
  2. Go to your project `package.json`, look for path `"aurelia.build.resources"`, add plugin's module name (ex. "aurelia-dialog") to `resources` array
  3. Start your project to check if the plugin is properly configured
      * If webpack doesn't complain anything, plugin is good
      * If not, peek to plugin source directory in `node_modules`, Ex `node_modules/aurelia-dialog`
        - Have a look at `package.json` to see if `"main"` points to the right file. (As the time of this writing, plugin `"aurelia-async"` pointed to the wrong entry filename)
        - Have a look at `dist/commonjs` folder (all aurelia plugins are built in this standard)
        - Put all the module names (if any), without extension into your project `package.json` `"aurelia.build.resources"`, with plugin name as prefix (ex. `"aurelia-dialog"`)
        - Rerun `npm start`

  * A good example of how to know if a plugin has proper configs is to look into `aurelia-dialog`'s `package.json` -> `aurelia.build.resources`
  * Example for `"aurelia-clean-bindings"` plugin:
    - This plugin doesn't have sub modules dependencies configured properly, as it is distributed with following module structure:
      
      ```
      dist
      └───commonjs
      │   │   clean-bindings.js
      │   │   index.js
      ```
    
    - In `package.json`, there is no `"aurelia.build.resources"` path with value: `["aurelia-clean-bindings/clean-bindings"]`, so if you only add value `"aurelia-clean-bindings"` to your `package.json`'s
    `"aurelia.build.resources"` value: `"aurelia-clean-bindings"`, it won't work

    - Fix:
      - Add to your `package.json` path `"aurelia.build.resources"` value: `["aurelia-clean-bindings", "aurelia-clean-bindings/clean-bindings"]`
      - It should look like this in your `package.json`:
      ```json
      "aurelia": {
          "build": {
              "resources": [
                  "aurelia-other-plugin...",
                  [ "aurelia-clean-bindings", "aurelia-clean-bindings/clean-bindings" ],
                  "aurelia-other-plugin..."
              ]
          }
      }
      ```
      - Create an issue to inform plugin author
      - Happy adding plugins
