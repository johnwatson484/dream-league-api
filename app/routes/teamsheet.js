const joi = require('joi')
const boom = require('@hapi/boom')
const { getTeamsheet, updatePlayer, updateKeeper } = require('../teamsheet')
const { refreshTeamsheet } = require('../refresh')

module.exports = [{
  method: 'GET',
  path: '/teamsheet',
  options: {
    handler: async (request, h) => {
      return h.response(await getTeamsheet())
    }
  }
}, {
  method: 'POST',
  path: '/teamsheet/edit/player',
  options: {
    auth: { strategy: 'jwt', scope: ['admin'] },
    validate: {
      payload: joi.object({
        managerId: joi.number(),
        playerIds: joi.alternatives().try(joi.array().items(joi.number()), joi.number()),
        playerSubs: joi.alternatives().try(joi.array().items(joi.number()), joi.number())
      }),
      failAction: async (request, h, error) => {
        return boom.badRequest(error)
      }
    },
    handler: async (request, h) => {
      return updatePlayer(request.payload)
    }
  }
}, {
  method: 'POST',
  path: '/teamsheet/edit/keeper',
  options: {
    auth: { strategy: 'jwt', scope: ['admin'] },
    validate: {
      payload: joi.object({
        managerId: joi.number(),
        teamIds: joi.alternatives().try(joi.array().items(joi.string()), joi.string()),
        teamSubs: joi.alternatives().try(joi.array().items(joi.string()), joi.string())
      }),
      failAction: async (request, h, error) => {
        return boom.badRequest(error)
      }
    },
    handler: async (request, h) => {
      return updateKeeper(request.payload)
    }
  }
}, {
  method: 'POST',
  path: '/teamsheet/refresh',
  options: {
    auth: { strategy: 'jwt', scope: ['admin'] },
    validate: {
      payload: joi.object({
        teams: joi.array().items(joi.object({
          manager: joi.string(),
          players: joi.array().items(joi.object({
            player: joi.string(),
            position: joi.string(),
            substitute: joi.bool()
          }))
        }))
      }),
      failAction: async (request, h, error) => {
        return boom.badRequest(error)
      }
    },
    handler: async (request, h) => {
      return h.response(await refreshTeamsheet(request.payload.teams))
    }
  }
}]
