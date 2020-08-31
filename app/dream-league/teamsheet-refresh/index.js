const mapPosition = require('../../position')
const db = require('../../data/models')
const mapPlayer = require('./map-player')
const mapTeam = require('./map-team')

async function refresh (teams) {
  for (const team of teams) {
    const manager = await db.Manager.findOne({ attributes: ['managerId'], where: { alias: { [db.Sequelize.Op.iLike]: team.manager } }, raw: true })
    if (manager) {
      await deleteCurrentTeam(manager.managerId)
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
                substitute: player.substitute,
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
                substitute: player.substitute,
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

async function deleteCurrentTeam (managerId) {
  await db.ManagerKeeper.destroy({ where: { managerId } })
  await db.ManagerPlayer.destroy({ where: { managerId } })
  await db.Teamsheet.destroy({ where: { managerId } })
}

module.exports = refresh
