const winston = require('winston');
const { UUCOMMANDER_HOME } = require('./config');
const { cmdArguments } = require('../app/cmd/cli/arguments');
const path = require('path');

const customFileFormat = winston.format.combine(
  winston.format.timestamp({
    format: 'YYYY-MM-DD HH:mm:ss'
  }),
  winston.format.printf(({ level, message, timestamp }) => {
    return `${timestamp} - [${level.toUpperCase()}]: ${message}`;
  })
);

const customConsoleFormat = winston.format.printf(({ level, message }) => {
  return `[${level.toUpperCase()}]: ${message}`;
});

const options = {
  fileInfo: {
    level: 'info',
    filename: path.join(UUCOMMANDER_HOME, 'logs', 'info.log'),
    format: customFileFormat,
    handleExceptions: true,
    maxsize: 5242880,
    maxFiles: 5
  },
  fileDebug: {
    level: 'debug',
    filename: path.join(UUCOMMANDER_HOME, 'logs', 'debug.log'),
    format: customFileFormat,
    handleExceptions: true,
    maxsize: 5242880,
    maxFiles: 5
  },
  console: {
    level: cmdArguments.debug ? 'debug' : 'info',
    format: customConsoleFormat,
    handleExceptions: true,
    colorize: true
  }
};

const transports = {
  fileInfo: new winston.transports.File(options.fileInfo),
  fileDebug: new winston.transports.File(options.fileDebug),
  console: new winston.transports.Console(options.console)
};

const LOGGER = winston.createLogger({
  transports: [
    transports.fileInfo,
    transports.fileDebug,
    transports.console
  ],
  exitOnError: false
});

module.exports = LOGGER;
