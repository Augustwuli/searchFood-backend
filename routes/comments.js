// routes/notes.js
const Joi = require('joi');
const fs = require('fs');
const models = require('../node_modules/.bin/models');
const GROUP_NAME = 'comments';

module.exports =[
  {
    method: 'POST',
    path: `/${GROUP_NAME}/publish`,
    handler: async (request,reply) => {
      const {noteId,content} = request.payload;
      let userId = request.auth.credentials.userId;
      let result = {
        success: false,
        statu: 0
      }
      await models.comments.upsert({
        auth_id: userId,
        note_id: noteId,
        content:content
      }).then((comment) => {
        result.success = true;
        result.statu = 1;
        console.log(comment);
        let info = `\r\n${noteId},${userId},remark`;
        fs.appendFile('./logs/user.csv', info,function(err){
          if(err) console.log(`追加操作失败${err}`);
          else console.log('追加操作成功');
        });
      }).catch((err) => {
        console.log('评论插入失败')
        console.log(err);
      })
      reply(result);
    },
    config: {
      validate :{
        payload: {
          noteId: Joi.number().required().description('笔记ID'),
          content: Joi.string().required().description('评论内容'), 
        }
      },
      tags: ['api', GROUP_NAME],
      description: '插入评论',
    }
  }
]