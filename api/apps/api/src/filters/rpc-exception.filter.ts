import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { RpcException } from '@nestjs/microservices';
import { Response } from 'express';

@Catch(RpcException)
export class RpcExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(RpcExceptionFilter.name);

  catch(exception: RpcException, host: ArgumentsHost) {
    const error: any = exception.getError();
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    const status = error?.statusCode || HttpStatus.INTERNAL_SERVER_ERROR;
    const message =
      error?.message && status !== HttpStatus.INTERNAL_SERVER_ERROR
        ? error.message
        : 'Something went wrong';

    if (status === HttpStatus.INTERNAL_SERVER_ERROR) {
      this.logger.error(`RPC Error`, exception.stack);
    }

    response.status(error?.statusCode).json({
      statusCode: status,
      message,
    });
  }
}
