const db = require('../../data')

async function getCupWeeks () {
  const managers = await db.Manager.findAll()
  const fixtures = await db.Fixture.findAll()
  const managerCupWeeks = []

  managers.forEach(manager => {
    fixtures.forEach(fixture => {
      if (fixture.homeManagerId === manager.managerId || fixture.awayManagerId === manager.managerId) {
        managerCupWeeks.push({ managerId: manager.managerId, gameweekId: fixture.gameweekId, fixtureId: fixture.fixtureId })
      }
    })
  })

  return managerCupWeeks
}

module.exports = getCupWeeks
