import jwt from 'jsonwebtoken'
import { jwtConfig } from '../config/index.js'

const create = (user) => {
  const body = mapUserToBody(user)
  return jwt.sign(body, jwtConfig.secret, {
    expiresIn: `${jwtConfig.expiryInMinutes}m`,
  })
}

const mapUserToBody = (user) => {
  return {
    userId: user.userId,
    scope: user.roles.map(x => x.Role.name),
  }
}

export { create }
