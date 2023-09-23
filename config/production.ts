import path from 'path';
import { basePath } from './default';

export default {
  logger: {
    filename:
      process.env.LOG_FILE_NAME ||
      path.join(basePath, 'logs', 'production.log'),
  },
};
