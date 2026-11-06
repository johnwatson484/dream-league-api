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
      const group: any = await db.Group.findOne({
        where: { groupId: request.query.groupId },
        include: [
          { model: db.Cup, as: 'cup', attributes: [] },
          { model: db.Manager, as: 'managers', attributes: ['managerId'], through: { attributes: [] } },
        ],
        attributes: ['groupId', 'cupId', 'name', 'groupLegs', 'teamsAdvancing', [db.Sequelize.col('cup.name'), 'cupName']],
      })
      return h.response(group ? { ...group.toJSON(), managers: group.managers.map((manager: any) => manager.managerId) } : null)
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
      const { managers = [], ...payload } = request.payload as any
      const group = await db.sequelize.transaction(async transaction => {
        const group: any = await db.Group.create(payload, { transaction })
        // Older season resets could leave memberships behind when reusing IDs.
        await db.ManagerGroup.destroy({ where: { groupId: group.groupId }, transaction })
        await db.ManagerGroup.bulkCreate(managers.map((managerId: number) => ({ managerId, groupId: group.groupId })), { transaction })
        return group
      })
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
        groupId: Joi.number().integer().required(),
        cupId: Joi.number().required(),
        name: Joi.string(),
        groupLegs: Joi.number(),
        teamsAdvancing: Joi.number(),
        managers: Joi.array().items(Joi.number()).single(),
      }),
      failAction,
    },
    handler: async (request, h) => {
      const { managers = [], ...payload } = request.payload as any
      await db.sequelize.transaction(async transaction => {
        await db.Group.upsert(payload, { transaction })
        await db.ManagerGroup.destroy({ where: { groupId: payload.groupId }, transaction })
        await db.ManagerGroup.bulkCreate(managers.map((managerId: number) => ({ managerId, groupId: payload.groupId })), { transaction })
      })
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
