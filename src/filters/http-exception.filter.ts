import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { NODE_ENV } from 'src/config';
import { ptLogger } from 'src/logger';

const logger = ptLogger.child({ file: __filename });

type CustomErrorResponse = {
  name: string;
  code: number;
  timestamp: string;
  path: string;
  message: string;
  stack?: string;
};
@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();
    const status = exception.getStatus();
    const message = exception.message || 'Internal server error';

    const errorResponse: CustomErrorResponse = {
      name: exception.name,
      message,
      code: status,
      timestamp: new Date().toLocaleDateString(),
      path: request.url,
    };

    if (NODE_ENV === 'development') {
      errorResponse.stack = exception.stack;
    }
    logger.error('Error occurred', { errorResponse });
    response.status(status).json(errorResponse);
  }
}
