---
{
  "name": "Integrating with Polymer",
  "culture": "en-US",
  "description": "Polymer is a library for creating reusable web components declaratively with extra features like data binding and property observation. In many ways, it is similar to Aurelia's component support. However, Polymer also includes an extensive catalog of custom elements for everything from material design to credit card forms to embedding Google services like Google Maps and YouTube. With a bit of work, these components can be incorporated into Aurelia applications as well.",
  "engines" : { "aurelia-doc" : "^1.0.0" },
  "author": {
  	"name": "Ben Navetta",
  	"url": "https://www.linkedin.com/in/benjaminnavetta"
  },
  "contributors": [],
  "translators": [],
  "keywords": ["Integration", "Web Components", "Polymer"]
}
---
## [Setup](aurelia-doc://section/1/version/1.0.0)

The first step is obtaining Polymer, which is generally done with the [Bower](http://bower.io/) package manager. The following `bower.json` will install Polymer's base and material design elements.

<code-listing heading="Bower Config">
  <source-code lang="JSON">
    {
      "name": "my-aurelia-polymer-project",
      "private": true,
      "dependencies": {
        "polymer": "Polymer/polymer#^1.2.0",
        "paper-elements": "PolymerElements/paper-elements#^1.0.6",
        "iron-elements": "PolymerElements/iron-elements#^1.0.4",
        "webcomponentsjs": "webcomponents/webcomponentsjs#^0.7.20"
      }
    }
  </source-code>
</code-listing>

Make sure Bower is installed and then use Bower to install the packages for each of the Polymer elements.

<code-listing heading="Bower Package Installation">
  <source-code lang="Shell">
    $ npm install -g bower
    $ bower install
  </source-code>
</code-listing>

Aurelia must also be configured to use the HTML Imports template loader and the `aurelia-polymer` plugin, both of which can be installed with JSPM.

<code-listing heading="Plugin Installation">
  <source-code lang="Shell">
    $ jspm install aurelia-html-import-template-loader
    $ jspm install aurelia-polymer@^1.0.0-beta
  </source-code>
</code-listing>

In `index.html`, Polymer and the webcomponents.js polyfills need to be loaded before Aurelia is, so that the `aurelia-polymer` plugin can hook into Polymer's element registration system.

<code-listing heading="Loading Web Components and Polymer">
  <source-code lang="HTML">
    <!DOCTYPE html>
    <html>
      <head>
        <!-- ... -->
        <script src="bower_components/webcomponentsjs/webcomponents-lite.js"></script>
        <link rel="import" href="bower_components/polymer/polymer.html">
      </head>
      <!-- ... -->
    </html>
  </source-code>
</code-listing>

It's also a good idea to wait until the web components polyfill has loaded Polymer to bootstrap Aurelia. Instead of directly importing `aurelia-bootstrapper`, wait until the `WebComponentsReady` event fires in `index.html`.

<code-listing heading="Bootstrapping Aurelia">
  <source-code lang="HTML">
    <!DOCTYPE html>
    <script>
      document.addEventListener('WebComponentsReady', function() {
        System.import('aurelia-bootstrapper');
      });
    </script>
  </source-code>
</code-listing>

In `main.js`, the two Aurelia plugins installed before need to be loaded as well.

<code-listing heading="Configuring Aurelia">
  <source-code lang="ES 2015/2016">
    export function configure(aurelia) {
      aurelia.use
        .standardConfiguration()
        .developmentLogging();

      aurelia.use.plugin('aurelia-polymer');
      aurelia.use.plugin('aurelia-html-import-template-loader');

      aurelia.start().then(a => a.setRoot());
    }
  </source-code>
  <source-code lang="TypeScript">
    import {Aurelia} from 'aurelia-framework';

    export function configure(aurelia: Aurelia): void {
      aurelia.use
        .standardConfiguration()
        .developmentLogging();

      aurelia.use.plugin('aurelia-polymer');
      aurelia.use.plugin('aurelia-html-import-template-loader');

      aurelia.start().then(a => a.setRoot());
    }
  </source-code>
</code-listing>

At this point, Aurelia and Polymer are ready to go. The examples below incorporate various Polymer elements into the Aurelia skeleton navigation starter.

## [Importing Elements](aurelia-doc://section/2/version/1.0.0)

With the normal Aurelia template loader, nothing is allowed outside the root `<template>` element. When using HTML imports, however, the import statements must be before the `<template>`.

<code-listing heading="Using HTML Imports">
  <source-code lang="HTML">
    <link rel="import" href="/bower_components/paper-drawer-panel/paper-drawer-panel.html">
    <link rel="import" href="/bower_components/paper-toolbar/paper-toolbar.html">
    <link rel="import" href="/bower_components/paper-menu/paper-menu.html">
    <link rel="import" href="/bower_components/paper-item/paper-item.html">
    <link rel="import" href="/bower_components/paper-scroll-header-panel/paper-scroll-header-panel.html">
    <link rel="import" href="/bower_components/paper-icon-button/paper-icon-button.html">
    <link rel="import" href="/bower_components/iron-icons/iron-icons.html">

    <template>
      <!-- ... -->
    </template>
  </source-code>
</code-listing>

## [Data Binding](aurelia-doc://section/3/version/1.0.0)

Given the imports above, this shows how to implement a basic layout in `app.html` with Polymer components.

<code-listing heading="Using Polymer Elements">
  <source-code lang="HTML">
    <template>
      <paper-drawer-panel force-narrow>
        <div drawer>
          <paper-toolbar class="paper-header">
            <span>Menu</span>
          </paper-toolbar>
          <paper-menu>
            <paper-item repeat.for="row of router.navigation" active.bind="row.isActive">
              <a href.bind="row.href">${row.title}</a>
            </paper-item>
          </paper-menu>
        </div>
        <div main>
          <paper-toolbar class="paper-header">
            <paper-icon-button icon="menu" tabindex="1" paper-drawer-toggle></paper-icon-button>
            <div class="title">${router.title}</div>
            <span if.bind="router.isNavigating"><iron-icon icon="autorenew"/></span>
          </paper-toolbar>
          <div>
            <router-view></router-view>
          </div>
        </div>
      </paper-drawer-panel>
    </template>
  </source-code>
</code-listing>

Notice that Poylmer elements such as `<paper-drawer-panel>` or `<paper-menu>`, once imported, can be used just like
normal HTML elements.

All of the standard Aurelia binding syntax continues to work as well. For example,
`repeat.for` is used to populate menu items from the Aurelia router. The `active.bind`
binding on the `<paper-item>` elements in the navigation menu shows that attributes
defined by Polymer are also supported by Aurelia.

## [Forms and Two-Way Binding](aurelia-doc://section/4/version/1.0.0)

The updated `welcome.html` uses Polymer input elements to enhance its form.

<code-listing heading="Using Polymer in a Form">
  <source-code lang="HTML">
    <link rel="import" href="../bower_components/paper-input/paper-input.html">
    <link rel="import" href="../bower_components/iron-form/iron-form.html">

    <template>
      <section class="au-animate">
        <h2>${heading}</h2>
        <form is="iron-form" role="form" submit.delegate="submit()">
          <div class="form-group">
            <label for="fn">First Name</label>
            <paper-input id="fn" value.two-way="firstName" placeholder="first name"></paper-input>
          </div>
          <div class="form-group">
            <label for="ln">Last Name</label>
            <paper-input id="fn" value.two-way="lastName" placeholder="last name"></paper-input>
          </div>
          <div class="form-group">
            <label>Full Name</label>
            <p class="help-block">${fullName | upper}</p>
          </div>
          <button type="submit" class="btn btn-default">Submit</button>
        </form>
      </section>
    </template>
  </source-code>
</code-listing>

While not strictly necessary in this case, making the form an `<iron-form>` ensures
that Polymer input elements are submitted along with native HTML elements.

Note that the `<paper-input>` elements have `.two-way` bindings, not just `.bind`.
With the exception of native HTML form elements, Aurelia defaults to one-way bindings,
so two-way data binding must be specified explicitly.

A normal `<button>` element is used with Aurelia's `submit.delegate` binding, since
Polymer elements cannot submit forms.

If form submission semantics were not needed, another option would be to
use a `click.delegate` on a Polymer button instead.

<code-listing heading="Polymer Element with Event Delegation">
  <source-code lang="HTML">
    <paper-button raised click.delegate="submit()">Submit</paper-button>
  </source-code>
</code-listing>

## [How the Plugin Works](aurelia-doc://section/5/version/1.0.0)

The `aurelia-polymer` plugin is fairly simple. For each Polymer element, it
registers the element's properties and what events they support with the
`EventManager` in Aurelia's binding component. The core of the plugin, the
[`registerElement`](https://github.com/roguePanda/aurelia-polymer/blob/1.0.0-beta.1.0.1/src/index.js#L7)
function, loops over all properties of the element and any behavior it implements
so that the Aurelia binding engine will register event listeners properly.

<code-listing heading="Element Registration">
  <source-code lang="ES 2015/2016">
    var propertyConfig = {'bind-value': ['change', 'input']}; // Not explicitly listed for all elements that use it

    function handleProp(propName, prop) {
      if (prop.notify) {
        propertyConfig[propName] = ['change', 'input'];
      }
    }

    Object.keys(prototype.properties).forEach(propName => handleProp(propName, prototype.properties[propName]));

    prototype.behaviors.forEach(behavior => {
      if (typeof behavior.properties != 'undefined') {
        Object.keys(behavior.properties).forEach(propName => handleProp(propName, behavior.properties[propName]));
      }
    });

    eventManager.registerElementConfig({
      tagName: prototype.is,
      properties: propertyConfig
    });
  </source-code>
  <source-code lang="TypeScript">
    var propertyConfig = {'bind-value': ['change', 'input']}; // Not explicitly listed for all elements that use it

    function handleProp(propName, prop) {
      if (prop.notify) {
        propertyConfig[propName] = ['change', 'input'];
      }
    }

    Object.keys(prototype.properties).forEach(propName => handleProp(propName, prototype.properties[propName]));

    prototype.behaviors.forEach(behavior => {
      if (typeof behavior.properties != 'undefined') {
        Object.keys(behavior.properties).forEach(propName => handleProp(propName, behavior.properties[propName]));
      }
    });

    eventManager.registerElementConfig({
      tagName: prototype.is,
      properties: propertyConfig
    });
  </source-code>
</code-listing>

Element properties marked with `notify` are eligible for Polymer's two-way data
binding system and also trigger a `{property-name}-changed` event. This corresponds
to the `input` and `change` events in Aurelia.

Whenever a Polymer element is imported, it triggers a call to `Polymer.telemetry._registrate`,
which adds the element prototype to a list of registered Polymer elements. The
`aurelia-polymer` plugin replaces this registration function with one that also
calls `registerElement` on the prototype so that it is configured with Aurelia
as well. The need to override this function is why Polymer must be loaded before
the plugin is.
