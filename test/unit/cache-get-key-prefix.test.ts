vi.mock('../../src/config/index.ts', () => ({
  default: {
    get: (key: string) => ({
      'cache.partition': 'dream-league',
    } as Record<string, unknown>)[key],
  },
}))

import { getKeyPrefix } from '../../src/cache/get-key-prefix.ts'

describe('cache key prefix', () => {
  test('builds a prefix from the partition and cache name', () => {
    const result = getKeyPrefix('summaries')

    expect(result).toBe('dream-league:summaries')
  })
})
