const joi = require('@hapi/joi')
const envs = ['development', 'production']

// Define config schema
const schema = joi.object().keys({
  port: joi.number().default(3000),
  env: joi.string().valid(...envs).default(envs[0]),
  jwtConfig: joi.object({
    secret: joi.string().default('NeverShareYourSecret'),
    expiryInHours: joi.number().default(60)
  })
})

// Build config
const config = {
  port: process.env.PORT,
  env: process.env.NODE_ENV,
  jwtConfig: {
    secret: process.env.JWT_SECRET,
    expiryInHours: process.env.JWT_EXPIRY_IN_HOURS
  }
}

// Validate config
const { error, value } = schema.validate(config)

// Throw if config is invalid
if (error) {
  throw new Error(`The server config is invalid. ${error.message}`)
}

module.exports = value
