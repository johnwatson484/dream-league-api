const { webUrl } = require('../config')
const { getHtmlStringFromFile } = require('./get-html-string')
const { sendEmail } = require('./send-email')

const sendResults = async (email, token, userId) => {
  const link = `${webUrl}/reset-password?token=${token}&userId=${userId}`
  const body = getHtmlStringFromFile('reset-password.html', { link })
  await sendEmail(email, 'Dream League - Reset Password', body)
}

module.exports = {
  sendResults,
}
