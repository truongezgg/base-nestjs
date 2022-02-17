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
  entities: [
    'dist/src/database/entities/**/*.js',
    'dist/src/app/shared/**/entities/**/*.js',
    'dist/libs/**/entities/**/*.js',
  ],
  migrations: [
    'dist/src/database/migrations/**/*.js',
    'dist/src/app/shared/**/migrations/**/*.js',
    'dist/libs/**/migrations/**/*.js',
  ],
  subscribers: [
    'dist/src/database/subscribers/*.js',
    'dist/src/app/shared/**/subscribers/**/*.js',
    'dist/libs/**/subscribers/**/*.js',
  ],
  timezone: 'Z',
  cli: {
    entitiesDir: 'src/database/entities',
    migrationsDir: 'src/database/migrations',
    subscribersDir: 'src/database/subscribers',
  },
};
