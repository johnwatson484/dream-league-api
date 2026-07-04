import { readFileSync } from 'node:fs'
import { generateKeyPairSync } from 'node:crypto'
import config from './index.ts'

function loadKeys () {
  const privateKeyEnv = process.env.JWT_PRIVATE_KEY
  const publicKeyEnv = process.env.JWT_PUBLIC_KEY
  const privateKeyPath = process.env.JWT_PRIVATE_KEY_PATH
  const publicKeyPath = process.env.JWT_PUBLIC_KEY_PATH

  if (privateKeyEnv && publicKeyEnv) {
    return {
      privateKey: privateKeyEnv,
      publicKey: publicKeyEnv,
    }
  }

  if (privateKeyPath && publicKeyPath) {
    return {
      privateKey: readFileSync(privateKeyPath, 'utf8'),
      publicKey: readFileSync(publicKeyPath, 'utf8'),
    }
  }

  if (config.isDev) {
    const { privateKey, publicKey } = generateKeyPairSync('rsa', {
      modulusLength: 2048,
      publicKeyEncoding: { type: 'spki', format: 'pem' },
      privateKeyEncoding: { type: 'pkcs8', format: 'pem' },
    })
    return { privateKey, publicKey }
  }

  throw new Error('JWT keys not configured. Set JWT_PRIVATE_KEY/JWT_PUBLIC_KEY env vars or JWT_PRIVATE_KEY_PATH/JWT_PUBLIC_KEY_PATH.')
}

const keys = loadKeys()

export const privateKey = keys.privateKey
export const publicKey = keys.publicKey
