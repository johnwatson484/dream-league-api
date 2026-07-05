import { failAction } from '../fail-action.ts'
import type { ServerRoute } from '@hapi/hapi'
import boom from '@hapi/boom'
import Joi from 'joi'
import { refresh } from '../../../token/refresh.ts'

export default [{
  method: 'POST',
  path: '/token/refresh',
  options: {
    auth: false,
    validate: {
      payload: Joi.object({
        refreshToken: Joi.string().required(),
      }),
      failAction,
    },
    handler: async (request, h) => {
      const result = await refresh((request.payload as any).refreshToken)
      if (!result) {
        return boom.unauthorized('Invalid or expired refresh token')
      }
      return h.response(result)
    },
  },
}] satisfies ServerRoute[]
