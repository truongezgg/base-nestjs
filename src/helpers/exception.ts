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
  constructor(errorCode: ErrorCode, devMessage?: string | any, status?: HttpStatus, payload?: any) {
    super({ errorCode, devMessage, status, payload }, status || HttpStatus.BAD_REQUEST);
  }
}
