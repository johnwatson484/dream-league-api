import { failAction } from '../fail-action.ts'
import type { ServerRoute } from '@hapi/hapi'
import boom from '@hapi/boom'
import Joi from 'joi'
import { login } from '../../../account/login.ts'

export default [{
  method: 'POST',
  path: '/login',
  options: {
    auth: false,
    validate: {
      payload: Joi.object({
        email: Joi.string().email().required(),
        password: Joi.string().required(),
      }),
      failAction,
    },
    handler: async (request, h) => {
      const authenticated = await login((request.payload as any).email, (request.payload as any).password)
      if (!authenticated) {
        return boom.unauthorized()
      }
      return h.response(authenticated)
    },
  },
}] satisfies ServerRoute[]
