import type { ServerRoute } from '@hapi/hapi'
import { Op } from 'sequelize'
import db from '../../data/index.ts'
import { getManagers } from '../../managers/get-managers.ts'

export default [{
  method: 'GET',
  path: '/season/upcoming',
  options: {
    auth: false,
    handler: async (_request, h) => {
      const [firstGameweek, managers, lastSeason, nextMeeting] = await Promise.all([
        db.Gameweek.findOne({ order: ['gameweekId'] }),
        getManagers(),
        db.History.findOne({ order: [['year', 'DESC']] }),
        db.Meeting.findOne({ where: { date: { [Op.gt]: new Date() } }, raw: true }),
      ])

      return h.response({
        seasonStartDate: firstGameweek?.get('startDate') ?? null,
        managers,
        lastSeason,
        nextMeeting,
      })
    },
  },
}] satisfies ServerRoute[]
