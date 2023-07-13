const db = require('../../data')
const joi = require('joi')
const boom = require('@hapi/boom')

module.exports = [{
  method: 'GET',
  path: '/cups',
  options: {
    handler: async (_request, h) => {
      return h.response(await db.Cup.findAll({ order: [['name']] }))
    }
  }
}, {
  method: 'GET',
  path: '/cup',
  options: {
    handler: async (request, h) => {
      return h.response(await db.Cup.findOne({ where: { cupId: request.query.cupId } }))
    }
  }
}, {
  method: 'POST',
  path: '/cup/create',
  options: {
    auth: { strategy: 'jwt', scope: ['admin'] },
    validate: {
      payload: joi.object({
        name: joi.string(),
        hasGroupStage: joi.boolean().default(false),
        knockoutLegs: joi.number().default(1)
      }),
      failAction: async (_request, _h, error) => {
        return boom.badRequest(error)
      }
    },
    handler: async (request, h) => {
      return h.response(await db.Cup.create(request.payload))
    }
  }
}, {
  method: 'POST',
  path: '/cup/edit',
  options: {
    auth: { strategy: 'jwt', scope: ['admin'] },
    validate: {
      payload: joi.object({
        cupId: joi.number().required(),
        name: joi.string(),
        hasGroupStage: joi.boolean(),
        knockoutLegs: joi.number().required()
      }),
      failAction: async (_request, _h, error) => {
        return boom.badRequest(error)
      }
    },
    handler: async (request, h) => {
      return h.response(await db.Cup.upsert(request.payload))
    }
  }
}, {
  method: 'POST',
  path: '/cup/delete',
  options: {
    auth: { strategy: 'jwt', scope: ['admin'] },
    validate: {
      payload: joi.object({
        cupId: joi.number()
      }),
      failAction: async (_request, _h, error) => {
        return boom.badRequest(error)
      }
    },
    handler: async (request, h) => {
      return h.response(await db.Cup.destroy({ where: { cupId: request.payload.cupId } }))
    }
  }
}]
