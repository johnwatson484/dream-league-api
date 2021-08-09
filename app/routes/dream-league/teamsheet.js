const joi = require('joi')
const boom = require('@hapi/boom')
const { get, refresh, updatePlayer, updateKeeper } = require('../../dream-league/teamsheet')

module.exports = [{
  method: 'GET',
  path: '/dream-league/teamsheet',
  options: {
    handler: async (request, h) => {
      return h.response(await get())
    }
  }
}, {
  method: 'POST',
  path: '/dream-league/teamsheet/edit/player',
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
      return await updatePlayer(request.payload)
    }
  }
}, {
  method: 'POST',
  path: '/dream-league/teamsheet/edit/keeper',
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
      return await updateKeeper(request.payload)
    }
  }
}, {
  method: 'POST',
  path: '/dream-league/teamsheet/refresh',
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
      return h.response(await refresh(request.payload.teams))
    }
  }
}]
