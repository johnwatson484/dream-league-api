const { get } = require('../../dream-league/results')

module.exports = [{
  method: 'GET',
  path: '/dream-league/results-edit',
  options: {
    handler: async (request, h) => {
      return h.response(await get())
    }
  }
}]
