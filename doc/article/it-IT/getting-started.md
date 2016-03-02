---
{
  "name": "Getting Started",
  "culture": "en-US",
  "description": "Welcome to Aurelia! This tutorial will take you through creating a simple application using Aurelia and briefly explain its main concepts. We assume you are familiar with JavaScript, HTML, and CSS.",
  "engines" : { "aurelia-doc" : "^1.0.0" },
  "author": {
  	"name": "Rob Eisenberg",
  	"url": "http://robeisenberg.com"
  },
  "contributors": [],
  "translators": [],
  "keywords": ["Getting Started", "ES2015", "ES2016", "TypeScript"]
}
---
## [Getting Set Up](aurelia-doc://section/1/version/1.0.0)

Before we start writing some code, you're going to want to grab one of our pre-configured, getting-started packages. We've got two versions available to you: one uses ECMAScript 2016 (JavaScript vNext) and the other one uses TypeScript. Choose one now by clicking one of the buttons below.

<div style="text-align: center;">
  <a class="au-button" href="http://aurelia.io/downloads/kit-es2016.zip" style="text-decoration: none; margin: 32px 8px 42px 8px;" target="_blank">Download the ES 2016 Kit</a>
  <a class="au-button" href="http://aurelia.io/downloads/kit-typescript.zip" style="text-decoration: none; margin: 32px 8px 42px 8px;" target="_blank">Download the TypeScript Kit</a>
</div>

Based on your selection, you'll want to configure this documentation to show the appropriate language for all samples. Look at the top of this page. You will see a language selector. Be sure to select the language that matches the package that you downloaded.

Now that you've downloaded a starter package, you need to unzip it on your hard drive. Doing so will provide you with the default folder structure, scripts and styles needed to complete this tutorial and continue your learning and experimentation afterward. With the folder structure in place, next we'll need to start a web server to serve up your index.html page, so we can view it in a browser. How you go about doing that depends on which server-side technology you want to use. Below are instructions for a couple of common scenarios:

* **Visual Studio** - Open Visual Studio 2015. Using the main menu, select File > Open > Web site... In the resulting dialog, choose the starter kit folder then click the Open button. The folder contents will be displayed in the Visual Studio Solution Explorer window. Right click on index.html in Solution Explorer and select "View in Browser". This will fire up IISExpress and serve index.html.
* **NodeJS** - To start up a simple web server in the app folder, first globally install the http-server command with `npm install http-server -g`. (In some environments you many need to use `sudo`). Once that is installed, change directory to the starter kit folder. You can now spin up the server from within the folder with the following command `http-server -o -c-1`.
* **Firefox** - For the ES 2016 kit only, if you don't want to worry about setting up a web server, Firefox is flexible enough to serve the app directly from your hard drive. Simply open the `index.html` file with Firefox.

Once you've got your web server set up, navigate to the `index.html` page using your favorite browser. If everything is working correctly, you should see the message "Welcome to Aurelia!" displayed.

## [The Index.html Page](aurelia-doc://section/2/version/1.0.0)

If you've followed along this far, you now have everything set up to help you learn Aurelia. Let's start by taking a look at the `index.html` file. This file provides a good template for new Aurelia-based apps.

<code-listing heading="index.html">
  <source-code lang="HTML">
    <!doctype html>
    <html>
      <head>
        <title>Aurelia</title>
        <link rel="stylesheet" href="styles/styles.css">
        <meta name="viewport" content="width=device-width, initial-scale=1">
      </head>
      <body aurelia-app>
        <script src="jspm_packages/system.js"></script>
        <script src="config.js"></script>
        <script>
          SystemJS.import('aurelia-bootstrapper');
        </script>
      </body>
    </html>
  </source-code>
</code-listing>

Yes, that's it. This is the only HTML page in our application. The head of the document is pretty straight forward: just a style sheet link and some metadata. It's the body that's interesting.

