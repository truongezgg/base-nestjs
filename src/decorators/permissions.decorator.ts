import { Permission, Role } from '$types/enums';
import { SetMetadata } from '@nestjs/common';

export const PERMISSIONS_KEY = 'permissions';
/**
 * https://docs.nestjs.com/security/authorization#claims-based-authorization
 * @param permissions
 * @returns
 */
export const RequirePermissions = (...permissions: Permission[]) => SetMetadata(PERMISSIONS_KEY, permissions);
