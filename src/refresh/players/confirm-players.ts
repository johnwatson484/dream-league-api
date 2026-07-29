import { run } from './run.ts'
import { mapPosition } from '../map-position.ts'
import { GOALKEEPER, DEFENDER, MIDFIELDER, FORWARD } from '../../constants/positions.ts'

const validPositions = new Set([GOALKEEPER, DEFENDER, MIDFIELDER, FORWARD])

export async function confirmPlayers (players: any[]) {
  const normalised = players.map((p: any) => ({
    ...p,
    position: mapPosition(p.position) ?? p.position,
  }))

  const invalid = normalised.filter((p: any) => !p.teamId || !validPositions.has(p.position))
  if (invalid.length) {
    return { success: false, message: 'All players must have a teamId and position' }
  }

  await run(normalised)
  return { success: true }
}
