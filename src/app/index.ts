/* eslint-disable no-console */
import Express from 'express';
// import 'reflect-metadata';
import cors from 'cors';
import 'dotenv/config';
import { createConnection, ConnectionOptions } from 'typeorm';
import path from 'path';

/** ---- file imports ---- */
import GlobalErrorHandler from '../helpers/GlobalErrorHandler';
import WebRoutes from '../routes/web';
import ApiRoutes from '../routes/api';

const dbConfig = require('../ormconfig');

class Kernel {
  /**
   * @description app initializer
   */
  static express() {
    const app = Express();

    app.use(Express.json());
    app.use(Express.urlencoded({ extended: true }));
    app.use(cors());
    app.set('view engine', 'ejs');
    app.set('views', path.join(__dirname, '../views'));
    app.use(Express.static(path.join(__dirname, '../public')));

    return app;
  }

  /**
   * @description server database initializaer
   */
  static database() {
    const connection: ConnectionOptions = dbConfig;

    return createConnection(connection).then(async (conn) => {
      await conn.runMigrations();
      console.log('database connection is successful');
    }).catch((err) => console.log('DATABASE CONNECTION ERROR: ', err));
  }

  /**
   * @description server initializer function
   */
  public server() {
    const Server = Kernel.express();

    /** connect to database */
    Kernel.database();

    Server.use('/api', ApiRoutes);
    Server.use('/', WebRoutes);
    Server.use(GlobalErrorHandler);

    return {
      server: Server,
      appUrl: process.env.APP_URL,
      appName: process.env.APP_NAME,
      port: process.env.PORT,
    };
  }
}

export default new Kernel();
