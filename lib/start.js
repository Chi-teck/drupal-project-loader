var async = require('async');
var colors = require('colors');
var mkdirp = require('mkdirp');
var config = require('./config');
var loadIndex = require ('./loadIndex');
var logger = require('./logger');
var loadReleasesInfo = require('./loadReleasesInfo');
var confirmLoading = require('./confirmLoading');
var loadFiles = require('./loadFiles');

var stack = [
  function(callback) {
    mkdirp(config.destination, function(error) {
      if (error) throw error;
      callback();
    });
  },
  loadIndex,
  loadReleasesInfo,
  confirmLoading,
  loadFiles
];

async.waterfall(stack, function(error) {
  if (error) {
    logger.error(error.message || error);
  }
  else {
    console.log('Done!'.green);
  }
});

process.on('exit', function() {
  // Dump logs.
  var memoryTransport = logger.transports.memory;
  var messages = memoryTransport.errorOutput.concat(memoryTransport.writeOutput);
  if (messages.length > 0 ) {
    console.log('-- Log messages --'.gray);
    messages.forEach(function(message) {
      console.log(message);
    });
  }
});
