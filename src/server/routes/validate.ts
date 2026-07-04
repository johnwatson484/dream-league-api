import Joi from 'joi'
import boom from '@hapi/boom'
import jwt from 'jsonwebtoken'
import config from '../../config/index.ts'
import { validate } from '../../token/validate.ts'
import { POST } from '../../constants/verbs.ts'

export default [{
  method: POST,
  path: '/validate',
  options: {
    validate: {
      payload: Joi.object({
        token: Joi.string().required(),
      }),
      failAction: async (_request, _h, error) => {
        return boom.badRequest(error)
      },
    },
    handler: async (request, h) => {
      let decoded
      try {
        decoded = jwt.verify(request.payload.token, config.jwtConfig.secret)
      } catch {
        return h.response({ isValid: false })
      }
      return h.response(await validate(decoded, request, h))
    },
  },
}]
