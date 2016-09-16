---
{
  "name": "Cheat Sheet",
  "culture": "en-US",
  "description": "Forgot the syntax for bindings? Need to know how to create a custom attribute? This article contains answers to questions like those as well as a bunch of quick snippets for common tasks.",
  "engines" : { "aurelia-doc" : "^1.0.0" },
  "author": {
  	"name": "Rob Eisenberg",
  	"url": "http://robeisenberg.com"
  },
  "contributors": [],
  "translators": [],
  "keywords": ["Help", "Cheat Sheet"]
}
---
## [Configuration and Startup](aurelia-doc://section/1/version/1.0.0)

<code-listing heading="Bootstrapping Older Browsers">
  <source-code lang="HTML">
    <script src="jspm_packages/system.js"></script>
    <script src="config.js"></script>
    <script>
      SystemJS.import('aurelia-polyfills').then(function() {
        return SystemJS.import('webcomponents/webcomponentsjs/MutationObserver');
      }).then(function() {
        SystemJS.import('aurelia-bootstrapper');
      });
    </script>
  </source-code>
</code-listing>

> Warning: Promises in Edge
> Currently, the Edge browser has a serious performance problem with its Promise implementation. This deficiency can greatly increase startup time of your app. If you are targeting the Edge browser, it is highly recommended that you use the [bluebird promise](http://bluebirdjs.com/docs/getting-started.html) library to replace Edge's native implementation. You can do this by simply referencing the library prior to loading system.js.

<code-listing heading="Standard Startup Configuration">
  <source-code lang="ES 2015/2016">
    export function configure(aurelia) {
      aurelia.use
        .standardConfiguration()
        .developmentLogging();

      aurelia.start().then(() => aurelia.setRoot());
    }
  </source-code>
  <source-code lang="TypeScript">
    import {Aurelia} from 'aurelia-framework';

    export function configure(aurelia: Aurelia): void {
      aurelia.use
        .standardConfiguration()
        .developmentLogging();

      aurelia.start().then(() => aurelia.setRoot());
    }
  </source-code>
</code-listing>

<code-listing heading="Explicit Startup Configuration">
  <source-code lang="ES 2015/2016">
    import {LogManager} from 'aurelia-framework';
    import {ConsoleAppender} from 'aurelia-logging-console';

    LogManager.addAppender(new ConsoleAppender());
    LogManager.setLevel(LogManager.logLevel.debug);

    export function configure(aurelia) {
      aurelia.use
        .defaultBindingLanguage()
        .defaultResources()
        .history()
        .router()
        .eventAggregator();

      aurelia.start().then(() => aurelia.setRoot('app', document.body));
    }
  </source-code>
  <source-code lang="TypeScript">
    import {LogManager, Aurelia} from 'aurelia-framework';
    import {ConsoleAppender} from 'aurelia-logging-console';

    LogManager.addAppender(new ConsoleAppender());
    LogManager.setLevel(LogManager.logLevel.debug);

    export function configure(aurelia: Aurelia): void {
      aurelia.use
        .defaultBindingLanguage()
        .defaultResources()
        .history()
        .router()
        .eventAggregator();

      aurelia.start().then(() => aurelia.setRoot('app', document.body));
    }
  </source-code>
</code-listing>

<code-listing heading="Configuring A Feature">
  <source-code lang="ES 2015/2016">
    export function configure(aurelia) {
      aurelia.use
        .standardConfiguration()
        .developmentLogging()
        .feature('feature-name', featureConfiguration);

      aurelia.start().then(() => aurelia.setRoot());
    }
  </source-code>
  <source-code lang="TypeScript">
    import {Aurelia} from 'aurelia-framework';

    export function configure(aurelia: Aurelia): void {
      aurelia.use
        .standardConfiguration()
        .developmentLogging()
        .feature('feature-name', featureConfiguration);

      aurelia.start().then(() => aurelia.setRoot());
    }
  </source-code>
</code-listing>

<code-listing heading="Installing a Plugin">
  <source-code lang="ES 2015/2016">
    export function configure(aurelia) {
      aurelia.use
        .standardConfiguration()
        .developmentLogging()
        .plugin('plugin-name', pluginConfiguration);

      aurelia.start().then(() => aurelia.setRoot());
    }
  </source-code>
  <source-code lang="TypeScript">
    import {Aurelia} from 'aurelia-framework';

    export function configure(aurelia: Aurelia): void {
      aurelia.use
        .standardConfiguration()
        .developmentLogging()
        .plugin('plugin-name', pluginConfiguration);

      aurelia.start().then(() => aurelia.setRoot());
    }
  </source-code>
</code-listing>

## [Creating Components](aurelia-doc://section/2/version/1.0.0)

UI components consist of two parts: a view-model and a view. Simply create each part in its own file. Use the same file name but different file extensions for the two parts. For example: _hello${context.language.fileExtension}_ and _hello.html_.

<code-listing heading="Explicit Configuration">
  <source-code lang="ES 2015">
    import {useView, decorators} from 'aurelia-framework';

    export let Hello = decorators(useView('./hello.html')).on(class {
      ...
    });
  </source-code>
  <source-code lang="ES 2016">
    import {useView} from 'aurelia-framework';

    @useView('./hello.html')
    export class Hello {
      ...
    }
  </source-code>
  <source-code lang="TypeScript">
    import {useView} from 'aurelia-framework';

    @useView('./hello.html')
    export class Hello {
      ...
    }
  </source-code>
</code-listing>

#### The Component Lifecycle

Components have a well-defined lifecycle:

1. `constructor()` - The view-model's constructor is called first.
2. `created(owningView: View, myView: View)` - If the view-model implements the `created` callback it is invoked next. At this point in time, the view has also been created and both the view-model and the view are connected to their controller. The created callback will receive the instance of the "owningView". This is the view that the component is declared inside of. If the component itself has a view, this will be passed second.
3. `bind(bindingContext: Object, overrideContext: Object)` - Databinding is then activated on the view and view-model. If the view-model has a `bind` callback, it will be invoked at this time. The "binding context" to which the component is being bound will be passed first. An "override context" will be passed second. The override context contains information used to traverse the parent hierarchy and can also be used to add any contextual properties that the component wants to add. It should be noted that when the view-model has implemented the `bind` callback, the databinding framework will not invoke the changed handlers for the view-model's bindable properties until the "next" time those properties are updated. If you need to perform specific post-processing on your bindable properties, when implementing the `bind` callback, you should do so manually within the callback itself.
4. `attached()` - Next, the component is attached to the DOM (in document). If the view-model has an `attached` callback, it will be invoked at this time.
5. `detached()` - At some point in the future, the component may be removed from the DOM. If/When this happens, and if the view-model has a `detached` callback, this is when it will be invoked.
6. `unbind()` - After a component is detached, it's usually unbound. If your view-model has the `unbind` callback, it will be invoked during this process.

## [Dependency Injection](aurelia-doc://section/3/version/1.0.0)

<code-listing heading="Declaring Dependencies">
  <source-code lang="ES 2016">
    import {inject} from 'aurelia-framework';
    import {Dep1} from 'dep1';
    import {Dep2} from 'dep2';

    @inject(Dep1, Dep2)
    export class CustomerDetail {
      constructor(dep1, dep2) {
        this.dep1 = dep1;
        this.dep2 = dep2;
      }
    }
  </source-code>
  <source-code lang="ES 2015">
    import {Dep1} from 'dep1';
    import {Dep2} from 'dep2';

    export class CustomerDetail {
      static inject() { return [Dep1, Dep2]; }

      constructor(dep1, dep2) {
        this.dep1 = dep1;
        this.dep2 = dep2;
      }
    }
  </source-code>
  <source-code lang="TypeScript">
    import {autoinject} from 'aurelia-framework';
    import {Dep1} from 'dep1';
    import {Dep2} from 'dep2';

    @autoinject
    export class CustomerDetail {
      constructor(private dep1: Dep1, private dep2: Dep2){ }
    }
  </source-code>
</code-listing>

<code-listing heading="Using Resolvers">
  <source-code lang="ES 2016">
    import {Lazy, inject} from 'aurelia-framework';
    import {HttpClient} from 'aurelia-fetch-client';

    @inject(Lazy.of(HttpClient))
    export class CustomerDetail {
      constructor(getHTTP){
        this.getHTTP = getHTTP;
      }
    }
  </source-code>
  <source-code lang="ES 2015">
    import {Lazy} from 'aurelia-framework';
    import {HttpClient} from 'aurelia-fetch-client';

    export class CustomerDetail {
      static inject() { return [Lazy.of(HttpClient)]; }

      constructor(getHTTP){
        this.getHTTP = getHTTP;
      }
    }
  </source-code>
  <source-code lang="TypeScript">
    import {Lazy, inject} from 'aurelia-framework';
    import {HttpClient} from 'aurelia-fetch-client';

    @inject(Lazy.of(HttpClient))
    export class CustomerDetail {
      constructor(private getHTTP: () => HttpClient){ }
    }
  </source-code>
</code-listing>

#### Available Resolvers

* `Lazy` - Injects a function for lazily evaluating the dependency.
    * ex. `Lazy.of(HttpClient)`
* `All` - Injects an array of all services registered with the provided key.
    * ex. `All.of(Plugin)`
* `Optional` - Injects an instance of a class only if it already exists in the container; null otherwise.
    * ex. `Optional.of(LoggedInUser)`

<code-listing heading="Explicit Registration">
  <source-code lang="ES 2016">
    import {transient, inject} from 'aurelia-framework';
    import {HttpClient} from 'aurelia-fetch-client';

    @transient()
    @inject(HttpClient)
    export class CustomerDetail {
      constructor(http) {
        this.http = http;
      }
    }
  </source-code>
  <source-code lang="ES 2015">
    import {transient, inject} from 'aurelia-framework';
    import {HttpClient} from 'aurelia-fetch-client';

    export let CustomDetail = decorators(
      transient()
      inject(HttpClient)
    ).on(class {
      constructor(http) {
        this.http = http;
      }
    });
  </source-code>
  <source-code lang="TypeScript">
    import {transient, autoinject} from 'aurelia-framework';
    import {HttpClient} from 'aurelia-fetch-client';

    @transient()
    @autoinject
    export class CustomerDetail {
      constructor(private http: HttpClient) { }
    }
  </source-code>
</code-listing>

## [Templating Basics](aurelia-doc://section/4/version/1.0.0)

<code-listing heading="A Simple Template">
  <source-code lang="HTML">
    <template>
      <div>Hello World!</div>
    </template>
  </source-code>
</code-listing>

<code-listing heading="Requiring Resources">
  <source-code lang="HTML">
    <template>
      <require from='nav-bar'></require>

      <nav-bar router.bind="router"></nav-bar>

      <div class="page-host">
        <router-view></router-view>
      </div>
    </template>
  </source-code>
</code-listing>

> Info: Invalid Table Structure When Dynamically Creating Tables
> When the browser loads in the template it very helpfully validates the structure of the HTML, notices that you have an invalid tag inside your table definition, and very unhelpfully removes it for you before Aurelia even has a chance to examine your template.

Use of the `as-element` attribute ensures we have a valid HTML table structure at load time, yet we tell Aurelia to treat its contents as though it were a different tag.

<code-listing heading="Compose an existing object instance with a view.">
  <source-code lang="HTML">
    <template>
      <table>
        <tr repeat.for="r of ['A','B','A','B']" as-element="compose" view='./template_${r}.html'>
      </table>
    <template>
  </source-code>
</code-listing>

For the above example we can then programmatically choose the embedded template based on an element of our data:

<code-listing heading="template_A.html">
  <source-code lang="HTML">
    <template>
      <td>I'm an A Row</td><td>Col 2A</td><td>Col 3A</td>
    </template>
  </source-code>
</code-listing>
<code-listing heading="template_B.html">
  <source-code lang="HTML">
    <template>
      <td>I'm an B Row</td><td>Col 2B</td><td>Col 3B</td>
    </template>
  </source-code>
</code-listing>

Note that when a `containerless` attribute is used, the container is stripped *after* the browser has loaded the DOM elements, and as such this method cannot be used to transform non-HTML compliant structures into compliant ones!

<code-listing heading="Illegal Table Code">
  <source-code lang="HTML">
    <template>
      <table>
        <template repeat.for="customer of customers">
          <tr>
            <td>${customer.fullName}</td>
          </tr>
        </template>
      </table>
    </template>
  </source-code>
</code-listing>

<code-listing heading="Correct Table Code">
  <source-code lang="HTML">
    <template>
      <table>
        <tr repeat.for="customer of customers">
          <td>${customer.fullName}</td>
        </tr>
      </table>
    </template>
  </source-code>
</code-listing>

<code-listing heading="Illegal Select Code">
  <source-code lang="HTML">
    <template>
      <select>
        <template repeat.for="customer of customers">
          <option>...</option>
        </template>
      </select>
    </template>
  </source-code>
</code-listing>

<code-listing heading="Correct Select Code">
  <source-code lang="HTML">
    <template>
      <select>
        <option repeat.for="customer of customers">...</option>
      </select>
    </template>
  </source-code>
</code-listing>

## [Databinding](aurelia-doc://section/5/version/1.0.0)

### bind, one-way, two-way & one-time

Use on any HTML attribute.

* `.bind` - Uses the default binding. One-way binding for everything but form controls, which use two-way binding.
* `.one-way` - Flows data one direction: from the view-model to the view.
* `.two-way` - Flows data both ways: from view-model to view and from view to view-model.
* `.one-time` - Renders data once, but does not synchronize changes after the initial render.

<code-listing heading="Data Binding Examples">
  <source-code lang="HTML">
    <template>
      <input type="text" value.bind="firstName">
      <input type="text" value.two-way="lastName">

      <a href.one-way="profileUrl">View Profile</a>
    </template>
  </source-code>
</code-listing>

> Info
> At the moment inheritance of bindables is not supported. For use cases where `class B extends A` and `B` is used as custom Element/Attribute `@bindable` properties cannot be defined only on `class A`. If inheritance is used, `@bindable` properties should be defined on the instantiated class.

### delegate, trigger

Use on any native or custom DOM event. (Do not include the "on" prefix in the event name.)

* `.trigger` - Attaches an event handler directly to the element. When the event fires, the expression will be invoked.
* `.delegate` - Attaches a single event handler to the document (or nearest shadow DOM boundary) which handles all events of the specified type, properly dispatching them back to their original targets for invocation of the associated expression.

> Info
> The `$event` value can be passed as an argument to a `delegate` or `trigger` function call if you need to access the event object.

<code-listing heading="Event Binding Examples">
  <source-code lang="HTML">
    <template>
      <button click.trigger="save()">Save</button>
      <button click.delegate="save($event)">Save</button>
    </template>
  </source-code>
</code-listing>

### call

Passes a function reference.

<code-listing heading="Call Example">
  <source-code lang="HTML">
    <template>
      <button my-attribute.call="sayHello()">Say Hello</button>
    </template>
  </source-code>
</code-listing>

### ref

Creates a reference to an HTML element, a component or a component's parts.

* `ref="someIdentifier"` or `element.ref="someIdentifier"` - Create a reference to the HTMLElement in the DOM.
* `attribute-name.ref="someIdentifier"`- Create a reference to a custom attribute's view-model.
* `view-model.ref="someIdentifier"`- Create a reference to a custom element's view-model.
* `view.ref="someIdentifier"`- Create a reference to a custom element's view instance (not an HTML Element).
* `controller.ref="someIdentifier"`- Create a reference to a custom element's controller instance.

<code-listing heading="Ref Example">
  <source-code lang="HTML">
    <template>
      <input type="text" ref="name"> ${name.value}
    </template>
  </source-code>
</code-listing>

### String Interpolation

Used in an element's content. Can be used inside attributes, particularly useful in the `class` and `css` attributes.

<code-listing heading="String Interpolation  Example">
  <source-code lang="HTML">
    <template>
      <span>${fullName}</span>
      <div class="dot ${color} ${isHappy ? 'green' : 'red'}"></div>
    </template>
  </source-code>
</code-listing>

### Binding to Select Elements

A typical select element is rendered using a combination of `value.bind` and `repeat`. You can also bind to arrays of objects and synchronize based on an id (or similar) property.

<code-listing heading="Basic Select">
  <source-code lang="HTML">
    <template>
      <select value.bind="favoriteColor">
        <option>Select A Color</option>
        <option repeat.for="color of colors" value.bind="color">${color}</option>
      </select>
    </template>
  </source-code>
</code-listing>

<code-listing heading="Select with Object Array">
  <source-code lang="HTML">
    <template>
      <select value.bind="employeeOfTheMonth">
        <option>Select An Employee</option>
        <option repeat.for="employee of employees" model.bind="employee">${employee.fullName}</option>
      </select>
    </template>
  </source-code>
</code-listing>

<code-listing heading="Select with Object Id Sync">
  <source-code lang="HTML">
    <template>
      <select value.bind="employeeOfTheMonthId">
        <option>Select An Employee</option>
        <option repeat.for="employee of employees" model.bind="employee.id">${employee.fullName}</option>
      </select>
    </template>
  </source-code>
</code-listing>

<code-listing heading="Basic Multi-Select">
  <source-code lang="HTML">
    <template>
      <select value.bind="favoriteColors" multiple>
        <option repeat.for="color of colors" value.bind="color">${color}</option>
      </select>
    </template>
  </source-code>
</code-listing>

<code-listing heading="Multi-Select with Object Array">
  <source-code lang="HTML">
    <template>
      <select value.bind="favoriteEmployees" multiple>
        <option repeat.for="employee of employees" model.bind="employee">${employee.fullName}</option>
      </select>
    </template>
  </source-code>
</code-listing>

### Binding Radios

<code-listing heading="Basic Radios">
  <source-code lang="HTML">
    <template>
      <label repeat.for="color of colors">
        <input type="radio" name="clrs" value.bind="color" checked.bind="$parent.favoriteColor" />
        ${color}
      </label>
    </template>
  </source-code>
</code-listing>

<code-listing heading="Radios with Object Arrays">
  <source-code lang="HTML">
    <template>
      <label repeat.for="employee of employees">
        <input type="radio" name="emps" model.bind="employee" checked.bind="$parent.employeeOfTheMonth" />
        ${employee.fullName}
      </label>
    </template>
  </source-code>
</code-listing>

<code-listing heading="Radios with a Boolean">
  <source-code lang="HTML">
    <template>
      <label><input type="radio" name="tacos" model.bind="null" checked.bind="likesTacos" />Unanswered</label>
      <label><input type="radio" name="tacos" model.bind="true" checked.bind="likesTacos" />Yes</label>
      <label><input type="radio" name="tacos" model.bind="false" checked.bind="likesTacos" />No</label>
    </template>
  </source-code>
</code-listing>

### Binding Checkboxes

> Warning
> You cannot use a `click.delegate` on checkboxes if you want to attach a method to it. You need to use `change.delegate`.

<code-listing heading="Checkboxes with an Array">
  <source-code lang="HTML">
    <template>
      <label repeat.for="color of colors">
        <input type="checkbox" value.bind="color" checked.bind="$parent.favoriteColors" />
        ${color}
      </label>
    </template>
  </source-code>
</code-listing>

<code-listing heading="Checkboxes with an Array of Objects">
  <source-code lang="HTML">
    <template>
      <label repeat.for="employee of employees">
        <input type="checkbox" model.bind="employee" checked.bind="$parent.favoriteEmployees" />
        ${employee.fullName}
      </label>
    </template>
  </source-code>
</code-listing>

<code-listing heading="Checkboxes with Booleans">
  <source-code lang="HTML">
    <template>
      <li><label><input type="checkbox" checked.bind="wantsFudge" />Fudge</label></li>
      <li><label><input type="checkbox" checked.bind="wantsSprinkles" />Sprinkles</label></li>
      <li><label><input type="checkbox" checked.bind="wantsCherry" />Cherry</label></li>
    </template>
  </source-code>
</code-listing>

### Binding innerHTML and textContent

<code-listing heading="Binding innerHTML">
  <source-code lang="HTML">
    <template>
      <div innerhtml.bind="htmlProperty | sanitizeHTML"></div>
      <div innerhtml="${htmlProperty | sanitizeHTML}"></div>
    </template>
  </source-code>
</code-listing>

> Danger
> Always use HTML sanitization. We provide a simple converter that can be used. You are encouraged to use a more complete HTML sanitizer such as [sanitize-html](https://www.npmjs.com/package/sanitize-html).

> Warning
> Binding using the `innerhtml` attribute simply sets the element's `innerHTML` property.  The markup does not pass through Aurelia's templating system.  Binding expressions and require elements will not be evaluated.

<code-listing heading="Binding textContent">
  <source-code lang="HTML">
    <template>
      <div textcontent.bind="stringProperty"></div>
      <div textcontent="${stringProperty}"></div>
    </template>
  </source-code>
</code-listing>

<code-listing heading="Two-Way Editable textContent">
  <source-code lang="HTML">
    <template>
      <div textcontent.bind="stringProperty" contenteditable="true"></div>
    </template>
  </source-code>
</code-listing>

### Binding Style

You can bind a css string or object to an element's `style` attribute. Use the `style` attribute's alias, `css` when doing string interpolation to ensure your application is compatible with Internet Explorer.

<code-listing heading="Style Binding Data">
  <source-code lang="ES 2015/2016">
    export class StyleData {
      constructor() {
        this.styleString = 'color: red; background-color: blue';

        this.styleObject = {
          color: 'red',
          'background-color': 'blue'
        };
      }
    }
  </source-code>
  <source-code lang="TypeScript">
    export class StyleData {
      styleString: string;
      styleObject: any;

      constructor() {
        this.styleString = 'color: red; background-color: blue';

        this.styleObject = {
          color: 'red',
          'background-color': 'blue'
        };
      }
    }
  </source-code>
</code-listing>

<code-listing heading="Style Binding View">
  <source-code lang="HTML">
    <template>
      <div style.bind="styleString"></div>
      <div style.bind="styleObject"></div>
    </template>
  </source-code>
</code-listing>

<code-listing heading="Illegal Style Interpolation">
  <source-code lang="HTML">
    <template>
      <div style="width: ${width}px; height: ${height}px;"></div>
    </template>
  </source-code>
</code-listing>

<code-listing heading="Legal Style Interpolation">
  <source-code lang="HTML">
    <template>
      <div css="width: ${width}px; height: ${height}px;"></div>
    </template>
  </source-code>
</code-listing>

### Declaring Computed Property Dependencies

<code-listing heading="Computed Properties">
  <source-code lang="ES 2015">
    import {declarePropertyDependencies} from 'aurelia-framework';

    export class Person {
      firstName = 'John';
      lastName = 'Doe';

      get fullName(){
        return `${this.firstName} ${this.lastName}`;
      }
    }

    declarePropertyDependencies(Person, 'fullName', ['firstName', 'lastName']);
  </source-code>
  <source-code lang="ES 2016">
    import {computedFrom} from 'aurelia-framework';

    export class Person {
      firstName = 'John';
      lastName = 'Doe';

      @computedFrom('firstName', 'lastName')
      get fullName(){
        return `${this.firstName} ${this.lastName}`;
      }
    }
  </source-code>
  <source-code lang="TypeScript">
    import {computedFrom} from 'aurelia-framework';

    export class Person {
      firstName: string = 'John';
      lastName: string = 'Doe';

      @computedFrom('firstName', 'lastName')
      get fullName(): string {
        return `${this.firstName} ${this.lastName}`;
      }
    }
  </source-code>
</code-listing>

## [Templating View Resources](aurelia-doc://section/6/version/1.0.0)

<code-listing heading="Conditionally displays an HTML element.">
  <source-code lang="HTML">
    <template>
      <div show.bind="isSaving" class="spinner"></div>
    </template>
  </source-code>
</code-listing>

<code-listing heading="Conditionally add/remove an HTML element.">
  <source-code lang="HTML">
    <template>
      <div if.bind="isSaving" class="spinner"></div>
    </template>
  </source-code>
</code-listing>

<code-listing heading="Conditionally add/remove a group of elements.">
  <source-code lang="HTML">
    <template>
      <input value.bind="firstName">

      <template if.bind="hasErrors">
          <i class="icon error"></i>
          ${errorMessage}
      </template>
    </template>
  </source-code>
</code-listing>

<code-listing heading="Render an array with a template.">
  <source-code lang="HTML">
    <template>
      <ul>
        <li repeat.for="customer of customers">${customer.fullName}</li>
      </ul>
    </template>
  </source-code>
</code-listing>

<code-listing heading="Render a map with a template.">
  <source-code lang="HTML">
    <template>
      <ul>
        <li repeat.for="[id, customer] of customers">${id} ${customer.fullName}</li>
      </ul>
    </template>
  </source-code>
</code-listing>

<code-listing heading="Render a template N times.">
  <source-code lang="HTML">
    <template>
      <ul>
        <li repeat.for="i of rating">*</li>
      </ul>
    </template>
  </source-code>
</code-listing>

Contextual items available inside a repeat template:

* `$index` - The index of the item in the array.
* `$first` - True if the item is the first item in the array.
* `$last` - True if the item is the last item in the array.
* `$even` - True if the item has an even numbered index.
* `$odd` - True if the item has an odd numbered index.

> Info: Containerless Template Controllers
> The `if` and `repeat` attributes are usually placed on the HTML elements that they affect. However, you can also use a `template` tag to group a collection of elements that don't have a parent element and place the `if` or `repeat` on the `template` element instead.

<code-listing heading="Dynamically render UI into the DOM based on data.">
  <source-code lang="HTML">
    <template repeat.for="item of items">
      <compose model.bind="item" view-model="widgets/${item.type}"></compose>
    </template>
  </source-code>
</code-listing>

<code-listing heading="Composing a view only, inheriting the parent binding context.">
  <source-code lang="HTML">
    <template repeat.for="item of items">
      <compose view="my-view.html"></compose>
    </template>
  </source-code>
</code-listing>

<code-listing heading="Compose an existing object instance with a view.">
  <source-code lang="HTML">
    <template>
      <div repeat.for="item of items">
        <compose view="my-view.html" view-model.bind="item">
      </div>
    </template>
  </source-code>
</code-listing>

## [Routing](aurelia-doc://section/7/version/1.0.0)

<code-listing heading="Basic Route Configuration">
  <source-code lang="ES 2015/2016">
    export class App {
      configureRouter(config, router) {
        this.router = router;
        config.title = 'Aurelia';
        config.map([
          { route: ['', 'home'],       name: 'home',       moduleId: 'home/index' },
          { route: 'users',            name: 'users',      moduleId: 'users/index',   nav: true },
          { route: 'users/:id/detail', name: 'userDetail', moduleId: 'users/detail' },
          { route: 'files*path',       name: 'files',      moduleId: 'files/index',   href:'#files',   nav: true }
        ]);
      }
    }
  </source-code>
  <source-code lang="TypeScript">
    import {RouterConfiguration, Router} from 'aurelia-router';

    export class App {
      configureRouter(config: RouterConfiguration, router: Router): void {
        this.router = router;
        config.title = 'Aurelia';
        config.map([
          { route: ['', 'home'],       name: 'home',       moduleId: 'home/index' },
          { route: 'users',            name: 'users',      moduleId: 'users/index',   nav: true },
          { route: 'users/:id/detail', name: 'userDetail', moduleId: 'users/detail' },
          { route: 'files*path',       name: 'files',      moduleId: 'files/index',   href:'#files',   nav: true }
        ]);
      }
    }
  </source-code>
</code-listing>

### Route Pattern Options

* static routes
    - ie 'home' - Matches the string exactly.
* parameterized routes
    - ie  'users/:id/detail' - Matches the string and then parses an `id` parameter. Your view-model's `activate` callback will be called with an object that has an `id` property set to the value that was extracted from the url.
* wildcard routes
    - ie 'files*path' - Matches the string and then anything that follows it. Your view-model's `activate` callback will be called with an object that has a `path` property set to the wildcard's value.


### The Screen Activation Lifecycle

* `canActivate(params, routeConfig, navigationInstruction)` - Implement this hook if you want to control whether or not your view-model _can be navigated to_. Return a boolean value, a promise for a boolean value, or a navigation command.
* `activate(params, routeConfig, navigationInstruction)` - Implement this hook if you want to perform custom logic just before your view-model is displayed. You can optionally return a promise to tell the router to wait to bind and attach the view until after you finish your work.
* `canDeactivate()` - Implement this hook if you want to control whether or not the router _can navigate away_ from your view-model when moving to a new route. Return a boolean value, a promise for a boolean value, or a navigation command.
* `deactivate()` - Implement this hook if you want to perform custom logic when your view-model is being navigated away from. You can optionally return a promise to tell the router to wait until after you finish your work.

> Info: Navigation Commands
> A _Navigation Command_ is any object with a `navigate(router: Router)` method. When a navigation command is encountered, the current navigation will be cancelled and control will be passed to the navigation command so it can determine the correct action. Aurelia provides one navigation command out of the box: `Redirect`.

The `params` object will have a property for each parameter of the route that was parsed, as well as a property for each query string value. `routeConfig` will be the original route configuration object that you set up. `routeConfig` will also have a new `navModel` property, which can be used to change the document title for data loaded by your view-model. For example:

<code-listing heading="Route Params and NavModel">
  <source-code lang="ES 2016">
    import {autoinject} from 'aurelia-framework';
    import {UserService} from './user-service';

    @inject(UserService)
    export class UserEditScreen {
      constructor(userService) {
        this.userService = userService;
      }

      activate(params, routeConfig) {
        return this.userService.getUser(params.id)
          .then(user => {
            routeConfig.navModel.setTitle(user.name);
          });
      }
    }
  </source-code>
  <source-code lang="ES 2015">
    import {UserService} from './user-service';

    export class UserEditScreen {
      static inject() { return [UserService]; }

      constructor(userService) {
        this.userService = userService;
      }

      activate(params, routeConfig) {
        return this.userService.getUser(params.id)
          .then(user => {
            routeConfig.navModel.setTitle(user.name);
          });
      }
    }
  </source-code>
  <source-code lang="TypeScript">
    import {autoinject} from 'aurelia-framework';
    import {RouteConfig} from 'aurelia-router';
    import {UserService} from './user-service';

    @autoinject
    export class UserEditScreen {
      constructor(userService: UserService) { }

      activate(params: any, routeConfig: RouteConfig): Promise<any> {
        return this.userService.getUser(params.id)
          .then(user => {
            routeConfig.navModel.setTitle(user.name);
          });
      }
    }
  </source-code>
</code-listing>

<code-listing heading="Conventional Routing">
  <source-code lang="ES 2015/2016">
    export class App {
      configureRouter(config){
        config.mapUnknownRoutes(instruction => {
          //check instruction.fragment
          //return moduleId
        });
      }
    }
  </source-code>
  <source-code lang="TypeScript">
    import {RouterConfiguration} from 'aurelia-router';

    export class App {
      configureRouter(config: RouterConfiguration): void {
        config.mapUnknownRoutes(instruction => {
          //check instruction.fragment
          //return moduleId
        });
      }
    }
  </source-code>
</code-listing>

<code-listing heading="Customizing the Navigation Pipeline">
  <source-code lang="ES 2015/2016">
    import {Redirect} from 'aurelia-router';

    export class App {
      configureRouter(config) {
        config.title = 'Aurelia';
        config.addPipelineStep('authorize', AuthorizeStep);
        config.map([
          { route: ['welcome'],    name: 'welcome',       moduleId: 'welcome',      nav: true, title:'Welcome' },
          { route: 'flickr',       name: 'flickr',        moduleId: 'flickr',       nav: true, auth: true },
          { route: 'child-router', name: 'childRouter',   moduleId: 'child-router', nav: true, title:'Child Router' },
          { route: '', redirect: 'welcome' }
        ]);
      }
    }

    class AuthorizeStep {
      run(navigationInstruction, next) {
        if (navigationInstruction.getAllInstructions().some(i => i.config.auth)) {
          var isLoggedIn = /* insert magic here */false;
          if (!isLoggedIn) {
            return next.cancel(new Redirect('login'));
          }
        }

        return next();
      }
    }
  </source-code>
  <source-code lang="TypeScript">
    import {Redirect, NavigationInstruction, RouterConfiguration, Next} from 'aurelia-router';

    export class App {
      configureRouter(config: RouterConfiguration): void {
        config.title = 'Aurelia';
        config.addPipelineStep('authorize', AuthorizeStep);
        config.map([
          { route: ['welcome'],    name: 'welcome',       moduleId: 'welcome',      nav: true, title:'Welcome' },
          { route: 'flickr',       name: 'flickr',        moduleId: 'flickr',       nav: true, auth: true },
          { route: 'child-router', name: 'childRouter',   moduleId: 'child-router', nav: true, title:'Child Router' },
          { route: '', redirect: 'welcome' }
        ]);
      }
    }

    class AuthorizeStep {
      run(navigationInstruction: NavigationInstruction, next: Next): Promise<any> {
        if (navigationInstruction.getAllInstructions().some(i => i.config.auth)) {
          var isLoggedIn = /* insert magic here */false;
          if (!isLoggedIn) {
            return next.cancel(new Redirect('login'));
          }
        }

        return next();
      }
    }
  </source-code>
</code-listing>

### Configuring PushState

Add [a base tag](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/base) to the head of your html document. If you're using JSPM, you will also need to configure it with a `baseURL` corresponding to your base tag's `href`. Finally, be sure to set the `config.options.root` to match your base tag's setting.

<code-listing heading="Push State">
  <source-code lang="ES 2015/2016">
    export class App {
      configureRouter(config) {
        config.title = 'Aurelia';
        config.options.pushState = true;
        config.options.root = '/';
        config.map([
          { route: ['welcome'],    name: 'welcome',     moduleId: 'welcome',      nav: true, title:'Welcome' },
          { route: 'flickr',       name: 'flickr',      moduleId: 'flickr',       nav: true, auth: true },
          { route: 'child-router', name: 'childRouter', moduleId: 'child-router', nav: true, title:'Child Router' },
          { route: '',             redirect: 'welcome' }
        ]);
      }
    }
  </source-code>
  <source-code lang="TypeScript">
    import {Redirect, NavigationInstruction, RouterConfiguration} from 'aurelia-router';

    export class App {
      configureRouter(config: RouterConfiguration): void {
        config.title = 'Aurelia';
        config.options.pushState = true;
        config.options.root = '/';
        config.map([
          { route: ['welcome'],    name: 'welcome',     moduleId: 'welcome',      nav: true, title:'Welcome' },
          { route: 'flickr',       name: 'flickr',      moduleId: 'flickr',       nav: true, auth: true },
          { route: 'child-router', name: 'childRouter', moduleId: 'child-router', nav: true, title:'Child Router' },
          { route: '',             redirect: 'welcome' }
        ]);
      }
    }
  </source-code>
</code-listing>

> Warning
> PushState requires server-side support. Don't forget to configure your server appropriately.

### Reusing an existing VM

Since the VM's navigation life-cycle is called only once you may have problems recognizing that the user switched the route from `Product A` to `Product B` (see below).  To work around this issue implement the method `determineActivationStrategy` in your VM and return hints for the router about what you'd like to happen.

> Info
> Additionally, you can add an `activationStrategy` property to your route config if the strategy is always the same and you don't want that to be in your view-model code. Available values are `replace` and `invoke-lifecycle`. Remember, "lifecycle" refers to the navigation lifecycle.

<code-listing heading="Router VM Activation Control">
  <source-code lang="ES 2015/2016">
    //app.js

    export class App {
      configureRouter(config) {
        config.title = 'Aurelia';
        config.map([
          { route: 'product/a',    moduleId: 'product',     nav: true },
          { route: 'product/b',    moduleId: 'product',     nav: true },
        ]);
      }
    }

    //product.js

    import {activationStrategy} from 'aurelia-router';

    export class Product {
      determineActivationStrategy(){
        return activationStrategy.replace;
      }
    }
  </source-code>
  <source-code lang="TypeScript">
    import {RouterConfiguration} from 'aurelia-router';

    //app.ts

    export class App {
      configureRouter(config: RouterConfiguration): void {
        config.title = 'Aurelia';
        config.map([
          { route: 'product/a',    moduleId: 'product',     nav: true },
          { route: 'product/b',    moduleId: 'product',     nav: true },
        ]);
      }
    }

    //product.ts

    import {activationStrategy} from 'aurelia-router';

    export class Product {
      determineActivationStrategy(): string {
        return activationStrategy.replace;
      }
    }
  </source-code>
</code-listing>

### Rendering multiple ViewPorts

> Info
> If you don't name a `router-view`, it will be available under the name `'default'`.

<code-listing heading="Multi-ViewPort View">
  <source-code lang="HTML">
    <template>
      <div class="page-host">
        <router-view name="left"></router-view>
      </div>
      <div class="page-host">
        <router-view name="right"></router-view>
      </div>
    </template>
  </source-code>
</code-listing>

<code-listing heading="Multi-ViewPort View-Model">
  <source-code lang="ES 2015/2016">
    export class App {
      configureRouter(config){
        config.map([{
          route: 'edit',
            viewPorts: {
              left: {
                moduleId: 'editor'
              },
              right: {
                moduleId: 'preview'
              }
            }
          }]);
      }
    }
  </source-code>
  <source-code lang="TypeScript">
    import {RouterConfiguration} from 'aurelia-router';

    export class App {
      configureRouter(config: RouterConfiguration): void {
        config.map([{
          route: 'edit',
            viewPorts: {
              left: {
                moduleId: 'editor'
              },
              right: {
                moduleId: 'preview'
              }
            }
          }]);
      }
    }
  </source-code>
</code-listing>

### Generating Route URLs

<code-listing heading="Generate Route URLs in Code">
  <source-code lang="ES 2015/ES 2016/TypeScript">
    router.generate('routeName', { id: 123 });
  </source-code>
</code-listing>

<code-listing heading="Navigating to a Generated Route">
  <source-code lang="ES 2015/ES 2016/TypeScript">
    router.navigateToRoute('routeName', { id: 123 })
  </source-code>
</code-listing>

<code-listing heading="Rendering an Anchor for a Route">
  <source-code lang="HTML">
    <template>
      <a route-href="route: routeName; params.bind: { id: user.id }">${user.name}</a>
    </template>
  </source-code>
</code-listing>

## [Custom Attributes](aurelia-doc://section/8/version/1.0.0)

<code-listing heading="Simple Attribute Declaration">
  <source-code lang="ES 2016">
    import {inject, customAttribute, DOM} from 'aurelia-framework';

    @customAttribute('my-attribute')
    @inject(DOM.Element)
    export class Show {
      constructor(element) {
        this.element = element;
      }

      valueChanged(newValue, oldValue) {
        ...
      }
    }
  </source-code>
  <source-code lang="ES 2015">
    import {customAttribute, inject, decorators} from 'aurelia-framework';

    export let MyAttribute = decorators(
      customAttribute('my-attribute'),
      inject(DOM.Element)
    ).on(class {
      constructor(element) {
        this.element = element;
      }

      valueChanged(newValue, oldValue) {
        ...
      }
    });
  </source-code>
  <source-code lang="TypeScript">
    import {inject, customAttribute, DOM} from 'aurelia-framework';

    @customAttribute('my-attribute')
    @inject(DOM.Element)
    export class Show {
      constructor(private element: Element) { }

      valueChanged(newValue, oldValue) {
        ...
      }
    }
  </source-code>
</code-listing>

<code-listing heading="Simple Attribute Use">
  <source-code lang="HTML">
    <template>
      <div my-attribute="literal value"></div>
      <div my-attribute.bind="an.expression"></div>
    </template>
  </source-code>
</code-listing>

<code-listing heading="Options Attribute Declaration">
  <source-code lang="ES 2016">
    import {customAttribute, bindable} from 'aurelia-framework';

    @customAttribute('my-attribute')
    export class MyAttribute {
      @bindable foo;
      @bindable bar;

      fooChanged(newValue, oldValue) { ... }

      barChanged(newValue, oldValue) { ... }
    }
  </source-code>
  <source-code lang="ES 2015">
    import {customAttribute, bindable, decorators} from 'aurelia-framework';

    export let MyAttribute = decorators(
      customAttribute('my-attribute'),
      bindable('foo'),
      bindable('bar')
    ).on(class {
      fooChanged(newValue, oldValue) { ... }

      barChanged(newValue, oldValue) { ... }
    });
  </source-code>
  <source-code lang="TypeScript">
    import {customAttribute, bindable} from 'aurelia-framework';

    @customAttribute('my-attribute')
    export class MyAttribute {
      @bindable foo: any;
      @bindable bar: any;

      fooChanged(newValue: any, oldValue: any): void { ... }

      barChanged(newValue: any, oldValue: any): void  { ... }
    }
  </source-code>
</code-listing>

<code-listing heading="Options Attribute Use">
  <source-code lang="HTML">
    <template>
      <div my-attribute="foo: literal value; bar.bind: an.expression"></div>
    </template>
  </source-code>
</code-listing>

<code-listing heading="Dynamic Option Attribute Declaration">
  <source-code lang="ES 2016">
    import {customAttribute, dynamicOptions} from 'aurelia-framework';

    @customAttribute('my-attribute')
    @dynamicOptions
    export class MyAttribute {
      propertyChanged(propertyName, newValue, oldValue) { ... }
    }
  </source-code>
  <source-code lang="ES 2015">
    import {customAttribute, dynamicOptions, decorators} from 'aurelia-framework';

    export let MyAttribute = decorators(
      customAttribute('my-attribute'),
      dynamicOptions()
    ).on(class {
      propertyChanged(propertyName, newValue, oldValue) { ... }
    });
  </source-code>
  <source-code lang="TypeScript">
    import {customAttribute, dynamicOptions} from 'aurelia-framework';

    @customAttribute('my-attribute')
    @dynamicOptions
    export class MyAttribute {
      propertyChanged(propertyName: string, newValue: any, oldValue: any) { ... }
    }
  </source-code>
</code-listing>

<code-listing heading="Dynamic Option Attribute Use">
  <source-code lang="HTML">
    <template>
      <div my-attribute="foo: literal value; bar.bind: an.expression"></div>
    </template>
  </source-code>
</code-listing>

<code-listing heading="Bindable Signature (Showing Defaults)">
  <source-code lang="ES 2015/ES 2016/TypeScript">
    bindable({
      name:'myProperty',
      attribute:'my-property',
      changeHandler:'myPropertyChanged',
      defaultBindingMode: bindingMode.oneWay,
      defaultValue: undefined
    })
  </source-code>
</code-listing>

<code-listing heading="Template Controller Attribute Declaration">
  <source-code lang="ES 2016">
    import {BoundViewFactory, ViewSlot, customAttribute, templateController, inject} from 'aurelia-framework';

    @customAttribute('naive-if')
    @templateController
    @inject(BoundViewFactory, ViewSlot)
    export class NaiveIf {
      constructor(viewFactory, viewSlot) {
        this.viewFactory = viewFactory;
        this.viewSlot = viewSlot;
      }

      valueChanged(newValue) {
        if (newValue) {
          let view = this.viewFactory.create();
          this.viewSlot.add(view);
        } else {
          this.viewSlot.removeAll();
        }
      }
    }
  </source-code>
  <source-code lang="ES 2015">
    import {BoundViewFactory, ViewSlot, customAttribute, templateController, inject} from 'aurelia-framework';

    export let MyAttribute = decorators(
      customAttribute('naive-if')
      templateController()
      inject(BoundViewFactory, ViewSlot)
    ).on(class {
      constructor(viewFactory, viewSlot) {
        this.viewFactory = viewFactory;
        this.viewSlot = viewSlot;
      }

      valueChanged(newValue) {
        if (newValue) {
          let view = this.viewFactory.create();
          this.viewSlot.add(view);
        } else {
          this.viewSlot.removeAll();
        }
      }
    });
  </source-code>
  <source-code lang="TypeScript">
    import {BoundViewFactory, ViewSlot, customAttribute, templateController, autoinject} from 'aurelia-framework';

    @customAttribute('naive-if')
    @templateController
    @autoinject
    export class NaiveIf {
      constructor(private viewFactory: BoundViewFactory, private viewSlot: ViewSlot) { }

      valueChanged(newValue: any): void {
        if (newValue) {
          let view = this.viewFactory.create();
          this.viewSlot.add(view);
        } else {
          this.viewSlot.removeAll();
        }
      }
    }
  </source-code>
</code-listing>

<code-listing heading="Template Controller Attribute Use">
  <source-code lang="HTML">
    <template>
      <div naive-if.bind="an.expression"></div>

      <template naive-if.bind="an.expression">
        <div></div>
        <div></div>
      </template>
    </template>
  </source-code>
</code-listing>

## [Custom Elements](aurelia-doc://section/9/version/1.0.0)

<code-listing heading="Custom Element View-Model Declaration">
  <source-code lang="ES 2016">
    import {customElement, bindable} from 'aurelia-framework';

    @customElement('say-hello')
    export class SayHello {
      @bindable to;

      speak(){
        alert(`Hello ${this.to}!`);
      }
    }
  </source-code>
  <source-code lang="ES 2015">
    import {customElement, bindable} from 'aurelia-framework';

    export let SayHello = decorators(
      customElement('say-hello'),
      bindable('to')
    ).on(class {
      speak(){
        alert(`Hello ${this.to}!`);
      }
    });
  </source-code>
  <source-code lang="TypeScript">
    import {customElement, bindable} from 'aurelia-framework';

    @customElement('say-hello')
    export class SayHello {
      @bindable to: string;

      speak(): void {
        alert(`Hello ${this.to}!`);
      }
    }
  </source-code>
</code-listing>

<code-listing heading="Custom Element View Declaration">
  <source-code lang="HTML">
    <template>
       <button click.trigger="speak()">Say Hello To ${to}</button>
    </template>
  </source-code>
</code-listing>

<code-listing heading="Custom Element Use">
  <source-code lang="HTML">
    <template>
      <require from="say-hello"></require>

      <input type="text" ref="name">
      <say-hello to.bind="name.value"></say-hello>
    </template>
  </source-code>
</code-listing>


### Custom Element Without View-Model Declaration

Aurelia will not search for a JavaScript file if you reference a component with an .html extension.

<code-listing heading="Declare Custom Element Without View-Model With Binding">
  <source-code lang="HTML">
    <template bindable="greeting,name">
       Say ${greeting} To ${name}
    </template>
  </source-code>
</code-listing>

<code-listing heading="Add Global Custom Element Without View-Model">
  <source-code lang="ES 2015/ES 2016/TypeScript">
    aurelia.use.globalResources('./js-less-component.html');
  </source-code>
</code-listing>

<code-listing heading="Use Custom Element Without View-Model">
  <source-code lang="HTML">
    <require from="./js-less-component.html"></require>

    <js-less-component greeting="Hello" name.bind="someProperty"></js-less-component>
  </source-code>
</code-listing>

### Custom Element Variable Binding

It's worth noting that when binding variables to custom elements, use camelCase inside the custom element's View-Model, and dash-case on the html element. See the following example:

<code-listing heading="Custom Element View-Model Declaration">
  <source-code lang="ES 2016">
    import {bindable} from 'aurelia-framework';

    export class SayHello {
      @bindable to;
      @bindable greetingCallback;

      speak(){
        this.greetingCallback(`Hello ${this.to}!`);
      }
    }
  </source-code>
  <source-code lang="ES 2015">
    import {bindable} from 'aurelia-framework';

    export let SayHello = decorators(
      bindable('to'),
      bindable('greetingCallback')
    ).on(class {
      speak(){
        this.greetingCallback(`Hello ${this.to}!`);
      }
    });
  </source-code>
  <source-code lang="TypeScript">
    import {bindable} from 'aurelia-framework';

    export class SayHello {
      @bindable to: string;
      @bindable greetingCallback: Function;

      speak(): void {
        this.greetingCallback(`Hello ${this.to}!`);
      }
    }
  </source-code>
</code-listing>

<code-listing heading="Custom Element Use">
  <source-code lang="HTML">
    <template>
      <require from="./say-hello"></require>

      <input type="text" ref="name">
      <say-hello to.bind="name.value" greeting-callback.call="doSomething($event)"></say-hello>
    </template>
  </source-code>
</code-listing>

### Custom Element Options

* `@children(selector)` - Decorates a property to create an array on your class that has its items automatically synchronized based on a query selector against the element's immediate child content.
* `@child(selector)` - Decorates a property to create a reference to a single immediate child content element.
* `@processContent(false|Function)` - Tells the compiler that the element's content requires special processing. If you provide `false` to the decorator, the compiler will not process the content of your custom element. It is expected that you will do custom processing yourself. But, you can also supply a custom function that lets you process the content during the view's compilation. That function can then return true/false to indicate whether or not the compiler should also process the content. The function takes the following form `function(compiler, resources, node, instruction):boolean`
* `@useView(path)` - Specifies a different view to use.
* `@noView()` - Indicates that this custom element does not have a view and that the author intends for the element to handle its own rendering internally.
* `@inlineView(markup, dependencies?)` - Allows the developer to provide a string that will be compiled into the view.
* `@useShadowDOM()` - Causes the view to be rendered in the ShadowDOM. When an element is rendered to ShadowDOM, a special `DOMBoundary` instance can optionally be injected into the constructor. This represents the shadow root.
* `@containerless()` - Causes the element's view to be rendered without the custom element container wrapping it. This cannot be used in conjunction with `@child`, `@children` or `@useShadowDOM` decorators. It also cannot be uses with surrogate behaviors. Use sparingly.

### SVG Elements

SVG (scalable vector graphic) tags can support Aurelia's custom element `<template>` tags by  nesting the templated code inside a second `<svg>` tag. For example if you had a base `<svg>` element and wanted to add a templated `<rect>` inside it, you would first put your custom tag inside the main `<svg>` tag. Also, make sure the custom element class uses the `@containerless()` decorator.

<code-listing heading="SVG Custom Element View-Model Declaration">
  <source-code lang="ES 2016">
    import {containerless} from 'aurelia-framework';

    @containerless()
    export class MyCustomRect {
    	...
    }
  </source-code>
  <source-code lang="ES 2015">
    import {containerless} from 'aurelia-framework';

    export let MyCustomRect = decorators(
      containerless()
    ).on(class {
      ...
    });
  </source-code>
  <source-code lang="TypeScript">
    import {containerless} from 'aurelia-framework';

    @containerless()
    export class MyCustomRect {
    	...
    }
  </source-code>
</code-listing>

<code-listing heading="SVG Custom Element View">
  <source-code lang="HTML">
    <template>
    	<svg>
    		<rect width="10" height="10" fill="red" x="50" y="50"/>
    	</svg>
    </template>
  </source-code>
</code-listing>

<code-listing heading="SVG Custom Element Use">
  <source-code lang="HTML">
    <template>
    	<require from="my-custom-rect"></require>

    	<svg width="100" height="100" >
    		<my-custom-rect></my-custom-rect>
    	</svg>
    </template>
  </source-code>
</code-listing>

### Template Parts

<code-listing heading="Custom Element View with Replaceable Parts">
  <source-code lang="HTML">
    <template>
      <ul>
        <li class="foo" repeat.for="item of items">
          <template replaceable part="item-template">
            Original: ${item}
          </template>
        </li>
      <ul>
    </template>
  </source-code>
</code-listing>

<code-listing heading="Custom Element Use with Replacement">
  <source-code lang="HTML">
    <template>
      <require from="my-element"></require>

      <my-element>
        <template replace-part="item-template">
          Replacement: ${item}
        </template>
      </my-element>
    </template>
  </source-code>
</code-listing>

<code-listing heading="Surrogate Behavior Use">
  <source-code lang="HTML">
    <template role="progress-bar" aria-valuenow.bind="progress" aria-valuemin="0" aria-valuemax="100">
      <div class="bar">
        <div class="progress" css="width:${progress}%"></div>
      </div>
    </template>
  </source-code>
</code-listing>


### Observable decorator

Aurelia exposes a decorator named observable to allow watching for changes to a property and reacting to them.  By convention it will look for a matching method name `${name}Changed` -

<code-listing heading="Correct observable usage">
  <source-code lang="ES 2016">
    import {observable} from 'aurelia-framework';

    export class MyCustomViewModel {
      @observable name = 'Hello world';
      nameChanged(newValue, oldValue) {
        // react to change
      }
    }
  </source-code>
  <source-code lang="ES 2015">
    import {decorators, observable} from 'aurelia-framework';

    export let MyCustomViewModel = decorators(
      observable('name')
    ).on(class {
      nameChanged(newValue, oldValue) {
        // react to change
      }
    });
  </source-code>
  <source-code lang="TypeScript">
    import {observable} from 'aurelia-framework';

    export class MyCustomViewModel {
      @observable name = 'Hello world';
      nameChanged(newValue, oldValue) {
        // react to change
      }
    }
  </source-code>
</code-listing>

The developer can also specify a different method name to use -

<code-listing heading="Correct observable usage with configured change handler">
  <source-code lang="ES 2016">
    import {observable} from 'aurelia-framework';

    export class MyCustomViewModel {
      @observable({changeHandler: 'nameChanged'}) name = 'Hello world';
      nameChanged(newValue, oldValue) {
        // react to change
      }
    }
  </source-code>
  <source-code lang="ES 2015">
    import {decorators, observable} from 'aurelia-framework';

    export let MyCustomViewModel = decorators(
      observable({name:'name', changeHandler: 'nameChanged'})
    ).on(class {
      nameChanged(newValue, oldValue) {
        // react to change
      }
    });
  </source-code>
  <source-code lang="TypeScript">
    import {observable} from 'aurelia-framework';

    export class MyCustomViewModel {
      @observable({changeHandler: 'nameChanged'}) name = 'Hello world';
      nameChanged(newValue, oldValue) {
        // react to change
      }
    }
  </source-code>
</code-listing>

## [The Event Aggregator](aurelia-doc://section/10/version/1.0.0)

If you include the `aurelia-event-aggregator` plugin using "basicConfiguration" or "standardConfiguration" then the singleton EventAggregator's API will be also present on the `Aurelia` object. You can also create additional instances of the EventAggregator, if needed, and "merge" them into any object. To do this, import `includeEventsIn` and invoke it with the object you wish to turn into an event aggregator. For example `includeEventsIn(myObject)`. Now my object has `publish` and `subscribe` methods and can be used in the same way as the global event aggregator, detailed below.

<code-listing heading="Publishing on a Channel">
  <source-code lang="ES 2016">
    import {inject} from 'aurelia-framework';
    import {EventAggregator} from 'aurelia-event-aggregator';

    @inject(EventAggregator)
    export class APublisher {
      constructor(eventAggregator) {
        this.eventAggregator = eventAggregator;
      }

      publish(){
        var payload = {};
        this.eventAggregator.publish('channel name here', payload);
      }
    }
  </source-code>
  <source-code lang="ES 2015">
    import {EventAggregator} from 'aurelia-event-aggregator';

    export class APublisher{
      static inject() { return [EventAggregator]; }

      constructor(eventAggregator){
        this.eventAggregator = eventAggregator;
      }

      publish(){
        var payload = {};
        this.eventAggregator.publish('channel name here', payload);
      }
    }
  </source-code>
  <source-code lang="TypeScript">
    import {autoinject} from 'aurelia-framework';
    import {EventAggregator} from 'aurelia-event-aggregator';

    @autoinject
    export class APublisher {
      constructor(private eventAggregator: EventAggregator) { }

      publish(): void {
        var payload = {};
        this.eventAggregator.publish('channel name here', payload);
      }
    }
  </source-code>
</code-listing>

<code-listing heading="Subscribing to a Channel">
  <source-code lang="ES 2016">
    import {inject} from 'aurelia-framework';
    import {EventAggregator} from 'aurelia-event-aggregator';

    @inject(EventAggregator)
    export class ASubscriber {
      constructor(eventAggregator) {
        this.eventAggregator = eventAggregator;
      }

      subscribe() {
        this.eventAggregator.subscribe('channel name here', payload => {
            ...
        });
      }
    }
  </source-code>
  <source-code lang="ES 2015">
    import {EventAggregator} from 'aurelia-event-aggregator';

    export class ASubscriber {
      static inject() { return [EventAggregator]; }

      constructor(eventAggregator) {
        this.eventAggregator = eventAggregator;
      }

      subscribe() {
        this.eventAggregator.subscribe('channel name here', payload => {
            ...
        });
      }
    }
  </source-code>
  <source-code lang="TypeScript">
    import {autoinject} from 'aurelia-framework';
    import {EventAggregator} from 'aurelia-event-aggregator';

    @autoinject
    export class ASubscriber {
      constructor(private eventAggregator: EventAggregator) { }

      subscribe(): void {
        this.eventAggregator.subscribe('channel name here', payload => {
            ...
        });
      }
    }
  </source-code>
</code-listing>

<code-listing heading="Publishing a Message">
  <source-code lang="ES 2016">
    //some-massage.js
    export class SomeMessage{ }

    //a-publisher.js
    import {inject} from 'aurelia-framework';
    import {EventAggregator} from 'aurelia-event-aggregator';
    import {SomeMessage} from './some-message';

    @inject(EventAggregator)
    export class APublisher {
      constructor(eventAggregator) {
        this.eventAggregator = eventAggregator;
      }

      publish() {
        this.eventAggregator.publish(new SomeMessage());
      }
    }
  </source-code>
  <source-code lang="ES 2015">
    //some-massage.js
    export class SomeMessage{ }

    //a-publisher.js
    import {EventAggregator} from 'aurelia-event-aggregator';
    import {SomeMessage} from './some-message';

    export class APublisher {
      static inject() { return [EventAggregator] };

      constructor(eventAggregator) {
        this.eventAggregator = eventAggregator;
      }

      publish() {
        this.eventAggregator.publish(new SomeMessage());
      }
    }
  </source-code>
  <source-code lang="TypeScript">
    //some-massage.ts
    export class SomeMessage{ }

    //a-publisher.ts
    import {autoinject} from 'aurelia-framework';
    import {EventAggregator} from 'aurelia-event-aggregator';
    import {SomeMessage} from './some-message';

    @autoinject
    export class APublisher {
      constructor(private eventAggregator: EventAggregator) { }

      publish(): void {
        this.eventAggregator.publish(new SomeMessage());
      }
    }
  </source-code>
</code-listing>

<code-listing heading="Subscribing to a Message Type">
  <source-code lang="ES 2016">
    import {inject} from 'aurelia-framework';
    import {EventAggregator} from 'aurelia-event-aggregator';
    import {SomeMessage} from './some-message';

    @inject(EventAggregator)
    export class ASubscriber {
      constructor(eventAggregator) {
        this.eventAggregator = eventAggregator;
      }

      subscribe(){
        this.eventAggregator.subscribe(SomeMessage, message => {
            ...
        });
      }
    }
  </source-code>
  <source-code lang="ES 2015">
    import {EventAggregator} from 'aurelia-event-aggregator';
    import {SomeMessage} from './some-message';

    export class ASubscriber {
      static inject() { return [EventAggregator]; }

      constructor(eventAggregator) {
        this.eventAggregator = eventAggregator;
      }

      subscribe(){
        this.eventAggregator.subscribe(SomeMessage, message => {
            ...
        });
      }
    }
  </source-code>
  <source-code lang="TypeScript">
    import {autoinject} from 'aurelia-framework';
    import {EventAggregator} from 'aurelia-event-aggregator';
    import {SomeMessage} from './some-message';

    @autoinject
    export class ASubscriber {
      constructor(private eventAggregator: EventAggregator) { }

      subscribe(): void {
        this.eventAggregator.subscribe(SomeMessage, message => {
            ...
        });
      }
    }
  </source-code>
</code-listing>
