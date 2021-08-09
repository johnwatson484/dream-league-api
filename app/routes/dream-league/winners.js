const { getAllWinners } = require('../../dream-league/results')

module.exports = [{
  method: 'GET',
  path: '/dream-league/winners',
  options: {
    handler: async (request, h) => {
      const winners = await getAllWinners()
      return h.response(winners)
    }
  }
}]
