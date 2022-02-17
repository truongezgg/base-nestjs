import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateTableResource1645019976707 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE \`resource\` (
          \`id\` int UNSIGNED NOT NULL AUTO_INCREMENT,
          \`name\` varchar(250) NOT NULL,
          \`value\` varchar(250) NULL,
          \`status\` tinyint NOT NULL DEFAULT '1',
          \`order\` smallint NOT NULL DEFAULT '0',
          \`type\` smallint NOT NULL,
          \`created_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
          \`created_by\` int UNSIGNED NOT NULL DEFAULT '1',
          PRIMARY KEY (\`id\`)
        ) ENGINE=InnoDB`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE \`resource\``);
  }
}
