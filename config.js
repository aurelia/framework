System.config({
  "paths": {
    "*": "*.js",
    "github:*": "jspm_packages/github/*.js",
    "aurelia-framework/*": "dist/*.js",
    "npm:*": "jspm_packages/npm/*.js"
  }
});

System.config({
  "map": {
    "aurelia-binding": "github:aurelia/binding@0.3.0",
    "aurelia-dependency-injection": "github:aurelia/dependency-injection@0.4.0",
    "aurelia-loader": "github:aurelia/loader@0.3.2",
    "aurelia-logging": "github:aurelia/logging@0.2.2",
    "aurelia-metadata": "github:aurelia/metadata@0.3.0",
    "aurelia-task-queue": "github:aurelia/task-queue@0.2.2",
    "aurelia-templating": "github:aurelia/templating@0.8.0",
    "github:aurelia/binding@0.3.0": {
      "aurelia-metadata": "github:aurelia/metadata@0.3.0",
      "aurelia-task-queue": "github:aurelia/task-queue@0.2.2"
    },
    "github:aurelia/dependency-injection@0.4.0": {
      "aurelia-metadata": "github:aurelia/metadata@0.3.0",
      "core-js": "npm:core-js@0.4.6"
    },
    "github:aurelia/loader@0.3.2": {
      "aurelia-html-template-element": "github:aurelia/html-template-element@0.1.2",
      "core-js": "npm:core-js@0.4.6",
      "webcomponentsjs": "github:webcomponents/webcomponentsjs@0.5.3"
    },
    "github:aurelia/templating@0.8.0": {
      "aurelia-binding": "github:aurelia/binding@0.3.0",
      "aurelia-dependency-injection": "github:aurelia/dependency-injection@0.4.0",
      "aurelia-html-template-element": "github:aurelia/html-template-element@0.1.2",
      "aurelia-loader": "github:aurelia/loader@0.3.2",
      "aurelia-logging": "github:aurelia/logging@0.2.2",
      "aurelia-metadata": "github:aurelia/metadata@0.3.0",
      "aurelia-path": "github:aurelia/path@0.4.1",
      "aurelia-task-queue": "github:aurelia/task-queue@0.2.2",
      "core-js": "npm:core-js@0.4.6"
    },
    "github:jspm/nodelibs-process@0.1.0": {
      "process": "npm:process@0.10.0"
    },
    "npm:core-js@0.4.6": {
      "process": "github:jspm/nodelibs-process@0.1.0"
    }
  }
});

