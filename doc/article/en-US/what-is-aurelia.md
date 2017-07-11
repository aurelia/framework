---
{
  "name": "What is Aurelia?",
  "culture": "en-US",
  "description": "Aurelia is a modern front-end framework for building browser, mobile and desktop applications.",
  "engines" : { "aurelia-doc" : "^1.0.0" },
  "author": {
  	"name": "Rob Eisenberg",
  	"url": "http://robeisenberg.com"
  },
  "contributors": [],
  "translators": [],
  "keywords": ["JavaScript", "SPA"]
}
---
## [What is Aurelia?](aurelia-doc://section/1/version/1.0.0)

Aurelia is a collection of Modern JavaScript modules, which when used together, function as a powerful platform for building browser, desktop and mobile applications, all open source and built on open web standards.

Let's unpack this statement a little...

### A Collection of Modern JavaScript Modules

Rather than being a monolithic framework, Aurelia is broken down into a collection of feature-oriented modules. Examples of feature modules include metadata, dependency injection, binding, templating, router and more. Each module is written using ECMAScript (aka JavaScript) or TypeScript (a strict superset of JavaScript that adds compile-time type checking). Many of these modules can be used individually in any type of JavaScript project, including Node.js.

### A Powerful Platform for Building Apps

While Aurelia's modules can be used for many purposes, their true power lies in using them together as a front-end application platform. If your end goal is to create rich, engaging experiences for your customers, meeting or exceeding what is found in modern native applications, Aurelia provides the means. Through its rich component model, dynamic UI composition, routing and extensive set of plugins, Aurelia provides a comprehensive set of capabilities and tools to build any front-end experience you can dream up, whether you're targeting the browser, mobile or desktop.

### Open Source

With all the power and capability that Aurelia offers, you might expect it to have an expensive licensing model or be closed source, but neither is true. Aurelia is free and its code is open sourced under [the MIT License](http://opensource.org/licenses/MIT), a very permissive license used by many popular web projects today. Its starter kits and documentation are available under [the Creative Commons 0](http://creativecommons.org/publicdomain/zero/1.0/legalcode) license. It also has [a Contributor License Agreement (CLA)](https://github.com/durandalproject/about/blob/master/CLA.md) for those who wish to join the core team in working on Aurelia. Ultimately, this means that you can use Aurelia without fear of legal repercussions and we can build it in the same confidence.

### Built on Open Web Standards

Not only is Aurelia written with ECMAScript, but it's also designed to make careful use of the DOM standard. Rather than Aurelia utilizing a costly abstraction over the DOM, implementing its own custom HTML parser or adopting framework-specific JavaScript extensions, it leverages the latest DOM APIs to get "bare metal" performance, exceptional memory efficiency and all while staying synced with the continuous improvements of the browser platform itself. Additionally, Aurelia's component model is based on W3C Web Components HTML Templates and ShadowDOM, so you know it will stand the test of time and will enable you to evolve your application along with advances in the standards, without major application re-writes or framework churn.

## [Why choose Aurelia?](aurelia-doc://section/2/version/1.0.0)

There are many frameworks to choose from today. We believe that Aurelia provides a fresh and exciting approach to front-end development with power and flexibility that is unmatched by other options. That said, we recognize that each team and each project has different needs. You might find Aurelia to be the right choice for you if...

* **You want an all-in-one solution** - Aurelia provides core capabilities like dependency injection, templating, routing and pub/sub, so you don't have to piece together a bunch of libraries in order to build an application. On top of this rich core, Aurelia also provides a number of additional plugins for internationalization, validation, modal dialogs, UI virtualization and much more. You also don't have to cobble together a bunch of different tools. Aurelia provides a CLI for generating and building projects, a browser plugin for debugging and a VS Code plugin as well.
* **You need blazing rendering speed and great memory efficiency** - In 3rd-party benchmarks like DB Monster, Aurelia renders faster than any other framework today. Because of its batched rendering and observable object pooling, Aurelia also utilizes less memory and causes less GC churn than other frameworks.
* **You require the safety of uni-directional data-flow, but need the productivity of data-binding** - Aurelia features an observable-based binding system that uses uni-directional data-flow by default, pushing data from your model into your view via a highly efficient, DOM-batching mechanism. Two-way binding can also be leveraged for HTML form controls, allowing for increased developer productivity, without sacrificing the safety of uni-directional flow or that of component encapsulation.
* **You desire API stability amidst a turbulent JavaScript landscape** - Aurelia follows Semver and works hard not to make breaking changes to its APIs. We're proud to say that we've continued to innovate and advance the platform while having no breaking changes to core framework APIs since our 1.0 release on July 27, 2016.
* **You value high standards compliance** - Focused on ES2015+ and W3C Web Components while avoiding unnecessary abstractions, Aurelia provides the cleanest and most standards-compliant component model you'll find anywhere.
* **You think a framework should "get out of your way"** - Aurelia is the only framework that lets you build components with plain, vanilla JavaScript. The framework stays out of your way so your code remains clean and easy to evolve over time.
* **You like programming models that are easy to learn and remember** - Because of its simple, consistent design, developers are able to learn a very small set of Aurelia patterns and APIs while unlocking limitless possibilities. Simple conventions help developers follow solid patterns and reduce the amount of code they have to write and maintain. This all results in less fiddling with the framework and more focus on the application.
* **You prefer a platform that integrates well with other frameworks and libraries** - Because of the extensible design of Aurelia and its strict adherence to web standards, it's easy to integrate Aurelia with any 3rd party library or framework, including jQuery, React, Polymer, Bootstrap, MaterializeCSS and many more.
* **You love or want to be a part of open source** - Aurelia is open sourced under the MIT license and doesn't add or remove special clauses or conditions to the license. We're proud of the work our community has done together and we'd love you to join in and help us make Aurelia better for everyone.
* **You thrive on being part of a welcoming community** - With one of the largest and most active developer gitter channels, a huge number of contributors and a large, active core team, Aurelia has an amazing community. Our core team and community love to welcome new developers and we all work hard to help each other succeed.
