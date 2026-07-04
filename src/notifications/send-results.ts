import db from '../data/index.ts'
import { getSummary } from '../results/get-summary.ts'
import { getHtmlStringFromFile } from './get-html-string.ts'
import { sendEmail } from './send-email.ts'

export async function sendResults (gameweekId) {
  const summary = await getSummary(gameweekId)
  const emails = await db.Email.findAll({ raw: true, attributes: ['address'] })
  if (emails.length) {
    const addresses = emails.map(x => x.address)
    const body = getHtmlStringFromFile('results.html', summary)
    await sendEmail(addresses, `Dream League Results - Game Week ${gameweekId}`, body)
  }
}
