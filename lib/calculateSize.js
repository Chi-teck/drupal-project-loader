var fileSize = require('filesize');
module.exports = function(releases) {
  var size = 0;
  releases.forEach(function(release) {
    size += parseInt(release.size);
  });
  return fileSize(size);
};
