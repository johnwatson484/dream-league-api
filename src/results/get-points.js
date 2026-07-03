import { W, D } from '../constants/results.js'

export function getPoints (result) {
  switch (result) {
    case W:
      return 3
    case D:
      return 1
    default:
      return 0
  }
}
