const Joi = require('joi')
const boom = require('@hapi/boom')
const { getTeamsheet, updatePlayer, updateKeeper } = require('../../teamsheet')
const { refreshTeamsheet } = require('../../refresh')
const { GET, POST } = require('../../constants/verbs')

module.exports = [{
  method: GET,
  path: '/teamsheet',
  options: {
    handler: async (_request, h) => {
      return h.response(await getTeamsheet())
    },
  },
}, {
  method: POST,
  path: '/teamsheet/edit/player',
  options: {
    auth: { strategy: 'jwt', scope: ['admin'] },
    validate: {
      payload: Joi.object({
        managerId: Joi.number(),
        playerIds: Joi.alternatives().try(Joi.array().items(Joi.number()), Joi.number()),
        playerSubs: Joi.alternatives().try(Joi.array().items(Joi.number()), Joi.number()),
      }),
      failAction: async (_request, _h, error) => {
        return boom.badRequest(error)
      },
    },
    handler: async (request, _h) => {
      return updatePlayer(request.payload)
    },
  },
}, {
  method: POST,
  path: '/teamsheet/edit/keeper',
  options: {
    auth: { strategy: 'jwt', scope: ['admin'] },
    validate: {
      payload: Joi.object({
        managerId: Joi.number(),
        teamIds: Joi.alternatives().try(Joi.array().items(Joi.string()), Joi.string()),
        teamSubs: Joi.alternatives().try(Joi.array().items(Joi.string()), Joi.string()),
      }),
      failAction: async (_request, _h, error) => {
        return boom.badRequest(error)
      },
    },
    handler: async (request, _h) => {
      return updateKeeper(request.payload)
    },
  },
}, {
  method: POST,
  path: '/teamsheet/refresh',
  options: {
    auth: { strategy: 'jwt', scope: ['admin'] },
    validate: {
      payload: Joi.object({
        teams: Joi.array().items(Joi.object({
          manager: Joi.string(),
          players: Joi.array().items(Joi.object({
            player: Joi.string(),
            position: Joi.string(),
            substitute: Joi.bool(),
          })),
        })),
      }),
      failAction: async (_request, _h, error) => {
        return boom.badRequest(error)
      },
    },
    handler: async (request, h) => {
      return h.response(await refreshTeamsheet(request.payload.teams))
    },
  },
}]
