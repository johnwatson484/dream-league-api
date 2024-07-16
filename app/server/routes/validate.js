const Joi = require('joi')
const boom = require('@hapi/boom')
const { validate } = require('../../token')
const { POST } = require('../../constants/verbs')

module.exports = [{
  method: POST,
  path: '/validate',
  options: {
    validate: {
      payload: Joi.object({
        token: Joi.object().required(),
      }),
      failAction: async (_request, _h, error) => {
        return boom.badRequest(error)
      },
    },
    handler: async (request, h) => {
      return h.response(await validate(request.payload.token))
    },
  },
}]
