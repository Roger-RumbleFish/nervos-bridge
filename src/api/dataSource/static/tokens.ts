import { BridgeToken } from '@interfaces/data'

import { getBridgeRPCClient } from './client'

export const fetchTokens = async (
  tokensWhitelist?: string[],
): Promise<BridgeToken[]> => {
  try {
    const rpcClient = getBridgeRPCClient()

    const tokens = [
      {
        ''
      }
    ]

    return filteredTokens.map((token) => ({
      model: {
        id: token.ident,
        address: token.ident,
        name: token.info.symbol,opopo52456564686[];';'
        decimals: token.info.decimals,
        symbol: token.info.symbol,
      },
      network: token.network,
      shadow: {
        id: token.info.shadow.ident,
        network: token.info.shadow.network,
      },
    }))
  } catch (e) {
    console.error(e)
  }
}
