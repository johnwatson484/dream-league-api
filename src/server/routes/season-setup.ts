import { failAction } from './fail-action.ts'
import type { ServerRoute } from '@hapi/hapi'
import Joi from 'joi'
import db from '../../data/index.ts'
import { applySeasonSetup } from '../../season-setup/apply.ts'

export default [{
  method: 'GET',
  path: '/league/season-setup',
  options: {
    auth: { strategy: 'jwt', scope: ['admin'] },
    handler: async (_request, h) => {
      const teams = await db.Team.findAll({
        include: [{ model: db.Division, as: 'division', attributes: ['name', 'divisionId'] }],
        order: [['division', 'rank', 'ASC'], ['name', 'ASC']] as any,
      })
      const divisions = await db.Division.findAll({
        order: [['rank', 'ASC']],
      })
      return h.response({ teams, divisions })
    },
  },
}, {
  method: 'POST',
  path: '/league/season-setup',
  options: {
    auth: { strategy: 'jwt', scope: ['admin'] },
    validate: {
      payload: Joi.object({
        newTeams: Joi.array().items(Joi.object({
          name: Joi.string().required(),
          alias: Joi.string().required(),
          divisionId: Joi.number().integer().required(),
        })).required(),
        moves: Joi.array().items(Joi.object({
          teamId: Joi.number().integer().required(),
          divisionId: Joi.number().integer().required(),
        })).required(),
        deletes: Joi.array().items(Joi.number().integer()).required(),
      }),
      failAction,
    },
    handler: async (request, h) => {
      await applySeasonSetup(request.payload as any)
      return h.response({ success: true })
    },
  },
}] satisfies ServerRoute[]
