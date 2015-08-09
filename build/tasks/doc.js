var gulp = require('gulp');
var paths = require('../paths');
var typedoc = require("gulp-typedoc");
var typedocExtractor = require("gulp-typedoc-extractor");
var runSequence = require('run-sequence');

gulp.task('doc-generate', function(){
  return gulp.src([paths.output + '*.d.ts', paths.doc + '/core-js.d.ts', './jspm_packages/github/aurelia/*/*.d.ts'])
    .pipe(typedoc({
            target: "es6",
            includeDeclarations: true,
            json: paths.doc + '/api.json',
            name: paths.packageName + '-docs', 
						mode: 'modules',
						excludeExternals: true,
            ignoreCompilerErrors: false,
            version: true
        }));
});

gulp.task('doc-extract', function(){
	return gulp.src([paths.doc + '/api.json'])
		.pipe(typedocExtractor(paths.packageName))
		.pipe(gulp.dest(paths.doc));
});

gulp.task('doc', function(callback){
  return runSequence(
  	'doc-generate',
  	'doc-extract',
    callback
  );
});