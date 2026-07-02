import { GK, DEF, MID, FWD } from '../constants/position-codes.js'
import { GOALKEEPER, DEFENDER, MIDFIELDER, FORWARD } from '../constants/positions.js'

const mapPosition = (position) => {
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

export { mapPosition }
