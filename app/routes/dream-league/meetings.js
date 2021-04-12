const db = require('../../data/models')
const joi = require('joi')
const boom = require('@hapi/boom')
const refresh = require('../../dream-league/meeting-refresh')

module.exports = [{
  method: 'GET',
  path: '/dream-league/meetings',
  options: {
    handler: async (request, h) => {
      return h.response(await db.Meeting.findAll({ order: ['date'] }))
    }
  }
}, {
  method: 'GET',
  path: '/dream-league/meeting',
  handler: async (request, h) => {
    return h.response(await db.Meeting.findOne({ where: { meetingId: request.query.meetingId } }))
  }
}, {
  method: 'POST',
  path: '/dream-league/meeting',
  options: {
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
  path: '/dream-league/meeting/edit',
  options: {
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
  path: '/dream-league/meeting/delete',
  options: {
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
  path: '/dream-league/meeting/refresh',
  options: {
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
      return h.response(await refresh(request.payload))
    }
  }
}]
