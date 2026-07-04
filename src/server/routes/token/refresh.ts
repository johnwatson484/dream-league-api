import boom from '@hapi/boom'
import Joi from 'joi'
import { refresh } from '../../../token/refresh.ts'
import { POST } from '../../../constants/verbs.ts'

export default [{
  method: POST,
  path: '/token/refresh',
  options: {
    auth: false,
    validate: {
      payload: Joi.object({
        refreshToken: Joi.string().required(),
      }),
      failAction: async (_request, _h, error) => {
        return boom.badRequest(error)
      },
    },
    handler: async (request, h) => {
      const result = await refresh(request.payload.refreshToken)
      if (!result) {
        return boom.unauthorized('Invalid or expired refresh token')
      }
      return h.response(result)
    },
  },
}]
