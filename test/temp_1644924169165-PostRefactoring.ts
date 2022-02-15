import { MigrationInterface, QueryRunner } from 'typeorm';

export class PostRefactoring1644924169165 implements MigrationInterface {
  name = 'PostRefactoring1644924169165';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`CREATE TABLE \`user\` (
            \`id\` bigint UNSIGNED NOT NULL AUTO_INCREMENT,
            \`email\` varchar(255) NOT NULL,
            \`password\` varchar(100) NOT NULL,
            \`status\` tinyint NOT NULL COMMENT '1: Active, 0: Inactive, 2: Not verify' DEFAULT '1',
            \`name\` varchar(255) NULL COMMENT 'Full name of the user.',
            \`role_id\` tinyint NOT NULL,
            \`refresh_token\` varchar(500) NULL,
            \`update_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
            \`created_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
            UNIQUE INDEX \`IDX_e12875dfb3b1d92d7d7c5377e2\` (\`email\`),
            PRIMARY KEY (\`id\`)
            ) ENGINE=InnoDB`);
    await queryRunner.query(
      `CREATE TABLE \`permission_group\` (\`id\` int NOT NULL AUTO_INCREMENT, \`name\` varchar(150) NOT NULL, UNIQUE INDEX \`IDX_032c209da98ae7c1a915b51c27\` (\`name\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
    );
    await queryRunner.query(
      `CREATE TABLE \`permission\` (\`id\` int UNSIGNED NOT NULL AUTO_INCREMENT, \`name\` varchar(255) NOT NULL, \`permission_group_id\` int NOT NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
    );
    await queryRunner.query(
      `CREATE TABLE \`role_permission\` (\`role_id\` int UNSIGNED NOT NULL, \`permission_id\` int UNSIGNED NOT NULL, PRIMARY KEY (\`role_id\`, \`permission_id\`)) ENGINE=InnoDB`,
    );
    await queryRunner.query(
      `CREATE TABLE \`role\` (\`id\` int UNSIGNED NOT NULL AUTO_INCREMENT, \`name\` varchar(255) NOT NULL, \`is_system\` tinyint NOT NULL COMMENT '1: is a system, 0: not system' DEFAULT '0', \`is_visible\` tinyint NOT NULL DEFAULT '1', UNIQUE INDEX \`IDX_ae4578dcaed5adff96595e6166\` (\`name\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
    );
    await queryRunner.query(
      `CREATE TABLE \`user_permission\` (\`user_id\` bigint UNSIGNED NOT NULL, \`permission_id\` int NOT NULL, PRIMARY KEY (\`user_id\`, \`permission_id\`)) ENGINE=InnoDB`,
    );
    await queryRunner.query(
      `CREATE TABLE \`config\` (\`key\` varchar(200) NOT NULL, \`name\` varchar(255) NOT NULL, \`value\` text NOT NULL, \`type\` varchar(50) NULL, \`metadata\` text NULL, \`order\` tinyint NULL, \`is_system\` tinyint NULL, \`created_by\` bigint UNSIGNED NULL, \`created_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), PRIMARY KEY (\`key\`)) ENGINE=InnoDB`,
    );
    await queryRunner.query(
      `CREATE TABLE \`language\` (\`code\` varchar(50) NOT NULL, \`name\` varchar(50) NOT NULL, \`status\` tinyint NOT NULL COMMENT '1: Active, 0: Deleted', \`vi_name\` varchar(50) NOT NULL, \`priority\` smallint NOT NULL, \`flag_icon\` varchar(500) NOT NULL, \`is_default\` tinyint NOT NULL, \`created_date\` datetime(6) NULL DEFAULT CURRENT_TIMESTAMP(6), PRIMARY KEY (\`code\`)) ENGINE=InnoDB`,
    );
    await queryRunner.query(
      `CREATE TABLE \`language_env\` (\`code\` varchar(50) NOT NULL, \`name\` varchar(500) NOT NULL, \`status\` tinyint NOT NULL DEFAULT '1', PRIMARY KEY (\`code\`)) ENGINE=InnoDB`,
    );
    await queryRunner.query(
      `CREATE TABLE \`language_key\` (\`key\` varchar(500) NOT NULL, \`default_value\` varchar(500) NOT NULL, \`environment\` varchar(50) NOT NULL, PRIMARY KEY (\`key\`, \`environment\`)) ENGINE=InnoDB`,
    );
    await queryRunner.query(
      `CREATE TABLE \`language_translation\` (\`key\` varchar(500) NOT NULL, \`code\` varchar(50) NOT NULL, \`environment\` varchar(50) NOT NULL, \`value\` varchar(500) NOT NULL, PRIMARY KEY (\`key\`, \`code\`, \`environment\`)) ENGINE=InnoDB`,
    );
    await queryRunner.query(
      `CREATE TABLE \`resource\` (\`id\` int UNSIGNED NOT NULL AUTO_INCREMENT, \`name\` varchar(250) NOT NULL, \`value\` text NULL, \`status\` tinyint NOT NULL DEFAULT '1', \`order\` smallint NOT NULL DEFAULT '0', \`type\` smallint NOT NULL COMMENT 'Các type đã chia sẽ được định nghĩa ở enum', \`created_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`created_by\` int UNSIGNED NOT NULL DEFAULT '1', PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
    );
    await queryRunner.query(
      `ALTER TABLE \`permission\` ADD CONSTRAINT \`FK_0248d0e8d737351620b03c3cfca\` FOREIGN KEY (\`permission_group_id\`) REFERENCES \`permission_group\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE \`role_permission\` ADD CONSTRAINT \`FK_3d0a7155eafd75ddba5a7013368\` FOREIGN KEY (\`role_id\`) REFERENCES \`role\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE \`role_permission\` ADD CONSTRAINT \`FK_e3a3ba47b7ca00fd23be4ebd6cf\` FOREIGN KEY (\`permission_id\`) REFERENCES \`permission\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE \`role_permission\` DROP FOREIGN KEY \`FK_e3a3ba47b7ca00fd23be4ebd6cf\``);
    await queryRunner.query(`ALTER TABLE \`role_permission\` DROP FOREIGN KEY \`FK_3d0a7155eafd75ddba5a7013368\``);
    await queryRunner.query(`ALTER TABLE \`permission\` DROP FOREIGN KEY \`FK_0248d0e8d737351620b03c3cfca\``);
    await queryRunner.query(`DROP TABLE \`resource\``);
    await queryRunner.query(`DROP TABLE \`language_translation\``);
    await queryRunner.query(`DROP TABLE \`language_key\``);
    await queryRunner.query(`DROP TABLE \`language_env\``);
    await queryRunner.query(`DROP TABLE \`language\``);
    await queryRunner.query(`DROP TABLE \`config\``);
    await queryRunner.query(`DROP TABLE \`user_permission\``);
    await queryRunner.query(`DROP INDEX \`IDX_ae4578dcaed5adff96595e6166\` ON \`role\``);
    await queryRunner.query(`DROP TABLE \`role\``);
    await queryRunner.query(`DROP TABLE \`role_permission\``);
    await queryRunner.query(`DROP TABLE \`permission\``);
    await queryRunner.query(`DROP INDEX \`IDX_032c209da98ae7c1a915b51c27\` ON \`permission_group\``);
    await queryRunner.query(`DROP TABLE \`permission_group\``);
    await queryRunner.query(`DROP INDEX \`IDX_e12875dfb3b1d92d7d7c5377e2\` ON \`user\``);
    await queryRunner.query(`DROP TABLE \`user\``);
  }
}
