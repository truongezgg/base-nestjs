import { CommonStatus } from '$types/enums';
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import RolePermission from './RolePermission';

@Entity('role')
export default class Role {
  @PrimaryGeneratedColumn({ type: 'int', name: 'id', unsigned: true })
  id: number;

  @Column('varchar', { name: 'name', unique: true, length: 255 })
  name: string;

  @Column('tinyint', { name: 'is_system', default: 0, comment: '1: is a system, 0: not system' })
  isSystem: number;

  @Column('tinyint', { name: 'is_visible', default: CommonStatus.ACTIVE })
  isVisible: number;

  @OneToMany((type) => RolePermission, (rolePermission) => rolePermission.role)
  rolePermissions: RolePermission[];
}
