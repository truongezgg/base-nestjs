import { hash } from 'bcrypt';
import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateTableUser1644924398777 implements MigrationInterface {
  emailIDX = 'IDX_email_e12875dfb3b1d92d7d7c5377e2';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`CREATE TABLE IF NOT EXISTS \`user\` (
            \`id\` bigint UNSIGNED AUTO_INCREMENT,
            \`email\` varchar(255) NOT NULL,
            \`password\` varchar(100) NOT NULL,
            \`status\` tinyint NOT NULL COMMENT '1: Active, 0: Inactive' DEFAULT '1',
            \`name\` varchar(255) NULL COMMENT "User's full name",
            \`role_id\` tinyint NOT NULL,
            \`refresh_token\` varchar(500) NULL,
            \`update_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
            \`created_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
            UNIQUE INDEX \`${this.emailIDX}\` (\`email\`),
            PRIMARY KEY (\`id\`)
            ) ENGINE=InnoDB`);

    await this.createSuperAdmin(queryRunner);
  }

  private async createSuperAdmin(queryRunner: QueryRunner) {
    const hashedPassword = await hash(process.env.SUPER_ADMIN_PASSWORD, Number(process.env.BCRYPT_HASH_ROUNDS));

    const isExist = await queryRunner.query(
      `SELECT COUNT(1) as total FROM \`${process.env.MYSQL_DBNAME}\`.\`user\` WHERE \`email\`=?`,
      [process.env.SUPER_ADMIN_EMAIL],
    );

    if (!Number(isExist.total)) {
      await queryRunner.query(`INSERT INTO
      \`${process.env.MYSQL_DBNAME}\`.\`user\` (\`email\`,
      \`password\`,
      \`status\`,
      \`name\`,
      \`role_id\`,
      \`refresh_token\`)
      VALUES('${process.env.SUPER_ADMIN_EMAIL}','${hashedPassword}',1,'Super Admin',1,NULL)`);
    }
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP INDEX \`${this.emailIDX}\` ON \`user\``);
    await queryRunner.query(`DROP TABLE \`user\``);
  }
}
