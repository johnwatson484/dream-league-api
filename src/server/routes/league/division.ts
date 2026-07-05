import { failAction } from '../fail-action.ts'
import type { ServerRoute } from '@hapi/hapi'
import { Op } from 'sequelize'
import Joi from 'joi'
import db from '../../../data/index.ts'

export default [{
  method: 'GET',
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
  method: 'POST',
  path: '/league/divisions/autocomplete',
  options: {
    auth: false,
    validate: {
      payload: Joi.object({
        prefix: Joi.string(),
      }),
      failAction,
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
