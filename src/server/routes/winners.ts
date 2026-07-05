import type { ServerRoute } from '@hapi/hapi'
import { getAllWinners } from '../../results/get-all-winners.ts'

export default [{
  method: 'GET',
  path: '/winners',
  options: {
    auth: false,
    handler: async (_request, h) => {
      const winners = await getAllWinners()
      return h.response(winners)
    },
  },
}] satisfies ServerRoute[]
