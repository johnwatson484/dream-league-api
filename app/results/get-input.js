const db = require('../data')
const { getKeepers } = require('./get-keepers')
const { getPlayers } = require('./get-players')
const { getCupWeeks } = require('./get-cup-weeks')

const getInput = async () => {
  const gameweeks = await db.Gameweek.findAll()
  const cupWeeks = await getCupWeeks()
  const keepers = await getKeepers()
  const players = await getPlayers()
  return { gameweeks, cupWeeks, keepers, players }
}

module.exports = {
  getInput,
}
