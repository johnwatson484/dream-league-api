import nodemailer from 'nodemailer'
import config from '../config/index.ts'

export async function sendEmail (recipients: string | string[], subject: string, body: string): Promise<void> {
  if (config.get('smtp.host')) {
    const transporter = nodemailer.createTransport({
      host: config.get('smtp.host'),
      port: config.get('smtp.port'),
      secure: config.get('smtp.secure'),
      requireTLS: config.get('smtp.requireTLS'),
      auth: {
        user: config.get('smtp.auth.user'),
        pass: config.get('smtp.auth.pass'),
      },
    })

    await transporter.sendMail({
      from: config.get('smtp.auth.user'),
      to: recipients.toString(),
      subject,
      html: body,
    })
  }
}
