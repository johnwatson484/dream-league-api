import { failAction } from './fail-action.ts'
import type { ServerRoute } from '@hapi/hapi'
import Joi from 'joi'
import { getTeamsheet } from '../../teamsheet/get-teamsheet.ts'
import { updatePlayer } from '../../teamsheet/update-player.ts'
import { updateKeeper } from '../../teamsheet/update-keeper.ts'
import { refreshTeamsheet } from '../../refresh/teamsheet/refresh-teamsheet.ts'

export default [{
  method: 'GET',
  path: '/teamsheet',
  options: {
    auth: false,
    handler: async (_request, h) => {
      return h.response(await getTeamsheet())
    },
  },
}, {
  method: 'POST',
  path: '/teamsheet/edit/player',
  options: {
    auth: { strategy: 'jwt', scope: ['admin'] },
    validate: {
      payload: Joi.object({
        managerId: Joi.number(),
        playerIds: Joi.alternatives().try(Joi.array().items(Joi.number()), Joi.number()),
        playerSubs: Joi.alternatives().try(Joi.array().items(Joi.number()), Joi.number()),
      }),
      failAction,
    },
    handler: async (request, _h) => {
      return updatePlayer(request.payload as any)
    },
  },
}, {
  method: 'POST',
  path: '/teamsheet/edit/keeper',
  options: {
    auth: { strategy: 'jwt', scope: ['admin'] },
    validate: {
      payload: Joi.object({
        managerId: Joi.number(),
        teamIds: Joi.alternatives().try(Joi.array().items(Joi.string()), Joi.string()),
        teamSubs: Joi.alternatives().try(Joi.array().items(Joi.string()), Joi.string()),
      }),
      failAction,
    },
    handler: async (request, _h) => {
      return updateKeeper(request.payload as any)
    },
  },
}, {
  method: 'POST',
  path: '/teamsheet/refresh',
  options: {
    auth: { strategy: 'jwt', scope: ['admin'] },
    validate: {
      payload: Joi.object({
        teams: Joi.array().items(Joi.object({
          manager: Joi.string(),
          players: Joi.array().items(Joi.object({
            player: Joi.string(),
            position: Joi.string(),
            substitute: Joi.bool(),
          })),
        })),
      }),
      failAction,
    },
    handler: async (request, h) => {
      return h.response(await refreshTeamsheet((request.payload as any).teams))
    },
  },
}] satisfies ServerRoute[]
