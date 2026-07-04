import { GK, DEF, MID, FWD } from '../constants/position-codes.ts'
import { GOALKEEPER, DEFENDER, MIDFIELDER, FORWARD } from '../constants/positions.ts'

export function mapPosition (position) {
  switch (position) {
    case GK:
      return GOALKEEPER
    case DEF:
      return DEFENDER
    case MID:
      return MIDFIELDER
    case FWD:
      return FORWARD
    default:
      return undefined
  }
}
