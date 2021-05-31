import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import Permission from './Permission';

@Entity('permission_group')
export default class PermissionGroup {
  @PrimaryGeneratedColumn({ type: 'int', name: 'id' })
  id: number;

  @Column('varchar', { name: 'name', unique: true, length: 150 })
  name: string;

  @OneToMany((type) => Permission, (permission) => permission.permissionGroup)
  permissions: Permission[];
}
