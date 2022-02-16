import { Column, Entity } from 'typeorm';

@Entity('language_translation')
export default class LanguageTranslation {
  @Column('varchar', {
    primary: true,
    name: 'key',
    length: 500,
  })
  key: string;

  @Column('varchar', { primary: true, name: 'code', length: 50 })
  code: string;

  @Column('varchar', { primary: true, name: 'environment', length: 50 })
  environment: string;

  @Column('varchar', { name: 'value', length: 500 })
  value: string;
}
