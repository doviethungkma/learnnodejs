const winston = require("winston");

//Logger
const logger = winston.createLogger({
  level: "info",
  format: winston.format.json(),
  transports: [
    new winston.transports.File({
      filename: "api/logs/error.log",
      level: "error",
    }),
    new winston.transports.File({
      filename: "api/logs/info.log",
      level: "info",
    }),
    new winston.transports.File({
      filename: "api/logs/debug.log",
      level: "debug",
    }),
  ],
});

module.exports = logger;
