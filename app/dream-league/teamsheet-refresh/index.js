const mapPosition = require('../../position')
const db = require('../../data/models')
const calculateDistance = require('../../levenshtein')

async function refresh (teams) {
  for (const team of teams) {
    const manager = await db.Manager.findOne({ attributes: ['managerId'], where: { alias: { [db.Sequelize.Op.iLike]: team.manager } }, raw: true })
    if (manager) {
      await db.ManagerKeeper.destroy({ where: { managerId: manager.managerId } })
      await db.ManagerPlayer.destroy({ where: { managerId: manager.managerId } })
      await db.Teamsheet.destroy({ where: { managerId: manager.managerId } })
      const leagueTeams = await db.Team.findAll({ raw: true })
      const leaguePlayers = await db.Player.findAll({ include: [{ model: db.Team, as: 'team', attributes: ['alias'] }], raw: true, nest: true })
      for (const player of team.players) {
        const position = mapPosition(player.position)
        if (position === 'Goalkeeper') {
          const { bestMatchId, distance } = mapTeam(leagueTeams, player.player)
          if (bestMatchId !== -1) {
            try {
              await db.ManagerKeeper.create({
                managerId: manager.managerId,
                teamId: bestMatchId,
                substitute: player.substitute
              })
              await db.Teamsheet.create({
                managerId: manager.managerId,
                player: player.player,
                position: position,
                bestMatchId,
                distance
              })
            } catch (err) {
              console.error(err)
            }
          }
        } else {
          const { bestMatchId, distance } = mapPlayer(leaguePlayers, player.player, position)
          if (bestMatchId !== -1) {
            try {
              await db.ManagerPlayer.create({
                managerId: manager.managerId,
                playerId: bestMatchId,
                substitute: player.substitute
              })
              await db.Teamsheet.create({
                managerId: manager.managerId,
                player: player.player,
                position: position,
                bestMatchId,
                distance
              })
            } catch (err) {
              console.error(err)
            }
          }
        }
      }
    }
  }
  return {
    success: true
  }
}

function mapTeam (teams, matchTeam) {
  const matchText = matchTeam.replace(' ', '').toUpperCase()
  let bestDistance = -1
  let bestTeamId = -1

  for (const team of teams) {
    const distance = calculateDistance(matchText, team.alias.replace(' ', '').toUpperCase())
    if (bestDistance === -1 || distance < bestDistance) {
      bestDistance = distance
      bestTeamId = team.teamId
    }
  }

  return {
    bestMatchId: bestTeamId,
    distance: bestDistance
  }
}

function mapPlayer (players, matchPlayer, position) {
  const matchText = matchPlayer.replace(' ', '').toUpperCase()
  let bestDistance = -1
  let bestPlayerId = -1

  if (position) {
    players = players.filter(x => x.position === position)
  }

  for (const player of players) {
    const playerMatchText = `${player.lastName}-${player.team.alias}`.replace(' ', '').toUpperCase()
    const distance = calculateDistance(matchText, playerMatchText)
    if ((bestDistance === -1 || distance < bestDistance) || (distance === bestDistance && player.lastName.includes(matchText))) {
      bestDistance = distance
      bestPlayerId = player.playerId
    }
  }

  return {
    bestMatchId: bestPlayerId,
    distance: bestDistance
  }
}

module.exports = refresh
