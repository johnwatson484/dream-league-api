const { getSummary } = require('./get-summary.js')
const { getInput } = require('./get-input')
const { update } = require('./update')
const { deleteResults } = require('./delete-results')
const { getAllWinners } = require('./get-all-winners')

module.exports = {
  getSummary,
  getInput,
  update,
  deleteResults,
  getAllWinners,
}
