import { Column, Entity, ManyToOne, JoinColumn } from 'typeorm';
import Role from './Role';

@Entity('role_permission')
export default class RolePermission {
  @Column('int', { primary: true, name: 'role_id' })
  roleId: number;

  @Column('int', { primary: true, name: 'permission_id' })
  permissionId: number;

  @JoinColumn({ name: 'role_id' })
  role: Role;
}
