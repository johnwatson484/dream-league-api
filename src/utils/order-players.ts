import { sortArray } from './sort-array.ts'
import { rankPosition } from './rank-position.ts'

export function orderPlayers (players: any[]): any[] {
  return players.sort((a, b) => { return sortArray(rankPosition(a.position), rankPosition(b.position)) || sortArray(a.substitute, b.substitute) || sortArray(a.lastNameFirstName, b.lastNameFirstName) })
}
