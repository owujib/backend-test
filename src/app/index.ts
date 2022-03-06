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
  server: Express.Application;

  constructor() {
    this.server = Express();
    this.express();
    this.database();
    this.Main();
  }

  /**
   * @description app initializer
   */
  private express() {
    this.server.use(Express.json());
    this.server.use(Express.urlencoded({ extended: true }));
    this.server.use(cors());
    this.server.set('view engine', 'ejs');
    this.server.set('views', path.join(__dirname, '../views'));
    this.server.use(Express.static(path.join(__dirname, '../public')));

    return this.server;
  }

  /**
   * @description server database initializaer
   */
  private database() {
    const connection: ConnectionOptions = dbConfig;

    return createConnection(connection).then(async (conn) => {
      await conn.runMigrations();
      console.log('database connection is successful');
    }).catch((err) => console.log('DATABASE CONNECTION ERROR: ', err));
  }

  /**
   * @description server initializer function
   */
  public Main() {
    this.server.use('/api', ApiRoutes);
    this.server.use('/', WebRoutes);
    this.server.use(GlobalErrorHandler);
  }
}

export default new Kernel().server;
