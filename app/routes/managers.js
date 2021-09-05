const db = require('../data')
const joi = require('joi')
const boom = require('@hapi/boom')
const { getManager, getManagers, createManager, editManager, deleteManager, getTeam } = require('../managers')
const { getSummary } = require('../results')

module.exports = [{
  method: 'GET',
  path: '/managers',
  options: {
    handler: async (request, h) => {
      return h.response(await getManagers())
    }
  }
}, {
  method: 'GET',
  path: '/manager',
  handler: async (request, h) => {
    return h.response(await getManager(request.query.managerId))
  }
}, {
  method: 'GET',
  path: '/manager/detail',
  options: {
    validate: {
      query: joi.object({
        managerId: joi.number().required()
      }),
      failAction: async (request, h, error) => {
        return boom.badRequest(error)
      }
    },
    handler: async (request, h) => {
      const manager = await getManager(request.query.managerId)
      const team = await getTeam(request.query.managerId)
      const results = await getSummary()
      return h.response({ manager, team, results })
    }
  }
}, {
  method: 'POST',
  path: '/manager/create',
  options: {
    auth: { strategy: 'jwt', scope: ['admin'] },
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
  path: '/manager/edit',
  options: {
    auth: { strategy: 'jwt', scope: ['admin'] },
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
  path: '/manager/delete',
  options: {
    auth: { strategy: 'jwt', scope: ['admin'] },
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
  path: '/manager/autocomplete',
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
