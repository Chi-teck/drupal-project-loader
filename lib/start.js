var loadIndex = require ('./loadIndex');
var plural = require('plural');
var colors = require('colors');
var logger = require('./logger');
var loadLinks = require('./loadLinks');
var loadFiles = require('./loadFiles');

var version = '8.x';

loadIndex(version, function (projects) {
  // console.log((projects.length.toString().bold + ' ' + plural('project', projects.length) + ' have been found.').green);

  loadLinks(projects, version, function (links) {
    console.log((links.length.toString().bold + ' ' + plural('link', links.length) + ' have been found.').green);
    loadFiles(links, printSummary);
  });
});

function printSummary() {
  //console.log('Done!');
}
