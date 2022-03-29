let gulp = require('gulp');
let to5 = require('gulp-babel');
let paths = require('../paths');
let compilerOptions = require('../babel-options');
let compilerTsOptions = require('../typescript-options');
let assign = Object.assign || require('object.assign');
let through2 = require('through2');
let concat = require('gulp-concat');
let insert = require('gulp-insert');
let rename = require('gulp-rename');
let tools = require('aurelia-tools');
let ts = require('gulp-typescript');
let gutil = require('gulp-util');
let gulpIgnore = require('gulp-ignore');
let merge = require('merge2');
let jsName = paths.packageName + '.js';
let compileToModules = ['es2015', 'commonjs', 'amd', 'system', 'native-modules'];

function cleanGeneratedCode() {
  return through2.obj(function(file, enc, callback) {
    file.contents = new Buffer(tools.cleanGeneratedCode(file.contents.toString('utf8')));
    this.push(file);
    return callback();
  });
}

gulp.task('build-index', function() {
  let importsToAdd = paths.importsToAdd.slice();

  let src = gulp.src(paths.files);

  if (paths.sort) {
    src = src.pipe(tools.sortFiles());
  }

  if (paths.ignore) {
    paths.ignore.forEach(function(filename) {
      src = src.pipe(gulpIgnore.exclude(filename));
    });
  }

  return src.pipe(through2.obj(function(file, enc, callback) {
    file.contents = new Buffer(tools.extractImports(file.contents.toString('utf8'), importsToAdd));
    this.push(file);
    return callback();
  }))
    .pipe(concat(jsName))
    .pipe(insert.transform(function(contents) {
      return tools.createImportBlock(importsToAdd) + contents;
    }))
    .pipe(gulp.dest(paths.output));
});

function gulpFileFromString(filename, string) {
  // eslint-disable-next-line new-cap
  let src = require('stream').Readable({ objectMode: true });
  src._read = function() {
    this.push(new gutil.File({ cwd: paths.appRoot, base: paths.output, path: filename, contents: new Buffer(string) }));
    this.push(null);
  };
  return src;
}

function srcForBabel() {
  return merge(
    gulp.src(paths.output + jsName),
    gulpFileFromString(paths.output + 'index.js', "export * from './" + paths.packageName + "';")
  );
}

function srcForTypeScript() {
  return gulp
    .src(paths.output + paths.packageName + '.js')
    .pipe(rename(function(path) {
      if (path.extname === '.js') {
        path.extname = '.ts';
      }
    }));
}

compileToModules.forEach(function(moduleType) {
  gulp.task('build-babel-' + moduleType, function() {
    return srcForBabel()
      .pipe(to5(assign({}, compilerOptions[moduleType]())))
      .pipe(cleanGeneratedCode())
      .pipe(gulp.dest(paths.output + moduleType));
  });

  if (moduleType === 'native-modules') return; // typescript doesn't support the combination of: es5 + native modules

  gulp.task('build-ts-' + moduleType, function() {
    let tsProject = ts.createProject(
      compilerTsOptions({ module: moduleType, target: moduleType === 'es2015' ? 'es2015' : 'es5' }), ts.reporter.defaultReporter());
    let tsResult = srcForTypeScript().pipe(ts(tsProject));
    return tsResult.js
      .pipe(gulp.dest(paths.output + moduleType));
  });
});

gulp.task('build-dts', function() {
  let tsProject = ts.createProject(
    compilerTsOptions({ removeComments: false, target: 'es2015', module: 'es2015' }), ts.reporter.defaultReporter());
  let tsResult = srcForTypeScript().pipe(ts(tsProject));
  return tsResult.dts
    .pipe(gulp.dest(paths.output));
});

gulp.task('build', gulp.series(
  'clean',
  'build-index',
  ...compileToModules
    .map(function(moduleType) { return 'build-babel-' + moduleType; })
    .concat(paths.useTypeScriptForDTS ? ['build-dts'] : [])
));

gulp.task('build-ts', gulp.series(
  'clean',
  'build-index',
  'build-babel-native-modules',
  ...compileToModules
    .filter(function(moduleType) { return moduleType !== 'native-modules'; })
    .map(function(moduleType) { return 'build-ts-' + moduleType; })
    .concat(paths.useTypeScriptForDTS ? ['build-dts'] : []),
));
