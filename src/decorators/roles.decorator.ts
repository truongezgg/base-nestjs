import { Role } from '$types/enums';
import { SetMetadata } from '@nestjs/common';

export const ROLES_KEY = 'roles';
/**
 * https://docs.nestjs.com/security/authorization#basic-rbac-implementation
 * @param roles
 * @returns
 */
export const Roles = (...roles: Role[]) => SetMetadata(ROLES_KEY, roles);
