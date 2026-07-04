import neostandard from 'neostandard'

export default [
  ...neostandard({
    globals: ['describe', 'beforeEach', 'expect', 'test', 'afterEach', 'vi', 'beforeAll', 'afterAll'],
    ts: true,
  }),
  {
    rules: {
      curly: ['error', 'all'],
    },
  },
]
