# Dream League API - AI Coding Agent Instructions

## Project Overview
Dream League API is a Hapi.js-based fantasy football backend service that manages leagues, teams, players, and live score updates. It integrates with [Dream League Web](https://github.com/johnwatson484/dream-league-web) in a shared Docker network.

## Architecture & Service Boundaries

### Core Services (Startup Order)
1. **Cache (Redis)** - Must start first, provides caching layer
2. **Server (Hapi)** - HTTP API server on port 3001
3. **Messaging (RabbitMQ)** - Subscribes to live score updates via fanout exchange

See [app/index.js](../app/index.js) for initialization sequence. All services must start successfully; graceful shutdown via `SIGTERM`/`SIGINT` handlers.

### Layer Architecture
- **Routes** (`app/server/routes/`) - Hapi route definitions, exports arrays of route objects
- **Business Logic** (`app/managers/`, `app/results/`, `app/teamsheet/`) - Domain logic modules
- **Data** (`app/data/models/`) - Sequelize ORM models
- **Infrastructure** (`app/cache/`, `app/messaging/`) - External service integrations

## Critical Patterns & Conventions

### Module Exports Pattern
All modules export via `index.js` barrel files. Example:
```javascript
// app/managers/index.js
const { getManagers } = require('./get-managers')
const { createManager } = require('./create-manager')
module.exports = { getManagers, createManager }
```

### Route Structure
Routes are simple arrays, registered via plugin system:
```javascript
// app/server/routes/managers.js
module.exports = [{
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
- Configured via `.sequelizerc` pointing to `app/config/database.js`
- Run migrations: `npm run migrate`, seed: `npm run seed`

### Cache Strategy
Redis-backed caching via `app/cache/`. All cache operations use:
- `cache.get(prefix, key)` - Retrieve cached data
- `cache.set(prefix, key, value)` - Store with TTL from config
- `cache.update(prefix, key, value)` - Used for live score updates

### Message Queue Integration
RabbitMQ fanout exchange for live scores:
- Exchange: `live-scores`, Queue: `dream-league-api`
- Consumer in [app/messaging/subscribe.js](../app/messaging/subscribe.js) auto-reconnects on failure
- Updates cache via `updateLiveScores` handler

## Developer Workflows

### Local Development
```bash
# Standard development with hot-reload
docker compose up

# Debug mode (port 9229 exposed)
docker compose -f compose.yaml -f compose.override.yaml -f compose.debug.yaml up

# Access postgres: dream-league-api-postgres:5432
# Access redis: dream-league-api-redis:6379  
# Access rabbitmq: dream-league-message:5672
```

### Testing
**Use `scripts/test` wrapper, NOT direct npm commands in container:**
```bash
scripts/test              # Run all tests
scripts/test -w           # Watch mode
scripts/test -d           # Debug mode
```

The script rebuilds images, starts test containers via `compose.test.yaml`, runs migrations/seeds, then executes tests. See [scripts/test](../scripts/test).

Direct test commands (for reference):
- `npm run test` - All tests with coverage
- `npm run test:unit` - Unit tests only
- `npm run test:integration` - Integration tests only
- `npm run test:watch` - Watch mode (use `scripts/test -w` instead)

### Code Quality
- **ESLint**: Uses `neostandard` config with Jest globals
- **Linting**: `npm run test:lint`
- Jest test files live in `test/unit/` and `test/integration/`

## Integration Points & Dependencies

### External Services
- **PostgreSQL** (dream-league-api-postgres) - Primary data store
- **Redis** (dream-league-api-redis) - Cache layer, 7-day TTL default
- **RabbitMQ** (dream-league-message) - Live score message broker
- **SMTP** - Email notifications (optional, configure via env vars)

### Environment Variables
Key variables (see [compose.yaml](../compose.yaml)):
- `POSTGRES_HOST`, `POSTGRES_USERNAME`, `POSTGRES_PASSWORD`
- `REDIS_HOST`
- `MESSAGE_HOST`, `MESSAGE_USERNAME`, `MESSAGE_PASSWORD`
- `JWT_SECRET`, `WEB_URL`
- `ALLOW_NON_MEMBER_REGISTRATION` (boolean as string)

### Cross-Service Communication
Shares Docker network `default` with Dream League Web. API exposes endpoints consumed by the frontend at `http://localhost:3001`.

## Key Files to Reference
- [app/index.js](../app/index.js) - Application entry point, service startup
- [app/config/index.js](../app/config/index.js) - Configuration schema
- [app/server/plugins/router.js](../app/server/plugins/router.js) - Route registration
- [Dockerfile](../Dockerfile) - Multi-stage build (development/production targets)
- [scripts/test](../scripts/test) - Test execution wrapper
