import Joi from 'joi'
import boom from '@hapi/boom'
import { validate } from '../../token/index.js'
import { POST } from '../../constants/verbs.js'

export default [{
  method: POST,
  path: '/validate',
  options: {
    validate: {
      payload: Joi.object({
        token: Joi.object().required(),
      }),
      failAction: async (_request, _h, error) => {
        return boom.badRequest(error)
      },
    },
    handler: async (request, h) => {
      return h.response(await validate(request.payload.token))
    },
  },
}]
