import { failAction } from './fail-action.ts'
import type { ServerRoute } from '@hapi/hapi'
import Joi from 'joi'
import db from '../../data/index.ts'
import { deleteScore } from '../../results/delete-score.ts'
import boom from '@hapi/boom'

export default [{
  method: 'GET',
  path: '/conceded',
  options: {
    auth: false,
    handler: async (_request, h) => {
      return h.response(await db.Concede.findAll({
        include: [{ model: db.Team, as: 'team' }],
        order: [['gameweekId', 'DESC'], ['concedeId', 'DESC']],
      }))
    },
  },
}, {
  method: 'GET',
  path: '/concede',
  options: {
    auth: false,
    handler: async (request, h) => {
      return h.response(await db.Concede.findOne({
        where: { concedeId: request.query.concedeId },
        include: [{ model: db.Team, as: 'team' }],
      }) as any)
    },
  },
}, {
  method: 'POST',
  path: '/concede/delete',
  options: {
    auth: { strategy: 'jwt', scope: ['admin'] },
    validate: {
      payload: Joi.object({
        concedeId: Joi.number(),
      }),
      failAction,
    },
    handler: async (request, h) => {
      if (!await deleteScore('concede', (request.payload as any).concedeId)) {
        return boom.notFound('Concede entry not found')
      }
      return h.response('ok')
    },
  },
}] satisfies ServerRoute[]
