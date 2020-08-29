const joi = require('joi')
const boom = require('@hapi/boom')
const refresh = require('../../dream-league/teamsheet-refresh')

module.exports = [{
  method: 'POST',
  path: '/dream-league/teamsheet/refresh',
  options: {
    validate: {
      payload: joi.object({
        teams: joi.array().items(joi.object({
          firstName: joi.string().allow(''),
          lastName: joi.string().allow(''),
          position: joi.string().allow(''),
          team: joi.string().allow('')
        }))
      }),
      failAction: async (request, h, error) => {
        return boom.badRequest(error)
      }
    },
    handler: async (request, h) => {
      console.log(request.payload)
      return h.response(await refresh(request.payload.teams))
    }
  }
}]
