import winston, { format, transports } from 'winston';
import config from 'config';
import { ILoggerConfig } from './logger.interface';
import pkg from '../../package.json';

const { combine, timestamp, json, errors, prettyPrint, metadata } = format;
class Logger {
  public logger: winston.Logger;
  private readonly loggerConfig: ILoggerConfig;
  public loggerTransports: winston.transport[] = [];

  constructor() {
    this.loggerConfig = config.get('logger');

    if (this.loggerConfig.transports.includes('FILE')) {
      this.loggerTransports.push(
        new transports.File({ filename: this.loggerConfig.filename }),
      );
    }
    if (this.loggerConfig.transports.includes('CONSOLE')) {
      this.loggerTransports.push(new transports.Console());
    }

    this.logger = winston.createLogger({
      level: this.loggerConfig.level,
      defaultMeta: { service: pkg.name },
      transports: this.loggerTransports,
      format: combine(
        timestamp(),
        metadata(),
        errors({ stack: true }),
        this.loggerConfig.prettyPrint ? prettyPrint() : json(),
      ),
    });
  }
}

export const ptLogger = new Logger().logger;
