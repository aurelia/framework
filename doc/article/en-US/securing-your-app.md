---
{
  "name": "Securing Your App",
  "culture": "en-US",
  "description": "It's important to secure your application. This article will address a couple of simple things you can do to improve the security of your application.",
  "engines" : { "aurelia-doc" : "^1.0.0" },
  "author": {
  	"name": "Rob Eisenberg",
  	"url": "http://robeisenberg.com"
  },
  "contributors": [],
  "translators": [],
  "keywords": ["Security", "SPA"]
}
---
## [Introduction](aurelia-doc://section/1/version/1.0.0)

The first rule of securing client-side applications: The client cannot be trusted. Your backend should not trust the input coming from the front-end, under any circumstance. Malicious individuals often know how to use browser debug tools and manually craft HTTP requests to your backend. You may even find yourself in a situation where a disgruntled employee (or former employee), who is a developer with intimate knowledge of the system, is seeking revenge by attempting a malicious attack.

**Your primary mechanism for securing any SPA application, Aurelia or otherwise, is to work hard on securing your backend services.**

> Danger: Security Advice
> This article, more or less, contains only a few quick warnings. It is in no way exhaustive, nor should it be your only resource on securing your application. The bulk of the work in security relates to your server-side technology. You should spend adequate time reading up on and understanding security best practices for whatever backend tech you have chosen.

## [Authentication and Authorization](aurelia-doc://section/2/version/1.0.0)

When designing your application, consider which backend API calls can be made anonymously, which require a logged-in user and which roles or permissions are required for various authenticated requests. Ensure that your entire API surface area is explicitly covered in this way. Your front-end can facilitate the login process, but ultimately this is a backend task. Here are a few related recommendations:

* Make sure your server is configured to transmit sensitive resources over HTTPS. You may want to transmit all resources this way. It is more server-intensive, but it will be more secure. You must decide what is appropriate for your application.
* Don't transmit passwords in plain text.
* There are various ways to accomplish CORS. Prefer to use a technique based on server-supported CORS, rather than client-side hacks.
* Control cross-domain requests to your services. Either disallow them or configure your server based on a strict whitelist of allowed domains.
* Require strong passwords
* Never, ever store passwords in plain text.
* Do not allow an endless number of failed login attempts to the same account.
* Consider outsourcing your auth requirements to a cloud provider with greater expertise.

You can improve the user-experience by plugging into Aurelia's router pipeline with your security specifics. Again, remember, this doesn't secure your app, but only provides a smooth user experience. The real security is on the backend. Here's a quick example of how you might use Aurelia's router to disallow client-side routes based on user role:

<code-listing heading="Customizing the Navigation Pipeline with Authorization">
  <source-code lang="ES 2015/2016">
    import {Redirect} from 'aurelia-router';

    export class App {
      configureRouter(config) {
        config.title = 'Aurelia';
        config.addPipelineStep('authorize', AuthorizeStep);
        config.map([
          { route: ['welcome'], moduleId: 'welcome', title: 'Welcome', settings: { roles: [] } },
          { route: 'admin', moduleId: 'admin', title: 'Admin' settings: { roles: ['admin'] } }
        ]);
      }
    }

    class AuthorizeStep {
      run(navigationInstruction, next) {
        if (navigationInstruction.getAllInstructions().some(i => i.config.settings.roles.indexOf('admin') !== -1)) {
          var isAdmin = /* insert magic here */false;
          if (!isAdmin) {
            return next.cancel(new Redirect('welcome'));
          }
        }

        return next();
      }
    }
  </source-code>
  <source-code lang="TypeScript">
    import {NavigationInstruction, Next, PipelineStep, Redirect, RouterConfiguration} from 'aurelia-router';

    export class App {
      configureRouter(config: RouterConfiguration): void {
        config.title = 'Aurelia';
        config.addAuthorizeStep(AuthorizeStep);
        config.map([
          { route: ['welcome'], moduleId: 'welcome', title: 'Welcome', settings: { roles: [] } },
          { route: 'admin', moduleId: 'admin', title: 'Admin' settings: { roles: ['admin'] } }
        ]);
      }
    }

    class AuthorizeStep implements PipelineStep {
      public run(navigationInstruction: NavigationInstruction, next: Next): Promise<any> {
        if (navigationInstruction.getAllInstructions().some(i => i.config.settings.roles.indexOf('admin') !== -1)) {
          var isAdmin = /* insert magic here */false;
          if (!isAdmin) {
            return next.cancel(new Redirect('welcome'));
          }
        }

        return next();
      }
    }
  </source-code>
