const Joi = require('joi')
const boom = require('@hapi/boom')
const { search } = require('../../search')
const { POST } = require('../../constants/verbs')

module.exports = [{
  method: POST,
  path: '/search/autocomplete',
  options: {
    validate: {
      payload: Joi.object({
        prefix: Joi.string().required(),
      }),
      failAction: async (_request, _h, error) => {
        return boom.badRequest(error)
      },
    },
    handler: async (request, h) => {
      const results = await search(request.payload.prefix)
      return h.response(results)
    },
  },
}]
