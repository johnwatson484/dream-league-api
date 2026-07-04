import { sortArray } from './sort-array.ts'

export function orderKeepers (keepers) {
  return keepers.sort((a, b) => { return sortArray(a.substitute, b.substitute) || sortArray(a.name, b.name) })
}
