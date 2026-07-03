import { W, D } from '../constants/results.js'

const getPoints = (result) => {
  switch (result) {
    case W:
      return 3
    case D:
      return 1
    default:
      return 0
  }
}

export { getPoints }
