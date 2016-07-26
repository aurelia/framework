---
{
  "name": "Contact Manager Tutorial",
  "culture": "en-US",
  "description": "Now that you've got the basics down, you need to learn how to use the CLI, build a more complex app and get a solid knowledge foundation for real-world work. In this tutorial we'll build a small contact manager app and demonstrate a variety of Aurelia's features as well as learn some useful techniques.",
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
## [Setting Up Your Machine](aurelia-doc://section/1/version/1.0.0)

For this tutorial, we're going to use the Aurelia CLI. If you've already setup your machine with the CLI, you can skip to the next section. If not, then please install the following CLI prerequisites:

* Install NodeJS version 4.x or above.
    * You can [download it here](https://nodejs.org/en/).
* Install a Git Client
    * Here's [a nice GUI client](https://desktop.github.com).
    * Here's [a standard client](https://git-scm.com).

Once you have the prerequisites installed, you can install the Aurelia CLI itself. From the command line, use npm to install the CLI globally:

```
npm install aurelia-cli -g
```

> Info
> Always run commands from a Bash prompt. Depending on your environment, you may need to use `sudo` when executing npm global installs.

> Warning
> While creating a new project doesn't require NPM 3, front-end development, in general, requires a flat-package structure, which is not available with NPM versions prior to 3. It is recommended that you update to NPM 3, which will be able to manage this structural requirement. You can check your NPM version with `npm -v`. If you need to update, run `npm install npm -g`.

## [Creating A New Aurelia Project](aurelia-doc://section/2/version/1.0.0)

Now, that you've got your machine setup, we can create our contact manager app. To create the project, run `au new` from the command line. You will be presented with a number of options. Name the project "contact-manager" and then select either "Default ESNext" or "Default TypeScript" depending on what is most comfortable for you.

Once you've made your choice, the CLI will show you your selections and ask if you'd like to create the file structure. Hit enter to accpet the default "yes". After that, you'll be asked if you would like to install your new project's dependencies. Press enter to select the default "yes" for this as well.

Once the dependencies are installed (it will take a few minutes), your project is ready to go. Just change directory into the project folder and run it by typing `au run --watch`. This will run the app and watch the project's source for changes. Open a web browser and navigate to the url indicated in the CLI's output. If you've got everything setup correctly, you should see the message "Hello World!" in the browser.

## [Adding Required Assets](aurelia-doc://section/3/version/1.0.0)

For this tutorial, we're going to be working against a fake, in-memory backend. We've also pre-created the CSS and some utility functions, so we don't have to waste time on that here. Before we begin writing the app, you'll need to download these required assets and add them to your project.

<div style="text-align: center; margin-bottom: 32px">
  <a class="au-button" href="http://aurelia.io/downloads/contat-manager-assets.zip" target="_blank">Download the Contact Manager Assets</a>
</div>

Once you've downloaded the zip file, extract it and you'll find three files:

* `web-api.js` - The fake, in-memory backend.
* `utility.js` - Some helper functions used by the app.
* `styles.css` - The styles for this app.

Copy all of these files to the `src` folder of your project. TypeScript users should also rename the file extensions from `.js` to `.ts`.

## [Building the Application Shell](aurelia-doc://section/4/version/1.0.0)

Let's start by looking at a picture of the final product of this tutorial. It will help us to see the application's structure and the pieces we need to build.

![The Final Contact Manager App](img/contact-app-final.png)

In the picture, you can see that we have a header across the top, a contact list on the left and a detail pane filling the rest of the space. We'll refer to the over-arching application structure, as the shell or layout of our app. Let's begin by putting that in place now.

To begin, we're going to setup our `App` class by configuring it with a router. We want our browser history to reflect which contact in our list is selected, so we'll introduce a client-side router to handle the navigation from screen to screen. Replace the code in your `app{context.language.fileExtension}` with the following:

<code-listing heading="app${context.language.fileExtension}">
  <source-code lang="ES 2016/2016">
    export class App {
      configureRouter(config, router){
        config.title = 'Contacts';
        config.map([
          { route: '',              moduleId: 'no-selection',   title: 'Select'},
          { route: 'contacts/:id',  moduleId: 'contact-detail', name:'contacts' }
        ]);

        this.router = router;
      }
    }
  </source-code>
  <source-code lang="TypeScript">
    import {Router, RouterConfiguration} from 'aurelia-router';

    export class App {
      router: Router;

      configureRouter(config: RouterConfiguration, router: Router){
        config.title = 'Contacts';
        config.map([
          { route: '',              moduleId: 'no-selection',   title: 'Select'},
          { route: 'contacts/:id',  moduleId: 'contact-detail', name:'contacts' }
        ]);

        this.router = router;
      }
    }
  </source-code>
</code-listing>

To add routing to your app, all you have to do is add a `configureRouter` method to your `App` class. The framework will call this method, passing it a `RouterConfiguration` and a `Router`. You can use the configuration object to get the router setup with the routes you want. Use the `map` method to map route patterns to the modules that should handle the patterns. Minimally, each route needs at least a `route` pattern and a `moduleId`.

In the case above, we are registering two routes. The first route is empty, indicated by `route: ''`. This will be the default route that is matched when there is no fragment. This route will cause the `no-selection` module to load. We'll use this to display a nice message to the user, if they haven't selected a contact to view. The second route has the pattern `contacts/:id`. This will match the literal `contacts/` followed by a parameter, which we've named `id`. When this route is matched, the router will load the `contact-detail` module so that we can display the selected contact.

There are a couple more points of interest with this configuration. First, notice that we've set the `router.title` property. This sets a base "title" to be used in the document's title for the browser. We can also set a `title` on each route. When we do that, the router's title and the matched route's title will be joined together to form the final document title. The second thing to notice is that the second route has a `name` property. We'll be able to use this later to generate routes without needing to copy/paste the route pattern everywhere. Instead we can just refer to the route by name.

Now that we've configured our application's navigation structure, we need to put the visual structure in place. To do that, replace your `app.html` file with the following markup:

<code-listing heading="app.html">
  <source-code lang="HTML">
    <template>
      <require from="bootstrap/css/bootstrap.css"></require>
      <require from="./styles.css"></require>

      <nav class="navbar navbar-default navbar-fixed-top" role="navigation">
        <div class="navbar-header">
          <a class="navbar-brand" href="#">
            <i class="fa fa-user"></i>
            <span>Contacts</span>
          </a>
        </div>
      </nav>

      <div class="container">
        <div class="row">
          <div class="col-md-4">Contact List Placeholder</div>
          <router-view class="col-md-8"></router-view>
        </div>
      </div>
    </template>
  </source-code>
</code-listing>

There are several interesting things to note about this view. First, take a look at the `require` elements at the top of the view. This is how we can "import" or "require" various resources into our view. It's the view equivalent of the ES 2015 "import" syntax. Just as JavaScript is modularized and requires importing of other resources, so do Aurelia views. In this specific case, we're indicating that we want to bring in bootstrap's CSS as well as our own custom styles. Of course, we haven't actually installed Bootstrap yet. We'll get to that in a minute.

Below the `require` elements, you can see a pretty standard structure. We have some HTML to setup a navbar at the top. Below that we have the application's main container div. This has two columns. The first will contain our contact list, indicated byt he placeholder div. The second contains a `router-view` custom element.

The `router-view` is provided by Aurelia and is a placeholder that indicated where the router should render the current route. This allows you to structure your application layout however you want, simply placing the `router-view` wherever you want to see the current page rendered. Whenever you have a `configureRouter` method, the view must also contain a `router-view`.

We're almost done setting up the application shell. Before we're done, we need to install Bootstrap. We'll be using that in this tutorial in order to give our application a decent appearance. In your own apps, you can use any CSS framework you like.

To get Bootstrap setup, we begin by installing the library itself with NPM. Execute the following on the command line to do this:

```
npm install bootstrap --save
```

Next, because Bootstrap uses jQuery, we want to install jQuery as well, like this:

```
npm install jquery@^2.2.4 --save
```

With these libraries installed, we now need to tell Aurelia which application bundle they should be included in and how to properly configure then with the module system. To do this, look in the `aurelia_project` folder and open up the `aurelia.json` file. This file contains all the information that the Aurelia CLI uses to build our project. If you scroll down, you will see a `bundles` section. There are two bundles defined by default: `app-bundle.js`, which contains your code and `vendor-bundle.js` which contains all 3rd party libraries. We need to add a new items to the `dependencies` array of the `app-bundle.js` bundle. Add the following two entries for jQuery and Bootstrap:

<code-listing heading="A Legacy Library Dependency">
  <source-code lang="JavaScript">
    "dependencies": [
      ...
      "jquery",
      {
        "name": "bootstrap",
        "path": "../node_modules/bootstrap/dist",
        "main": "js/bootstrap.min",
        "deps": ["jquery"],
        "exports": "$",
        "resources": [
          "css/bootstrap.css"
        ]
      },
      ...
    ]
  </source-code>
</code-listing>

You can read more about configuring 3rd party libraries in the documentation on the Aurelia CLI. For now, just know that this causes jQuery, Bootstrap and all necessary CSS to be included in the vendor bundle and makes it reachable through the module system.

## [Building Out the Default Route](aurelia-doc://section/5/version/1.0.0)

If you run the application now, you'll see a blank screen and the browser's console will display the following message:

```
Failed to load resource: the server responded with a status of 404 (Not Found) http://localhost:9000/src/no-selection.js
ERROR [app-router] Error: Script error for "no-selection"
```

This is actually expected. Why? Well, we have now configured a router, that router is matching on the empty route pattern we defined and it's trying to load the `no-selection` module, but we haven't created that yet. Let's do that now. Create a new file under `src` named `no-selection{context.language.fileExtension}` and give it the following code:

<code-listing heading="no-selection${context.language.fileExtension}">
  <source-code lang="ES 2016/2016">
    export class NoSelection {
      constructor() {
        this.message = "Please Select a Contact.";
      }
    }
  </source-code>
  <source-code lang="TypeScript">
    export class NoSelection {
      message = "Please Select a Contact.";
    }
  </source-code>
</code-listing>

This will provide the basic functionality for our "no selection" screen. All we want to do is display a message to our end user to select a contact. Now, let's add a view to render this view-model. Create another file named `no-selection.html` and add that to your `src` folder with the following contents:

<code-listing heading="no-selection.html">
  <source-code lang="HTML">
    <template>
      <div class="no-selection text-center">
        <h2>${message}</h2>
      </div>
    </template>
  </source-code>
</code-listing>

All it does is provide a container with some styling in order to display our message to the user. With this in place, you should now be able to run your application. If you haven't stopped/restarted it after editing the bundles, then you will need to do that now. When you run the application, you should see something like this:

![No Selection Screen](img/contact-app-no-selection.png)

## [Building Out the Contact List](aurelia-doc://section/6/version/1.0.0)

## [Building Out the Contact Detail Screen](aurelia-doc://section/7/version/1.0.0)

## [Adding Pub/Sub Messaging](aurelia-doc://section/8/version/1.0.0)
