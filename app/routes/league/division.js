const db = require('../../data/models')
const joi = require('joi')
const boom = require('@hapi/boom')

module.exports = [{
  method: 'GET',
  path: '/league/divisions',
  options: {
    handler: async (request, h) => {
      return h.response(await db.Division.findAll({
        order: [['rank']]
      }))
    }
  }
}, {
  method: 'POST',
  path: '/league/divisions/autocomplete',
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
      const divisions = await db.Division.findAll({
        where: { name: { [db.Sequelize.Op.iLike]: request.payload.prefix + '%' } },
        order: [['name']]
      })
      return h.response(divisions || [])
    }
  }
}]
