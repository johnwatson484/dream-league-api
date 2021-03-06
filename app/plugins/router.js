const routes = [].concat(
  require('../routes/identity/login'),
  require('../routes/identity/register'),
  require('../routes/league/division'),
  require('../routes/league/team'),
  require('../routes/league/player'),
  require('../routes/dream-league/teamsheet'),
  require('../routes/dream-league/results'),
  require('../routes/dream-league/gameweeks'),
  require('../routes/dream-league/statistics'),
  require('../routes/dream-league/meetings'),
  require('../routes/dream-league/managers'),
  require('../routes/dream-league/history'),
  require('../routes/dream-league/cups'),
  require('../routes/dream-league/groups'),
  require('../routes/dream-league/fixtures'),
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
