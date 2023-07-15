const Joi = require('joi')
const boom = require('@hapi/boom')
const db = require('../../data')
const { GET, POST } = require('../../constants/verbs')

module.exports = [{
  method: GET,
  path: '/history',
  options: {
    handler: async (request, h) => {
      if (request.query.historyId) {
        return h.response(await db.History.findOne({ where: { historyId: request.query.historyId } }))
      }
      return h.response(await db.History.findAll({ order: [['year', 'DESC']] }))
    }
  }
}, {
  method: POST,
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
        plate: Joi.string().allow('')
      }),
      failAction: async (_request, _h, error) => {
        return boom.badRequest(error)
      }
    },
    handler: async (request, h) => {
      return h.response(await db.History.create(request.payload))
    }
  }
}, {
  method: POST,
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
        plate: Joi.string().allow('')
      }),
      failAction: async (_request, _h, error) => {
        return boom.badRequest(error)
      }
    },
    handler: async (request, h) => {
      return h.response(await db.History.upsert(request.payload))
    }
  }
}, {
  method: POST,
  path: '/history/delete',
  options: {
    auth: { strategy: 'jwt', scope: ['admin'] },
    validate: {
      payload: Joi.object({
        historyId: Joi.number()
      }),
      failAction: async (_request, _h, error) => {
        return boom.badRequest(error)
      }
    },
    handler: async (request, h) => {
      return h.response(await db.History.destroy({ where: { historyId: request.payload.historyId } }))
    }
  }
}]
