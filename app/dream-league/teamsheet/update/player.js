const db = require('../../../data/models')

async function update (payload) {
  const manager = await getManager(payload.managerId)
  await updatePlayers(payload.playerIds, manager, payload.managerId)
  await updateSubs(payload.playerSubs, payload.managerId)
}

async function updateSubs (playerSubs, managerId) {
  const selectedSubIds = getSelectedSubIds(playerSubs)
  const currentSubs = await getCurrentSubs(managerId)

  await deleteOldSubs(currentSubs, selectedSubIds)
  await addNewSubs(selectedSubIds, currentSubs, managerId)
}

async function updatePlayers (playerIds, manager, managerId) {
  const selectedPlayerIds = getSelectedPlayerIds(playerIds)
  const currentPlayerIds = getCurrentPlayerIds(manager.dataValues.players)

  await deleteOldPlayers(currentPlayerIds, selectedPlayerIds)
  await addNewPlayers(selectedPlayerIds, currentPlayerIds, managerId)
}

async function addNewSubs (selectedSubIds, currentSubs, managerId) {
  for (const selectedSub of selectedSubIds) {
    if (!currentSubs.includes(selectedSub)) {
      const managerPlayer = await db.ManagerPlayer.findOne({ where: { managerId, playerId: selectedSub } })
      managerPlayer.substitute = true
      await managerPlayer.save()
    }
  }
}

async function deleteOldSubs (currentSubs, selectedSubIds) {
  for (const currentSub of currentSubs) {
    if (!selectedSubIds.includes(currentSub.playerId)) {
      currentSub.substitute = false
      await currentSub.save()
    }
  }
}

async function getCurrentSubs (managerId) {
  return await db.ManagerPlayer.findAll({ where: { managerId, substitute: true } })
}

function getSelectedSubIds (playerSubs) {
  return playerSubs.filter(x => x !== 0)
}

async function addNewPlayers (selectedPlayerIds, currentPlayerIds, managerId) {
  for (const selectedPlayer of selectedPlayerIds) {
    if (!currentPlayerIds.includes(selectedPlayer)) {
      await db.ManagerPlayer.create({ managerId, playerId: selectedPlayer })
    }
  }
}

async function deleteOldPlayers (currentPlayerIds, selectedPlayerIds) {
  for (const currentPlayerId of currentPlayerIds) {
    const currentCount = currentPlayerIds.filter(x => x.playerId === currentPlayerId).length
    const selectedCount = selectedPlayerIds.filter(x => x === currentPlayerId).length

    if (!selectedPlayerIds.includes(currentPlayerId) ||
      currentCount > selectedCount) {
      await db.ManagerPlayer.destroy({ where: { playerId: currentPlayerId }, limit: 1 })
    }
  }
}

function getCurrentPlayerIds (players) {
  return players.map(x => x.playerId)
}

function getSelectedPlayerIds (playerIds) {
  return playerIds.filter(x => x !== 0)
}

async function getManager (managerId) {
  return await db.Manager.findOne({
    where: { managerId },
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
}

module.exports = update
