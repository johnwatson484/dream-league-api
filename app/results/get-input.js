import db from '../data/index.js'
import { getKeepers } from './get-keepers.js'
import { getPlayers } from './get-players.js'
import { getCupWeeks } from './get-cup-weeks.js'

const getInput = async () => {
  const gameweeks = await db.Gameweek.findAll()
  const cupWeeks = await getCupWeeks()
  const keepers = await getKeepers()
  const players = await getPlayers()
  return { gameweeks, cupWeeks, keepers, players }
}

export { getInput }
