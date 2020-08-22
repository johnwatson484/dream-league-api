const db = require('../../data/models')
const joi = require('joi')
const boom = require('@hapi/boom')
const refresh = require('../../league/player-refresh')
const positions = require('../../config').positions

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
          firstName: joi.string().valid('').optional(),
          lastName: joi.string().required(),
          position: joi.string().valid(...positions),
          team: joi.string().required()
        })).required()
      }),
      failAction: async (request, h, error) => {
        return boom.badRequest(error)
      }
    },
    handler: async (request, h) => {
      return h.response(await refresh(request.payload))
    }
  }
}]
