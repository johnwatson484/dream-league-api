import type { ServerRoute } from '@hapi/hapi'
import { Op } from 'sequelize'
import Joi from 'joi'
import boom from '@hapi/boom'
import db from '../../../data/index.ts'
import { GET, POST } from '../../../constants/verbs.ts'

export default [{
  method: GET,
  path: '/league/divisions',
  options: {
    auth: false,
    handler: async (_request, h) => {
      return h.response(await db.Division.findAll({
        order: [['rank', 'ASC']],
      }))
    },
  },
}, {
  method: POST,
  path: '/league/divisions/autocomplete',
  options: {
    auth: false,
    validate: {
      payload: Joi.object({
        prefix: Joi.string(),
      }),
      failAction: async (_request, _h, error) => {
        return boom.badRequest(error?.message)
      },
    },
    handler: async (request, h) => {
      const divisions = await db.Division.findAll({
        where: { name: { [Op.iLike]: (request.payload as any).prefix + '%' } },
        order: [['name', 'ASC']],
      })
      return h.response(divisions || [])
    },
  },
}] satisfies ServerRoute[]
