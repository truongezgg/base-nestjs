import { Column, Entity, ManyToOne, PrimaryColumn } from 'typeorm';
import User from './User';

@Entity('user_permission')
export default class UserPermission {
  @PrimaryColumn({ name: 'user_id', type: 'int', unsigned: true })
  userId: number;

  @PrimaryColumn({ name: 'permission_id', type: 'varchar', length: 255 })
  permissionId: string;

  @ManyToOne(() => User, (user) => user.userPermission)
  user: User;
}
