const joi = require('@hapi/joi')
const envs = ['development', 'production']

// Define config schema
const schema = joi.object().keys({
  port: joi.number().default(3000),
  env: joi.string().valid(...envs).default(envs[0]),
  jwt: joi.object({
    secret: joi.string().default('NeverShareYourSecret')
  })
})

// Build config
const config = {
  port: process.env.PORT,
  env: process.env.NODE_ENV,
  jwt: {
    secret: process.env.JWT_SECRET
  }
}

// Validate config
const { error, value } = schema.validate(config)

// Throw if config is invalid
if (error) {
  throw new Error(`The server config is invalid. ${error.message}`)
}

module.exports = value
