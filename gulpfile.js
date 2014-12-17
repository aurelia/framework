var gulp = require('gulp');
var runSequence = require('run-sequence');
var clean = require('gulp-clean');
var to5 = require('gulp-6to5');
var jshint = require('gulp-jshint');
var stylish = require('jshint-stylish');
var yuidoc = require("gulp-yuidoc");
var changelog = require('conventional-changelog');
var assign = Object.assign || require('object.assign');
var fs = require('fs');
var bump = require('gulp-bump');

var path = {
  source:'src/**/*.js',
  output:'dist/',
  doc:'./doc'
};

var compilerOptions = {
  filename: '',
  filenameRelative: '',
  blacklist: [],
  whitelist: [],
  modules: '',
  sourceMap: true,
  sourceMapName: '',
  sourceFileName: '',
  sourceRoot: '',
  moduleRoot: '',
  amdModuleIds: false,
  runtime: false,
  comments: false,
  experimental: false
};

var jshintConfig = {esnext:true};

gulp.task('clean', function() {
  return gulp.src([path.output], {read: false})
    .pipe(clean());
});

gulp.task('build-es6', function () {
  return gulp.src(path.source)
    .pipe(gulp.dest(path.output + 'es6'));
});

gulp.task('build-commonjs', function () {
  return gulp.src(path.source)
    .pipe(to5(assign({}, compilerOptions, {modules:'common'})))
    .pipe(gulp.dest(path.output + 'commonjs'));
});

gulp.task('build-amd', function () {
  return gulp.src(path.source)
    .pipe(to5(assign({}, compilerOptions, {modules:'amd'})))
    .pipe(gulp.dest(path.output + 'amd'));
});

gulp.task('lint', function() {
  return gulp.src(path.source)
    .pipe(jshint(jshintConfig))
    .pipe(jshint.reporter(stylish));
});

gulp.task('doc', function(){
  return gulp.src(path.source)
    .pipe(yuidoc.parser(null, 'api.json'))
    .pipe(gulp.dest(path.doc));
});

gulp.task('bump-version', function(){
  return gulp.src(['./bower.json', './package.json'])
    .pipe(bump({type:'patch'})) //major|minor|patch|prerelease
    .pipe(gulp.dest('./'));
});

gulp.task('changelog', function(callback) {
  var pkg = JSON.parse(fs.readFileSync('./package.json', 'utf-8'));

  return changelog({
    repository: pkg.repository.url,
    version: pkg.version,
    file: path.doc + '/CHANGELOG.md'
  }, function(err, log) {
    fs.writeFileSync(path.doc + '/CHANGELOG.md', log);
  });
});

gulp.task('build', function(callback) {
  return runSequence(
    'clean',
    ['build-es6', 'build-commonjs', 'build-amd'],
    callback
  );
});

gulp.task('prepare-release', function(callback){
  return runSequence(
    'build',
    'lint',
    'bump-version',
    'doc',
    'changelog',
    callback
  );
});