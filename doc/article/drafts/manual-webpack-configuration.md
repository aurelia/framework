
## [Using Normal Webpack Configuration](aurelia-doc://section/7/version/1.0.0)

### Basic Usage

After downloading skeleton-esnext-webpack from Aurelia github, we replace any reference to `@easy-webpack` with the normal webpack modules.

In `package.json`,  remove all modules that start with `@easy-webpack` in `devDependencies`.

<code-listing heading="package.json">
  <source-code lang="JavaScript">
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
  </source-code>
</code-listing>

Then replace them with the following:

<code-listing heading="package.json">
  <source-code lang="JavaScript">
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
  </source-code>
</code-listing>

Also, change bundler (webpack) to the latest version by replacing:

```json
  "webpack": "^2.1.0-beta.22"
```
with

```json
  "webpack": "^2.1.0-beta.25"
```

### Basic Configuration

  ```js
    const path = require('path');
    const webpack = require('webpack');
    const HtmlWebpackPlugin = require('html-webpack-plugin');
    const AureliaWebpackPlugin = require('aurelia-webpack-plugin');
    const project = require('./package.json');

    module.exports = {
        entry: {
            'app': [], // <-- this array will be filled by the aurelia-webpack-plugin
            'aurelia': Object.keys(project.dependencies).filter(dep => dep.startsWith('aurelia-'))
        },
        output: {
            path: path.resolve('dist'),
            filename: '[name].bundle.js'
        },
        module: {
            rules: [
                {
                    test: /\.js$/,
                    exclude: /node_modules/,
                    loader: 'babel-loader',
                    query: {
                        presets: ['es2015', 'stage-1'],
                        plugins: ['transform-decorators-legacy']
                    }
                },
                {
                    test: /\.html$/,
                    exclude: /index\.html$/, // index.html will be taken care by HtmlWebpackPlugin
                    use: 'html-loader'
                },
                {
                    test: /\.css$/,
                    use: ['style-loader', 'css-loader']
                },
                {
                    test: /\.(png|jpe?g|gif|svg|eot|woff|woff2|ttf)$/,
                    use: 'url-loader'
                }
            ]
        },
        plugins: [
            new webpack.ProvidePlugin({
                regeneratorRuntime: 'regenerator-runtime', // to support await/async syntax
                Promise: 'bluebird', // because Edge browser has slow native Promise object
                $: 'jquery', // because 'bootstrap' by Twitter depends on this
                jQuery: 'jquery', // just an alias
            }),
            new HtmlWebpackPlugin({
                template: 'index.html'
            }),
            new AureliaWebpackPlugin({
                root: path.resolve(),
                src: path.resolve('src'),
                baseUrl: '/'
            }),
            new webpack.optimize.CommonsChunkPlugin({
                name: ['aurelia']
            })
        ]
    };
  ```

### Change `index.html`

  ```html
  <!DOCTYPE html>
  <html>
    <head>
      <title>Aurelia Navigation Skeleton</title>
      <meta name="viewport" content="width=device-width, initial-scale=1">
      <base href="/">
      <!-- imported CSS are concatenated and added automatically -->
      <meta name="apple-mobile-web-app-capable" content="yes">
      <meta name="format-detection" content="telephone=no">
    </head>
    <body aurelia-app="main">
      <div class="splash">
        <div class="message">Aurelia Navigation Skeleton</div>
        <i class="fa fa-spinner fa-spin"></i>
      </div>
      <!-- Uncomment below line for Webpack Dev Server auto reload -->
      <!--<script src="/webpack-dev-server.js"></script>-->
    </body>
  </html>
  ```

### Install Dependencies

  ```shell
  npm install
  ```

### Adjust Development Tasks

  Modify the dev task so it doesn't throw an error,
  by replacing old dev task in `package.json`
  with the slightly different version (without `--progress`)<br/>
    Replace:

    ```json
    "server:dev": "cross-env NODE_ENV=development node ./node_modules/webpack-dev-server/bin/webpack-dev-server --inline --progress --profile --watch",
    ```

    With:

    ```json
    "server:dev": "cross-env NODE_ENV=development node ./node_modules/webpack-dev-server/bin/webpack-dev-server --inline --profile --watch",
    ```

