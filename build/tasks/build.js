var gulp = require('gulp');
var runSequence = require('run-sequence');
var to5 = require('gulp-6to5');
var paths = require('../paths');
var compilerOptions = require('../6to5-options');
var assign = Object.assign || require('object.assign');

gulp.task('build-es6', function () {
  return gulp.src(paths.source)
    .pipe(gulp.dest(paths.output + 'es6'));
});

gulp.task('build-commonjs', function () {
  return gulp.src(paths.source)
    .pipe(to5(assign({}, compilerOptions, {modules:'common'})))
    .pipe(gulp.dest(paths.output + 'commonjs'));
});

gulp.task('build-amd', function () {
  return gulp.src(paths.source)
    .pipe(to5(assign({}, compilerOptions, {modules:'amd'})))
    .pipe(gulp.dest(paths.output + 'amd'));
});

gulp.task('build-system', function () {
  return gulp.src(paths.source)
    .pipe(to5(assign({}, compilerOptions, {modules:'system'})))
    .pipe(gulp.dest(paths.output + 'system'));
});

gulp.task('build', function(callback) {
  return runSequence(
    'clean',
    ['build-es6', 'build-commonjs', 'build-amd', 'build-system'],
    callback
  );
});
