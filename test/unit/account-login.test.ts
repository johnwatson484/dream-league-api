const { mockGetUser, mockCompare, mockCreate } = vi.hoisted(() => ({
  mockGetUser: vi.fn(),
  mockCompare: vi.fn(),
  mockCreate: vi.fn(),
}))

vi.mock('../../src/account/user-manager.ts', () => ({
  getUser: mockGetUser,
}))

vi.mock('bcrypt', () => ({
  default: { compare: mockCompare },
}))

vi.mock('../../src/token/create.ts', () => ({
  create: mockCreate,
}))

import { login } from '../../src/account/login.ts'

describe('user login', () => {
  test('a valid email and password returns an authentication token', async () => {
    const user = { userId: 1, passwordHash: 'hashed' }
    mockGetUser.mockResolvedValue(user)
    mockCompare.mockResolvedValue(true)
    mockCreate.mockResolvedValue({ accessToken: 'jwt-token', refreshToken: 'raw-token' })

    const result = await login('user@example.com', 'password123')

    expect(result).toEqual({ accessToken: 'jwt-token', refreshToken: 'raw-token' })
  })

  test('an unrecognised email address is rejected', async () => {
    mockGetUser.mockResolvedValue(null)

    const result = await login('unknown@example.com', 'password123')

    expect(result).toBe(false)
  })

  test('an incorrect password is rejected', async () => {
    mockGetUser.mockResolvedValue({ userId: 1, passwordHash: 'hashed' })
    mockCompare.mockResolvedValue(false)

    const result = await login('user@example.com', 'wrong-password')

    expect(result).toBe(false)
  })

  test('the password is compared against the stored hash', async () => {
    const user = { userId: 1, passwordHash: 'stored-hash' }
    mockGetUser.mockResolvedValue(user)
    mockCompare.mockResolvedValue(true)
    mockCreate.mockResolvedValue({ accessToken: 'token', refreshToken: 'raw' })

    await login('user@example.com', 'my-password')

    expect(mockCompare).toHaveBeenCalledWith('my-password', 'stored-hash')
  })

  test('the token is created from the authenticated user', async () => {
    const user = { userId: 1, passwordHash: 'hashed' }
    mockGetUser.mockResolvedValue(user)
    mockCompare.mockResolvedValue(true)
    mockCreate.mockResolvedValue({ accessToken: 'token', refreshToken: 'raw' })

    await login('user@example.com', 'password')

    expect(mockCreate).toHaveBeenCalledWith(user)
  })
})
