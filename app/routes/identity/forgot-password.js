const boom = require('@hapi/boom')
const joi = require('joi')
const { resetPassword } = require('../../account')

module.exports = [{
  method: 'POST',
  path: '/forgot-password',
  options: {
    validate: {
      payload: joi.object({
        email: joi.string().email().required()
      }),
      failAction: async (_request, _h, error) => {
        return boom.badRequest(error)
      }
    },
    handler: async (request, h) => {
      const { email, password } = request.payload
      await resetPassword(email, password)
      return h.response('ok')
    }
  }
}]
