// routes/users.js
const JWT = require('jsonwebtoken');
const { jwtHeaderDefine } = require('../utils/router-header');
const Joi = require('joi');
const crypto = require('crypto');
const fs = require('fs');
const models = require('../node_modules/.bin/models');
const Path = require('path');

const GROUP_NAME = 'users';

module.exports = [
  {
    method: 'POST',
    path:`/${GROUP_NAME}/sign`,
    handler: async (request, reply) => {
      const { phone, name, password } = await request.payload;
      let result = {
        success: false,
        statu: 0
      };
      await models.users.findOrCreate({
        where: { phone: phone },
        defaults: {
          name: name,
          phone: phone,
          password: password,
          thumb_url: 'public/resources/header/1546348983062.jpg',
          gender: '男',
          signature: ''
        }
      }).spread((user, created) => {
        // 如果数据库插入成功的话就返回1 否则返回0 
        result.statu = created ? 1 : 0;
      }).then((user) => {
        // 如果这条数据库插入语句成功执行则 success 返回 true
        result.success = true;
        reply(result);
      }).catch((err) =>{
        // 如果数据库插入语句报错，则 success 返回 false
        reply(result);
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
      const { phone, password } = request.payload;
      let result = {
        success: false,
        data: {
          jwt: ''
        },
        statu: 0
      };
      await models.users.findOne({
        where: {
          'phone': phone
        }
      }).then((user) => {
        result.success = true;
        const generateJWT = (jwtInfo) => {
          const payload = {
            userId: jwtInfo.userId,
            exp: Math.floor(new Date().getTime() / 1000) + 7 * 24 * 60 * 60,
          };
          return JWT.sign(payload, process.env.JWT_SECRET);
        };
        let pwd = user.get('password');
        let userId = user.get('id');
        console.log(`it = ${userId}`);
        let privateKey = fs.readFileSync('./pem/private.pem', 'utf8');
        let buffer2 = Buffer.from(pwd, 'base64');
        let decrypted = crypto.privateDecrypt(
          {
           key: privateKey,
           padding: crypto.constants.RSA_PKCS1_PADDING // 注意这里的常量值要设置为RSA_PKCS1_PADDING
          },
          buffer2
         )
        pwd = decrypted.toString('utf8');
        if(pwd === password){
          result.data.jwt = generateJWT({userId: userId});
          result.statu = 1;
        }
        reply(result);
      }).catch((err) => {
        reply(result);
        console.error('用户信息查询失败');
        console.log(err);
      })
    },
    config: {
      validate: {
        payload: {
          phone: Joi.string().required().description('获取手机号码'),
          password: Joi.string().required().description('获取密码')
        }
      },
      tags: ['api', GROUP_NAME],
      description: '用于测试的登录用户',
      auth: false, // 约定此接口不参与 JWT 的用户验证，会结合下面的 hapi-auth-jwt 来使用
    },
  },
  {
    method: 'GET',
    path: `/${GROUP_NAME}/userInfo`,
    handler: async (request, reply) => {
      let result = {
        success: false,
        data: {
          name: '',
          thumb_url: '',
          signature: '',
          gender: '',
        }
      };
      let userId = request.auth.credentials.userId;
      await models.users.findOne({
        where: {
          'id': userId
        }
      }).then((user) => {
        result.success = true;
        let thumb_url = user.get('thumb_url');
        let name = user.get('name');
        let signature = user.get('signature');
        let gender = user.get('gender');
        result.data.name = name;
        result.data.thumb_url = thumb_url;
        result.data.signature = signature;
        result.data.gender = gender;
        reply(result);
      }).catch((err) => {
        reply(result);
        console.error('用户信息查询失败');
        console.log(err);
      })
    },
    config: {
      validate: {
        ...jwtHeaderDefine
      },
      tags: ['api', GROUP_NAME],
      description: '用于测试的用户信息获取接口',
    }
  },
  {
    method: 'POST',
    path: `/${GROUP_NAME}/save`,
    handler: async (request, reply) => {
      const { name, gender, signature, avatar } = request.payload;
      let data = {
        name: name,
        gender: gender,
        signature: signature
      }
      if(avatar !== ''){
        let path = 'public/resources/header/'+ Date.now() +'.jpg';
        let base64 = avatar.replace(/^data:image\/\w+;base64,/, "");
        let dataBuffer = new Buffer(base64, 'base64');
        console.log('dataBuffer是否是Buffer对象：'+Buffer.isBuffer(dataBuffer));
        fs.writeFile(path,dataBuffer,function(err){
          if(err){
              console.log(err);
          }else{
             console.log('写入成功！');
          }
        })
        data.thumb_url = path;
      }
      let userId = request.auth.credentials.userId;
      let result = {
        success: false,
        data: {
            name: '',
            gender: '',
            signature: '',
            avatar: ''
        }
      }
      await models.users.update(
        data,
        {
          where: {
            id: userId
          }
        },
      ).then((row) => {
        result.success = true;
        result.data.name = name;
        result.data.gender = gender;
        result.data.signature = signature;
        result.data.avatar = avatar===''? '': path;
      }).catch((err) => {
        console.error('用户信息更新失败');
        console.log(err);
      })
      reply(result);
    },
    config: {
      validate: {
        ...jwtHeaderDefine
      },
      tags: ['api', GROUP_NAME],
      description: '用于测试的用户信息保存接口',
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
