const db = require('../../data')
const joi = require('joi')
const boom = require('@hapi/boom')

module.exports = [{
  method: 'GET',
  path: '/dream-league/groups',
  options: {
    handler: async (request, h) => {
      return h.response(await db.Group.findAll({ order: [['name']] }))
    }
  }
}, {
  method: 'GET',
  path: '/dream-league/group',
  options: {
    handler: async (request, h) => {
      return h.response(await db.Group.findOne({ where: { groupId: request.query.groupId } }))
    }
  }
}, {
  method: 'POST',
  path: '/dream-league/group/create',
  options: {
    validate: {
      payload: joi.object({
        name: joi.string(),
        groupLegs: joi.number(),
        teamsAdvancing: joi.number()
      }),
      failAction: async (request, h, error) => {
        return boom.badRequest(error)
      }
    },
    handler: async (request, h) => {
      return h.response(await db.Group.create(request.payload))
    }
  }
}, {
  method: 'POST',
  path: '/dream-league/group/edit',
  options: {
    validate: {
      payload: joi.object({
        groupId: joi.number(),
        name: joi.string(),
        groupLegs: joi.number(),
        teamsAdvancing: joi.number()
      }),
      failAction: async (request, h, error) => {
        return boom.badRequest(error)
      }
    },
    handler: async (request, h) => {
      return h.response(await db.Group.upsert(request.payload))
    }
  }
}, {
  method: 'POST',
  path: '/dream-league/group/delete',
  options: {
    validate: {
      payload: joi.object({
        groupId: joi.number()
      }),
      failAction: async (request, h, error) => {
        return boom.badRequest(error)
      }
    },
    handler: async (request, h) => {
      return h.response(await db.Group.destroy({ where: { groupId: request.payload.groupId } }))
    }
  }
}]
