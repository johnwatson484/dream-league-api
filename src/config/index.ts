import convict from 'convict'
import convictFormatWithValidator from 'convict-format-with-validator'

convict.addFormats(convictFormatWithValidator)

const config = convict({
  env: {
    doc: 'The application environment.',
    format: ['production', 'development', 'test'],
    default: 'development',
    env: 'NODE_ENV',
  },
  isDev: {
    doc: 'True if the application is in development mode.',
    format: Boolean,
    default: process.env.NODE_ENV === 'development',
  },
  port: {
    doc: 'The port to bind.',
    format: 'port',
    default: 3001,
    env: 'PORT',
  },
  webUrl: {
    doc: 'The URL of the web frontend.',
    format: 'url',
    default: 'http://localhost:3000',
    env: 'WEB_URL',
  },
  allowNonMemberRegistration: {
    doc: 'Whether to allow registration for non-members.',
    format: Boolean,
    default: false,
    env: 'ALLOW_NON_MEMBER_REGISTRATION',
  },
  jwt: {
    secret: {
      doc: 'Legacy JWT secret (unused with RS256 signing).',
      format: String,
      default: '',
      env: 'JWT_SECRET',
    },
    expiryInMinutes: {
      doc: 'Access token expiry in minutes.',
      format: Number,
      default: 15,
      env: 'JWT_EXPIRY_IN_MINUTES',
    },
    refreshTokenExpiryDays: {
      doc: 'Refresh token rolling expiry in days.',
      format: Number,
      default: 7,
      env: 'JWT_REFRESH_TOKEN_EXPIRY_DAYS',
    },
    refreshTokenMaxAgeDays: {
      doc: 'Refresh token absolute max age in days.',
      format: Number,
      default: 30,
      env: 'JWT_REFRESH_TOKEN_MAX_AGE_DAYS',
    },
    privateKey: {
      doc: 'RSA private key PEM string for JWT signing.',
      format: String,
      default: '',
      env: 'JWT_PRIVATE_KEY',
    },
    publicKey: {
      doc: 'RSA public key PEM string for JWT verification.',
      format: String,
      default: '',
      env: 'JWT_PUBLIC_KEY',
    },
    privateKeyPath: {
      doc: 'Path to RSA private key PEM file.',
      format: String,
      default: '',
      env: 'JWT_PRIVATE_KEY_PATH',
    },
    publicKeyPath: {
      doc: 'Path to RSA public key PEM file.',
      format: String,
      default: '',
      env: 'JWT_PUBLIC_KEY_PATH',
    },
  },
  smtp: {
    host: {
      doc: 'SMTP server hostname.',
      format: String,
      default: '',
      env: 'SMTP_HOST',
    },
    port: {
      doc: 'SMTP server port.',
      format: 'port',
      default: 587,
      env: 'SMTP_PORT',
    },
    secure: {
      doc: 'Use TLS for SMTP connection.',
      format: Boolean,
      default: false,
      env: 'SMTP_SECURE',
    },
    requireTLS: {
      doc: 'Require STARTTLS upgrade.',
      format: Boolean,
      default: true,
      env: 'SMTP_TLS',
    },
    auth: {
      user: {
        doc: 'SMTP authentication username.',
        format: String,
        default: '',
        env: 'SMTP_USER',
      },
      pass: {
        doc: 'SMTP authentication password.',
        format: String,
        default: '',
        env: 'SMTP_PASSWORD',
        sensitive: true,
      },
    },
  },
  cache: {
    host: {
      doc: 'Redis host.',
      format: String,
      default: 'localhost',
      env: 'REDIS_HOST',
    },
    port: {
      doc: 'Redis port.',
      format: 'port',
      default: 6379,
      env: 'REDIS_PORT',
    },
    tls: {
      doc: 'Use TLS for Redis connection.',
      format: Boolean,
      default: false,
      env: 'REDIS_TLS',
    },
    password: {
      doc: 'Redis authentication password.',
      format: String,
      default: '',
      env: 'REDIS_PASSWORD',
      sensitive: true,
    },
    partition: {
      doc: 'Redis key namespace prefix.',
      format: String,
      default: 'dream-league-api',
      env: 'REDIS_PARTITION',
    },
    ttl: {
      doc: 'Default cache TTL in seconds.',
      format: Number,
      default: 1468800,
      env: 'REDIS_TTL',
    },
  },
  database: {
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
      sensitive: true,
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
  },
})

config.validate({ allowed: 'strict' })

export default config
