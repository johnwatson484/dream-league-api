const db = require('../../data')
const { GET } = require('../../constants/verbs')

module.exports = [{
  method: GET,
  path: '/gameweeks',
  options: {
    handler: async (request, h) => {
      if (request.query.completed) {
        return h.response(await db.Gameweek.findAll({ include: { model: db.Summary, as: 'summary', attributes: [], required: true } }))
      }
      return h.response(await db.Gameweek.findAll())
    }
  }
}]
