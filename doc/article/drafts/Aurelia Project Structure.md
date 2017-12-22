#Introduction
There's been a ton of requests in the Aurelia community for guidance on how to structure larger projects. To help provide some clarity, I've created an example folder structure for a members-only e-commerce application. I have posted the folder and file structure to GitHub [here](https://github.com/AshleyGrant/aurelia-style-guide/tree/master/suggested-project-structure/src). The driving force with this folder structure is organizing an application by feature. 

It's important to note that this project structure attempts to be agnostic of what tools you use for building, testing, and bundling your application. Those decisions should not, in general affect the structure presented here. Also, note that this guide should not, by any means, be considered "the only way" to structure your Aurelia application. If this folder structure does not work for you, or doesn't make sense for a particular application, you are free to tweak it (or even completely ignore it). This project structure uses `js` file extensions, but this does not limit this project structure to only JavaScript applications. This structure will work just as well for TypeScript.

Consistency is key! Use these suggestions as a basis for your application. Tweak them as necessary, but make sure to adhere to a single set of rules for your application regarding structure and file naming. This will make your life easier!

Root Directory Structure
```text
.
|-- img
|-- lib
|-- src
`-- styles
```

The root directory for this application contains four directories: `img`, `lib`, `src`, and `styles`. Each of these directories is optional, save for `src`. The `img` directory contains global images such as the application logo. The `lib` directory is where libraries that are not distributed via whatever package manager we are using will be placed. These libraries are likely loaded via a simple `script` element in the `index.html` file for the application. The `src` directory contains all JavaScript (or TypeScript) source files for the application as well as any supporting files. It is likely that your build tooling will transpile or otherwise "work" with all of the files in this folder. The `styles` directory contains global styles for your application. These may be `css` files, or it may be in a format that needs to be compiled to `css`. 

##`img`
You are free to structure this folder as necessary for your application. This directory is *not* where dynamically retrieved images should be located. For example, your application's logo and images used in styling the application would be placed in this folder, but product images, or user avatars would not be stored here.

##`lib`
When creating Aurelia applications, you are likely going to be using a package manager such as `npm` or `jspm` to handle dependencies for your application. Unfortunately, there are many resources that are not distributed via these package managers. If your application relies on a JavaScript library, CSS Framework, jQuery widget, or other item like this, `lib` is where you'll put these items. For dependencies that consist of a single file, it is fine to put them directly in the `lib` directory, but larger dependencies should be placed in their own directory within `lib`.

##`styles`
Application level styles should be placed in the `styles` directory and loaded via a `link` element. This directory is just a recommendation, and it is perfectly acceptable to place application level styles in the `src` directory and load them using Aurelia's loader if you desire.

##`src`
The `src` directory is where your application's main source code will live. The structure of the application in this directory will be discussed in depth below.

#Source Code Structure

Let's first look at the entire directory and file structure we'll be exploring.

```text
.
|-- account
|   |-- account-service.js
|   |-- account-service.spec.js
|   |-- account.html
|   |-- account.js
|   `-- account.spec.js
|-- admin
|   |-- logs
|   |   |-- logs-service.js
|   |   |-- logs.css
|   |   |-- logs.html
|   |   `-- logs.js
|   |-- users
|   |   |-- users-service.js
|   |   |-- users.html
|   |   `-- users.js
|   |-- index.html
|   |-- index.js
|   `-- routes.js
|-- cart
|   |-- __tests__
|   |   |-- cart-service.spec.js
|   |   `-- cart.spec.js
|   |-- cart-service.js
|   |-- cart.html
|   `-- cart.js
|-- daily-deals
|   |-- daily-deal-service.js
|   |-- daily-deals.html
|   `-- daily-deals.js
|-- home
|   |-- home.html
|   `-- home.js
|-- login
|   |-- login.html
|   `-- login.js
|-- orders
|   |-- order-service.js
|   |-- order.html
|   |-- order.js
|   |-- orders.html
|   `-- orders.js
|-- product
|   |-- product-service.js
|   |-- product.html
|   `-- product.js
|-- resources
|   |-- attributes
|   |   `-- blur.js
|   |-- binding-behaviors
|   |   `-- throttle.js
|   |-- dialogs
|   |   |-- message-box.html
|   |   `-- message-box.js
|   |-- elements
|   |   |-- data-grid.html
|   |   `-- data-grid.js
|   |-- value-converters
|   |   `-- date.js
|   `-- index.js
|-- search
|   |-- results.html
|   |-- results.js
|   |-- search.html
|   `-- search.js
|-- shell
|   |-- header.html
|   |-- routes.js
|   |-- shell.html
|   |-- shell.js
|   `-- sidebar.html
`-- main.js
```

## Organize By Feature
This directory structure has been organized by logical features (account management, administrative tasks, etc). It is import to note that, thanks to Aurelia's router, the organization of files on disk need not correspond to URL hashes used at runtime. The main shell for the application is a feature, so it is separated into its own directory. It is also possible for features to have sub-features. 

When a feature has more than two or three sub-features, you should consider moving the sub-features to separate sub-directories. An example of this is the `admin` feature, which has multiple sub-features that have been organized. This will help with maintenance as your application grows. 

Organization by feature keeps logically related files together, e.g. views and their viewmodels. This allows your application to take advantage of Aurelia's default convention of looking for a view and viewmodel in the same directory. It also removes the need to constantly bounce around the project's directory tree to make edits to related files.

## Naming Files and Folders
In an Aurelia application, you will typically take the name of a file's main exported class or function as the name of the file. You will convert the name from `InitCaps` or `camelCase` to `dash-case`. If a class has a suffix to match Aurelia's naming conventions, e.g. `FooCustomElement`, `FooValueConverter`, you will not include the suffix in the file name. Thus `FooCustomElement` will be in `foo.js` while `FooBarValueConverter` will be in `foo-bar.js`. The `dash-case` naming convention applies to directories as well.

Support modules, such as classes that provide a wrapper for business logic, are named following the same naming convention, though if you append `Service` or `Provider` or some other suffix to the class name, it's recommended that you include this in the file name, e.g. `FooBarService` will be in `foo-bar-service.js`.

It is recommended to include an `index` file pair in any folder that is large enough to have sub-feature folders. This file will serve as a base for the feature's functionality and help developers recognize the entry point that Aurelia uses for a directory. Smaller features may follow the naming conventions above, though it is recommended that the main module in a feature match the folder name to help developers recognize the main files for a folder.

## Business Logic Does Not Belong in ViewModels
Aurelia helps create applications using the MVVM (Model-View-ViewModel) design pattern. The JavaScript class that is paired with an Aurelia view is a "ViewModel." A View Model has properties and functions that can be utilized in the view via Aurelia's Databinding system. A key feature of the MVVM pattern is that business logic does not belong in the viewmodel. There is plenty of guidance regarding how to extract business logic from your VMs online, but the gist of this is that business logic should be moved to service classes, or to functions on the model, while UI focused logic is kept in the viewmodel. This will help create an application that is more maintainable by separating UI logic from Business Logic.

For example, an e-commerce application is likely to offer multiple payment options. It may allow the user to select their preferred payment option using a radio button list, and then display a UI for the selected payment option based on the radio selection. Showing and hiding the UI for the various payment options is purely a UI concern, and thus this logic can be contained in the ViewModel, but making the HTTP calls to process a payment when the user clicks the "Pay" button is a business operation, and thus this logic should not be in the viewmodel.

## Two Options for Organizing Tests
This directory structure provides two options for organizing your unit and end-to-end tests. The `account` directory shows having a `spec` folder in the same directory as the file it is testing. The `cart` directory shows having a `__tests__` directory to segregate tests from the code while simultaneously keeping them very close to the code they test. Either option is acceptable, but you must pick one of these options and stick with it, as this decision will likely have consequences for your testing configuration.  It will be necessary to properly configure your transpiler or bundler to exclude test files when creating a build of your application for distribution.

I don't recommended to place tests in a separate top-level directory as is currently done in the Aurelia Skeleton projects. Doing this separates tests from the code being tested and is likely to lead to developers being less likely to write tests. Do note that most of the Aurelia team (including Rob) disagree with me on this point.

It is recommended that test files name match the file being tested with a suffix of `spec`, e.g. `account.js` will be tested by `account.spec.js`.

## Placing routes in their own file
Placing routes in a file of their own helps cleanly separate routing configuration. Developers will not have to hunt for route configuration when adding a new route.

## `resources` directory for global resources
The `resources` directory is where any global resources for your applications should be placed. The `index.js` file allows this directory to act as an Aurelia feature that is installed in `main.js`

## `main.js`
The `main.js` file is where your Aurelia application's startup code will go. It will likely point Aurelia to the login component as the application root. 

#Conclusion
This post serves as a starting point, both for your application as well as for discussion on these recommendations. As I've stated previously, it isn't required that you agree with and follow every recommendation in this post. What is important is that you (or your team) decide on the standards for organizing the codebase and naming files and then STICK TO THEM! Coding standards are different everywhere, but they are also important everywhere!
