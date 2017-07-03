# Execom Web Club Demo App

## Intro
Progressive Web Apps are the best way for developers to make their webapps load faster and more performant. In a nutshell, PWAs are websites that use recent web standards to allow for installation on a user’s computer or device, and deliver an app-like experience to those users.

A PWA is a web application that can be “installed” on your system. It works offline when you don’t have an internet connection, leveraging data cached during your last interactions with the app. 

## PWA Checklist

* [PRPR pattern](https://developers.google.com/web/fundamentals/performance/prpl-pattern/)
- **Push** critical resources for the initial URL route.
- **Render** initial route.
- **Pre-cache** remaining routes.
- **Lazy-load** and create remaining routes on demand.

* Use `<link rel=”preload”>` to tell your browser to load a resource you know you’ll eventually need.

* Use HTTP/2 and server push to “push” assets to the browser without the user having to ask for them.

* Use code-splitting and lazy-loading for granular loading of application pages/features.


## Documentation
- [serviceworker.rs](https://serviceworke.rs/)
- 