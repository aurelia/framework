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

1. After downloading skeleton-esnext-webpack from Aurelia github,
  we need to replace any reference to @easy-webpack with the standard webpack modules.<br/>In `package.json`, remove all modules that start with `@easy-webpack` in `devDependencies`:
  
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
    "html-loader": "^0.4.4",
    "sourcemap-istanbul-instrumenter-loader": "^0.2.0",
    "style-loader": "^0.13.1",
    "url-loader": "^0.5.7",
  ```

2. Then use the following config:

  * **IMPORTANT**: the following config is for `webpack@2.1.0.beta-23+` (current: `@beta-25`), as from this version, schema validation will be enforced
  and custom properties on config object are no longer allowed. So we will be using `webpack.LoaderOptionsPlugin` to provide
  some configs for `html-minifier-loader`. If you want to keep using the prefdefined webpack
  version in the skeleton, move all properties inside `webpack.LoaderOptionsPlugin` instance to export object

  ```js
    const hasProcessFlag = flag => process.argv.join('').indexOf(flag) > -1;
    const path = require('path');
    const webpack = require('webpack');
    const HtmlWebpackPlugin = require('html-webpack-plugin');
    const CopyWebpackPlugin = require('copy-webpack-plugin');
    const AureliaWebpackPlugin = require('aurelia-webpack-plugin');
    const WebpackMd5Hash = require('webpack-md5-hash');
    const ExtractTextPlugin = require('extract-text-webpack-plugin');
    // const cssnano = require('cssnano'); <---- uncomment this line if you want to use cssnano for postcss 
    const project = require('./package.json');

    const ENV = process.env.NODE_ENV && process.env.NODE_ENV.toLowerCase() || 'development';
    const DEBUG = ENV !== 'production';
    const title = 'Aurelia Webpack Skeleton';
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
        HMR: hasProcessFlag('hot') || !!process.env.WEBPACK_HMR
    };

    module.exports = {
        entry: {
            'app': [], // <-- this array will be filled by the aurelia-webpack-plugin
            'aurelia-bootstrap': aureliaBootstrap,
            'aurelia': aureliaModules.filter(pkg => aureliaBootstrap.indexOf(pkg) === -1)
        },
        output: {
            path: outDir,
            /**
            * Specifies the name of each output file on disk.
            * IMPORTANT: You must not specify an absolute path here!
            *
            * See: http://webpack.github.io/docs/configuration.html#output-filename
            */
            filename: DEBUG ? '[name].bundle.js' : '[name].[chunkhash].bundle.js',

            /**
            * The filename of the SourceMaps for the JavaScript files.
            * They are inside the output.path directory.
            *
            * See: http://webpack.github.io/docs/configuration.html#output-sourcemapfilename
            */
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
                srcDir,
                'node_modules',
                // 'bower_components' // <--- Uncomment this line to enable simpler import path
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
                }, {
                    test: /\.html$/,
                    exclude: /index\.html$/, // index.html will be taken care by HtmlWebpackPlugin
                    use: [
                        'raw-loader',
                        'html-minifier-loader'
                    ]
                }, {
                    test: /\.css$/, // /\.(less|styl|sass|css)$/, <--- Use it to enable less, stylus or sass 
                    use: [
                        {
                            loader: 'style-loader',
                            options: {
                                singleton: true
                            }
                        },
                        /**
                         * For development, using css-loader would be enough
                         */
                        DEBUG ? 'css-loader' : ExtractTextPlugin.extract(`css?${JSON.stringify({
                            // sourceMap: DEBUG,
                            // url: false,
                            minimize: !DEBUG
                        })}`),
                        // 'postcss-loader',
                        // 'less-loader',
                        // 'sass-loader',
                        // 'styl-loader'
                    ]
                }, {
                    test: /\.(png|jpe?g|gif|svg|eot|woff|woff2|ttf)(\?\S*)?$/,
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
            new webpack.LoaderOptionsPlugin({
                metadata,
                debug: DEBUG,
                devtool: 'source-map',
                options: {
                    context: __dirname,
                    /**
                     * Enable the following config for postcss
                     */
                    // postcss: (wpack) => [
                    //     cssnano({
                    //         discardComments: { removeAll: true },
                    //         autoprefixer: true,
                    //         colormin: true,
                    //         convertValues: true,
                    //         core: true,
                    //         discardDuplicates: true,
                    //         discardEmpty: true,
                    //         functionOptimiser: true,
                    //         minifyGradients: true
                    //     })
                    // ],
                    'html-minifier-loader': {
                        removeComments: true,
                        collapseWhitespace: true,
                        collapseInlineTagWhitespace: true,
                        collapseBooleanAttributes: true,
                        removeAttributeQuotes: true,
                        minifyCSS: true,
                        minifyJS: true,
                        removeScriptTypeAttributes: true,
                        removeStyleLinkTypeAttributes: true
                    }
                }
            }),
            // Extract all css into 1 file
            new ExtractTextPlugin({
                filename: 'style.min.css',
                allChunks: true
            }),
            new webpack.ProvidePlugin({
                regeneratorRuntime: 'regenerator-runtime', // to support await/async syntax
                Promise: 'bluebird', // because Edge browser has slow native Promise object
                $: 'jquery', // because 'bootstrap' by Twitter depends on this
                jQuery: 'jquery', // just an alias
                'window.jQuery': 'jquery' // this doesn't expose jQuery property for window, but exposes it to every module
            }),
            new HtmlWebpackPlugin({
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
                'ENV': JSON.stringify(metadata.ENV),
                'HMR': metadata.HMR,
                'process.env': {
                    'ENV': JSON.stringify(metadata.ENV),
                    'NODE_ENV': JSON.stringify(metadata.ENV),
                    'HMR': metadata.HMR,
                    'WEBPACK_HOST': JSON.stringify(metadata.host),
                    'WEBPACK_PORT': JSON.stringify(metadata.port)
                }
            })
        ].concat(DEBUG ? [

        ] : [
            /**
            * Plugin: WebpackMd5Hash
            * Description: Plugin to replace a standard webpack chunkhash with md5.
            *
            * See: https://www.npmjs.com/package/webpack-md5-hash
            */
            new WebpackMd5Hash(),
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

3. Our `index.html` needs to be adjusted a bit:

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

4. Change the bundler to latest version:

  ```shell
    npm install webpack@2.1.0-beta.25 --save-dev
  ```

5. Change development server - `webpack-dev-server` to latest version

  ```shell
    npm install webpack-dev-server@2.1.0-beta.0 --save-dev
  ```

6. Install dependencies

  ```shell
    npm install
  ```

7. Modify the dev task so it doesn't throw an error, by replacing old dev task in `package.json` 
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

8. Reminder for `less`, `sass` and `stylus`
  
  * **Example** for `less`:
  * Install the loader based on your choice

  ```shell
    npm install less-loader --save-dev
  ```

  * import them in javascript instead of your html template
  
  ```js
    import 'style.less';
  ``` 
  
  * Uncomment corresponding loader in these lines:
  ```js
    // 'postcss-loader', <!--- Uncomment this line if you wish to use postcss
    // 'less-loader', <--- uncomment this line
    // 'sass-loader',
    // 'styl-loader'
  ```

9. Start development

  ```shell
    npm start
  ```
