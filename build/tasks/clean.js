let gulp = require('gulp');
let paths = require('../paths');
let del = require('del');
let vinylPaths = require('vinyl-paths');

gulp.task('clean', function() {
  return gulp.src([paths.output])
    .pipe(vinylPaths(del));
});
