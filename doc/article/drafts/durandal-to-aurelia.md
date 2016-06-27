# Upgrading to Aurelia from Durandal.js

## Introduction

At the moment we don't have an automated way of updating an app from Durandal.js to Aurelia but
luckily the process isn't that painful.

Upgrading has many benefits - for one it gives us the opportunity to improve performance and
our codes' readability but it also gives us the chance to identify some common mistakes that
are in need of refactoring along the way.  Refactoring is of course optional and we can upgrade
and mostly leave our core code untouched. This guide is designed so that all efforts can be
split as much as possible.

## Requirements

1. Durandal.js app to convert
2. Understand what it means to transpile JavaScript code with a tool such as BabelJs

## Getting started

From the fundamental perspective we need to understand what the most common changes that will
need to be made are -

- The Module format
- The Module loader
- Replace all Durandal usages with Aurelia equivalents
- Polyfills
- Templating
- The Syntax of Data Binding
- Dependency Injection


### Module format

ES2015 (formerly ES6) allows using an updated module format that is more standardized.
In the past we were forced to either use AMD or CommonJs but now we have the ability to
write proper JavaScript classes that can be transpiled to any of the two formats or a newer
format called System.

Of course you can continue to use Aurelia with ES5, however, it makes sense that you rewrite
all files you have to change in this guide to ES2015+.

A good example of this format can be seen here:

```language-javascript
export class MyViewModel {
  constructor() {
    console.log('Constructed');
  }
  activate() {
    console.log('Activate method was called');
  }
}
```

In addition to using the ES2015 class format we can even go further and move some of our
modules' properties to ES2016 class instance fields.  These are just a clean way of defining
the properties that our class has -

```language-javascript
class MyViewModel {
  myProperty = '';
}
```

MyProperty is simply a property that is added to `this` class.

With these changes in mind we can assume that you not only want to update your app to use
Aurelia but also want to use the proper module format.  There are at least two methods you
can use when updating -

1. Move everything in to the constructor and define them as properties of the class.
2. Convert all the code to proper ES2015+ module syntax

If you choose #1 you can move code that follows the revealing module pattern or that returns
a constructor function like this -

```language-javascript
define(['my-service'], function(myService){
  function activate() {
    myService.getPeople().then(function (response) {
      this.personsList = response.people;
    });
  }
  return {
    activate: activate
  }
});
```
and
```language-javascript
define(function(){
  var ctor = {};
  ctor.getPeople = function() {
    return $.get('/people');
  }
  return ctor;
});
```
in to this -
```language-javascript
import {MyService} from './my-service';
export class PersonsList {
  static inject = [MyService];
  personsList = [];
  constructor(myService) {
    this.myService = myService;
  }
  activate() {
    myService.getPeople().then(response => {
      this.personsList = response.people;
    });
  }
}
```
and
```language-javascript
export class MyService {
  getPeople() {
    return $.get('/people');
  }
}
```

The big fundamental difference here is that instead of using a looser JavaScript object we
are relying on a well-defined class structure.


### Module loader

With your existing Durandal application you likely uses RequireJs as Module loader. Now there are
several possibilities which loader to use in context with the used package manager. The following
combinations will fit properly together:

- RequireJs with Bower
- RequireJs with NPM
- SystemJs with NPM
- SystemJs with JSPM

Your decision depends on your needs: If you prefere a solution which works out of the box
you should choose SystemJs with JSPM because they work perfectly together. If you want to have
more flexibility and impact to these tools you should use RequireJs with NPM. Let's have
a look at these two possibilities.


#### SystemJs and JSPM

The ```config.js``` file contains the configuration from SystemJS. If this file does not exist in your project's root
execute ```jspm init``` and follow the wizard. Install then the minimal required Aurelia modules to get started:
```
jspm install aurelia-bootstrapper
```
The module loader configuration is done from JSPM automatically.

Let's have a look at the ```index.html```:
```
<html>
<head>
  <meta charset="UTF-8">
  <title>Your awesome Aurelia app</title>
</head>
<body aurelia-app="src/main">
  <script src='jspm_packages/system.js' type="text/javascript"></script>
  <script src='config.js' type="text/javascript"></script>

  <script>
      System.import("aurelia-bootstrapper");
  </script>
</body>
</html>
```


#### RequireJs and NPM

