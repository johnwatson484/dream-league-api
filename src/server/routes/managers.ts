import { failAction } from './fail-action.ts'
import type { ServerRoute } from '@hapi/hapi'
import { Op } from 'sequelize'
import Joi from 'joi'
import db from '../../data/index.ts'
import { getManagers } from '../../managers/get-managers.ts'
import { getManager } from '../../managers/get-manager.ts'
import { createManager } from '../../managers/create-manager.ts'
import { editManager } from '../../managers/edit-manager.ts'
import { deleteManager } from '../../managers/delete-manager.ts'
import { getTeam } from '../../managers/get-team.ts'
import { getSummary } from '../../results/get-summary.ts'

export default [{
  method: 'GET',
  path: '/managers',
  options: {
    auth: false,
    handler: async (_request, h) => {
      return h.response(await getManagers())
    },
  },
}, {
  method: 'GET',
  path: '/manager',
  options: {
    auth: { strategy: 'jwt', scope: ['admin'] },
    validate: {
      query: Joi.object({
        managerId: Joi.number().integer().required(),
      }),
      failAction,
    },
    handler: async (request, h) => {
      return h.response(await getManager(Number(request.query.managerId), true) as any)
    },
  },
}, {
  method: 'GET',
  path: '/manager/detail',
  options: {
    auth: false,
    validate: {
      query: Joi.object({
        managerId: Joi.number().required(),
      }),
      failAction,
    },
    handler: async (request, h) => {
      const manager = await getManager(Number(request.query.managerId))
      const team = await getTeam(Number(request.query.managerId))
      const results = await getSummary()
      return h.response({ manager, team, results })
    },
  },
}, {
  method: 'POST',
  path: '/manager/create',
  options: {
    auth: { strategy: 'jwt', scope: ['admin'] },
    validate: {
      payload: Joi.object({
        name: Joi.string(),
        alias: Joi.string(),
        emails: Joi.array().items(Joi.string().email().allow('')).single(),
      }),
      failAction,
    },
    handler: async (request, h) => {
      return h.response(await createManager(request.payload as any))
    },
  },
}, {
  method: 'POST',
  path: '/manager/edit',
  options: {
    auth: { strategy: 'jwt', scope: ['admin'] },
    validate: {
      payload: Joi.object({
        managerId: Joi.number(),
        name: Joi.string(),
        alias: Joi.string(),
        emails: Joi.array().items(Joi.string().email().allow('')).single(),
      }),
      failAction,
    },
    handler: async (request, h) => {
      return h.response(await editManager(request.payload as any))
    },
  },
}, {
  method: 'POST',
  path: '/manager/delete',
  options: {
    auth: { strategy: 'jwt', scope: ['admin'] },
    validate: {
      payload: Joi.object({
        managerId: Joi.number(),
      }),
      failAction,
    },
    handler: async (request, h) => {
      return h.response(await deleteManager((request.payload as any).managerId) as any)
    },
  },
}, {
  method: 'POST',
  path: '/manager/autocomplete',
  options: {
    auth: false,
    validate: {
      payload: Joi.object({
        prefix: Joi.string(),
      }),
      failAction,
    },
    handler: async (request, h) => {
      const managers = await db.Manager.findAll({
        where: { name: { [Op.iLike]: (request.payload as any).prefix + '%' } },
        order: [['name', 'ASC']],
      })
      return h.response(managers || [])
    },
  },
}] satisfies ServerRoute[]
