declare module 'log-timestamp'
declare module 'hapi-auth-jwt2'
declare module 'nunjucks' {
  export function configure (path: string, options: { autoescape: boolean }): void
  export function render (file: string, context: any): string
}
