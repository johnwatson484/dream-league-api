import { failAction } from './fail-action.ts'
import type { ServerRoute } from '@hapi/hapi'
import Joi from 'joi'
import { getForm } from '../../statistics/get-form.ts'
import { getTopScorers } from '../../statistics/get-top-scorers.ts'
import { getHeadToHead } from '../../statistics/get-head-to-head.ts'
import { getManagerStats } from '../../statistics/get-manager-stats.ts'

export default [{
  method: 'GET',
  path: '/statistics/form',
  options: {
    auth: false,
    validate: {
      query: Joi.object({
        weeksToInclude: Joi.number().optional(),
      }),
      failAction,
    },
    handler: async (request, h) => {
      const weeksToInclude = Number(request.query.weeksToInclude) || 6
      const form = await getForm(weeksToInclude)
      return h.response(form)
    },
  },
}, {
  method: 'GET',
  path: '/statistics/top-scorers',
  options: {
    auth: false,
    handler: async (_request, h) => {
      const scorers = await getTopScorers()
      return h.response(scorers)
    },
  },
}, {
  method: 'GET',
  path: '/statistics/head-to-head',
  options: {
    auth: false,
    validate: {
      query: Joi.object({
        manager1: Joi.number().integer().required(),
        manager2: Joi.number().integer().required(),
      }),
      failAction,
    },
    handler: async (request, h) => {
      const { manager1, manager2 } = request.query as any
      const result = await getHeadToHead(Number(manager1), Number(manager2))
      return h.response(result)
    },
  },
}, {
  method: 'GET',
  path: '/statistics/manager-stats',
  options: {
    auth: false,
    validate: {
      query: Joi.object({
        managerId: Joi.number().integer().required(),
      }),
      failAction,
    },
    handler: async (request, h) => {
      const managerId = Number((request.query as any).managerId)
      const stats = await getManagerStats(managerId)
      return h.response(stats)
    },
  },
}] satisfies ServerRoute[]
