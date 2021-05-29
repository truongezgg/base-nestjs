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
  entities: ['dist/database/entities/**/*.js'],
  migrations: ['dist/database/migrations/**/*.js'],
  subscribers: ['dist/database/subscribers/**/*.js'],
  timezone: 'Z',
  cli: {
    entitiesDir: 'src/app/**/entities',
    migrationsDir: 'src/database/migrations',
    subscribersDir: 'src/database/subscribers',
  },
};
