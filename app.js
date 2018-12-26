// app.js
const Hapi = require('hapi');
const inert = require('inert');
require('env2')('./.env');
const config = require('./config');
const hello = require('./routes/hello');
const hapiAuthJWT2 = require('hapi-auth-jwt2');
const pluginHapiSwagger = require('./plugins/hapi-swagger');
const pluginHapiPagination = require('./plugins/hapi-pagination');
const pluginHapiAuthJWT2 = require('./plugins/hapi-auth-jwt2');
const order = require('./routes/order');
const notes = require('./routes/notes');
const users = require('./routes/users');
const codes = require('./routes/codes');
const imgs = require('./routes/imgs')

const server = new Hapi.Server();
// 配置服务器启动的 host 和端口
server.connection({
  host: config.host,
  port: config.port
})
const init = async () => {
  // await rsa.pem.savePem();
  await server.register([
    // 为系统使用 hapi-swagger
    ...pluginHapiSwagger,
    pluginHapiPagination,
    hapiAuthJWT2,
    inert,
  ]);
  pluginHapiAuthJWT2(server);
  
  server.route([
    ...hello,
    ...order,
    ...notes,
    ...users,
    ...codes,
    ...imgs,
  ])
  await server.start();
  console.log(`Server running at: ${server.info.uri}`);
}

init();