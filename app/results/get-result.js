const { W, D, L } = require('../constants/results')

const getResult = (goals, conceded) => {
  if (goals > conceded) {
    return W
  }
  if (goals < conceded) {
    return L
  }
  return D
}

module.exports = {
  getResult,
}
