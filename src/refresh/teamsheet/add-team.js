import db from '../../data/index.js'

export async function addTeamsheetMatch (managerId, player, position, bestMatchId, distance) {
  await db.Teamsheet.create({
    managerId,
    player: player.player,
    position,
    substitute: player.substitute,
    bestMatchId,
    distance,
  })
}

export async function addPlayer (managerId, playerId, substitute) {
  return db.ManagerPlayer.upsert({
    managerId,
    playerId,
    substitute,
  })
}

export async function addKeeper (managerId, teamId, substitute) {
  return db.ManagerKeeper.upsert({
    managerId,
    teamId,
    substitute,
  })
}