Let's start with the script tags. First we have _system.js_, our standards-based module loader. It's what loads the Aurelia library as well as your own code. Next we have _config.js_. This contains configuration for the loader. It's generated automatically whenever you install packages with our tools. We've gone ahead and pre-installed everything for you in this tutorial, so you don't need to worry about that yet.

Once we have our module loader and its configuration, we load the `aurelia-bootstrapper` module with a call to `SystemJS.import`.

When the bootstrapper loads it inspects the HTML document for _aurelia-app_ attributes. In this case it will find that the body has an `aurelia-app` attribute. This tells the bootstrapper to load our _app_ view-model and its view, conventionally located in _app${context.language.fileExtension}_ and _app.html_ and then compose them as an Aurelia application in the DOM.

Wait a minute....we don't have an _app_ view-model or view. Ummm...WHAT NOW!?

## [Creating Your First Screen](aurelia-doc://section/3/version/1.0.0)

In Aurelia, user interface components have two parts: a _view_ and a _view-model_. The _view_ is written with HTML and is rendered into the DOM. The _view-model_ is written with ${context.language.name} and provides data and behavior to the _view_. Aurelia's powerful _databinding_ links the two pieces together allowing changes in your data to be reflected in the _view_ and vice versa. This Separation of Concerns is great for developer/designer collaboration, maintainability, architectural flexibility and even source control.

Let's see how it works...

In the _src_ folder find the _app.html_ and _app${context.language.fileExtension}_ files. This is the app component's view and view-model, the files that the bootstrapper is loading. Let's start by replacing the _view-model_ with a simple class to hold a _firstName_ and _lastName_. We'll also add a computed property for _fullName_ and a method to "submit" the person. Here's what your _app${context.language.fileExtension}_ file should look like after you have made the changes:

<code-listing heading="app${context.language.fileExtension}">
  <source-code lang="ES 2015">
    export class Welcome {
      constructor() {
        this.heading = 'Welcome to Aurelia!';
        this.firstName = 'John';
        this.lastName = 'Doe';
      }

      get fullName() {
        return `${this.firstName} ${this.lastName}`;
      }

      submit() {
        alert(`Welcome, ${this.fullName}!`);
      }
    }
  </source-code>
  <source-code lang="ES 2016">
    export class Welcome {
      heading = 'Welcome to Aurelia!';
      firstName = 'John';
      lastName = 'Doe';

      get fullName() {
        return `${this.firstName} ${this.lastName}`;
      }

      submit() {
        alert(`Welcome, ${this.fullName}!`);
      }
    }
  </source-code>
  <source-code lang="TypeScript">
    export class Welcome {
      heading: string = 'Welcome to Aurelia!';
      firstName: string = 'John';
      lastName: string = 'Doe';

      get fullName(): string {
        return `${this.firstName} ${this.lastName}`;
      }

      submit(): void {
        alert(`Welcome, ${this.fullName}!`);
      }
    }
  </source-code>
</code-listing>

Ok. Now that we have a _view-model_ with some basic data and behavior, let's use the following HTML to create the _view_:

<code-listing heading="app.html">
  <source-code lang="HTML">
    <template>
      <section>
        <h2>${heading}</h2>

        <form submit.trigger="submit()">
          <div>
            <label>First Name</label>
            <input type="text" value.bind="firstName">
          </div>
          <div>
            <label>Last Name</label>
            <input type="text" value.bind="lastName">
          </div>
          <div>
            <label>Full Name</label>
            <p>${fullName}</p>
          </div>
          <button type="submit">Submit</button>
        </form>
      </section>
    </template>
  </source-code>
</code-listing>

The first thing to notice is that all views are contained within a `template` tag, part of the W3C spec for Web Components. This particular view is a basic input form. Look at the input controls. Did you notice `value.bind="firstName"`? That databinds the input's _value_ to the _firstName_ property in our view-model. Any time the view-model's property changes, the input will be updated with the new value. Any time you change the value in the input control, Aurelia will push the new value into your view-model. It's that easy.

