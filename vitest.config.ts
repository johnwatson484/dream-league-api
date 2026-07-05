import { defineConfig, configDefaults } from 'vitest/config'

const sharedEnv = {
  NODE_ENV: 'test',
  WEB_URL: 'http://localhost:3000',
}

const coverageConfig = {
  provider: 'v8',
  reportsDirectory: './coverage',
  clean: false,
  reporter: ['text', 'lcov'],
  include: ['src/**/*.ts'],
  exclude: [
    ...configDefaults.exclude,
    '**/test/**',
    'coverage',
  ],
}

export default defineConfig({
  test: {
    globals: true,
    clearMocks: true,
    coverage: coverageConfig,
    projects: [
      {
        test: {
          name: 'unit',
          include: ['test/unit/**/*.test.ts'],
          globals: true,
          clearMocks: true,
          environment: 'node',
          env: sharedEnv,
        },
      },
      {
        test: {
          name: 'integration',
          include: ['test/integration/**/*.test.ts'],
          globals: true,
          clearMocks: true,
          environment: 'node',
          env: sharedEnv,
          fileParallelism: false,
          globalSetup: ['./test/setup/global-db.ts', './test/setup/global-redis.ts'],
        },
      },
    ],
  },
})
