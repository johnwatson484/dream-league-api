import boom from '@hapi/boom'
import Joi from 'joi'
import { register } from '../../../account/register.js'
import { POST } from '../../../constants/verbs.js'

export default [{
  method: POST,
  path: '/register',
  options: {
    validate: {
      payload: Joi.object({
        email: Joi.string().email().required(),
        password: Joi.string().min(12).required(),
      }),
      failAction: async (_request, _h, error) => {
        return boom.badRequest(error)
      },
    },
    handler: async (request, h) => {
      return h.response(await register(request.payload.email, request.payload.password))
    },
  },
}]