There are a couple more interesting things in this example. In the last form group you can see this syntax in the HTML content: `\${fullName}`. That's a string interpolation. It's a one-way binding from the view-model into the view that is automatically converted to a string and interpolated into the document. Finally, have a look at the form element itself. You should notice this: `submit.trigger="submit()"`. That's an event binding. Whenever the form's _submit_ event is fired the _submit_ method on the view-model will be invoked.

Let's refresh our browser to see the updated app in action. Pretty cool, yes!?

> Info: Binding Commands
> The `.bind` command uses the default binding behavior for any property. The default is one-way binding (model to view) for everything except form controls, which default to two-way. You can always override this by using the explicit binding commands `.one-way`, `.two-way` and `.one-time`. Similarly, you can use `.delegate` for event delegation in place of `.trigger`.

## [Adding Navigation](aurelia-doc://section/4/version/1.0.0)

A one page app isn't very interesting. We should probably add some more screens and set up a client-side router, don't you think? Let's begin by renaming our _app${context.language.fileExtension}_ and _app.html_ to _welcome${context.language.fileExtension}_ and _welcome.html_ respectively. This will be the first screen of our multi-screen app. Now, lets create a new _app${context.language.fileExtension}_ and _app.html_ which will serve as our "layout",  "master page" or "root component". The view will contain our navigation UI and the content placeholder for the current screen and the view-model will configure a router instance with our routes. We'll start with the view-model so you can see how to set up the router:

<code-listing heading="app${context.language.fileExtension}">
  <source-code lang="ES 2015/2016">
    export class App {
      configureRouter(config, router) {
        config.title = 'Aurelia';
        config.map([
          { route: ['','welcome'], name: 'welcome', moduleId: './welcome', nav: true, title:'Welcome' }
        ]);

        this.router = router;
      }
    }
  </source-code>
  <source-code lang="TypeScript">
    import {RouterConfiguration, Router} from 'aurelia-router';

    export class App {
      router: Router;

      configureRouter(config: RouterConfiguration, router: Router) {
        config.title = 'Aurelia';
        config.map([
          { route: ['','welcome'], name: 'welcome', moduleId: './welcome', nav: true, title:'Welcome' }
        ]);

        this.router = router;
      }
    }
  </source-code>
</code-listing>

Ok, we want to use the router, so we begin by creating and exporting our _App_ class and having it implement the `configureRouter` callback. This callback will be invoked with a configuration object. Using the configuration object, we set a title to use when generating the document's title, then map our routes. Each route has the following properties:

* `route`: This is a pattern which, when matched, will cause the router to navigate to this route. You can use static routes like above, but you can also use parameters like this: `customer/:id`. There's also support for wildcard routes and query string parameters. The route can be a single string pattern or an array of patterns as above.
* `name`: This is a name to use in code when generating URLs for the route.
* `moduleId`: This is a path which specifies the component you want to render for this route.
* `title`: You can optionally provide a title to be used in generating the document's title.
* `nav`: If this route should be included in the _navigation model_ because you want to generate a UI with it, set this to true (or a number indicating order).

<code-listing heading="app.html">
  <source-code lang="HTML">
    <template>
      <require from="bootstrap/css/bootstrap.css"></require>
      <require from="font-awesome/css/font-awesome.css"></require>

      <nav class="navbar navbar-default navbar-fixed-top" role="navigation">
        <div class="navbar-header">
          <button type="button" class="navbar-toggle" data-toggle="collapse" data-target="#bs-example-navbar-collapse-1">
            <span class="sr-only">Toggle Navigation</span>
            <span class="icon-bar"></span>
            <span class="icon-bar"></span>
            <span class="icon-bar"></span>
          </button>
          <a class="navbar-brand" href="#">
            <i class="fa fa-home"></i>
            <span>${router.title}</span>
          </a>
        </div>

        <div class="collapse navbar-collapse" id="bs-example-navbar-collapse-1">
          <ul class="nav navbar-nav">
            <li repeat.for="row of router.navigation" class="${row.isActive ? 'active' : ''}">
              <a href.bind="row.href">${row.title}</a>
            </li>
          </ul>

          <ul class="nav navbar-nav navbar-right">
            <li class="loader" if.bind="router.isNavigating">
              <i class="fa fa-spinner fa-spin fa-2x"></i>
            </li>
          </ul>
        </div>
      </nav>

      <div class="page-host">
        <router-view></router-view>
      </div>
    </template>
  </source-code>
