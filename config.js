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
    "aurelia-binding": "github:aurelia/binding@0.2.0",
    "aurelia-dependency-injection": "github:aurelia/dependency-injection@0.2.1",
    "aurelia-loader": "github:aurelia/loader@0.3.0",
    "aurelia-logging": "github:aurelia/logging@0.2.0",
    "aurelia-metadata": "github:aurelia/metadata@0.2.3",
    "aurelia-task-queue": "github:aurelia/task-queue@0.2.0",
    "aurelia-templating": "github:aurelia/templating@0.5.0",
    "github:aurelia/binding@0.2.0": {
      "aurelia-metadata": "github:aurelia/metadata@0.2.3",
      "aurelia-task-queue": "github:aurelia/task-queue@0.2.0"
    },
    "github:aurelia/dependency-injection@0.2.1": {
      "aurelia-metadata": "github:aurelia/metadata@0.2.3",
      "core-js": "npm:core-js@0.4.1"
    },
    "github:aurelia/loader@0.3.0": {
      "aurelia-html-template-element": "github:aurelia/html-template-element@0.1.2",
      "core-js": "npm:core-js@0.4.1",
      "webcomponentsjs": "github:webcomponents/webcomponentsjs@0.5.2"
    },
    "github:aurelia/templating@0.5.0": {
      "aurelia-binding": "github:aurelia/binding@0.2.0",
      "aurelia-dependency-injection": "github:aurelia/dependency-injection@0.2.1",
      "aurelia-html-template-element": "github:aurelia/html-template-element@0.1.2",
      "aurelia-loader": "github:aurelia/loader@0.3.0",
      "aurelia-logging": "github:aurelia/logging@0.2.0",
      "aurelia-metadata": "github:aurelia/metadata@0.2.3",
      "aurelia-path": "github:aurelia/path@0.4.0",
      "aurelia-task-queue": "github:aurelia/task-queue@0.2.0",
      "core-js": "npm:core-js@0.4.1"
    },
    "github:jspm/nodelibs-process@0.1.0": {
      "process": "npm:process@0.10.0"
    },
    "npm:core-js@0.4.1": {
      "process": "github:jspm/nodelibs-process@0.1.0"
    }
  }
});

