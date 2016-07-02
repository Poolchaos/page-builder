var gulp = require('gulp');
var bundler = require('aurelia-bundler');
var runSequence = require('run-sequence');

var bundlePaths = {
  js: "[**/*.js]",
  html: "**/*.html!text",
  css: "**/*.css!text"
};

var config = {
  force: true,
  packagePath: '.',
  bundles: {
    "target/bundle-app": {
      includes: [
        bundlePaths.js,
        bundlePaths.html,
        bundlePaths.css
      ],
      options: {
        inject: true,
        minify: true
      }
    },
    "target/bundle-dependencies": {
      includes: [
       "aiva-common",
       "aurelia-flux",
       "aurelia-framework",
       "aurelia-loader-default",
       "aurelia-templating-binding",
       "aurelia-templating-resources",
       "manifestinteractive/jqvmap",
       "aurelia-templating-router",
       "aurelia-history-browser",
       "aurelia-bootstrapper",
       "aurelia-configuration",
       "aurelia-dialog",
       "aurelia-event-aggregator",
       "aurelia-fetch-client",
       "aurelia-http-client",
       "aurelia-logging-console",
       "aurelia-router",
       "aurelia-validation",
       "js-binarypack",
       "node-uuid",
       "toastr",
       "peerjs",
       "reliable",
       "text",
       "url"
     ],
      options: {
        inject: true,
        minify: true
      }
    }
  }
};

gulp.task('bundle', function () {
  return runSequence(
    'build', 'bundle-project', 'compress'
  );
});

gulp.task('bundle-project', function () {
  return bundler.bundle(config);
});

gulp.task('unbundle', function () {
  return bundler.unbundle(config);
});