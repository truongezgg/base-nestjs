import config from '$config';
import { CustomHttpException } from '$helpers/exception';
import { ErrorCode } from '$types/enums';
import { HttpStatus, Injectable, NestMiddleware } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Request, Response, NextFunction } from 'express';

@Injectable()
export class AuthenticationMiddleware implements NestMiddleware {
  constructor(private jwtService: JwtService) {}

  use(req: Request, res: Response, next: NextFunction) {
    const bearer = req.header('Authorization') || '';
    const token = bearer.replace('Bearer ', '');

    if (!bearer) {
      throw new CustomHttpException({ errorCode: ErrorCode.Token_Not_Exist });
    }

    try {
      const secret = config.authentication.accessTokenSecret;

      const { iat, exp, ...payload } = this.jwtService.verify(token, { secret });

      req.payload = payload;
    } catch (error) {
      throw new CustomHttpException({
        errorCode: ErrorCode.Access_Token_Invalid,
        status: HttpStatus.UNAUTHORIZED,
        devMessage: 'The token expired',
      });
    }

    next();
  }
}
