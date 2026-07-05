import type { ServerRoute } from '@hapi/hapi'
import Joi from 'joi'
import boom from '@hapi/boom'
import { getSummary } from '../../results/get-summary.ts'
import { getInput } from '../../results/get-input.ts'
import { update } from '../../results/update.ts'
import { deleteResults } from '../../results/delete-results.ts'
import { sendResults } from '../../notifications/send-results.ts'
import { GET, POST, DELETE } from '../../constants/verbs.ts'

export default [{
  method: GET,
  path: '/results',
  options: {
    auth: false,
    validate: {
      query: Joi.object({
        gameweekId: Joi.number().optional(),
      }),
      failAction: async (_request, _h, error) => {
        return boom.badRequest(error?.message)
      },
    },
    handler: async (request, h) => {
      const summary = await getSummary(request.query.gameweekId ? Number(request.query.gameweekId) : undefined)
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
        return boom.badRequest(error?.message)
      },
    },
    handler: async (request, h) => {
      await update(request.payload as any)
      return h.response(true as any)
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
        return boom.badRequest(error?.message)
      },
    },
    handler: async (request, h) => {
      await deleteResults((request.payload as any).gameweekId)
      return h.response(true as any)
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
        return boom.badRequest(error?.message)
      },
    },
    handler: async (request, h) => {
      await sendResults((request.payload as any).gameweekId)
      return h.response(true as any)
    },
  },
}] satisfies ServerRoute[]
