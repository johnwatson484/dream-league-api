module.exports = [{
  method: 'GET',
  path: '/',
  handler: (request, h) => {
    return h.response('hello world')
  }
}]
