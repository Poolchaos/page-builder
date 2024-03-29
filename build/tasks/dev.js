var gulp = require('gulp');
var tools = require('aurelia-tools');

// source code for the tasks called in this file
// is located at: https://github.com/aurelia/tools/blob/master/target/dev.js

// updates dependencies in this folder
// from folders in the parent directory
gulp.task('update-own-deps', function() {
  tools.updateOwnDependenciesFromLocalRepositories();
});

// quickly pulls in all of the aurelia
// github repos, placing them up one directory
// from where the command is executed,
// then runs `npm install`
// and `gulp build` for each repo
gulp.task('build-dev-env', function () {
  tools.buildDevEnv();
});
