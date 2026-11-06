import { Op, type Transactionable } from 'sequelize'
import db from '../data/index.ts'
import { getCupScores } from './get-cup-scores.ts'
import { orderTable } from './order-table.ts'

function calculateManagerStats (manager: any, scores: any[]) {
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
  return { managerId: manager.managerId, manager: manager.name, played, won, drawn, lost, gf, ga, gd, points }
}

export async function getGroups (gameweekId: number, options: Transactionable = {}): Promise<any[]> {
  const cups = await db.Cup.findAll({ ...options, where: { hasGroupStage: true } })
  const summaries = await db.Summary.findAll({ ...options, attributes: ['gameweekId'] })
  const completedWeeks = new Set(summaries.map((summary: any) => summary.gameweekId))
  // The current results are being summarised before their summary is saved.
  completedWeeks.add(gameweekId)

  const cupTables = await Promise.all((cups as any[]).map(async cup => {
    const fixtures = await db.Fixture.findAll({
      ...options,
      where: {
        cupId: cup.cupId,
        gameweekId: { [Op.lte]: gameweekId },
        round: 1,
      },
    })

    if (!fixtures.length) { return [] }

    const gameweekIds = [...new Set((fixtures as any[]).map((fixture: any) => fixture.gameweekId))]
      .filter(gameweek => completedWeeks.has(gameweek))
    const groups = await db.Group.findAll({ ...options, where: { cupId: cup.cupId }, include: { model: db.Manager, as: 'managers' } } as any)
    return Promise.all((groups as any[]).filter(group => group.managers.length).map(async group => {
      const weeklyScores = await Promise.all(gameweekIds.map(gameweek => getCupScores(gameweek, group.managers, options)))
      const scores = weeklyScores.flat().filter(score => score.cupId === cup.cupId && score.round === 1)
      return orderTable(group.managers.map((manager: any) => calculateManagerStats(manager, scores)))
    }))
  }))
  return cupTables.flat()
}
