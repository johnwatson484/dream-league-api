const boom = require('@hapi/boom')
const Joi = require('joi')
const { resetPassword } = require('../../../account')
const { POST } = require('../../../constants/verbs')
const { OK } = require('../../../constants/ok')

module.exports = [{
  method: POST,
  path: '/forgot-password',
  options: {
    validate: {
      payload: Joi.object({
        email: Joi.string().email().required()
      }),
      failAction: async (_request, _h, error) => {
        return boom.badRequest(error)
      }
    },
    handler: async (request, h) => {
      const { email, password } = request.payload
      await resetPassword(email, password)
      return h.response(OK)
    }
  }
}]
