
const db = require('../../app/data/models')
jest.mock('../../app/data/models')
const refresh = require('../../app/league/player-refresh')

describe('refreshing player list', () => {
  test('should update players if list valid', async () => {
    const players = [{
      firstName: 'Ian',
      lastName: 'Henderson',
      position: 'FWD',
      team: 'Rochdale'
    }, {
      firstName: 'Adebayo',
      lastName: 'Akinfenwa',
      position: 'FWD',
      team: 'Wycombe'
    }]

    db.Team.findOne.mockResolvedValue(1)

    const result = await refresh(players)
    expect(result.success).toBeTruthy()
  })

  afterEach(() => {
    jest.clearAllMocks()
  })
  afterAll(() => {
    jest.resetAllMocks()
  })
})
