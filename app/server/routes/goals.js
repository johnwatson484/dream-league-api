const Joi = require('joi')
const boom = require('@hapi/boom')
const db = require('../../data')
const { GET, POST } = require('../../constants/verbs')
const { OK } = require('../../constants/ok')
const { update } = require('../../results')

module.exports = [{
  method: GET,
  path: '/goals',
  options: {
    handler: async (_request, h) => {
      return h.response(await db.Goal.findAll({
        include: [{ model: db.Player, as: 'player', include: [{ model: db.Team, as: 'team' }] }],
        order: [['gameweekId', 'DESC'], ['goalId', 'DESC']],
      }))
    },
  },
}, {
  method: GET,
  path: '/goal',
  options: {
    handler: async (request, h) => {
      return h.response(await db.Goal.findOne({
        where: { goalId: request.query.goalId },
        include: [{ model: db.Player, as: 'player', include: [{ model: db.Team, as: 'team' }] }],
      }))
    },
  },
}, {
  method: POST,
  path: '/goal/delete',
  options: {
    auth: { strategy: 'jwt', scope: ['admin'] },
    validate: {
      payload: Joi.object({
        goalId: Joi.number(),
      }),
      failAction: async (_request, _h, error) => {
        return boom.badRequest(error)
      },
    },
    handler: async (request, h) => {
      const goal = await db.Goal.findOne({ where: { goalId: request.payload.goalId } })
      await db.Goal.destroy({ where: { goalId: request.payload.goalId } })
      await update({ gameweekId: goal.gameweekId })
      return h.response(OK)
    },
  },
}]
