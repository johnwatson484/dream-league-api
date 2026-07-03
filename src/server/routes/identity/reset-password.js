import boom from '@hapi/boom'
import Joi from 'joi'
import { setNewPassword } from '../../../account/index.js'
import { POST } from '../../../constants/verbs.js'
import { OK } from '../../../constants/ok.js'

export default [{
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
