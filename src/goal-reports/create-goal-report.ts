import db from '../data/index.ts'

interface CreateGoalReportPayload {
  playerId: number
  managerId: number
  gameweekId: number
  goals: number
  goalsCup: number
  reason?: string
  submittedBy: number
}

export async function createGoalReport (payload: CreateGoalReportPayload): Promise<any> {
  const managerPlayer = await db.ManagerPlayer.findOne({
    where: { playerId: payload.playerId, managerId: payload.managerId },
  })

  if (!managerPlayer) {
    throw new Error('Player does not belong to the selected manager')
  }

  const gameweek = await db.Gameweek.findByPk(payload.gameweekId)
  if (!gameweek) {
    throw new Error('Gameweek not found')
  }

  return db.GoalReport.create({
    playerId: payload.playerId,
    managerId: payload.managerId,
    gameweekId: payload.gameweekId,
    goals: payload.goals,
    goalsCup: payload.goalsCup,
    reason: payload.reason || null,
    submittedBy: payload.submittedBy,
    status: 'pending',
    created: new Date(),
  })
}
