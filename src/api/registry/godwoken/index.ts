import { TokensRegistry } from '@api/types'
import { Network } from '@interfaces/data'

import { registry as registryMainnet } from './godwokenRegistry.mainnet'
import { registry as registryTestnet } from './godwokenRegistry.testnet'

export const registry = (network: Network): TokensRegistry | null => {
  if (network === Network.Mainnet) {
    return registryMainnet
  } else if (network === Network.Testnet) {
    return registryTestnet
  }

  return null
}
