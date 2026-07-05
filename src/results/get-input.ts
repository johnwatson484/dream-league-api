import db from '../data/index.ts'
import { getKeepers } from './get-keepers.ts'
import { getPlayers } from './get-players.ts'
import { getCupWeeks } from './get-cup-weeks.ts'

export async function getInput (): Promise<any> {
  const gameweeks = await db.Gameweek.findAll()
  const cupWeeks = await getCupWeeks()
  const keepers = await getKeepers()
  const players = await getPlayers()
  return { gameweeks, cupWeeks, keepers, players }
}
