const nunjucks = require('nunjucks')

const getHtmlStringFromFile = async (file, context) => {
  nunjucks.configure('app/notifications/views', { autoescape: true })
  return nunjucks.render(file, context)
}

module.exports = {
  getHtmlStringFromFile
}
