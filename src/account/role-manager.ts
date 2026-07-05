import db from '../data/index.ts'

async function getRole (roleName: string) {
  return db.Role.findOne({ where: { name: roleName } })
}

export async function addUserToRole (userId: number, roleName: string): Promise<void> {
  const role = await getRole(roleName)
  await db.UserRole.create({ userId, roleId: (role as any).roleId })
}

export async function getUserRoles (userId: number) {
  return db.UserRole.findAll({
    where: { userId },
    raw: true,
    nest: true,
    attributes: [],
    include: [db.Role],
  })
}
