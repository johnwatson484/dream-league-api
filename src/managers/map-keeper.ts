export function mapKeeper (keeper: any) {
  return {
    playerId: keeper.teamId,
    teamId: keeper.teamId,
    name: keeper.name,
    substitute: keeper.managerKeepers.dataValues.substitute,
    conceded: keeper.conceded?.filter((x: any) => !x.cup).length ?? 0,
    cupConceded: keeper.conceded?.filter((x: any) => x.cup).length ?? 0,
  }
}
