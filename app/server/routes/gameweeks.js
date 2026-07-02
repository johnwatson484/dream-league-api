import db from '../../data/index.js'
import { GET } from '../../constants/verbs.js'

export default [{
  method: GET,
  path: '/gameweeks',
  options: {
    handler: async (request, h) => {
      if (request.query.completed) {
        return h.response(await db.Gameweek.findAll({ include: { model: db.Summary, as: 'summary', attributes: [], required: true }, order: ['gameweekId'] }))
      }
      return h.response(await db.Gameweek.findAll({ order: ['gameweekId'] }))
    },
  },
}]