</code-listing>

> Info: Route Settings
> Developers can add a `settings` property to any route configuration object and use it to store any data they wish to associate with the route. The value of the `settings` property will be preserved by Aurelia's router and also copied to the navigation model.

## [Validation and Sanitization](aurelia-doc://section/3/version/1.0.0)

The backend should always perform validation and sanitization of data. Do not rely on your client-side validation and sanitization code. In reality, your client-side validation/santization code should not be seen as anything more than a User Experience enhancement, designed to aid honest users. It will have no affect on anyone who is malicious.

Here's a few things you should do though:

* Use client-side validation. This will make your users happy.
* Avoid data-binding to `innerHTML`. If you do, be sure to use a value converter to sanitize the input from the user.
* Be extra careful anytime you are dynamically creating and compiling client-side templates based on user input.
* Be extra careful anytime you are dynamically creating templates on the server based on user input, which will later be processed by Aurelia on the client.

> Info: We Are Trying To Help You
> Internally, Aurelia makes no use of `eval` or the `Function` constructor. Additionally, all binding expressions are parsed by our strict parser which does not make globals like `window` or `document` available in binding expressions. We've done this to help prevent some common abuses.

## [Secret Data](aurelia-doc://section/4/version/1.0.0)

Do not embed private keys into your JavaScript code. While the average user may not be able to access them, anyone with true ill intent can simply download your client code, un-minifiy it and use basic regular expressions on the codebase to find things that *look like* sensitive data. Perhaps they've discovered what backend technology you are using or what cloud services your product is based on simply by studying your app's HTTP requests or looking at the page source. Using that information they may be able to refine their search based on certain patterns well-known to users of those technologies, making it easier to find your private keys.

If you have a need to acquire any secret data on the client, it should be done with great care. Here is a (non-exhaustive) list of recommendations:

* Always use HTTPS to transmit this information.
* Restrict which users and roles can acquire this information to an absolute minimum.
* Always use time-outs on any secret keys so that, at most, if an attacker gains access, they can't use them for long.
* Be careful how you store these values in memory. Do not store these as class property values or on any object that is linked to the DOM through data-binding or otherwise. Doing so would allow an attacker to gain access to the information through the debug console. If you must store this information, keep it inside a private (non-exported) module-level variable.
* If you need to store this information anywhere, encrypt it first.

## [Deployment](aurelia-doc://section/5/version/1.0.0)

When deploying your apps, there are a few things you can do to make it more difficult for attackers to figure out how your client works:

* Bundle your application and minify it. This is the most basic obfuscation you can do.
* Do not deploy the original client-side source files. Only deploy your bundled, minified app.
* For additional security or IP protection, you may want to look into products such as [jscrambler](https://jscrambler.com/en/).

## [Prepare for the Inevitable](aurelia-doc://section/6/version/1.0.0)

Even with the most skilled, security-proficient development team, your app will never be 100% protected. This is a fundamental assumption that you should have from the beginning. Expect to be attacked and expect someone to succeed at some point in time. What will you do if this happens? How will you respond? Will you be able to track down the culprit? Will you be able to identify the issue and quickly seal up the breach? You need a plan.

Again, most of this come down to server-side implementation. Here are a few basic ideas:

* Configure server-side logging and make sure it will provide you with useful information. Such information can be very helpful in tracking down how an attack was performed. Make sure you have tools available to you to quickly search through your logs.
* Make sure that all logins are logged. If you are using an auth-token scheme, make sure that all requests log this information.
* Never log sensitive data.
* Consider timing out logins or auth tokens. You can provide refresh mechanisms in order to help the user experience.
* Configure server insight tooling so that threats can be detected earlier.

## [Do Not Be Nice to Bad Guys](aurelia-doc://section/7/version/1.0.0)

Be careful what information you give out, especially when something goes wrong. For example, if there's a failed login attempt, do not tell the user whether they got their username or password incorrect. That's too much information. Just tell them they had an incorrect login. Furthermore, be careful with what error information you send to end-users. You should keep detailed, internal error logs, but most of that information should not be sent to the end user. Too much information can help an attacker take a step closer to causing real damage.

Beyond this, you are under no obligation to provide nice messages of any kind when you know a user is doing something malicious. Just let the application crash. It's fitting for them.
