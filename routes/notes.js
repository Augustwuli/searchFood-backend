// routes/notes.js
const GROUP_NAME = 'notes';
const models = require('../node_modules/.bin/models');
const { paginationDefine } = require('../utils/router-helper');

module.exports = [
  {
    method: 'GET',
    path: `/${GROUP_NAME}`,
    handler: async (request, reply) => {
      const { rows: results, count: totalCount } = await models.notes.findAndCountAll({
        attributes: [
            'id', 'auth_id', 'title'
        ],
        limit: request.query.limit,
        offset: (request.query.page - 1) * request.query.limit,
    });
    // 开启分页插件，返回的数据结构里，需要带上 result 与 totalCount 两个字段
    reply({ results, totalCount });
    },
    config: {
        validate :{
            query: {
                ...paginationDefine
            }
        },
        auth: false,
        tags: ['api', GROUP_NAME],
        description: '获取笔记列表',
    }
  },
  {
    method: 'POST',
    path: `/${GROUP_NAME}/publish`,
    handler: async (request, reply) => {
      const { title, content, thumb_url, labels } = request.payload;
      let userId = request.auth.credentials.userId;
      let result = {
        success: false,
        data: {
          title: '',
          content: '',
          thumb_url: '',
          labels: ''
        }
      }
    }
  }
]