</code-listing>

Following our simple app-building convention, the `App` class will be databound to the above view in _app.html_. A large part of this markup deals with setting up the main navigation structure. But before we get into that...do you see the `require` elements at the top of the view? In the same way that you can use `import` statements in ES2015/2016, Aurelia enables you to use `require` elements in HTML. The require element enables loading and including of functionality such as custom elements and behaviors, and in this case, CSS. Here, since our sample app is going to use some bootstrap styles and icons from font-awesome, we "require" those style sheets. With that in place, we can use bootstrap to lay out our navigation structure, as above. But that's not the interesting part of this view. What we really want to focus on is the binding and custom elements...

Since you've seen basic binding and string interpolation already, let's focus on the new stuff. Take a look at the navbar-nav `ul` element. Its `li` demonstrates how to use a repeater with the following expression `repeat.for="row of router.navigation"`. This will create one `li` for each item in the `router.navigation` array. The local variable is _row_ and you can see that used throughout the `li` and its child elements.

> Info
> The `navigation` property on the router is an array populated with all the routes you marked as `nav:true` in your route config. Aurelia models its `repeat.for` syntax after the new standard ES2015 `for..of` loop. So, you can think of looping over the array of navigable routes and generating UI for each.

Also on the `li` you can see a demonstration of how to use string interpolation to dynamically add/remove classes. Further down in the view, there's a second `ul`. See the binding on its single child `li`? `if.bind="router.isNavigating"` This conditionally adds/removes the `li` based on the value of the bound expression. Conveniently, the router will update its `isNavigating` property whenever it is....navigating.

The last piece we want to look at is the `router-view` custom element near the bottom of the view. This element, provided by Aurelia, represents the location in the DOM where the current "screen" will be rendered, based on the configured router's state.

With this in place, go ahead and refresh the browser and have a look. You should now see a main navigation with a single selected tab for our "welcome" route. The _welcome_ view should display in the main content area and function as before. Open up the browser's debug tools and have a look at the live DOM. You will see that the _welcome_ view content is displayed inside the `router-view`.

## [Adding a Second Page](aurelia-doc://section/5/version/1.0.0)

Well, we've technically got a navigation application now...but it's not very interesting because there's still only one screen. Let's add a second screen. Can you guess how to do it? I bet you can...

Let's display some users from Github. To do that, let's first configure our router for the hypothetical screen:

<code-listing heading="app${context.language.fileExtension} (updated)">
  <source-code lang="ES 2015/2016">
    export class App {
      configureRouter(config, router){
        config.title = 'Aurelia';
        config.map([
          { route: ['','welcome'],  name: 'welcome',  moduleId: './welcome',  nav: true, title:'Welcome' },
          { route: 'users',         name: 'users',    moduleId: './users',    nav: true, title:'Github Users' }
        ]);

        this.router = router;
      }
    }
  </source-code>
  <source-code lang="TypeScript">
    import {RouterConfiguration, Router} from 'aurelia-router';

    export class App {
      router: Router;

      configureRouter(config: RouterConfiguration, router: Router) {
        config.title = 'Aurelia';
        config.map([
          { route: ['','welcome'],  name: 'welcome',  moduleId: './welcome',  nav: true, title:'Welcome' },
          { route: 'users',         name: 'users',    moduleId: './users',    nav: true, title:'Github Users' }
        ]);

        this.router = router;
      }
    }
  </source-code>
</code-listing>

If you guessed that we need to create a _users${context.language.fileExtension}_ and _users.html_ file, you are correct. Here's the source:

