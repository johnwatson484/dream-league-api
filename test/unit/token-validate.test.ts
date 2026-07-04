const { mockGetUserById } = vi.hoisted(() => ({
  mockGetUserById: vi.fn(),
}))

vi.mock('../../src/account/user-manager.ts', () => ({
  getUserById: mockGetUserById,
}))

import { validate } from '../../src/token/validate.ts'

describe('authentication token validation', () => {
  test('a token is valid when the user exists and tokenVersion matches', async () => {
    mockGetUserById.mockResolvedValue({
      userId: 1,
      tokenVersion: 0,
      roles: [{ Role: { name: 'admin' } }, { Role: { name: 'user' } }],
    })

    const result = await validate({ userId: 1, tokenVersion: 0 }, {}, {})

    expect(result).toEqual({
      isValid: true,
      credentials: { userId: 1, scope: ['admin', 'user'] },
    })
  })

  test('a token is invalid when the user no longer exists', async () => {
    mockGetUserById.mockResolvedValue(null)

    const result = await validate({ userId: 999, tokenVersion: 0 }, {}, {})

    expect(result).toEqual({ isValid: false })
  })

  test('a token is invalid when tokenVersion does not match', async () => {
    mockGetUserById.mockResolvedValue({
      userId: 1,
      tokenVersion: 2,
      roles: [{ Role: { name: 'user' } }],
    })

    const result = await validate({ userId: 1, tokenVersion: 1 }, {}, {})

    expect(result).toEqual({ isValid: false })
  })

  test('credentials contain current roles from the database', async () => {
    mockGetUserById.mockResolvedValue({
      userId: 42,
      tokenVersion: 0,
      roles: [{ Role: { name: 'user' } }],
    })

    const result = await validate({ userId: 42, tokenVersion: 0 }, {}, {})

    expect(result.credentials.scope).toEqual(['user'])
  })

  test('the user is looked up by the decoded user ID', async () => {
    mockGetUserById.mockResolvedValue({
      userId: 42,
      tokenVersion: 0,
      roles: [],
    })

    await validate({ userId: 42, tokenVersion: 0 }, {}, {})

    expect(mockGetUserById).toHaveBeenCalledWith(42)
  })
})
