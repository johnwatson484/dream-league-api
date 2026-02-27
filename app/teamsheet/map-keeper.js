const mapKeeper = (keeper, teamsheet) => {
  const teamsheetEntry = teamsheet.find(x => x.bestMatchId === keeper.teamId && x.position === 'Goalkeeper')
  return {
    playerId: keeper.teamId,
    teamId: keeper.teamId,
    name: keeper.name,
    sourceName: teamsheetEntry ? teamsheetEntry.player : '',
    matchDistance: teamsheetEntry ? teamsheetEntry.distance : '',
    substitute: keeper.managerKeepers.dataValues.substitute,
  }
}

module.exports = {
  mapKeeper,
}
