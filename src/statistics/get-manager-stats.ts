import db from '../data/index.ts'

interface ManagerScore {
  managerId: number
  goals: number
  conceded: number
  result: string
}

interface WeekStats {
  gameweekId: number
  goals: number
  conceded: number
  margin: number
  result: string
}

interface CurrentStreak {
  type: 'W' | 'D' | 'L' | 'none'
  count: number
}

interface ManagerStats {
  form: string[]
  totalGoals: number
  totalConceded: number
  bestWeek: WeekStats | null
  worstWeek: WeekStats | null
  currentStreak: CurrentStreak
}

export async function getManagerStats (managerId: number): Promise<ManagerStats> {
  const summaries = await db.Summary.findAll({ raw: true, order: [['gameweekId', 'ASC']] })

  const weeks: WeekStats[] = []

  for (const summary of summaries as any[]) {
    const scores = summary.summary?.scores
    if (!scores) { continue }

    const managerScore: ManagerScore | undefined = scores.find((s: any) => s.managerId === managerId)
    if (!managerScore) { continue }

    weeks.push({
      gameweekId: summary.gameweekId,
      goals: managerScore.goals,
      conceded: managerScore.conceded,
      margin: managerScore.goals - managerScore.conceded,
      result: managerScore.result,
    })
  }

  const form = weeks.slice(-6).map(w => w.result)

  const totalGoals = weeks.reduce((sum, w) => sum + w.goals, 0)
  const totalConceded = weeks.reduce((sum, w) => sum + w.conceded, 0)

  const bestWeek = weeks.length > 0
    ? weeks.reduce((best, w) => w.margin > best.margin ? w : best, weeks[0]!)
    : null

  const worstWeek = weeks.length > 0
    ? weeks.reduce((worst, w) => w.margin < worst.margin ? w : worst, weeks[0]!)
    : null

  const currentStreak = calculateStreak(weeks)

  return {
    form,
    totalGoals,
    totalConceded,
    bestWeek,
    worstWeek,
    currentStreak,
  }
}

function calculateStreak (weeks: WeekStats[]): CurrentStreak {
  if (weeks.length === 0) {
    return { type: 'none', count: 0 }
  }

  const reversed = [...weeks].reverse()
  const streakType = reversed[0]!.result

  if (streakType !== 'W' && streakType !== 'D' && streakType !== 'L') {
    return { type: 'none', count: 0 }
  }

  let count = 0
  for (const week of reversed) {
    if (week.result === streakType) {
      count++
    } else {
      break
    }
  }

  return { type: streakType, count }
}
