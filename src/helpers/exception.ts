import { ErrorCode } from '$types/enums';
import { HttpException, HttpStatus } from '@nestjs/common';

export class Exception extends HttpException {
  /**
   *
   * @example
   *
   *   throw Exception("Unknown_Error")
   *
   *   throw Exception("Unknown_Error", "This is error description")
   *
   *   throw Exception("Unknown_Error", "This is error description", HttpStatus.BAD_REQUEST)
   *
   *   throw Exception("Unknown_Error", "This is error description", HttpStatus.BAD_REQUEST, { isSystem: true })
   */
  constructor(errorCode: ErrorCode, error?: string | HttpStatus | any, statusCode?: HttpStatus, payload?: any) {
    const errorObject = { errorCode };

    if (error) errorObject['error'] = error;
    if (statusCode) errorObject['statusCode'] = statusCode;
    if (payload) errorObject['payload'] = payload;

    super(errorObject, statusCode || HttpStatus.BAD_REQUEST);
  }
}

export class Forbidden extends HttpException {
  /**
   *
   * @example
   *
   *    // Common forbidden error
   *    throw Forbidden()
   *
   *    // Forbidden with description message
   *    throw Forbidden("This is error description")
   *
   *    // Forbidden with description message & payload data
   *    throw Forbidden("This is error description", { payload: "This is payload" })
   */
  constructor(error?: string | HttpStatus | any, payload?: any) {
    const errorObject = { errorCode: ErrorCode.Forbidden_Resource, statusCode: HttpStatus.FORBIDDEN };

    if (error) errorObject['error'] = error;
    if (payload) errorObject['payload'] = payload;

    super(errorObject, errorObject.statusCode);
  }
}

export class Unauthorized extends HttpException {
  /**
   *
   * @example
   *
   *    // Common forbidden error
   *    throw Unauthorized()
   *
   *    // Unauthorized with description message
   *    throw Unauthorized("This is error description")
   *
   *    // Unauthorized with description message & payload data
   *    throw Unauthorized("This is error description", { payload: "This is payload" })
   */
  constructor(error?: string | HttpStatus | any, payload?: any) {
    const errorObject = { errorCode: ErrorCode.Unauthorized, statusCode: HttpStatus.UNAUTHORIZED };

    if (error) errorObject['error'] = error;
    if (payload) errorObject['payload'] = payload;

    super(errorObject, errorObject.statusCode);
  }
}
