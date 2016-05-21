var colors = require('colors');
var argv = require('minimist')(process.argv.slice(2));

var config = {};

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
config.extract = argv.extract == undefined ? true : Boolean(argv.extract);

// Concurrency.
config.concurrency = (argv.concurrency || argv.c || 50).toString();
if (!config.concurrency.match(/\d{1,3}/)) {
  console.log('%s is not valid concurrency value.'.red, config.concurrency.bold);
  process.exit(1);
}

// Yes.
config.yes = argv['yes'] || argv['y'] || false;

// Log level.
config.logLevel = argv['log-level'] || 'warn';

module.exports = config;
