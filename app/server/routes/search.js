import Joi from 'joi'
import boom from '@hapi/boom'
import { search } from '../../search/index.js'
import { POST } from '../../constants/verbs.js'

export default [{
  method: POST,
  path: '/search/autocomplete',
  options: {
    validate: {
      payload: Joi.object({
        prefix: Joi.string().required(),
      }),
      failAction: async (_request, _h, error) => {
        return boom.badRequest(error)
      },
    },
    handler: async (request, h) => {
      const results = await search(request.payload.prefix)
      return h.response(results)
    },
  },
}]
