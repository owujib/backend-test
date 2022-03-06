const { ConnectionManager } = require('typeorm');

const connectionManager = new ConnectionManager();
const connect = connectionManager.create({
  type: 'postgres',
  host: '0.0.0.0',
  port: 5422,
  username: 'postgres',
  password: 'postgres',
  database: 'mediatest',
  synchronize: true,
  logging: false,
  entities: ['build/src/entity/**/*.ts'],
  migrations: ['build/src/migration/**/*.ts'],
  subscribers: ['build/src/subscriber/**/*.ts'],
  cli: {
    entitiesDir: 'build/src/entity',
    migrationsDir: 'build/src/migration',
    subscribersDir: 'build/src/subscriber',
  },
});
exports.openDbConn = async () => {
  try {
    await connect.connect();
  } catch (error) {
    console.log(error);
  }
};

exports.closeDbConn = async () => {
  try {
    await connect.close();
  } catch (error) {
    console.log(error);
  }
};
