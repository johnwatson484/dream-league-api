const db = require('../data')
const { getSummary } = require('../results')
const { getHtmlStringFromFile } = require('./get-html-string')
const { sendEmail } = require('./send-email')

const sendResults = async (gameweekId) => {
  const summary = await getSummary(gameweekId)
  const emails = await db.Email.findAll({ raw: true, attributes: ['address'] })
  if (emails.length) {
    const addresses = emails.map(x => x.address)
    const body = getHtmlStringFromFile('results.html', summary)
    await sendEmail(addresses, `Dream League Results - Game Week ${gameweekId}`, body)
  }
}

module.exports = {
  sendResults,
}
