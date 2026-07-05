import type { ServerRoute } from '@hapi/hapi'
import Joi from 'joi'
import boom from '@hapi/boom'
import { getForm } from '../../statistics/get-form.ts'
import { getTopScorers } from '../../statistics/get-top-scorers.ts'
import { GET } from '../../constants/verbs.ts'

export default [{
  method: GET,
  path: '/statistics/form',
  options: {
    auth: false,
    validate: {
      query: Joi.object({
        weeksToInclude: Joi.number().optional(),
      }),
      failAction: async (_request, _h, error) => {
        return boom.badRequest(error?.message)
      },
    },
    handler: async (request, h) => {
      const weeksToInclude = Number(request.query.weeksToInclude) || 6
      const form = await getForm(weeksToInclude)
      return h.response(form)
    },
  },
}, {
  method: GET,
  path: '/statistics/top-scorers',
  options: {
    auth: false,
    handler: async (_request, h) => {
      const scorers = await getTopScorers()
      return h.response(scorers)
    },
  },
}] satisfies ServerRoute[]
