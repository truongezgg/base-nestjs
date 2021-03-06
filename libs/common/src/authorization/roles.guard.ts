import { IS_PUBLIC_KEY } from '$core/decorators/public.decorator';
import { Exception, Forbidden } from '$helpers/exception';
import { ErrorCode, Role } from '$types/enums';
import { Injectable, CanActivate, ExecutionContext, HttpStatus } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ROLES_KEY } from './roles.decorator';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    if (isPublic) return true;

    const roles = this.reflector.getAllAndOverride<Role[]>(ROLES_KEY, [context.getHandler(), context.getClass()]);
    if (!roles) return true;

    const { user } = context.switchToHttp().getRequest();
    const hasPrivilege = user?.roles?.some((role: Role) => roles.includes(role));

    if (!hasPrivilege) {
      throw new Forbidden('You do not have privileges to access this API!');
    }

    return true;
  }
}
