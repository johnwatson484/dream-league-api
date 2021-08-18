const { getAllWinners } = require('../results')

module.exports = [{
  method: 'GET',
  path: '/winners',
  options: {
    handler: async (request, h) => {
      const winners = await getAllWinners()
      return h.response(winners)
    }
  }
}]
