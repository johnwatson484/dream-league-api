import { generateKeyPairSync } from 'node:crypto'
import { writeFileSync } from 'node:fs'
import { join } from 'node:path'

const { privateKey, publicKey } = generateKeyPairSync('rsa', {
  modulusLength: 2048,
  publicKeyEncoding: { type: 'spki', format: 'pem' },
  privateKeyEncoding: { type: 'pkcs8', format: 'pem' },
})

const outputDir = process.argv[2] || '.'

writeFileSync(join(outputDir, 'jwt-private.pem'), privateKey)
writeFileSync(join(outputDir, 'jwt-public.pem'), publicKey)

console.log(`Keys written to ${outputDir}/jwt-private.pem and ${outputDir}/jwt-public.pem`)