Run ```npm init``` if no ````package.json``` is available. After that install the minimal required Aurelia
modules to get started:
```
npm install aurelia-bootstrapper --save
```

Move your RequireJs configuration to an own file in the project's root directory if not
already done. The file should look similar to this:
```
requirejs.config({
  paths: {
    'aurelia-framework': 'node_modules/aurelia-framework/dist/amd/aurelia-framework',
    'aurelia-bootstrapper': 'node_modules/aurelia-bootstrapper/dist/amd/aurelia-bootstrapper',
    'aurelia-metadata': 'node_modules/aurelia-metadata/dist/amd/aurelia-metadata',
    'aurelia-binding': 'node_modules/aurelia-binding/dist/amd/aurelia-binding',
    'aurelia-templating': 'node_modules/aurelia-templating/dist/amd/aurelia-templating'
    ...
  },
  packages: [
    {
      name: 'aurelia-templating-resources',
      location: 'node_modules/aurelia-templating-resources/dist/amd',
      main : 'aurelia-templating-resources'
    },
    {
      name: 'aurelia-templating-router',
      location: 'node_modules/aurelia-templating-router/dist/amd',
      main : 'aurelia-templating-router'
    }
  ]
});
```

Typically it's working to define a path mapping for each Aurelia module you use. For modules
which distribution require underlying files itself you have to configure it as "package" instead.

Your ```index.html``` will look like this:
```
<html>
<head>
  <meta charset="UTF-8">
  <title>Your awesome Aurelia app</title>
</head>
<body aurelia-app="src/main">
  <script src='node_modules/requirejs/require.js' type="text/javascript"></script>
  <script src='requireConfig.js' type="text/javascript"></script>

  <script>
    require(["aurelia-bootstrapper"])
  </script>
