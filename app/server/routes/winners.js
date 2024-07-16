const { getAllWinners } = require('../../results')
const { GET } = require('../../constants/verbs')

module.exports = [{
  method: GET,
  path: '/winners',
  options: {
    handler: async (_request, h) => {
      const winners = await getAllWinners()
      return h.response(winners)
    },
  },
}]
