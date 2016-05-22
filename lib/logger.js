'use strict';

var config = require('./config');
var winston = require('winston');
winston.emitErrs = true;

var logger = new winston.Logger({
  transports: [
    new winston.transports.Memory({
      level: config.logLevel,
      json: false,
      colorize: true
    })
  ],
  exitOnError: false
});

module.exports = logger;
