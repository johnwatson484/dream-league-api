import db from '../data/index.ts'

export async function updatePlayer (payload: any): Promise<any> {
  const manager = await getManager(payload.managerId)
  await updatePlayers(payload.playerIds, manager)
  await updateSubs(payload.playerSubs, payload.managerId)
  return {
    success: true,
  }
}

async function updateSubs (playerSubs: any, managerId: number): Promise<void> {
  const selectedSubIds = getSelectedSubIds(playerSubs)
  const currentSubs = await getCurrentSubs(managerId)

  await deleteOldSubs(currentSubs, selectedSubIds)
  await addNewSubs(selectedSubIds, currentSubs, managerId)
}

async function updatePlayers (playerIds: any, manager: any): Promise<void> {
  const selectedPlayerIds = getSelectedPlayerIds(playerIds)
  const currentPlayerIds = getCurrentPlayerIds(manager.dataValues.players)

  await deleteOldPlayers(currentPlayerIds, selectedPlayerIds, manager.managerId)
  await addNewPlayers(selectedPlayerIds, currentPlayerIds, manager.managerId)
}

async function addNewSubs (selectedSubIds: number[], currentSubs: any[], managerId: number): Promise<void> {
  for (const selectedSubId of selectedSubIds) {
    if (!currentSubs.includes(selectedSubId)) {
      const managerPlayer: any = await db.ManagerPlayer.findOne({ where: { managerId, playerId: selectedSubId } })
      managerPlayer.substitute = true
      await managerPlayer.save()
    }
  }
}

async function deleteOldSubs (currentSubs: any[], selectedSubIds: number[]): Promise<void> {
  for (const currentSub of currentSubs) {
    if (!selectedSubIds.includes(currentSub.playerId)) {
      currentSub.substitute = false
      await currentSub.save()
    }
  }
}

async function getCurrentSubs (managerId: number): Promise<any> {
  return db.ManagerPlayer.findAll({ where: { managerId, substitute: true } })
}

function getSelectedSubIds (playerSubs: any): number[] {
  playerSubs = Array.isArray(playerSubs) ? playerSubs : [playerSubs]
  return playerSubs.filter((x: any) => x !== 0 && x !== undefined)
}

async function addNewPlayers (selectedPlayerIds: number[], currentPlayerIds: number[], managerId: number): Promise<void> {
  for (const selectedPlayerId of selectedPlayerIds) {
    if (!currentPlayerIds.includes(selectedPlayerId)) {
      await db.ManagerPlayer.create({ managerId, playerId: selectedPlayerId, substitute: false })
    }
  }
}

async function deleteOldPlayers (currentPlayerIds: number[], selectedPlayerIds: number[], managerId: number): Promise<void> {
  for (const currentPlayerId of currentPlayerIds) {
    const currentCount = currentPlayerIds.filter((x: any) => x.playerId === currentPlayerId).length
    const selectedCount = selectedPlayerIds.filter(x => x === currentPlayerId).length

    if (!selectedPlayerIds.includes(currentPlayerId) ||
      currentCount > selectedCount) {
      await db.ManagerPlayer.destroy({ where: { playerId: currentPlayerId, managerId }, limit: 1 })
    }
  }
}

function getCurrentPlayerIds (players: any[]): number[] {
  return players.map(x => x.playerId)
}

function getSelectedPlayerIds (playerIds: any): number[] {
  playerIds = Array.isArray(playerIds) ? playerIds : [playerIds]
  return playerIds.filter((x: any) => x !== 0 && x !== undefined)
}

async function getManager (managerId: number): Promise<any> {
  return db.Manager.findOne({
    where: { managerId },
    include: [
      {
        model: db.Player,
        as: 'players',
        attributes: ['playerId', 'firstName', 'lastName', 'position'],
        through: { attributes: ['substitute'] },
        include: [{ model: db.Team, as: 'team', attributes: ['teamId', 'name'] }],
      },
    ],
    nest: true,
  } as any)
}
