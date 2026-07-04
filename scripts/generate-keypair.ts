import { generateKeyPairSync } from 'node:crypto'
import { writeFileSync } from 'node:fs'
import { join, resolve } from 'node:path'

const { privateKey, publicKey } = generateKeyPairSync('rsa', {
  modulusLength: 2048,
  publicKeyEncoding: { type: 'spki', format: 'pem' },
  privateKeyEncoding: { type: 'pkcs8', format: 'pem' },
})

const projectRoot = resolve(import.meta.dirname, '..')
const outputDir = resolve(process.argv[2] || '.')

if (!outputDir.startsWith(projectRoot)) {
  throw new Error(`Output directory must be within the project root: ${projectRoot}`)
}

writeFileSync(join(outputDir, 'jwt-private.pem'), privateKey)
writeFileSync(join(outputDir, 'jwt-public.pem'), publicKey)

console.log(`Keys written to ${outputDir}/jwt-private.pem and ${outputDir}/jwt-public.pem`)
