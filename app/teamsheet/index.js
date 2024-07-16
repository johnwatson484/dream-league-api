const { getTeamsheet } = require('./get-teamsheet')
const { update: updatePlayer } = require('./update-player')
const { update: updateKeeper } = require('./update-keeper')

module.exports = {
  getTeamsheet,
  updatePlayer,
  updateKeeper,
}
