import { run } from './run.ts'

export async function confirmPlayers (players: any[]) {
  const invalid = players.filter((p: any) => !p.teamId || !p.position)
  if (invalid.length) {
    return { success: false, message: 'All players must have a teamId and position' }
  }

  await run(players)
  return { success: true }
}
