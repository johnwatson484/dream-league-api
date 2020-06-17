const boom = require('@hapi/boom')
const joi = require('@hapi/joi')
const auth = require('../auth')

module.exports = [{
  method: 'POST',
  path: '/login',
  options: {
    validate: {
      payload: joi.object({
        username: joi.string().required(),
        password: joi.string().required()
      }),
      failAction: async (request, h, error) => {
        return boom.badRequest(error)
      }
    },
    handler: (request, h) => {
      return h.response(auth.login(request.payload.username, request.payload.password))
    }
  }
}]
