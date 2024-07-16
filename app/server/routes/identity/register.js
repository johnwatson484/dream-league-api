const boom = require('@hapi/boom')
const Joi = require('joi')
const { register } = require('../../../account')
const { POST } = require('../../../constants/verbs')

module.exports = [{
  method: POST,
  path: '/register',
  options: {
    validate: {
      payload: Joi.object({
        email: Joi.string().email().required(),
        password: Joi.string().required(),
      }),
      failAction: async (_request, _h, error) => {
        return boom.badRequest(error)
      },
    },
    handler: async (request, h) => {
      return h.response(await register(request.payload.email, request.payload.password))
    },
  },
}]
