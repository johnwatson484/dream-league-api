import { failAction } from './fail-action.ts'
import type { ServerRoute } from '@hapi/hapi'
import Joi from 'joi'
import { search } from '../../search/search.ts'

export default [{
  method: 'POST',
  path: '/search/autocomplete',
  options: {
    auth: false,
    validate: {
      payload: Joi.object({
        prefix: Joi.string().required(),
      }),
      failAction,
    },
    handler: async (request, h) => {
      const results = await search((request.payload as any).prefix)
      return h.response(results)
    },
  },
}] satisfies ServerRoute[]
