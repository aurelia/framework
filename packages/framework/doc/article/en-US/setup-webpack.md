---
name: Setup with Webpack
description: If you're interested in getting setup with Webpack to build projects, this article will take you through setting up both your machine and a production quality starter project.
author: Bazyli Brzóska (https://invent.life)
---
## Configuring Your Environment

Let's start by getting you set up with a great set of tools that you can use to build modern ${context.language.name} applications. All our tooling is built on [Node.js](http://nodejs.org/). If you have that installed already, great! If not, you should go to [the official web site](http://nodejs.org/), download and install it. Everything else we need will be installed via Node's package manager ([npm](https://docs.npmjs.com/getting-started/what-is-npm)). If you already have npm installed, make sure you've got the [latest version](https://github.com/npm/npm/wiki/Troubleshooting#try-the-latest-stable-version-of-node) to avoid any issues with the other tools.

> Info
> For command-line operations, we recommend Windows users to use Git Bash or Git Shell.

## Setting up the Project Structure and Build

We'll begin by downloading a skeleton. We've got several versions available for you based on your language and tooling preferences. Please download the latest skeletons now.

<div style="text-align: center; margin-bottom: 32px">
  <a class="au-button" href="https://github.com/aurelia/skeleton-navigation/releases/latest" target="_blank">Download the Skeletons</a>
</div>

Once the download has completed, unzip it and look inside. The readme file contained therein will explain the various options available to you. Please select one of the skeletons and copy it to the location on your file system that you wish your code to reside. Be sure to rename the folder to appropriately represent the app you want to build.

You will now find everything you need inside the folder, including a basic build, package configuration, styles and more. With all this in place, let's run some commands.

1. Open a console and change directory into your app's directory.
2. Execute the following command to install the dependencies listed in the _dependencies_ and _devDependencies_ sections of the package manifest:

```Shell
npm install
```

Everything we've done so far is standard Node.js build and package management procedures. It doesn't have anything specific to do with Aurelia itself. We're just walking you through setting up a modern ${context.language.name} project and build configuration from scratch.

> Info
> Bootstrap and Font-Awesome are **not** dependencies of Aurelia. We only leverage them as part of the starter kit in order to help you quickly achieve a decent look out-of-the-box. You can easily replace them with whatever your favorite CSS framework and/or icon library is. Similarly, Bluebird is recommended, but not required. Note however that the `Promise` implementation in certain Microsoft Edge versions are extremely slow, thus keeping an alternative `Promise` implementation is recommended.

## Running The App

If you've followed along this far, you now have all the libraries, build configuration and tools you need to create amazing ${context.language.name} apps with Aurelia. The next thing to do is run the sample app. To see this in action, on your console, use the following command to build and launch the server:

```Shell
npm start
```

You can now browse to [http://localhost:9000/](http://localhost:9000/) to see the app.

> Info
> The Skeleton App uses Webpack's Development Server for automated page refreshes on code/markup changes, meaning you do not need to restart the command every time you make a change.

## Running The Unit Tests

To run the unit tests, first ensure that you have followed the steps above in order to install all dependencies and successfully build the library. Once you have done that, you may run the tests with the following command:

```Shell
npm test
```

## Running The E2E Tests

Integration tests are performed with [Protractor](http://angular.github.io/protractor/#/).

1. Place your E2E-Tests into the folder ```test/e2e/src```
2. Run the tests by invoking
```Shell
npm run e2e
```

## Running E2E Tests Manually

1. Make sure your app runs and is accessible:
```Shell
WEBPACK_PORT=19876 npm start
```
2. Once bundle is ready, run the E2E-Tests in another console:
```Shell
npm run e2e:start
```
