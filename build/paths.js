let fs = require('fs');

// hide warning //
let emitter = require('events');
emitter.defaultMaxListeners = 20;

let appRoot = 'src/';
let pkg = JSON.parse(fs.readFileSync('./package.json', 'utf-8'));

let paths = {
  root: appRoot,
  source: appRoot + '**/*.js',
  html: appRoot + '**/*.html',
  style: 'styles/**/*.css',
  output: 'dist/',
  doc: './doc',
  unitTests: 'test/**/*.js',
  e2eSpecsSrc: 'test/e2e/src/*.js',
  e2eSpecsDist: 'test/e2e/dist/',
  packageName: pkg.name,
  ignore: [],
  useTypeScriptForDTS: false,
  importsToAdd: [],
  sort: false
};

paths.files = [
  'aurelia.js',
  'framework-configuration.js',
  'index.js'
].map(function(file) {
  return paths.root + file;
});

module.exports = paths;
