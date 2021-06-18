import User from '$database/entities/User';
import { Exception } from '$helpers/exception';
import { CommonStatus, ErrorCode, Permissions } from '$types/enums';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Connection, In, Not, Repository } from 'typeorm';
import Permission from './entities/Permission';
import PermissionGroup from './entities/PermissionGroup';
import Role from './entities/Role';
import RolePermission from './entities/RolePermission';
import UserPermission from './entities/UserPermission';

@Injectable()
export class AuthorizationService {
  constructor(
    private readonly connection: Connection,
    @InjectRepository(Permission)
    private readonly permissionRepository: Repository<Permission>,
    @InjectRepository(Role)
    private readonly roleRepository: Repository<Role>,
    @InjectRepository(RolePermission)
    private readonly rolePermissionRepository: Repository<RolePermission>,
    @InjectRepository(UserPermission)
    private readonly userPermissionRepository: Repository<UserPermission>,
  ) {}

  async getListPermissions() {
    return await this.permissionRepository.find();
  }

  async getListRole() {
    return await this.roleRepository.find({ isVisible: CommonStatus.ACTIVE });
  }

  async addRole(roleName: string) {
    return await this.roleRepository.save({ roleName });
  }

  async updateRole(roleId: number, roleName: string) {
    return await this.roleRepository.update(roleId, { roleName });
  }

  async hiddenRole(roleId: number) {
    return await this.roleRepository.update(roleId, { isVisible: CommonStatus.INACTIVE });
  }

  async getPermissionByGroup(permissions: Array<number>) {
    const getListPermissions = await this.rolePermissionRepository
      .createQueryBuilder('permission')
      .select([
        'permission.id id',
        'permission.name name',
        'permission.groupId groupId',
        'permissionGroup.name groupName',
      ])
      .innerJoin(PermissionGroup, 'permissionGroup', 'permission.groupId = permissionGroup.id')
      .getRawMany();
    const listPermissionAdvance = getListPermissions.map((item) => {
      item.hasPermission = permissions.includes(item.id) ? 1 : 0;
      return item;
    });
    return this.convertToObject(listPermissionAdvance, 'groupName');
  }

  async getRolePermissions(roleId: number) {
    const role = await this.roleRepository.findOne(roleId);
    if (!role) throw new Exception(ErrorCode.Not_Found);

    const getRolePermissions = await this.rolePermissionRepository.find({ roleId });
    const rolePermissions: Array<number> = getRolePermissions.map((item) => item.permissionId);
    return this.getPermissionByGroup(rolePermissions);
  }

  async updateRolePermissions(roleId: number, permissions: Array<number>, changeUserPermission: 0 | 1) {
    await this.connection.transaction(async (transaction) => {
      const RolePermissionRepository = transaction.getRepository(RolePermission);
      const roleRepository = transaction.getRepository(Role);
      const userPermissionRepository = transaction.getRepository(UserPermission);
      const userRepository = transaction.getRepository(User);

      const role = await roleRepository.findOne(roleId);
      if (!role) throw new Exception(ErrorCode.Not_Found);

      await RolePermissionRepository.delete({ roleId: roleId, permissionId: Not(In([...permissions, -1])) });
      const dataUpdateRolePermissions = permissions.map((item) => {
        return { roleId, permissionId: item };
      });
      await RolePermissionRepository.save(dataUpdateRolePermissions);

      if (changeUserPermission) {
        const users = await userRepository.find({ where: { roleId }, select: ['id', 'roleId'] });
        const userIds = users.map((item) => item.id);

        await userPermissionRepository.delete({
          userId: In([...userIds, -1]),
          permissionId: Not(In([...permissions, -1])),
        });

        const dataUserPermission = users.reduce((acc, cur) => {
          const userPermissions = permissions.map((item) => ({ userId: cur.id, permissionId: item }));
          acc.push(...userPermissions);
          return acc;
        }, []);

        await userPermissionRepository.save(dataUserPermission);
      }
    });
    return;
  }

  async getUserPermissionsAndGroup(userId: number) {
    const userPermission = await this.userPermissionRepository.find({ userId });
    const permissions = userPermission.map((permission) => permission.permissionId);
    return this.getPermissionByGroup(permissions);
  }

  async getUserPermissions(userId: number, userPermissionRepository?: Repository<UserPermission>) {
    userPermissionRepository = userPermissionRepository ?? this.userPermissionRepository;

    const userPermission = await userPermissionRepository.find({ userId });
    const permissionIds = userPermission.map((item) => item.permissionId);

    return permissionIds;
  }

  async updateUserPermissions(userId: number, permissions: Permissions[]) {
    await this.connection.transaction(async (transaction) => {
      const userRepository = transaction.getRepository(UserPermission);
      await userRepository.delete({ userId, permissionId: Not(In([...permissions, -1])) });
      const data = permissions.map((permissionId) => ({ userId, permissionId }));
      await userRepository.save(data);
    });
    return;
  }

  async getRolePermissionIds(roleId: number): Promise<number[]> {
    const role = await this.roleRepository.findOne({ id: roleId });
    if (!role) throw new Exception(ErrorCode.Not_Found);
    const rolePermissions = await this.rolePermissionRepository.find({ roleId });
    const permissions: Array<number> = rolePermissions.map((item) => item.permissionId);
    return permissions;
  }

  convertToObject(data: Array<Object>, key: string): { [key: string]: Array<any> } {
    const result = {};
    for (let i = 0; i < data.length; i++) {
      const element = data[i];
      const keyEl = element[key];
      if (!result[keyEl]) {
        result[keyEl] = [];
      }
      delete element[key];
      result[keyEl].push(element);
    }
    return result;
  }
}
