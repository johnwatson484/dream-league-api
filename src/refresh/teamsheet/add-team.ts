import db from '../../data/index.ts'

export async function addTeamsheetMatch (managerId: number, player: any, position: string | undefined, bestMatchId: number, distance: number): Promise<void> {
  await db.Teamsheet.create({
    managerId,
    player: player.player,
    position,
    substitute: player.substitute,
    bestMatchId,
    distance,
  })
}

export async function addPlayer (managerId: number, playerId: number, substitute: boolean) {
  return db.ManagerPlayer.upsert({
    managerId,
    playerId,
    substitute,
  })
}

export async function addKeeper (managerId: number, teamId: number, substitute: boolean) {
  return db.ManagerKeeper.upsert({
    managerId,
    teamId,
    substitute,
  })
}
