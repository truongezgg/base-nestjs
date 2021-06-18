import { validate } from '$helpers/validate';
import { ErrorCode, Permissions } from '$types/enums';
import { Body, Controller, Get, Param, ParseIntPipe, Post, Put } from '@nestjs/common';
import { Request, Response } from 'express';
import { addRoleSchema, updateRolePermissionsSchema, updateRoleSchema } from './authorization.schema';
import { AuthorizationService } from './authorization.service';
import { RequirePermissions } from './permissions.decorator';

@Controller('authorization')
export class AuthorizationController {
  constructor(private authorizationService: AuthorizationService) {}

  @Get('/permission')
  @RequirePermissions(Permissions.PERMISSION_MANAGEMENT)
  async getListPermissions() {
    const permissions = await this.authorizationService.getListPermissions();
    return permissions;
  }

  @Get('/role')
  @RequirePermissions(Permissions.PERMISSION_MANAGEMENT)
  async getListRoles() {
    const roles = await this.authorizationService.getListRole();
    return roles;
  }

  @Post('/role')
  @RequirePermissions(Permissions.PERMISSION_MANAGEMENT)
  async addRole(@Body() body) {
    validate(addRoleSchema, body);
    await this.authorizationService.addRole(body.roleName);
    return;
  }

  @Put('/role/:roleId')
  @RequirePermissions(Permissions.PERMISSION_MANAGEMENT)
  async updateRole(@Body() body, @Param('roleId', ParseIntPipe) roleId: number) {
    validate(updateRoleSchema, body);
    await this.authorizationService.updateRole(roleId, body.roleName);
    return;
  }

  @Put('/hidden-role/:roleId')
  @RequirePermissions(Permissions.PERMISSION_MANAGEMENT)
  async hiddenRole(@Param('roleId', ParseIntPipe) roleId: number) {
    await this.authorizationService.hiddenRole(roleId);
    return;
  }

  @Put('/rolePermission/:roleId')
  @RequirePermissions(Permissions.PERMISSION_MANAGEMENT)
  async updateRolePermissions(@Body() body, @Param('roleId', ParseIntPipe) roleId: number) {
    const { permissions, changeUserPermission } = body;
    validate(updateRolePermissionsSchema, body);
    await this.authorizationService.updateRolePermissions(roleId, permissions, changeUserPermission);
    return;
  }

  @Get('/rolePermission/:roleId')
  @RequirePermissions(Permissions.PERMISSION_MANAGEMENT)
  async getRolePermissions(@Param('roleId', ParseIntPipe) roleId: number) {
    const permissions = await this.authorizationService.getRolePermissions(roleId);
    return permissions;
  }

  // User
  @Get('/user/:userId')
  @RequirePermissions(Permissions.PERMISSION_MANAGEMENT)
  async getUserPermissions(@Param('userId', ParseIntPipe) userId: number) {
    const permissions = await this.authorizationService.getUserPermissionsAndGroup(userId);
    return permissions;
  }

  @Put('/user/:userId')
  @RequirePermissions(Permissions.PERMISSION_MANAGEMENT)
  async updateUserPermissions(@Body() body, @Param('userId', ParseIntPipe) userId: number) {
    await this.authorizationService.updateUserPermissions(userId, body.permissions);
    return;
  }
}
