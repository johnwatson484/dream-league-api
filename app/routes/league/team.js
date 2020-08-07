const boom = require('@hapi/boom')
const joi = require('@hapi/joi')
const db = require('../../data/models')

module.exports = [{
  method: 'GET',
  path: '/league/teams',
  options: {
    handler: async (request, h) => {
      return h.response(await db.Team.findAll())
    }
  }
}, {
  method: 'POST',
  path: '/league/team/create',
  options: {
    validate: {
      payload: joi.object({
        divisionId: joi.number().required(),
        name: joi.string().required(),
        alias: joi.string().required(),
        rank: joi.number().required()
      }),
      failAction: async (request, h, error) => {
        return boom.badRequest(error)
      }
    },
    handler: async (request, h) => {
      return h.response(await db.Team.create(request.payload))
    }
  }
}]
