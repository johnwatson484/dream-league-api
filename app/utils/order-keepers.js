import { sortArray } from './sort-array.js'

const orderKeepers = (keepers) => {
  return keepers.sort((a, b) => { return sortArray(a.substitute, b.substitute) || sortArray(a.name, b.name) })
}

export { orderKeepers }
