const winston = require('winston')
// const Logsene = require('winston-logsene')

let config = {
  host: 'localhost',
  port: 24224,
  timeout: 3.0,
  requireAckResponse: true // Add this option to wait response from Fluentd certainly
};
var fluentTransport = require('fluent-logger').support.winstonTransport();
var fluent = new fluentTransport('fluentd.test', config);

const options = {
  console: {
    level: 'debug',
    handleExceptions: true,
    json: true,
    colorize: true,
  }
}

const logger = winston.createLogger({
  levels: winston.config.npm.levels,
  format: winston.format.combine(
    winston.format.json()
  ),
  transports: [
    new winston.transports.Console(options.console),
    fluent
    // new Logsene({
    //   token: process.env.LOGS_TOKEN,
    //   level: 'debug',
    //   type: 'app_logs',
    //   url: 'https://logsene-receiver.sematext.com/_bulk'
    // })
  ],
  exitOnError: false
})

logger.on('flush', () => {
  console.log("flush");
})
 
logger.on('finish', () => {
  console.log("finish");
  fluent.sender.end("end", {}, () => {})
});

module.exports = logger


