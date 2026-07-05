import db from '../data/index.ts'
import { getPoints } from '../results/get-points.ts'
import { compare } from '../utils/compare.ts'

export async function getForm (weeksToInclude: number = 6): Promise<any[]> {
  const managers = await db.Manager.findAll({ raw: true })
  let summaries = await db.Summary.findAll({ raw: true, order: [['gameweekId', 'DESC']], limit: weeksToInclude })
  summaries = summaries.reverse()
  const form: any[] = []
  managers.forEach((manager: any) => {
    let points = 0
    const results: any[] = []
    summaries.forEach((gameweek: any) => {
      const result = gameweek.summary.scores.find((x: any) => x.managerId === manager.managerId)?.result || 'X'
      points += getPoints(result)
      results.push(result)
    })
    form.push({
      managerId: manager.managerId,
      manager: manager.name,
      points,
      results,
    })
  })
  return orderForm(form)
}

function orderForm (form: any[]): any[] {
  return form.sort((a, b) => { return compare(b.points, a.points) || compare(a.manager, b.manager) })
    .map((x, i) => ({ position: i + 1, ...x }))
}
