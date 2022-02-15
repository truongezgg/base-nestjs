module.exports = {
  type: 'mysql',
  host: process.env.MYSQL_HOST,
  port: process.env.MYSQL_PORT,
  username: process.env.MYSQL_USER,
  password: process.env.MYSQL_PASS,
  database: process.env.MYSQL_DBNAME,
  supportBigNumbers: false,
  synchronize: false, // Do not use synchronize
  logging: true,
  charset: 'utf8mb4',
  migrationsTableName: 'typeorm_migration',
  entities: ['dist/database/entities/**/*.js', 'dist/app/shared/**/entities/**/*.js'],
  migrations: ['dist/database/migrations/**/*.js', 'dist/app/shared/**/migrations/**/*.js'],
  subscribers: ['dist/database/subscribers/*.js', 'dist/app/shared/**/subscribers/**/*.js'],
  timezone: 'Z',
  cli: {
    entitiesDir: 'src/database/entities',
    migrationsDir: 'src/database/migrations',
    subscribersDir: 'src/database/subscribers',
  },
};
