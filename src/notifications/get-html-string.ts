import nunjucks from 'nunjucks'

export function getHtmlStringFromFile (file: string, context: any): string {
  nunjucks.configure('src/notifications/views', { autoescape: true })
  return nunjucks.render(file, context)
}
