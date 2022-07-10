const boom = require('@hapi/boom')
const joi = require('joi')
const token = require('../token')

module.exports = [{
  method: 'POST',
  path: '/validate',
  options: {
    validate: {
      payload: joi.object({
        token: joi.object().required()
      }),
      failAction: async (_request, _h, error) => {
        return boom.badRequest(error)
      }
    },
    handler: async (request, h) => {
      return h.response(await token.validate(request.payload.token))
    }
  }
}]
