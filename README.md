# aurelia-framework

This library is part of the [Aurelia](http://www.aurelia.io/) platform and contains the aurelia framework which brings together all the required core aurelia libraries into a ready-to-go application-building platform.

> To keep up to date on [Aurelia](http://www.aurelia.io/), please visit and subscribe to [the official blog](http://blog.durandal.io/). If you have questions, we invite you to join us on [our Gitter Channel](https://gitter.im/aurelia/discuss).

## Dependencies

* [aurelia-dependency-injection](https://github.com/aurelia/dependency-injection)
* [aurelia-binding](https://github.com/aurelia/binding)
* [aurelia-metadata](https://github.com/aurelia/metadata)
* [aurelia-templating](https://github.com/aurelia/templating)
* [aurelia-loader](https://github.com/aurelia/loader)
* [aurelia-task-queue](https://github.com/aurelia/task-queue)
* [aurelia-logging](https://github.com/aurelia/logging)

## Used By

* [aurelia-bootstrapper](https://github.com/aurelia/bootstrapper)

## Platform Support

This library can be used in the **browser** only.

## Building The Code

To build the code, follow these steps.

1. Ensure that [NodeJS](http://nodejs.org/) is installed. This provides the platform on which the build tooling runs.
2. From the project folder, execute the following command:

  ```shell
  npm install
  ```
3. Ensure that [Gulp](http://gulpjs.com/) is installed. If you need to install it, use the following command:

  ```shell
  npm install -g gulp
  ```
4. To build the code, you can now run:

  ```shell
  gulp build
  ```
5. You will find the compiled code in the `dist` folder, available in three module formats: AMD, CommonJS and ES6.

6. See `gulpfile.js` for other tasks related to generating the docs and linting.

## Running The Tests

To run the unit tests, first ensure that you have followed the steps above in order to install all dependencies and successfully build the library. Once you have done that, proceed with these additional steps:

1. Ensure that the [Karma](http://karma-runner.github.io/) CLI is installed. If you need to install it, use the following command:

  ```shell
  npm install -g karma-cli
  ```
2. Ensure that [jspm](http://jspm.io/) is installed. If you need to install it, use the following commnand:

  ```shell
  npm install -g jspm
  ```
3. Install the client-side dependencies with jspm:

  ```shell
  jspm install
  ```

4. You can now run the tests with this command:

  ```shell
  karma start
  ```
