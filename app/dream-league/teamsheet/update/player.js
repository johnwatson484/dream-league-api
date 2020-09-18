const db = require('../../../data/models')

async function update (payload) {
  const managerId = payload.managerId
  const playerIds = payload.playerIds
  const playerSubs = payload.playerSubs

  if (!playerSubs.length) {
    playerSubs.push(0)
  }

  const manager = await db.Manager.findOne({
    include: [
      {
        model: db.Player,
        as: 'players',
        attributes: ['playerId', 'firstName', 'lastName', 'position'],
        through: { attributes: ['substitute'] },
        include: { model: db.Team, as: 'team', attributes: ['teamId', 'name'] }
      }
    ],
    nest: true
  })

  if (!manager) {
    return
  }

  const selectedPlayers = playerIds.filter(x => x !== 0)
  const currentPlayers = manager.dataValues.players.map(x => x.playerId)

  for (const currentPlayer of currentPlayers) {
    const currentCount = currentPlayers.filter(x => x.playerId === currentPlayer).length
    const selectedCount = playerIds.filter(x => x === currentPlayer).length

    if (!selectedPlayers.includes(currentPlayer) ||
        currentCount > selectedCount) {
      await db.ManagerPlayer.destroy({ where: { playerId: currentPlayer }, limit: 1 })
    }
  }

  for (const selectedPlayer of selectedPlayers) {
    if (!currentPlayers.includes(selectedPlayer)) {
      await db.ManagerPlayer.create({ managerId, playerId: selectedPlayer })
    }
  }

  const selectedSubs = playerSubs.filter(x => x !== 0)
  const currentSubs = await db.ManagerPlayer.findAll({ where: { managerId, substitute: true } })

  for (const currentSub of currentSubs) {
    if (!selectedSubs.includes(currentSub.playerId)) {
      currentSub.substitute = false
      await currentSub.save()
    }
  }

  for (const selectedSub of selectedSubs) {
    if (!currentSubs.includes(selectedSub)) {
      const managerPlayer = await db.ManagerPlayer.findOne({ where: { managerId, playerId: selectedSub } })
      managerPlayer.substitute = true
      await managerPlayer.save()
    }
  }
}

module.exports = update
