import { Exception } from '$helpers/exception';
import { ErrorCode } from '$types/enums';
import { Injectable, CanActivate, ExecutionContext, HttpStatus } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Request } from 'express';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const roles = this.reflector.get<string[]>('roles', context.getHandler());

    if (!roles) return true;

    const req = context.switchToHttp().getRequest() as Request;
    const user = req.user;

    const hasPermission = user?.roles?.some((role) => roles.includes(role));

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
