import { BridgedToken } from '@interfaces/data'

import { mapForceBridgeNetwork } from './bridges/ethereum/utils'
import { getBridgeRPCClient } from './client'

export const fetchSupportedTokens = async (
  assetsWhitelist?: string[],
): Promise<BridgedToken[]> => {
  try {
    const rpcClient = getBridgeRPCClient()

    const tokens = await rpcClient.getAssetList('all')

    const whitelistedTokens = tokens.filter((token) =>
      assetsWhitelist
        ? assetsWhitelist.some(
            (whitelistSymbol) =>
              whitelistSymbol.toUpperCase() === token.info.symbol.toUpperCase(),
          )
        : true,
    )

    const tokenIdsToSupport: string[] = []

    tokenIdsToSupport.push(...whitelistedTokens.map((x) => x.ident))
    tokenIdsToSupport.push(...whitelistedTokens.map((x) => x.info.shadow.ident))

    const filteredTokens = tokens.filter((token) =>
      tokenIdsToSupport.some((id) => id === token.ident),
    )

    console.log('all tokens', filteredTokens)

    return filteredTokens.map((tok) => ({
      id: tok.ident,
      address: tok.ident,
      name: tok.info.symbol,
      decimals: tok.info.decimals,
      symbol: tok.info.symbol,
      network: mapForceBridgeNetwork(tok.network),
      shadow: {
        address: tok.info.shadow.ident,
        network: mapForceBridgeNetwork(tok.info.shadow.network),
      },
    }))
  } catch (e) {
    console.error(e)
  }
}
