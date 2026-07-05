import type { ServerRoute } from '@hapi/hapi'
import db from '../../data/index.ts'

export default [{
  method: 'GET',
  path: '/gameweeks',
  options: {
    auth: false,
    handler: async (request, h) => {
      if (request.query.completed) {
        return h.response(await db.Gameweek.findAll({ include: { model: db.Summary, as: 'summary', attributes: [], required: true }, order: ['gameweekId'] }))
      }
      return h.response(await db.Gameweek.findAll({ order: ['gameweekId'] }))
    },
  },
}] satisfies ServerRoute[]
