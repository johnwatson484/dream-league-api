import type { Plugin } from '@hapi/hapi'

export default {
  plugin: {
    name: 'errors',
    register: (server: any) => {
      server.ext('onPreResponse', (request: any, h: any) => {
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
  } satisfies Plugin<any>,
}
