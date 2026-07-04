import boom from '@hapi/boom'
import Joi from 'joi'
import { login } from '../../../account/login.ts'
import { POST } from '../../../constants/verbs.ts'

export default [{
  method: POST,
  path: '/login',
  options: {
    validate: {
      payload: Joi.object({
        email: Joi.string().email().required(),
        password: Joi.string().required(),
      }),
      failAction: async (_request, _h, error) => {
        return boom.badRequest(error)
      },
    },
    handler: async (request, h) => {
      const authenticated = await login(request.payload.email, request.payload.password)
      if (!authenticated) {
        return boom.unauthorized()
      }
      return h.response(authenticated)
    },
  },
}]
