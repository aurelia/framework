import { Container } from 'aurelia-dependency-injection';
export * from 'aurelia-dependency-injection';
export * from 'aurelia-binding';
export * from 'aurelia-metadata';
import { HtmlBehaviorResource, ViewEngine, BindingLanguage, TemplatingEngine, CompositionTransaction, ViewSlot, ViewResources } from 'aurelia-templating';
export * from 'aurelia-templating';
import { Loader } from 'aurelia-loader';
export * from 'aurelia-loader';
export * from 'aurelia-task-queue';
import { join, relativeToFile } from 'aurelia-path';
export * from 'aurelia-path';
import { DOM, PLATFORM } from 'aurelia-pal';
export * from 'aurelia-pal';
import * as TheLogManager from 'aurelia-logging';
export { TheLogManager as LogManager };

var logger = TheLogManager.getLogger('aurelia');
var extPattern = /\.[^/.]+$/;
function runTasks(config, tasks) {
    var current;
    var next = function () {
        current = tasks.shift();
        if (current) {
            return Promise.resolve(current(config)).then(next);
        }
        return Promise.resolve();
    };
    return next();
}
function loadPlugin(fwConfig, loader, info) {
    logger.debug("Loading plugin ".concat(info.moduleId, "."));
    if (typeof info.moduleId === 'string') {
        fwConfig.resourcesRelativeTo = info.resourcesRelativeTo;
        var id = info.moduleId;
        if (info.resourcesRelativeTo.length > 1) {
            return loader.normalize(info.moduleId, info.resourcesRelativeTo[1])
                .then(function (normalizedId) { return _loadPlugin(normalizedId); });
        }
        return _loadPlugin(id);
    }
    else if (typeof info.configure === 'function') {
        if (fwConfig.configuredPlugins.indexOf(info.configure) !== -1) {
            return Promise.resolve();
        }
        fwConfig.configuredPlugins.push(info.configure);
        return Promise.resolve(info.configure.call(null, fwConfig, info.config || {}));
    }
    throw new Error(invalidConfigMsg(info.moduleId || info.configure, 'plugin'));
    function _loadPlugin(moduleId) {
        return loader.loadModule(moduleId).then(function (m) {
            if ('configure' in m) {
                if (fwConfig.configuredPlugins.indexOf(m.configure) !== -1) {
                    return Promise.resolve();
                }
                return Promise.resolve(m.configure(fwConfig, info.config || {})).then(function () {
                    fwConfig.configuredPlugins.push(m.configure);
                    fwConfig.resourcesRelativeTo = null;
                    logger.debug("Configured plugin ".concat(info.moduleId, "."));
                });
            }
            fwConfig.resourcesRelativeTo = null;
            logger.debug("Loaded plugin ".concat(info.moduleId, "."));
        });
    }
}
function loadResources(aurelia, resourcesToLoad, appResources) {
    if (Object.keys(resourcesToLoad).length === 0) {
        return Promise.resolve();
    }
    var viewEngine = aurelia.container.get(ViewEngine);
    return Promise.all(Object.keys(resourcesToLoad).map(function (n) { return _normalize(resourcesToLoad[n]); }))
        .then(function (loads) {
        var names = [];
        var importIds = [];
        loads.forEach(function (l) {
            names.push(undefined);
            importIds.push(l.importId);
        });
        return viewEngine.importViewResources(importIds, names, appResources);
    });
    function _normalize(load) {
        var moduleId = load.moduleId;
        var ext = getExt(moduleId);
        if (isOtherResource(moduleId)) {
            moduleId = removeExt(moduleId);
        }
        return aurelia.loader.normalize(moduleId, load.relativeTo)
            .then(function (normalized) {
            return {
                name: load.moduleId,
                importId: isOtherResource(load.moduleId) ? addOriginalExt(normalized, ext) : normalized
            };
        });
    }
    function isOtherResource(name) {
        var ext = getExt(name);
        if (!ext)
            return false;
        if (ext === '')
            return false;
        if (ext === '.js' || ext === '.ts')
            return false;
        return true;
    }
    function removeExt(name) {
        return name.replace(extPattern, '');
    }
    function addOriginalExt(normalized, ext) {
        return removeExt(normalized) + '.' + ext;
    }
}
function getExt(name) {
    var match = name.match(extPattern);
    if (match && match.length > 0) {
        return (match[0].split('.'))[1];
    }
}
function loadBehaviors(config) {
    return Promise.all(config.behaviorsToLoad.map(function (m) { return m.load(config.container, m.target); })).then(function () {
        config.behaviorsToLoad = null;
    });
}
function assertProcessed(plugins) {
    if (plugins.processed) {
        throw new Error('This config instance has already been applied. To load more plugins or global resources, create a new FrameworkConfiguration instance.');
    }
}
function invalidConfigMsg(cfg, type) {
    return "Invalid ".concat(type, " [").concat(cfg, "], ").concat(type, " must be specified as functions or relative module IDs.");
}
var FrameworkConfiguration = (function () {
    function FrameworkConfiguration(aurelia) {
        var _this = this;
        this.aurelia = aurelia;
        this.container = aurelia.container;
        this.info = [];
        this.processed = false;
        this.preTasks = [];
        this.postTasks = [];
        this.behaviorsToLoad = [];
        this.configuredPlugins = [];
        this.resourcesToLoad = {};
        this.preTask(function () { return aurelia.loader.normalize('aurelia-bootstrapper', undefined)
            .then(function (name) { return _this.bootstrapperName = name; }); });
        this.postTask(function () { return loadResources(aurelia, _this.resourcesToLoad, aurelia.resources); });
    }
    FrameworkConfiguration.prototype.instance = function (type, instance) {
        this.container.registerInstance(type, instance);
        return this;
    };
    FrameworkConfiguration.prototype.singleton = function (type, implementation) {
        this.container.registerSingleton(type, implementation);
        return this;
    };
    FrameworkConfiguration.prototype.transient = function (type, implementation) {
        this.container.registerTransient(type, implementation);
        return this;
    };
    FrameworkConfiguration.prototype.preTask = function (task) {
        assertProcessed(this);
        this.preTasks.push(task);
        return this;
    };
    FrameworkConfiguration.prototype.postTask = function (task) {
        assertProcessed(this);
        this.postTasks.push(task);
        return this;
    };
    FrameworkConfiguration.prototype.feature = function (plugin, config) {
        if (config === void 0) { config = {}; }
        switch (typeof plugin) {
            case 'string':
                var hasIndex = /\/index$/i.test(plugin);
                var moduleId = hasIndex || getExt(plugin) ? plugin : plugin + '/index';
                var root = hasIndex ? plugin.slice(0, -6) : plugin;
                this.info.push({ moduleId: moduleId, resourcesRelativeTo: [root, ''], config: config });
                break;
            case 'function':
                this.info.push({ configure: plugin, config: config || {} });
                break;
            default:
                throw new Error(invalidConfigMsg(plugin, 'feature'));
        }
        return this;
    };
    FrameworkConfiguration.prototype.globalResources = function (resources) {
        var _this = this;
        assertProcessed(this);
        var toAdd = Array.isArray(resources) ? resources : arguments;
        var resource;
        var resourcesRelativeTo = this.resourcesRelativeTo || ['', ''];
        for (var i = 0, ii = toAdd.length; i < ii; ++i) {
            resource = toAdd[i];
            switch (typeof resource) {
                case 'string':
                    var parent_1 = resourcesRelativeTo[0];
                    var grandParent = resourcesRelativeTo[1];
                    var name_1 = resource;
                    if ((resource.startsWith('./') || resource.startsWith('../')) && parent_1 !== '') {
                        name_1 = join(parent_1, resource);
                    }
                    this.resourcesToLoad[name_1] = { moduleId: name_1, relativeTo: grandParent };
                    break;
                case 'function':
                    var meta = this.aurelia.resources.autoRegister(this.container, resource);
                    if (meta instanceof HtmlBehaviorResource && meta.elementName !== null) {
                        if (this.behaviorsToLoad.push(meta) === 1) {
                            this.postTask(function () { return loadBehaviors(_this); });
                        }
                    }
                    break;
                default:
                    throw new Error(invalidConfigMsg(resource, 'resource'));
            }
        }
        return this;
    };
    FrameworkConfiguration.prototype.globalName = function (resourcePath, newName) {
        assertProcessed(this);
        this.resourcesToLoad[resourcePath] = { moduleId: newName, relativeTo: '' };
        return this;
    };
    FrameworkConfiguration.prototype.plugin = function (plugin, pluginConfig) {
        assertProcessed(this);
        var info;
        switch (typeof plugin) {
            case 'string':
                info = { moduleId: plugin, resourcesRelativeTo: [plugin, ''], config: pluginConfig || {} };
                break;
            case 'function':
                info = { configure: plugin, config: pluginConfig || {} };
                break;
            default:
                throw new Error(invalidConfigMsg(plugin, 'plugin'));
        }
        this.info.push(info);
        return this;
    };
    FrameworkConfiguration.prototype._addNormalizedPlugin = function (name, config) {
        var _this = this;
        var plugin = { moduleId: name, resourcesRelativeTo: [name, ''], config: config || {} };
        this.info.push(plugin);
        this.preTask(function () {
            var relativeTo = [name, _this.bootstrapperName];
            plugin.moduleId = name;
            plugin.resourcesRelativeTo = relativeTo;
            return Promise.resolve();
        });
        return this;
    };
    FrameworkConfiguration.prototype.defaultBindingLanguage = function () {
        return this._addNormalizedPlugin('aurelia-templating-binding');
    };
    FrameworkConfiguration.prototype.router = function () {
        return this._addNormalizedPlugin('aurelia-templating-router');
    };
    FrameworkConfiguration.prototype.history = function () {
        return this._addNormalizedPlugin('aurelia-history-browser');
    };
    FrameworkConfiguration.prototype.defaultResources = function () {
        return this._addNormalizedPlugin('aurelia-templating-resources');
    };
    FrameworkConfiguration.prototype.eventAggregator = function () {
        return this._addNormalizedPlugin('aurelia-event-aggregator');
    };
    FrameworkConfiguration.prototype.basicConfiguration = function () {
        return this.defaultBindingLanguage().defaultResources().eventAggregator();
    };
    FrameworkConfiguration.prototype.standardConfiguration = function () {
        return this.basicConfiguration().history().router();
    };
    FrameworkConfiguration.prototype.developmentLogging = function (level) {
        var _this = this;
        var logLevel = level ? TheLogManager.logLevel[level] : undefined;
        if (logLevel === undefined) {
            logLevel = TheLogManager.logLevel.debug;
        }
        this.preTask(function () {
            return _this.aurelia.loader.normalize('aurelia-logging-console', _this.bootstrapperName).then(function (name) {
                return _this.aurelia.loader.loadModule(name).then(function (m) {
                    TheLogManager.addAppender(new m.ConsoleAppender());
                    TheLogManager.setLevel(logLevel);
                });
            });
        });
        return this;
    };
    FrameworkConfiguration.prototype.apply = function () {
        var _this = this;
        if (this.processed) {
            return Promise.resolve();
        }
        return runTasks(this, this.preTasks).then(function () {
            var loader = _this.aurelia.loader;
            var info = _this.info;
            var current;
            var next = function () {
                current = info.shift();
                if (current) {
                    return loadPlugin(_this, loader, current).then(next);
                }
                _this.processed = true;
                _this.configuredPlugins = null;
                return Promise.resolve();
            };
            return next().then(function () { return runTasks(_this, _this.postTasks); });
        });
    };
    return FrameworkConfiguration;
}());

