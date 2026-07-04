import { getAllWinners } from '../../results/get-all-winners.ts'
import { GET } from '../../constants/verbs.ts'

export default [{
  method: GET,
  path: '/winners',
  options: {
    handler: async (_request, h) => {
      const winners = await getAllWinners()
      return h.response(winners)
    },
  },
}]
