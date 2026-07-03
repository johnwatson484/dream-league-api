import { getAllWinners } from '../../results/get-all-winners.js'
import { GET } from '../../constants/verbs.js'

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
