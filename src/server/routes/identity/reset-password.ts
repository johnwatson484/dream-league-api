import type { ServerRoute } from '@hapi/hapi'
import boom from '@hapi/boom'
import Joi from 'joi'
import { setNewPassword } from '../../../account/reset-password.ts'
import { POST } from '../../../constants/verbs.ts'
import { OK } from '../../../constants/ok.ts'

export default [{
  method: POST,
  path: '/reset-password',
  options: {
    auth: false,
    validate: {
      payload: Joi.object({
        userId: Joi.number().required(),
        token: Joi.string().required(),
        password: Joi.string().min(12).required(),
      }),
      failAction: async (_request, _h, error) => {
        return boom.badRequest(error?.message)
      },
    },
    handler: async (request, h) => {
      const { userId, password, token } = request.payload as any
      await setNewPassword(userId, password, token)
      return h.response(OK)
    },
  },
}] satisfies ServerRoute[]
