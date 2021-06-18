import { PERMISSIONS_KEY } from '$app/shared/authorization/permissions.decorator';
import { IS_PUBLIC_KEY } from '$core/decorators/public.decorator';
import { Exception } from '$helpers/exception';
import { ErrorCode, Permissions, UserType } from '$types/enums';
import { Injectable, CanActivate, ExecutionContext, HttpStatus } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { AuthorizationService } from './authorization.service';

@Injectable()
export class PermissionsGuard implements CanActivate {
  constructor(private reflector: Reflector, private authorizationService: AuthorizationService) {}

  canActivate(context: ExecutionContext): boolean {
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    if (isPublic) return true;

    const permissions = this.reflector.getAllAndOverride<Permissions[]>(PERMISSIONS_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    if (!permissions) return true;

    const { user } = context.switchToHttp().getRequest();

    if (user.userType !== UserType.ADMIN) {
      throw new Exception(
        ErrorCode.Forbidden_Resource,
        'You do not have permission to access this API!',
        HttpStatus.FORBIDDEN,
      );
    }

    // Get user permissions. Caching this API
    this.authorizationService
      .getUserPermissions(user.id)
      .then((userPermissions) => {
        const hasPermission = userPermissions.some((permission: Permissions) => permissions.includes(permission));

        if (!hasPermission) {
          throw new Exception(
            ErrorCode.Forbidden_Resource,
            'You do not have permission to access this API!',
            HttpStatus.FORBIDDEN,
          );
        }
      })
      .catch((error) => {
        throw error;
      })
      .finally(() => {
        return true;
      });
  }
}
