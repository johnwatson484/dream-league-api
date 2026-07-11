import db from '../data/index.ts'
import { getScores } from './get-scores.ts'

export async function getCupScores (gameweekId: number, managers: any[]): Promise<any[]> {
  const cupScores = []
  const scores = await getScores(gameweekId, managers, true)

  const fixtures = await db.Fixture.findAll({ where: { gameweekId }, include: [{ model: db.Cup, as: 'cup', attributes: ['name'] }] })

  for (const fixture of fixtures as any[]) {
    const homeScore = scores.find(x => x.managerId === fixture.homeManagerId)
    const awayScore = scores.find(x => x.managerId === fixture.awayManagerId)
    if (homeScore && awayScore) {
      const homeMargin = homeScore.goals - homeScore.conceded
      const awayMargin = awayScore.goals - awayScore.conceded
      const result = getCupResult(homeMargin, awayMargin)

      cupScores.push({
        cupId: fixture.cupId,
        cupName: fixture.cup.name,
        round: fixture.round,
        homeManagerId: fixture.homeManagerId,
        homeManager: managers.find(x => x.managerId === fixture.homeManagerId)?.name,
        awayManagerId: fixture.awayManagerId,
        awayManager: managers.find(x => x.managerId === fixture.awayManagerId)?.name,
        homeScore,
        homeMargin,
        awayScore,
        awayMargin,
        result,
      })
    }
  }

  return cupScores
}

function getCupResult (homeMargin: number, awayMargin: number): string {
  if (homeMargin > awayMargin) {
    return 'H'
  }
  if (awayMargin > homeMargin) {
    return 'A'
  }
  return 'D'
}
