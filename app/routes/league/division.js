const db = require('../../data/models')

module.exports = [{
  method: 'GET',
  path: '/league/divisions',
  options: {
    handler: async (request, h) => {
      return h.response(await db.Division.findAll({
        order: [['rank']]
      }))
    }
  }
}]
