[![Build Status](https://github.com/johnwatson484/dream-league-api/actions/workflows/build.yaml/badge.svg)](https://github.com/johnwatson484/dream-league-api/actions/workflows/build.yaml)
[![Quality Gate Status](https://sonarcloud.io/api/project_badges/measure?project=johnwatson484_dream-league-api&metric=alert_status)](https://sonarcloud.io/summary/new_code?id=johnwatson484_dream-league-api)
[![Bugs](https://sonarcloud.io/api/project_badges/measure?project=johnwatson484_dream-league-api&metric=bugs)](https://sonarcloud.io/summary/new_code?id=johnwatson484_dream-league-api)
[![Code Smells](https://sonarcloud.io/api/project_badges/measure?project=johnwatson484_dream-league-api&metric=code_smells)](https://sonarcloud.io/summary/new_code?id=johnwatson484_dream-league-api)
[![Duplicated Lines (%)](https://sonarcloud.io/api/project_badges/measure?project=johnwatson484_dream-league-api&metric=duplicated_lines_density)](https://sonarcloud.io/summary/new_code?id=johnwatson484_dream-league-api)
[![Coverage](https://sonarcloud.io/api/project_badges/measure?project=johnwatson484_dream-league-api&metric=coverage)](https://sonarcloud.io/summary/new_code?id=johnwatson484_dream-league-api)
[![Dependabot](https://badgen.net/github/dependabot/johnwatson484/dream-league-api)](https://github.com/johnwatson484/dream-league-api/security/dependabot)

# Dream League API

Dream League backend service.

## Prerequisites

- Node.js >= 24 (see `.nvmrc`)
- Docker (for Postgres and Redis containers)

## Local development

```bash
nvm use
npm install
cp .env.example .env   # edit JWT_SECRET etc. as needed
npm run local          # starts Postgres + Redis containers, runs migrations, launches dev server with --watch
```

The `local` script runs `docker compose up -d` (Postgres + Redis only), then `npm run migrate`, then starts the app with file watching.

### Seeding

```bash
npm run seed           # runs sequelize db:seed:all against local Postgres
```

### Debug mode

```bash
npm run dev:debug      # same as dev but with --inspect (port 9229)
```

## Testing

```bash
npm test               # all tests (unit + integration) with coverage
npm run test:unit      # unit tests only
npm run test:integration  # integration tests only (uses Testcontainers -- no manual Docker needed)
npm run test:watch     # watch mode
npm run test:lint      # ESLint
```

Tests are self-contained via [Testcontainers](https://testcontainers.com/) -- `npm test` spins up ephemeral Postgres and Redis containers automatically.

## Email preview

The weekly results email can be previewed locally without sending real emails.

### Standalone preview server

```bash
npm run preview:email   # serves rendered email at http://localhost:3003
```

Edit `src/notifications/views/results.html` and refresh the browser to see changes.

### Dev server route

When running in development mode (`npm run dev` or `npm run local`), the email preview is also available at:

```
GET http://localhost:3001/dev/email-preview
```

### Testing in email clients

To verify rendering across email clients (Gmail, Outlook, Apple Mail):

1. Open the preview in a browser and copy the page source
2. Paste into [Mailtrap](https://mailtrap.io), [PutsMail](https://putsmail.com), or [Litmus](https://litmus.com) to see how it renders in real email clients
3. Alternatively, configure SMTP env vars to point at a Mailtrap inbox and trigger a real send via `POST /results-send`

## Docker (full containerised mode)

```bash
docker compose --profile app up    # starts app + Postgres + Redis in containers
```

## Multi-service development

For running the full stack (API + Web), see the [dream-league-core](https://github.com/johnwatson484/dream-league-core) orchestration repo.

## Environment variables

| Variable | Description | Default |
|----------|-------------|---------|
| `NODE_ENV` | Application environment (`development`, `test`, `production`) | `development` |
| `PORT` | Server port | `3001` |
| `WEB_URL` | Frontend URL (used in password reset emails) | `http://localhost:3000` |
| `ALLOW_NON_MEMBER_REGISTRATION` | Allow registration for non-league-members | `false` |
| `JWT_SECRET` | Legacy JWT secret (unused with RS256 signing) | `''` |
| `JWT_EXPIRY_IN_MINUTES` | Access token lifetime in minutes | `15` |
| `JWT_REFRESH_TOKEN_EXPIRY_DAYS` | Refresh token rolling expiry in days | `7` |
| `JWT_REFRESH_TOKEN_MAX_AGE_DAYS` | Absolute max session age in days | `30` |
| `JWT_PRIVATE_KEY` | RSA private key PEM string | `''` |
| `JWT_PUBLIC_KEY` | RSA public key PEM string | `''` |
| `JWT_PRIVATE_KEY_PATH` | Path to RSA private key file | `''` |
| `JWT_PUBLIC_KEY_PATH` | Path to RSA public key file | `''` |
| `SMTP_HOST` | SMTP server hostname | `''` |
| `SMTP_PORT` | SMTP server port | `587` |
| `SMTP_SECURE` | Use TLS for SMTP | `false` |
| `SMTP_TLS` | Require STARTTLS | `true` |
| `SMTP_USER` | SMTP username | `''` |
| `SMTP_PASSWORD` | SMTP password | `''` |
| `REDIS_HOST` | Redis host | `localhost` |
| `REDIS_PORT` | Redis port | `6379` |
| `REDIS_TLS` | Use TLS for Redis | `false` |
| `REDIS_PASSWORD` | Redis password | `''` |
| `REDIS_PARTITION` | Redis key namespace prefix | `dream-league-api` |
| `REDIS_TTL` | Cache TTL in seconds | `1468800` (17 days) |
| `POSTGRES_USERNAME` | PostgreSQL username | `postgres` |
| `POSTGRES_PASSWORD` | PostgreSQL password | `postgres` |
| `POSTGRES_DB` | PostgreSQL database name | `dream_league_api` |
| `POSTGRES_HOST` | PostgreSQL host | `localhost` |
| `POSTGRES_PORT` | PostgreSQL port | `5432` |
| `POSTGRES_DIALECT` | Sequelize dialect | `postgres` |
| `POSTGRES_LOGGING` | Enable SQL query logging | `false` |

In development, JWT keys are auto-generated if none are configured. In production, either `JWT_PRIVATE_KEY`/`JWT_PUBLIC_KEY` or `JWT_PRIVATE_KEY_PATH`/`JWT_PUBLIC_KEY_PATH` must be set.
