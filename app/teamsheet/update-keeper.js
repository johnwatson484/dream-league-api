const db = require('../data')

const update = async (payload) => {
  const manager = await getManager(payload.managerId)
  await updateTeams(payload.teamIds, manager)
  await updateSubs(payload.teamSubs, payload.managerId)
  return {
    success: true
  }
}

const updateSubs = async (teamSubs, managerId) => {
  const selectedSubIds = getSelectedSubIds(teamSubs)
  const currentSubs = await getCurrentSubs(managerId)

  await deleteOldSubs(currentSubs, selectedSubIds)
  await addNewSubs(selectedSubIds, currentSubs, managerId)
}

const updateTeams = async (teamIds, manager) => {
  const selectedTeamIds = getSelectedTeamIds(teamIds)
  const currentTeamIds = getCurrentTeamIds(manager.dataValues.keepers)

  await deleteOldKeepers(currentTeamIds, selectedTeamIds, manager.managerId)
  await addNewKeepers(selectedTeamIds, currentTeamIds, manager.managerId)
}

const addNewSubs = async (selectedSubIds, currentSubs, managerId) => {
  for (const selectedSubId of selectedSubIds) {
    if (!currentSubs.includes(selectedSubId)) {
      const managerKeeper = await db.ManagerKeeper.findOne({ where: { managerId, teamId: selectedSubId } })
      managerKeeper.substitute = true
      await managerKeeper.save()
    }
  }
}

const deleteOldSubs = async (currentSubs, selectedSubIds) => {
  for (const currentSub of currentSubs) {
    if (!selectedSubIds.includes(currentSub.teamId)) {
      currentSub.substitute = false
      await currentSub.save()
    }
  }
}

const getCurrentSubs = async (managerId) => {
  return db.ManagerKeeper.findAll({ where: { managerId, substitute: true } })
}

const getSelectedSubIds = (teamSubs) => {
  teamSubs = Array.isArray(teamSubs) ? teamSubs : [teamSubs]
  return teamSubs.filter(x => x !== 0 && x !== undefined)
}

const addNewKeepers = async (selectedTeamIds, currentTeamIds, managerId) => {
  for (const selectedTeam of selectedTeamIds) {
    if (!currentTeamIds.includes(selectedTeam)) {
      await db.ManagerKeeper.create({ managerId, teamId: selectedTeam, substitute: false })
    }
  }
}

const deleteOldKeepers = async (currentTeamIds, selectedTeamIds, managerId) => {
  for (const currentTeamId of currentTeamIds) {
    const currentCount = currentTeamIds.filter(x => x.teamId === currentTeamId).length
    const selectedCount = selectedTeamIds.filter(x => x === currentTeamId).length

    if (!selectedTeamIds.includes(currentTeamId) ||
      currentCount > selectedCount) {
      await db.ManagerKeeper.destroy({ where: { teamId: currentTeamId, managerId }, limit: 1 })
    }
  }
}

const getCurrentTeamIds = (teams) => {
  return teams.map(x => x.teamId)
}

const getSelectedTeamIds = (teamIds) => {
  teamIds = Array.isArray(teamIds) ? teamIds : [teamIds]
  return teamIds.filter(x => x !== 0 && x !== undefined)
}

const getManager = async (managerId) => {
  return db.Manager.findOne({
    where: { managerId },
    include: [
      {
        model: db.Team,
        as: 'keepers',
        attributes: ['teamId', 'name'],
        through: { attributes: ['substitute'] }
      }
    ],
    nest: true
  })
}

module.exports = {
  update
}
