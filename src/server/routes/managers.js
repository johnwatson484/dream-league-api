import Joi from 'joi'
import boom from '@hapi/boom'
import db from '../../data/index.js'
import { getManager, getManagers, createManager, editManager, deleteManager, getTeam } from '../../managers/index.js'
import { getSummary } from '../../results/index.js'
import { GET, POST } from '../../constants/verbs.js'

export default [{
  method: GET,
  path: '/managers',
  options: {
    handler: async (_request, h) => {
      return h.response(await getManagers())
    },
  },
}, {
  method: GET,
  path: '/manager',
  handler: async (request, h) => {
    return h.response(await getManager(request.query.managerId))
  },
}, {
  method: GET,
  path: '/manager/detail',
  options: {
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