<code-listing heading="users${context.language.fileExtension}">
  <source-code lang="ES 2015">
    import {HttpClient} from 'aurelia-fetch-client';
    import 'fetch';

    export class Users {
      static inject() { return [HttpClient]; }

      constructor(http) {
        this.http = http;
        this.heading = 'Github Users';
        this.users = [];

        http.configure(config => {
          config
            .useStandardConfiguration()
            .withBaseUrl('https://api.github.com/');
        });
      }

      activate() {
        return this.http.fetch('users')
          .then(response => response.json())
          .then(users => this.users = users);
      }
    }
  </source-code>
  <source-code lang="ES 2016">
    import {inject} from 'aurelia-framework';
    import {HttpClient} from 'aurelia-fetch-client';
    import 'fetch';

    @inject(HttpClient)
    export class Users {
      heading = 'Github Users';
      users = [];

      constructor(http) {
        http.configure(config => {
          config
            .useStandardConfiguration()
            .withBaseUrl('https://api.github.com/');
        });

        this.http = http;
      }

      activate() {
        return this.http.fetch('users')
          .then(response => response.json())
          .then(users => this.users = users);
      }
    }
  </source-code>
  <source-code lang="TypeScript">
    import {autoinject} from 'aurelia-framework';
    import {HttpClient} from 'aurelia-fetch-client';
    import 'fetch';

    @autoinject
    export class Users {
      heading: string = 'Github Users';
      users: any[] = [];

      constructor(private http: HttpClient) {
        http.configure(config => {
          config
            .useStandardConfiguration()
            .withBaseUrl('https://api.github.com/');
        });
      }

      activate() {
        return this.http.fetch('users')
          .then(response => response.json())
          .then(users => this.users = users);
      }
    }
  </source-code>
</code-listing>

There's a lot of cool stuff here. Let's start at the beginning. We are importing `HttpClient` from Aurelia's Fetch plugin, as well as the fetch polyfill. This lets us make HTTP requests in a very simple way, based on the upcoming W3C Fetch standard. This plugin is not included with the default Aurelia configuration but we've included it in this starter kit for you.

> Info
> In a later tutorial we'll talk more about the power of the integrated package manager and loader.

