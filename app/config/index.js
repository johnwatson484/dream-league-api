const joi = require('joi')
const databaseConfig = require('./database-config')
const envs = ['development', 'test', 'production']

// Define config schema
const schema = joi.object().keys({
  port: joi.number().default(3001),
  env: joi.string().valid(...envs).default(envs[0]),
  jwtConfig: joi.object({
    secret: joi.string(),
    expiryInMinutes: joi.number().default(43800)
  }),
  smtp: joi.object({
    host: joi.string().allow(''),
    port: joi.number().default(587),
    secure: joi.boolean().default(false),
    requireTLS: joi.boolean().default(true),
    auth: joi.object({
      user: joi.string().allow(''),
      pass: joi.string().allow('')
    })
  })
})

// Build config
const config = {
  port: process.env.PORT,
  env: process.env.NODE_ENV,
  jwtConfig: {
    secret: process.env.JWT_SECRET,
    expiryInMinutes: process.env.JWT_EXPIRY_IN_MINUTES
  },
  smtp: {
    host: process.env.SMTP_HOST,
    port: process.env.SMTP_PORT,
    secure: process.env.SMTP_SECURE,
    requireTLS: process.env.SMTP_TLS,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASSWORD
    }
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
value.isDev = value.env === 'development'

module.exports = value
