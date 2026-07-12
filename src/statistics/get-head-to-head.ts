import db from '../data/index.ts'

export async function getHeadToHead (manager1Id: number, manager2Id: number): Promise<any> {
  const summaries = await db.Summary.findAll({ raw: true, order: [['gameweekId', 'ASC']] })

  const record = { manager1Wins: 0, manager2Wins: 0, draws: 0, weeks: [] as any[] }

  for (const summary of summaries as any[]) {
    const scores = summary.summary?.scores
    if (!scores) { continue }

    const m1Score = scores.find((s: any) => s.managerId === manager1Id)
    const m2Score = scores.find((s: any) => s.managerId === manager2Id)

    if (!m1Score || !m2Score) { continue }

    const m1Margin = m1Score.goals - m1Score.conceded
    const m2Margin = m2Score.goals - m2Score.conceded

    let winner: string
    if (m1Margin > m2Margin) {
      record.manager1Wins++
      winner = 'manager1'
    } else if (m2Margin > m1Margin) {
      record.manager2Wins++
      winner = 'manager2'
    } else {
      record.draws++
      winner = 'draw'
    }

    record.weeks.push({
      gameweekId: summary.gameweekId,
      manager1: { goals: m1Score.goals, conceded: m1Score.conceded, margin: m1Margin },
      manager2: { goals: m2Score.goals, conceded: m2Score.conceded, margin: m2Margin },
      winner,
    })
  }

  const managers = await db.Manager.findAll({
    where: { managerId: [manager1Id, manager2Id] },
    raw: true,
  })

  return {
    manager1: managers.find((m: any) => m.managerId === manager1Id),
    manager2: managers.find((m: any) => m.managerId === manager2Id),
    record,
  }
}
