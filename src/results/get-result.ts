import { W, D, L } from '../constants/results.ts'

export function getResult (goals, conceded) {
  if (goals > conceded) {
    return W
  }
  if (goals < conceded) {
    return L
  }
  return D
}
