import db from '../data/index.ts'

export async function updateKeeper (payload: any): Promise<any> {
  const manager = await getManager(payload.managerId)
  await updateTeams(payload.teamIds, manager)
  await updateSubs(payload.teamSubs, payload.managerId)
  return {
    success: true,
  }
}

async function updateSubs (teamSubs: any, managerId: number): Promise<void> {
  const selectedSubIds = getSelectedSubIds(teamSubs)
  const currentSubs = await getCurrentSubs(managerId)

  await deleteOldSubs(currentSubs, selectedSubIds)
  await addNewSubs(selectedSubIds, currentSubs, managerId)
}

async function updateTeams (teamIds: any, manager: any): Promise<void> {
  const selectedTeamIds = getSelectedTeamIds(teamIds)
  const currentTeamIds = getCurrentTeamIds(manager.dataValues.keepers)

  await deleteOldKeepers(currentTeamIds, selectedTeamIds, manager.managerId)
  await addNewKeepers(selectedTeamIds, currentTeamIds, manager.managerId)
}

async function addNewSubs (selectedSubIds: number[], currentSubs: any[], managerId: number): Promise<void> {
  for (const selectedSubId of selectedSubIds) {
    if (!currentSubs.includes(selectedSubId)) {
      const managerKeeper: any = await db.ManagerKeeper.findOne({ where: { managerId, teamId: selectedSubId } })
      managerKeeper.substitute = true
      await managerKeeper.save()
    }
  }
}

async function deleteOldSubs (currentSubs: any[], selectedSubIds: number[]): Promise<void> {
  for (const currentSub of currentSubs) {
    if (!selectedSubIds.includes(currentSub.teamId)) {
      currentSub.substitute = false
      await currentSub.save()
    }
  }
}

async function getCurrentSubs (managerId: number): Promise<any> {
  return db.ManagerKeeper.findAll({ where: { managerId, substitute: true } })
}

function getSelectedSubIds (teamSubs: any): number[] {
  teamSubs = Array.isArray(teamSubs) ? teamSubs : [teamSubs]
  return teamSubs.filter((x: any) => x !== 0 && x !== undefined)
}

async function addNewKeepers (selectedTeamIds: number[], currentTeamIds: number[], managerId: number): Promise<void> {
  for (const selectedTeam of selectedTeamIds) {
    if (!currentTeamIds.includes(selectedTeam)) {
      await db.ManagerKeeper.create({ managerId, teamId: selectedTeam, substitute: false })
    }
  }
}

async function deleteOldKeepers (currentTeamIds: number[], selectedTeamIds: number[], managerId: number): Promise<void> {
  for (const currentTeamId of currentTeamIds) {
    const currentCount = currentTeamIds.filter((x: any) => x.teamId === currentTeamId).length
    const selectedCount = selectedTeamIds.filter(x => x === currentTeamId).length

    if (!selectedTeamIds.includes(currentTeamId) ||
      currentCount > selectedCount) {
      await db.ManagerKeeper.destroy({ where: { teamId: currentTeamId, managerId }, limit: 1 })
    }
  }
}

function getCurrentTeamIds (teams: any[]): number[] {
  return teams.map(x => x.teamId)
}

function getSelectedTeamIds (teamIds: any): number[] {
  teamIds = Array.isArray(teamIds) ? teamIds : [teamIds]
  return teamIds.filter((x: any) => x !== 0 && x !== undefined)
}

async function getManager (managerId: number): Promise<any> {
  return db.Manager.findOne({
    where: { managerId },
    include: [
      {
        model: db.Team,
        as: 'keepers',
        attributes: ['teamId', 'name'],
        through: { attributes: ['substitute'] },
      },
    ],
    nest: true,
  })
}
