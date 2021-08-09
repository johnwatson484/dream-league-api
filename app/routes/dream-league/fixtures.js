const db = require('../../data')
const joi = require('joi')
const boom = require('@hapi/boom')

module.exports = [{
  method: 'GET',
  path: '/dream-league/fixtures',
  options: {
    handler: async (request, h) => {
      return h.response(await db.Fixture.findAll({
        include: [
          { model: db.Cup, as: 'cup', attributes: [] },
          { model: db.Manager, as: 'homeManager', attributes: [] },
          { model: db.Manager, as: 'awayManager', attributes: [] }],
        attributes: ['fixtureId', 'gameweekId', 'cupId', 'round', [db.Sequelize.col('cup.name'), 'cupName'], [db.Sequelize.col('homeManager.name'), 'homeManagerName'], [db.Sequelize.col('awayManager.name'), 'awayManagerName']],
        order: [['gameweekId']]
      }))
    }
  }
}, {
  method: 'GET',
  path: '/dream-league/fixture',
  options: {
    handler: async (request, h) => {
      return h.response(await db.Fixture.findOne({ where: { fixtureId: request.query.fixtureId } }))
    }
  }
}, {
  method: 'POST',
  path: '/dream-league/fixture/create',
  options: {
    validate: {
      payload: joi.object({
        cupId: joi.number().integer().required(),
        gameweekId: joi.number().integer().required(),
        homeManagerId: joi.number().integer().required(),
        awayManagerId: joi.number().integer().required(),
        round: joi.number().integer().required()
      }),
      failAction: async (request, h, error) => {
        return boom.badRequest(error)
      }
    },
    handler: async (request, h) => {
      return h.response(await db.Fixture.create(request.payload))
    }
  }
}, {
  method: 'POST',
  path: '/dream-league/fixture/edit',
  options: {
    validate: {
      payload: joi.object({
        fixtureId: joi.number().integer().required(),
        cupId: joi.number().integer().required(),
        gameweekId: joi.number().integer().required(),
        homeManagerId: joi.number().integer().required(),
        awayManagerId: joi.number().integer().required(),
        round: joi.number().integer().required()
      }),
      failAction: async (request, h, error) => {
        return boom.badRequest(error)
      }
    },
    handler: async (request, h) => {
      return h.response(await db.Fixture.upsert(request.payload))
    }
  }
}, {
  method: 'POST',
  path: '/dream-league/fixture/delete',
  options: {
    validate: {
      payload: joi.object({
        fixtureId: joi.number()
      }),
      failAction: async (request, h, error) => {
        return boom.badRequest(error)
      }
    },
    handler: async (request, h) => {
      return h.response(await db.Fixture.destroy({ where: { fixtureId: request.payload.fixtureId } }))
    }
  }
}]
