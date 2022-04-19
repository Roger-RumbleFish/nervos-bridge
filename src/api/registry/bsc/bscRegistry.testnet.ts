import { CanonicalTokenSymbol, TokensRegistry } from '@api/types'
import { Networks } from '@utils/constants'

export const registry: TokensRegistry = {
  [CanonicalTokenSymbol.BNBBSC]: {
    address: '0x0000000000000000000000000000000000000000',
    symbol: CanonicalTokenSymbol.BNBBSC,
    decimals: 18,
    network: Networks.BSC,
  },
  [CanonicalTokenSymbol.USDT]: {
    address: '0x337610d27c682E347C9cD60BD4b3b107C9d34dDd',
    symbol: CanonicalTokenSymbol.USDT,
    decimals: 6,
    network: Networks.BSC,
  },
}
