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
          manager: joi.string(),
          players: joi.array().items(joi.object({
            player: joi.string(),
            position: joi.string(),
            substitute: joi.bool()
          }))
        }))
      }),
      failAction: async (request, h, error) => {
        return boom.badRequest(error)
      }
    },
    handler: async (request, h) => {
      return h.response(await refresh(request.payload.teams))
    }
  }
}]
