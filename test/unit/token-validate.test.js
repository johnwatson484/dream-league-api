const { mockFindOne } = vi.hoisted(() => ({
  mockFindOne: vi.fn(),
}))

vi.mock('../../src/data/index.js', () => ({
  default: {
    User: { findOne: mockFindOne },
  },
}))

import { validate } from '../../src/token/validate.js'

describe('authentication token validation', () => {
  test('a token is valid when the user exists in the database', async () => {
    mockFindOne.mockResolvedValue({ userId: 1, email: 'user@example.com' })

    const result = await validate({ userId: 1 }, {}, {})

    expect(result).toEqual({ isValid: true })
  })

  test('a token is invalid when the user no longer exists', async () => {
    mockFindOne.mockResolvedValue(null)

    const result = await validate({ userId: 999 }, {}, {})

    expect(result).toEqual({ isValid: false })
  })

  test('the user is looked up by the decoded user ID', async () => {
    mockFindOne.mockResolvedValue({ userId: 42 })

    await validate({ userId: 42 }, {}, {})

    expect(mockFindOne).toHaveBeenCalledWith({
      raw: true,
      where: { userId: 42 },
    })
  })
})
