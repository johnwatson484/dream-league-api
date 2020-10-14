const { get } = require('../../dream-league/resultsheet')

module.exports = [{
  method: 'GET',
  path: '/dream-league/resultsheet',
  options: {
    handler: async (request, h) => {
      return h.response(await get())
    }
  }
}]
