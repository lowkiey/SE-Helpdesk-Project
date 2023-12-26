const winston = require('winston');
const path = require('path');


const errorLogPath = path.join(__dirname, '..', 'file.txt'); // Correct path to file.txt in the project root

const logger = winston.createLogger({
  level: 'error',
  format: winston.format.combine(
    winston.format.timestamp({
      format: 'YYYY-MM-DD HH:mm:ss'
    }),
    winston.format.errors({ stack: true }),
    winston.format.splat(),
    winston.format.json()
  ),
  transports: [
    new winston.transports.File({ filename: errorLogPath })
  ]
});

const logError = (error) => {
  logger.error(error);
};

module.exports = logError;