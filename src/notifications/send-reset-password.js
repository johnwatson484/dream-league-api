import config from '../config/index.js'
import { getHtmlStringFromFile } from './get-html-string.js'
import { sendEmail } from './send-email.js'

export async function sendResetPassword (email, token, userId) {
  const link = `${config.webUrl}/reset-password/${token}/${userId}`
  const body = getHtmlStringFromFile('reset-password.html', { link })
  await sendEmail(email, 'Dream League - Reset Password', body)
}
