const db = require('../data')
const joi = require('joi')
const boom = require('@hapi/boom')

module.exports = [{
  method: 'GET',
  path: '/meetings',
  options: {
    handler: async (request, h) => {
      return h.response(await db.Meeting.findAll({ order: ['date'] }))
    }
  }
}, {
  method: 'GET',
  path: '/meeting',
  handler: async (request, h) => {
    return h.response(await db.Meeting.findOne({ where: { meetingId: request.query.meetingId } }))
  }
}, {
  method: 'GET',
  path: '/meetings/next',
  handler: async (request, h) => {
    return h.response(await db.Meeting.findOne({ where: { date: { [db.Sequelize.Op.gt]: new Date() } }, raw: true }))
  }
}, {
  method: 'POST',
  path: '/meeting/create',
  options: {
    auth: { strategy: 'jwt', scope: ['admin'] },
    validate: {
      payload: joi.object({
        date: joi.date()
      }),
      failAction: async (request, h, error) => {
        return boom.badRequest(error)
      }
    },
    handler: async (request, h) => {
      return h.response(await db.Meeting.create(request.payload))
    }
  }
}, {
  method: 'POST',
  path: '/meeting/edit',
  options: {
    auth: { strategy: 'jwt', scope: ['admin'] },
    validate: {
      payload: joi.object({
        meetingId: joi.number(),
        date: joi.date()
      }),
      failAction: async (request, h, error) => {
        return boom.badRequest(error)
      }
    },
    handler: async (request, h) => {
      return h.response(await db.Meeting.upsert(request.payload))
    }
  }
}, {
  method: 'POST',
  path: '/meeting/delete',
  options: {
    auth: { strategy: 'jwt', scope: ['admin'] },
    validate: {
      payload: joi.object({
        meetingId: joi.number()
      }),
      failAction: async (request, h, error) => {
        return boom.badRequest(error)
      }
    },
    handler: async (request, h) => {
      return h.response(await db.Meeting.destroy({ where: { meetingId: request.payload.meetingId } }))
    }
  }
}, {
  method: 'POST',
  path: '/meeting/refresh',
  options: {
    auth: { strategy: 'jwt', scope: ['admin'] },
    validate: {
      payload: joi.object({
        startDate: joi.date(),
        meetings: joi.number()
      }),
      failAction: async (request, h, error) => {
        return boom.badRequest(error)
      }
    },
    handler: async (request, h) => {
      return h.response()
    }
  }
}]
