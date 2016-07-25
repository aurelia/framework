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

* Install NodeJS >= 4.x
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
> While creating a new project doesn't require NPM 3, front-end development, in general, requires a flat-package structure, which is not what NPM < 3 provides. It is recommended that you update to NPM 3, which will be able to manage this structural requirement. You can check your NPM version with `npm -v`. If you need to update, run `npm install npm -g`.

## [Creating A New Aurelia Project](aurelia-doc://section/2/version/1.0.0)

Now, that you've got your machine setup, we can create our contact manager app. To create the project, run `au new` from the command line. You will be presented with a number of options. Name the project "contact-manager" and then select either "Default ESNext" or "Default TypeScript" depending on what is most comfortable for you.

Once you've made your choice, the CLI will show you your selections and ask if you'd like to create the file structure. Hit enter to accpet the default "yes". After that, you'll be asked if you would like to install your new project's dependencies. Press enter to select the default "yes" for this as well.

Once the dependencies are installed (it will take a few minutes), your project is ready to go. Just change directory into the project folder and run it by typing `au run --watch`. This will run the app and watch the project's source for changes. Open a web browser and navigate to the url indicated in the CLI's output. If you've got everything setup correctly, you should see the message "Hello World!" in the browser.

## [Adding Required Assets](aurelia-doc://section/3/version/1.0.0)

For this tutorial, we're going to be working against a fake, in-memory backend. We've also pre-created the CSS, so we don't have to waste time on that here. Before we begin writing the app, you'll need to download these required assets and add them to your project.

<div style="text-align: center; margin-bottom: 32px">
  <a class="au-button" href="http://aurelia.io/downloads/contat-manager-assets.zip" target="_blank">Download the Contact Manager Assets</a>
</div>

Once you've downloaded the zip file, extract it and you'll find two files:

* `web-api.js` - The fake, in-memory backend.
* `styles.css` - The styles for this app.

Copy both of these files to the `src` folder of your project.
