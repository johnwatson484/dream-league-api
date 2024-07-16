module.exports = {
  plugin: {
    name: 'errors',
    register: (server, _options) => {
      server.ext('onPreResponse', (request, h) => {
        const response = request.response

        if (response.isBoom) {
          request.log('error', {
            statusCode: response.output.statusCode,
            message: response.message,
            payloadMessage: response.data?.payload?.message,
            stack: response.data?.stack,
          })
        }
        return h.continue
      })
    },
  },
}
