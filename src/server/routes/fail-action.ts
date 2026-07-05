import boom from '@hapi/boom'

export const failAction = async (_request: unknown, _h: unknown, error: Error | undefined) => {
  return boom.badRequest(error?.message)
}
