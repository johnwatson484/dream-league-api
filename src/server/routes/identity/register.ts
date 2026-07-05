import type { ServerRoute } from '@hapi/hapi'
import boom from '@hapi/boom'
import Joi from 'joi'
import { register } from '../../../account/register.ts'
import { POST } from '../../../constants/verbs.ts'

export default [{
  method: POST,
  path: '/register',
  options: {
    auth: false,
    validate: {
      payload: Joi.object({
        email: Joi.string().email().required(),
        password: Joi.string().min(12).required(),
      }),
      failAction: async (_request, _h, error) => {
        return boom.badRequest(error?.message)
      },
    },
    handler: async (request, h) => {
      return h.response(await register((request.payload as any).email, (request.payload as any).password) as any)
    },
  },
}] satisfies ServerRoute[]
