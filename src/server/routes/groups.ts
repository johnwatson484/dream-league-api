import { failAction } from './fail-action.ts'
import type { ServerRoute } from '@hapi/hapi'
import Joi from 'joi'
import db from '../../data/index.ts'

export default [{
  method: 'GET',
  path: '/groups',
  options: {
    auth: false,
    handler: async (_request, h) => {
      return h.response(await db.Group.findAll({
        include: [
          { model: db.Cup, as: 'cup' },
          { model: db.Manager, as: 'managers' },
        ],
        order: [['name', 'ASC']],
      }))
    },
  },
}, {
  method: 'GET',
  path: '/group',
  options: {
    auth: false,
    handler: async (request, h) => {
      return h.response(await db.Group.findOne({
        where: { groupId: request.query.groupId },
        include: [
          { model: db.Cup, as: 'cup', attributes: [] },
          { model: db.Manager, as: 'managers', attributes: [] },
        ],
        attributes: ['groupId', 'cupId', 'name', 'groupLegs', 'teamsAdvancing', [db.Sequelize.col('cup.name'), 'cupName']],
      }) as any)
    },
  },
}, {
  method: 'POST',
  path: '/group/create',
  options: {
    auth: { strategy: 'jwt', scope: ['admin'] },
    validate: {
      payload: Joi.object({
        cupId: Joi.number().required(),
        name: Joi.string(),
        groupLegs: Joi.number(),
        teamsAdvancing: Joi.number(),
        managers: Joi.array().items(Joi.number()).single(),
      }),
      failAction,
    },
    handler: async (request, h) => {
      const group: any = await db.Group.create(request.payload as any)
      if ((request.payload as any).managers) {
        for (const managerId of (request.payload as any).managers) {
          await db.ManagerGroup.create({ managerId, groupId: group.groupId })
        }
      }
      return h.response(group)
    },
  },
}, {
  method: 'POST',
  path: '/group/edit',
  options: {
    auth: { strategy: 'jwt', scope: ['admin'] },
    validate: {
      payload: Joi.object({
        groupId: Joi.number(),
        cupId: Joi.number().required(),
        name: Joi.string(),
        groupLegs: Joi.number(),
        teamsAdvancing: Joi.number(),
        managers: Joi.array().items(Joi.number()).single(),
      }),
      failAction,
    },
    handler: async (request, h) => {
      const payload = request.payload as any
      await db.Group.upsert(payload)
      const managerGroup: any[] = await db.ManagerGroup.findAll({ where: { groupId: payload.groupId } })

      if (payload.managers) {
        for (const managerId of payload.managers) {
          if (!managerGroup.some((x: any) => x.managerId === managerId)) {
            await db.ManagerGroup.create({ managerId, groupId: payload.groupId })
          }
        }
        for (const currentManager of managerGroup) {
          if (!payload.managers.some((x: any) => x === (currentManager as any).managerId)) {
            await db.ManagerGroup.destroy({ where: { managerId: (currentManager as any).managerId, groupId: payload.groupId } })
          }
        }
      } else {
        await db.ManagerGroup.destroy({ where: { groupId: payload.groupId } })
      }
      return h.response()
    },
  },
}, {
  method: 'POST',
  path: '/group/delete',
  options: {
    auth: { strategy: 'jwt', scope: ['admin'] },
    validate: {
      payload: Joi.object({
        groupId: Joi.number(),
      }),
      failAction,
    },
    handler: async (request, h) => {
      await db.ManagerGroup.destroy({ where: { groupId: (request.payload as any).groupId } })
      await db.Group.destroy({ where: { groupId: (request.payload as any).groupId } })
      return h.response()
    },
  },
}] satisfies ServerRoute[]
