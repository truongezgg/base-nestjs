import { Column, Entity, PrimaryGeneratedColumn, CreateDateColumn } from 'typeorm';
@Entity('resource')
export default class Resource {
  @PrimaryGeneratedColumn({ name: 'id', type: 'int', unsigned: true })
  id?: number;

  @Column({ name: 'name', type: 'varchar', length: 250 })
  name: string;

  @Column({ name: 'value', type: 'varchar', length: 250, nullable: true })
  value: string;

  @Column({ name: 'status', type: 'tinyint', default: 1 })
  status?: number;

  @Column({ name: 'order', type: 'smallint', default: 0 })
  order?: number;

  @Column({ name: 'type', type: 'smallint', comment: 'Các type đã chia sẽ được định nghĩa ở enum' })
  type: number;

  @CreateDateColumn({ name: 'created_at', type: 'datetime' })
  createdAt?: number;

  @Column({ name: 'created_by', type: 'int', default: 1, unsigned: true })
  createdBy?: number;
}
