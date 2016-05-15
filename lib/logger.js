var winston = require('winston');
winston.emitErrs = true;

var logger = new winston.Logger({
  transports: [
    new winston.transports.Console({
      level: 'error',
      json: false,
      colorize: true
    })
  ],
  exitOnError: false
});

module.exports = logger;
