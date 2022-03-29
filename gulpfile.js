// @ts-check
// require('./build/tasks');

const gulp = require('gulp');
const bump = require('gulp-bump');
const conventionalChangelog = require('gulp-conventional-changelog');
const typedoc = require('gulp-typedoc');
const through2 = require('through2');
const pkg = require('./package.json');

const docPath = './doc';
const yargs = require('yargs');

const argv = yargs.argv;
const validBumpTypes = 'major|minor|patch|prerelease'.split('|');
// @ts-ignore
const bumpType = (argv.bump || 'patch').toLowerCase();

if (validBumpTypes.indexOf(bumpType) === -1) {
  throw new Error('Unrecognized bump "' + bump + '".');
}

gulp.task('doc-generate', function() {
  return gulp.src([pkg.typings])
    .pipe(typedoc({
      target: 'es6',
      includeDeclarations: true,
      moduleResolution: 'node',
      json: 'doc/api.json',
      name: pkg.name + '-docs',
      mode: 'modules',
      excludeExternals: true,
      ignoreCompilerErrors: false,
      version: true
    }));
});

gulp.task('doc-shape', function() {
  return gulp.src([`${docPath}/api.json`])
    .pipe(through2.obj(function(file, enc, callback) {
      let json = JSON.parse(file.contents.toString('utf8')).children[0];

      json = {
        name: pkg.name,
        children: json.children,
        groups: json.groups
      };

      file.contents = new Buffer(JSON.stringify(json));
      this.push(file);
      return callback();
    }))
    .pipe(gulp.dest(docPath));
});

gulp.task('doc', gulp.series('doc-generate', 'doc-shape'));

gulp.task('changelog', function() {
  return gulp.src(`${docPath}/CHANGELOG.md`, {
    buffer: false
  }).pipe(conventionalChangelog({
    preset: 'angular'
  }))
  .pipe(gulp.dest(docPath));
});

gulp.task('bump-version', function() {
  return gulp.src(['./package.json', './bower.json'])
    .pipe(bump({type: bumpType })) //major|minor|patch|prerelease
    .pipe(gulp.dest('./'));
});

gulp.task('prepare-release', gulp.series('bump-version', 'doc', 'changelog'));
