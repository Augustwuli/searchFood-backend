// routes/notes.js
const Joi = require('joi');
const fs = require('fs');
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
        statu: 0
      }
      let path = 'public/resources/cover/'+ Date.now() +'.jpg';
      let base64 = thumb_url.replace(/^data:image\/\w+;base64,/, "");
      let dataBuffer = new Buffer(base64, 'base64');
      console.log('dataBuffer是否是Buffer对象：'+Buffer.isBuffer(dataBuffer));
      fs.writeFile(path,dataBuffer,function(err){
        if(err){
            console.log(err);
        }else{
           console.log('写入成功！');
        }
      })
      await models.notes.upsert({
        title: title,
        content: content,
        thumb_url: path,
        labels: labels,
        auth_id: userId
      }).then((note) => {
        result.success = true;
        result.statu = 1;
        reply(result);
        console.log(note)
      }).catch((err) => {
        reply(result);
        console.log('笔记插入失败')
        console.log(err);
      })
    },
    config: {
      validate :{
        payload: {
          title: Joi.string().required().description('笔记标题'),
          content: Joi.string().required().description('笔记内容'), 
          thumb_url: Joi.string().required().description('笔记封面'),
          labels: Joi.string().required().description('标签')
        }
      },
      tags: ['api', GROUP_NAME],
      description: '创建笔记',
    }
  }
]