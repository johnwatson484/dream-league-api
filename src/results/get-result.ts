import { W, D, L } from '../constants/results.ts'

export function getResult (goals: number, conceded: number): string {
  if (goals > conceded) {
    return W
  }
  if (goals < conceded) {
    return L
  }
  return D
}
