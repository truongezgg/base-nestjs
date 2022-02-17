import { Permissions } from '$types/enums';
import { Column, Entity, ManyToOne, PrimaryColumn } from 'typeorm';

@Entity('user_permission')
export default class UserPermission {
  @PrimaryColumn({ name: 'user_id', type: 'bigint', unsigned: true })
  userId: number;

  @PrimaryColumn({ name: 'permission_id', type: 'int' })
  permissionId: Permissions;
}
