const { mockUserExists, mockCreateUser, mockIsMember, mockCreate } = vi.hoisted(() => ({
  mockUserExists: vi.fn(),
  mockCreateUser: vi.fn(),
  mockIsMember: vi.fn(),
  mockCreate: vi.fn(),
}))

vi.mock('../../src/config/index.ts', () => ({
  default: {
    get: (key) => ({
      allowNonMemberRegistration: false,
    })[key],
  },
}))

vi.mock('../../src/account/user-manager.ts', () => ({
  userExists: mockUserExists,
  createUser: mockCreateUser,
  isMember: mockIsMember,
}))

vi.mock('../../src/token/create.ts', () => ({
  create: mockCreate,
}))

import { register } from '../../src/account/register.ts'

describe('user registration', () => {
  test('a new member can register and receives an authentication token', async () => {
    mockUserExists.mockResolvedValue(false)
    mockIsMember.mockResolvedValue(true)
    const user = { userId: 1, roles: [] }
    mockCreateUser.mockResolvedValue(user)
    mockCreate.mockResolvedValue({ accessToken: 'new-token', refreshToken: 'raw-token' })

    const result = await register('new@example.com', 'password123')

    expect(result).toEqual({ accessToken: 'new-token', refreshToken: 'raw-token' })
  })

  test('registration is rejected if the email is already registered', async () => {
    mockUserExists.mockResolvedValue(true)

    const result = await register('existing@example.com', 'password123')

    expect(result).toBe(false)
    expect(mockCreateUser).not.toHaveBeenCalled()
  })

  test('a non-member cannot register when non-member registration is disabled', async () => {
    mockUserExists.mockResolvedValue(false)
    mockIsMember.mockResolvedValue(false)

    const result = await register('outsider@example.com', 'password123')

    expect(result).toBe(false)
    expect(mockCreateUser).not.toHaveBeenCalled()
  })

  test('the user is created with the provided email and password', async () => {
    mockUserExists.mockResolvedValue(false)
    mockIsMember.mockResolvedValue(true)
    mockCreateUser.mockResolvedValue({ userId: 1 })
    mockCreate.mockResolvedValue({ accessToken: 'token', refreshToken: 'raw' })

    await register('new@example.com', 'secure-password')

    expect(mockCreateUser).toHaveBeenCalledWith('new@example.com', 'secure-password')
  })
})
