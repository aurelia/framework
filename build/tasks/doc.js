var gulp = require('gulp');
var tools = require('aurelia-tools');
var paths = require('../paths');
var yuidoc = require('gulp-yuidoc');

gulp.task('doc-generate', function(){
  return gulp.src(paths.source)
    .pipe(yuidoc.parser(null, 'api.json'))
    .pipe(gulp.dest(paths.doc));
});

gulp.task('doc', ['doc-generate'], function(){
  tools.transformAPIModel(paths.doc);
});
