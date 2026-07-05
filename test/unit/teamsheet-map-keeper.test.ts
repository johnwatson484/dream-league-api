import { mapKeeper } from '../../src/teamsheet/map-keeper.ts'

describe('teamsheet keeper mapping', () => {
  test('maps a keeper with their teamsheet match details', () => {
    const keeper = {
      teamId: 5,
      name: 'Arsenal',
      managerKeepers: { dataValues: { substitute: false } },
    }
    const teamsheet = [
      { bestMatchId: 5, position: 'Goalkeeper', player: 'Arsenal FC', distance: 3 },
    ]

    const result = mapKeeper(keeper, teamsheet)

    expect(result).toEqual({
      playerId: 5,
      teamId: 5,
      name: 'Arsenal',
      sourceName: 'Arsenal FC',
      matchDistance: 3,
      substitute: false,
    })
  })

  test('returns empty source name and distance when no teamsheet match is found', () => {
    const keeper = {
      teamId: 10,
      name: 'Liverpool',
      managerKeepers: { dataValues: { substitute: true } },
    }
    const teamsheet: any[] = []

    const result = mapKeeper(keeper, teamsheet)

    expect(result.sourceName).toBe('')
    expect(result.matchDistance).toBe('')
  })

  test('matches on both team ID and Goalkeeper position', () => {
    const keeper = {
      teamId: 5,
      name: 'Arsenal',
      managerKeepers: { dataValues: { substitute: false } },
    }
    const teamsheet = [
      { bestMatchId: 5, position: 'Defender', player: 'Wrong', distance: 1 },
      { bestMatchId: 5, position: 'Goalkeeper', player: 'Correct', distance: 0 },
    ]

    const result = mapKeeper(keeper, teamsheet)

    expect(result.sourceName).toBe('Correct')
  })
})
