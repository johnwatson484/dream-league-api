import Joi from 'joi'
import boom from '@hapi/boom'
import { getSummary } from '../../results/get-summary.js'
import { getInput } from '../../results/get-input.js'
import { update } from '../../results/update.js'
import { deleteResults } from '../../results/delete-results.js'
import { sendResults } from '../../notifications/send-results.js'
import { GET, POST, DELETE } from '../../constants/verbs.js'

export default [{
  method: GET,
  path: '/results',
  options: {
    validate: {
      query: Joi.object({
        gameweekId: Joi.number().optional(),
      }),
      failAction: async (_request, _h, error) => {
        return boom.badRequest(error)
      },
    },
    handler: async (request, h) => {
      const summary = await getSummary(request.query.gameweekId)
      return h.response(summary)
    },
  },
}, {
  method: GET,
  path: '/results-edit',
  options: {
    auth: { strategy: 'jwt', scope: ['admin'] },
    handler: async (_request, h) => {
      return h.response(await getInput())
    },
  },
}, {
  method: POST,
  path: '/results-edit',
  options: {
    auth: { strategy: 'jwt', scope: ['admin'] },
    validate: {
      payload: Joi.object({
        gameweekId: Joi.number(),
        conceded: Joi.array().items(Joi.object({ teamId: Joi.number(), conceded: Joi.number() })).single(),
        concededCup: Joi.array().items(Joi.object({ teamId: Joi.number(), conceded: Joi.number() })).single(),
        goals: Joi.array().items(Joi.object({ playerId: Joi.number(), goals: Joi.number() })).single(),
        goalsCup: Joi.array().items(Joi.object({ playerId: Joi.number(), goals: Joi.number() })).single(),
      }),
      failAction: async (_request, _h, error) => {
        return boom.badRequest(error)
      },
    },
    handler: async (request, h) => {
      await update(request.payload)
      return h.response(true)
    },
  },
}, {
  method: DELETE,
  path: '/results',
  options: {
    auth: { strategy: 'jwt', scope: ['admin'] },
    validate: {
      payload: Joi.object({
        gameweekId: Joi.number().required(),
      }),
      failAction: async (_request, _h, error) => {
        return boom.badRequest(error)
      },
    },
    handler: async (request, h) => {
      await deleteResults(request.payload.gameweekId)
      return h.response(true)
    },
  },
}, {
  method: POST,
  path: '/results-send',
  options: {
    auth: { strategy: 'jwt', scope: ['admin'] },
    validate: {
      payload: Joi.object({
        gameweekId: Joi.number().required(),
      }),
      failAction: async (_request, _h, error) => {
        return boom.badRequest(error)
      },
    },
    handler: async (request, h) => {
      await sendResults(request.payload.gameweekId)
      return h.response(true)
    },
  },
}]
