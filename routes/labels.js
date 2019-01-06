const GROUP_NAME = 'labels';
const models = require('../node_modules/.bin/models');

module.exports = [
  {
    method: 'GET',
    path: `/${GROUP_NAME}`,
    handler: async (request, reply) => {
      let result = {
        success: false,
        data: {
          labels: []
        },
        statu: 0
      };
      await models.labels.findAll({
        attributes: [
          'id', 'name', 'num',
      ],
      }).then((labels) => {
        result.success = true;
        result.data.labels = labels;
        reply(result);
      }).catch((err) => {
        reply(result);
        console.error('标签查询失败');
        console.log(err)
      })
    },
    config: {
      tags: ['api', GROUP_NAME],
      description: '用于测试的标签接口',
      auth: false,
    }
  }
]