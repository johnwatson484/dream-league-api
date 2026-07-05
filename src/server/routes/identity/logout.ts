import type { ServerRoute } from '@hapi/hapi'
import boom from '@hapi/boom'
import Joi from 'joi'
import { revokeToken } from '../../../token/refresh.ts'
import { POST } from '../../../constants/verbs.ts'

export default [{
  method: POST,
  path: '/logout',
  options: {
    auth: { strategy: 'jwt', mode: 'required' },
    validate: {
      payload: Joi.object({
        refreshToken: Joi.string().required(),
      }),
      failAction: async (_request, _h, error) => {
        return boom.badRequest(error?.message)
      },
    },
    handler: async (request, h) => {
      await revokeToken((request.payload as any).refreshToken)
      return h.response().code(204)
    },
  },
}] satisfies ServerRoute[]
