const boom = require('@hapi/boom')
const joi = require('joi')
const account = require('../../../account')

module.exports = [{
  method: 'POST',
  path: '/register',
  options: {
    validate: {
      payload: joi.object({
        email: joi.string().email().required(),
        password: joi.string().required()
      }),
      failAction: async (_request, _h, error) => {
        return boom.badRequest(error)
      }
    },
    handler: async (request, h) => {
      return h.response(await account.register(request.payload.email, request.payload.password))
    }
  }
}]
