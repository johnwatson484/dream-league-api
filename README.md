[![Build Status](https://github.com/johnwatson484/dream-league-api/actions/workflows/build.yaml/badge.svg)](https://github.com/johnwatson484/dream-league-api/actions/workflows/build.yaml)

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

## Docker (full containerised mode)

```bash
docker compose --profile app up    # starts app + Postgres + Redis in containers
```

## Multi-service development

For running the full stack (API + Web), see the [dream-league-core](https://github.com/johnwatson484/dream-league-core) orchestration repo.
