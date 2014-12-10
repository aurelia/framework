System.config({
  "paths": {
    "*": "*.js",
    "github:*": "jspm_packages/github/*.js"
  }
});

System.config({
  "map": {
    "aurelia-binding": "github:aurelia/binding@0.0.1",
    "aurelia-dependency-injection": "github:aurelia/dependency-injection@0.0.3",
    "aurelia-event-aggregator": "github:aurelia/event-aggregator@0.0.1",
    "aurelia-loader": "github:aurelia/loader@0.0.2",
    "aurelia-logging": "github:aurelia/logging@0.0.1",
    "aurelia-metadata": "github:aurelia/metadata@0.0.5",
    "aurelia-task-queue": "github:aurelia/task-queue@0.0.2",
    "aurelia-templating": "github:aurelia/templating@0.0.1",
    "github:aurelia/binding@0.0.1": {
      "aurelia-metadata": "github:aurelia/metadata@0.0.5",
      "aurelia-task-queue": "github:aurelia/task-queue@0.0.2"
    },
    "github:aurelia/dependency-injection@0.0.3": {
      "aurelia-metadata": "github:aurelia/metadata@0.0.5"
    },
    "github:aurelia/loader@0.0.2": {
      "aurelia-path": "github:aurelia/path@0.0.1"
    },
    "github:aurelia/templating@0.0.1": {
      "aurelia-binding": "github:aurelia/binding@0.0.1",
      "aurelia-dependency-injection": "github:aurelia/dependency-injection@0.0.3",
      "aurelia-loader": "github:aurelia/loader@0.0.2",
      "aurelia-logging": "github:aurelia/logging@0.0.1",
      "aurelia-metadata": "github:aurelia/metadata@0.0.5",
      "aurelia-path": "github:aurelia/path@0.0.1",
      "aurelia-task-queue": "github:aurelia/task-queue@0.0.2"
    }
  }
});

