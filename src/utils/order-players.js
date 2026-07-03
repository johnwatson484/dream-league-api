import { sortArray } from './sort-array.js'
import { rankPosition } from './rank-position.js'

export function orderPlayers (players) {
  return players.sort((a, b) => { return sortArray(rankPosition(a.position), rankPosition(b.position)) || sortArray(a.substitute, b.substitute) || sortArray(a.lastNameFirstName, b.lastNameFirstName) })
}
