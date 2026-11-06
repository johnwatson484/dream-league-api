import Hapi from '@hapi/hapi'
import db from '../../src/data/index.ts'
import routes from '../../src/server/routes/groups.ts'

describe('group membership routes', () => {
  const server = Hapi.server()

  beforeAll(async () => {
    // Exercise the real routes and database; authentication is outside this test.
    server.route(routes.map(route => ({ ...route, options: { ...route.options, auth: false } })))
    await server.initialize()
    await db.Manager.destroy({ truncate: true })
    await db.Cup.destroy({ truncate: true, cascade: true })
    await db.Manager.bulkCreate([1, 2, 3].map(managerId => ({ managerId, name: `Manager ${managerId}` })))
    await db.Cup.create({ cupId: 1, name: 'Cup', hasGroupStage: true })
  })

  beforeEach(async () => {
    await db.ManagerGroup.destroy({ truncate: true })
    await db.Group.destroy({ truncate: true, restartIdentity: true })
  })

  afterAll(async () => {
    await server.stop()
    await db.sequelize.close()
  })

  async function createGroup (managers: number[] = [1, 2]) {
    const response = await server.inject({ method: 'POST', url: '/group/create', payload: { cupId: 1, name: 'Group A', managers } })
    expect(response.statusCode).toBe(200)
    return response.result as any
  }

  async function getGroup (groupId: number) {
    const response = await server.inject(`/group?groupId=${groupId}`)
    expect(response.statusCode).toBe(200)
    return response.result as any
  }

  test('a reused group ID does not inherit memberships left by an old season reset', async () => {
    await db.ManagerGroup.create({ groupId: 1, managerId: 3 })
    const group = await createGroup()
    expect(group.groupId).toBe(1)
    const memberships = await db.ManagerGroup.findAll({ where: { groupId: group.groupId }, raw: true })
    expect(memberships.map((membership: any) => membership.managerId).sort()).toEqual([1, 2])
    expect((await getGroup(group.groupId)).managers.sort()).toEqual([1, 2])
  })

  test('the edit response includes the exact selected manager IDs', async () => {
    const group = await createGroup([1, 3])
    expect(await getGroup(group.groupId)).toMatchObject({ name: 'Group A', cupName: 'Cup', managers: expect.arrayContaining([1, 3]) })
    expect((await getGroup(group.groupId)).managers).toHaveLength(2)
  })

  test('editing replaces memberships with exactly the submitted selection', async () => {
    const group = await createGroup()
    const response = await server.inject({ method: 'POST', url: '/group/edit', payload: { groupId: group.groupId, cupId: 1, name: 'Updated', managers: [2, 3] } })
    expect(response.statusCode).toBe(204)
    expect((await getGroup(group.groupId)).managers.sort()).toEqual([2, 3])
  })

  test('unchecking all managers removes every membership', async () => {
    const group = await createGroup()
    const response = await server.inject({ method: 'POST', url: '/group/edit', payload: { groupId: group.groupId, cupId: 1 } })
    expect(response.statusCode).toBe(204)
    expect((await getGroup(group.groupId)).managers).toEqual([])
  })

  test('a failed membership write rolls back the group edit and original membership', async () => {
    const group = await createGroup()
    const response = await server.inject({ method: 'POST', url: '/group/edit', payload: { groupId: group.groupId, cupId: 1, name: 'Failed edit', managers: [3, 3] } })
    expect(response.statusCode).toBe(500)
    const saved = await getGroup(group.groupId)
    expect(saved.name).toBe('Group A')
    expect(saved.managers.sort()).toEqual([1, 2])
  })

  test('a failed create rolls back the group and partial membership', async () => {
    const response = await server.inject({ method: 'POST', url: '/group/create', payload: { cupId: 1, name: 'Failed group', managers: [1, 1] } })
    expect(response.statusCode).toBe(500)
    expect(await db.Group.count()).toBe(0)
    expect(await db.ManagerGroup.count()).toBe(0)
  })
})
