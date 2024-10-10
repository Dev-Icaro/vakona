import { createLogger, transports, format, addColors } from 'winston';
import * as path from 'path';
import 'winston-daily-rotate-file';

const logDirectory = path.resolve(__dirname, '../../../logs');
const customColors = {
  error: 'red',
  warn: 'yellow',
  info: 'blue',
  http: 'magenta',
  verbose: 'gray',
  debug: 'green',
  silly: 'white',
};

addColors(customColors);

const logger = createLogger({
  format: format.combine(
    format(info => ({ ...info, level: info.level.toUpperCase() }))(),
    format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
    format.printf(({ timestamp, level, message }) => `[${level}] - ${timestamp} - ${message}`),
  ),
  transports: [
    new transports.DailyRotateFile({
      silent: process.env.LOG_SILENT === 'true',
      level: process.env.LOG_LEVEL || 'info',
      dirname: logDirectory,
      filename: 'app-%DATE%.log',
      datePattern: 'YYYY-MM-DD',
      zippedArchive: false,
      maxSize: '20m',
      maxFiles: '3d',
    }),
  ],
});

if (process.env.NODE_ENV !== 'production') {
  logger.add(
    new transports.Console({
      silent: process.env.LOG_SILENT === 'true',
      level: process.env.LOG_LEVEL || 'info',
      format: format.combine(
        format(info => ({ ...info, level: info.level.toUpperCase() }))(),
        format.colorize(),
        format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
        format.printf(({ timestamp, level, message }) => `[${level}] - ${timestamp} - ${message}`),
      ),
    }),
  );
}

export default logger;
