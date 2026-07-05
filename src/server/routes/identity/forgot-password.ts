import { failAction } from '../fail-action.ts'
import type { ServerRoute } from '@hapi/hapi'
import Joi from 'joi'
import { resetPassword } from '../../../account/reset-password.ts'

export default [{
  method: 'POST',
  path: '/forgot-password',
  options: {
    auth: false,
    validate: {
      payload: Joi.object({
        email: Joi.string().email().required(),
      }),
      failAction,
    },
    handler: async (request, h) => {
      const { email } = request.payload as any
      await resetPassword(email)
      return h.response('ok')
    },
  },
}] satisfies ServerRoute[]
