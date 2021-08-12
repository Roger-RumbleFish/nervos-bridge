import { BridgeRPCHandler } from 'nervos-godwoken-integration'

import { BridgeToken } from '@interfaces/data'

export const fetchSupportedTokens = async (
  blacklist?: string[],
): Promise<BridgeToken[]> => {
  try {
    const forceBridgeUrl = 'https://bridge-godwoken.rumblefish.dev/'
    const rpcClient = new BridgeRPCHandler(forceBridgeUrl)

    const tokens = await rpcClient.getAssetList('all')

    const blacklistedTokens = tokens.filter((token) =>
      blacklist.some(
        (blackListSymbol) =>
          blackListSymbol.toUpperCase() === token.info.symbol.toUpperCase(),
      ),
    )

    const tokensIdsToRemove: string[] = []

    tokensIdsToRemove.push(...blacklistedTokens.map((x) => x.ident))
    tokensIdsToRemove.push(...blacklistedTokens.map((x) => x.info.shadow.ident))

    const filteredTokens = tokens.filter(
      (x) => !tokensIdsToRemove.some((y) => y === x.ident),
    )

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
    console.log(e)
  }
}
