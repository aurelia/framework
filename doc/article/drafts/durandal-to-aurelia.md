# Upgrading to Aurelia from Durandal.js

## Introduction

At the moment we don't have an automated way of updating an app from Durandal.js to Aurelia but luckily the process isn't that painful.  All-in-all it takes about 2 minutes roughly per file to update.

Upgrading has many benefits - for one it gives us the opportunity to improve performance and our codes' readability but it also gives us the chance to identify some common mistakes that are in need of refactoring along the way.  Refactoring is of course optional and we can upgrade and mostly leave our core code untouched.

## Requirements

1. Durandal.js app to convert
2. 2 minutes times n number of files of available time
3. Understand what it means to transpile JavaScript code with a tool such as BabelJs

## Getting started

From the fundamental perspective we need to understand what the most common changes that will need to be made are -

### Module format

ES6/ES2015+ allows using an updated module format that is more standardized.  In the past we were forced to either use AMD or CommonJs but now we have the ability to write proper JavaScript classes that can be transpiled to any of the two formats or a newer format called System.

A good example of this format can be seen here -

```language-javascript
export class MyViewModel {
  constructor() {
    console.log('Constructed')
  }
  activate() {
    console.log('Activate method was called')
  }
}
```

In addition to using the ES6 class format we can even go further and move some of our modules' properties to ES7 class instance fields.  These are just a clean way of defining the properties that our class has -

```language-javascript
class MyViewModel {
  myProperty = '';
}
```

MyProperty is simply a property that is added to `this` class.

With these changes in mind we can assume that you not only want to update your app to use Aurelia but also want to use the proper module format.  There are at least two methods you can use when updating -

1. Move everything in to the constructor and define them as properties of the class.
2. Convert all the code to proper ES6+ module syntax

If you choose #1 you can move code that follows the revealing module pattern or that returns a constructor function like this -

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

The big fundamental difference here is that instead of using a looser JavaScript object we are relying on a well-defined class structure.

### Data-binding

In Durandal.js it was very typical to use Knockout.js for Data-binding.  This is not prevented in Aurelia and you can easily continue to use your Knockout binding syntax, but we'd like to offer how you can switch your data-binding over to the Aurelia-way if you choose to.

#### Option 1

Switch to full Aurelia syntax -

In Knockout.js the binding syntax was defined through a single attribute `data-bind` but in Aurelia the bindings are segragated out in to their own attributes.  Example -

Knockout.js
```language-javascript
<input data-bind="value: myProperty" />
```

Aurelia
```language-javascript
<input value.bind="myProperty" />
```

If you want to get a good idea for updating syntax you can use this as a reference -

##### Value binding

Knockout.js
```language-javascript
<input data-bind="value: myProperty" />
```

Aurelia
```language-javascript
<input value.bind="myProperty" />
```

##### Repeater binding

Knockout.js
```language-javascript
<div data-bind="foreach: items">
  <span data-bind="text: name"></span>
</div>
```

Aurelia
```language-javascript
<div>
  <span repeat.for="item of items">${item.name}</span>
</div>
```

##### Style bindings

Knockout.js
```language-javascript
<div data-bind="style: { width: width() + 'px', height: height() + 'px' }">
</div>
```

Aurelia
```language-javascript
<div css="width: ${width}px; height: ${height}px;">
</div>
```

#### Option 2

You can directly use your view-models from Durandal.js with this simple trick from @zewa666 -

http://stackoverflow.com/questions/28335502/using-amd-module-as-an-aurelia-viewmodel

### Templating

The basic structure of components in Durandal.js and Aurelia are the same for the most part.  You have a single view which has a single backing view-model, which the view is bound to.  In keeping true to the evolving web components specs Aurelia requires the author to wrap the view in `template` tags.

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

#### Compose binding handler

When using Knockout.js with Durandal.js there was is a `compose` binding handler that is available to the author.  This very powerful feature is available in Aurelia as well as a `custom element`.

```language-markup
<div data-bind="compose: './some-path'"></div>
```
becomes
```language-markup
<compose view-model="./some-path"><compose>
```

or in a more complex scenario -

```language-markup
<div data-bind="compose: { model:someModelProperty, view: './some-path' }""></div>
```
becomes
```language-markup
<compose view-model="./some-path" model.bind="someModelProperty"><compose>
```

Functionally this should work almost exactly the same as before.

### Dependency Injection

Many Durandal apps used require.js for resolving module dependencies and injecting instances in to the view-model.  With require.js the dependencies were listed at the top of the view-model.  In Aurelia, they should still be listed at the top but the syntax follows the ES6+ class syntax -

```language-javascript
define(['ko', 'services/some-service'], function (ko, someService) {
  var ctor = {
     this.someProperty = ko.observable();
     this.someService = someService;
  }
  return ctor;
});
```
becomes
```language-javascript
import ko from 'knockout';
export class MyViewModel {
  static inject = [SomeService];
  constructor(someService) {
    this.someService = someService;
    this.someProperty = new ko.observable();
  }
}
```

