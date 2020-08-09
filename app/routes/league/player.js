const db = require('../../data/models')

module.exports = [{
  method: 'GET',
  path: '/league/players',
  options: {
    handler: async (request, h) => {
      return h.response(await db.Player.findAll({
        include: [{ model: db.Team, as: 'team', attributes: ['name'] }],
        order: [['team', 'name'], ['lastName'], ['firstName']]
      }))
    }
  }
}]
