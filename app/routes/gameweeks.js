const { getCompleted, getAll } = require('../gameweeks')

module.exports = [{
  method: 'GET',
  path: '/gameweeks',
  options: {
    handler: async (request, h) => {
      if (request.query.completed) {
        return h.response(await getCompleted())
      }
      return h.response(await getAll())
    }
  }
}]
