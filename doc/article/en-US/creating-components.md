---
{
  "name": "Creating Components",
  "culture": "en-US",
  "description": "Components are the basic building blocks of all Aurelia applications. In this article you'll learn how to build basic components using dependency injection and the component lifecycle.",
  "engines" : { "aurelia-doc" : "^1.0.0" },
  "author": {
  	"name": "Rob Eisenberg",
  	"url": "http://robeisenberg.com"
  },
  "contributors": [],
  "translators": [],
  "keywords": ["Components", "MVVM", "Separation of Concerns"]
}
---
## [Creating A Component](aurelia-doc://section/1/version/1.0.0)

In Aurelia, user interface components are composed of _view_ and _view-model_ pairs. The view is written with HTML and is rendered into the DOM. The view-model is written with ${context.language.name} and provides data and behavior to the view. The Templating Engine along with Dependency Injection are responsible for creating these pairs and enforcing a predictable lifecycle for the component. Once instantiated, Aurelia's powerful _databinding_ links the two pieces together allowing changes in your view-model to be reflected in the view and changes in your view to reflected in your view-model. This Separation of Concerns is great for developer/designer collaboration, maintainability, architectural flexibility, and even source control.

To create a UI component, you need only create two files, one for each of the component parts. Let's create a simple "Hello" component. To do that we'll need a _hello${context.language.fileExtension}_ for our view-model and _hello.html_ for our view. Here's the source for each:

<code-listing heading="hello${context.language.fileExtension}">
  <source-code lang="ES 2016">
    export class Hello {
      firstName = 'John';
      lastName = 'Doe';

      sayHello() {
        alert(`Hello ${this.firstName} ${this.lastName}. Nice to meet you.`);
      }
    }
  </source-code>
  <source-code lang="ES 2015">
    export class Hello {
      constructor() {
        this.firstName = 'John';
        this.lastName = 'Doe';
      }

      sayHello() {
        alert(`Hello ${this.firstName} ${this.lastName}. Nice to meet you.`);
      }
    }
  </source-code>
  <source-code lang="TypeScript">
    export class Hello {
      firstName: string = 'John';
      lastName: string = 'Doe';

      sayHello() {
        alert(`Hello ${this.firstName} ${this.lastName}. Nice to meet you.`);
      }
    }
  </source-code>
</code-listing>

<code-listing heading="hello.html">
  <source-code lang="HTML">
    <template>
      <input value.bind="firstName">
      <input value.bind="lastName">

      <button click.trigger="sayHello()">Say Hello</button>
    </template>
  </source-code>
</code-listing>

Notice that the view-model is a plain class. There's nothing remarkable about it. One of the strengths of Aurelia is that you can write so much of your application in vanilla JS.

Also, notice how the view is wrapped in a Web Components HTMLTemplateElement. All views use standards-based HTML templates. You can also see the very simple, easy-to remember binding language. Simply append `.bind` to any HTML attribute in the DOM, and Aurelia will bind it to the corresponding property in your view-model.

The `.bind` binding command configures the "default binding behavior" for the attribute. For most attributes, this is a `one-way` binding, where data updates only flow in one direction: from the view-model to the view. However, usually, the behavior you want for form controls is `two-way` binding so that data not only flows from your view-model into your view, but user input in the view flows back into your view-model.

Those are the defaults, but you can always be explicit about the binding direction by using `.one-way`, `two-way` or `.one-time` in place of `.bind` (`.one-time` renders the initial value of the property but does not perform synchronization thereafter, making it a nice memory and performance gain for data you know will not change).

In addition to binding HTML attributes, you can also bind events. Any event, either native or custom, can be bound using `.trigger` this causes the expression to be invoked when the indicated event is fired.

> Info
> You can read more about data binding in the various Binding articles.

Now you know how to build basic components. What's great about this knowledge? It's consistent throughout Aurelia. The same pattern as above is used to create your app's root component, screens that the router navigates to, custom elements, dynamically composed UI components, modal dialogs, etc.

## [Component Instantiation Through Dependency Injection (DI)](aurelia-doc://section/2/version/1.0.0)

View-models and other interface elements, such as Custom Elements and Custom Attributes, are created as classes which are instantiated by the framework using a dependency injection container. Code written in this style is easy to modularize and test. Rather than creating large classes, you can break things down into small objects that collaborate to achieve a goal. The DI can then put the pieces together for you at runtime.

In order to leverage DI, you simply decorate your class to tell the framework what it should pass to its constructor. Here's an example of a CustomDetail component that depends on Aurelia's fetch client.

<code-listing heading="customer-detail${context.language.fileExtension}">
  <source-code lang="ES 2016">
    import {inject} from 'aurelia-framework';
    import {HttpClient} from 'aurelia-fetch-client';

    @inject(HttpClient)
    export class CustomerDetail {
      constructor(http) {
        this.http = http;
      }
    }
  </source-code>
  <source-code lang="ES 2015">
    import {HttpClient} from 'aurelia-fetch-client';

    export class CustomerDetail {
      static inject() { return [HttpClient] };

      constructor(http) {
        this.http = http;
      }
    }
  </source-code>
  <source-code lang="TypeScript">
    import {autoinject} from 'aurelia-framework';
    import {HttpClient} from 'aurelia-fetch-client';

    @autoinject
    export class CustomerDetail {
      constructor(private http: HttpClient) {}
    }
  </source-code>
</code-listing>

* If you are using ES2016, use the `inject` decorator. It should pass a list of types to provide instances of. There should be one argument for each constructor parameter. In the above example, we needed an HttpClient instance, so we added the `HttpClient` type in the `inject` decorator and then added a corresponding parameter in the constructor.
* If you are sticking with ES2015, or don't want to use decorators, you can also add a static `inject` method to the class that returns an array of types to inject.
* If you are using TypeScript >= 1.5, you can add the `@autoinject` decorator to your class and leave out the Types in the decorator call, but just use them on the constructor's signature.

## [The Component Lifecycle](aurelia-doc://section/3/version/1.0.0)

All components have a well-defined lifecycle. Below is a list of methods you can implement on your view-model in order to hook into the component lifecycle:

1. `constructor()` - The view-model's constructor is called first.
2. `created(owningView: View, myView: View)` - If the view-model implements the `created` callback it is invoked next. At this point in time, the view has also been created and both the view-model and the view are connected to their controller. The created callback will receive the instance of the "owningView". This is the view that the component is declared inside of. If the component itself has a view, this will be passed second.
3. `bind(bindingContext: Object, overrideContext: Object)` - Databinding is then activated on the view and view-model. If the view-model has a `bind` callback, it will be invoked at this time. The "binding context" to which the component is being bound will be passed first. An "override context" will be passed second. The override context contains information used to traverse the parent hierarchy and can also be used to add any contextual properties that the component wants to add.
4. `attached()` - Next, the component is attached to the DOM (in document). If the view-model has an `attached` callback, it will be invoked at this time.
5. `detached()` - At some point in the future, the component may be removed from the DOM. If/When this happens, and if the view-model has a `detached` callback, this is when it will be invoked.
6. `unbind()` - After a component is detached, it's usually unbound. If your view-model has the `unbind` callback, it will be invoked during this process.

Each of these callbacks is optional. Implement whatever makes sense for your component, but don't feel obligated to implement any of them if they aren't needed for your scenario. Usually, if you implement `bind` you will need to implement `unbind`. The same goes for `attached` and `detached`, but again, it isn't mandatory.

> Info
> It is important to note that if you implement the `bind` callback function, then the property changed callbacks for any `bindable` properties will not be called when the property value is initially set. The changed callback will be called for any subsequent time the bound value changes.
