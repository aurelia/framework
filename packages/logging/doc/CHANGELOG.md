<a name="1.3.1"></a>
## [1.3.1](https://github.com/aurelia/logging/compare/1.3.0...v1.3.1) (2017-03-26)


### Bug Fixes

* **logging:** restore ES5 compatibility ([70bb834](https://github.com/aurelia/logging/commit/70bb834))



<a name="1.3.0"></a>
# [1.3.0](https://github.com/aurelia/logging/compare/1.2.0...v1.3.0) (2017-02-21)



<a name="1.2.0"></a>
# [1.2.0](https://github.com/aurelia/logging/compare/1.1.1...v1.2.0) (2016-12-03)


### Features

* **logging:** Allow global logLevel to be returned ([1c61077](https://github.com/aurelia/logging/commit/1c61077))



<a name="1.1.1"></a>
## [1.1.1](https://github.com/aurelia/logging/compare/1.1.0...v1.1.1) (2016-11-08)


### Bug Fixes

* **logging:** carry a globalDefaultLevel with which subsequent loggers are created ([ec9af2a](https://github.com/aurelia/logging/commit/ec9af2a))
* **logging:** relax type on Logger.setLevel() for compatibility with TypeScript ([d52bec2](https://github.com/aurelia/logging/commit/d52bec2))



# 1.1.0

### Features

* Individual loggers now have a `level` property that can be used to override the default log level.

<a name="1.0.0"></a>
# [1.0.0](https://github.com/aurelia/logging/compare/1.0.0-rc.1.0.1...v1.0.0) (2016-07-27)



<a name="1.0.0-rc.1.0.1"></a>
# [1.0.0-rc.1.0.1](https://github.com/aurelia/logging/compare/1.0.0-rc.1.0.0...v1.0.0-rc.1.0.1) (2016-07-12)



<a name="1.0.0-rc.1.0.0"></a>
# [1.0.0-rc.1.0.0](https://github.com/aurelia/logging/compare/1.0.0-beta.2.0.1...v1.0.0-rc.1.0.0) (2016-06-22)



### 1.0.0-beta.1.2.1 (2016-05-10)


### 1.0.0-beta.1.2.0 (2016-03-22)

* Update to Babel 6

### 1.0.0-beta.1.1.2 (2016-03-01)


#### Bug Fixes

* **logging:** fix the interface ([6276c3b0](http://github.com/aurelia/logging/commit/6276c3b0e89e2ecb37c873f467a47499c60386ed))


## 1.0.0-beta.1.1.1 (2016-01-28)

* fix package metadata for jspm

## 1.0.0-beta.1.1.0 (2016-01-28)


#### Features

* **all:** update for jspm and core-js ([d71d0a4a](http://github.com/aurelia/logging/commit/d71d0a4aa5db4e5697f91dc16e021c0796cf8fa5))


### 1.0.0-beta.1 (2015-11-15)


## 0.9.0 (2015-11-09)


## 0.8.0 (2015-10-13)


#### Bug Fixes

* **all:**
  * remove unnecessary parts of doc comments ([b9d0f92e](http://github.com/aurelia/logging/commit/b9d0f92e39c8cf72b1f43a35ddea0a0c7d29f267))
  * address more lint issues ([ceef9eb3](http://github.com/aurelia/logging/commit/ceef9eb3761211d75851cf1cb27f7dd42ae7789d))
  * working on linting ([5c3f04bd](http://github.com/aurelia/logging/commit/5c3f04bd4d60401b8488ea6842762342efe93bc7))
  * change levels enum to logLevel ([6d1de07c](http://github.com/aurelia/logging/commit/6d1de07c0f2a9e9e747df6f3bef4f74adf9c7074), closes [#7](http://github.com/aurelia/logging/issues/7))
  * update compiler ([ffe2e20f](http://github.com/aurelia/logging/commit/ffe2e20f0249b0cd1d7378ec42ca07df63b61ed0))
* **build:**
  * update linting, testing and tools ([88398cc2](http://github.com/aurelia/logging/commit/88398cc215d75a2d90b25250b534d9b4f4e131a5))
  * add missing bower bump ([0a682c5e](http://github.com/aurelia/logging/commit/0a682c5e50345a93f242463f16416feb9a6950ed))
* **eslintrc:** adjust the rules ([fc14ab5a](http://github.com/aurelia/logging/commit/fc14ab5a8914678e65ba9a18fcc10dc639f58e04))
* **index:**
  * remove AggregateError ([16784ddf](http://github.com/aurelia/logging/commit/16784ddfbbbfb57fda71ab2b0cdd26f8dd5b0cd0))
  * remove methods from interfaces ([e7d0d342](http://github.com/aurelia/logging/commit/e7d0d3421e59d9964c8dde5fe01e08c2f58b5e6a))
* **jspm:** fix jspm config. resolve #10 ([5ece2e3c](http://github.com/aurelia/logging/commit/5ece2e3cd8400fff38e6829c9a8270ae826382c0))
* **package:**
  * correct aurelia section ([acffd659](http://github.com/aurelia/logging/commit/acffd6598b64c145c1b72e9f7da527fcb09b35d9))
  * update aurelia tools and dts generator ([5d4190ce](http://github.com/aurelia/logging/commit/5d4190cec35bb8254aa2e33a4fdc3848084f56ce))
  * change jspm directories ([29de7599](http://github.com/aurelia/logging/commit/29de75997081b59485313679e451ae53d0f58fe9))


#### Features

* **AggregateError:** add ability to skip wrap if inner already exists ([98da4c32](http://github.com/aurelia/logging/commit/98da4c32c92ae12c654f3b3c827d48516970f174))
* **all:** enable error aggregation with new AggregateError ([88073ddb](http://github.com/aurelia/logging/commit/88073ddb7bb3d8c4ec86fb37d42978ae8c1b369f))
* **build:** update compiler and switch to register module format ([7eb9aec5](http://github.com/aurelia/logging/commit/7eb9aec56eb616c2bbfbb38e59b8813f3f42a2e9))
* **docs:** generate api.json from .d.ts file ([bac61cfe](http://github.com/aurelia/logging/commit/bac61cfe14f700e911ec520336e7c7acc9720954))
* **index:** add the Appender interface ([fe39b380](http://github.com/aurelia/logging/commit/fe39b380ad77d362f282a783da2f52e0706c8a44))
* **logging:** Add new "none" log level. ([8f1ffdd6](http://github.com/aurelia/logging/commit/8f1ffdd6291c77874388944edc4a897d7078dcbd))


#### Breaking Changes

* AggregateError has now been moved to the pal library.

 ([16784ddf](http://github.com/aurelia/logging/commit/16784ddfbbbfb57fda71ab2b0cdd26f8dd5b0cd0))


## 0.7.0 (2015-09-04)


#### Bug Fixes

* **all:**
  * remove unnecessary parts of doc comments ([b9d0f92e](http://github.com/aurelia/logging/commit/b9d0f92e39c8cf72b1f43a35ddea0a0c7d29f267))
  * address more lint issues ([ceef9eb3](http://github.com/aurelia/logging/commit/ceef9eb3761211d75851cf1cb27f7dd42ae7789d))
  * working on linting ([5c3f04bd](http://github.com/aurelia/logging/commit/5c3f04bd4d60401b8488ea6842762342efe93bc7))
* **build:** update linting, testing and tools ([88398cc2](http://github.com/aurelia/logging/commit/88398cc215d75a2d90b25250b534d9b4f4e131a5))
* **eslintrc:** adjust the rules ([fc14ab5a](http://github.com/aurelia/logging/commit/fc14ab5a8914678e65ba9a18fcc10dc639f58e04))


#### Features

* **docs:** generate api.json from .d.ts file ([bac61cfe](http://github.com/aurelia/logging/commit/bac61cfe14f700e911ec520336e7c7acc9720954))


### 0.6.4 (2015-08-14)


#### Bug Fixes

* **index:** remove methods from interfaces ([e7d0d342](http://github.com/aurelia/logging/commit/e7d0d3421e59d9964c8dde5fe01e08c2f58b5e6a))


### 0.6.3 (2015-08-14)


#### Features

* **index:** add the Appender interface ([fe39b380](http://github.com/aurelia/logging/commit/fe39b380ad77d362f282a783da2f52e0706c8a44))


### 0.6.2 (2015-07-29)

* Update build with better file name output

### 0.6.1 (2015-07-13)


#### Bug Fixes

* **jspm:** fix jspm config. resolve #10 ([5ece2e3c](http://github.com/aurelia/logging/commit/5ece2e3cd8400fff38e6829c9a8270ae826382c0))


## 0.6.0 (2015-07-01)


#### Bug Fixes

* **package:** update aurelia tools and dts generator ([5d4190ce](http://github.com/aurelia/logging/commit/5d4190cec35bb8254aa2e33a4fdc3848084f56ce))


## 0.5.0 (2015-06-08)


## 0.4.0 (2015-04-30)


#### Bug Fixes

* **all:** change levels enum to logLevel ([6d1de07c](http://github.com/aurelia/logging/commit/6d1de07c0f2a9e9e747df6f3bef4f74adf9c7074), closes [#7](http://github.com/aurelia/logging/issues/7))


## 0.3.0 (2015-04-09)


#### Bug Fixes

* **all:** update compiler ([ffe2e20f](http://github.com/aurelia/logging/commit/ffe2e20f0249b0cd1d7378ec42ca07df63b61ed0))


### 0.2.7 (2015-03-27)


#### Features

* **AggregateError:** add ability to skip wrap if inner already exists ([98da4c32](http://github.com/aurelia/logging/commit/98da4c32c92ae12c654f3b3c827d48516970f174))


### 0.2.6 (2015-03-24)


#### Features

* **all:** enable error aggregation with new AggregateError ([88073ddb](http://github.com/aurelia/logging/commit/88073ddb7bb3d8c4ec86fb37d42978ae8c1b369f))


### 0.2.5 (2015-02-28)


#### Bug Fixes

* **package:** change jspm directories ([29de7599](http://github.com/aurelia/logging/commit/29de75997081b59485313679e451ae53d0f58fe9))


### 0.2.4 (2015-02-27)

* Updated compiler.

### 0.2.3 (2015-02-18)


#### Bug Fixes

* **build:** add missing bower bump ([0a682c5e](http://github.com/aurelia/logging/commit/0a682c5e50345a93f242463f16416feb9a6950ed))


### 0.2.2 (2015-01-22)

* Added preliminary API docs.

### 0.2.1 (2015-01-12)

* Compiled output update.

## 0.2.0 (2015-01-06)

#### Features

* **build:** update compiler and switch to register module format ([7eb9aec5](http://github.com/aurelia/logging/commit/7eb9aec56eb616c2bbfbb38e59b8813f3f42a2e9))
* **logging:** Add new "none" log level. ([8f1ffdd6](http://github.com/aurelia/logging/commit/8f1ffdd6291c77874388944edc4a897d7078dcbd))
