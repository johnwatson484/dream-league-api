const db = require('../data')
const joi = require('joi')
const boom = require('@hapi/boom')
const { getManager, getManagers, createManager, editManager, deleteManager } = require('../managers')
const { get } = require('../teamsheet')

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
      const teamsheet = await get()
      const managerTeam = teamsheet.find(x => x.managerId === request.query.managerId)
      return h.response(managerTeam)
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
