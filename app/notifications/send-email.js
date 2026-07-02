import nodemailer from 'nodemailer'
import { smtp as config } from '../config/index.js'

const sendEmail = async (recipients, subject, body) => {
  if (config.host) {
    const transporter = nodemailer.createTransport(config)

    await transporter.sendMail({
      from: config.auth.user,
      to: recipients.toString(),
      subject,
      html: body,
    })
  }
}

export { sendEmail }
