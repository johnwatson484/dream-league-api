vi.mock('../../src/config/index.ts', () => ({
  default: {
    get: (key) => ({
      'cache.partition': 'dream-league',
    })[key],
  },
}))

import { getFullKey } from '../../src/cache/get-full-key.ts'

describe('cache full key', () => {
  test('builds a key from the partition, cache name, and specific key', () => {
    const result = getFullKey('summaries', 'gameweek-5')

    expect(result).toBe('dream-league:summaries:gameweek-5')
  })
})
