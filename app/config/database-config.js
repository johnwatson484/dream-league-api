const joi = require('@hapi/joi')

// Define config schema
const schema = joi.object().keys({
  username: joi.string(),
  password: joi.string(),
  database: joi.string().default('dream_league_identity'),
  host: joi.string().default('localhost'),
  port: joi.number().default(5432),
  dialect: joi.string().default('postgres')
})

// Build config
const config = {
  username: process.env.POSTGRES_USERNAME,
  password: process.env.POSTGRES_PASSWORD,
  database: process.env.POSTGRES_DB,
  host: process.env.POSTGRES_HOST,
  port: process.env.POSTGRES_PORT,
  dialect: process.env.POSTGRES_DIALECT
}

// Validate config
const { error, value } = schema.validate(config)

// Throw if config is invalid
if (error) {
  throw new Error(`The database config is invalid. ${error.message}`)
}

module.exports = value
