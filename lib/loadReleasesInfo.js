'use strict';

var request = require('request');
var parseString = require('xml2js').parseString;
var async = require('async');
var logger = require('./logger');
var ProgressBar = require('progress');
var config = require('./config');
var util = require('util');

module.exports = function (projects, callback) {

  console.log('Loading releases history...'.yellow);

  var barLabel = util.format(':current%s:total %s:percent%s [:bar] :elapsed sec.', '/'.gray, '('.gray, ')'.gray);
  var bar = new ProgressBar(barLabel, {
    complete: '▶'.blue,
    incomplete: '-'.gray,
    width: 50,
    total: projects.length
  });

  var info = [];

  var queue = async.queue(function (project, callback) {
    var url = config.storageUrl + '/release-history/' + project + '/' + config.branch;

    logger.debug(url.cyan);

    request(url, {timeout: config.timeout}, function (error, response, body) {
      if (error || response.statusCode != 200) {
        logger.error('Release history is not available. %s', url.cyan);
        callback();
        return;
      }

      parseString(body, function (error, result) {

        if (error || typeof result.project == 'undefined') {
          logger.error('Release history is not available. %s', url.cyan);
          callback();
          return;
        }

        var releaseInfo = {};

        var majorVersion = 0, date = 0;
        result.project.releases[0].release.forEach(function (release) {

          // Some releases have no date.
          var releaseDate = release.date ? release.date[0] : 0;

          var isLatest = releaseDate >= date;
          var isCurrentMajor = release.version_major && release.version_major[0] >= majorVersion;
          if (isLatest && isCurrentMajor && release.download_link) {
            releaseInfo.downloadLink = release.download_link[0];
            releaseInfo.size = release.filesize[0];
            majorVersion = release.version_major[0];
            date = releaseDate;
          }
        });

        if (!releaseInfo.downloadLink) {
          logger.warn('Project %s has no downloadable releases. %s', project.bold, url.cyan);
        }
        else if (!releaseInfo.size) {
          logger.warn('Project %s has no release size. %s', project.bold, url.cyan);
        }
        else {
          info.push(releaseInfo);
        }

      });

      bar.tick();
      callback();
    });

  }, config.concurrency);

  projects.forEach(function (project) {
    queue.push(project);
  });

  queue.drain = function () {
    if (info.length > 0) {
      callback(null, info);
    }
    else {
      callback('No releases were found.');
    }
  };

};
