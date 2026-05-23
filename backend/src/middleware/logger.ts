import winston from 'winston';
import morgan from 'morgan';
import { env } from '../config/env';

export const logger = winston.createLogger({
  level: env.NODE_ENV === 'production' ? 'info' : 'debug',
  format: winston.format.combine(
    winston.format.timestamp(),
    env.NODE_ENV === 'production' ? winston.format.json() : winston.format.prettyPrint()
  ),
  transports: [
    new winston.transports.Console()
  ]
});

// Morgan middleware using Winston
export const httpLogger = morgan(
  env.NODE_ENV === 'production' ? 'combined' : 'dev',
  {
    stream: {
      write: (message) => logger.info(message.trim())
    }
  }
);
