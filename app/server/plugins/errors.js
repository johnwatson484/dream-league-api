module.exports = {
  plugin: {
    name: 'errors',
    register: (server, _options) => {
      server.ext('onPreResponse', (request, h) => {
        const response = request.response

        if (response.isBoom) {
          // An error was raised during
          // processing the request
          request.log('error', {
            statusCode: response.output.statusCode,
            message: response.message,
            payloadMessage: response.data ? response.data.payload.message : '',
            stack: response.data ? response.data.stack : response.stack
          })
        }
        return h.continue
      })
    }
  }
}
