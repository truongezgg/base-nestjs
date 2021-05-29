import { ErrorCode } from '$types/enums';
import { HttpException, HttpStatus } from '@nestjs/common';

interface IAnyObject {
  [key: string]: any;
}
interface IException {
  errorCode: string;
  message?: string;
  devMessage?: string | object;
  status?: HttpStatus;
  payload?: IAnyObject;
}

/**
 *
 * @example
 *
 *   throw Exception("Unknown_Error")
 *
 *   throw Exception("Unknown_Error", "This is devMessage")
 *
 *   throw Exception("Unknown_Error", "This is devMessage", HttpStatus.BAD_REQUEST)
 *
 *   throw Exception("Unknown_Error", "This is devMessage", HttpStatus.BAD_REQUEST, { isSystem: true })
 */
export class Exception extends HttpException {
  /**
   *
   * @example
   *
   *   throw Exception("Unknown_Error")
   *
   *   throw Exception("Unknown_Error", "This is devMessage")
   *
   *   throw Exception("Unknown_Error", "This is devMessage", HttpStatus.BAD_REQUEST)
   *
   *   throw Exception("Unknown_Error", "This is devMessage", HttpStatus.BAD_REQUEST, { isSystem: true })
   */
  constructor(errorCode: ErrorCode, devMessage?: string | HttpStatus | any, statusCode?: HttpStatus, payload?: any) {
    const errorObject = { errorCode };

    if (devMessage) errorObject['devMessage'] = devMessage;
    if (statusCode) errorObject['statusCode'] = statusCode;
    if (payload) errorObject['payload'] = payload;

    super(errorObject, statusCode || HttpStatus.BAD_REQUEST);
  }
}
