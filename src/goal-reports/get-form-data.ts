import db from '../data/index.ts'

export async function getFormData (): Promise<any> {
  const managers = await db.Manager.findAll({
    include: [{
      model: db.Player,
      as: 'players',
      through: { attributes: ['substitute'] },
      include: [{ model: db.Team, as: 'team' }],
    }],
    order: [['name', 'ASC']],
  })

  const gameweeks = await db.Gameweek.findAll({
    order: [['gameweekId', 'DESC']],
  })

  const cupFixtures = await db.Fixture.findAll({
    attributes: ['gameweekId'],
    group: ['gameweekId'],
  })
  const cupGameweekIds = new Set(cupFixtures.map((f: any) => f.gameweekId))

  const gameweeksWithCupFlag = gameweeks
    .filter((gw: any) => gw.isActive)
    .map((gw: any) => ({
      gameweekId: gw.gameweekId,
      startDate: gw.startDate,
      shortDate: gw.shortDate,
      isCupWeek: cupGameweekIds.has(gw.gameweekId),
    }))

  return { managers, gameweeks: gameweeksWithCupFlag }
}
