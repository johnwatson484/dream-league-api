const Joi = require('joi')
const boom = require('@hapi/boom')
const db = require('../../../data')
const { GET, POST } = require('../../../constants/verbs')

module.exports = [{
  method: GET,
  path: '/league/divisions',
  options: {
    handler: async (_request, h) => {
      return h.response(await db.Division.findAll({
        order: [['rank']]
      }))
    }
  }
}, {
  method: POST,
  path: '/league/divisions/autocomplete',
  options: {
    validate: {
      payload: Joi.object({
        prefix: Joi.string()
      }),
      failAction: async (_request, _h, error) => {
        return boom.badRequest(error)
      }
    },
    handler: async (request, h) => {
      const divisions = await db.Division.findAll({
        where: { name: { [db.Sequelize.Op.iLike]: request.payload.prefix + '%' } },
        order: [['name']]
      })
      return h.response(divisions || [])
    }
  }
}]
