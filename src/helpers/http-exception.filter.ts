import { ErrorCode } from '$types/enums';
import { ExceptionFilter, Catch, ArgumentsHost, HttpException, HttpStatus } from '@nestjs/common';
import { Request, Response } from 'express';

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const context = host.switchToHttp();
    const response = context.getResponse<Response>();
    const request = context.getRequest<Request>();

    console.log(exception);

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
    if (data?.devMessage) errorObj['devMessage'] = data['devMessage'];
    if (data?.payload) errorObj['payload'] = data['payload'];
  }

  // TODO: Replace with real text
  if (!errorObj?.message) errorObj['message'] = errorObj.errorCode;

  return errorObj;
}
