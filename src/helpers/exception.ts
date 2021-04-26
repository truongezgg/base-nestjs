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
export class CustomHttpException extends HttpException {
  constructor(params: IException) {
    super(params, HttpStatus.BAD_REQUEST);
  }
}
