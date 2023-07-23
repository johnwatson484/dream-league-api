const Joi = require('joi')
const databaseConfig = require('./database')
const { DEVELOPMENT, TEST, PRODUCTION } = require('../constants/environments')

const schema = Joi.object().keys({
  port: Joi.number().default(3001),
  env: Joi.string().valid(DEVELOPMENT, TEST, PRODUCTION).default(DEVELOPMENT),
  jwtConfig: Joi.object({
    secret: Joi.string(),
    expiryInMinutes: Joi.number().default(43800)
  }),
  smtp: Joi.object({
    host: Joi.string().allow(''),
    port: Joi.number().default(587),
    secure: Joi.boolean().default(false),
    requireTLS: Joi.boolean().default(true),
    auth: Joi.object({
      user: Joi.string().allow(''),
      pass: Joi.string().allow('')
    })
  }),
  webUrl: Joi.string().uri().default('http://localhost:3000'),
  allowNonMemberRegistration: Joi.boolean().default(false),
  message: Joi.object({
    host: Joi.string(),
    port: Joi.number().default(5672),
    username: Joi.string(),
    password: Joi.string(),
    scoreExchange: Joi.string().default('live-scores'),
    scoreQueue: Joi.string().default('dream-league-api')
  }),
  cache: Joi.object({
    socket: Joi.object({
      host: Joi.string(),
      port: Joi.number().default(6379),
      tls: Joi.boolean().default(false)
    }),
    password: Joi.string().allow(''),
    partition: Joi.string().default('dream-league-api'),
    ttl: Joi.number().default(2592000) // 30 days
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
  },
  webUrl: process.env.WEB_URL,
  allowNonMemberRegistration: process.env.ALLOW_NON_MEMBER_REGISTRATION,
  message: {
    host: process.env.MESSAGE_HOST,
    port: process.env.MESSAGE_PORT,
    username: process.env.MESSAGE_USERNAME,
    password: process.env.MESSAGE_PASSWORD,
    scoreExchange: process.env.SCORE_EXCHANGE,
    scoreQueue: process.env.SCORE_QUEUE
  },
  cache: {
    socket: {
      host: process.env.REDIS_HOST,
      port: process.env.REDIS_PORT,
      tls: process.env.REDIS_TLS
    },
    password: process.env.REDIS_PASSWORD,
    partition: process.env.REDIS_PARTITION,
    ttl: process.env.REDIS_TTL
  }
}

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
value.isDev = value.env === DEVELOPMENT

module.exports = value
