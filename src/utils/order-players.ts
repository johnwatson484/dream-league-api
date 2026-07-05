import { compare } from './compare.ts'
import { rankPosition } from './rank-position.ts'

export function orderPlayers (players: any[]): any[] {
  return players.sort((a, b) => { return compare(rankPosition(a.position), rankPosition(b.position)) || compare(a.substitute, b.substitute) || compare(a.lastNameFirstName, b.lastNameFirstName) })
}
