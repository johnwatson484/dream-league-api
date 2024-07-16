const Joi = require('joi')
const boom = require('@hapi/boom')
const db = require('../../data')
const { GET, POST } = require('../../constants/verbs')

module.exports = [{
  method: GET,
  path: '/meetings',
  options: {
    handler: async (_request, h) => {
      return h.response(await db.Meeting.findAll({ order: ['date'] }))
    },
  },
}, {
  method: GET,
  path: '/meeting',
  handler: async (request, h) => {
    return h.response(await db.Meeting.findOne({ where: { meetingId: request.query.meetingId } }))
  },
}, {
  method: GET,
  path: '/meetings/next',
  handler: async (_request, h) => {
    return h.response(await db.Meeting.findOne({ where: { date: { [db.Sequelize.Op.gt]: new Date() } }, raw: true }))
  },
}, {
  method: POST,
  path: '/meeting/create',
  options: {
    auth: { strategy: 'jwt', scope: ['admin'] },
    validate: {
      payload: Joi.object({
        date: Joi.date(),
      }),
      failAction: async (_request, _h, error) => {
        return boom.badRequest(error)
      },
    },
    handler: async (request, h) => {
      return h.response(await db.Meeting.create(request.payload))
    },
  },
}, {
  method: POST,
  path: '/meeting/edit',
  options: {
    auth: { strategy: 'jwt', scope: ['admin'] },
    validate: {
      payload: Joi.object({
        meetingId: Joi.number(),
        date: Joi.date(),
      }),
      failAction: async (_request, _h, error) => {
        return boom.badRequest(error)
      },
    },
    handler: async (request, h) => {
      return h.response(await db.Meeting.upsert(request.payload))
    },
  },
}, {
  method: POST,
  path: '/meeting/delete',
  options: {
    auth: { strategy: 'jwt', scope: ['admin'] },
    validate: {
      payload: Joi.object({
        meetingId: Joi.number(),
      }),
      failAction: async (_request, _h, error) => {
        return boom.badRequest(error)
      },
    },
    handler: async (request, h) => {
      return h.response(await db.Meeting.destroy({ where: { meetingId: request.payload.meetingId } }))
    },
  },
}, {
  method: POST,
  path: '/meeting/refresh',
  options: {
    auth: { strategy: 'jwt', scope: ['admin'] },
    validate: {
      payload: Joi.object({
        startDate: Joi.date(),
        meetings: Joi.number(),
      }),
      failAction: async (_request, _h, error) => {
        return boom.badRequest(error)
      },
    },
    handler: async (_request, h) => {
      return h.response()
    },
  },
}]
