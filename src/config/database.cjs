const convict = require('convict')

const config = convict({
  username: {
    doc: 'PostgreSQL username.',
    format: String,
    default: 'postgres',
    env: 'POSTGRES_USERNAME',
  },
  password: {
    doc: 'PostgreSQL password.',
    format: String,
    default: 'postgres',
    env: 'POSTGRES_PASSWORD',
  },
  database: {
    doc: 'PostgreSQL database name.',
    format: String,
    default: 'dream_league_api',
    env: 'POSTGRES_DB',
  },
  host: {
    doc: 'PostgreSQL host.',
    format: String,
    default: 'localhost',
    env: 'POSTGRES_HOST',
  },
  port: {
    doc: 'PostgreSQL port.',
    format: 'port',
    default: 5432,
    env: 'POSTGRES_PORT',
  },
  dialect: {
    doc: 'Sequelize dialect.',
    format: String,
    default: 'postgres',
    env: 'POSTGRES_DIALECT',
  },
  logging: {
    doc: 'Enable Sequelize query logging.',
    format: Boolean,
    default: false,
    env: 'POSTGRES_LOGGING',
  },
})

config.validate({ allowed: 'strict' })

module.exports = {
  ...config.getProperties(),
  define: {
    timestamps: false,
  },
}
