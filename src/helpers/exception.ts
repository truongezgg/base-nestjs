import { ErrorCode } from '$types/enums';
import { HttpException, HttpStatus } from '@nestjs/common';

export class CustomExceptionFactory extends HttpException {
  constructor(errorCode: ErrorCode, error?: string | HttpStatus | any, statusCode?: HttpStatus, payload?: any) {
    const errorObject = { errorCode, statusCode: statusCode || HttpStatus.BAD_REQUEST };

    if (error) errorObject['error'] = error;
    if (payload) errorObject['payload'] = payload;

    super(errorObject, errorObject.statusCode);
  }
}

export class Exception extends CustomExceptionFactory {
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
    super(errorCode, error, statusCode, payload);
  }
}

export class Forbidden extends CustomExceptionFactory {
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
    super(ErrorCode.Forbidden_Resource, error, HttpStatus.FORBIDDEN, payload);
  }
}

export class Unauthorized extends CustomExceptionFactory {
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
    super(ErrorCode.Unauthorized, error, HttpStatus.UNAUTHORIZED, payload);
  }
}

export class UnprocessableEntity extends CustomExceptionFactory {
  /**
   *
   * @example
   *
   *    // Common forbidden error
   *    throw UnprocessableEntity()
   *
   *    // UnprocessableEntity with description message
   *    throw UnprocessableEntity("This is error description")
   *
   *    // UnprocessableEntity with description message & payload data
   *    throw UnprocessableEntity("This is error description", { payload: "This is payload" })
   */
  constructor(error?: string | HttpStatus | any, payload?: any) {
    super(ErrorCode.Invalid_Input, error, HttpStatus.UNPROCESSABLE_ENTITY, payload);
  }
}
