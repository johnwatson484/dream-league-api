import { W, D } from '../constants/results.ts'

export function getPoints (result: string): number {
  switch (result) {
    case W:
      return 3
    case D:
      return 1
    default:
      return 0
  }
}
