import { Column, Entity } from 'typeorm';

@Entity('language_env')
export default class LanguageEnv {
  @Column('varchar', { primary: true, name: 'code', length: 50 })
  code: string;

  @Column('varchar', { name: 'name', length: 500 })
  name: string;

  @Column('tinyint', { name: 'status', default: 1 })
  status: number;
}
