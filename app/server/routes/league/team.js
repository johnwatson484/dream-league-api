const db = require('../../../data')
const Joi = require('joi')
const boom = require('@hapi/boom')
const { GET, POST } = require('../../../constants/verbs')

module.exports = [{
  method: GET,
  path: '/league/teams',
  options: {
    handler: async (request, h) => {
      const search = request.query.search || ''
      const division = request.query.division || ''
      
      const whereClause = {}
      
      if (search) {
        whereClause.name = { [db.Sequelize.Op.iLike]: `%${search}%` }
      }
      
      if (division) {
        whereClause['$division.name$'] = { [db.Sequelize.Op.iLike]: `%${division}%` }
      }
      
      return h.response(await db.Team.findAll({
        where: whereClause,
        include: [{ model: db.Division, as: 'division', attributes: ['name', 'divisionId'] }],
        order: [['division', 'rank'], ['name']],
      }))
    },
  },
}, {
  method: GET,
  path: '/league/team',
  handler: async (request, h) => {
    const team = await db.Team.findOne({
      where: { teamId: request.query.teamId },
      include: [{
        model: db.Division,
        as: 'division',
      }, {
        model: db.Player,
        as: 'players',
        include: [{
          model: db.Manager,
          as: 'managers',
          attributes: ['managerId', 'name'],
          through: { attributes: [] },
        }],
      }],
    })
    return h.response(team)
  },
}, {
  method: POST,
  path: '/league/team/create',
  options: {
    auth: { strategy: 'jwt', scope: ['admin'] },
    validate: {
      payload: Joi.object({
        name: Joi.string(),
        alias: Joi.string(),
        divisionId: Joi.number(),
      }),
      failAction: async (_request, _h, error) => {
        return boom.badRequest(error)
      },
    },
    handler: async (request, h) => {
      return h.response(await db.Team.create(request.payload))
    },
  },
}, {
  method: POST,
  path: '/league/team/edit',
  options: {
    auth: { strategy: 'jwt', scope: ['admin'] },
    validate: {
      payload: Joi.object({
        teamId: Joi.number(),
        name: Joi.string(),
        alias: Joi.string(),
        divisionId: Joi.number(),
      }),
      failAction: async (_request, _h, error) => {
        return boom.badRequest(error)
      },
    },
    handler: async (request, h) => {
      return h.response(await db.Team.upsert(request.payload))
    },
  },
}, {
  method: POST,
  path: '/league/teams/autocomplete',
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
      const teams = await db.Team.findAll({
        where: { name: { [db.Sequelize.Op.iLike]: request.payload.prefix + '%' } },
        order: [['name']],
      })
      return h.response(teams ?? [])
    },
  },
}]
