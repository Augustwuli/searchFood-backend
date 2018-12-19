// routes/codes.js
const Joi = require('joi');
const fs = require('fs')

const GROUP_NAME = 'codes';

module.exports = [
  {
    method: 'POST',
    path: `/${GROUP_NAME}/sign`,
    handler: (request, reply) => {
      const mobile = request.payload.phone;
      const publicPem = fs.readFileSync('./pem/public.pem', 'utf8');
      const result = {
        success: true,
        data: {
          code: '1694',
          publicPem
        }
      };
      reply(result);
    },
    config: {
      validate: {
        payload: {
          phone: Joi.string().required().description('获取手机号码'),
        }
      },
      tags: ['api', GROUP_NAME],
      description: '获取验证码',
      auth: false
    }
  }
]