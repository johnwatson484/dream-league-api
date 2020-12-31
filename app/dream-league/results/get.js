const db = require('../../data/models')
const getKeepers = require('./get-keepers')
const getPlayers = require('./get-players')

async function get () {
  const gameweeks = await db.Gameweek.findAll()
  const keepers = await getKeepers()
  const players = await getPlayers()
  return { gameweeks, keepers, players }
}

module.exports = get
