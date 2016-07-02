var gulp = require('gulp');
var runSequence = require('run-sequence');
var changed = require('gulp-changed');
var plumber = require('gulp-plumber');
var to5 = require('gulp-babel');
var sourcemaps = require('gulp-sourcemaps');
var minifyCss = require('gulp-minify-css');
var paths = require('../paths');
var compilerOptions = require('../babel-options');
var assign = Object.assign || require('object.assign');
var notify = require('gulp-notify');
//var flatten = require('gulp-flatten');
//var sass = require('gulp-sass');
var sass = require('gulp-ruby-sass');
//var importOnce = require('node-sass-import-once');
var swig = require('gulp-swig');
var data = require('gulp-data');
var model = require('../model');

var getServiceModel = function () {
  //  model.newModel();
  return model.serviceModel();
};

var getApiModel = function() {
  return {apiModel: JSON.stringify(model.apiModel(), null, 2)};
};

// transpiles changed es6 files to SystemJS format
// the plumber() call prevents 'pipe breaking' caused
// by errors from other gulp plugins
// https://www.npmjs.com/package/gulp-plumber
//gulp.task('build-system', ['jscs'], function () {
gulp.task('build-system', ['build-api'], function () {
  return gulp.src([paths.source, paths.generated])
  //    .pipe(flatten())
    .pipe(plumber({
      errorHandler: notify.onError('Error: <%= error.message %>')
    }))
    .pipe(changed(paths.output, {
      extension: '.js'
    }))
    .pipe(sourcemaps.init({
      loadMaps: true
    }))
    .pipe(to5(assign({}, compilerOptions, {
      modules: 'system'
    })))
    .pipe(sourcemaps.write({
      includeContent: true
    }))
    .pipe(gulp.dest(paths.output));
});

// copies changed html files to the output directory
gulp.task('build-html', function () {
  return gulp.src(paths.html)
  //    .pipe(flatten())
    .pipe(changed(paths.output, {
      extension: '.html'
    }))
    .pipe(gulp.dest(paths.output));
});

// copies changed image files to the output directory
gulp.task('build-images', function () {
  return gulp.src(paths.images)

    .pipe(changed(paths.imgOutput, {
      extension: '*'
    }))
    .pipe(gulp.dest(paths.imgOutput));
});

gulp.task('build-docs', function () {
  return gulp.src(paths.docs)
    .pipe(changed(paths.docsOutput, {
      extension: '*'
    }))
    .pipe(gulp.dest(paths.docsOutput));
});

// copies changed font files to the output directory
gulp.task('build-fonts', function () {
  return gulp.src(paths.fonts)
    .pipe(changed(paths.fontsOutput, {
      extension: '*'
    }))
    .pipe(gulp.dest(paths.fontsOutput));
});

// copies changed css files to the output directory
gulp.task('build-css', function () {
  return sass(paths.style, { sourcemap: true })
    .on('error', sass.logError)
    .pipe(plumber())
    .pipe(minifyCss())
    .pipe(sourcemaps.write())
    .pipe(gulp.dest(paths.styleOutput));
});

// copies changed css files to the output directory
/*gulp.task('build-vendor', function () {
  return gulp.src(paths.vendor)

    .pipe(changed(paths.vendor, {
      extension: '*'
    }))
    .pipe(gulp.dest(paths.vendorOutput));
});*/

gulp.task('build-api-service', function () {
  return gulp.src(paths.swigTemplates + 'application.service.js')
    .pipe(data(getServiceModel))
    .pipe(swig({
      ext: '.js'
    }))
    .pipe(gulp.dest(paths.commonServices));
});

gulp.task('build-api-model', function () {
  return gulp.src(paths.swigTemplates + 'model.js')
    .pipe(data(getApiModel))
    .pipe(swig({
      ext: '.js'
    }))
    .pipe(gulp.dest(paths.api));
});

gulp.task('build-api', ['build-api-service', 'build-api-model']);

// this task calls the clean task (located
// in ./clean.js), then runs the build-system
// and build-html tasks in parallel
// https://www.npmjs.com/package/gulp-run-sequence
gulp.task('build', function (callback) {
  return runSequence(
    'clean', ['build-system', 'build-html', 'build-images', 'build-docs', 'build-fonts', 'build-css'],
    callback
    );
});
