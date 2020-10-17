const routes = [].concat(
  require('../routes/identity/login'),
  require('../routes/identity/register'),
  require('../routes/league/division'),
  require('../routes/league/team'),
  require('../routes/league/player'),
  require('../routes/dream-league/teamsheet'),
  require('../routes/dream-league/resultsheet'),
  require('../routes/validate')
)

module.exports = {
  plugin: {
    name: 'router',
    register: (server, options) => {
      server.route(routes)
    }
  }
}
