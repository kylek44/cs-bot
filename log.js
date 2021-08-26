const winston = require('winston');

const logFormat = winston.format.printf(({level, message, timestamp}) => {
  return `${timestamp} [${level}]: ${message}`;
});

const logger = winston.createLogger({
  level: 'info',
  // format: winston.format.combine(
  //   winston.format.timestamp(),
  //   logFormat
  // ),
  format: winston.format.combine(winston.format.timestamp(), winston.format.json()),
  transports: [
    // new winston.transports.Console(),
    new winston.transports.File({filename: 'error.log', level: 'error'}),
    new winston.transports.File({filename: 'combined.log', level: 'info'})
  ]
});

module.exports = logger;