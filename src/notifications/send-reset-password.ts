import config from '../config/index.ts'
import { getHtmlStringFromFile } from './get-html-string.ts'
import { sendEmail } from './send-email.ts'

export async function sendResetPassword (email, token, userId) {
  const link = `${config.webUrl}/reset-password/${token}/${userId}`
  const body = getHtmlStringFromFile('reset-password.html', { link })
  await sendEmail(email, 'Dream League - Reset Password', body)
}
