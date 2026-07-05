import { failAction } from '../fail-action.ts'
import type { ServerRoute } from '@hapi/hapi'
import Joi from 'joi'
import { revokeToken } from '../../../token/refresh.ts'

export default [{
  method: 'POST',
  path: '/logout',
  options: {
    auth: { strategy: 'jwt', mode: 'required' },
    validate: {
      payload: Joi.object({
        refreshToken: Joi.string().required(),
      }),
      failAction,
    },
    handler: async (request, h) => {
      await revokeToken((request.payload as any).refreshToken)
      return h.response().code(204)
    },
  },
}] satisfies ServerRoute[]
