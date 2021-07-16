const nunjucks = require('nunjucks')

function getHtmlStringFromFile (file, context) {
  nunjucks.configure('app/notifications/views', { autoescape: true })
  return nunjucks.render(file, context)
}

module.exports = {
  getHtmlStringFromFile
}
