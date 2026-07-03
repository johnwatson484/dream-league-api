import nunjucks from 'nunjucks'

const getHtmlStringFromFile = (file, context) => {
  nunjucks.configure('src/notifications/views', { autoescape: true })
  return nunjucks.render(file, context)
}

export { getHtmlStringFromFile }
