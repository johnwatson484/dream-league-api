import jwt from 'jsonwebtoken'
import config from '../config/index.ts'

export async function create (user) {
  const accessToken = jwt.sign(mapUserToBody(user), config.jwtConfig.secret, {
    expiresIn: `${config.jwtConfig.expiryInMinutes}m`,
  })

  return { token: accessToken }
}

function mapUserToBody (user) {
  return {
    userId: user.userId,
    scope: user.roles.map(x => x.Role.name),
  }
}
