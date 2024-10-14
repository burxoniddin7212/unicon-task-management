import { Response } from 'express';
import {
  Catch,
  HttpException,
  ArgumentsHost,
  ExceptionFilter,
} from '@nestjs/common';

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: any, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const status = exception.getStatus();

    response.status(status).json({
      message: exception.getResponse().message,
      statusCode: status,
    });
  }
}
