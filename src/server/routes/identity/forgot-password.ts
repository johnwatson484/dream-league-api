import boom from '@hapi/boom'
import Joi from 'joi'
import { resetPassword } from '../../../account/reset-password.ts'
import { POST } from '../../../constants/verbs.ts'
import { OK } from '../../../constants/ok.ts'

export default [{
  method: POST,
  path: '/forgot-password',
  options: {
    validate: {
      payload: Joi.object({
        email: Joi.string().email().required(),
      }),
      failAction: async (_request, _h, error) => {
        return boom.badRequest(error)
      },
    },
    handler: async (request, h) => {
      const { email } = request.payload
      await resetPassword(email)
      return h.response(OK)
    },
  },
}]
