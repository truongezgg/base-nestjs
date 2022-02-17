import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateTableLanguage1645026054346 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE \`language\` (
                \`code\` varchar(50) NOT NULL,
                \`name\` varchar(50) NOT NULL,
                \`status\` tinyint NOT NULL COMMENT '1: Active, 0: Deleted',
                \`vi_name\` varchar(50) NOT NULL,
                \`priority\` smallint NOT NULL,
                \`flag_icon\` varchar(500) NOT NULL,
                \`is_default\` tinyint NOT NULL,
                \`created_date\` datetime(6) NULL DEFAULT CURRENT_TIMESTAMP(6),
                PRIMARY KEY (\`code\`)
            ) ENGINE=InnoDB`,
    );

    await queryRunner.query(
      `CREATE TABLE \`language_env\` (
                \`code\` varchar(50) NOT NULL,
                \`name\` varchar(500) NOT NULL,
                \`status\` tinyint NOT NULL DEFAULT '1',
                PRIMARY KEY (\`code\`)
            ) ENGINE=InnoDB`,
    );

    await queryRunner.query(
      `CREATE TABLE \`language_key\` (
                \`key\` varchar(500) NOT NULL,
                \`default_value\` varchar(500) NOT NULL,
                \`environment\` varchar(50) NOT NULL,
                PRIMARY KEY (\`key\`, \`environment\`)
            ) ENGINE=InnoDB`,
    );

    await queryRunner.query(
      `CREATE TABLE \`language_translation\` (
                \`key\` varchar(500) NOT NULL,
                \`code\` varchar(50) NOT NULL,
                \`environment\` varchar(50) NOT NULL,
                \`value\` varchar(500) NOT NULL,
                PRIMARY KEY (\`key\`, \`code\`, \`environment\`)
            ) ENGINE=InnoDB`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE \`language_translation\``);

    await queryRunner.query(`DROP TABLE \`language_key\``);
    await queryRunner.query(`DROP TABLE \`language_env\``);
    await queryRunner.query(`DROP TABLE \`language\``);
  }
}
