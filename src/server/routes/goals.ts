import { failAction } from './fail-action.ts'
import type { ServerRoute } from '@hapi/hapi'
import Joi from 'joi'
import db from '../../data/index.ts'
import { update } from '../../results/update.ts'

export default [{
  method: 'GET',
  path: '/goals',
  options: {
    auth: false,
    handler: async (_request, h) => {
      return h.response(await db.Goal.findAll({
        include: [{ model: db.Player, as: 'player', include: [{ model: db.Team, as: 'team' }] }],
        order: [['gameweekId', 'DESC'], ['goalId', 'DESC']],
      }))
    },
  },
}, {
  method: 'GET',
  path: '/goal',
  options: {
    auth: false,
    handler: async (request, h) => {
      return h.response(await db.Goal.findOne({
        where: { goalId: request.query.goalId },
        include: [{ model: db.Player, as: 'player', include: [{ model: db.Team, as: 'team' }] }],
      }) as any)
    },
  },
}, {
  method: 'POST',
  path: '/goal/delete',
  options: {
    auth: { strategy: 'jwt', scope: ['admin'] },
    validate: {
      payload: Joi.object({
        goalId: Joi.number(),
      }),
      failAction,
    },
    handler: async (request, h) => {
      const goal: any = await db.Goal.findOne({ where: { goalId: (request.payload as any).goalId } })
      await db.Goal.destroy({ where: { goalId: (request.payload as any).goalId } })
      await update({ gameweekId: goal.gameweekId })
      return h.response('ok')
    },
  },
}] satisfies ServerRoute[]
