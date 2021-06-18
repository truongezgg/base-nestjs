import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import PermissionGroup from './PermissionGroup';
@Entity('permission')
export default class Permission {
  @PrimaryGeneratedColumn({ name: 'id', type: 'int', unsigned: true })
  id: number;

  @Column({ name: 'name', type: 'varchar', length: 255 })
  name: string;

  @Column({ name: 'permission_group_id', type: 'int' })
  permissionGroupId: number;

  @ManyToOne(() => PermissionGroup, (permissionGroup) => permissionGroup.permissions)
  permissionGroup: PermissionGroup;
}
