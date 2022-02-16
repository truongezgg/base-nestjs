import { Column, Entity, CreateDateColumn } from 'typeorm';

@Entity('language')
export default class Language {
  @Column('varchar', { primary: true, name: 'code', length: 50 })
  code: string;

  @Column('varchar', { name: 'name', length: 50 })
  name: string;

  @Column('tinyint', { name: 'status', comment: '1: Active, 0: Deleted' })
  status: number;

  @Column('varchar', { name: 'vi_name', length: 50 })
  viName: string;

  @Column('smallint', { name: 'priority' })
  priority: number;

  @Column('varchar', { name: 'flag_icon', length: 500 })
  flagIcon: string;

  @Column('tinyint', { name: 'is_default' })
  isDefault: number;

  @CreateDateColumn({ type: 'datetime', name: 'created_date', nullable: true })
  createdAt: string | null;
}
