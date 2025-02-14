const path = require('path');
const winston = require('winston');

const formatoLog = winston.format.printf(({ level, message, timestamp }) => {
    return `Timestamp: ${timestamp} - Level: ${level} - Message: ${message}`;
});

module.exports = winston.createLogger({
    level: process.env.LOGGING_LEVEL,
    format: winston.format.combine(
        winston.format.json(),
        winston.format.timestamp({
            format: process.env.LOGGING_FILE_PATERN,
        }),
        winston.format.prettyPrint(),
        formatoLog,
        winston.format.colorize({ all: true }),
    ),
    transports: [
        new winston.transports.File({
            filename: path.join(
                process.env.LOGGING_FILE_PATH,
                process.env.LOGGING_FILE_NAME,
            ),
        }),
        new winston.transports.Console(),
    ],
});
