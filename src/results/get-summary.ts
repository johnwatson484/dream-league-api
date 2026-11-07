import db from '../data/index.ts'
import { orderSummaryGroups } from './order-summary-groups.ts'

export async function getSummary (gameweekId = 0): Promise<any> {
  if (gameweekId === 0) {
    gameweekId = await db.Summary.max('gameweekId') ?? 0
  }
  const summary: any = await db.Summary.findOne({ where: { gameweekId }, raw: true }) ?? {}
  if (summary.summary?.groups?.length) {
    const groups = await db.Group.findAll({
      include: [{ model: db.Manager, as: 'managers', attributes: ['managerId'], through: { attributes: [] } }],
    } as any)
    return { ...summary.summary, groups: orderSummaryGroups(summary.summary.groups, groups as any[]) }
  }
  return summary.summary
}
