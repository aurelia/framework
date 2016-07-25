---
{
  "name": "Setup with JSPM",
  "culture": "en-US",
  "description": "If you're interested in getting setup with JSPM to build projects, this article will take you through setting up both your machine and a production quality starter project.",
  "engines" : { "aurelia-doc" : "^1.0.0" },
  "author": {
  	"name": "Rob Eisenberg",
  	"url": "http://robeisenberg.com"
  },
  "contributors": [],
  "translators": [],
  "keywords": ["JavaScript", "TypeScript", "SPA", "Setup"]
}
---
## [Configuring Your Environment](aurelia-doc://section/1/version/1.0.0)

Let's start by getting you set up with a great set of tools that you can use to build modern ${context.language.name} applications. All our tooling is built on [Node.js](http://nodejs.org/). If you have that installed already, great! If not, you should go to [the official web site](http://nodejs.org/), download and install it. Everything else we need will be installed via Node's package manager ([npm](https://docs.npmjs.com/getting-started/what-is-npm)). If you already have npm installed, make sure you've got the [latest version](https://github.com/npm/npm/wiki/Troubleshooting#try-the-latest-stable-version-of-node) to avoid any issues with the other tools.

> Info
> For command-line operations, we recommend Windows users to use Git Bash or Git Shell.

First, let's begin by installing [Gulp](http://gulpjs.com/) which we'll be using for build automation. If you don't have it already, you can use npm to set it up like this (in some environments you may need to use `sudo`):

```shell
npm install -g gulp
```

Next, we need to install [jspm](http://jspm.io/). This will serve as our client-side package manager. You can do that like this:

```shell
npm install -g jspm
```

## [Setting up the Project Structure and Build](aurelia-doc://section/2/version/1.0.0)

With the tooling installed, we can now turn our attention to setting up a basic structure for your app. We'll begin by downloading a skeleton. We've got several versions available for you based on your language and tooling preferences. Please download the latest skeletons now.

<div style="text-align: center;">
  <a class="au-button" href="https://github.com/aurelia/skeleton-navigation/releases/latest" style="text-decoration: none; margin: 32px 8px 42px 8px;" target="_blank">Download the Skeletons</a>
</div>

Once the download has completed, unzip it and look inside. The readme file contained therein will explain the various options available to you. Please select one of the skeletons and copy it to the location on your file system that you wish your code to reside. Be sure to rename the folder to appropriately represent the app you want to build.

You will now find everything you need inside the folder, including a basic build, package configuration, styles and more. With all this in place, let's run some commands.

1. Open a console and change directory into your app's directory.
2. Execute the following command to install the dependencies listed in the _devDependencies_ section of the package manifest:
  ```shell
  npm install
  ```
3. Next, execute the following command to install the Aurelia libraries, bootstrap and font-awesome, listed in the _jspm.dependencies_ section of the package manifest:
  ```shell
  jspm install -y
  ```
Everything we've done so far is standard Node.js build and package management procedures. It doesn't have anything specific to do with Aurelia itself. We're just walking you through setting up a modern ${context.language.name} project and build configuration from scratch.

> Info
> Bootstrap and Font-Awesome are **not** dependencies of Aurelia. We only leverage them as part of the starter kit in order to help you quickly achieve a decent look out-of-the-box. You can easily replace them with whatever your favorite CSS framework and/or icon library is.

## [Running The App](aurelia-doc://section/3/version/1.0.0)

If you've followed along this far, you now have all the libraries, build configuration and tools you need to create amazing ${context.language.name} apps with Aurelia. The next thing to do is run the sample app. To see this in action, on your console, use the following command to build and launch the server:
```shell
gulp watch
```
You can now browse to [http://localhost:9000/](http://localhost:9000/) to see the app.

> Warning
> The Skeleton App uses [BrowserSync](http://www.browsersync.io/) for automated page refreshes on code/markup changes concurrently across multiple browsers. If you prefer to disable the mirroring feature, set the [ghostMode option](http://www.browsersync.io/docs/options/#option-ghostMode) to `false` in your build config.

## [Running The Unit Tests](aurelia-doc://section/4/version/1.0.0)

To run the unit tests, first ensure that you have followed the steps above in order to install all dependencies and successfully build the library. Once you have done that, proceed with these additional steps:

1. Ensure that the [Karma](http://karma-runner.github.io/) CLI is installed. If you need to install it, use the following command:
  ```shell
  npm install -g karma-cli
  ```
2. You can now run the tests with this command:
  ```shell
  gulp test
  ```

## [Running The E2E Tests](aurelia-doc://section/5/version/1.0.0)

Integration tests are performed with [Protractor](http://angular.github.io/protractor/#/).

1. Place your E2E-Tests into the folder ```test/e2e/src```.
2. Install the necessary webdriver:
  ```shell
  gulp webdriver-update
  ```
3. Configure the path to the webdriver by opening the file ```protractor.conf.js``` and adjusting the ```seleniumServerJar``` property. Typically it's only needed to adjust the version number.
4. Make sure your app runs and is accessible:
  ```shell
  gulp watch
  ```
5. In another console run the E2E-Tests:
  ```shell
  gulp e2e
  ```
