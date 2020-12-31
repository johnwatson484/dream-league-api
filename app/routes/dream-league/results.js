const { get } = require('../../dream-league/results')
const joi = require('joi')
const boom = require('@hapi/boom')
const update = require('../../dream-league/teamsheet/update/update-player')

module.exports = [{
  method: 'GET',
  path: '/dream-league/results-edit',
  options: {
    handler: async (request, h) => {
      return h.response(await get())
    }
  }
}, {
  method: 'POST',
  path: '/dream-league/results-edit',
  options: {
    validate: {
      payload: joi.object({
        gameweekId: joi.number(),
        conceded: joi.alternatives().try(joi.array().items(joi.object({ teamId: joi.number(), conceded: joi.number() })), joi.string()),
        goals: joi.alternatives().try(joi.array().items(joi.object({ playerId: joi.number(), goals: joi.number() })), joi.string())
      }),
      failAction: async (request, h, error) => {
        return boom.badRequest(error)
      }
    },
    handler: async (request, h) => {
      return h.response(await update(request.payload))
    }
  }
}]
