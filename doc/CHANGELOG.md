## 0.9.0 (2015-03-25)


#### Bug Fixes

* **all:** load resources by module id only ([655192b2](http://github.com/aurelia/framework/commit/655192b26f7c8b47fb57ad1522e85af58d971443))
* **aurelia:**
  * update to use latest animator default config api ([5dea25b5](http://github.com/aurelia/framework/commit/5dea25b57512ccf4701daf6520c0156582a5182b))
  * update to use new view engine ([e6d20c42](http://github.com/aurelia/framework/commit/e6d20c42ead1f74652fb1bce5b5ae728b4b6bb77))
  * update to load global resources through new resource pipeline ([bdbca554](http://github.com/aurelia/framework/commit/bdbca554e8d0e7ee839fb1b3b8269f590bc7aa97))


#### Features

* **aurelia:** add parameter default to setRoot ([f3955d22](http://github.com/aurelia/framework/commit/f3955d228483758ce8b385bba14d99e053468612))


### 0.8.8 (2015-02-28)


#### Bug Fixes

* **package:** change jspm directories ([37f2670b](http://github.com/aurelia/framework/commit/37f2670b5498618a4b0602234008c2ed779bca4f))


### 0.8.7 (2015-02-28)


#### Bug Fixes

* **aurelia:** global resources left out ([4bb098a3](http://github.com/aurelia/framework/commit/4bb098a36ea226dedc5343f3c629d889f9028580))
* **build:** add missing bower bump ([111797ae](http://github.com/aurelia/framework/commit/111797ae2f669b3eb9a86538c23f5e537fc259c5))
* **package:** update dependencies ([79feec43](http://github.com/aurelia/framework/commit/79feec432b8f3afd7a2ca90fc4eec2445e34940f))


#### Features

* **aurelia:** ensure animator implementation ([e3ab3ab0](http://github.com/aurelia/framework/commit/e3ab3ab08aac022d0c7b58ddef7b8632f2e5f980))
* **build:** add command line argument for semver bump. resolve #28 ([39652c80](http://github.com/aurelia/framework/commit/39652c8026dd26e459ed5e84a0924e1f58724d53))
* **framework:** prevent forms without [action] from submiting ([a5805257](http://github.com/aurelia/framework/commit/a58052571281cce001089bc065858e47ee595874))


### 0.8.6 (2015-02-03)


#### Features

* **plugins:** support legacy atscript annotation location ([37463681](http://github.com/aurelia/framework/commit/374636810d3e5249b3f1d8d6b4767f97c21a1240))


### 0.8.5 (2015-01-29)


#### Bug Fixes

* **aurelia:** custom event undefined in local scope ([c3594bf9](http://github.com/aurelia/framework/commit/c3594bf9ae0b9836ef433d857f422131e65674c5))
* **plugins:** set es5 computed properties correctly ([f1b140d9](http://github.com/aurelia/framework/commit/f1b140d9d2c846cc75e986d6fb967132d82df5e1))


#### Features

* **aurelia:** raise DOM events for start and compose ([feed2a3a](http://github.com/aurelia/framework/commit/feed2a3a05fe8cd9f5463a84ddb692aba4912193))


### 0.8.4 (2015-01-25)


#### Bug Fixes

* **aurelia:** ensure plugin resources are loaded first ([bffcd614](http://github.com/aurelia/framework/commit/bffcd6146167b1169d9d43acf4857be84636ccc7))


### 0.8.3 (2015-01-25)


#### Bug Fixes

* **plugins:** enable relative path plugins ([7cbe4d22](http://github.com/aurelia/framework/commit/7cbe4d22e47ef586a4800d1104ff90d15ff93b98))


### 0.8.2 (2015-01-24)


#### Bug Fixes

* **package:** update deps and fix bower semver ranges ([3f05b27e](http://github.com/aurelia/framework/commit/3f05b27ed1c7961fc5049f848ea2f220949d7414))


### 0.8.1 (2015-01-22)


#### Bug Fixes

* **plugins:** language helpers should return this for chaining ([d8817425](http://github.com/aurelia/framework/commit/d8817425e1ca618d752e9708e76674a3fb6e1191))


## 0.8.0 (2015-01-22)


#### Bug Fixes

* **aurelia:** ensure all start code paths return a promise ([02752512](http://github.com/aurelia/framework/commit/0275251243271e30a7a484903ff0dd5a0da8eb80))
* **package:** update dependencies ([b52b1b05](http://github.com/aurelia/framework/commit/b52b1b050a3d5809f7b0f602ebc8479f3d57eecb))


#### Features

* **aurelia:** enable splash screen swaps on load ([c2135d41](http://github.com/aurelia/framework/commit/c2135d41333328a2c7a6acfe4e0325d5c6bfb090))
* **plugins:**
  * update atscript helper to use new metadata api ([c9b4fb99](http://github.com/aurelia/framework/commit/c9b4fb99b1ac32fb71a69ad8e945cd4a208ca1eb))
  * enable loading after bootstrapped ([790c9da2](http://github.com/aurelia/framework/commit/790c9da2ba89018d25f1dcf6c929b421f47c0b73))
  * new plugin api including explicit support for es5 and at script ([b5c588bc](http://github.com/aurelia/framework/commit/b5c588bc716955273833ebbeabb33deb431bda5d))
  * track plugin id for relative resource loading without system hack ([3465e849](http://github.com/aurelia/framework/commit/3465e84963e871b713cc4c3ca049eb459023ec9e))


## 0.7.0 (2015-01-12)


#### Bug Fixes

* **aurelia:** load groups of resources in order ([2d936e5f](http://github.com/aurelia/framework/commit/2d936e5f6d1750841e99180d72078416926326f1))
* **package:** update Aurelia dependencies ([f9df6e55](http://github.com/aurelia/framework/commit/f9df6e55ab139d8589516d8ebdf4f27ae3f83b90))
* **plugins:** install sequentially ([cc78f9a0](http://github.com/aurelia/framework/commit/cc78f9a07974df00c1dcd88b6c71afcf1e52fcc9))


## 0.6.0 (2015-01-07)


#### Bug Fixes

* **aurelia:** directly use app container to create root view model ([d86665b3](http://github.com/aurelia/framework/commit/d86665b390dbfa65f8c53c148adfc740d7e8ebb2))
* **package:** update dependencies to latest ([bfcd292e](http://github.com/aurelia/framework/commit/bfcd292e5c26bde6b7064e866db566201f280b4f))


#### Features

* **aurelia:** set root sets element in container and uses composition engine ([9f6fa60d](http://github.com/aurelia/framework/commit/9f6fa60d27dc7e9d418970925df2fc23514c1422))


## 0.5.0 (2015-01-06)


#### Bug Fixes

* **aurelia:**
  * remove dependency on event aggregator ([424fa2bf](http://github.com/aurelia/framework/commit/424fa2bf3b9d2a4b79c2bb5cec5ad45d87273327))
  * plugin loading module id fix ([ba79cb93](http://github.com/aurelia/framework/commit/ba79cb933e86e9cea6d391cb3664c82a31231f7e))
* **plugins:** ensure plugin installation can only happen once ([9b37c848](http://github.com/aurelia/framework/commit/9b37c8485ce7d966e1f10eb66f088e341d9a4d4e))


#### Features

* **build:** update compiler and switch to register module format ([63c5d367](http://github.com/aurelia/framework/commit/63c5d367ed576a4350fcf6bfc3d87b4d55370372))


## 0.4.0 (2014-12-22)


#### Bug Fixes

* **package:** update templating to latest version ([63d4c5f6](http://github.com/aurelia/framework/commit/63d4c5f6db58a50f6e1776b2b4939ca81ce4edf5))


#### Features

* **framework:** enable plugin loading and config ([f3b02ea9](http://github.com/aurelia/framework/commit/f3b02ea96c0a607b77bb7fbc7e0389748fb07c12))


### 0.3.2 (2014-12-18)


#### Bug Fixes

* **package:** update templating to latest version ([5d1305e6](http://github.com/aurelia/framework/commit/5d1305e637d827f83c97df3e08db4f60f47915df))


### 0.3.1 (2014-12-18)


#### Bug Fixes

* **package:** update templating to latest version ([1e981956](http://github.com/aurelia/framework/commit/1e9819565f1e4fa024c38c1d08f05cc00757b96f))


## 0.3.0 (2014-12-17)


#### Bug Fixes

* **package:** update dependencies to latest versions ([12f0f9a8](http://github.com/aurelia/framework/commit/12f0f9a8af4d8178e80e87fc4ce7d9a8a53eba85))


### 0.2.1 (2014-12-12)


#### Bug Fixes

* **package:** update dependencies to latest versions ([5ca82ad1](http://github.com/aurelia/framework/commit/5ca82ad11adf1163e984e3fe05cd64a132990624))


## 0.2.0 (2014-12-11)


#### Bug Fixes

* **package:** update dependencies to their latest versions ([fe83ef37](http://github.com/aurelia/framework/commit/fe83ef37fdcdf878dd79564ed9b97ee56de8d621))

