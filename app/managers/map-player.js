const mapPlayer = (player) => {
  return {
    playerId: player.dataValues.playerId,
    fullName: player.fullName,
    lastNameFirstName: player.lastNameFirstName,
    position: player.dataValues.position,
    team: player.dataValues.team.dataValues.name,
    substitute: player.managerPlayers.dataValues.substitute,
    goals: player.goals?.filter(x => !x.cup).length ?? 0,
    cupGoals: player.goals?.filter(x => x.cup).length ?? 0
  }
}

module.exports = {
  mapPlayer
}
