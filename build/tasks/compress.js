var gulp = require('gulp');
var gzip = require('gulp-gzip');
var paths = require('../paths');
var runSequence = require('run-sequence');
var imagemin = require('gulp-imagemin');

gulp.task('compress', function () {
  return runSequence(
    ['compress-dependencies', 'compress-app', 'compress-css', 'compress-images', 'compress-fonts']
  );
});

gulp.task('compress-dependencies', function () {
  return gulp.src(paths.dependencyBundle)
    .pipe(gzip())
    .pipe(gulp.dest(paths.output));
});

gulp.task('compress-app', function () {
  return gulp.src(paths.appBundle)
    .pipe(gzip())
    .pipe(gulp.dest(paths.output));
});

gulp.task('compress-css', function () {
  return gulp.src(paths.stylesBundle)
    .pipe(gzip())
    .pipe(gulp.dest(paths.styleOutput));
});

gulp.task('compress-images', function () {
  return gulp.src(paths.imgBundle)
    .pipe(imagemin({
      progressive: true,
      optimizationLevel: 3,
      svgoPlugins: [{
        removeViewBox: false
      }]
    }))
    .pipe(gulp.dest(paths.imgOutput));
});

gulp.task('compress-fonts', function () {
  return gulp.src(paths.fontsBundle)
    .pipe(gzip())
    .pipe(gulp.dest(paths.fontsOutput));
});