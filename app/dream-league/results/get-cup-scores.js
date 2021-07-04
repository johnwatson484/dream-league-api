const db = require('../../data/models')
const getScores = require('./get-scores')

async function getCupScores (gameweekId, managers) {
  const cupScores = []
  const scores = await getScores(gameweekId, managers, true)

  const fixtures = await db.Fixture.findAll({ where: { gameweekId }, include: [{ model: db.Cup, as: 'cup', attributes: ['name'] }] })

  for (const fixture of fixtures) {
    const homeScore = scores.find(x => x.managerId === fixture.homeManagerId)
    const homeMargin = homeScore.goals - homeScore.conceded
    const awayScore = scores.find(x => x.managerId === fixture.awayManagerId)
    const awayMargin = awayScore.goals - awayScore.conceded
    const result = getCupResult(homeMargin, awayMargin)

    cupScores.push({
      cupId: fixture.cupId,
      cupName: fixture.cup.name,
      round: fixture.round,
      homeManagerId: fixture.homeManagerId,
      awayManagerId: fixture.awayManagerId,
      homeScore,
      homeMargin,
      awayScore,
      awayMargin,
      result
    })
  }

  return cupScores
}

function getCupResult (homeMargin, awayMargin) {
  if (homeMargin > awayMargin) {
    return 'home'
  }
  if (awayMargin > homeMargin) {
    return 'away'
  }
  return 'draw'
}

module.exports = getCupScores
