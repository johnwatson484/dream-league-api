import { W, D, L } from '../constants/results.js'

const getResult = (goals, conceded) => {
  if (goals > conceded) {
    return W
  }
  if (goals < conceded) {
    return L
  }
  return D
}

export { getResult }
