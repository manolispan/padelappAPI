const { format, createLogger, transports } = require("winston");
const { combine, timestamp, label, printf, prettyPrint } = format;


const loggersignin = createLogger({
  level: "debug",
  format: combine(
 timestamp({
      format: "MMM-DD-YYYY HH:mm:ss",
    }),
    prettyPrint()
  ),
  transports:[
    new transports.File({
      filename: "logs/signin.log",
    }),
    new transports.Console(),
  ],
});

module.exports = loggersignin;