/* eslint-disable no-console */
import Kernel from './app';

const {
  server, appName, appUrl, port,
} = Kernel.server();

server.listen(port || 5000, () => {
  console.info(`${appName} is running on  ${appUrl} ${port} `);
});
