const joi = require('joi')

const schema = joi.object().keys({
  username: joi.string(),
  password: joi.string(),
  database: joi.string().default('dream_league_api'),
  host: joi.string(),
  port: joi.number().default(5432),
  dialect: joi.string().default('postgres'),
  logging: joi.string().default(false),
  define: joi.object().keys({
    timestamps: joi.bool().valid(false),
  }),
})

const config = {
  username: process.env.POSTGRES_USERNAME,
  password: process.env.POSTGRES_PASSWORD,
  database: process.env.POSTGRES_DB,
  host: process.env.POSTGRES_HOST,
  port: process.env.POSTGRES_PORT,
  dialect: process.env.POSTGRES_DIALECT,
  logging: process.env.POSTGRES_LOGGING,
  define: {
    timestamps: false,
  },
}

const { error, value } = schema.validate(config)

if (error) {
  throw new Error(`The database config is invalid. ${error.message}`)
}

module.exports = value
