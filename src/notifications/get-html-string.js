import nunjucks from 'nunjucks'

export function getHtmlStringFromFile (file, context) {
  nunjucks.configure('src/notifications/views', { autoescape: true })
  return nunjucks.render(file, context)
}
