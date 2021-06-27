const db = require('../../data/models')
const getKeepers = require('./get-keepers')
const getPlayers = require('./get-players')
const getCupWeeks = require('./get-cup-weeks')

async function getInput () {
  const gameweeks = await db.Gameweek.findAll()
  const cupWeeks = await getCupWeeks()
  const keepers = await getKeepers()
  const players = await getPlayers()
  return { gameweeks, cupWeeks, keepers, players }
}

module.exports = getInput
