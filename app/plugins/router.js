const routes = [].concat(
  require('../routes/identity/login'),
  require('../routes/identity/register'),
  require('../routes/league/team'),
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
