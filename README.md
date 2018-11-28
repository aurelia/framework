<div align="center" style="display:flex; justify-content:center">
  <a href="https://aurelia.io" target="_blank" rel="noopener noreferrer">
    <img width="100" src="https://aurelia.io/styles/images/aurelia-icon.svg" alt="Aurelia logo">
  </a>
</div>

<div align="center">

  [![npm Version](https://img.shields.io/npm/v/aurelia-framework.svg)](https://www.npmjs.com/package/aurelia-framework)
  [![ZenHub](https://raw.githubusercontent.com/ZenHubIO/support/master/zenhub-badge.png)](https://zenhub.io)
  [![Join the chat at https://gitter.im/aurelia/discuss](https://badges.gitter.im/Join%20Chat.svg)](https://gitter.im/aurelia/discuss?utm_source=badge&utm_medium=badge&utm_campaign=pr-badge&utm_content=badge)
  [![CircleCI](https://circleci.com/gh/aurelia/framework.svg?style=shield)](https://circleci.com/gh/aurelia/framework)

</div>

<h1 align="center" style="color:#6d50a2">aurelia-framework</h1>

Aurelia is a modern front-end JavaScript framework for building browser, mobile and desktop applications.

This library is part of the [Aurelia](http://www.aurelia.io/) platform. It contains the aurelia framework which brings together all the required core aurelia libraries into a ready-to-go application-building platform.

Aurelia applications are built by composing a series of simple components. By convention components are made up of a vanilla JavaScript or Typescript class, with a corresponding HTML template. 

```js
//app.js
export class App {
  message = 'Hello World!';
}
```

```html
<!-- app.html -->
<template>
  <h1>${message}</h1>
</template>

```
>Check out the interactive version of this example at [Code Sandbox](https://codesandbox.io/s/849oxmjm82).

As you may have guessed, this will render `Hello World!`  into the `<h1>` element on the page. This is just a basic example of how you can use Aurelia's simple, declaritive binding syntax to render a value from your backing view-model to your view, but of course you can do much more! To see further examples, online playgrounds, guides, and detailed API documentation. Head on over to [aurelia.io](https://aurelia.io).


# Documentation

You can read the documentation for the aurelia framework [here](http://aurelia.io/docs). It's divided into the following sections:

* [Overview](https://aurelia.io/docs/) : Discover what Aurelia is along with its business and technical advantages.
* [Tutorials](https://aurelia.io/docs/tutorials) : Step-by-step tutorials teaching you how to build your first Aurelia applications.
* [Fundamentals](https://aurelia.io/docs/) : After you've completed the quick starts, learn more about Aurelia's app model, components, dependency injection and more.
* [Binding](https://aurelia.io/docs/binding): Learn all about Aurelia's powerful data-binding engine.
* [Templating](https://aurelia.io/docs/binding): Learn all about Aurelia's powerful templating engine.
* [Routing](https://aurelia.io/docs/routing): Learn how to setup and configure Aurelia's router.
* [Plugins](https://aurelia.io/docs/plugins): Learn about Aurelia's officially supported plugins and how to use them.
* [Integration](https://aurelia.io/docs/integration): Learn how to integrate Aurelia with various other libraries and frameworks.
* [Testing](https://aurelia.io/docs/testing): Learn all about testing Aurelia apps, including component testing and e2e testing.
* [Server Side Rendering](https://aurelia.io/docs/ssr): Learn about Server Side Rendering with Aurelia and how to configure your project.
* [CLI](https://aurelia.io/docs/cli): Learn how to create, build, bundle and test your apps using all your favorite tools, facilitated by the Aurelia CLI.
* [Build Systems](https://aurelia.io/docs/build-systems): Various systems for building and bundling Aurelia apps.
  
>You can improve the documentation by contributing to [this repository](https://github.com/aurelia/documentation).

# Staying up to date
To keep up to date on [Aurelia](http://www.aurelia.io/), please visit and subscribe to [the official blog](http://blog.aurelia.io/) and [our email list](http://eepurl.com/ces50j). We also invite you to [follow us on twitter](https://twitter.com/aureliaeffect).  If you would like to have deeper insight into our development process, please install the [ZenHub](https://zenhub.io) Chrome or Firefox Extension and visit any of our repository's boards.

# Questions
If you have questions look around our [Discourse forums](https://discourse.aurelia.io/), chat in our [community on Gitter](https://gitter.im/aurelia/discuss) or use [stack overflow](http://stackoverflow.com/search?q=aurelia).

# Contributing
We'd love for you to contribute and to make this project even better than it is today! You can start by checking out our [contributing guide](CONTRIBUTING.md), which has everything you need to get up and running.

# License 
Aurelia is MIT licensed. You can find out more and read the license document [here](LICENSE).
