require('colors');
var config = require('./config');
var request = require('request');
var zlib = require('zlib');
var tar = require('tar');
var logger = require('./logger');
var async = require('async');
var ProgressBar = require('progress');
var fs = require('fs');

module.exports = function (releases, callback) {
  console.log('Loading files...'.yellow);

  var barLabel = ':current' + '/'.gray + ':total ' + '('.gray + ':percent' + ')'.gray + ' [:bar] :elapsed sec.';
  var bar = new ProgressBar(barLabel, {
    complete: '■'.blue,
    incomplete: '-'.gray,
    width: 50,
    total: releases.length
  });

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
      gunzip.on('error', function(error) {
        if (!downloadError) {
          logger.warn(error);
        }
      });

      var extractor = tar.Extract({path: config.destination});
      extractor.on('error', function(error) {
        logger.warn(error);
      });

      result
        .pipe(gunzip)
        .pipe(extractor);

    }
    else {
      var fileName = release.downloadLink.split('/').slice(-1)[0];
      var fileStream = fs.createWriteStream(config.destination + '/' + fileName);
      fileStream.on('error', function(error) {
        logger.warn('file');
      });

      result.pipe(fileStream);
    }

  }, config.concurrency);


  releases.forEach(function(release) {
    queue.push(release)
  });

  queue.drain = callback;
};

