// routes/order.js
const Joi = require('joi');
const GROUP_NAME = 'orders';

module.exports = [
  {
    method: 'GET',
    path: `/${GROUP_NAME}`,
    handler: async (request, reply) => {
      reply();
    },
    config: {
      tags: ['api', GROUP_NAME],
      description: '获取订单列表',
    },
  },
  {
    method: 'POST',
    path: `/${GROUP_NAME}/{orderId}/pay`,
    handler: async (request, reply) => {
      reply();
    },
    config: {
      validate: {
        params: {
          orderId: Joi.string().required(),
        }
      },
      tags: ['api', GROUP_NAME],
      description: '付款',
    },
  },
]