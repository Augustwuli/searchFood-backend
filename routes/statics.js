const Joi = require('joi');
const Path = require('path');
const GROUP_NAME = 'statics';

module.exports = [
  {
    method: 'GET',
    path: '/public/resources/header/{path}',
    handler: {
      file: function (request) {
        return Path.join(__dirname, `../public/resources/header/${request.params.path}`);
      }
    },
    config: {
      validate: {
        params: {
          path: Joi.string().required(),
        }
      },
      tags: ['api', GROUP_NAME],
      description: '返回头像',
      auth: false
    },
  },
  {
    method: 'GET',
    path: '/public/resources/img/{path}',
    handler: {
      file: function (request) {
        return Path.join(__dirname, `../public/resources/img/${request.params.path}`);
      }
    },
    config: {
      validate: {
        params: {
          path: Joi.string().required(),
        }
      },
      tags: ['api', GROUP_NAME],
      description: '返回图片',
      auth: false
    },
  },
  {
    method: 'GET',
    path: '/public/resources/cover/{path}',
    handler: {
      file: function (request) {
        return Path.join(__dirname, `../public/resources/cover/${request.params.path}`);
      }
    },
    config: {
      validate: {
        params: {
          path: Joi.string().required(),
        }
      },
      tags: ['api', GROUP_NAME],
      description: '返回封面图片',
      auth: false
    },
  }
];