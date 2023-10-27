const { GET } = require('../../constants/verbs')
const { getLiveScores } = require('../../live-scores')

module.exports = [{
  method: GET,
  path: '/live-scores',
  options: {
    handler: async (request, h) => {
      const matches = await getLiveScores()
      console.log(matches)
      return h.response(matches)
    }
  }
}]
