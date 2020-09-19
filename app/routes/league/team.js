const db = require('../../data/models')
const joi = require('joi')
const boom = require('@hapi/boom')

module.exports = [{
  method: 'GET',
  path: '/league/teams',
  options: {
    handler: async (request, h) => {
      return h.response(await db.Team.findAll({
        include: [{ model: db.Division, as: 'division', attributes: ['name'] }],
        order: [['division', 'rank'], ['name']]
      }))
    }
  }
}, {
  method: 'POST',
  path: '/league/teams/autocomplete',
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
      const teams = await db.Team.findAll({
        where: { name: { [db.Sequelize.Op.iLike]: request.payload.prefix + '%' } },
        order: [['name']]
      })
      return h.response(teams || [])
    }
  }
}]
