'use strict';

var Table = require('cli-table');
var ReadLine = require('readline');
var util = require('util');
var calculateSize = require('./calculateSize');
var config = require('./config');

module.exports = function (releases, callback) {

  var table = new Table({
    colAligns: ['left', 'middle'],
    style: {
      'head': ['cyan'],
      'padding-left': 0,
      'padding-right': 0
    }
  });

  table.push(
    {'API branch:': config.branch},
    {'Project type:': config.type || 'All'},
    {'Destination directory:': config.destination},
    {'Total projects:': releases.length},
    {'Required disc space:': calculateSize(releases)}
  );

  console.log();
  console.log(table.toString());

  var question = util.format('%s [%s]: ', 'Start loading?'.green, 'Y/n'.yellow);

  if (config.yes) {
    console.log(question + 'Y');
    callback(null, releases);
  }
  else {
    var readLine = ReadLine.createInterface({
      input: process.stdin,
      output: process.stdout
    });
    readLine.question(util.format('%s [%s]: ', 'Start loading?'.green, 'Y/n'.yellow), function (answer) {
      if (answer.toLowerCase()[0] == 'y') {
        callback(null, releases);
      }
      readLine.close();
    });
  }

};
