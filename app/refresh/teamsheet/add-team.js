const db = require('../../data')

const addTeamsheetMatch = async (managerId, player, position, bestMatchId, distance) => {
  await db.Teamsheet.create({
    managerId,
    player: player.player,
    position,
    substitute: player.substitute,
    bestMatchId,
    distance,
  })
}

const addPlayer = async (managerId, playerId, substitute) => {
  return db.ManagerPlayer.create({
    managerId,
    playerId,
    substitute,
  })
}

const addKeeper = async (managerId, teamId, substitute) => {
  return db.ManagerKeeper.create({
    managerId,
    teamId,
    substitute,
  })
}

module.exports = {
  addTeamsheetMatch,
  addPlayer,
  addKeeper,
}