function preventActionlessFormSubmit() {
    DOM.addEventListener('submit', function (evt) {
        var target = evt.target;
        var action = target.action;
        if (target.tagName.toLowerCase() === 'form' && !action) {
            evt.preventDefault();
        }
    }, false);
}
var Aurelia = (function () {
    function Aurelia(loader, container, resources) {
        this.loader = loader || new PLATFORM.Loader();
        this.container = container || (new Container()).makeGlobal();
        this.resources = resources || new ViewResources();
        this.use = new FrameworkConfiguration(this);
        this.logger = TheLogManager.getLogger('aurelia');
        this.hostConfigured = false;
        this.host = null;
        this.use.instance(Aurelia, this);
        this.use.instance(Loader, this.loader);
        this.use.instance(ViewResources, this.resources);
    }
    Aurelia.prototype.start = function () {
        var _this = this;
        if (this._started) {
            return this._started;
        }
        this.logger.info('Aurelia Starting');
        return this._started = this.use.apply().then(function () {
            preventActionlessFormSubmit();
            if (!_this.container.hasResolver(BindingLanguage)) {
                var message = 'You must configure Aurelia with a BindingLanguage implementation.';
                _this.logger.error(message);
                throw new Error(message);
            }
            _this.logger.info('Aurelia Started');
            var evt = DOM.createCustomEvent('aurelia-started', { bubbles: true, cancelable: true });
            DOM.dispatchEvent(evt);
            return _this;
        });
    };
    Aurelia.prototype.enhance = function (bindingContext, applicationHost) {
        var _this = this;
        if (bindingContext === void 0) { bindingContext = {}; }
        if (applicationHost === void 0) { applicationHost = null; }
        this._configureHost(applicationHost || DOM.querySelectorAll('body')[0]);
        return new Promise(function (resolve) {
            var engine = _this.container.get(TemplatingEngine);
            _this.root = engine.enhance({ container: _this.container, element: _this.host, resources: _this.resources, bindingContext: bindingContext });
            _this.root.attached();
            _this._onAureliaComposed();
            resolve(_this);
        });
    };
    Aurelia.prototype.setRoot = function (root, applicationHost) {
        var _this = this;
        if (root === void 0) { root = null; }
        if (applicationHost === void 0) { applicationHost = null; }
        var instruction = {};
        if (this.root && this.root.viewModel && this.root.viewModel.router) {
            this.root.viewModel.router.deactivate();
            this.root.viewModel.router.reset();
        }
        this._configureHost(applicationHost);
        var engine = this.container.get(TemplatingEngine);
        var transaction = this.container.get(CompositionTransaction);
        delete transaction.initialComposition;
        if (!root) {
            if (this.configModuleId) {
                root = relativeToFile('./app', this.configModuleId);
            }
            else {
                root = 'app';
            }
        }
        instruction.viewModel = root;
        instruction.container = instruction.childContainer = this.container;
        instruction.viewSlot = this.hostSlot;
        instruction.host = this.host;
        return engine.compose(instruction).then(function (r) {
            _this.root = r;
            instruction.viewSlot.attached();
            _this._onAureliaComposed();
            return _this;
        });
    };
    Aurelia.prototype._configureHost = function (applicationHost) {
        if (this.hostConfigured) {
            return;
        }
        applicationHost = applicationHost || this.host;
        if (!applicationHost || typeof applicationHost === 'string') {
            this.host = DOM.getElementById(applicationHost || 'applicationHost');
        }
        else {
            this.host = applicationHost;
        }
        if (!this.host) {
            throw new Error('No applicationHost was specified.');
        }
        this.hostConfigured = true;
        this.host.aurelia = this;
        this.hostSlot = new ViewSlot(this.host, true);
        this.hostSlot.transformChildNodesIntoView();
        this.container.registerInstance(DOM.boundary, this.host);
    };
    Aurelia.prototype._onAureliaComposed = function () {
        var evt = DOM.createCustomEvent('aurelia-composed', { bubbles: true, cancelable: true });
        setTimeout(function () { return DOM.dispatchEvent(evt); }, 1);
    };
    return Aurelia;
}());

export { Aurelia, FrameworkConfiguration };
//# sourceMappingURL=aurelia-framework.js.map
