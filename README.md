# aurelia-framework

[![npm Version](https://img.shields.io/npm/v/aurelia-framework.svg)](https://www.npmjs.com/package/aurelia-framework)
[![ZenHub](https://raw.githubusercontent.com/ZenHubIO/support/master/zenhub-badge.png)](https://zenhub.io)
[![Join the chat at https://gitter.im/aurelia/discuss](https://badges.gitter.im/Join%20Chat.svg)](https://gitter.im/aurelia/discuss?utm_source=badge&utm_medium=badge&utm_campaign=pr-badge&utm_content=badge)
[![CircleCI](https://circleci.com/gh/aurelia/framework.svg?style=shield)](https://circleci.com/gh/aurelia/framework)
[![Backers on Open Collective](https://opencollective.com/aurelia/backers/badge.svg)](#backers) [![Sponsors on Open Collective](https://opencollective.com/aurelia/sponsors/badge.svg)](#sponsors) 

This library is part of the [Aurelia](http://www.aurelia.io/) platform and contains the aurelia framework which brings together all the required core aurelia libraries into a ready-to-go application-building platform.

> To keep up to date on [Aurelia](http://www.aurelia.io/), please visit and subscribe to [the official blog](http://blog.aurelia.io/) and [our email list](http://eepurl.com/ces50j). We also invite you to [follow us on twitter](https://twitter.com/aureliaeffect). If you have questions look around our [Discourse forums](https://discourse.aurelia.io/), chat in our [community on Gitter](https://gitter.im/aurelia/discuss) or use [stack overflow](http://stackoverflow.com/search?q=aurelia). Documentation can be found [in our developer hub](http://aurelia.io/docs). If you would like to have deeper insight into our development process, please install the [ZenHub](https://zenhub.io) Chrome or Firefox Extension and visit any of our repository's boards.

## Documention

You can read the documentation for the aurelia framework [here](http://aurelia.io/docs). If you would like to help improve this documentation, the source for many of the docs can be found in the doc folder within this repository. Other docs, not related to the general framework, but directed at specific libraries, can be found in the doc folder of those libraries.

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
2. Ensure that [jspm](http://jspm.io/) is installed. If you need to install it, use the following command:

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

## Contributors

This project exists thanks to all the people who contribute. [[Contribute](CONTRIBUTING.md)].
<a href="graphs/contributors"><img src="https://opencollective.com/aurelia/contributors.svg?width=890&button=false" /></a>


## Backers

Thank you to all our backers! 🙏 [[Become a backer](https://opencollective.com/aurelia#backer)]

<a href="https://opencollective.com/aurelia#backers" target="_blank"><img src="https://opencollective.com/aurelia/backers.svg?width=890"></a>


## Sponsors

Support this project by becoming a sponsor. Your logo will show up here with a link to your website. [[Become a sponsor](https://opencollective.com/aurelia#sponsor)]

<a href="https://opencollective.com/aurelia/sponsor/0/website" target="_blank"><img src="https://opencollective.com/aurelia/sponsor/0/avatar.svg"></a>
<a href="https://opencollective.com/aurelia/sponsor/1/website" target="_blank"><img src="https://opencollective.com/aurelia/sponsor/1/avatar.svg"></a>
<a href="https://opencollective.com/aurelia/sponsor/2/website" target="_blank"><img src="https://opencollective.com/aurelia/sponsor/2/avatar.svg"></a>
<a href="https://opencollective.com/aurelia/sponsor/3/website" target="_blank"><img src="https://opencollective.com/aurelia/sponsor/3/avatar.svg"></a>
<a href="https://opencollective.com/aurelia/sponsor/4/website" target="_blank"><img src="https://opencollective.com/aurelia/sponsor/4/avatar.svg"></a>
<a href="https://opencollective.com/aurelia/sponsor/5/website" target="_blank"><img src="https://opencollective.com/aurelia/sponsor/5/avatar.svg"></a>
<a href="https://opencollective.com/aurelia/sponsor/6/website" target="_blank"><img src="https://opencollective.com/aurelia/sponsor/6/avatar.svg"></a>
<a href="https://opencollective.com/aurelia/sponsor/7/website" target="_blank"><img src="https://opencollective.com/aurelia/sponsor/7/avatar.svg"></a>
<a href="https://opencollective.com/aurelia/sponsor/8/website" target="_blank"><img src="https://opencollective.com/aurelia/sponsor/8/avatar.svg"></a>
<a href="https://opencollective.com/aurelia/sponsor/9/website" target="_blank"><img src="https://opencollective.com/aurelia/sponsor/9/avatar.svg"></a>


