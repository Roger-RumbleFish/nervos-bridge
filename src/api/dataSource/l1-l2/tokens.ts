import { BridgeToken } from '@interfaces/data'

import { TokenConfig, inverseBridgeNetwork } from './sudt'

export const fetchTokens = async (): Promise<BridgeToken[]> => {
  return Object.keys(TokenConfig).map((tokenIdTarget) => {
    const sudt = TokenConfig[tokenIdTarget]
    const targetNetwork = sudt.network
    const sourceNetwork = inverseBridgeNetwork(targetNetwork)

    return {
      model: {
        id: tokenIdTarget,
        address: tokenIdTarget,
        name: sudt.name,
        decimals: sudt.decimals,
        symbol: sudt.name,
      },
      network: sourceNetwork,
      shadow: {
        id: tokenIdTarget,
        network: targetNetwork,
      },
    }
  })
}
