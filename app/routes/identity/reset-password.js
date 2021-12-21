const boom = require('@hapi/boom')
const joi = require('joi')
const { setNewPassword } = require('../../account')

module.exports = [{
  method: 'POST',
  path: '/reset-password',
  options: {
    validate: {
      payload: joi.object({
        userId: joi.number().required(),
        token: joi.string().required(),
        password: joi.string().required()
      }),
      failAction: async (request, h, error) => {
        return boom.badRequest(error)
      }
    },
    handler: async (request, h) => {
      const { userId, password, token } = request.payload
      await setNewPassword(userId, password, token)
      return h.response('ok')
    }
  }
}]
