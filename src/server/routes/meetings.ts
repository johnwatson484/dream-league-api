import { failAction } from './fail-action.ts'
import type { ServerRoute } from '@hapi/hapi'
import { Op } from 'sequelize'
import Joi from 'joi'
import db from '../../data/index.ts'

export default [{
  method: 'GET',
  path: '/meetings',
  options: {
    auth: false,
    handler: async (_request, h) => {
      return h.response(await db.Meeting.findAll({ order: ['date'] }))
    },
  },
}, {
  method: 'GET',
  path: '/meeting',
  options: {
    auth: false,
    validate: {
      query: Joi.object({
        meetingId: Joi.number().integer().required(),
      }),
      failAction,
    },
    handler: async (request, h) => {
      return h.response(await db.Meeting.findOne({ where: { meetingId: request.query.meetingId } }) as any)
    },
  },
}, {
  method: 'GET',
  path: '/meetings/next',
  options: {
    auth: false,
  },
  handler: async (_request, h) => {
    return h.response(await db.Meeting.findOne({ where: { date: { [Op.gt]: new Date() } }, raw: true }) as any)
  },
}, {
  method: 'POST',
  path: '/meeting/create',
  options: {
    auth: { strategy: 'jwt', scope: ['admin'] },
    validate: {
      payload: Joi.object({
        date: Joi.date(),
      }),
      failAction,
    },
    handler: async (request, h) => {
      return h.response(await db.Meeting.create(request.payload as any))
    },
  },
}, {
  method: 'POST',
  path: '/meeting/edit',
  options: {
    auth: { strategy: 'jwt', scope: ['admin'] },
    validate: {
      payload: Joi.object({
        meetingId: Joi.number(),
        date: Joi.date(),
      }),
      failAction,
    },
    handler: async (request, h) => {
      return h.response(await db.Meeting.upsert(request.payload as any) as any)
    },
  },
}, {
  method: 'POST',
  path: '/meeting/delete',
  options: {
    auth: { strategy: 'jwt', scope: ['admin'] },
    validate: {
      payload: Joi.object({
        meetingId: Joi.number(),
      }),
      failAction,
    },
    handler: async (request, h) => {
      return h.response(await db.Meeting.destroy({ where: { meetingId: (request.payload as any).meetingId } }) as any)
    },
  },
}, {
  method: 'POST',
  path: '/meeting/refresh',
  options: {
    auth: { strategy: 'jwt', scope: ['admin'] },
    validate: {
      payload: Joi.object({
        startDate: Joi.date(),
        meetings: Joi.number(),
      }),
      failAction,
    },
    handler: async (_request, h) => {
      return h.response(undefined as any)
    },
  },
}] satisfies ServerRoute[]
