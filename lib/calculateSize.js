var fileSize = require('filesize');
var config = require('./config');

module.exports = function(releases) {
  var size = 0;
  releases.forEach(function(release) {
    size += parseInt(release.size);
  });

  if (config.extract) {
    // Take into account approximate compress rate.
    size = size * 4;
  }
  return fileSize(size);
};
