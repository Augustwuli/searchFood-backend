const Joi = require('joi');
const GROUP_NAME = 'imgs';

module.exports = [
  {
    method: 'GET',
    path: `/${GROUP_NAME}/{fold}/{imgName}`,
    handler: (request, reply) => {
      let fold = request.params.fold;
      let imgName = request.params.imgName;
      reply(fold+'/'+imgName);
    },
    config: {
      validate: {
        params: {
          fold: Joi.string().required(),
          imgName: Joi.string().required()
        }
      },
      tags: ['api', GROUP_NAME],
      description: '获取图片',
      auth: false
    }
  }
]