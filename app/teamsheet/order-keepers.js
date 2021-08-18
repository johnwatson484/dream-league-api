const sortArray = require('../utils/sort-array')

const orderKeepers = (keepers) => {
  return keepers.sort((a, b) => { return sortArray(a.substitute, b.substitute) || sortArray(a.name, b.name) })
}

module.exports = orderKeepers
