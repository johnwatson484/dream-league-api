const boom = require('@hapi/boom')
const joi = require('joi')
const { login } = require('../../account')

module.exports = [{
  method: 'POST',
  path: '/login',
  options: {
    validate: {
      payload: joi.object({
        email: joi.string().email().required(),
        password: joi.string().required()
      }),
      failAction: async (request, h, error) => {
        return boom.badRequest(error)
      }
    },
    handler: async (request, h) => {
      const authenticated = await login(request.payload.email, request.payload.password)
      if (!authenticated) {
        return boom.unauthorized()
      }
      return h.response(authenticated)
    }
  }
}]
