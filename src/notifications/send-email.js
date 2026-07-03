import nodemailer from 'nodemailer'
import config from '../config/index.js'

export async function sendEmail (recipients, subject, body) {
  if (config.smtp.host) {
    const transporter = nodemailer.createTransport(config.smtp)

    await transporter.sendMail({
      from: config.smtp.auth.user,
      to: recipients.toString(),
      subject,
      html: body,
    })
  }
}
