module.exports = {
  type: 'mysql',
  host: process.env.MYSQL_HOST,
  port: process.env.MYSQL_PORT,
  username: process.env.MYSQL_USER,
  password: process.env.MYSQL_PASS,
  database: process.env.MYSQL_NAME,
  supportBigNumbers: false,
  synchronize: true, // Alway use migration.
  logging: true,
  charset: 'utf8mb4',
  migrationsTableName: 'migration',
  entities: ['dist/database/entities/**/*.js', 'dist/app/shared/**/entities/**/*.js'],
  migrations: ['dist/database/migrations/**/*.js'],
  subscribers: ['dist/database/subscribers/**/*.js'],
  timezone: 'Z',
  cli: {
    entitiesDir: ['src/database/entities', 'src/app/shared/**/entities'],
    migrationsDir: 'src/database/migrations',
    subscribersDir: 'src/database/subscribers',
  },
};
