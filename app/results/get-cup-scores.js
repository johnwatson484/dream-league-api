const db = require('../data')
const getScores = require('./get-scores')

const getCupScores = async (gameweekId, managers) => {
  const cupScores = []
  const scores = await getScores(gameweekId, managers, true)

  const fixtures = await db.Fixture.findAll({ where: { gameweekId }, include: [{ model: db.Cup, as: 'cup', attributes: ['name'] }] })

  for (const fixture of fixtures) {
    if (scores.some(x => x.managerId === fixture.homeManagerId || x.managerId === fixture.awayManagerId)) {
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
        homeManager: managers.find(x => x.managerId === fixture.homeManagerId)?.name,
        awayManagerId: fixture.awayManagerId,
        awayManager: managers.find(x => x.managerId === fixture.awayManagerId)?.name,
        homeScore,
        homeMargin,
        awayScore,
        awayMargin,
        result
      })
    }
  }

  return cupScores
}

const getCupResult = (homeMargin, awayMargin) => {
  if (homeMargin > awayMargin) {
    return 'H'
  }
  if (awayMargin > homeMargin) {
    return 'A'
  }
  return 'D'
}

module.exports = getCupScores
