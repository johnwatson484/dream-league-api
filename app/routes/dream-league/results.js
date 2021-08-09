const { getSummary, getInput, update } = require('../../dream-league/results')
const joi = require('joi')
const boom = require('@hapi/boom')
const { sendResults } = require('../../notifications')

module.exports = [{
  method: 'GET',
  path: '/dream-league/results',
  options: {
    validate: {
      query: joi.object({
        gameweekId: joi.number().optional()
      }),
      failAction: async (request, h, error) => {
        return boom.badRequest(error)
      }
    },
    handler: async (request, h) => {
      const summary = await getSummary(request.query.gameweekId)
      return h.response(summary)
    }
  }
}, {
  method: 'GET',
  path: '/dream-league/results-edit',
  options: {
    auth: { strategy: 'jwt', scope: ['admin'] },
    handler: async (request, h) => {
      return h.response(await getInput())
    }
  }
}, {
  method: 'POST',
  path: '/dream-league/results-edit',
  options: {
    auth: { strategy: 'jwt', scope: ['admin'] },
    validate: {
      payload: joi.object({
        gameweekId: joi.number(),
        conceded: joi.array().items(joi.object({ teamId: joi.number(), conceded: joi.number() })).single(),
        concededCup: joi.array().items(joi.object({ teamId: joi.number(), conceded: joi.number() })).single(),
        goals: joi.array().items(joi.object({ playerId: joi.number(), goals: joi.number() })).single(),
        goalsCup: joi.array().items(joi.object({ playerId: joi.number(), goals: joi.number() })).single()
      }),
      failAction: async (request, h, error) => {
        return boom.badRequest(error)
      }
    },
    handler: async (request, h) => {
      await update(request.payload)
      return h.response(true)
    }
  }
}, {
  method: 'POST',
  path: '/dream-league/results-send',
  options: {
    auth: { strategy: 'jwt', scope: ['admin'] },
    validate: {
      payload: joi.object({
        gameweekId: joi.number().required()
      }),
      failAction: async (request, h, error) => {
        return boom.badRequest(error)
      }
    },
    handler: async (request, h) => {
      await sendResults(request.payload.gameweekId)
      return h.response(true)
    }
  }
}]
