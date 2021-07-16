const nodemailer = require('nodemailer')
const config = require('../config').smtp

async function sendEmail (recipients, subject, body) {
  const transporter = nodemailer.createTransport(config)

  await transporter.sendMail({
    from: config.auth.user,
    to: recipients.toString(),
    subject,
    html: body
  })
}

module.exports = sendEmail
