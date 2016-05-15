var request = require('request');
var zlib = require('zlib');
var tar = require('tar');
var colors = require('colors');
var logger = require('./logger');
var async = require('async');
var ProgressBar = require('progress');

module.exports = function (links, callback) {
  console.log('Loading files...'.yellow);

  var barLabel = ':current' + '/'.gray + ':total ' + '('.gray + ':percent' + ')'.gray + ' [:bar] :elapsed sec.';
  var bar = new ProgressBar(barLabel, {
    complete: '■'.blue,
    incomplete: '-'.gray,
    width: 50,
    total: links.length
  });


  var queue = async.queue(function (link, callback) {
    var gunzip = zlib.createGunzip();
    var extractor = tar.Extract({path: "/tmp/d8"});
    request(link, function (error, response) {
      if (error) {
        logger.error(error);
        return;
      }

      logger.verbose(link, response.statusCode);
      if (response.statusCode != 200) {

      }

      bar.tick();
      callback();
    })
      .pipe(gunzip)
      .pipe(extractor);

    gunzip.on('error', function (error) {
      // logger.warn('gunzip' + link);
    });

    extractor.on('error', function (error) {
      logger.warn('extractor');
    });

  }, 50);


  queue.drain = function () {
    callback();
  };

  links.forEach(function(link) {
    queue.push(link)
  });


};

