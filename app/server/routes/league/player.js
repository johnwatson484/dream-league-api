const Joi = require('joi')
const boom = require('@hapi/boom')
const db = require('../../../data')
const { refresh } = require('../../../refresh/players')
const { GET, POST } = require('../../../constants/verbs')
const { GOALKEEPER, DEFENDER, MIDFIELDER, FORWARD } = require('../../../constants/positions')

module.exports = [{
  method: GET,
  path: '/league/players',
  options: {
    handler: async (request, h) => {
      const search = request.query.search !== 'undefined' ? `${request.query.search}%` : '%'
      const position = request.query.position
      
      const whereClause = {
        position: { [db.Sequelize.Op.ne]: GOALKEEPER },
        [db.Sequelize.Op.or]: [{
          lastName: { [db.Sequelize.Op.iLike]: search },
        }, {
          firstName: { [db.Sequelize.Op.iLike]: search },
        }, {
          '$team.name$': { [db.Sequelize.Op.iLike]: search },
        }],
      }
      
      // Add position filter if specified
      if (position && [DEFENDER, MIDFIELDER, FORWARD].includes(position)) {
        whereClause.position = position
      }
      
      return h.response(await db.Player.findAll({
        where: whereClause,
        include: [{
          model: db.Team, as: 'team', attributes: ['teamId', 'name'],
        }, {
          model: db.Manager, as: 'managers', attributes: ['managerId', 'name'], through: { attributes: [] },
        }],
        order: [
          ['team', 'name'],
          [db.Sequelize.literal(`CASE position WHEN '${DEFENDER}' THEN 1 WHEN '${MIDFIELDER}' THEN 2 WHEN '${FORWARD}' THEN 3 ELSE 4 END`)],
          ['lastName'],
          ['firstName'],
        ],
      }))
    },
  },
}, {
  method: GET,
  path: '/league/player',
  handler: async (request, h) => {
    const player = await db.Player.findOne({
      where: { playerId: request.query.playerId },
      include: [{
        model: db.Team,
        as: 'team',
        include: [{
          model: db.Division,
          as: 'division',
        }],
      }, {
        model: db.Manager,
        as: 'managers',
        attributes: ['managerId', 'name'],
        through: { attributes: ['substitute'] },
      }, {
        model: db.Goal,
        as: 'goals',
        attributes: ['goalId', 'gameweekId', 'cup'],
      }],
    })
    return h.response(player)
  },
}, {
  method: POST,
  path: '/league/player/create',
  options: {
    auth: { strategy: 'jwt', scope: ['admin'] },
    validate: {
      payload: Joi.object({
        firstName: Joi.string().allow(''),
        lastName: Joi.string(),
        position: Joi.string().valid(...['Defender', 'Midfielder', 'Forward']),
        teamId: Joi.number(),
      }),
      failAction: async (_request, _h, error) => {
        return boom.badRequest(error)
      },
    },
    handler: async (request, h) => {
      return h.response(await db.Player.create(request.payload))
    },
  },
}, {
  method: POST,
  path: '/league/player/edit',
  options: {
    auth: { strategy: 'jwt', scope: ['admin'] },
    validate: {
      payload: Joi.object({
        playerId: Joi.number(),
        firstName: Joi.string().allow(''),
        lastName: Joi.string(),
        position: Joi.string().valid(...['Defender', 'Midfielder', 'Forward']),
        teamId: Joi.number(),
      }),
      failAction: async (_request, _h, error) => {
        return boom.badRequest(error)
      },
    },
    handler: async (request, h) => {
      return h.response(await db.Player.upsert(request.payload))
    },
  },
}, {
  method: POST,
  path: '/league/player/delete',
  options: {
    auth: { strategy: 'jwt', scope: ['admin'] },
    validate: {
      payload: Joi.object({
        playerId: Joi.number(),
      }),
      failAction: async (_request, _h, error) => {
        return boom.badRequest(error)
      },
    },
    handler: async (request, h) => {
      return h.response(await db.Player.destroy({ where: { playerId: request.payload.playerId } }))
    },
  },
}, {
  method: POST,
  path: '/league/players/autocomplete',
  options: {
    validate: {
      payload: Joi.object({
        prefix: Joi.string(),
      }),
      failAction: async (_request, _h, error) => {
        return boom.badRequest(error)
      },
    },
    handler: async (request, h) => {
      const players = await db.Player.findAll({
        where: { lastName: { [db.Sequelize.Op.iLike]: request.payload.prefix + '%' } },
        include: [{ model: db.Team, as: 'team', attributes: ['name'] }],
        order: [['lastName'], ['firstName']],
      })
      return h.response(players || [])
    },
  },
}, {
  method: POST,
  path: '/league/players/refresh',
  options: {
    validate: {
      payload: Joi.object({
        players: Joi.array().items(Joi.object({
          firstName: Joi.string().allow(''),
          lastName: Joi.string().allow(''),
          position: Joi.string().allow(''),
          team: Joi.string().allow(''),
        })),
      }),
      failAction: async (_request, _h, error) => {
        return boom.badRequest(error)
      },
    },
    handler: async (request, h) => {
      return h.response(await refresh(request.payload.players))
    },
  },
}]
