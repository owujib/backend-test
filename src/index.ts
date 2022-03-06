/* eslint-disable no-console */
// import Server from './app';
const { default: Server } = require('./app');

Server.listen(process.env.PORT || 5000, () => {
  console.info(`${process.env.APP_NAME} is running on  ${process.env.APP_URL} ${process.env.PORT} `);
});

module.exports = Server;
