const Joi = require('joi');

const jwtHeaderDefine = {
  headers: Joi.object({
    authorization: Joi.string().required(),
  }).unknown(),
}

module.exports = { jwtHeaderDefine }