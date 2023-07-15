const { GK, DEF, MID, FWD } = require('../constants/position-codes')
const { GOALKEEPER, DEFENDER, MIDFIELDER, FORWARD } = require('../constants/positions')

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

module.exports = {
  mapPosition
}
