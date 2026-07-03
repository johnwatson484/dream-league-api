import { mapKeeper } from '../../src/managers/map-keeper.js'

describe('manager team keeper mapping', () => {
  test('maps a keeper team with league and cup conceded counts', () => {
    const keeper = {
      teamId: 5,
      name: 'Arsenal',
      managerKeepers: { dataValues: { substitute: false } },
      conceded: [
        { cup: false },
        { cup: false },
        { cup: true },
      ],
    }

    const result = mapKeeper(keeper)

    expect(result).toEqual({
      playerId: 5,
      teamId: 5,
      name: 'Arsenal',
      substitute: false,
      conceded: 2,
      cupConceded: 1,
    })
  })

  test('a keeper with no goals conceded has zero for both counts', () => {
    const keeper = {
      teamId: 3,
      name: 'Liverpool',
      managerKeepers: { dataValues: { substitute: true } },
      conceded: [],
    }

    const result = mapKeeper(keeper)

    expect(result.conceded).toBe(0)
    expect(result.cupConceded).toBe(0)
    expect(result.substitute).toBe(true)
  })

  test('handles null conceded array gracefully', () => {
    const keeper = {
      teamId: 2,
      name: 'Chelsea',
      managerKeepers: { dataValues: { substitute: false } },
      conceded: null,
    }

    const result = mapKeeper(keeper)

    expect(result.conceded).toBe(0)
    expect(result.cupConceded).toBe(0)
  })
})
