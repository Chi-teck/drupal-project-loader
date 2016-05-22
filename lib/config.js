'use strict';

require('colors');
var argv = require('minimist')(process.argv.slice(2));

var config = {};

// Storage serivice URL.
config.storageUrl = 'https://updates.drupal.org';

// Branch name.
config.branch = argv.branch || argv.b || '8.x';
if (!config.branch.match(/^(\d\.){1,2}x$/)) {
  console.log('%s is not valid branch name.'.red, config.branch.bold);
  process.exit(1);
}

// Project type.
config.type = argv.type || argv.t || false;
var allowedProjectTypes = [
  'module',
  'theme',
  'distribution',
  'core',
  'drupalorg',
  'theme_engine',
  'translation'
];
if (config.type && allowedProjectTypes.indexOf(config.type) == -1) {
  console.log('%s is not valid project type.'.red, config.type.bold);
  process.exit(1);
}

// Destination.
config.destination = argv.destination || argv.d || './drupal-codebase/' + config.branch;

// Extract.
var extract = argv.extract || argv.e;
config.extract = typeof extract == 'undefined' ? true : Boolean(extract);

// Concurrency.
config.concurrency = argv.concurrency || argv.c || 50;
if (!config.concurrency.toString().match(/\d{1,3}/)) {
  console.log('%s is not valid concurrency value.'.red, config.concurrency.toString().bold);
  process.exit(1);
}

// Yes.
config.yes = argv.yes || argv.y || false;

// Log level.
config.logLevel = argv['log-level'] || argv.l || 'warn';

// Timeout.
config.timeout = argv.timeout || argv.m || 15000;
if (!config.timeout.toString().match(/^[1-9][0-9]*$/)) {
  console.log('%s is not valid timout value.'.red, config.timeout.toString().bold);
  process.exit(1);
}

module.exports = config;
