const db = require('../../data/models')

async function addTeamsheetMatch (managerId, player, position, bestMatchId, distance) {
  await db.Teamsheet.create({
    managerId,
    player: player.player,
    position,
    substitute: player.substitute,
    bestMatchId,
    distance
  })
}

async function addPlayer (managerId, playerId, substitute) {
  return await db.ManagerPlayer.create({
    managerId,
    playerId,
    substitute
  })
}

async function addKeeper (managerId, teamId, substitute) {
  return await db.ManagerKeeper.create({
    managerId,
    teamId,
    substitute
  })
}

module.exports = {
  addTeamsheetMatch,
  addPlayer,
  addKeeper
}
