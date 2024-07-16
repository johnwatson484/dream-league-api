const mapKeeper = (keeper) => {
  return {
    teamId: keeper.teamId,
    name: keeper.name,
    substitute: keeper.managerKeepers.dataValues.substitute,
    conceded: keeper.conceded?.filter(x => !x.cup).length ?? 0,
    cupConceded: keeper.conceded?.filter(x => x.cup).length ?? 0,
  }
}

module.exports = {
  mapKeeper,
}
