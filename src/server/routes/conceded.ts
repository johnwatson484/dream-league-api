import Joi from 'joi'
import boom from '@hapi/boom'
import db from '../../data/index.ts'
import { GET, POST } from '../../constants/verbs.ts'
import { OK } from '../../constants/ok.ts'
import { update } from '../../results/update.ts'

export default [{
  method: GET,
  path: '/conceded',
  options: {
    handler: async (_request, h) => {
      return h.response(await db.Concede.findAll({
        include: [{ model: db.Team, as: 'team' }],
        order: [['gameweekId', 'DESC'], ['concedeId', 'DESC']],
      }))
    },
  },
}, {
  method: GET,
  path: '/concede',
  options: {
    handler: async (request, h) => {
      return h.response(await db.Concede.findOne({
        where: { concedeId: request.query.concedeId },
        include: [{ model: db.Team, as: 'team' }],
      }))
    },
  },
}, {
  method: POST,
  path: '/concede/delete',
  options: {
    auth: { strategy: 'jwt', scope: ['admin'] },
    validate: {
      payload: Joi.object({
        concedeId: Joi.number(),
      }),
      failAction: async (_request, _h, error) => {
        return boom.badRequest(error)
      },
    },
    handler: async (request, h) => {
      const concede = await db.Concede.findOne({ where: { concedeId: request.payload.concedeId } })
      await db.Concede.destroy({ where: { concedeId: request.payload.concedeId } })
      await update({ gameweekId: concede.gameweekId })
      return h.response(OK)
    },
  },
}]
