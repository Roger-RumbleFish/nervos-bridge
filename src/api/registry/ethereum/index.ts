import { TokensRegistry } from '@api/types'
import { Environment } from '@interfaces/data'

import { registry as registryTestnet } from './ethereumRegistry.testnet'
import { registry as registryMainnet } from './etherumRegistry.mainnet'

export const registry = (environment: Environment): TokensRegistry | null => {
  if (environment === Environment.Mainnet) {
    return registryMainnet
  } else if (environment === Environment.Testnet) {
    return registryTestnet
  }

  return null
}
