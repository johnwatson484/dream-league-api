import Joi from 'joi'
import boom from '@hapi/boom'
import { refresh, revoke } from '../../token/refresh.js'
import { POST } from '../../constants/verbs.js'

export default [{
  method: POST,
  path: '/token/refresh',
  options: {
    validate: {
      payload: Joi.object({
        userId: Joi.number().integer().required(),
        refreshToken: Joi.string().required(),
      }),
      failAction: async (_request, _h, error) => {
        return boom.badRequest(error)
      },
    },
    handler: async (request, h) => {
      const result = await refresh(request.payload.userId, request.payload.refreshToken)
      if (!result) {
        return boom.unauthorized()
      }
      return h.response(result)
    },
  },
}, {
  method: POST,
  path: '/token/revoke',
  options: {
    auth: { strategy: 'jwt' },
    handler: async (request, h) => {
      await revoke(request.auth.credentials.userId)
      return h.response().code(204)
    },
  },
}]