### Start development

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

    * Modify our config in `webpack.config.js` by replacing:

        ```js
        {
            test: /\.html$/,
            exclude: /index\.html$/, // index.html will be taken care by HtmlWebpackPlugin
            use: 'html-loader'
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
                    removeComments: true,               // remove all comments
                    collapseWhitespace: true,           // collapse white space between block elements (div, header, footer, p etc...)
                    collapseInlineTagWhitespace: true,  // collapse white space between inline elements (button, span, i, b, a etc...)
                    collapseBooleanAttributes: true,    // <input required="required"/> => <input required />
                    removeAttributeQuotes: true,        // <input class="abcd" /> => <input class=abcd />
                    minifyCSS: true,                    // <input style="display: inline-block; width: 50px;" /> => <input style="display:inline-block;width:50px;"/>
                    minifyJS: true,                     // same with CSS but for javascript
                    removeScriptTypeAttributes: true,   // <script type="text/javascript"> => <script>
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

3. **Javascript optimization**.

  * To deliver a smaller bundle for production. Add to your `plugins` in the configuration:

      ```js
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
      ```

  * Pass some extra configuration to our `babel-loader` to enable simpler transformation
    and tree-shaking to remove unused codes by:<br/>
    Replacing:

      ```js
      {
          test: /\.js$/,
          exclude: /node_modules/,
          loader: 'babel-loader',
          query: {
              presets: ['es2015', 'stage-1'],
              plugins: ['transform-decorators-legacy']
          }
      },
      ```

    With

      ```js
      {
          test: /\.js$/,
          exclude: /node_modules/,
          loader: 'babel-loader',
          query: {
              presets: [
                  [ 'es2015', {
                      loose: true, // this helps simplify javascript transformation
                      module: false // this helps enable tree shaking for webpack 2
                  }],
                  'stage-1'
              ],
              plugins: ['transform-decorators-legacy']
          }
      }
      ```

4. **Using plugins**
  * Plugins registry repository: [Plugins](https://github.com/aurelia/registry)
  * To bundle plugins' dependencies properly, all sub modules of a plugin have to be put in `aurelia.build.resources` in either that plugin's `package.json` or your project's `package.json`
  This is crucial but not all aurelia plugins were aware of this matter / or built before this standard configuration. If you want to use a plugin, follow these steps:

  1. Install a plugin like normal. Ex. `npm install aurelia-dialog --save`
  2. Go to your project `package.json`, look for path `"aurelia.build.resources"`, add plugin's module name (ex. "aurelia-dialog") to `resources` array
  3. Start your project to check if the plugin is properly configured
      * If webpack doesn't complain, plugin is good
      * If it does, peek to plugin source directory in `node_modules`, Ex `node_modules/aurelia-dialog`
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

    - In this plugin's `package.json`, there is no `"aurelia.build.resources"` path with value: `["aurelia-clean-bindings/clean-bindings"]`, so if you only add value `"aurelia-clean-bindings"` to your `package.json`'s
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

5. **Suggested Production Setup**

> Info
> The following configuration is for `less`. Change the style loader section accordingly to your choice of css pre-processor.

        ```js
        const path = require('path');
        const webpack = require('webpack');
        const HtmlWebpackPlugin = require('html-webpack-plugin');
        const AureliaWebpackPlugin = require('aurelia-webpack-plugin');
        const project = require('./package.json');

        const ENV = process.env.NODE_ENV && process.env.NODE_ENV.toLowerCase() || 'development';
        const DEBUG = ENV !== 'production';
        const metadata = {
            port: process.env.WEBPACK_PORT || 9000,
            host: process.env.WEBPACK_HOST || 'localhost',
            ENV: ENV,
            HMR: process.argv.join('').indexOf('hot') >= 0 || !!process.env.WEBPACK_HMR
        };
        const outDir = path.resolve('dist');

        const aureliaModules = [
            'aurelia-bootstrapper-webpack',
            'aurelia-binding',
            'aurelia-dependency-injection',
            'aurelia-event-aggregator',
            'aurelia-framework',
            'aurelia-history',
            'aurelia-history-browser',
            'aurelia-loader',
            'aurelia-loader-webpack',
            'aurelia-logging',
            'aurelia-logging-console',
            'aurelia-metadata',
            'aurelia-pal',
            'aurelia-pal-browser',
            'aurelia-path',
            'aurelia-polyfills',
            'aurelia-route-recognizer',
            'aurelia-router',
            'aurelia-task-queue',
            'aurelia-templating',
            'aurelia-templating-binding',
            'aurelia-templating-router',
            'aurelia-templating-resources'
        ];

        module.exports = {
            entry: {
                app: ['./src/main'], // <-- this array will be filled by the aurelia-webpack-plugin
                aurelia: aureliaModules
            },
            output: {
                path: outDir,
                filename: DEBUG ? '[name].bundle.js' : '[name].[chunkhash].bundle.js',
                sourceMapFilename: DEBUG ? '[name].bundle.map' : '[name].[chunkhash].bundle.map',
                chunkFilename: DEBUG ? '[id].chunk.js' : '[id].[chunkhash].chunk.js'
            },
            resolve: {
                modules: [path.resolve(), 'node_modules']
            },
            module: {
                rules: [
                    {
                        test: /\.js$/,
                        exclude: /node_modules/, // or include: path.resolve('src'),
                        loader: 'babel-loader',
                        query: {
                            presets: [
                                [ 'es2015', {
                                    loose: true, // this helps simplify javascript transformation
                                    module: false // this helps enable tree shaking for webpack 2
                                }],
                                'stage-1'
                            ],
                            plugins: ['transform-decorators-legacy']
                        }
                    },
                    {
                        test: /\.html$/,
                        exclude: /index\.html$/, // index.html will be taken care by HtmlWebpackPlugin
                        use: [
                            'raw-loader',
                            'html-minifier-loader'
                        ]
                    },
                    {
                        test: /\.(less|css)$/, // <--- This was /\.css$/ for only css
                        use: [
                            {
                                loader: 'style-loader',
                                query: {
                                    singleton: !DEBUG
                                }
                            },
                            {
                                loader: 'css-loader',
                                query: {
                                    minimize: !DEBUG // <--- Enable style minification if production
                                }
                            },
                            'less-loader' // <--- This was added to enable "import 'style.less'"
                        ]
                    },
                    {
                        test: /\.(png|jpe?g|gif|svg|eot|woff|woff2|ttf)$/,
                        loader: 'url-loader',
                        query: {
                            limit: 10000,
                            name: '[name].[ext]'
                        }
                    }
                ]
            },
            plugins: [
                new webpack.LoaderOptionsPlugin({
                    debug: DEBUG,
                    devtool: 'source-map',
                    options: {
                        context: __dirname,
                        'html-minifier-loader': {
                            removeComments: true,               // remove all comments
                            collapseWhitespace: true,           // collapse white space between block elements (div, header, footer, p etc...)
                            collapseInlineTagWhitespace: true,  // collapse white space between inline elements (button, span, i, b, a etc...)
                            collapseBooleanAttributes: true,    // <input required="required"/> => <input required />
                            removeAttributeQuotes: true,        // <input class="abcd" /> => <input class=abcd />
                            minifyCSS: true,                    // <input style="display: inline-block; width: 50px;" /> => <input style="display:inline-block;width:50px;"/>
                            minifyJS: true,                     // same with CSS but for javascript
                            removeScriptTypeAttributes: true,   // <script type="text/javascript"> => <script>
                            removeStyleLinkTypeAttributes: true // <link type="text/css" /> => <link />
                        }
                    }
                }),
                new webpack.ProvidePlugin({
                    regeneratorRuntime: 'regenerator-runtime', // to support await/async syntax
                    Promise: 'bluebird', // because Edge browser has slow native Promise object
                    jQuery: 'jquery', // because 'bootstrap' by Twitter depends on jQuery
                    $: 'jquery' // just an alias
                }),
                new AureliaWebpackPlugin({
                    root: path.resolve(),
                    src: path.resolve('src')
                }),
                new HtmlWebpackPlugin({
                    template: 'index.html',
                    inject: 'head'
                }),
                new webpack.optimize.CommonsChunkPlugin({ // to eliminate code duplication across bundles
                    name: ['aurelia']
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

                new webpack.optimize.UglifyJsPlugin({
                    mangle: { screw_ie8: true, keep_fnames: true },
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
            ]),
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
            }
        };
        ```
