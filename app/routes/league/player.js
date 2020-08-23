const db = require('../../data/models')
const joi = require('joi')
const boom = require('@hapi/boom')
const refresh = require('../../league/player-refresh')

module.exports = [{
  method: 'GET',
  path: '/league/players',
  options: {
    handler: async (request, h) => {
      return h.response(await db.Player.findAll({
        include: [{ model: db.Team, as: 'team', attributes: ['name'] }],
        order: [['team', 'name'], ['lastName'], ['firstName']]
      }))
    }
  }
}, {
  method: 'POST',
  path: '/league/players/refresh',
  options: {
    validate: {
      payload: joi.object({
        players: joi.array().items(joi.object({
          firstName: joi.string().allow(''),
          lastName: joi.string().allow(''),
          position: joi.string().allow(''),
          team: joi.string().allow('')
        }))
      }),
      failAction: async (request, h, error) => {
        return boom.badRequest(error)
      }
    },
    handler: async (request, h) => {
      console.log(request.payload)
      return h.response(await refresh(request.payload.players))
    }
  }
}]
