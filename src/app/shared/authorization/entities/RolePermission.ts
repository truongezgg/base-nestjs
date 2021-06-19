import { Column, Entity, ManyToOne, JoinColumn, PrimaryColumn } from 'typeorm';
import Permission from './Permission';
import Role from './Role';

@Entity('role_permission')
export default class RolePermission {
  @PrimaryColumn({ name: 'role_id', type: 'int', unsigned: true })
  roleId: number;

  @PrimaryColumn({ name: 'permission_id', type: 'int', unsigned: true })
  permissionId: number;

  @ManyToOne(() => Role, (role) => role.rolePermissions)
  @JoinColumn({ name: 'role_id' })
  role: Role;

  @ManyToOne((type) => Permission)
  @JoinColumn({ name: 'permission_id' })
  permission: Permission;
}
