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
* [aurelia-event-aggregator](https://github.com/aurelia/event-aggregator)
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
3. To build the code, you can now run:

  ```shell
  npm run build
  ```
4. You will find the compiled code in the `dist` folder, available in three module formats: AMD, CommonJS and ES6.

5. See `gulpfile.js` for other tasks related to generating the docs and linting.

## Running The Tests

To run the unit tests, first ensure that you have followed the steps above in order to install all dependencies and successfully build the library. Once you have done that, proceed with this additional step:

1. You can now run the tests with this command:

  ```shell
  npm test
  ```
  
## Contributing

We'd love for you to contribute to our source code and to make this project even better than it is today! If this interests you, please begin by reading [our contributing guidelines](https://github.com/DurandalProject/about/blob/master/CONTRIBUTING.md). The contributing document will provide you with all the information you need to get started. Once you have read that, you will need to also [sign our CLA](http://goo.gl/forms/dI8QDDSyKR) before we can accepts a Pull Request from you. More information on the process is including in the [contributor's guide](https://github.com/DurandalProject/about/blob/master/CONTRIBUTING.md).