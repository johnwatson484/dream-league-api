import db from '../data/index.ts'
import { orderSummaryGroups } from './order-summary-groups.ts'
import { orderScores } from './order-scores.ts'

export async function getSummary (gameweekId = 0): Promise<any> {
  if (gameweekId === 0) {
    gameweekId = await db.Summary.max('gameweekId') ?? 0
  }
  const stored: any = await db.Summary.findOne({ where: { gameweekId }, raw: true })
  if (!stored?.summary) { return stored?.summary }

  const summary = { ...stored.summary }
  if (summary.scores) {
    summary.scores = orderScores(summary.scores)
  }
  if (summary.groups?.length) {
    const groups = await db.Group.findAll({
      include: [{ model: db.Manager, as: 'managers', attributes: ['managerId'], through: { attributes: [] } }],
    } as any)
    summary.groups = orderSummaryGroups(summary.groups, groups as any[])
  }
  return summary
}
