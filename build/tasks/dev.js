var gulp = require('gulp');
var tools = require('aurelia-tools');

gulp.task('update-own-deps', function(){
  tools.updateOwnDependenciesFromLocalRepositories();
});

gulp.task('build-dev-env', function () {
  tools.buildDevEnv();
});
