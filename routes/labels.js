const GROUP_NAME = 'labels';
const models = require('../node_modules/.bin/models');

module.exports = [
  {
    method: 'GET',
    path: `/${GROUP_NAME}`,
    handler: async (request, reply) => {
      await models.labels.findAll({
        attributes: [
          'id', 'name', 'num'
      ],
      }).then((labels) => {
        reply(labels);
      })
    },
    config: {
      tags: ['api', GROUP_NAME],
      description: '用于测试的标签接口',
      auth: false,
    }
  }
]