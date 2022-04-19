import { TokensRegistry } from '@api/types'
import { Environment } from '@interfaces/data'

import { registry as registryMainnet } from './bscRegistry.mainnet'
import { registry as registryTestnet } from './bscRegistry.testnet'

export const registry = (environment: Environment): TokensRegistry | null => {
  if (environment === Environment.Mainnet) {
    return registryMainnet
  } else if (environment === Environment.Testnet) {
    return registryTestnet
  }

  return null
}
