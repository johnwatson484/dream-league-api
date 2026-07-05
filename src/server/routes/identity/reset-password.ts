import { failAction } from '../fail-action.ts'
import type { ServerRoute } from '@hapi/hapi'
import Joi from 'joi'
import { setNewPassword } from '../../../account/reset-password.ts'

export default [{
  method: 'POST',
  path: '/reset-password',
  options: {
    auth: false,
    validate: {
      payload: Joi.object({
        userId: Joi.number().required(),
        token: Joi.string().required(),
        password: Joi.string().min(12).required(),
      }),
      failAction,
    },
    handler: async (request, h) => {
      const { userId, password, token } = request.payload as any
      await setNewPassword(userId, password, token)
      return h.response('ok')
    },
  },
}] satisfies ServerRoute[]
