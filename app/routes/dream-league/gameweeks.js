const { getCompleted, getAll } = require('../../dream-league/gameweeks')

module.exports = [{
  method: 'GET',
  path: '/dream-league/gameweeks',
  options: {
    handler: async (request, h) => {
      if (request.query.completed) {
        return h.response(await getCompleted())
      }
      return h.response(await getAll())
    }
  }
}]
