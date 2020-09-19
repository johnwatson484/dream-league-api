const db = require('../../../data/models')

async function update (payload) {
  const manager = await getManager(payload.managerId)
  await updateTeams(payload.teamIds, manager)
  await updateSubs(payload.teamSubs, payload.managerId)
  return {
    success: true
  }
}

async function updateSubs (teamSubs, managerId) {
  const selectedSubIds = getSelectedSubIds(teamSubs)
  const currentSubs = await getCurrentSubs(managerId)

  await deleteOldSubs(currentSubs, selectedSubIds)
  await addNewSubs(selectedSubIds, currentSubs, managerId)
}

async function updateTeams (teamIds, manager) {
  const selectedTeamIds = getSelectedTeamIds(teamIds)
  const currentTeamIds = getCurrentTeamIds(manager.dataValues.keepers)

  await deleteOldKeepers(currentTeamIds, selectedTeamIds, manager.managerId)
  await addNewKeepers(selectedTeamIds, currentTeamIds, manager.managerId)
}

async function addNewSubs (selectedSubIds, currentSubs, managerId) {
  for (const selectedSubId of selectedSubIds) {
    if (!currentSubs.includes(selectedSubId)) {
      const managerKeeper = await db.ManagerKeeper.findOne({ where: { managerId, teamId: selectedSubId } })
      managerKeeper.substitute = true
      await managerKeeper.save()
    }
  }
}

async function deleteOldSubs (currentSubs, selectedSubIds) {
  for (const currentSub of currentSubs) {
    if (!selectedSubIds.includes(currentSub.teamId)) {
      currentSub.substitute = false
      await currentSub.save()
    }
  }
}

async function getCurrentSubs (managerId) {
  return await db.ManagerKeeper.findAll({ where: { managerId, substitute: true } })
}

function getSelectedSubIds (teamSubs) {
  teamSubs = Array.isArray(teamSubs) ? teamSubs : [teamSubs]
  return teamSubs.filter(x => x !== 0 && x !== undefined)
}

async function addNewKeepers (selectedTeamIds, currentTeamIds, managerId) {
  for (const selectedTeam of selectedTeamIds) {
    if (!currentTeamIds.includes(selectedTeam)) {
      await db.ManagerKeeper.create({ managerId, teamId: selectedTeam, substitute: false })
    }
  }
}

async function deleteOldKeepers (currentTeamIds, selectedTeamIds, managerId) {
  for (const currentTeamId of currentTeamIds) {
    const currentCount = currentTeamIds.filter(x => x.teamId === currentTeamId).length
    const selectedCount = selectedTeamIds.filter(x => x === currentTeamId).length

    if (!selectedTeamIds.includes(currentTeamId) ||
      currentCount > selectedCount) {
      await db.ManagerKeeper.destroy({ where: { teamId: currentTeamId, managerId }, limit: 1 })
    }
  }
}

function getCurrentTeamIds (teams) {
  return teams.map(x => x.teamId)
}

function getSelectedTeamIds (teamIds) {
  teamIds = Array.isArray(teamIds) ? teamIds : [teamIds]
  return teamIds.filter(x => x !== 0 && x !== undefined)
}

async function getManager (managerId) {
  return await db.Manager.findOne({
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

module.exports = update
