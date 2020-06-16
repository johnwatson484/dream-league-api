const auth = require('../auth')

module.exports = [{
  method: 'GET',
  path: '/',
  config: { auth: false },
  handler: (request, h) => {
    return h.response('no auth required')
  }
},
{
  method: 'GET',
  path: '/restricted',
  config: { auth: 'jwt' },
  handler: (request, h) => {
    return h.response('hello world')
  }
},
{
  method: 'GET',
  path: '/token',
  handler: (request, h) => {
    const token = auth.token.get({ userId: 1 })
    return h.response(token)
  }
}]
