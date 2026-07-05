import { failAction } from '../fail-action.ts'
import type { ServerRoute } from '@hapi/hapi'
import Joi from 'joi'
import { register } from '../../../account/register.ts'

export default [{
  method: 'POST',
  path: '/register',
  options: {
    auth: false,
    validate: {
      payload: Joi.object({
        email: Joi.string().email().required(),
        password: Joi.string().min(12).required(),
      }),
      failAction,
    },
    handler: async (request, h) => {
      return h.response(await register((request.payload as any).email, (request.payload as any).password) as any)
    },
  },
}] satisfies ServerRoute[]
