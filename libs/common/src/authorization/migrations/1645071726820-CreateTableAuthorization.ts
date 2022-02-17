import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateTableAuthorization1645071726820 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE \`permission_group\` (
                \`id\` int NOT NULL AUTO_INCREMENT,
                \`name\` varchar(150) NOT NULL,
                UNIQUE INDEX \`IDX_032c209da98ae7c1a915b51c27\` (\`name\`),
                PRIMARY KEY (\`id\`)
            ) ENGINE=InnoDB`,
    );
    await queryRunner.query(
      `CREATE TABLE \`permission\` (
                \`id\` int UNSIGNED NOT NULL AUTO_INCREMENT,
                \`name\` varchar(255) NOT NULL,
                \`permission_group_id\` int NOT NULL,
                PRIMARY KEY (\`id\`)
            ) ENGINE=InnoDB`,
    );
    await queryRunner.query(
      `CREATE TABLE \`role_permission\` (
                \`role_id\` int UNSIGNED NOT NULL,
                \`permission_id\` int UNSIGNED NOT NULL,
                PRIMARY KEY (\`role_id\`, \`permission_id\`)
            ) ENGINE=InnoDB`,
    );
    await queryRunner.query(
      `CREATE TABLE \`role\` (
              \`id\` int UNSIGNED NOT NULL AUTO_INCREMENT,
              \`name\` varchar(255) NOT NULL,
              \`is_system\` tinyint NOT NULL COMMENT '1: is a system, 0: not system' DEFAULT '0',
              \`is_visible\` tinyint NOT NULL DEFAULT '1',
              UNIQUE INDEX \`IDX_ae4578dcaed5adff96595e6166\` (\`name\`),
              PRIMARY KEY (\`id\`)
            ) ENGINE=InnoDB`,
    );
    await queryRunner.query(
      `CREATE TABLE \`user_permission\` (
                \`user_id\` bigint UNSIGNED NOT NULL,
                \`permission_id\` int NOT NULL,
                PRIMARY KEY (\`user_id\`, \`permission_id\`)
            ) ENGINE=InnoDB`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE \`user_permission\``);
    await queryRunner.query(`DROP TABLE \`role\``);
    await queryRunner.query(`DROP TABLE \`role_permission\``);
    await queryRunner.query(`DROP TABLE \`permission\``);
    await queryRunner.query(`DROP TABLE \`permission_group\``);
  }
}
