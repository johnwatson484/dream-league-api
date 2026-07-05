import { failAction } from './fail-action.ts'
import type { ServerRoute } from '@hapi/hapi'
import Joi from 'joi'
import db from '../../data/index.ts'
import { resolveFixture, manuallyResolve, saveResolution } from '../../cups/resolve-fixture.ts'

export default [{
  method: 'GET',
  path: '/cups',
  options: {
    auth: false,
    handler: async (_request, h) => {
      return h.response(await db.Cup.findAll({ order: [['name', 'ASC']] }))
    },
  },
}, {
  method: 'GET',
  path: '/cup',
  options: {
    auth: false,
    handler: async (request, h) => {
      return h.response(await db.Cup.findOne({ where: { cupId: request.query.cupId } }) as any)
    },
  },
}, {
  method: 'POST',
  path: '/cup/create',
  options: {
    auth: { strategy: 'jwt', scope: ['admin'] },
    validate: {
      payload: Joi.object({
        name: Joi.string(),
        hasGroupStage: Joi.boolean().default(false),
        knockoutLegs: Joi.number().default(1),
      }),
      failAction,
    },
    handler: async (request, h) => {
      return h.response(await db.Cup.create(request.payload as any))
    },
  },
}, {
  method: 'POST',
  path: '/cup/edit',
  options: {
    auth: { strategy: 'jwt', scope: ['admin'] },
    validate: {
      payload: Joi.object({
        cupId: Joi.number().required(),
        name: Joi.string(),
        hasGroupStage: Joi.boolean(),
        knockoutLegs: Joi.number().required(),
      }),
      failAction,
    },
    handler: async (request, h) => {
      return h.response(await db.Cup.upsert(request.payload as any) as any)
    },
  },
}, {
  method: 'POST',
  path: '/cup/delete',
  options: {
    auth: { strategy: 'jwt', scope: ['admin'] },
    validate: {
      payload: Joi.object({
        cupId: Joi.number(),
      }),
      failAction,
    },
    handler: async (request, h) => {
      return h.response(await db.Cup.destroy({ where: { cupId: (request.payload as any).cupId } }) as any)
    },
  },
}, {
  method: 'GET',
  path: '/cups/{cupId}/progression',
  options: {
    auth: false,
    handler: async (request, h) => {
      const cupId = Number(request.params.cupId)
      const fixtures = await db.Fixture.findAll({
        where: { cupId },
        include: [
          { model: db.Manager, as: 'homeManager', attributes: ['managerId', 'name'] },
          { model: db.Manager, as: 'awayManager', attributes: ['managerId', 'name'] },
          { model: db.Gameweek, as: 'gameweek', attributes: ['gameweekId', 'startDate'] },
        ],
        order: [['round', 'ASC'], ['gameweekId', 'ASC']],
      })

      const cupResults = await db.CupResult.findAll({
        where: { fixtureId: fixtures.map((f: any) => f.fixtureId) },
      })

      const resultsMap = new Map((cupResults as any[]).map((r: any) => [r.fixtureId, r]))

      const progression = (fixtures as any[]).map((f: any) => ({
        ...f.toJSON(),
        result: resultsMap.get(f.fixtureId)?.toJSON() || null,
      }))

      return h.response(progression)
    },
  },
}, {
  method: 'POST',
  path: '/cups/{cupId}/resolve',
  options: {
    auth: { strategy: 'jwt', scope: ['admin'] },
    validate: {
      payload: Joi.object({
        fixtureId: Joi.number().integer().required(),
        winnerManagerId: Joi.number().integer().optional(),
      }),
      failAction,
    },
    handler: async (request, h) => {
      const { fixtureId, winnerManagerId } = request.payload as { fixtureId: number; winnerManagerId?: number }

      if (winnerManagerId) {
        await manuallyResolve(fixtureId, winnerManagerId)
        return h.response({ status: 'resolved', decidedBy: 'lots' })
      }

      const result = await resolveFixture(fixtureId)
      if (result.status === 'resolved') {
        await saveResolution(fixtureId, result)
      }
      return h.response(result)
    },
  },
}] satisfies ServerRoute[]
