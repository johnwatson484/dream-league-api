const boom = require('@hapi/boom')
const joi = require('@hapi/joi')
const account = require('../account')

module.exports = [{
  method: 'POST',
  path: '/register',
  options: {
    validate: {
      payload: joi.object({
        email: joi.string().required(),
        password: joi.string().required()
      }),
      failAction: async (request, h, error) => {
        return boom.badRequest(error)
      }
    },
    handler: async (request, h) => {
      return h.response(await account.register(request.payload.email, request.payload.password))
    }
  }
}]
