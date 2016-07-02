var path = require('path');

var appRoot = 'src/';
var outputRoot = 'target/';
var generatedRoot = 'generated/';
var stylesOutputRoot = 'target/_assets/';
var dddRoot = 'ddd/';

module.exports = {
  root: appRoot,
  source: appRoot + '**/*.js',
  vendor: 'vendor/**/*.*',
  vendorOutput: outputRoot + 'vendor/',
  html: appRoot + '**/*.html',
  css: appRoot + '**/*.css',
  allStyles: appRoot + '**/*.scss',
  images: appRoot + '_assets/img/**/*',
  fonts: appRoot + '_assets/fonts/*',
  style: appRoot + 'index.scss',
  output: outputRoot,
  imgOutput: stylesOutputRoot + 'img/',
  fontsOutput: stylesOutputRoot + 'fonts/',
  styleOutput: stylesOutputRoot + 'styles/',
  doc: './doc',
  docs: appRoot + '_assets/docs/*',
  docsOutput: stylesOutputRoot + 'docs/',
  e2eSpecsSrc: 'test/e2e/target/*.js',
  e2eSpecsDist: 'test/e2e/dist/',
  unitSpecs: 'test/unit/**/*.js',
  swigTemplates: 'build/templates/',
  commonServices: generatedRoot + '_common/services',
  api: generatedRoot + '_api',
  generatedRoot: generatedRoot,
  generated: generatedRoot + '**/*.*',
  
  dependencyBundle: outputRoot + 'bundle-dependencies.js',
  appBundle: outputRoot + 'bundle-app.js',
  fontsBundle: stylesOutputRoot + 'fonts/*',
  stylesBundle: stylesOutputRoot + 'styles/*',
  imgBundle: stylesOutputRoot + 'img/*',
  
  ddd: dddRoot + '**/*.json'
};
