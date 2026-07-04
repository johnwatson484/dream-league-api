import Joi from 'joi'
import boom from '@hapi/boom'
import db from '../../data/index.ts'
import { GET, POST } from '../../constants/verbs.ts'

export default [{
  method: GET,
  path: '/cups',
  options: {
    auth: false,
    handler: async (_request, h) => {
      return h.response(await db.Cup.findAll({ order: [['name']] }))
    },
  },
}, {
  method: GET,
  path: '/cup',
  options: {
    auth: false,
    handler: async (request, h) => {
      return h.response(await db.Cup.findOne({ where: { cupId: request.query.cupId } }))
    },
  },
}, {
  method: POST,
  path: '/cup/create',
  options: {
    auth: { strategy: 'jwt', scope: ['admin'] },
    validate: {
      payload: Joi.object({
        name: Joi.string(),
        hasGroupStage: Joi.boolean().default(false),
        knockoutLegs: Joi.number().default(1),
      }),
      failAction: async (_request, _h, error) => {
        return boom.badRequest(error)
      },
    },
    handler: async (request, h) => {
      return h.response(await db.Cup.create(request.payload))
    },
  },
}, {
  method: POST,
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
      failAction: async (_request, _h, error) => {
        return boom.badRequest(error)
      },
    },
    handler: async (request, h) => {
      return h.response(await db.Cup.upsert(request.payload))
    },
  },
}, {
  method: POST,
  path: '/cup/delete',
  options: {
    auth: { strategy: 'jwt', scope: ['admin'] },
    validate: {
      payload: Joi.object({
        cupId: Joi.number(),
      }),
      failAction: async (_request, _h, error) => {
        return boom.badRequest(error)
      },
    },
    handler: async (request, h) => {
      return h.response(await db.Cup.destroy({ where: { cupId: request.payload.cupId } }))
    },
  },
}]
