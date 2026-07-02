# Dream League API - AI Coding Agent Instructions

## Project Overview
Dream League API is a Hapi.js-based fantasy football backend service that manages leagues, teams, players, and live score updates. It integrates with [Dream League Web](https://github.com/johnwatson484/dream-league-web) via a shared Docker network or direct HTTP calls.

## Architecture & Service Boundaries

### Core Services (Startup Order)
1. **Cache (Redis)** - Must start first, provides caching layer
2. **Server (Hapi)** - HTTP API server on port 3001

See [app/index.js](../app/index.js) for initialization sequence. All services must start successfully; graceful shutdown via `SIGTERM`/`SIGINT` handlers.

### Layer Architecture
- **Routes** (`app/server/routes/`) - Hapi route definitions, exports arrays of route objects
- **Business Logic** (`app/managers/`, `app/results/`, `app/teamsheet/`) - Domain logic modules
- **Data** (`app/data/models/`) - Sequelize ORM models
- **Infrastructure** (`app/cache/`) - Redis cache integration

## Critical Patterns & Conventions

### Module System
This project uses **ESM** (`"type": "module"` in package.json). All imports use `import`/`export` syntax with explicit `.js` extensions.

### Module Exports Pattern
All modules export via `index.js` barrel files:
```javascript
// app/managers/index.js
import { getManagers } from './get-managers.js'
import { createManager } from './create-manager.js'
export { getManagers, createManager }
```

### Route Structure
Routes are simple arrays, registered via plugin system:
```javascript
// app/server/routes/managers.js
export default [{
  method: GET,
  path: '/managers',
  options: {
    handler: async (_request, h) => {
      return h.response(await getManagers())
    }
  }
}]
```

All routes are concatenated in [app/server/plugins/router.js](../app/server/plugins/router.js).

### Authentication
- JWT via `hapi-auth-jwt2` with `try` mode (auth optional by default)
- Token validation in [app/token/validate.js](../app/token/validate.js)
- Auth configured in [app/server/plugins/auth.js](../app/server/plugins/auth.js)

### Configuration
Environment-driven config validated with Joi schemas in [app/config/index.js](../app/config/index.js). Never hardcode credentials.

### Database Patterns
- **Sequelize ORM** with models in `app/data/models/`
- Migrations in `app/data/migrations/`, seeders in `app/data/seeders/`
- Configured via `.sequelizerc` pointing to `app/config/database.cjs`
- Run migrations: `npm run migrate`, seed: `npm run seed`

### Cache Strategy
Redis-backed caching via `app/cache/`. All cache operations use:
- `cache.get(prefix, key)` - Retrieve cached data
- `cache.set(prefix, key, value)` - Store with TTL from config
- `cache.update(prefix, key, value)` - Update cached entries

## Developer Workflows

### Local Development (host-native)
```bash
nvm use && npm install && cp .env.example .env
npm run local     # starts Postgres + Redis containers, migrates, launches with --watch
npm run dev:debug # debug mode with --inspect on port 9229
```

### Docker (full containerised mode)
```bash
docker compose --profile app up   # starts app + Postgres + Redis in containers
```

### Testing
```bash
npm test               # all tests (self-contained via Testcontainers)
npm run test:unit      # unit tests only
npm run test:integration  # integration with real Postgres + Redis (Testcontainers)
npm run test:watch     # watch mode
npm run test:lint      # ESLint
```

Tests use **Vitest** with `vi` for mocking. Integration tests spin up ephemeral Postgres and Redis containers via Testcontainers — no manual Docker needed.

### Code Quality
- **ESLint**: Uses `neostandard` config with Vitest globals
- **Linting**: `npm run test:lint`
- Test files live in `test/unit/` and `test/integration/`

## Integration Points & Dependencies

### External Services
- **PostgreSQL** (dream-league-api-postgres) - Primary data store
- **Redis** (dream-league-api-redis) - Cache layer, 7-day TTL default
- **SMTP** - Email notifications (optional, configure via env vars)

### Environment Variables
Key variables (see `.env.example`):
- `POSTGRES_HOST`, `POSTGRES_USERNAME`, `POSTGRES_PASSWORD`, `POSTGRES_DB`
- `REDIS_HOST`, `REDIS_PORT`
- `JWT_SECRET`, `WEB_URL`
- `ALLOW_NON_MEMBER_REGISTRATION` (boolean as string)

### Cross-Service Communication
Shares Docker network `dream-league` with Dream League Web. API exposes endpoints consumed by the frontend at `http://localhost:3001`.

## Key Files to Reference
- [app/index.js](../app/index.js) - Application entry point, service startup
- [app/config/index.js](../app/config/index.js) - Configuration schema
- [app/server/plugins/router.js](../app/server/plugins/router.js) - Route registration
- [Dockerfile](../Dockerfile) - Multi-stage build (development/production targets)
- [vitest.config.js](../vitest.config.js) - Test configuration with unit/integration split
