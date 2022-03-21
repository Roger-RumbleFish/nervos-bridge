import { TokensRegistry } from '@api/types'
import { Environment } from '@interfaces/data'

import { registry as registryMainnet } from './ckbRegistry.mainnet'
import { registry as registryTestnet } from './ckbRegistry.testnet'

export const registry = (environment: Environment): TokensRegistry | null => {
  if (environment === Environment.Mainnet) {
    return registryMainnet
  } else if (environment === Environment.Testnet) {
    return registryTestnet
  }

  return null
}
