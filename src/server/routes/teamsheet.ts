import { failAction } from './fail-action.ts'
import type { ServerRoute } from '@hapi/hapi'
import Joi from 'joi'
import { getTeamsheet } from '../../teamsheet/get-teamsheet.ts'
import { updatePlayer } from '../../teamsheet/update-player.ts'
import { updateKeeper } from '../../teamsheet/update-keeper.ts'
import { previewMatches } from '../../refresh/teamsheet/preview-matches.ts'
import { confirmTeamsheet } from '../../refresh/teamsheet/confirm-teamsheet.ts'

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
  path: '/teamsheet/match-preview',
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
      return h.response(await previewMatches((request.payload as any).teams))
    },
  },
}, {
  method: 'POST',
  path: '/teamsheet/confirm',
  options: {
    auth: { strategy: 'jwt', scope: ['admin'] },
    validate: {
      payload: Joi.object({
        assignments: Joi.array().items(Joi.object({
          managerId: Joi.number().required(),
          playerId: Joi.number().required(),
          substitute: Joi.bool().required(),
        })).required(),
        keeperAssignments: Joi.array().items(Joi.object({
          managerId: Joi.number().required(),
          teamId: Joi.number().required(),
          substitute: Joi.bool().required(),
        })).required(),
        teamsheetRecords: Joi.array().items(Joi.object({
          managerId: Joi.number().required(),
          player: Joi.string().required(),
          position: Joi.string().allow('').required(),
          substitute: Joi.bool().required(),
          bestMatchId: Joi.number().required(),
          distance: Joi.number().required(),
          confidence: Joi.number().required(),
          category: Joi.string().required(),
          parsedName: Joi.string().allow('').required(),
          parsedTeam: Joi.string().allow('').required(),
        })).min(1).required(),
      }),
      failAction,
    },
    handler: async (request, h) => {
      return h.response(await confirmTeamsheet(request.payload as any))
    },
  },
}] satisfies ServerRoute[]
