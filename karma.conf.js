// Karma configuration
// Generated on Fri Dec 05 2014 16:49:29 GMT-0500 (EST)

/**
 * @param {import('karma').Config} config
 */
module.exports = function(config) {
  config.set({

    // base path that will be used to resolve all patterns (eg. files, exclude)
    basePath: '',


    // frameworks to use
    // available frameworks: https://npmjs.org/browse/keyword/karma-adapter
    frameworks: ['jasmine', 'karma-typescript'],

    files: [
      'src/**/*.ts',
      'test/**/*.ts'
    ],

    plugins: [
      'karma-jasmine',
      'karma-typescript',
      'karma-coverage',
      'karma-chrome-launcher'
    ],

    // list of files to exclude
    exclude: [
    ],
    // preprocess matching files before serving them to the browser
    // available preprocessors: https://npmjs.org/browse/keyword/karma-preprocessor
    preprocessors: {
      // 'test/**/*.js': ['babel'],
      // 'src/**/*.js': ['babel'],
      '**/*.ts': ['karma-typescript']
    },
    // 'babelPreprocessor': {
    //   options: {
    //     sourceMap: 'inline',
    //     presets: [ 'es2015-loose', 'stage-1'],
    //     plugins: [
    //       'syntax-flow',
    //       'transform-decorators-legacy',
    //       'transform-flow-strip-types'
    //     ]
    //   }
    // },
    karmaTypescriptConfig: (() => {
      /**@type {import('karma-typescript').KarmaTypescriptConfig} */
      const options = {
        bundlerOptions: {
          entrypoints: /\.spec\.ts$/
        },
        compilerOptions: {
          emitDecoratorMetadata: true,
          experimentalDecorators: true,
          module: 'commonjs',
          sourceMap: true,
          target: 'ES2015',
          lib: ['es2015', 'dom']
        },
        exclude: ['dist', 'node_modules']
      };
      return options;
    })(),

    reporters: ['progress', 'karma-typescript'],


    // web server port
    port: 9876,


    // enable / disable colors in the output (reporters and logs)
    colors: true,


    // level of logging
    // possible values: config.LOG_DISABLE || config.LOG_ERROR || config.LOG_WARN || config.LOG_INFO || config.LOG_DEBUG
    logLevel: config.LOG_ERROR,


    // enable / disable watching file and executing tests whenever any file changes
    autoWatch: true,


    // start these browsers
    // available browser launchers: https://npmjs.org/browse/keyword/karma-launcher
    browsers: ['ChromeHeadless'],


    // Continuous Integration mode
    // if true, Karma captures browsers, runs the tests and exits
    singleRun: false
  });
};
