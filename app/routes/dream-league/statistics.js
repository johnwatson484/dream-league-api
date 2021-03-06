const joi = require('joi')
const boom = require('@hapi/boom')
const { getForm, getTopScorers } = require('../../dream-league/statistics')

module.exports = [{
  method: 'GET',
  path: '/dream-league/statistics/form',
  options: {
    validate: {
      query: joi.object({
        weeksToInclude: joi.number().optional()
      }),
      failAction: async (request, h, error) => {
        return boom.badRequest(error)
      }
    },
    handler: async (request, h) => {
      const weeksToInclude = request.query.weeksToInclude || 6
      const form = await getForm(weeksToInclude)
      return h.response(form)
    }
  }
}, {
  method: 'GET',
  path: '/dream-league/statistics/top-scorers',
  options: {
    handler: async (request, h) => {
      const scorers = await getTopScorers()
      return h.response(scorers)
    }
  }
}]
