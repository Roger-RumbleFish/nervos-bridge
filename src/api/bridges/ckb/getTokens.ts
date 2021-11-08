import { BridgeToken } from '@interfaces/data'

import { TokenConfigByL1, inverseBridgeNetwork } from './sudt'

export const getTokens = async (): Promise<BridgeToken[]> => {
  return Object.keys(TokenConfigByL1).map((tokenIdL1) => {
    const tokenL2 = TokenConfigByL1[tokenIdL1]
    const l2Network = tokenL2.network
    const l1Network = inverseBridgeNetwork(l2Network)

    return {
      model: {
        id: tokenIdL1,
        address: tokenIdL1,
        name: tokenL2.name,
        decimals: tokenL2.decimals,
        symbol: tokenL2.name,
      },
      network: l2Network,
      shadow: {
        id: tokenIdL1,
        network: l1Network,
      },
    }
  })
}
