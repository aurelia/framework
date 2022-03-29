// @ts-check
// require('./build/tasks');

const gulp = require('gulp');
const bump = require('gulp-bump');
const conventionalChangelog = require('gulp-conventional-changelog');

const docPath = './doc';
const yargs = require('yargs');

const argv = yargs.argv;
const validBumpTypes = 'major|minor|patch|prerelease'.split('|');
// @ts-ignore
const bumpType = (argv.bump || 'patch').toLowerCase();

if (validBumpTypes.indexOf(bumpType) === -1) {
  throw new Error('Unrecognized bump "' + bump + '".');
}

gulp.task('changelog', function() {
  return gulp.src(`${docPath}/CHANGELOG.md`, {
    buffer: false
  }).pipe(conventionalChangelog({
    preset: 'angular',
    releaseCount: 0,
  }))
  .pipe(gulp.dest(docPath));
});

gulp.task('bump-version', function() {
  return gulp.src(['./package.json', './bower.json'])
    .pipe(bump({type: bumpType }))
    .pipe(gulp.dest('./'));
});

gulp.task('prepare-release', gulp.series('bump-version', 'changelog'));
