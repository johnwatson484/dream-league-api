const db = require('../../../data')

async function update (payload) {
  const manager = await getManager(payload.managerId)
  await updatePlayers(payload.playerIds, manager)
  await updateSubs(payload.playerSubs, payload.managerId)
  return {
    success: true
  }
}

async function updateSubs (playerSubs, managerId) {
  const selectedSubIds = getSelectedSubIds(playerSubs)
  const currentSubs = await getCurrentSubs(managerId)

  await deleteOldSubs(currentSubs, selectedSubIds)
  await addNewSubs(selectedSubIds, currentSubs, managerId)
}

async function updatePlayers (playerIds, manager) {
  const selectedPlayerIds = getSelectedPlayerIds(playerIds)
  const currentPlayerIds = getCurrentPlayerIds(manager.dataValues.players)

  await deleteOldPlayers(currentPlayerIds, selectedPlayerIds, manager.managerId)
  await addNewPlayers(selectedPlayerIds, currentPlayerIds, manager.managerId)
}

async function addNewSubs (selectedSubIds, currentSubs, managerId) {
  for (const selectedSubId of selectedSubIds) {
    if (!currentSubs.includes(selectedSubId)) {
      const managerPlayer = await db.ManagerPlayer.findOne({ where: { managerId, playerId: selectedSubId } })
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
  playerSubs = Array.isArray(playerSubs) ? playerSubs : [playerSubs]
  return playerSubs.filter(x => x !== 0 && x !== undefined)
}

async function addNewPlayers (selectedPlayerIds, currentPlayerIds, managerId) {
  for (const selectedPlayerId of selectedPlayerIds) {
    if (!currentPlayerIds.includes(selectedPlayerId)) {
      await db.ManagerPlayer.create({ managerId, playerId: selectedPlayerId, substitute: false })
    }
  }
}

async function deleteOldPlayers (currentPlayerIds, selectedPlayerIds, managerId) {
  for (const currentPlayerId of currentPlayerIds) {
    const currentCount = currentPlayerIds.filter(x => x.playerId === currentPlayerId).length
    const selectedCount = selectedPlayerIds.filter(x => x === currentPlayerId).length

    if (!selectedPlayerIds.includes(currentPlayerId) ||
      currentCount > selectedCount) {
      await db.ManagerPlayer.destroy({ where: { playerId: currentPlayerId, managerId }, limit: 1 })
    }
  }
}

function getCurrentPlayerIds (players) {
  return players.map(x => x.playerId)
}

function getSelectedPlayerIds (playerIds) {
  playerIds = Array.isArray(playerIds) ? playerIds : [playerIds]
  return playerIds.filter(x => x !== 0 && x !== undefined)
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
