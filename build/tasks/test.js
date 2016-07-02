var gulp = require('gulp');
var karma = require('karma').server;

var configFile = __dirname + '/../../karma.conf.js';

/**
 * Run test once and exit
 */
gulp.task('test', ['jscs-test'], function (done) {
    karma.start({
        configFile: configFile,
        singleRun: true
    }, function(e) {
        done();
    });
});

/**
 * Watch for file changes and re-run tests on each change
 */
gulp.task('tdd', ['jscs-test'], function (done) {
    karma.start({
        configFile: configFile
    }, function(e) {
        done();
    });
});

/**
 * Run test once with code coverage and exit
 */
gulp.task('cover', function (done) {
  karma.start({
    configFile: configFile,
    singleRun: true,
    reporters: ['coverage'],
    preprocessors: {
      'test/**/*.js': ['babel'],
      'src/**/*.js': ['babel', 'coverage']
    },
    coverageReporter: {
      type: 'html',
      dir: 'build/reports/coverage'
    }
  }, function (e) {
    done();
  });
});
