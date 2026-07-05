import { failAction } from './fail-action.ts'
import type { ServerRoute } from '@hapi/hapi'
import Joi from 'joi'
import db from '../../data/index.ts'

export default [{
  method: 'GET',
  path: '/history',
  options: {
    auth: false,
    handler: async (request, h) => {
      if (request.query.historyId) {
        return h.response(await db.History.findOne({ where: { historyId: request.query.historyId } }) as any)
      }
      return h.response(await db.History.findAll({ order: [['year', 'DESC']] }))
    },
  },
}, {
  method: 'POST',
  path: '/history/create',
  options: {
    auth: { strategy: 'jwt', scope: ['admin'] },
    validate: {
      payload: Joi.object({
        year: Joi.number().required(),
        teams: Joi.number(),
        league1: Joi.string().allow(''),
        league2: Joi.string().allow(''),
        cup: Joi.string().allow(''),
        leagueCup: Joi.string().allow(''),
        plate: Joi.string().allow(''),
      }),
      failAction,
    },
    handler: async (request, h) => {
      return h.response(await db.History.create(request.payload as any))
    },
  },
}, {
  method: 'POST',
  path: '/history/edit',
  options: {
    auth: { strategy: 'jwt', scope: ['admin'] },
    validate: {
      payload: Joi.object({
        historyId: Joi.number(),
        year: Joi.number().required(),
        teams: Joi.number(),
        league1: Joi.string().allow(''),
        league2: Joi.string().allow(''),
        cup: Joi.string().allow(''),
        leagueCup: Joi.string().allow(''),
        plate: Joi.string().allow(''),
      }),
      failAction,
    },
    handler: async (request, h) => {
      return h.response(await db.History.upsert(request.payload as any) as any)
    },
  },
}, {
  method: 'POST',
  path: '/history/delete',
  options: {
    auth: { strategy: 'jwt', scope: ['admin'] },
    validate: {
      payload: Joi.object({
        historyId: Joi.number(),
      }),
      failAction,
    },
    handler: async (request, h) => {
      return h.response(await db.History.destroy({ where: { historyId: (request.payload as any).historyId } }) as any)
    },
  },
}] satisfies ServerRoute[]
