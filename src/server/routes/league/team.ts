import { failAction } from '../fail-action.ts'
import type { ServerRoute } from '@hapi/hapi'
import { Op } from 'sequelize'
import db from '../../../data/index.ts'
import Joi from 'joi'
import { GOALKEEPER, DEFENDER, MIDFIELDER, FORWARD } from '../../../constants/positions.ts'

export default [{
  method: 'GET',
  path: '/league/teams',
  options: {
    auth: false,
    validate: {
      query: Joi.object({
        search: Joi.string().allow('').optional(),
        division: Joi.string().allow('').optional(),
      }),
      failAction,
    },
    handler: async (request, h) => {
      const search = request.query.search || ''
      const division = request.query.division || ''

      const whereClause: any = {}

      if (search) {
        whereClause.name = { [Op.iLike]: `%${search}%` }
      }

      if (division) {
        whereClause['$division.name$'] = { [Op.iLike]: `%${division}%` }
      }

      return h.response(await db.Team.findAll({
        where: whereClause,
        include: [{ model: db.Division, as: 'division', attributes: ['name', 'divisionId'] }],
        order: [['division', 'rank', 'ASC'], ['name', 'ASC']] as any,
      }))
    },
  },
}, {
  method: 'GET',
  path: '/league/team',
  options: {
    auth: false,
    validate: {
      query: Joi.object({
        teamId: Joi.number().integer().required(),
      }),
      failAction,
    },
  },
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
      order: [
        [db.Sequelize.literal(`CASE "players"."position" WHEN '${GOALKEEPER}' THEN 1 WHEN '${DEFENDER}' THEN 2 WHEN '${MIDFIELDER}' THEN 3 WHEN '${FORWARD}' THEN 4 ELSE 5 END`)],
        [db.Sequelize.literal('"players"."lastName"')],
        [db.Sequelize.literal('"players"."firstName"')],
      ] as any,
    })
    return h.response(team as any)
  },
}, {
  method: 'POST',
  path: '/league/team/create',
  options: {
    auth: { strategy: 'jwt', scope: ['admin'] },
    validate: {
      payload: Joi.object({
        name: Joi.string(),
        alias: Joi.string(),
        divisionId: Joi.number(),
      }),
      failAction,
    },
    handler: async (request, h) => {
      return h.response(await db.Team.create(request.payload as any))
    },
  },
}, {
  method: 'POST',
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
      failAction,
    },
    handler: async (request, h) => {
      return h.response(await db.Team.upsert(request.payload as any) as any)
    },
  },
}, {
  method: 'POST',
  path: '/league/teams/autocomplete',
  options: {
    auth: false,
    validate: {
      payload: Joi.object({
        prefix: Joi.string(),
      }),
      failAction,
    },
    handler: async (request, h) => {
      const teams = await db.Team.findAll({
        where: { name: { [Op.iLike]: (request.payload as any).prefix + '%' } },
        order: [['name', 'ASC']],
      })
      return h.response(teams ?? [])
    },
  },
}] satisfies ServerRoute[]
