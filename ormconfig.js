const path = require('path');

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
    entities: ['build/src/entity/**/*.ts'],
    migrations: ['build/src/migration/**/*.ts'],
    subscribers: ['build/src/subscriber/**/*.ts'],
    cli: {
      entitiesDir: 'entity',
      migrationsDir: 'migration',
      subscribersDir: 'subscriber',
    },
  },
  test: {
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

let ORMConfig;

if (process.env.NODE_ENV === 'production') {
  ORMConfig = dbConfig.production;
} else if (process.env.NODE_ENV === 'development') {
  ORMConfig = dbConfig.development;
} else {
  ORMConfig = dbConfig.test;
}

module.exports = ORMConfig;
