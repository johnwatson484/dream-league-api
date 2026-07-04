import { getWinners } from '../../src/results/get-winners.ts'

describe('gameweek winners', () => {
  test('a single manager wins when they have the highest goal margin', () => {
    const scores = [
      { managerId: 1, manager: 'Alice', margin: 5, goals: 7 },
      { managerId: 2, manager: 'Bob', margin: 3, goals: 4 },
    ]

    const result = getWinners(scores)

    expect(result).toEqual([{ managerId: 1, manager: 'Alice', goals: 7 }])
  })

  test('multiple managers share the win when they have equal highest margins', () => {
    const scores = [
      { managerId: 1, manager: 'Alice', margin: 5, goals: 7 },
      { managerId: 2, manager: 'Bob', margin: 5, goals: 6 },
      { managerId: 3, manager: 'Charlie', margin: 2, goals: 3 },
    ]

    const result = getWinners(scores)

    expect(result).toEqual([
      { managerId: 1, manager: 'Alice', goals: 7 },
      { managerId: 2, manager: 'Bob', goals: 6 },
    ])
  })

  test('all managers win when all margins are equal', () => {
    const scores = [
      { managerId: 1, manager: 'Alice', margin: 3, goals: 5 },
      { managerId: 2, manager: 'Bob', margin: 3, goals: 4 },
    ]

    const result = getWinners(scores)

    expect(result).toHaveLength(2)
  })

  test('the winner is determined by margin not total goals', () => {
    const scores = [
      { managerId: 1, manager: 'Alice', margin: 2, goals: 10 },
      { managerId: 2, manager: 'Bob', margin: 4, goals: 5 },
    ]

    const result = getWinners(scores)

    expect(result).toEqual([{ managerId: 2, manager: 'Bob', goals: 5 }])
  })

  test('negative margins are handled when all managers concede more than they score', () => {
    const scores = [
      { managerId: 1, manager: 'Alice', margin: -1, goals: 2 },
      { managerId: 2, manager: 'Bob', margin: -3, goals: 1 },
    ]

    const result = getWinners(scores)

    expect(result).toEqual([{ managerId: 1, manager: 'Alice', goals: 2 }])
  })
})
