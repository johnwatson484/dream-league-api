const Joi = require('joi')
const boom = require('@hapi/boom')
const db = require('../../data')
const { GET, POST } = require('../../constants/verbs')
const { OK } = require('../../constants/ok')
const { update } = require('../../results')

module.exports = [{
  method: GET,
  path: '/conceded',
  options: {
    handler: async (_request, h) => {
      return h.response(await db.Concede.findAll({
        include: [{ model: db.Team, as: 'team' }],
        order: [['gameweekId', 'DESC'], ['concedeId', 'DESC']],
      }))
    },
  },
}, {
  method: GET,
  path: '/concede',
  options: {
    handler: async (request, h) => {
      return h.response(await db.Concede.findOne({
        where: { concedeId: request.query.concedeId },
        include: [{ model: db.Team, as: 'team' }],
      }))
    },
  },
}, {
  method: POST,
  path: '/concede/delete',
  options: {
    auth: { strategy: 'jwt', scope: ['admin'] },
    validate: {
      payload: Joi.object({
        concedeId: Joi.number(),
      }),
      failAction: async (_request, _h, error) => {
        return boom.badRequest(error)
      },
    },
    handler: async (request, h) => {
      const concede = await db.Concede.findOne({ where: { concedeId: request.payload.concedeId } })
      await db.Concede.destroy({ where: { concedeId: request.payload.concedeId } })
      await update({ gameweekId: concede.gameweekId })
      return h.response(OK)
    },
  },
}]
