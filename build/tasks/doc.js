var gulp = require('gulp');
var paths = require('../paths');
var typedoc = require('gulp-typedoc');
var runSequence = require('run-sequence');
var through2 = require('through2');

gulp.task('doc-generate', function(){
  return gulp.src([paths.output + paths.packageName + '.d.ts'])
    .pipe(typedoc({
      target: 'es6',
      includeDeclarations: true,
      moduleResolution: 'node',
      json: paths.doc + '/api.json',
      name: paths.packageName + '-docs', 
      mode: 'modules',
      excludeExternals: true,
      ignoreCompilerErrors: false,
      version: true
    }));
});

gulp.task('doc-shape', function(){
  return gulp.src([paths.doc + '/api.json'])
    .pipe(through2.obj(function(file, enc, callback) {
      var json = JSON.parse(file.contents.toString('utf8')).children[0];

      json = {
        name: paths.packageName,
        children: json.children,
        groups: json.groups
      };

      file.contents = new Buffer(JSON.stringify(json));
      this.push(file);
      return callback();
    }))
    .pipe(gulp.dest(paths.doc));
});

gulp.task('doc', function(callback){
  return runSequence(
    'doc-generate',
    'doc-shape',
    callback
  );
});
