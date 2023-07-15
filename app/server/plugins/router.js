const routes = [].concat(
  require('../routes/identity/login'),
  require('../routes/identity/register'),
  require('../routes/identity/forgot-password'),
  require('../routes/identity/reset-password'),
  require('../routes/league/division'),
  require('../routes/league/team'),
  require('../routes/league/player'),
  require('../routes/teamsheet'),
  require('../routes/results'),
  require('../routes/goals'),
  require('../routes/conceded'),
  require('../routes/gameweeks'),
  require('../routes/statistics'),
  require('../routes/meetings'),
  require('../routes/managers'),
  require('../routes/history'),
  require('../routes/cups'),
  require('../routes/groups'),
  require('../routes/fixtures'),
  require('../routes/winners'),
  require('../routes/validate')
)

module.exports = {
  plugin: {
    name: 'router',
    register: (server, _options) => {
      server.route(routes)
    }
  }
}
