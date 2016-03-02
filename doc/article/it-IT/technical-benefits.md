---
{
  "name": "Technical Benefits",
  "culture": "en-US",
  "description": "There are many technical advantages to using Aurelia. In this article, you will find a list of points we think are interesting. Taken together, there is no other SPA framework today that can match Aurelia.",
  "engines" : { "aurelia-doc" : "^1.0.0" },
  "author": {
  	"name": "Rob Eisenberg",
  	"url": "http://robeisenberg.com"
  },
  "contributors": [],
  "translators": [],
  "keywords": ["Benefits", "Capabilities"]
}
---
## [Modern JavaScript](aurelia-doc://section/1/version/1.0.0)

* The only framework fully written in standards-based ES 2015 and ES 2016.
* Forward compatible with JavaScript technology that is 2-3 years in the future.
* Full support for TypeScript.

## [Modern DOM](aurelia-doc://section/2/version/1.0.0)

* Consistently leverages the most modern DOM APIs.
* Bare “to the metal” usage of the DOM; no DOM wrappers in order to ensure maximum performance and memory efficiency.
* Automatically polyfills the DOM where appropriate, in order to support older browsers (IE9).

## [Modern Tooling](aurelia-doc://section/3/version/1.0.0)

* Designed to work with modern ES 2015-oriented package managers like JSPM.
* Intended to be used with modern transpilers such as Babel and TypeScript.
* Supports modern build tooling such as Gulp, out-of-the-box.
* Works well with powerful testing tools like Karma and Protractor.

## [Code Quality](aurelia-doc://section/4/version/1.0.0)

* Source code is covered by an extensive suite of unit tests.
* All source is fully linted for style and feature-usage consistency throughout.
* Code correctness is independently verified by two transpilers: Babel and TypeScript.
* TypeScript d.ts files and full API documentation are provided for all libraries.

## [Web Component Standards](aurelia-doc://section/5/version/1.0.0)

* Leverages standards-compliant Web Components specs such as HTMLTemplateElement and ShadowDOM.
* Aurelia components can be exported as standards-compliant Web Components for use outside of the framework, in other apps and web pages (soon).
* Fully compatible with 3rd-party Web Components, even those originating from other frameworks such as Polymer.
* Shields developers from broken or poorly designed aspects of Web Components.
* Provides a Web Component-based programming model even on browsers that will never support Web Components (IE).

## [Modularity](aurelia-doc://section/6/version/1.0.0)

* Highly modular development, suitable for large-scale apps.
* Native support for feature-based development facilitating parallel development of multiple teams on the same app.
* Strong component model for high re-use of UI components across apps.
* Export components as spec-compliant Web Components for use in non-Aurelia apps (soon)

## [Platform Support](aurelia-doc://section/7/version/1.0.0)

* Designed for modern web browsers.
* Adds polyfills to support older browsers, such as IE9.
* A core platform abstraction allows execution of Aurelia in different types of JavaScript environments: browser, NodeJS, Windows Store, etc.
* Designed for mobile application development in combination with PhoneGap/Cordova/Crosswalk.
* Designed for desktop application development in combination with Electron or NWJS.

## [Capabilities](aurelia-doc://section/8/version/1.0.0)

* Write apps in ES2015/2016/TypeScript.
* One simple way of creating components that work in a variety of contexts:
    * Custom Elements
    * Dynamically Composed UI (data-driven component composition)
    * Routing/Navigation
    * Modal Dialogs
    * Web Components
    * Progressive Enhancement
    * Custom scenarios enabled through our Composition Engine
* Fully-extensible View Compiler, View Engine and View Resource Pipeline.
* Fully-extensible and adaptive data-binding engine.
* Powerful and flexible hierarchical dependency injection.
* Eager/Lazy/Hybrid loading of all application resources.
* Powerful application router with support for encapsulated child routers for multi-team, large-scale development.
* Optionally create standards-compliant Web Components or leverage “shielding” from the flaws in the WC specs.
* Interoperate with any standards-compliant Web Component.
* Loosely coupled cross-component communication via an EventAggregator (Pub/Sub)
* Fully customizable application startup and plugin model.
* Enables authoring of testable, maintainable and extensible code.
* Leverage conventions to write less code and get more done.
* Little to no framework intrusion, so developers can focus on their app, not the framework.
* Application and package bundling compatible with any build system.
