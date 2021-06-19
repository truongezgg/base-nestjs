import { ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { AuthGuard } from '@nestjs/passport';
import { Unauthorized } from '$helpers/exception';
import { IS_PUBLIC_KEY } from '$core/decorators/public.decorator';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  constructor(private reflector: Reflector) {
    super();
  }

  canActivate(context: ExecutionContext) {
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    return isPublic ? true : super.canActivate(context);
  }

  /**
   * You can throw an exception based on either "info" or "err" arguments
   */
  handleRequest(err, user, info) {
    if (err) throw err;

    if (!user) {
      throw new Unauthorized('You have provided an invalid access token');
    }

    return user;
  }
}
