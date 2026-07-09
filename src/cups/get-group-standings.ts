import db from '../data/index.ts'
import { getCupScores } from '../results/get-cup-scores.ts'
import { orderTable } from '../results/order-table.ts'

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

export async function getGroupStandings (cupId: number): Promise<GroupStanding[]> {
  const groups = await db.Group.findAll({
    where: { cupId },
    include: [{ model: db.Manager, as: 'managers' }],
  } as any)

  const fixtures = await db.Fixture.findAll({
    where: { cupId, round: 1 },
  })

  const gameweekIds = [...new Set((fixtures as any[]).map((x: any) => x.gameweekId))]
  const results: GroupStanding[] = []

  for (const group of groups as any[]) {
    if (!group.managers.length) { continue }

    const scores: any[] = []
    for (const gameweekId of gameweekIds) {
      const cupScores = await getCupScores(gameweekId, group.managers)
      scores.push(...cupScores)
    }

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
    results.push({ groupId: group.groupId, groupName: group.name, teamsAdvancing: group.teamsAdvancing || 2, table })
  }

  return results
}
