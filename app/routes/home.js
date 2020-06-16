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
}]
