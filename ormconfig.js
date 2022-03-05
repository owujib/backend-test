/* eslint-disable operator-linebreak */
const dbConfig = {
  development: {
    type: 'postgres',
    host: 'localhost',
    port: 5432,
    username: 'postgres',
    password: '1234',
    database: 'media',
    synchronize: false,
    logging: true,
    entities: ['src/entity/**/*.ts'],
    migrations: ['src/migration/**/*.ts'],
    subscribers: ['src/subscriber/**/*.ts'],
    cli: {
      entitiesDir: 'entity',
      migrationsDir: 'migration',
      subscribersDir: 'subscriber',
    },
  },

  production: {
    type: process.env.DB_TYPE,
    host: process.env.DB_HOST,
    port: Number(process.env.DB_PORT),
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    synchronize: false,
    logging: false,
    entities: ['src/entity/**/*.ts'],
    migrations: ['src/migration/**/*.ts'],
    subscribers: ['src/subscriber/**/*.ts'],
    cli: {
      entitiesDir: 'entity',
      migrationsDir: 'migration',
      subscribersDir: 'subscriber',
    },
  },
};

const ORMConfig =
  process.env.NODE_ENV === 'production'
    ? dbConfig.production
    : dbConfig.development;

console.log({
  entities: [`${__dirname}/entity/**/*.ts`],
  migrations: [`${__dirname}/migration/**/*.ts`],
  subscribers: [`${__dirname}/subscriber/**/*.ts`],
});

module.exports = ORMConfig;
