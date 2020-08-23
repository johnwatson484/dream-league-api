const joi = require('joi')
const databaseConfig = require('./database-config')
const envs = ['development', 'test', 'production']

// Define config schema
const schema = joi.object().keys({
  port: joi.number().default(3000),
  env: joi.string().valid(...envs).default(envs[0]),
  jwtConfig: joi.object({
    secret: joi.string(),
    expiryInMinutes: joi.number().default(60)
  })
})

// Build config
const config = {
  port: process.env.PORT,
  env: process.env.NODE_ENV,
  jwtConfig: {
    secret: process.env.JWT_SECRET,
    expiryInMinutes: process.env.JWT_EXPIRY_IN_MINUTES
  }
}

// Validate config
const result = schema.validate(config, {
  abortEarly: false
})

if (result.error) {
  throw new Error(`The server config is invalid. ${result.error.message}`)
}

const value = {
  ...result.value,
  database: databaseConfig
}

module.exports = value
