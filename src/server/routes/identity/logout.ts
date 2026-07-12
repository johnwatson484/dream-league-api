import { constants as httpConstants } from 'node:http2'
import { failAction } from '../fail-action.ts'
import type { ServerRoute } from '@hapi/hapi'
import Joi from 'joi'
import { revokeToken } from '../../../token/refresh.ts'

const { HTTP_STATUS_NO_CONTENT } = httpConstants

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
      return h.response().code(HTTP_STATUS_NO_CONTENT)
    },
  },
}] satisfies ServerRoute[]
