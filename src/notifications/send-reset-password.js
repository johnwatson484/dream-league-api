import config from '../config/index.js'
import { getHtmlStringFromFile } from './get-html-string.js'
import { sendEmail } from './send-email.js'

const sendResetPassword = async (email, token, userId) => {
  const link = `${config.webUrl}/reset-password?token=${token}&userId=${userId}`
  const body = getHtmlStringFromFile('reset-password.html', { link })
  await sendEmail(email, 'Dream League - Reset Password', body)
}

export { sendResetPassword }
