const mapPlayer = (player, teamsheet) => {
  const teamsheetEntry = teamsheet.find(x => x.dataValues.bestMatchId === player.dataValues.playerId && x.dataValues.position === player.dataValues.position)
  return {
    playerId: player.dataValues.playerId,
    fullName: player.fullName,
    lastNameFirstName: player.lastNameFirstName,
    position: player.dataValues.position,
    team: player.dataValues.team.dataValues.name,
    sourceName: teamsheetEntry ? teamsheetEntry.player : '',
    matchDistance: teamsheetEntry ? teamsheetEntry.distance : '',
    substitute: player.managerPlayers.dataValues.substitute
  }
}

module.exports = {
  mapPlayer
}
