Name: Greg Gum

Twitter:  @GregoryGum

Linked In: GregGum

# From Caliburn.Micro to Aurelia

## _If you know Caliburn.Micro, then you already know Aurelia_.

Ok, so the syntax is different, but you will find the concepts **very** familiar.  The learning curve is not so much learning Aurelia itself, it's learning the JavaScript ecosystem in which Aurelia lives. Once you have mastered that, you will find that Aurelia plugs in all that MVVM goodness you found in Caliburn.Micro. This guide is a high level view meant for c# developers moving to JavaScript who wish to write the same types of apps they did before in Silverlight/WPF, but this time, write a real web app.

First some background so you know from where I write this guide: I have written apps in various technologies for the last 15 years, starting with Visual FoxPro, Windows Forms, WPF and then finally Silverlight.  Silverlight's biggest contribution is that it popularized the MVVM (Model-View-Viewmodel) concept and made it easy to implement through binding.  The level of apps I could write with Silverlight which much more sophisticated than anything before, and it became clear that I needed a framework to bring all the pieces intelligently without having to write it all myself.  I did in fact write a framework for Visual Foxpro ( called TurboFox, long since laid in the technology graveyard) and knew the amount of raw hours it takes to bring a framework up to professional standards.  I checked out the different frameworks, and Caliburn.Micro was the one that worked best for me.  I have since authorized at least 20 major applications with the framework, and became very familiar with its use.  Even after the "death" of Silverlight, I was a diehard.  I saw no viable alternative on the horizon and thus continued to use it.  For corporate apps which you can mandate, that's not really a problem. But the reality is that the web, and using web standards like good ole html and JavaScript is now the _only_ standard. And if you are reading this, you have already seen the light.  But if we are destined to write html/JavaScript, how do we get there without throwing everything we know and love about writing serious applications out the window and starting from scratch?

Here is where Aurelia makes its entrance. Some time ago, someone asked Rob, "What if you could create Caliburn.Micro in JavaScript?"  It was a revolutionary thought, but why not?  In the end, design patterns are design patterns no matter what language they are implemented in.  JavaScript is not known for its application of design patterns.  Despite there being a book named "JavaScript Design Patterns" from O'Reilly, I don't think any JavaScript developers have actually read it, and if they did, completely ignored them.  Any JavaScript I have ever seen was written in the vein of "gitter-done now!", not "Which GOF pattern shall I implement today?" (Like c# coders are fond of).

So that is the premise of Aurelia � implement those patterns which have worked so well in the past in JavaScript to create MVVM style applications in JavaScript.

The first pill to swallow is that it's a lot of JavaScript.  In a SL application, I think nothing of writing a few thousand lines of application code.  That's not a lot of code really.  But to see that in JavaScript makes some people squirm.  At least it did me.  Most people see JS as a few lines of code to send an alert to the window.  You have to see it in the same way you see code in a c# application � its code, it should be well written, and using standard coding practices such as classes and separations of concerns.  So in Aurelia, you start writing classes, just like you do in c#.   You are going to have a Welcome class, and a Welcome view which combine to make a Welcome page. But I am getting ahead of myself.  Here are the major concepts of Aurelia, and how they are implemented.

# Routing

Every app is a collection of pages.  In Silverlight, there was a Navigation Template which attempted to route pages with a router, but most app's did not use this.  I even wrote an adapter so that I could use the SL router and then using Caliburn.Micro to bind the pages.  In Aurelia, the Router is elevated in status to one of the prime components and it integrates deeply with the browser.  The net result of this is that the browser forward and back buttons work as users would expect them to do.  Even though the back button does not in fact change the page he is on (it's a single page application, remember) it does navigate him back to the prior view.  So it appears to him that he went to the prior page, and even the link in the browser bar updates accordingly.

# Pages

When a user navigates to a page, that page is a view/viewmodel pair as I hinted to earlier. In Caliburn.Micro, the convention was to use CustomerViewModel/CustomerView.  In Aurelia, it's just Customer/Customer, or whatever you want to name it.  It just uses the exact same name, so only the extension is different.

An Aurelia ViewModel has the same type of lifecycle as in Caliburn.Micro.  There are the usual Activate/Deactivate, as well as CanActivate/CanDeactivate which work as you would expect.

# Binding

Ah, the miracle of bind. Binding is what made MVVM great, and it's no different in Aurelia.  In your viewmodel, you have a "name" property, and you bind it in your view like so: <input value.bind="name" />  Just like old times.  The binding is two way binding as well in this case, as it's an input element which automatically gets two way binding. But there is another way to bind in Aurelia and it's called "String Interpolation."  Instead of having to have a control to bind to, you can specify the binding directly in the html.  Say for example you want to display them name property in a span.  This is the syntax: <span>${name}</name>  This of course is one way binding.  But it is live binding, so if you change the value of the name property to "Greg", it will automatically update in the UI just as you would expect.  While this is a minor thing to a xaml developer, it's big news in the HTML world.  Knockout was the original binding library, and it's still kicking around with a lot of people using it.  DurandalJS, the forerunner of Aurelia supported Knockout, but Aurelia brought its own binding library to the table. I won't go into the details, but Aurelia binding is much cleaner having brought years of binding experience to the table before it was even started.

# Wrap Up

So there you have it. My goal here was to whet your appetite for Aurelia and convince you to give it a chance.   Aurelia is rapidly becoming the SPA framework of choice, and your experience with Caliburn.Micro is going to help you get up and running.  Welcome aboard.  If you have questions, you can reach me on the Aurelia gitter channel, or email me at greg.gum@gmail.com
