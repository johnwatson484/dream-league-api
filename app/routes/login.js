const boom = require('@hapi/boom')
const joi = require('@hapi/joi')
const auth = require('../auth')

module.exports = [{
  method: 'POST',
  path: '/login',
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
      const response = await auth.login(request.payload.email, request.payload.password)
      if (boom.isBoom(response)) {
        return response
      }
      return h.response(response)
    }
  }
}]
