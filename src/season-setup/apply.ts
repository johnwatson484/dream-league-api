import db from '../data/index.ts'

interface NewTeam {
  name: string
  alias: string
  divisionId: number
}

interface Move {
  teamId: number
  divisionId: number
}

interface SeasonSetupPayload {
  newTeams: NewTeam[]
  moves: Move[]
  deletes: number[]
}

export async function applySeasonSetup (payload: SeasonSetupPayload): Promise<void> {
  const transaction = await db.sequelize.transaction()
  try {
    for (const newTeam of payload.newTeams) {
      await db.Team.create({
        name: newTeam.name,
        alias: newTeam.alias,
        divisionId: newTeam.divisionId,
      }, { transaction })
    }

    for (const move of payload.moves) {
      await db.Team.update(
        { divisionId: move.divisionId },
        { where: { teamId: move.teamId }, transaction }
      )
    }

    for (const teamId of payload.deletes) {
      const players: any[] = await db.Player.findAll({
        where: { teamId },
        attributes: ['playerId'],
        transaction,
      })

      const playerIds = players.map((p: any) => p.playerId)

      if (playerIds.length > 0) {
        await db.ManagerPlayer.destroy({
          where: { playerId: playerIds },
          transaction,
        })
      }

      await db.ManagerKeeper.destroy({
        where: { teamId },
        transaction,
      })

      await db.Player.destroy({
        where: { teamId },
        transaction,
      })

      await db.Team.destroy({
        where: { teamId },
        transaction,
      })
    }

    await transaction.commit()
  } catch (error) {
    await transaction.rollback()
    throw error
  }
}
