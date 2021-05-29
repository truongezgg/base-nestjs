import { PERMISSIONS_KEY } from '$decorators/permissions.decorator';
import { IS_PUBLIC_KEY } from '$decorators/public.decorator';
import { Exception } from '$helpers/exception';
import { ErrorCode, Permission } from '$types/enums';
import { Injectable, CanActivate, ExecutionContext, HttpStatus } from '@nestjs/common';
import { Reflector } from '@nestjs/core';

@Injectable()
export class PermissionsGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    if (isPublic) return true;

    const permissions = this.reflector.getAllAndOverride<Permission[]>(PERMISSIONS_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    if (!permissions) return true;

    const { user } = context.switchToHttp().getRequest();

    const hasPermission = user?.permissions?.some((permission: Permission) => permissions.includes(permission));

    if (!hasPermission) {
      throw new Exception(
        ErrorCode.Forbidden_Resource,
        'You do not have permission to access this API!',
        HttpStatus.FORBIDDEN,
      );
    }

    return true;
  }
}
