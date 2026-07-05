import { getGameweekResults } from './get-gameweek-results.ts'
import { orderTable } from './order-table.ts'
import { W, D, L } from '../constants/results.ts'

export async function getTable (gameweekId: number, managers: any[]): Promise<any[]> {
  const rows = []
  for (const manager of managers) {
    const gameweekResults = await getGameweekResults(gameweekId, manager.managerId)
    const won = gameweekResults.filter(x => x.result === W).length
    const drawn = gameweekResults.filter(x => x.result === D).length
    const lost = gameweekResults.filter(x => x.result === L).length
    const gf = gameweekResults.reduce((x, y) => x + y.goals, 0)
    const ga = gameweekResults.reduce((x, y) => x + y.conceded, 0)
    const gd = gf - ga
    const points = gameweekResults.reduce((x, y) => x + y.points, 0)
    rows.push({
      managerId: manager.managerId,
      manager: manager.name,
      played: gameweekId,
      won,
      drawn,
      lost,
      gf,
      ga,
      gd,
      points,
    })
  }
  return orderTable(rows)
}
