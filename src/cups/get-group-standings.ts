import db from '../data/index.ts'
import { getCupScores } from '../results/get-cup-scores.ts'
import { orderTable } from '../results/order-table.ts'
import { Transaction } from 'sequelize'

interface StandingRow {
  position: number
  managerId: number
  manager: string
  played: number
  won: number
  drawn: number
  lost: number
  gf: number
  ga: number
  gd: number
  points: number
}

interface GroupStanding {
  groupId: number
  groupName: string
  teamsAdvancing: number
  table: StandingRow[]
}

export async function getGroupStandings (cupId: number, transaction?: Transaction): Promise<GroupStanding[]> {
  if (!transaction) {
    return db.sequelize.transaction({ isolationLevel: Transaction.ISOLATION_LEVELS.REPEATABLE_READ }, transaction => getGroupStandings(cupId, transaction))
  }
  const options = { transaction }
  const groups = await db.Group.findAll({
    ...options,
    where: { cupId },
    include: [{ model: db.Manager, as: 'managers' }],
  } as any)

  const fixtures = await db.Fixture.findAll({
    ...options,
    where: { cupId, round: 1 },
  })

  const summaries = await db.Summary.findAll({ ...options, attributes: ['gameweekId'] })
  const completedWeeks = new Set(summaries.map((summary: any) => summary.gameweekId))
  const gameweekIds = [...new Set((fixtures as any[]).map((x: any) => x.gameweekId))]
    .filter(gameweekId => completedWeeks.has(gameweekId))
  return Promise.all((groups as any[]).filter(group => group.managers.length).map(async group => {
    const weeklyScores = await Promise.all(gameweekIds.map(gameweekId => getCupScores(gameweekId, group.managers, options)))
    const scores = weeklyScores.flat().filter(score => score.cupId === cupId && score.round === 1)

    let table: any[] = []
    for (const manager of group.managers) {
      const managerScores = scores.filter((x: any) => x.homeManagerId === manager.managerId || x.awayManagerId === manager.managerId)
      const homeWon = managerScores.filter((x: any) => x.homeManagerId === manager.managerId && x.result === 'H').length
      const awayWon = managerScores.filter((x: any) => x.awayManagerId === manager.managerId && x.result === 'A').length
      const won = homeWon + awayWon
      const homeDrawn = managerScores.filter((x: any) => x.homeManagerId === manager.managerId && x.result === 'D').length
      const awayDrawn = managerScores.filter((x: any) => x.awayManagerId === manager.managerId && x.result === 'D').length
      const drawn = homeDrawn + awayDrawn
      const lost = managerScores.length - won - drawn
      const homeGF = managerScores.filter((x: any) => x.homeManagerId === manager.managerId).reduce((acc: number, x: any) => acc + x.homeMargin, 0)
      const awayGF = managerScores.filter((x: any) => x.awayManagerId === manager.managerId).reduce((acc: number, x: any) => acc + x.awayMargin, 0)
      const gf = homeGF + awayGF
      const homeGA = managerScores.filter((x: any) => x.homeManagerId === manager.managerId).reduce((acc: number, x: any) => acc + x.awayMargin, 0)
      const awayGA = managerScores.filter((x: any) => x.awayManagerId === manager.managerId).reduce((acc: number, x: any) => acc + x.homeMargin, 0)
      const ga = homeGA + awayGA
      const gd = gf - ga
      const points = (won * 3) + drawn
      table.push({ managerId: manager.managerId, manager: manager.name, played: won + drawn + lost, won, drawn, lost, gf, ga, gd, points })
    }

    table = orderTable(table)
    return { groupId: group.groupId, groupName: group.name, teamsAdvancing: group.teamsAdvancing || 2, table }
  }))
}
