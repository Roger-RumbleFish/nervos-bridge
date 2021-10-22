import { BridgeToken } from '@interfaces/data'

import { getBridgeRPCClient } from './client'

export const fetchTokens = async (
  tokensWhitelist?: string[],
): Promise<BridgeToken[]> => {
  try {
    const rpcClient = getBridgeRPCClient()

    const tokens = await rpcClient.getAssetList()
    console.log('bridge:: tokens', tokens)

    const whitelistedTokens = tokens.filter((token) =>
      tokensWhitelist
        ? tokensWhitelist.some(
            (whitelistedTokenSymbol) =>
              whitelistedTokenSymbol.toUpperCase() ===
              token.info.symbol.toUpperCase(),
          )
        : true,
    )
    console.log('bridge:: whitlisted tokens', whitelistedTokens)

    const tokenIdsToSupport: string[] = [
      ...whitelistedTokens.map((x) => x.ident),
      ...whitelistedTokens.map((x) => x.info.shadow.ident),
    ]
    console.log('bridge:: token ids to support', tokenIdsToSupport)

    const filteredTokens = tokens.filter((token) =>
      tokenIdsToSupport.some((id) => id === token.ident),
    )

    console.log('bridge:: filtered tokens', filteredTokens)

    return filteredTokens.map((token) => ({
      model: {
        id: token.ident,
        address: token.ident,
        name: token.info.symbol,
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
