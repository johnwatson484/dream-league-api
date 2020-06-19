const routes = [].concat(
  require('../routes/login'),
  require('../routes/register')
)

module.exports = {
  plugin: {
    name: 'router',
    register: (server, options) => {
      server.route(routes)
    }
  }
}
