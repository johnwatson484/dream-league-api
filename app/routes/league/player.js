const db = require('../../data')
const joi = require('joi')
const boom = require('@hapi/boom')
const refresh = require('../../refresh/players')

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
        include: [{
          model: db.Team, as: 'team', attributes: ['name']
        }, {
          model: db.Manager, as: 'managers', attributes: ['managerId', 'name'], through: { attributes: [] }
        }],
        order: [['team', 'name'], ['lastName'], ['firstName']]
      }))
    }
  }
}, {
  method: 'GET',
  path: '/league/player',
  handler: async (request, h) => {
    return h.response(await db.Player.findOne({ where: { playerId: request.query.playerId } }))
  }
}, {
  method: 'POST',
  path: '/league/player/create',
  options: {
    auth: { strategy: 'jwt', scope: ['admin'] },
    validate: {
      payload: joi.object({
        firstName: joi.string().allow(''),
        lastName: joi.string(),
        position: joi.string().valid(...['Defender', 'Midfielder', 'Forward']),
        teamId: joi.number()
      }),
      failAction: async (_request, _h, error) => {
        return boom.badRequest(error)
      }
    },
    handler: async (request, h) => {
      return h.response(await db.Player.create(request.payload))
    }
  }
}, {
  method: 'POST',
  path: '/league/player/edit',
  options: {
    auth: { strategy: 'jwt', scope: ['admin'] },
    validate: {
      payload: joi.object({
        playerId: joi.number(),
        firstName: joi.string().allow(''),
        lastName: joi.string(),
        position: joi.string().valid(...['Defender', 'Midfielder', 'Forward']),
        teamId: joi.number()
      }),
      failAction: async (_request, _h, error) => {
        return boom.badRequest(error)
      }
    },
    handler: async (request, h) => {
      return h.response(await db.Player.upsert(request.payload))
    }
  }
}, {
  method: 'POST',
  path: '/league/player/delete',
  options: {
    auth: { strategy: 'jwt', scope: ['admin'] },
    validate: {
      payload: joi.object({
        playerId: joi.number()
      }),
      failAction: async (_request, _h, error) => {
        return boom.badRequest(error)
      }
    },
    handler: async (request, h) => {
      return h.response(await db.Player.destroy({ where: { playerId: request.payload.playerId } }))
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
      failAction: async (_request, _h, error) => {
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
      failAction: async (_request, _h, error) => {
        return boom.badRequest(error)
      }
    },
    handler: async (request, h) => {
      return h.response(await refresh(request.payload.players))
    }
  }
}]
