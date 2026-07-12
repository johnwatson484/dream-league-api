import { failAction } from './fail-action.ts'
import type { ServerRoute } from '@hapi/hapi'
import Joi from 'joi'
import boom from '@hapi/boom'
import { createGoalReport } from '../../goal-reports/create-goal-report.ts'
import { getGoalReports } from '../../goal-reports/get-goal-reports.ts'
import { getFormData } from '../../goal-reports/get-form-data.ts'
import { acceptGoalReport } from '../../goal-reports/accept-goal-report.ts'
import { rejectGoalReport } from '../../goal-reports/reject-goal-report.ts'

export default [{
  method: 'POST',
  path: '/goal-reports',
  options: {
    auth: { strategy: 'jwt', scope: ['user'] },
    validate: {
      payload: Joi.object({
        playerId: Joi.number().integer().required(),
        managerId: Joi.number().integer().required(),
        gameweekId: Joi.number().integer().required(),
        goals: Joi.number().integer().min(0).max(10).required(),
        goalsCup: Joi.number().integer().min(0).max(10).required(),
        reason: Joi.string().max(500).allow('', null).optional(),
      }),
      failAction,
    },
    handler: async (request, h) => {
      const payload = request.payload as any
      const userId = (request.auth.credentials as any).userId
      try {
        const goalReport = await createGoalReport({ ...payload, submittedBy: userId })
        return h.response(goalReport).code(201)
      } catch (error: any) {
        return boom.badRequest(error.message)
      }
    },
  },
}, {
  method: 'GET',
  path: '/goal-reports',
  options: {
    auth: { strategy: 'jwt', scope: ['admin'] },
    validate: {
      query: Joi.object({
        status: Joi.string().valid('pending', 'approved', 'rejected').optional(),
      }),
      failAction,
    },
    handler: async (request, h) => {
      const status = (request.query as any).status
      const goalReports = await getGoalReports(status)
      return h.response(goalReports)
    },
  },
}, {
  method: 'GET',
  path: '/goal-reports/form-data',
  options: {
    auth: { strategy: 'jwt', scope: ['user'] },
    handler: async (_request, h) => {
      const formData = await getFormData()
      return h.response(formData)
    },
  },
}, {
  method: 'POST',
  path: '/goal-reports/{goalReportId}/accept',
  options: {
    auth: { strategy: 'jwt', scope: ['admin'] },
    validate: {
      params: Joi.object({
        goalReportId: Joi.number().integer().required(),
      }),
      failAction,
    },
    handler: async (request, h) => {
      const { goalReportId } = request.params as any
      const userId = (request.auth.credentials as any).userId
      try {
        await acceptGoalReport(goalReportId, userId)
        return h.response(true as any)
      } catch (error: any) {
        return boom.badRequest(error.message)
      }
    },
  },
}, {
  method: 'POST',
  path: '/goal-reports/{goalReportId}/reject',
  options: {
    auth: { strategy: 'jwt', scope: ['admin'] },
    validate: {
      params: Joi.object({
        goalReportId: Joi.number().integer().required(),
      }),
      failAction,
    },
    handler: async (request, h) => {
      const { goalReportId } = request.params as any
      const userId = (request.auth.credentials as any).userId
      try {
        await rejectGoalReport(goalReportId, userId)
        return h.response(true as any)
      } catch (error: any) {
        return boom.badRequest(error.message)
      }
    },
  },
}] satisfies ServerRoute[]
