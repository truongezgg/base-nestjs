import { Column, CreateDateColumn, Entity, PrimaryColumn } from 'typeorm';

@Entity('config')
export default class Config {
  @PrimaryColumn({ type: 'varchar', name: 'key', length: 200 })
  key: string;

  @Column({ type: 'varchar', name: 'name', length: 255 })
  name: string;

  @Column('text', { name: 'value' })
  value: string;

  @Column('varchar', { name: 'type', nullable: true, length: 50 })
  type: string | null;

  @Column('text', { name: 'metadata', nullable: true })
  metadata: string | null;

  @Column('tinyint', { name: 'order', nullable: true })
  order: number | null;

  @Column('tinyint', { name: 'is_system', nullable: true })
  isSystem: number | null;

  @Column('bigint', { name: 'created_by', nullable: true, unsigned: true })
  createdBy: number | null;

  @CreateDateColumn({ name: 'created_at', type: 'datetime' })
  createdAt: string | Date;
}
