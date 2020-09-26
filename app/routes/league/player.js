const db = require('../../data/models')
const joi = require('joi')
const boom = require('@hapi/boom')
const refresh = require('../../league/player-refresh')

module.exports = [{
  method: 'GET',
  path: '/league/players',
  options: {
    handler: async (request, h) => {
      const search = request.query.search !== 'undefined' ? `${request.query.search}%` : '%'
      return h.response(await db.Player.findAll({
        where: {
          [db.Sequelize.Op.or]: [{
            lastName: { [db.Sequelize.Op.iLike]: search }
          }, {
            firstName: { [db.Sequelize.Op.iLike]: search }
          }, {
            '$team.name$': { [db.Sequelize.Op.iLike]: search }
          }]
        },
        include: [{ model: db.Team, as: 'team', attributes: ['name'] }],
        order: [['team', 'name'], ['lastName'], ['firstName']]
      }))
    }
  }
}, {
  method: 'POST',
  path: '/league/players/autocomplete',
  options: {
    validate: {
      payload: joi.object({
        prefix: joi.string()
      }),
      failAction: async (request, h, error) => {
        return boom.badRequest(error)
      }
    },
    handler: async (request, h) => {
      const players = await db.Player.findAll({
        where: { lastName: { [db.Sequelize.Op.iLike]: request.payload.prefix + '%' } },
        include: [{ model: db.Team, as: 'team', attributes: ['name'] }],
        order: [['lastName'], ['firstName']]
      })
      return h.response(players || [])
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
      return h.response(await refresh(request.payload.players))
    }
  }
}]
