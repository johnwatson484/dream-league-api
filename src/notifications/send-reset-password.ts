import config from '../config/index.ts'
import { getHtmlStringFromFile } from './get-html-string.ts'
import { sendEmail } from './send-email.ts'

export async function sendResetPassword (email: string, token: string, userId: number): Promise<void> {
  const link = `${config.get('webUrl')}/reset-password/${token}/${userId}`
  const body = getHtmlStringFromFile('reset-password.html', { link })
  await sendEmail(email, 'Dream League - Reset Password', body)
}