If you are using ES2016, take a look at the `inject` decorator. What does that do? Well, Aurelia creates the UI components as needed to render your app. It does this by using a [Dependency Injection](http://en.wikipedia.org/wiki/Dependency_injection) container capable of providing constructor dependencies like HttpClient. How does the DI system know what to provide? All you have to do is add that ES2016 `inject` decorator to your class. It should pass a list of types to provide instances of. There should be one argument for each constructor parameter. In the above example, we needed an HttpClient instance, so we added the `HttpClient` type in the `inject` decorator and then added a corresponding parameter in the constructor.

If you are sticking with ES2015, or don't want to use decorators, you can also add a static `inject` method or property to the class that returns an array of types to inject.

If you are using TypeScript >= 1.5, you can add the `@autoinject` decorator to your class and leave out the Types in the decorator call, but just use them on the constructor's signature.

Aurelia's router enforces a lifecycle on view-models whenever routes change. This is referred to as the "Screen Activation Lifecycle" or "Navigation Lifecycle". View-models can optionally hook into various parts of the lifecycle to control flow into and out of the route. When your route is ready to activate the router will call the `activate` hook, if present. In the above code, we use this hook to call the GitHub API and get some users back. Notice that we return the result of the http request back from our `activate` method. All the `HttpClient` APIs return a `Promise`. The router will detect a `Promise` and wait to complete navigation until after it resolves. So, in this way, you can optionally force the router to delay displaying the page until it is populated with data.

> Info: Navigation Lifecycle Hooks
> The full navigation lifecycle includes `canActivate`, `activate`, `canDeactivate` and `deactivate` hooks. The can* methods can return a boolean (or Promise of boolean) to accept or reject the transition into or out of the current screen.

> Info
> If you aren't familiar with [Promises](http://www.html5rocks.com/en/tutorials/es6/promises/), these are a new feature of ES2015 designed to improve asynchronous programming. A `Promise` is an object that represents a future result. Essentially, it represents a "promise" to complete some work or to provide some data at some point in the future.

<code-listing heading="users.html">
  <source-code lang="HTML">
    <template>
      <section>
        <h2>${heading}</h2>
        <div class="row au-stagger">
          <div class="col-sm-6 col-md-3 card-container" repeat.for="user of users">
            <div class="card">
              <canvas class="header-bg" width="250" height="70"></canvas>
              <div class="avatar">
                <img src.bind="user.avatar_url" crossorigin />
              </div>
              <div class="content">
                <p class="name">${user.login}</p>
                <p><a target="_blank" class="btn btn-default" href.bind="user.html_url">Contact</a></p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </template>
  </source-code>
</code-listing>

The view for this screen is pretty straight forward. There's nothing you haven't seen before. Once you've got all this in place, go ahead and run your app again. You should now see two items in the nav bar and be able to switch back and forth between them. Huzzah!

Let's recap. To add a page to your app:

1. Add the route configuration to the _app${context.language.fileExtension}_ router.
2. Add a view-model.
3. Add a view with the same name (but with an .html extension).
4. Celebrate.

## [Bonus: Creating a Custom Element](aurelia-doc://section/6/version/1.0.0)

Look at you, you overachiever! I see you're interested in learning some extra awesome on this fine day. In that case, let's create a custom HTML element. I think a good candidate for this is our navbar. That's a lot of HTML in our _app.html_ file. Why not extract a custom `<nav-bar>` element to make things a bit more declarative? Here's what we want to be able to write in the end:

<code-listing heading="app.html">
  <source-code lang="HTML">
    <template>
      <require from="bootstrap/css/bootstrap.css"></require>
      <require from="font-awesome/css/font-awesome.css"></require>
      <require from='./nav-bar'></require>

      <nav-bar router.bind="router"></nav-bar>

      <div class="page-host">
        <router-view></router-view>
      </div>
    </template>
  </source-code>
</code-listing>

This code requires a `nav-bar` element from "nav-bar" and once it's available in the view, we can use it like any other element, including databinding to its custom properties (like _router_). So, how do we get to this end product?

Guess what? Our simple view-model/view conventions still apply for custom elements. Let's create a _nav-bar${context.language.fileExtension}_ and a _nav-bar.html_. Here's the code for the view-model first:

<code-listing heading="nav-bar${context.language.fileExtension}">
  <source-code lang="ES 2015">
    import {bindable, decorators} from 'aurelia-framework';

    export let NavBar = decorators(bindable('router')).on(class {
      constructor() {
        this.router = null;
      }
    });
  </source-code>
  <source-code lang="ES 2016">
    import {bindable} from 'aurelia-framework';

    export class NavBar {
      @bindable router = null;
    }
  </source-code>
  <source-code lang="TypeScript">
    import {bindable} from 'aurelia-framework';
    import {Router} from 'aurelia-router';

    export class NavBar {
      @bindable router: Router = null;
    }
  </source-code>
</code-listing>

To create a custom element, you create and export a class. Since this class is going to be used in HTML as an element, we need to tell the framework what properties on the class should appear as attributes on the element. To do that, we use the _bindable_ decorator. Like _inject_, _bindable_ is a way to provide information about your class to the Aurelia framework. Aurelia is smart and can infer many things, but when it can't or when you want to do something different than the conventions, you supply some additional information through decorators. The `bindable` decorator tells the framework that we want our class's `router` property to be surfaced as an attribute in the HTML. Once it's surfaced as an attribute, we can bind to it in the view.

<code-listing heading="nav-bar.html">
  <source-code lang="HTML">
    <template>
      <nav class="navbar navbar-default navbar-fixed-top" role="navigation">
        <div class="navbar-header">
          <button type="button" class="navbar-toggle" data-toggle="collapse" data-target="#bs-example-navbar-collapse-1">
            <span class="sr-only">Toggle Navigation</span>
            <span class="icon-bar"></span>
            <span class="icon-bar"></span>
            <span class="icon-bar"></span>
          </button>
          <a class="navbar-brand" href="#">
            <i class="fa fa-home"></i>
            <span>${router.title}</span>
          </a>
        </div>

        <div class="collapse navbar-collapse" id="bs-example-navbar-collapse-1">
          <ul class="nav navbar-nav">
            <li repeat.for="row of router.navigation" class="${row.isActive ? 'active' : ''}">
              <a href.bind="row.href">${row.title}</a>
            </li>
          </ul>

          <ul class="nav navbar-nav navbar-right">
            <li class="loader" if.bind="router.isNavigating">
              <i class="fa fa-spinner fa-spin fa-2x"></i>
            </li>
          </ul>
        </div>
      </nav>
    </template>
  </source-code>
</code-listing>

This looks almost identical to the navbar HTML in our original _app.html_ file. We've basically extracted that and put it into this template. Instead of binding to _app${context.language.fileExtension}_ though, it's now binding to _nav-bar${context.language.fileExtension}_.

This is a very simple custom element with no real behavior, but it is complete and usable as shown above.

Wait! I know what you are thinking. This custom element is so simple...it seems a bit silly to require a ${context.language.name} class just to define the single `router` property. Couldn't we get rid of that somehow? Well, the answer is YES. For very simple elements which have no behavior but simply provide a view that can be bound to a set of properties, we can omit the ${context.language.name} file altogether. Let's see how that works.

First, delete the _nav-bar${context.language.fileExtension}_ file. Next, we need to make one change to the _nav-bar.html_ file. On the template element, we can declare the bindable properties of our element like this:

<code-listing heading="nav-bar.html">
  <source-code lang="HTML">
    <template bindable="router">
      ...
    </template>
  </source-code>
</code-listing>

We can have more than one property by separating them by commas. Finally, we need to update our _app.html_ file so that the `require` element points to our html component. Here's what it should look like:

<code-listing heading="app.html">
  <source-code lang="HTML">
    <template>
      <require from="bootstrap/css/bootstrap.css"></require>
      <require from="font-awesome/css/font-awesome.css"></require>
      <require from='./nav-bar.html'></require>

      <nav-bar router.bind="router"></nav-bar>

      <div class="page-host">
        <router-view></router-view>
      </div>
    </template>
  </source-code>
</code-listing>

> Info: View Encapsulation
> Anything required into a view with the `require` element has visibility only inside that view. As a result, you don't have to worry about name conflicts between various view resources. For convenience, you can also load app-wide elements and other behaviors during your application's bootstrapping phase.

You may wonder how Aurelia determines the name of the custom element. By convention, it will use the export name of the class, lowered and hyphenated. In our html-only scenario, it will use the file name.

In addition to creating custom elements, you can also create custom attributes which add new behavior to existing elements. On occasion you may even need an attribute to dynamically control templates by adding and removing DOM from the view, like the `repeat` and `if` we used above. You can do all that and much more with Aurelia's powerful and extensible templating engine. Here's a secret...none of Aurelia's so-called "built in" behaviors are actually built in. They are in their own library and are "installed" into Aurelia as a plugin. We provide our built-ins using the same core that you have to build your own apps and plugins.

## [Bonus: Leveraging Child Routers](aurelia-doc://section/7/version/1.0.0)

Can't get enough can you? Well, I've got a treat for you. Let's add a third page to our app...with its own router! We call this a child router. Child routers have their own route configuration and navigate relative to the parent router. Prepare thyself for insanity....

First, let's update our _app${context.language.fileExtension}_ with the new configuration. Here's what it should look like:

<code-listing heading="app${context.language.fileExtension} (updated...again)">
  <source-code lang="ES 2015/2016">
    export class App {
      configureRouter(config, router) {
        config.title = 'Aurelia';
        config.map([
          { route: ['','welcome'],  name: 'welcome',      moduleId: './welcome',      nav: true, title:'Welcome' },
          { route: 'users',         name: 'users',        moduleId: './users',        nav: true, title:'Github Users' },
          { route: 'child-router',  name: 'child-router', moduleId: './child-router', nav: true, title:'Child Router' }
        ]);

        this.router = router;
      }
    }
  </source-code>
  <source-code lang="TypeScript">
    import {RouterConfiguration, Router} from 'aurelia-router';

    export class App {
      router: Router;

      configureRouter(config: RouterConfiguration, router: Router) {
        config.title = 'Aurelia';
        config.map([
          { route: ['','welcome'],  name: 'welcome',      moduleId: './welcome',      nav: true, title:'Welcome' },
          { route: 'users',         name: 'users',        moduleId: './users',        nav: true, title:'Github Users' },
          { route: 'child-router',  name: 'child-router', moduleId: './child-router', nav: true, title:'Child Router' }
        ]);

        this.router = router;
      }
    }
  </source-code>
</code-listing>

Nothing new there. The interesting part is what's inside _child-router${context.language.fileExtension}_...

<code-listing heading="child-router${context.language.fileExtension}">
  <source-code lang="ES 2016">
    export class ChildRouter {
      heading = 'Child Router';

      configureRouter(config, router){
        config.map([
          { route: ['','welcome'],  name: 'welcome',       moduleId: './welcome',       nav: true, title:'Welcome' },
          { route: 'users',         name: 'users',         moduleId: './users',         nav: true, title:'Github Users' },
          { route: 'child-router',  name: 'child-router',  moduleId: './child-router',  nav: true, title:'Child Router' }
        ]);

        this.router = router;
      }
    }
  </source-code>
  <source-code lang="ES 2015">
    export class ChildRouter {
      constructor() {
        this.heading = 'Child Router';
      }

      configureRouter(config, router) {
        config.map([
          { route: ['','welcome'],  name: 'welcome',       moduleId: './welcome',       nav: true, title:'Welcome' },
          { route: 'users',         name: 'users',         moduleId: './users',         nav: true, title:'Github Users' },
          { route: 'child-router',  name: 'child-router',  moduleId: './child-router',  nav: true, title:'Child Router' }
        ]);

        this.router = router;
      }
    }
  </source-code>
  <source-code lang="TypeScript">
    import {RouterConfiguration, Router} from 'aurelia-router';

    export class ChildRouter {
      heading: string = 'Child Router';
      router: Router;

      configureRouter(config: RouterConfiguration, router: Router) {
        config.map([
          { route: ['','welcome'],  name: 'welcome',       moduleId: './welcome',       nav: true, title:'Welcome' },
          { route: 'users',         name: 'users',         moduleId: './users',         nav: true, title:'Github Users' },
          { route: 'child-router',  name: 'child-router',  moduleId: './child-router',  nav: true, title:'Child Router' }
        ]);

        this.router = router;
      }
    }
  </source-code>
</code-listing>

What!? It's practically the same configuration as `App`? What? Why? Well...you should probably never do this in real life...but it's pretty cool what this does. This, my friends, is a recursive router, and we're doing it because we can.

For completeness, here's the view:

<code-listing heading="child-router.html">
  <source-code lang="HTML">
    <template>
      <section>
        <h2>${heading}</h2>
        <div>
          <div class="col-md-2">
            <ul class="well nav nav-pills nav-stacked">
              <li repeat.for="row of router.navigation" class="${row.isActive ? 'active' : ''}">
                <a href.bind="row.href">${row.title}</a>
              </li>
            </ul>
          </div>
          <div class="col-md-10" style="padding: 0">
            <router-view></router-view>
          </div>
        </div>
      </section>
    </template>
  </source-code>
</code-listing>

Run the app and see the magic....and pray the universe doesn't explode.

## [Conclusion](aurelia-doc://section/8/version/1.0.0)

With its strong focus on developer experience, Aurelia can enable you to not only create amazing applications, but also enjoy the process. We've designed it with simple conventions in mind so you don't need to waste time with tons of configuration or write boilerplate code just to satisfy a stubborn or restrictive framework. You'll never hit a roadblock with Aurelia either. It's been carefully designed to be pluggable and customizable.

Thanks for taking the time to read through our guide. We hope you'll explore the docs and build something awesome. We look forward to seeing what you will make.
