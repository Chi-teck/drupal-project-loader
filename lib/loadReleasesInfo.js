var request = require('request');
var parseString = require('xml2js').parseString;
var async = require('async');
var util = require("util");
var logger = require('./logger');
var ProgressBar = require('progress');
var config = require('./config');

module.exports = function (projects, callback) {

  console.log('Loading releases history...'.yellow);

  var barLabel = ':current' + '/'.gray + ':total ' + '('.gray + ':percent' + ')'.gray + ' [:bar] :elapsed sec.';
  var bar = new ProgressBar(barLabel, {
    complete: '▶'.blue,
    incomplete: '-'.gray,
    width: 50,
    total: projects.length
  });

  var info = [];

  var queue = async.queue(function (project, callback) {
    var url = 'https://updates.drupal.org/release-history/' + project + '/' + config.branch;

    logger.debug(url.cyan);

    request(url, function (error, response, body) {
      if (error || response.statusCode != 200) {
        logger.error('Release history is not available. %s', url.cyan);
        return;
      }
      var projects = [];

      parseString(body, function (error, result) {

        if (error || result.project == undefined) {
          logger.error('Release history is not available. %s', url.cyan);
          return;
        }

        var releaseInfo = {};

        var majorVersion = 0, date = 0;
        result.project.releases[0].release.forEach(function(release) {

          // Some releases have no date.
          var releaseDate = release.date ? release.date[0] : 0;

          var isLatest = releaseDate >= date;
          var isLatestMajor = release.version_major && release.version_major[0] >= majorVersion;
          if (isLatest && isLatestMajor && release.download_link) {
            releaseInfo.downloadLink = release.download_link[0];
            releaseInfo.hash = release.mdhash[0];
            releaseInfo.size = release.filesize[0];
            majorVersion = release.version_major[0];
            date = releaseDate;
          }
        });

        if (releaseInfo.downloadLink) {
          if (releaseInfo.size) {
            info.push(releaseInfo);
          }
          else {
            logger.warn('Project %s has no release size. %s', project.bold, url.cyan);
          }
        }
        else {
          logger.warn('Project %s has no downloadable releases. %s', project.bold, url.cyan);
        }

      });

      bar.tick();
      callback();
    });

  }, config.concurrency);

  projects.forEach(function(project) {
    queue.push(project)
  });

  queue.drain = function () {
    callback(null, info);
  }

};
