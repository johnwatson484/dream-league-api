const { sortArray } = require('./sort-array')
const { rankPosition } = require('./rank-position')

const orderPlayers = (players) => {
  return players.sort((a, b) => { return sortArray(rankPosition(a.position), rankPosition(b.position)) || sortArray(a.substitute, b.substitute) || sortArray(a.lastNameFirstName, b.lastNameFirstName) })
}

module.exports = {
  orderPlayers
}
