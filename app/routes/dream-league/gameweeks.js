const getCompleted = require('../../dream-league/gameweeks')

module.exports = [{
  method: 'GET',
  path: '/dream-league/gameweeks',
  options: {
    handler: async (request, h) => {
      const gameweeks = await getCompleted()
      return h.response(gameweeks)
    }
  }
}]
