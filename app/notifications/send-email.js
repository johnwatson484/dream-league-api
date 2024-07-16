const nodemailer = require('nodemailer')
const config = require('../config').smtp

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

module.exports = {
  sendEmail,
}
