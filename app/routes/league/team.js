const db = require('../../data/models')

module.exports = [{
  method: 'GET',
  path: '/league/teams',
  options: {
    handler: async (request, h) => {
      return h.response(await db.Team.findAll({
        include: [{ model: db.Division, as: 'division', attributes: ['name'] }],
        order: [['division', 'rank'], ['name']]
      }))
    }
  }
}]
