import jwt from 'jsonwebtoken'
import config from '../config/index.js'

export function create (user) {
  const body = mapUserToBody(user)
  return jwt.sign(body, config.jwtConfig.secret, {
    expiresIn: `${config.jwtConfig.expiryInMinutes}m`,
  })
}

function mapUserToBody (user) {
  return {
    userId: user.userId,
    scope: user.roles.map(x => x.Role.name),
  }
}
