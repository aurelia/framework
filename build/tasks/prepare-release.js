let gulp = require('gulp');
let paths = require('../paths');
let bump = require('gulp-bump');
let args = require('../args');
let conventionalChangelog = require('gulp-conventional-changelog');

gulp.task('changelog', function() {
  return gulp.src(paths.doc + '/CHANGELOG.md', {
    buffer: false
  }).pipe(conventionalChangelog({
    preset: 'angular'
  }))
  .pipe(gulp.dest(paths.doc));
});

gulp.task('bump-version', function() {
  return gulp.src(['./package.json', './bower.json'])
    .pipe(bump({type: args.bump })) //major|minor|patch|prerelease
    .pipe(gulp.dest('./'));
});

gulp.task('prepare-release', gulp.series(
  'build',
  'lint',
  'bump-version',
  'doc',
  'changelog'
));
