require('colors');
var config = require('./config');
var request = require('request');
var zlib = require('zlib');
var tar = require('tar');
var logger = require('./logger');
var async = require('async');
var ProgressBar = require('progress');
var mkdirp = require('mkdirp');
var fs = require('fs');
var util = require('util');

module.exports = function(releases, callback) {

  // Prepare directory.
  try {
    mkdirp.sync(config.destination);
  }
  catch (error) {
    logger.error(error.message);
    process.exit(1);
  }

  console.log('Loading files...'.yellow);

  var barLabel = util.format(':current%s:total %s:percent%s [:bar] :elapsed sec.', '/'.gray, '('.gray, ')'.gray);
  var bar = new ProgressBar(barLabel, {
    complete: '■'.blue,
    incomplete: '-'.gray,
    width: 50,
    total: releases.length
  });

  // This will prevent freezing timer when download is slow.
  var interval = setInterval(function() {
    bar.tick(0);
  }, 100);

  var queue = async.queue(function(release, callback) {
    var downloadError;

    var result = request(release.downloadLink, function(error, response) {
      if (error || response.statusCode != 200) {
        downloadError = true;
        logger.error('Could not download file. %s', release.downloadLink.cyan);
      }
      bar.tick();
      callback();
    });

    if (config.extract) {
      var gunzip = zlib.createGunzip();
      gunzip.on('error', function() {
        if (!downloadError) {
          logger.error('Could not unzip file. %s', release.downloadLink.cyan);
        }
      });

      var extractor = tar.Extract({path: config.destination});
      extractor.on('error', function() {
        logger.error('Could not untar file. %s', release.downloadLink.cyan);
      });

      result
        .pipe(gunzip)
        .pipe(extractor);

    }
    else {
      var fileName = release.downloadLink.split('/').slice(-1)[0];
      var fileStream = fs.createWriteStream(config.destination + '/' + fileName);
      fileStream.on('error', function(error) {
        logger.warn(error);
      });

      result.pipe(fileStream);
    }

  }, config.concurrency);

  releases.forEach(function(release) {
    queue.push(release)
  });

  queue.drain = function() {
    clearInterval(interval);
    callback();
  };

};

