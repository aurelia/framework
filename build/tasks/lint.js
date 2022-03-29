let gulp = require('gulp');
let paths = require('../paths');
let eslint = require('gulp-eslint');

gulp.task('lint', function() {
  return gulp.src(paths.source)
    .pipe(eslint())
    .pipe(eslint.format())
    .pipe(eslint.failOnError());
});