</body>
</html>
```



### Replace Durandal Usages

Before we can remove Durandal we must first remove all references in the code. You can do this manually by refactoring
all relevant places in your code or you can use [Durelia](https://github.com/josundt/Durelia) to write Aurelia Syntax
while still using Durandal under the hood. This makes the first steps easier to switch to the Aurelia ecosystem. At
the time you add Aurelia to your application you should remove Durandal and Durelia and use the
```aurelia-knockout``` plugin instead like described below.


#### App Startup

The point of Startup for the Aurelia framework and all other components will be in ```main.js```.
Copy the following lines to the file:
```
export function configure(aurelia) => {
    aurelia.use
        .standardConfiguration()
        .developmentLogging();

    aurelia.start().then(() => aurelia.setRoot());
}
```

This initializes Aurelia with its default values and redirects to the root view and view-model (called "app" here).
This root view was called 'shell' in Durandal by default.


#### Routing

The next step of this Migration is to use and configure the Aurelia Router.

If the "aurelia-router" is not already part of your dependency tree, you have to install it. If you use NPM ...
```
npm install aurelia-router --save
```

or JSPM ...

```
jspm install aurelia-router
```


In Durandal the routing configuration looks like to following:

```
Shell.prototype.activate = function () {
    router.map([
        { route: '',                    moduleId: 'home/index'                      },
        { route: 'home',                moduleId: 'home/index',         nav: true   },
        { route: 'tickets',             moduleId: 'tickets/index',      nav: true   },
        { route: 'tickets/:id',         moduleId: 'tickets/thread'                  },
        { route: 'users(/:id)',         moduleId: 'users/index',        nav: true   },
        { route: 'settings*details',    moduleId: 'settings/index',     nav: true   }
    ]);

    return router.activate();
}
```

To migrate this configuration simply add a function named ```configureRouter``` to the viewmodel you
referenced in the main module. (In this example ```app.js```):

```
configureRouter(routeConfig) {
    routeConfig.map([
        { route: '',                    name: 'root',         redirect: "home/"                                                 },
        { route: 'home',                name: 'home',         moduleId: "home/index",         title: "Home",        nav: true   },
        { route: 'tickets',             name: 'ticketList',   moduleId: "tickets/index",      title: "Tickets",     nav: true   },
        { route: 'tickets/:id',         name: 'tickets',      moduleId: "tickets/thread",     title: "Tickets"                  },
        { route: 'users(/:id)',         name: 'users',        moduleId: "users/index",        title: "Users",       nav: true   },
        { route: 'settings*details',    name: 'settings',     moduleId: "settings/index",     title: "Settings",    nav: true   }
    ]);
}
```

As you can see, the configuration for your routes does not change dramatically. The "title" attribute specifies the text
of the the Browser tab. You can modify this value in your "activate" methods which receive a "routeConfig" as second
parameter:

```
routeConfig.navModel.setTitle("Edit User: John");
```



#### Event Handling

Durandal also provides a functionality to publish and subscribe to global Events. This looks like this:
Subscribe to the Event ...
```
define(['durandal/app'], function (app) {

    var EventListener = function () {
    };

    EventListener.prototype.listen = function () {
        app.on("mySpecialEvent", function (value) {
            // Do whatever you want
        };
    };

    return EventListener;
};
```

and trigger it:
```
define(['durandal/app'], function (app) {

    var EventTrigger = function () {
    };

    EventTrigger.prototype.trigger = function (valueToPublish) {
        app.trigger("mySpecialEvent", valueToPublish);
    };

    return EventTrigger;
};
```

Aurelia provides a plugin called "aurelia-event-aggregator" to deal with such Events:

Use
```
npm install aurelia-event-aggregator --save
```
or
```
jspm install aurelia-event-aggregator
```

to install it. You can now do the following to handle the Example shown above:

Subscribe ...
```
import {inject} from 'aurelia-framework';
import {EventAggregator} from 'aurelia-event-aggregator';

@inject(EventAggregator)
export class EventListener {
    constructor(eventAggregator) {
        this.eventAggregator = eventAggregator;
    }

    listen() {
        this.eventAggregator.subscribe('mySpecialEvent', value => {
            // Do whatever you want
        });
    }
}
```

and publish:
```
import {inject} from 'aurelia-framework';
import {EventAggregator} from 'aurelia-event-aggregator';

@inject(EventAggregator)
export class EventTrigger {
    constructor(eventAggregator) {
        this.eventAggregator = eventAggregator;
    }

    trigger(valueToPublish) {
        this.eventAggregator.publish('mySpecialEvent', valueToPublish);
    }
}
```


### Polyfills

For the most "modern" browsers versions of Chrome or Firefox you don't need additional Polyfills to get your application
running. For older versions or the Internet Explorer you have to add some polyfills as well:

| API                                         | Polyfills             |
| ------------------------------------------- | --------------------- |
| Promise                                     | Bluebird, Q, core-js  |
| Fetch (if you use the aurelia-fetch-client) | whatwg-fetch, core-js |

Aurelia's own polyfill library "aurelia-polyfills" only contains a minimal set of functions which are mostly used
by Aurelia itself.


### Templating

The basic structure of components in Durandal.js and Aurelia are the same for the most part.
You have a single view which has a single backing view-model, which the view is bound to.
In keeping true to the evolving web components specs Aurelia requires the author to wrap the
view in `<template>` tags.

To convert a view over all you should need to do is wrap the template -

```language-markup
<div>
  <p>My cool view</p>
</div>
```
becomes

```language-markup
<template>
  <div>
    <p>My cool view</p>
  </div>
</template>
```


### The Syntax of Data Binding

In Durandal.js it was very typical to use Knockout.js for Data-binding.  This is not prevented
in Aurelia and you can easily continue to use your Knockout binding syntax, but we'd like to
offer how you can switch your data-binding over to the Aurelia-way if you choose to.

#### Switch to full Aurelia syntax

In Knockout.js the binding syntax was defined through a single attribute `data-bind` but in
Aurelia the bindings are segragated out in to their own attributes.  Example -

Knockout.js
```
<input data-bind="value: myProperty" />
```

Aurelia
```
<input value.bind="myProperty" />
```

Here are a few examples for the most important bindings:

##### Text binding

Knockout.js
```
<span data-bind="text: myProperty"></span>
```

Aurelia
```
<span>${myProperty}</span>
```

##### Value binding

Knockout.js
```
<input data-bind="value: myProperty" />
```

Aurelia
```
<input value.bind="myProperty" />
```

##### If binding

Knockout.js
```
<span data-bind="if: myCondition"></span>
```

Aurelia
```
<span if.bind="myCondition"></span>
```

##### Repeater binding

Knockout.js
```
<div data-bind="foreach: items">
  <span data-bind="text: name"></span>
</div>
```

Aurelia
```
<div>
  <span repeat.for="item of items">${item.name}</span>
</div>
```

##### Style bindings

Knockout.js
```
<div data-bind="style: { width: width() + 'px', height: height() + 'px' }">
</div>
```

Aurelia
```
<div style="width: ${width}px; height: ${height}px;">
</div>
```

##### CSS bindings

Knockout.js
```
<div data-bind="css: { multiline: lineLength() > 1 }">
</div>
```

Aurelia
```
<div class="${lineLength() > 1 ? 'multiline' : ''}">
</div>
```

##### HTML bindings

Knockout.js
```
<div data-bind="html: content">
</div>
```

Aurelia
```
<div innerhtml.bind="content">
</div>
```

As you can see you have also the possibility to use string interpolation to bind variables.



#### Use your Knockout Views in Aurelia

Because the complete rewrite of all your views and view-models from Knockout bindings to full Aurelia syntax is
much effort you can use the Knockout plugin for Aurelia. You have to install and configure it, like the following:
```
npm install aurelia-knockout --save
```
or
```
jspm install aurelia-knockout
```

Add it to your ````main.js```:
```
export function configure(aurelia) => {
    aurelia.use
        .standardConfiguration()
        .developmentLogging()
        .plugin("aurelia-knockout");

    aurelia.start().then(() => aurelia.setRoot());
}
```

First, surround all your views with the ```<template>``` tag as described above. Now add a element which surrounds the
whole HTML structure where Knockout syntax is used (Do not use the ```<template>``` tag for this). You have to apply
this to each of your views. Add the standalone ```knockout``` custom attribute to this element:

```
<button data-bind="click: changeVisibility">Change Visibility</button>
<div data-bind="if: isVisible">
    <span data-bind="text: firstName"></span>
    <br/>
    <span data-bind="text: lastName"></span>
</div>
```

becomes

```
<template>
    <div knockout>
        <button data-bind="click: changeVisibility">Change Visibility</button>
        <div data-bind="if: isVisible">
            <span data-bind="text: firstName"></span>
            <br/>
            <span data-bind="text: lastName"></span>
        </div>
    </div>
</template>
```

The plugin applies all Knockout bindings in the subsequent DOM tree to the current Aurelia BindingContext
(Typically the backing view-model).


#### Compose binding handler

When using Knockout.js with Durandal.js there was a `compose` binding handler that is
available to the author.  This very powerful feature is available in Aurelia as well as a
`custom element`.

```language-markup
<div data-bind="compose: './some-path'"></div>
```
becomes
```language-markup
<compose view-model="./some-path"><compose>
```

or in a more complex scenario -

```language-markup
<div data-bind="compose: { model: someModelProperty, view: './some-path' }""></div>
```
becomes
```language-markup
<compose view-model="./some-path" model.bind="someModelProperty"><compose>
```

Functionally this should work almost exactly the same as before.

In order not to rewrite all compositions, you can use the Knockout plugin as described above. It handles all
composition variants specified in the [official durandal docs](http://durandaljs.com/documentation/Using-Composition.html):

```
<div data-bind="compose: 'path/to/view.html'"></div>
<div data-bind="compose: 'path/to/module'"></div>
<div data-bind="compose: { view: 'path/to/view.html' }"></div>
<div data-bind="compose: { model: 'path/to/module' }"></div>
<div data-bind="compose: { model: moduleInstance }"></div>
<div data-bind="compose: { view: 'path/to/view.html' model: 'path/to/module' }"></div>
<div data-bind="compose: { view: 'path/to/view.html' model: moduleInstance }"></div>
<div data-bind="compose: moduleInstance"></div>
<div data-bind="compose: moduleConstructorFunction"></div>
```


### Dependency Injection

Many Durandal apps used require.js for resolving module dependencies and injecting instances
in to the view-model.  With require.js the dependencies were listed at the top of the view-model.
In Aurelia, they should still be listed at the top but the syntax follows the ES2015+ class syntax -

```language-javascript
define(['ko', 'services/some-service'], function (ko, someService) {
    var MyViewModel = function () {
        this.someProperty = ko.observable();
        this.someService = someService;
    };

    return MyViewModel;
});
```
becomes
```language-javascript
import ko from 'ko';
import {SomeService} from 'services/some-service';
import {inject} from 'aurelia-dependency-injection';

@inject(SomeService)
export class MyViewModel {
    constructor(someService) {
        this.someService = someService;
        this.someProperty = new ko.observable();
    }
}
```

The Aurelia dependency injection uses constructor injection.

