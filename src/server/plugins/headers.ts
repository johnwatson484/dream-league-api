import type { Plugin } from '@hapi/hapi'

export default {
  plugin: {
    name: 'headers',
    register: (server: any) => {
      server.ext('onPreResponse', (request: any, h: any) => {
        const headers = request.response.isBoom ? request.response.output.headers : request.response?.headers

        if (headers) {
          headers['X-Content-Type-Options'] = 'nosniff'
          headers['X-Frame-Options'] = 'DENY'
          headers['X-XSS-Protection'] = '1; mode=block'
          headers['cache-control'] = 'no-cache'
          headers['Cross-Origin-Opener-Policy'] = 'same-origin'
          headers['Cross-Origin-Resource-Policy'] = 'same-site'
          headers['Referrer-Policy'] = 'no-referrer'
          headers['Strict-Transport-Security'] = 'max-age=31536000; includeSubDomains; preload'
          headers['Permissions-Policy'] = 'camera=(), geolocation=(), magnetometer=(), microphone=(), payment=(), usb=()'
        }

        return h.continue
      })
    },
  } satisfies Plugin<any>,
}
