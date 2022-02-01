import { CanonicalTokenSymbol, TokensRegistry } from '@api/types'
import { Networks } from '@utils/constants'

export const registry: TokensRegistry = {
  [CanonicalTokenSymbol.CKB]: {
    address:
      '0x0000000000000000000000000000000000000000000000000000000000000000',
    symbol: 'CKB',
    decimals: 8,
    network: Networks.CKB,
  },
  [CanonicalTokenSymbol.dCKB]: {
    address:
      '0xe5451c05231e1df43e4b199b5d12dbed820dfbea2769943bb593f874526eeb55',
    symbol: 'dCKB',
    decimals: 8,
    network: Networks.CKB,
  },
  [CanonicalTokenSymbol.DAI]: {
    address:
      '0xdd97fe4f673ed231af188855f4ca8b1034153c8d4e40f5b4fae2afd5d3f53ccc',
    symbol: 'ckDai',
    decimals: 18,
    network: Networks.CKB,
  },
  [CanonicalTokenSymbol.USDC]: {
    address:
      '0x5c4ac961a2428137f27271cf2af205e5c55156d26d9ac285ed3170e8c4cc1501',
    symbol: 'ckUSDC',
    decimals: 6,
    network: Networks.CKB,
  },
  [CanonicalTokenSymbol.USDT]: {
    address:
      '0x1b89ae72b96c4f02fa7667ab46febcedf9b495737752176303ddd215d66a615a',
    symbol: 'ckUSDT',
    decimals: 6,
    network: Networks.CKB,
  },
}
