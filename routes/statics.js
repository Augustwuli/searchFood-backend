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
  }
];