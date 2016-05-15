var request = require('request');
var parseString = require('xml2js').parseString;
var async = require('async');
var util = require("util");
var logger = require('./logger');
var ProgressBar = require('progress');

module.exports = function (projects, version, callback) {

  console.log('Loading releases history...'.yellow);

  var barLabel = ':current' + '/'.gray + ':total ' + '('.gray + ':percent' + ')'.gray + ' [:bar] :elapsed sec.';
  var bar = new ProgressBar(barLabel, {
    complete: '▶'.blue,
    incomplete: '-'.gray,
    width: 50,
    total: projects.length
  });

  var links = [];

  var queue = async.queue(function (project, callback) {
    var url = 'https://updates.drupal.org/release-history/' + project + '/' + version;

    logger.debug(url.cyan);

    request(url, function (error, response, body) {
      if (error) throw error;

      if (response.statusCode != 200) {
        logger.error('Release history is not available. Status code: %s. %s', response.statusCode.bold, url.cyan);
        return;
      }
      var projects = [];

      parseString(body, function (err, result) {

        if (result.project == undefined) {
          logger.error('Release history is not available. %s', url.cyan);
          return;
        }

        var majorVersion = 0, downloadLink = false, date = 0;
        result.project.releases[0].release.forEach(function(release) {

          // Some releases have no date.
          var releaseDate = release.date ? release.date[0] : 0;

          var isLatest = releaseDate >= date;
          var isLatestMajor = release.version_major && release.version_major[0] >= majorVersion;
          if (isLatest && isLatestMajor && release.download_link) {
            downloadLink = release.download_link[0];
            majorVersion = release.version_major[0];
            date = releaseDate;
          }
        });

        downloadLink && links.push(downloadLink);
        if (!downloadLink) {
          logger.warn('Project %s has now downloadable releases. %s', project.bold, url.cyan);
        }

      });

      bar.tick();
      callback();

    });

  }, 50);

  projects.forEach(function(project) {
    queue.push(project)
  });

  queue.drain = function () {
    callback(links);
  }

};
