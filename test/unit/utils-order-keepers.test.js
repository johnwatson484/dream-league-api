import { orderKeepers } from '../../src/utils/order-keepers.js'

describe('keeper list ordering', () => {
  test('non-substitute keepers appear before substitutes', () => {
    const keepers = [
      { name: 'Liverpool', substitute: true },
      { name: 'Arsenal', substitute: false },
    ]

    const result = orderKeepers(keepers)

    expect(result[0].substitute).toBe(false)
    expect(result[1].substitute).toBe(true)
  })

  test('keepers with the same substitute status are ordered by team name', () => {
    const keepers = [
      { name: 'Liverpool', substitute: false },
      { name: 'Arsenal', substitute: false },
    ]

    const result = orderKeepers(keepers)

    expect(result[0].name).toBe('Arsenal')
    expect(result[1].name).toBe('Liverpool')
  })
})
