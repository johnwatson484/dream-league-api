const routes = [].concat(
  require('../routes/register'),
  require('../routes/login'),
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
