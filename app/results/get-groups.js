const db = require('../data')
const { getCupScores } = require('./get-cup-scores')
const { orderTable } = require('./order-table')

const getGroups = async (gameweekId) => {
  const cups = await db.Cup.findAll({ where: { hasGroupStage: true } })

  const groupTables = []
  for (const cup of cups) {
    const fixtures = await db.Fixture.findAll({
      where: {
        cupId: cup.cupId,
        gameweekId: { [db.Sequelize.Op.lte]: gameweekId },
        round: 1,
      },
    })

    // if no fixtures this gameweek no need to add groups
    if (!fixtures.some(x => x.gameweekId === gameweekId)) {
      continue
    }

    const gameweekIds = [...new Set(fixtures.map(x => x.gameweekId))]
    const groups = await db.Group.findAll({ where: { cupId: cup.cupId }, include: { model: db.Manager, as: 'managers' } })
    for (const group of groups) {
      if (group.managers.length) {
        const scores = []
        for (const gameweek of gameweekIds) {
          const cupScores = await getCupScores(gameweek, group.managers)
          Array.prototype.push.apply(scores, cupScores)
        }
        let table = []
        for (const manager of group.managers) {
          const managerScores = scores.filter(x => x.homeManagerId === manager.managerId || x.awayManagerId === manager.managerId)
          const homeWon = managerScores.filter(x => x.homeManagerId === manager.managerId && x.result === 'H').length
          const awayWon = managerScores.filter(x => x.awayManagerId === manager.managerId && x.result === 'A').length
          const won = homeWon + awayWon
          const homeDrawn = managerScores.filter(x => x.homeManagerId === manager.managerId && x.result === 'D').length
          const awayDrawn = managerScores.filter(x => x.awayManagerId === manager.managerId && x.result === 'D').length
          const drawn = homeDrawn + awayDrawn
          const homeLost = managerScores.filter(x => x.homeManagerId === manager.managerId && x.result === 'A').length
          const awayLost = managerScores.filter(x => x.awayManagerId === manager.managerId && x.result === 'H').length
          const lost = homeLost + awayLost
          const homeGF = managerScores.filter(x => x.homeManagerId === manager.managerId).reduce((x, y) => x + y.homeMargin, 0)
          const awayGF = managerScores.filter(x => x.awayManagerId === manager.managerId).reduce((x, y) => x + y.awayMargin, 0)
          const gf = homeGF + awayGF
          const homeGA = managerScores.filter(x => x.homeManagerId === manager.managerId).reduce((x, y) => x + y.awayMargin, 0)
          const awayGA = managerScores.filter(x => x.awayManagerId === manager.managerId).reduce((x, y) => x + y.homeMargin, 0)
          const ga = homeGA + awayGA
          const gd = gf - ga
          const points = (won * 3) + drawn
          const played = won + drawn + lost
          table.push({
            managerId: manager.managerId,
            manager: manager.name,
            played,
            won,
            drawn,
            lost,
            gf,
            ga,
            gd,
            points,
          })
        }
        table = orderTable(table)
        groupTables.push(table)
      }
    }
  }
  return groupTables
}

module.exports = {
  getGroups,
}
