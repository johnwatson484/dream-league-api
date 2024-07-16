const Joi = require('joi')
const boom = require('@hapi/boom')
const db = require('../../data')
const { GET, POST } = require('../../constants/verbs')

module.exports = [{
  method: GET,
  path: '/cups',
  options: {
    handler: async (_request, h) => {
      return h.response(await db.Cup.findAll({ order: [['name']] }))
    },
  },
}, {
  method: GET,
  path: '/cup',
  options: {
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
