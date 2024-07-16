const { sortArray } = require('../utils/sort-array')

const orderTable = (rows) => {
  return rows.sort((a, b) => { return sortArray(b.points, a.points) || sortArray(b.gd, a.gd) || sortArray(b.gf, a.gf) || sortArray(a.manager, b.manager) })
    .map((x, i) => ({ position: i + 1, ...x }))
}

module.exports = {
  orderTable,
}
