// app.js
const Hapi = require('hapi');
require('env2')('./.env');
const config = require('./config');

const server = new Hapi.Server();
// 配置服务器启动的 host 和端口
server.connection({
  host: config.host,
  port: config.port
})
const init = async () => {
  await server.start();
  console.log(`Server running at: ${server.info.uri}`);
}

init();