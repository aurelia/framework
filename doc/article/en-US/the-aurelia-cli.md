---
name: The Aurelia CLI
description: Learn how to get setup with the Aurelia CLI and use its basic capabilities.
author: Rob Eisenberg (http://robeisenberg.com)
---
## Machine Setup

The CLI itself has a couple of prerequisites that you must install first:

* Install NodeJS version 4.x or above.
    * You can [download it here](https://nodejs.org/en/).
* Install a Git Client
    * Here's [a nice GUI client](https://desktop.github.com).
    * Here's [a standard client](https://git-scm.com).

Once you have the prerequisites installed, you can install the Aurelia CLI itself. From the command line, use npm to install the CLI globally:

```Shell
npm install aurelia-cli -g
```

> Info
> Always run commands from a Bash prompt. Depending on your environment, you may need to use `sudo` when executing npm global installs.

> Warning
> While creating a new project doesn't require NPM 3, front-end development, in general, requires a flat-package structure, which is not available with NPM versions prior to 3. It is recommended that you update to NPM 3, which will be able to manage this structural requirement. You can check your NPM version with `npm -v`. If you need to update, run `npm install npm -g`.

## Creating A New Aurelia Project

To create a new project, you can run `au new`. You will be presented with a number of options. If you aren't sure what you want, you can select one of the defaults. Otherwise, you can create a custom project. Simply follow the prompts.

Once you've made your choice, the CLI will show you your selections and ask if you'd like to create the file structure. After that, you'll be asked if you would like to install your new project's dependencies.

Once the dependencies are installed, your project is ready to go.

### ASP.NET Core

If you would like to use ASP.NET Core, first begin by using Visual Studio to create your ASP.NET Core project. Select whatever options make the most sense based on your .NET project plans. After you have created the project, open a command line and change directory into your web project's project folder. This is the folder that contains the `.xproj` file. From within this folder, you can execute the following command `au new --here` which will setup Aurelia "here" inside this project folder. You will be prompted to choose the platform you want. Simply select "ASP.NET Core". Follow the prompts for the rest of the process, just like above.

Since the Aurelia-CLI should be in charge of building your client side code, make sure that before running the `new` command from **Aurelia-CLI** you add the following to your .xproj file inside the first `PropertyGroup` you find.

<code-listing>
  <source-code lang="XML">
    <PropertyGroup>
      <TypeScriptCompileBlocked>true</TypeScriptCompileBlocked>
    </PropertyGroup>
  </source-code>
</code-listing>

This will stop Visual Studio from compiling the `.ts` files in your project. If you build your solution before doing this, Visual Studio will compile your `.ts` files, breaking some of the **Aurelia-CLI** commands.

## Running Your Aurelia App

From inside your project folder, simply execute `au run`. This will build your app, creating all bundles in the process. It will start a minimal web server and serve your application. If you would like to develop, with auto-refresh of the browser, simply specify the `--watch` flag like this: `au run --watch`.

### Environments

The CLI build system understands that you might run your code in different environments. By default, you are set up with three: `dev`, `stage` and `prod`. You can use the `--env` flag to specify what environment you want to run under. For example: `au run --env prod --watch`.

## Building Your App

Aurelia CLI apps always run in bundled mode, even during development. To build your app, simply run `au build`. You can also specify an environment to build for. For example: `au build --env stage`.

## Deploying Your App

Run the following build command:

```Shell
au build --env prod
```

Then copy the file `index.html` and the folder `/scripts`  to the main deployment folder on your server.

## Unit Testing

If you selected a project setup that includes unit tests, you can run your tests with `au test`. If you would like to adopt a tdd-based workflow, writing code and tests with continual test evaluation, you can use the `--watch` flag. For example: `au test --watch`.

## Generators

Executing `au generate resource` runs a generator to scaffold out typical Aurelia constructs. Options for *resource* are: element, attribute, value-converter, binding-behavior, task and generator. That's right...there's a generator generator so you can write your own. Ex. `au generate element`

## Build Revisions

To create builds with revision numbers, you must set `rev` to be `true` under the build options. This will cause a unique revision number to be added to the bundled files. For example:

```JSON
"options": {
  "minify": "stage & prod",
  "sourcemaps": "dev & stage",
  "rev": true
}
```

You are also able to set specific flags so that build revisions only take place while staging or in production. For example:

```JSON
"options": {
  "minify": "stage & prod",
  "sourcemaps": "dev & stage",
  "rev": "stage & prod"
}
```  

Now, if you were to run `au build --env prod`, the output would contain build revisions, while `au build --env dev` would not. Setting the build revisions to only compile while in production can help the development process, since it keeps your workspace clean of various build revisions.

### Modifying The Index File

In order for your `index.html` file to be updated to load up the correct revisioned bundle, you must ensure that the `"index"` property located in `build/targets` section is correctly pointing to the `index.html` (or starting page) for your project. For example:

``` JSON
"build": {
  "targets": [
    {
      "id": "web",
      "displayName": "Web",
      "output": "scripts",
      "index": "index.html"
    }
  ]
}
```

## Bundling Your Project

By default, the Aurelia CLI creates two bundles, an `app-bundle.js`, and a `vendor-bundle.js`. An example of the default `app-bundle.js` looks like this:  

```JSON
{
  "name": "app-bundle.js",
  "source": [
    "[**/*.js]",
    "**/*.{css,html}"
  ]
}
```  

In this setup, we've named the bundle `app-bundle.js`, and have defined what's included by setting the `source` property to be an array of patterns that match to file paths (the patterns are using glob patterns, [minimatch](https://github.com/isaacs/minimatch) to be specific, to find files that match).  
Optionally, you can define an `exclude` list by setting the `source` property to be an object containing both an `include` and `exclude` array of patterns. This is helpful when you're trying to define multiple bundles from your source code.  

```JSON
{
  "name": "app-bundle.js",
  "source": {
    "include": [
      "[**/*.js]",
      "**/*.{css,html}"
    ],
    "exclude": [
      "**/sub-module/**/*",
    ]
  }
},
{
  "name": "sub-module-bundle.js",
  "source": [
    "**/sub-module/**/*",
  ]
}
```

## Adding Client Libraries to Your Project

The CLI provides two commands to help you add 3rd party client libraries, `au install <library>` and `au import <library>`. The `install` command will download, install and add the library to the configuration file `aurelia_project/aurelia.json`. The `import` command will add a library that you've previously installed with npm to the configuration file. Finally, both commands will give you instructions on how to access the library from your code.

### Manual configuration

Unfortunately, not all 3rd party libraries can be successfully configured automatically by the `install` and `import` commands. In order the remedy this by manual configuration, open the `aurelia_project/aurelia.json` file and scroll down to the `build.bundles` section. You'll need to add the library into one of your bundle's `dependencies` sections.

Below is some guidance for how to manually configure several different common 3rd party library scenarios:

### A Single-File Module

If the library you have installed is a single CommonJS or AMD file, you can add an entry similar to the following to the dependencies of your bundle:

<code-listing heading="A Single File Module Dependency">
  <source-code lang="JSON">
    "dependencies": [
      {
        "name": "library-name",
        "path": "../node_modules/library-name/dist/library-name"
      }
    ]
  </source-code>
</code-listing>

* `name` - This is the name of the library as you will import it in your JavaScript or TypeScript code.
* `path` - This is a path to the single module file itself. This path is relative to your application's `src` folder. Also, you should not include the file extension. `.js` will be appended automatically.

If the `main` field of the library's `package.json` points to the single file that you need to bundle, then you can opt for a simplified configuration by just adding the package name to your dependencies directly:

<code-listing heading="A Single File Module Dependency via Main">
  <source-code lang="JSON">
    "dependencies": [
      "library-name"
    ]
  </source-code>
</code-listing>


### A CommonJS Package

Many modules installed through NPM are packages made up of multiple source files. Configuring a library like this is a bit different than the single-file scenario above. Here's an example configuration for a multi-file package:

<code-listing heading="A CommonJS Package Dependency">
  <source-code lang="JSON">
    "dependencies": [
      {
        "name": "aurelia-testing",
        "path": "../node_modules/aurelia-testing/dist/amd",
        "main": "aurelia-testing",
        "env": "dev"
      }
    ]
  </source-code>
</code-listing>


* `name` - This is the name of the library as you will import it in your JavaScript or TypeScript code.
* `path` - This is a path to the folder where the package's source is located. This path is relative to your application's `src` folder.
* `main` - This is the main module (entry point) of the package, relative to the `path`. You should not include the file extension. `.js` will be appended automatically. Set `main` to `false` when the package does not have a main file.

> Info: Environment-Specific Dependencies
> We've also shown how to use the `env` setting on a dependency. This can be used on any dependency in the bundle to indicate what environment builds the dependency should be included in. By default, dependencies are included in all builds. The example above shows how to include the library only in builds targeting the "dev" environment. You can also specify multiple environments like `dev & stage`.

### A Legacy Library

Libraries that predate module systems can be a pain because they often rely on global scripts which must be loaded before the library. These libraries also add their own global variables. An example of one such library is [bootstrap](http://getbootstrap.com/css/). Let's take a look at how to handle a legacy library like that.

<code-listing heading="A Legacy Library Dependency">
  <source-code lang="JSON">
    "dependencies": [
      {
        "name":"jquery",
        "path":"../node_modules/jquery/dist",
        "main":"jquery.min",
        "exports": "$"
      },
      {
          "name": "bootstrap",
          "path": "../node_modules/bootstrap/dist",
          "main": "js/bootstrap.min",
          "deps": ["jquery"]
      }
    ]
  </source-code>
</code-listing>

* `name` - This is the name of the library as you will import it in your JavaScript or TypeScript code.
* `path` - This is a path to the folder where the package's source is located. This path is relative to your application's `src` folder.
* `main` - This is the main module (entry point) of the package, relative to the `path`. You should not include the file extension. `.js` will be appended automatically.  Set `main` to `false` when the package does not have a main file.
* `deps` - This is an array of dependencies which must be loaded and available before the legacy library can be evaluated.
* `exports` - This is the name of the global variable that should be used as the exported value of the module.

Notice first that we've included "jquery" as one of our dependencies, *and specifically at the beginning of the dependency list*.  
We are using the `exports` property to export the jQuery object since jQuery plugin, like Bootstrap, attach their APIs to the jQuery object itself.  (This could be any global variable, though.)  Finally, below that we configure `bootstrap`. The first three properties are the same as in our package example above. However, now we have a `deps` list. We've included `jquery` since Bootstrap needs it to be present before it can load.

### A Library with Additional Resources

The Bootstrap example above results in the bundling of the JavaScript portions of the library. But, as you probably know, Bootstrap is mostly about CSS. The CSS files distributed with Bootstrap aren't traceable through the module system so this still doesn't result in the Bootstrap CSS being bundled. Here's how we solve that problem:

<code-listing heading="A Library with Additional Resources">
  <source-code lang="JSON">
    "dependencies": [
      {
        "name":"jquery",
        "path":"../node_modules/jquery/dist",
        "main":"jquery.min",
        "exports": "$"
      },
      {
          "name": "bootstrap",
          "path": "../node_modules/bootstrap/dist",
          "main": "js/bootstrap.min",
          "deps": ["jquery"],
          "resources": [
            "css/bootstrap.css"
          ]
      }
    ]
  </source-code>
</code-listing>

Notice that we've added a `resources` array. Here we can provide a list of additional files to be included with the bundle. These files are relative to the `path` designated above and must include the file extension. You can also use glob patterns in place of exact file names.

The final step to make Bootstrap work is to copy the necessary font files to the `bootstrap/fonts` folder, which by default is where Bootstrap will look for the font files. To do this, we should declare these files in the `copyFiles` property, after the `bundles` property.

```JSON
"bundles": [ ... ],
"copyFiles": {
    "node_modules/bootstrap/dist/fonts/glyphicons-halflings-regular.woff2": "bootstrap/fonts",
    "node_modules/bootstrap/dist/fonts/glyphicons-halflings-regular.woff": "bootstrap/fonts",
    "node_modules/bootstrap/dist/fonts/glyphicons-halflings-regular.ttf": "bootstrap/fonts"
  }
```

Now, the font files will be copied to the `bootstrap/fonts` folder when building the application.

> Info: Setup for copying files
> The `copyFiles` works as a 'from':'to' setup, where 'from' is the location of the file you want to copy, and 'to' is the destination folder. Both paths are relative to project folder. The sintax is:
>
```JSON
"bundles": [ ... ],
"copyFiles": {
  FILE_YOU_WANT_TO_COPY_BASED_ON_PROJECT_FOLDER: DESTINATION_FOLDER_BASED_ON_PROJECT_FOLDER
}
```

> Warning
> If you run the application providing the `--watch` flag, the files will be recopied when changed.

> Info
> Remember that CSS bundled in this way is bundled as a text resource designed to be required in your view. To load the Bootstrap css file in a view, use `<require from="bootstrap/css/bootstrap.css"></require>`. Notice that the module name derives from combining the `name` property with the resource.

### A Very Stubborn Legacy Library

Sometimes you can't get a library to work with the module loading system. That's ok. You can still include it in the bundle, using traditional concatenation techniques. In fact, this is how the CLI bundles up the loader and promise polyfills. These items don't go into the `dependencies` section but instead go into the `prepend` section. This is because they aren't module dependencies. They also aren't relative to the `src`, but relative to the project folder. Using the `prepend` section causes the scripts to be prepended to the beginning of the bundle, using normal script concatenation techniques. Here's a full vendor bundle example, showing this and the rest of the techniques listed above.

<code-listing heading="A Sample Bundle">
  <source-code lang="JSON">
    {
      "name": "vendor-bundle.js",
      "prepend": [
        "node_modules/bluebird/js/browser/bluebird.core.js",
        "scripts/require.js"
      ],
      "dependencies": [
        "aurelia-binding",
        "aurelia-bootstrapper",
        "aurelia-dependency-injection",
        "aurelia-event-aggregator",
        "aurelia-framework",
        "aurelia-history",
        "aurelia-history-browser",
        "aurelia-loader",
        "aurelia-loader-default",
        "aurelia-logging",
        "aurelia-logging-console",
        "aurelia-metadata",
        "aurelia-pal",
        "aurelia-pal-browser",
        "aurelia-path",
        "aurelia-polyfills",
        "aurelia-route-recognizer",
        "aurelia-router",
        "aurelia-task-queue",
        "aurelia-templating",
        "aurelia-templating-binding",
        "nprogress",
        "jquery",
        {
          "name": "bootstrap",
          "path": "../node_modules/bootstrap/dist",
          "main": "js/bootstrap.min",
          "deps": ["jquery"],
          "exports": "$",
          "resources": [
            "css/bootstrap.css"
          ]
        },
        {
          "name": "text",
          "path": "../scripts/text"
        },
        {
          "name": "aurelia-templating-resources",
          "path": "../node_modules/aurelia-templating-resources/dist/amd",
          "main": "aurelia-templating-resources"
        },
        {
          "name": "aurelia-templating-router",
          "path": "../node_modules/aurelia-templating-router/dist/amd",
          "main": "aurelia-templating-router"
        },
        {
          "name": "aurelia-testing",
          "path": "../node_modules/aurelia-testing/dist/amd",
          "main": "aurelia-testing",
          "env": "dev"
        }
      ]
    }
  </source-code>
</code-listing>

### A Very Stubborn Legacy Library With Plugins

Some legacy libraries may support plugins which you also want included in your bundle. In some cases these plugins depend on a global object defined by the main library, so it is important that the plugins exist later in the bundle than the main library scripts. These plugins can go in the `append` section, which works exactly the same as the `prepend` section but the scripts are appended to the end of the bundle, after all other items.  Like the `prepend` section all items are relative to the project folder, not the `src`.

### A note on NPM's scoped packages

The CLI treats [scoped packages](https://docs.npmjs.com/misc/scope) in the same way as unscoped ones, you just need to remember that the scope is always part of its name.

So, for example, if you need to consume a scoped package in a CLI project, you need the following in your `aurelia.json`:

```JSON
"dependencies": [
  {
    "name": "@scope/packagename",
    "path": "../node_modules/@scope/packagename/dist/amd",
    "main": "packagename"
  }
]
```

Your imports must be scoped too:

```JavaScript
import { SomeClass } from '@scope/packagename';
```

And this is an example of loading a `@scope/packagename` plugin during app startup:

```JavaScript
aurelia.use.standardConfiguration().plugin('@scope/packagename');
```

### Reference packages outside of the node_modules folder

It is possible to use packages outside of the node_modules folder. The only difference is that you need to define what the `packageRoot` is. In `aurelia.json`, you can define a package that lives outside of the node_modules folder as follows:

<code-listing heading="Package outside of node_modules">
  <source-code lang="JSON">
    "dependencies": [{
      "name": "my-standalone-folder",
      "path": "../my-standalone-folder/dist/amd",
      "main": "index",
      "packageRoot": "../my-standalone-folder"
    }]
  </source-code>
</code-listing>

The `packageRoot` is the root folder of the package. This is often the folder which contains the `package.json` file of the package.

## Configuring the Loader

You can configure the loader by adding a `config` key to `build.loader` with the options you want to add. For instance, if you want to increase the timeout for requirejs, you would do this:

```JSON
"build": {
  "loader": {
    "type": "require",
    "configTarget": "vendor-bundle.js",
    "includeBundleMetadataInConfig": "auto",
    "config": {
      "waitSeconds": 60
    }
  }
}
```

**Setting the baseUrl**

Sometimes you may want to keep the scripts folder somewhere other than the default location, or move the index.html file a few folders up from the project root. In that case it is possible to set the `baseUrl` property so that the build system uses the correct paths and that bundles get loaded correctly in the browser. The `baseUrl` property should be set in both the `platform` object as well as the `build.targets` object:

<code-listing heading="baseUrl">
  <source-code lang="JSON">
    "targets": [
      {
        "id": "web",
        "displayName": "Web",
        "output": "some/dir/scripts",
        "index": "index.html",
        "baseUrl": "some/dir/scripts"
      }
  </source-code>
</code-listing>

The script tag for the bundle in `index.html` file needs to point to the modified location of the scripts folder as well: `<script src="some/dir/scripts/vendor-bundle.js" data-main="aurelia-bootstrapper"></script>`

## Styling your Application

There are many ways to style components in Aurelia. The CLI sets up your project to only process styles inside your application's `src` folder. Those styles can then be imported into a view using Aurelia's `require` element.

* If you aren't using any CSS preprocessor, you write css and then simply require it in the view like this:

<code-listing heading="Requiring styles.css">
  <source-code lang="HTML">
    <require from="./styles.css"></require>
  </source-code>
</code-listing>

* For projects that use a CSS preprocessor (chosen from the cli setup questions):
  * Write your styles in the format you chose (styl, sass, less ...).
  * Require the style by `[filename].css` instead of `[filename].[extension]`. This is because
      your style file is transpiled into a module that encodes the resulting `css` file extension.

<code-listing heading="Requiring main.sass">
  <source-code lang="HTML">
    <require from ="./main.css"></require>
  </source-code>
</code-listing>

Bear in mind that you can always configure things any way you want by modifying the tasks in the `aurelia_project/tasks` folder.
For styling purposes, you can modify the `process-css.js` file.


## What if I forget this stuff?

If you need your memory refreshed as to what the available options are, at any time you can execute `au help`. If you aren't sure what version of the CLI you are running, you can run `au -v`;

## Troubleshooting

_**I updated aurelia-cli and now executing `au run` returns `"Invalid Command: run"`**_

There appears to be an ongoing issue with npm's cache that can affect the upgrade of the aurelia-cli. Clearing the npm-cache appears to resolve the issue.
Steps:
 * `npm uninstall aurelia-cli -g`
 * delete the contents under c:/Users/NAME/AppData/Roaming/npm-cache
 * `npm install aurelia-cli -g`

## Updating A Single Library

To update a single library use the command `npm install library-name` where library-name is the library that you wish to update.  

## Updating Multiple Libraries

* Add the following section to the project's package.json file

```JSON
"scripts": {
  "au-update": "npm install aurelia-binding@latest aurelia-bootstrapper@latest ..."
}
```

* List the libraries on a single line separated by a space.
* Include all of the libraries from the dependencies section of aurelia.json that you want to update.
* Use the command `npm run au-update` to update all of the libraries in the au-update list above.

## Javascript Minification

The CLI will minify Javascript out of the box for the staging and production environments:

<code-listing heading="Default minification settings">
  <source-code lang="JSON">
    "options": {
      "minify": "stage & prod",
      "sourcemaps": "dev & stage"
    },
  </source-code>
</code-listing>

These options can be found in the `"build"."options"` section of `aurelia.json`. If you wish to specify the options that are used in the minification process, then replace `"minify": "stage & prod"` with:

<code-listing heading="Default minification settings">
  <source-code lang="JSON">
    "minify": {
      "dev": false,
      "default": {
        "indent_level": 2
      },
      "stage & prod": {
        "max-line-len": 100000
      }
    },
  </source-code>
</code-listing>

The Aurelia-CLI uses [UglifyJS2](https://github.com/mishoo/UglifyJS2) for minification, so any option that UglifyJS2 supports is also supported by the Aurelia-CLI. With the above configuration, minification will occur for the `stage` and `prod` environments, but not for the `dev` environment. For the `stage` and `prod` environments, both the `indent_level` as well as the `max-line-len` option are passed to the minifier. The `default` key is optional, but allows you to reduce code duplication when multiple environments have similar options.
