import path from 'path';

export const basePath = path.join(__dirname, '..');
export const isDevEnv = process.env.NODE_ENV === 'development';
export default {
  basePath,
  db: {
    databaseUrl: process.env.DATABASE_URL,
  },
  logger: {
    level: process.env.LOG_LEVEL || 'info',
    filename:
      process.env.LOG_FILE_NAME || path.join(basePath, 'logs', 'default.log'),
    transports: process.env.LOG_TRANSPORT || 'CONSOLE',
    prettyPrint: process.env.LOG_PRETTY_PRINT === 'true',
  },
  app: {
    port: 3001,
  },
};
