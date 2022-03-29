let gulp = require('gulp');
let tools = require('aurelia-tools');

gulp.task('update-own-deps', function() {
  tools.updateOwnDependenciesFromLocalRepositories();
});

gulp.task('build-dev-env', function() {
  tools.buildDevEnv();
});
