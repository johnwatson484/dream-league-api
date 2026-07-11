import db from '../../data/index.ts'

interface PlayerAssignment {
  managerId: number
  playerId: number
  substitute: boolean
}

interface KeeperAssignment {
  managerId: number
  teamId: number
  substitute: boolean
}

interface TeamsheetRecord {
  managerId: number
  player: string
  position: string
  substitute: boolean
  bestMatchId: number
  distance: number
  confidence: number
  category: string
  parsedName: string
  parsedTeam: string
}

interface ConfirmPayload {
  assignments: PlayerAssignment[]
  keeperAssignments: KeeperAssignment[]
  teamsheetRecords: TeamsheetRecord[]
}

export async function confirmTeamsheet (payload: ConfirmPayload): Promise<{ success: boolean }> {
  const managerIds = new Set([
    ...payload.assignments.map(a => a.managerId),
    ...payload.keeperAssignments.map(a => a.managerId),
  ])

  if (managerIds.size === 0) {
    return { success: true }
  }

  const transaction = await db.sequelize.transaction()
  try {
    for (const managerId of managerIds) {
      await db.ManagerKeeper.destroy({ where: { managerId }, transaction })
      await db.ManagerPlayer.destroy({ where: { managerId }, transaction })
      await db.Teamsheet.destroy({ where: { managerId }, transaction })
    }

    for (const assignment of payload.assignments) {
      await db.ManagerPlayer.upsert({
        managerId: assignment.managerId,
        playerId: assignment.playerId,
        substitute: assignment.substitute,
      }, { transaction })
    }

    for (const assignment of payload.keeperAssignments) {
      await db.ManagerKeeper.upsert({
        managerId: assignment.managerId,
        teamId: assignment.teamId,
        substitute: assignment.substitute,
      }, { transaction })
    }

    for (const record of payload.teamsheetRecords) {
      await db.Teamsheet.create(record as any, { transaction })
    }

    await transaction.commit()
  } catch (error) {
    await transaction.rollback()
    throw error
  }

  return { success: true }
}
