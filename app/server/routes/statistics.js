const Joi = require('joi')
const boom = require('@hapi/boom')
const { getForm, getTopScorers } = require('../../statistics')
const { GET } = require('../../constants/verbs')

module.exports = [{
  method: GET,
  path: '/statistics/form',
  options: {
    validate: {
      query: Joi.object({
        weeksToInclude: Joi.number().optional(),
      }),
      failAction: async (_request, _h, error) => {
        return boom.badRequest(error)
      },
    },
    handler: async (request, h) => {
      const weeksToInclude = request.query.weeksToInclude || 6
      const form = await getForm(weeksToInclude)
      return h.response(form)
    },
  },
}, {
  method: GET,
  path: '/statistics/top-scorers',
  options: {
    handler: async (_request, h) => {
      const scorers = await getTopScorers()
      return h.response(scorers)
    },
  },
}]
