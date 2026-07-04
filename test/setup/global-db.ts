import { execSync } from 'node:child_process'
import { PostgreSqlContainer } from '@testcontainers/postgresql'

const DB_NAME = 'dream_league_api'
const DB_USER = 'postgres'
const DB_PASSWORD = 'postgres'

export async function setup () {
  const postgres = await new PostgreSqlContainer('postgres:12.8-alpine')
    .withDatabase(DB_NAME)
    .withUsername(DB_USER)
    .withPassword(DB_PASSWORD)
    .start()

  const host = postgres.getHost()
  const port = String(postgres.getMappedPort(5432))

  process.env.POSTGRES_HOST = host
  process.env.POSTGRES_PORT = port
  process.env.POSTGRES_USERNAME = DB_USER
  process.env.POSTGRES_PASSWORD = DB_PASSWORD
  process.env.POSTGRES_DB = DB_NAME
  process.env.NODE_ENV = 'test'

  const dbEnv = {
    ...process.env,
    POSTGRES_HOST: host,
    POSTGRES_PORT: port,
    POSTGRES_USERNAME: DB_USER,
    POSTGRES_PASSWORD: DB_PASSWORD,
    POSTGRES_DB: DB_NAME,
  }

  execSync('npx sequelize db:migrate', { stdio: 'inherit', env: dbEnv })

  return async function teardown () {
    await postgres.stop()
  }
}
