import { BridgedToken } from '@interfaces/data'
import { Networks } from '@utils/constants'

import { getBridgeRPCClient } from './__client'

export const fetchTokens = async (
  tokensWhitelist?: string[],
): Promise<BridgedToken[]> => {
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

    return filteredTokens.map((token) => {
      const network =
        token.network === 'Ethereum' ? Networks.Ethereum : Networks.CKB
      const shadowNetwork =
        token.info.shadow.network === 'Ethereum'
          ? Networks.Ethereum
          : Networks.CKB
      return {
        id: token.ident,
        address: token.ident,
        name: token.info.symbol,
        decimals: token.info.decimals,
        symbol: token.info.symbol,
        network,
        shadow: {
          address: token.info.shadow.ident,
          network: shadowNetwork,
        },
      }
    })
  } catch (e) {
    console.error(e)
  }
}
