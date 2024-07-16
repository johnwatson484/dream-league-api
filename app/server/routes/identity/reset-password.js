const boom = require('@hapi/boom')
const Joi = require('joi')
const { setNewPassword } = require('../../../account')
const { POST } = require('../../../constants/verbs')
const { OK } = require('../../../constants/ok')

module.exports = [{
  method: POST,
  path: '/reset-password',
  options: {
    validate: {
      payload: Joi.object({
        userId: Joi.number().required(),
        token: Joi.string().required(),
        password: Joi.string().required(),
      }),
      failAction: async (_request, _h, error) => {
        return boom.badRequest(error)
      },
    },
    handler: async (request, h) => {
      const { userId, password, token } = request.payload
      await setNewPassword(userId, password, token)
      return h.response(OK)
    },
  },
}]
