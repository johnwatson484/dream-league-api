import { compare } from './compare.ts'

export function orderKeepers (keepers: any[]): any[] {
  return keepers.sort((a, b) => { return compare(a.substitute, b.substitute) || compare(a.name, b.name) })
}
