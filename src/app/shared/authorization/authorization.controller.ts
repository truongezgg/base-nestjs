import { CustomParseIntPipe } from '$core/pipes/validation.pipe';
import { validate } from '$helpers/validate';
import { ErrorCode, Permissions } from '$types/enums';
import { Body, Controller, Get, Param, Post, Put } from '@nestjs/common';
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
    return await this.authorizationService.addRole(body.name);
  }

  @Put('/role/:roleId')
  @RequirePermissions(Permissions.PERMISSION_MANAGEMENT)
  async updateRole(@Body() body, @Param('roleId', CustomParseIntPipe) roleId: number) {
    validate(updateRoleSchema, body);
    return await this.authorizationService.updateRole(roleId, body.name);
  }

  @Put('/hidden-role/:roleId')
  @RequirePermissions(Permissions.PERMISSION_MANAGEMENT)
  async hiddenRole(@Param('roleId', CustomParseIntPipe) roleId: number) {
    return await this.authorizationService.hiddenRole(roleId);
  }

  @Put('/rolePermission/:roleId')
  @RequirePermissions(Permissions.PERMISSION_MANAGEMENT)
  async updateRolePermissions(@Body() body, @Param('roleId', CustomParseIntPipe) roleId: number) {
    const { permissions, changeUserPermission } = body;
    validate(updateRolePermissionsSchema, body);
    await this.authorizationService.updateRolePermissions(roleId, permissions, changeUserPermission);
    return;
  }

  @Get('/rolePermission/:roleId')
  @RequirePermissions(Permissions.PERMISSION_MANAGEMENT)
  async getRolePermissions(@Param('roleId', CustomParseIntPipe) roleId: number) {
    const permissions = await this.authorizationService.getRolePermissions(roleId);
    return permissions;
  }

  @Get('/user/:userId')
  @RequirePermissions(Permissions.PERMISSION_MANAGEMENT)
  async getUserPermissions(@Param('userId', CustomParseIntPipe) userId: number) {
    const permissions = await this.authorizationService.getUserPermissionsAndGroup(userId);
    return permissions;
  }

  @Put('/user/:userId')
  @RequirePermissions(Permissions.PERMISSION_MANAGEMENT)
  async updateUserPermissions(@Body() body, @Param('userId', CustomParseIntPipe) userId: number) {
    await this.authorizationService.updateUserPermissions(userId, body.permissions);
    return;
  }
}
