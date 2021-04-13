const db = require('../../data/models')
const joi = require('joi')
const boom = require('@hapi/boom')

module.exports = [{
  method: 'GET',
  path: '/dream-league/meetings',
  options: {
    handler: async (request, h) => {
      return h.response(await db.Manager.findAll({ order: ['date'] }))
    }
  }
}, {
  method: 'GET',
  path: '/dream-league/manager',
  handler: async (request, h) => {
    return h.response(await db.Manager.findOne({ where: { managerId: request.query.managerId } }))
  }
}, {
  method: 'POST',
  path: '/dream-league/manager/create',
  options: {
    validate: {
      payload: joi.object({
        name: joi.string(),
        alias: joi.string()
      }),
      failAction: async (request, h, error) => {
        return boom.badRequest(error)
      }
    },
    handler: async (request, h) => {
      return h.response(await db.Manager.create(request.payload))
    }
  }
}, {
  method: 'POST',
  path: '/dream-league/manager/edit',
  options: {
    validate: {
      payload: joi.object({
        managerId: joi.number(),
        name: joi.string(),
        alias: joi.string()
      }),
      failAction: async (request, h, error) => {
        return boom.badRequest(error)
      }
    },
    handler: async (request, h) => {
      return h.response(await db.Manager.upsert(request.payload))
    }
  }
}, {
  method: 'POST',
  path: '/dream-league/manager/delete',
  options: {
    validate: {
      payload: joi.object({
        managerId: joi.number()
      }),
      failAction: async (request, h, error) => {
        return boom.badRequest(error)
      }
    },
    handler: async (request, h) => {
      return h.response(await db.Manager.destroy({ where: { managerId: request.payload.managerId } }))
    }
  }
}, {
  method: 'POST',
  path: '/dream-league/manager/autocomplete',
  options: {
    validate: {
      payload: joi.object({
        prefix: joi.string()
      }),
      failAction: async (request, h, error) => {
        return boom.badRequest(error)
      }
    },
    handler: async (request, h) => {
      const managers = await db.Manager.findAll({
        where: { name: { [db.Sequelize.Op.iLike]: request.payload.prefix + '%' } },
        order: [['name']]
      })
      return h.response(managers || [])
    }
  }
}]
