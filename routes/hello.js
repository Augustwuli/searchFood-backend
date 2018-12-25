// routes/hello.js
const { jwtHeaderDefine } = require('../utils/router-header');

module.exports = [
  {
    method: 'GET',
    path: '/',
    handler: (request, reply) => {
      console.log(request.auth.credentials); // 控制台输出 { userId: 1}
      const result = {
        success: true,
        data: [
          {
            name: '名字',
            title: '标题'
          },
          {
            name: '名字',
            title: '标题'
          }
        ]
      }
      reply(result);
    },
    config: {
      tags: ['api', 'tests'],
      description: '测试hello-hapi',
      validate: {
        ...jwtHeaderDefine, // 增加需要 jwt auth 认证的接口 header 校验
      },
    },
  },
];