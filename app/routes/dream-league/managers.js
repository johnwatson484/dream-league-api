const db = require('../../data/models')
const joi = require('joi')
const boom = require('@hapi/boom')
const { getManager, getManagers, createManager, editManager, deleteManager } = require('../../dream-league/managers')

module.exports = [{
  method: 'GET',
  path: '/dream-league/managers',
  options: {
    handler: async (request, h) => {
      return h.response(await getManagers())
    }
  }
}, {
  method: 'GET',
  path: '/dream-league/manager',
  handler: async (request, h) => {
    return h.response(await getManager(request.query.managerId))
  }
}, {
  method: 'POST',
  path: '/dream-league/manager/create',
  options: {
    validate: {
      payload: joi.object({
        name: joi.string(),
        alias: joi.string(),
        emails: joi.array().items(joi.string().email().allow('')).single()
      }),
      failAction: async (request, h, error) => {
        return boom.badRequest(error)
      }
    },
    handler: async (request, h) => {
      return h.response(await createManager(request.payload))
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
        alias: joi.string(),
        emails: joi.array().items(joi.string().email().allow('')).single()
      }),
      failAction: async (request, h, error) => {
        return boom.badRequest(error)
      }
    },
    handler: async (request, h) => {
      return h.response(await editManager(request.payload))
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
      return h.response(await deleteManager(request.payload.managerId))
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
