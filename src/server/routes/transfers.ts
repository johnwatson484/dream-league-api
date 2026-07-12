import { failAction } from './fail-action.ts'
import type { ServerRoute } from '@hapi/hapi'
import Joi from 'joi'
import db from '../../data/index.ts'

export default [{
  method: 'GET',
  path: '/transfers',
  options: {
    auth: false,
    handler: async (_request, h) => {
      return h.response(await db.Transfer.findAll({
        include: [
          { model: db.Manager, as: 'manager' },
          { model: db.Player, as: 'playerIn', include: [{ model: db.Team, as: 'team' }] },
          { model: db.Player, as: 'playerOut', include: [{ model: db.Team, as: 'team' }] },
          { model: db.Meeting, as: 'meeting' },
        ],
        order: [['created', 'DESC'], ['transferId', 'DESC']],
      }))
    },
  },
}, {
  method: 'GET',
  path: '/transfers/manager',
  options: {
    auth: false,
    validate: {
      query: Joi.object({
        managerId: Joi.number().integer().required(),
      }),
      failAction,
    },
    handler: async (request, h) => {
      return h.response(await db.Transfer.findAll({
        where: { managerId: request.query.managerId },
        include: [
          { model: db.Manager, as: 'manager' },
          { model: db.Player, as: 'playerIn', include: [{ model: db.Team, as: 'team' }] },
          { model: db.Player, as: 'playerOut', include: [{ model: db.Team, as: 'team' }] },
          { model: db.Meeting, as: 'meeting' },
        ],
        order: [['created', 'DESC'], ['transferId', 'DESC']],
      }))
    },
  },
}, {
  method: 'POST',
  path: '/transfer/create',
  options: {
    auth: { strategy: 'jwt', scope: ['admin'] },
    validate: {
      payload: Joi.object({
        managerId: Joi.number().integer().required(),
        playerInId: Joi.number().integer().required(),
        playerOutId: Joi.number().integer().allow(null).optional(),
        meetingId: Joi.number().integer().allow(null).optional(),
        type: Joi.string().valid('sealed-bid', 'open-bid', 'auction').required(),
        created: Joi.date().required(),
      }),
      failAction,
    },
    handler: async (request, h) => {
      return h.response(await db.Transfer.create(request.payload as any))
    },
  },
}, {
  method: 'POST',
  path: '/transfer/delete',
  options: {
    auth: { strategy: 'jwt', scope: ['admin'] },
    validate: {
      payload: Joi.object({
        transferId: Joi.number().integer().required(),
      }),
      failAction,
    },
    handler: async (request, h) => {
      return h.response(await db.Transfer.destroy({ where: { transferId: (request.payload as any).transferId } }) as any)
    },
  },
}] satisfies ServerRoute[]
