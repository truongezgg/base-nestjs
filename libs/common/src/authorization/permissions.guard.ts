import { IS_PUBLIC_KEY } from '$core/decorators/public.decorator';
import { Exception, Forbidden } from '$helpers/exception';
import { ErrorCode, Permissions, UserType } from '$types/enums';
import { IPayload } from '$types/interfaces';
import { Injectable, CanActivate, ExecutionContext, HttpStatus, ForbiddenException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { AuthorizationService } from './authorization.service';
import { PERMISSIONS_KEY } from './permissions.decorator';

@Injectable()
export class PermissionsGuard implements CanActivate {
  constructor(private reflector: Reflector, private authorizationService: AuthorizationService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
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

    const { user } = context.switchToHttp().getRequest<{ user: IPayload; [key: string]: any }>();

    if (user.userType !== UserType.ADMIN) {
      throw new Forbidden('Only admin can access this API, You have no privileges!');
    }

    // TODO: Cache this API
    // Get user permissions.
    const userPermissions = await this.authorizationService.getUserPermissions(user.id);

    if (!userPermissions.some((permission: Permissions) => permissions.includes(permission))) {
      throw new Forbidden("You don't have permission to access this API!");
    }

    return true;
  }
}
