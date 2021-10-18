import { BridgeToken } from '@interfaces/data'

import { getBridgeRPCClient } from './client'

export const fetchSupportedTokens = async (
  assetsWhitelist?: string[],
): Promise<BridgeToken[]> => {
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
      model: {
        id: tok.ident,
        address: tok.ident,
        name: tok.info.symbol,
        decimals: tok.info.decimals,
        symbol: tok.info.symbol,
      },
      network: tok.network,
      shadow: { id: tok.info.shadow.ident, network: tok.info.shadow.network },
    }))
  } catch (e) {
    console.error(e)
  }
}
