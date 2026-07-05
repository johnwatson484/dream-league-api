import db from '../data/index.ts'

export async function getCupWeeks (): Promise<any[]> {
  const managers = await db.Manager.findAll()
  const fixtures = await db.Fixture.findAll()
  const managerCupWeeks: any[] = []

  managers.forEach((manager: any) => {
    fixtures.forEach((fixture: any) => {
      if (fixture.homeManagerId === manager.managerId || fixture.awayManagerId === manager.managerId) {
        managerCupWeeks.push({ managerId: manager.managerId, gameweekId: fixture.gameweekId, fixtureId: fixture.fixtureId })
      }
    })
  })

  return managerCupWeeks
}
