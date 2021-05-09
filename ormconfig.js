module.exports = {
  type: 'mysql',
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  username: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME,
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
  }
};
