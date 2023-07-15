const Joi = require('joi')
const boom = require('@hapi/boom')
const db = require('../../data')
const { GET, POST } = require('../../constants/verbs')

module.exports = [{
  method: GET,
  path: '/groups',
  options: {
    handler: async (_request, h) => {
      return h.response(await db.Group.findAll({
        include: [
          { model: db.Cup, as: 'cup' },
          { model: db.Manager, as: 'managers' }
        ],
        order: [['name']]
      }))
    }
  }
}, {
  method: GET,
  path: '/group',
  options: {
    handler: async (request, h) => {
      return h.response(await db.Group.findOne({
        where: { groupId: request.query.groupId },
        include: [
          { model: db.Cup, as: 'cup', attributes: [] },
          { model: db.Manager, as: 'managers', attributes: [] }
        ],
        attributes: ['groupId', 'cupId', 'name', 'groupLegs', 'teamsAdvancing', [db.Sequelize.col('cup.name'), 'cupName']]
      }))
    }
  }
}, {
  method: POST,
  path: '/group/create',
  options: {
    auth: { strategy: 'jwt', scope: ['admin'] },
    validate: {
      payload: Joi.object({
        cupId: Joi.number().required(),
        name: Joi.string(),
        groupLegs: Joi.number(),
        teamsAdvancing: Joi.number(),
        managers: Joi.array().items(Joi.number()).single()
      }),
      failAction: async (_request, _h, error) => {
        return boom.badRequest(error)
      }
    },
    handler: async (request, h) => {
      const group = await db.Group.create(request.payload)
      if (request.payload.managers) {
        for (const managerId of request.payload.managers) {
          await db.ManagerGroup.create({ managerId, groupId: group.groupId })
        }
      }
      return h.response(group)
    }
  }
}, {
  method: POST,
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
        managers: Joi.array().items(Joi.number()).single()
      }),
      failAction: async (_request, _h, error) => {
        return boom.badRequest(error)
      }
    },
    handler: async (request, h) => {
      await db.Group.upsert(request.payload)
      const managerGroup = await db.ManagerGroup.findAll({ where: { groupId: request.payload.groupId } })

      if (request.payload.managers) {
        for (const managerId of request.payload.managers) {
          if (!managerGroup.some(x => x.managerId === managerId)) {
            await db.ManagerGroup.create({ managerId, groupId: request.payload.groupId })
          }
        }
        for (const currentManager of managerGroup) {
          if (!request.payload.managers.some(x => x === currentManager.managerId)) {
            await db.ManagerGroup.destroy({ where: { managerId: currentManager.managerId, groupId: request.payload.groupId } })
          }
        }
      } else {
        await db.ManagerGroup.destroy({ where: { groupId: request.payload.groupId } })
      }
      return h.response()
    }
  }
}, {
  method: POST,
  path: '/group/delete',
  options: {
    auth: { strategy: 'jwt', scope: ['admin'] },
    validate: {
      payload: Joi.object({
        groupId: Joi.number()
      }),
      failAction: async (_request, _h, error) => {
        return boom.badRequest(error)
      }
    },
    handler: async (request, h) => {
      await db.ManagerGroup.destroy({ where: { groupId: request.payload.groupId } })
      await db.Group.destroy({ where: { groupId: request.payload.groupId } })
      return h.response()
    }
  }
}]
