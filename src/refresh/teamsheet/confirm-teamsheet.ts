import db from '../../data/index.ts'
import { deleteCurrentTeam } from './delete-team.ts'

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

  for (const managerId of managerIds) {
    await deleteCurrentTeam(managerId)
  }

  for (const assignment of payload.assignments) {
    await db.ManagerPlayer.upsert({
      managerId: assignment.managerId,
      playerId: assignment.playerId,
      substitute: assignment.substitute,
    })
  }

  for (const assignment of payload.keeperAssignments) {
    await db.ManagerKeeper.upsert({
      managerId: assignment.managerId,
      teamId: assignment.teamId,
      substitute: assignment.substitute,
    })
  }

  for (const record of payload.teamsheetRecords) {
    await db.Teamsheet.create(record as any)
  }

  return { success: true }
}
