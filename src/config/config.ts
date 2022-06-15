import { Environment } from 'src'
import ConfigTest from './test.json'
import ConfigSchema from './schema.json'

export const getConfig = (environment: Environment): typeof ConfigSchema => {
  if (environment === Environment.Mainnet) {
    throw new Error('MAINNET bridge do not exist')
  } else if (environment === Environment.Testnet) {
    return ConfigTest
  }

  throw new Error('Envirionment do not exist')
}
