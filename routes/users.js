// routes/users.js
const JWT = require('jsonwebtoken');
const Joi = require('joi')
const crypto = require('crypto')
const fs = require('fs')
const models = require('../node_modules/.bin/models')

const GROUP_NAME = 'users';

module.exports = [
  {
    method: 'POST',
    path:`/${GROUP_NAME}/sign`,
    handler: async (request, reply) => {
      const { phone, name, password } = request.payload;
      const privateKey = fs.readFileSync('./pem/private.pem', 'utf8');
      let buffer2 = Buffer.from(password, 'base64')
      let decrypted = crypto.privateDecrypt(
        {
          key: privateKey,
          padding: crypto.constants.RSA_PKCS1_PADDING
        },
        buffer2
      )
      //sha加密
      let sha1 = crypto.createHash('sha1');
      let pwd = sha1.update(decrypted).digest('hex');
      
      await models.users.create({
        'name': name,
        'phone': phone,
        'password': pwd,
      }).then((user) => {
        const result = {
          success: true
        };
        reply(result);
      }).catch((err) =>{
        console.error('用户信息插入失败');
        console.log(err)
      });
    },
    config: {
      validate: {
        payload: {
          name: Joi.string().required().description('获取用户名'),
          phone: Joi.string().required().description('获取手机号码'),
          password: Joi.string().required().description('获取密码')
        }
      },
      tags: ['api', GROUP_NAME],
      description: '用于测试的注册用户',
      auth: false, // 约定此接口不参与 JWT 的用户验证，会结合下面的 hapi-auth-jwt 来使用
    },
  },
  {
    method: 'POST',
    path: `/${GROUP_NAME}/login`,
    handler: async (request, reply) => {

    }
  },
  {
    method: 'POST',
    path: `/${GROUP_NAME}/createJWT`,
    handler: async (request, reply) => {
      const generateJWT = (jwtInfo) => {
        const payload = {
          userId: jwtInfo.userId,
          exp: Math.floor(new Date().getTime() / 1000) + 7 * 24 * 60 * 60,
        };
        return JWT.sign(payload, process.env.JWT_SECRET);
      };
      reply(generateJWT({
        userId: 1,
      }));
    },
    config: {
      tags: ['api', GROUP_NAME],
      description: '用于测试的用户 JWT 签发',
      auth: false, // 约定此接口不参与 JWT 的用户验证，会结合下面的 hapi-auth-jwt 来使用
    },
  }
];
