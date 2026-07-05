import { failAction } from './fail-action.ts'
import type { ServerRoute } from '@hapi/hapi'
import Joi from 'joi'
import db from '../../data/index.ts'

export default [{
  method: 'GET',
  path: '/fixtures',
  options: {
    auth: false,
    handler: async (_request, h) => {
      return h.response(await db.Fixture.findAll({
        include: [
          { model: db.Cup, as: 'cup', attributes: [] },
          { model: db.Manager, as: 'homeManager', attributes: [] },
          { model: db.Manager, as: 'awayManager', attributes: [] },
          { model: db.Gameweek, as: 'gameweek', attributes: [] },
        ],
        attributes: [
          'fixtureId',
          'gameweekId',
          [db.Sequelize.fn('TO_CHAR', db.Sequelize.col('gameweek.startDate'), 'DD/MM/YYYY'), 'date'],
          'cupId',
          'round',
          [db.Sequelize.col('cup.name'),
            'cupName'],
          [db.Sequelize.col('homeManager.name'), 'homeManagerName'],
          [db.Sequelize.col('awayManager.name'), 'awayManagerName'],
        ],
        order: [['gameweekId', 'ASC']],
      }))
    },
  },
}, {
  method: 'GET',
  path: '/fixture',
  options: {
    auth: false,
    handler: async (request, h) => {
      return h.response(await db.Fixture.findOne({ where: { fixtureId: request.query.fixtureId } }) as any)
    },
  },
}, {
  method: 'POST',
  path: '/fixture/create',
  options: {
    auth: { strategy: 'jwt', scope: ['admin'] },
    validate: {
      payload: Joi.object({
        cupId: Joi.number().integer().required(),
        gameweekId: Joi.number().integer().required(),
        homeManagerId: Joi.number().integer().required(),
        awayManagerId: Joi.number().integer().required(),
        round: Joi.number().integer().required(),
      }),
      failAction,
    },
    handler: async (request, h) => {
      return h.response(await db.Fixture.create(request.payload as any))
    },
  },
}, {
  method: 'POST',
  path: '/fixture/edit',
  options: {
    auth: { strategy: 'jwt', scope: ['admin'] },
    validate: {
      payload: Joi.object({
        fixtureId: Joi.number().integer().required(),
        cupId: Joi.number().integer().required(),
        gameweekId: Joi.number().integer().required(),
        homeManagerId: Joi.number().integer().required(),
        awayManagerId: Joi.number().integer().required(),
        round: Joi.number().integer().required(),
      }),
      failAction,
    },
    handler: async (request, h) => {
      return h.response(await db.Fixture.upsert(request.payload as any) as any)
    },
  },
}, {
  method: 'POST',
  path: '/fixture/delete',
  options: {
    auth: { strategy: 'jwt', scope: ['admin'] },
    validate: {
      payload: Joi.object({
        fixtureId: Joi.number(),
      }),
      failAction,
    },
    handler: async (request, h) => {
      return h.response(await db.Fixture.destroy({ where: { fixtureId: (request.payload as any).fixtureId } }) as any)
    },
  },
}] satisfies ServerRoute[]
