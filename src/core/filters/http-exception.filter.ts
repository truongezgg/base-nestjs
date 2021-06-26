import { ErrorCode } from '$types/enums';
import { ExceptionFilter, Catch, ArgumentsHost, HttpException, HttpStatus } from '@nestjs/common';
import { Request, Response } from 'express';
import { getLogger } from 'log4js';
const logger = getLogger('Exception');

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const context = host.switchToHttp();
    const response = context.getResponse<Response>();
    const request = context.getRequest<Request>();

    Object.assign(exception, {
      request: {
        method: request.method,
        url: request.url,
        body: request.body,
        ip: request.ip,
        authorization: request.headers?.authorization,
        user: request.user,
      },
    });
    logger.error(exception);

    const { statusCode, ...errorObject } = formatErrorObject(exception);

    response.status(statusCode).json(errorObject);
  }
}

export function formatErrorObject(exception: HttpException | any) {
  const errorObj = {
    success: false,
    statusCode: HttpStatus.BAD_REQUEST,
    errorCode: ErrorCode.Unknown_Error,
    message: null,
  };

  if (exception instanceof HttpException) {
    const data = exception.getResponse() as any;

    if (data?.errorCode) errorObj.errorCode = data?.errorCode;
    if (data?.statusCode) errorObj.statusCode = data?.statusCode;
    if (data?.message) errorObj.message = data.message;
    if (data?.error) errorObj['error'] = data['error'];
    if (data?.payload) errorObj['payload'] = data['payload'];
  }

  // TODO: Replace with real text
  if (!errorObj?.message) errorObj['message'] = errorObj.errorCode;

  return errorObj;
}
