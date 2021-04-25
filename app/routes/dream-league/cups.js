const db = require('../../data/models')
const joi = require('joi')
const boom = require('@hapi/boom')

module.exports = [{
  method: 'GET',
  path: '/dream-league/cups',
  options: {
    handler: async (request, h) => {
      return h.response(await db.Cup.findAll({ order: [['name']] }))
    }
  }
}, {
  method: 'GET',
  path: '/dream-league/cup',
  options: {
    handler: async (request, h) => {
      return h.response(await db.Cup.findOne({ where: { cupId: request.query.cupId } }))
    }
  }
}, {
  method: 'POST',
  path: '/dream-league/cup/create',
  options: {
    validate: {
      payload: joi.object({
        name: joi.string(),
        hasGroupStage: joi.boolean(),
        knockoutLegs: joi.number(),
        finalLegs: joi.number()
      }),
      failAction: async (request, h, error) => {
        return boom.badRequest(error)
      }
    },
    handler: async (request, h) => {
      return h.response(await db.Cup.create(request.payload))
    }
  }
}, {
  method: 'POST',
  path: '/dream-league/cup/edit',
  options: {
    validate: {
      payload: joi.object({
        cupId: joi.number(),
        name: joi.string(),
        hasGroupStage: joi.boolean(),
        knockoutLegs: joi.number(),
        finalLegs: joi.number()
      }),
      failAction: async (request, h, error) => {
        return boom.badRequest(error)
      }
    },
    handler: async (request, h) => {
      return h.response(await db.Cup.upsert(request.payload))
    }
  }
}, {
  method: 'POST',
  path: '/dream-league/cup/delete',
  options: {
    validate: {
      payload: joi.object({
        cupId: joi.number()
      }),
      failAction: async (request, h, error) => {
        return boom.badRequest(error)
      }
    },
    handler: async (request, h) => {
      return h.response(await db.Cup.destroy({ where: { cupId: request.payload.cupId } }))
    }
  }
}]
