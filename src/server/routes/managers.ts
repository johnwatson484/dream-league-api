import Joi from 'joi'
import boom from '@hapi/boom'
import db from '../../data/index.ts'
import { getManagers } from '../../managers/get-managers.ts'
import { getManager } from '../../managers/get-manager.ts'
import { createManager } from '../../managers/create-manager.ts'
import { editManager } from '../../managers/edit-manager.ts'
import { deleteManager } from '../../managers/delete-manager.ts'
import { getTeam } from '../../managers/get-team.ts'
import { getSummary } from '../../results/get-summary.ts'
import { GET, POST } from '../../constants/verbs.ts'

export default [{
  method: GET,
  path: '/managers',
  options: {
    auth: false,
    handler: async (_request, h) => {
      return h.response(await getManagers())
    },
  },
}, {
  method: GET,
  path: '/manager',
  options: {
    auth: { strategy: 'jwt', scope: ['admin'] },
    validate: {
      query: Joi.object({
        managerId: Joi.number().integer().required(),
      }),
      failAction: async (_request, _h, error) => {
        return boom.badRequest(error)
      },
    },
    handler: async (request, h) => {
      return h.response(await getManager(request.query.managerId, true))
    },
  },
}, {
  method: GET,
  path: '/manager/detail',
  options: {
    auth: false,
    validate: {
      query: Joi.object({
        managerId: Joi.number().required(),
      }),
      failAction: async (_request, _h, error) => {
        return boom.badRequest(error)
      },
    },
    handler: async (request, h) => {
      const manager = await getManager(request.query.managerId)
      const team = await getTeam(request.query.managerId)
      const results = await getSummary()
      return h.response({ manager, team, results })
    },
  },
}, {
  method: POST,
  path: '/manager/create',
  options: {
    auth: { strategy: 'jwt', scope: ['admin'] },
    validate: {
      payload: Joi.object({
        name: Joi.string(),
        alias: Joi.string(),
        emails: Joi.array().items(Joi.string().email().allow('')).single(),
      }),
      failAction: async (_request, _h, error) => {
        return boom.badRequest(error)
      },
    },
    handler: async (request, h) => {
      return h.response(await createManager(request.payload))
    },
  },
}, {
  method: POST,
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
      failAction: async (_request, _h, error) => {
        return boom.badRequest(error)
      },
    },
    handler: async (request, h) => {
      return h.response(await editManager(request.payload))
    },
  },
}, {
  method: POST,
  path: '/manager/delete',
  options: {
    auth: { strategy: 'jwt', scope: ['admin'] },
    validate: {
      payload: Joi.object({
        managerId: Joi.number(),
      }),
      failAction: async (_request, _h, error) => {
        return boom.badRequest(error)
      },
    },
    handler: async (request, h) => {
      return h.response(await deleteManager(request.payload.managerId))
    },
  },
}, {
  method: POST,
  path: '/manager/autocomplete',
  options: {
    auth: false,
    validate: {
      payload: Joi.object({
        prefix: Joi.string(),
      }),
      failAction: async (_request, _h, error) => {
        return boom.badRequest(error)
      },
    },
    handler: async (request, h) => {
      const managers = await db.Manager.findAll({
        where: { name: { [db.Sequelize.Op.iLike]: request.payload.prefix + '%' } },
        order: [['name']],
      })
      return h.response(managers || [])
    },
  },
}]
