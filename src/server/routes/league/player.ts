import { failAction } from '../fail-action.ts'
import type { ServerRoute } from '@hapi/hapi'
import { Op } from 'sequelize'
import Joi from 'joi'
import db from '../../../data/index.ts'
import { refreshPlayers } from '../../../refresh/players/refresh-players.ts'
import { GOALKEEPER, DEFENDER, MIDFIELDER, FORWARD } from '../../../constants/positions.ts'

export default [{
  method: 'GET',
  path: '/league/players',
  options: {
    auth: false,
    handler: async (request, h) => {
      const search = request.query.search !== 'undefined' ? `${request.query.search}%` : '%'
      const position = request.query.position as string | undefined

      const whereClause: any = {
        position: { [Op.ne]: GOALKEEPER },
        [Op.or]: [{
          lastName: { [Op.iLike]: search },
        }, {
          firstName: { [Op.iLike]: search },
        }, {
          '$team.name$': { [Op.iLike]: search },
        }],
      }

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
          ['lastName', 'ASC'],
          ['firstName', 'ASC'],
        ] as any,
      }))
    },
  },
}, {
  method: 'GET',
  path: '/league/player',
  options: {
    auth: false,
  },
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
    return h.response(player as any)
  },
}, {
  method: 'POST',
  path: '/league/player/create',
  options: {
    auth: { strategy: 'jwt', scope: ['admin'] },
    validate: {
      payload: Joi.object({
        firstName: Joi.string().allow(''),
        lastName: Joi.string(),
        position: Joi.string().valid('Defender', 'Midfielder', 'Forward'),
        teamId: Joi.number(),
      }),
      failAction,
    },
    handler: async (request, h) => {
      try {
        const player = await db.Player.create(request.payload as any)
        return h.response(player)
      } catch (err: any) {
        const details = err?.errors?.map((e: any) => `${e.path}: ${e.message}`)?.join(', ') || ''
        const message = details || err?.message || 'Failed to create player'
        return h.response({ error: true, message }).code(400)
      }
    },
  },
}, {
  method: 'POST',
  path: '/league/player/edit',
  options: {
    auth: { strategy: 'jwt', scope: ['admin'] },
    validate: {
      payload: Joi.object({
        playerId: Joi.number(),
        firstName: Joi.string().allow(''),
        lastName: Joi.string(),
        position: Joi.string().valid('Defender', 'Midfielder', 'Forward'),
        teamId: Joi.number(),
      }),
      failAction,
    },
    handler: async (request, h) => {
      return h.response(await db.Player.upsert(request.payload as any) as any)
    },
  },
}, {
  method: 'POST',
  path: '/league/player/delete',
  options: {
    auth: { strategy: 'jwt', scope: ['admin'] },
    validate: {
      payload: Joi.object({
        playerId: Joi.number(),
      }),
      failAction,
    },
    handler: async (request, h) => {
      return h.response(await db.Player.destroy({ where: { playerId: (request.payload as any).playerId } }) as any)
    },
  },
}, {
  method: 'POST',
  path: '/league/player/transfer',
  options: {
    auth: { strategy: 'jwt', scope: ['admin'] },
    validate: {
      payload: Joi.object({
        playerId: Joi.number().required(),
        teamId: Joi.number().required(),
      }),
      failAction,
    },
    handler: async (request, h) => {
      const { playerId, teamId } = request.payload as any
      await db.Player.update({ teamId }, { where: { playerId } })
      const player = await db.Player.findOne({
        where: { playerId },
        include: [{ model: db.Team, as: 'team', attributes: ['teamId', 'name'] }],
      })
      return h.response(player as any)
    },
  },
}, {
  method: 'POST',
  path: '/league/players/autocomplete',
  options: {
    auth: false,
    validate: {
      payload: Joi.object({
        prefix: Joi.string(),
      }),
      failAction,
    },
    handler: async (request, h) => {
      const players = await db.Player.findAll({
        where: { lastName: { [Op.iLike]: (request.payload as any).prefix + '%' } },
        include: [{ model: db.Team, as: 'team', attributes: ['name'] }],
        order: [['lastName', 'ASC'], ['firstName', 'ASC']],
      })
      return h.response(players || [])
    },
  },
}, {
  method: 'POST',
  path: '/league/players/refresh',
  options: {
    auth: { strategy: 'jwt', scope: ['admin'] },
    validate: {
      payload: Joi.object({
        players: Joi.array().items(Joi.object({
          firstName: Joi.string().allow(''),
          lastName: Joi.string().allow(''),
          position: Joi.string().allow(''),
          team: Joi.string().allow(''),
        })),
      }),
      failAction,
    },
    handler: async (request, h) => {
      return h.response(await refreshPlayers((request.payload as any).players))
    },
  },
}] satisfies ServerRoute[]
