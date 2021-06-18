import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('role')
export default class Role {
  @PrimaryGeneratedColumn({ type: 'int', name: 'id' })
  id: number;

  @Column('varchar', { name: 'role_name', unique: true, length: 255 })
  roleName: string;

  @Column('tinyint', { name: 'is_system', default: 0, comment: '1: is a system, 0: not system' })
  isSystem: number;

  @Column('tinyint', { name: 'is_visible', default: 1 })
  isVisible: number;
}
