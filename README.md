<p>
  <a href="https://aurelia.io/" target="_blank">
    <img alt="Aurelia" src="https://aurelia.io/styles/images/aurelia.svg">
  </a>
</p>

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![npm Version](https://img.shields.io/npm/v/aurelia-framework.svg)](https://www.npmjs.com/package/aurelia-framework)
[![CircleCI](https://circleci.com/gh/aurelia/framework.svg?style=shield)](https://circleci.com/gh/aurelia/framework)
[![Discourse status](https://img.shields.io/discourse/https/meta.discourse.org/status.svg)](https://discourse.aurelia.io)

# aurelia-framework

Aurelia is a modern, front-end JavaScript framework for building browser, mobile, and desktop applications.

This library is part of the [Aurelia](http://www.aurelia.io/) platform. It contains the `aurelia-framework` library, which brings together all the required core aurelia libraries into a ready-to-go application-building platform.

Aurelia applications are built by composing a series of simple components. By convention, components are made up of a vanilla JavaScript or Typescript class, with a corresponding HTML template. 

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

> Check out the interactive version of this example on [Code Sandbox](https://codesandbox.io/s/849oxmjm82).

As you may have guessed, this will render `Hello World!`  into the `<h1>` element on the page. This is just a basic example of how you can use Aurelia's simple, declarative syntax to render a value from your backing view-model to your view. But of course, you can do much more! To see further examples, online playgrounds, guides, and detailed API documentation, head on over to [aurelia.io](https://aurelia.io).

## Documentation

You can read the documentation for the aurelia framework [here](http://aurelia.io/docs). It's divided into the following sections:

* [Overview](https://aurelia.io/docs/) : Discover what Aurelia is along with its business and technical advantages.
* [Tutorials](https://aurelia.io/docs/tutorials) : Step-by-step tutorials teaching you how to build your first Aurelia applications.
* [Fundamentals](https://aurelia.io/docs/) : After you've completed the quick starts, learn more about Aurelia's app model, components, dependency injection and more.
* [Binding](https://aurelia.io/docs/binding): Learn all about Aurelia's powerful, reactive binding engine.
* [Templating](https://aurelia.io/docs/binding): Learn all about Aurelia's powerful templating engine.
* [Routing](https://aurelia.io/docs/routing): Learn how to setup and configure Aurelia's router.
* [Plugins](https://aurelia.io/docs/plugins): Learn about Aurelia's officially supported plugins and how to use them, including validation, i18n, http, dialog and state management.
* [Integration](https://aurelia.io/docs/integration): Learn how to integrate Aurelia with various other libraries and frameworks.
* [Testing](https://aurelia.io/docs/testing): Learn all about testing Aurelia apps, including component testing and e2e testing.
* [Server Side Rendering](https://aurelia.io/docs/ssr): Learn about Server Side Rendering with Aurelia and how to configure your project.
* [CLI](https://aurelia.io/docs/cli): Learn how to create, build, bundle and test your apps using all your favorite tools, facilitated by the Aurelia CLI.
* [Build Systems](https://aurelia.io/docs/build-systems): Learn how to use Webpack or JSPM directly for building apps without the Aurelia CLI.
  
> You can improve the documentation by contributing to [this repository](https://github.com/aurelia/documentation).

## Staying Up-to-Date

To keep up to date on [Aurelia](http://www.aurelia.io/), please visit and subscribe to [the official blog](http://blog.aurelia.io/) and [our email list](http://eepurl.com/ces50j). We also invite you to [follow us on twitter](https://twitter.com/aureliaeffect).

## Questions

If you have questions, join us in [our dedicated discourse forum](https://discourse.aurelia.io/) or submit questions on [stack overflow](http://stackoverflow.com/search?q=aurelia).

## Contributing

We'd love for you to contribute and help make Aurelia even better than it is today! You can start by checking out our [contributing guide](CONTRIBUTING.md), which has everything you need to get up and running.

## License 

Aurelia is MIT licensed. You can find out more and read the license document [here](LICENSE).
