// routes/notes.js
const Joi = require('joi');
const fs = require('fs');
const GROUP_NAME = 'notes';
const models = require('../node_modules/.bin/models');
const { paginationDefine } = require('../utils/router-helper');

module.exports = [
  {
    method: 'GET',
    path: `/${GROUP_NAME}/list`,
    handler: async (request, reply) => {
      let result = {
        success: false,
        data: {
          notes: [],
          count: 0
        },
        statu: 0
      };
      await models.notes.findAndCountAll({
        attributes: ['id', 'auth_id', 'title', 'thumb_url', 'read_num', 'star_num', 'comment_num'],
        limit: request.query.limit,
        offset: (request.query.page - 1) * request.query.limit,
      }).then((notes) => {
        result.success = true;
        result.data.notes = notes.rows;
        result.data.count = notes.count;
      }).catch((err) => {
        console.error('标签查询失败');
        console.log(err)
      })
      reply(result)
    },
    config: {
      validate :{
        query: {
          ...paginationDefine
        }
      },
      tags: ['api', GROUP_NAME],
      description: '用于测试的笔记列表接口',
      auth: false,
    }
  },
  {
    method: 'POST',
    path: `/${GROUP_NAME}/publish`,
    handler: async (request, reply) => {
      const { title, content, thumb_url, labels, imgs } = request.payload;
      let userId = request.auth.credentials.userId;
      let result = {
        success: false,
        statu: 0
      }
      let images = imgs.split('-');
      let paths = [];
      for (let i = 0; i < images.length; i++) {
        paths[i] = 'public/resources/img/'+ Date.now() +'.jpg';
        let base64 = images[i].replace(/^data:image\/\w+;base64,/, "");
        let dataBuffer = new Buffer(base64, 'base64');
        console.log('dataBuffer是否是Buffer对象：'+Buffer.isBuffer(dataBuffer));
        fs.writeFile(paths[i],dataBuffer,function(err){
          if(err){
              console.log(err);
          }else{
            console.log(`${i}张写入成功！`);
          }
        })
      }
      let img = paths.join(',');
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
        auth_id: userId,
        imgs: img
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
          labels: Joi.string().required().description('标签'),
          imgs: Joi.string().required().description('图片'),
        }
      },
      tags: ['api', GROUP_NAME],
      description: '创建笔记',
    }
  }
]