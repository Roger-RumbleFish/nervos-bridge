import { CanonicalTokenSymbol, TokensRegistry } from '@api/types'
import { Network } from '@interfaces/data'

export const registry: TokensRegistry = {
  [CanonicalTokenSymbol.CKB]: {
    address:
      '0x0000000000000000000000000000000000000000000000000000000000000000',
    symbol: CanonicalTokenSymbol.CKB,
    decimals: 8,
    network: Network.CKB,
  },
  [CanonicalTokenSymbol.ETH]: {
    address:
      '0x1b072aa0ded384067106ea0c43c85bd71bafa5afdb432123511da46b390a4e33',
    symbol: CanonicalTokenSymbol.ETH,
    decimals: 18,
    network: Network.CKB,
  },
  [CanonicalTokenSymbol.USDC]: {
    address:
      '0x5497b6d3d55443d573420ca8e413ee1be8553c6f7a8a6e36bf036bf71f0e3c39',
    symbol: CanonicalTokenSymbol.USDC,
    decimals: 6,
    network: Network.Ethereum,
  },
  [CanonicalTokenSymbol.USDT]: {
    address:
      '0xf0a746d4d8df5c18826e11030c659ded11e7218b854f86e6bbdc2af726ad1ec3',
    symbol: CanonicalTokenSymbol.USDT,
    decimals: 6,
    network: Network.Ethereum,
  },
  [CanonicalTokenSymbol.WBTC]: {
    address:
      '0x46d5b7aa1035b6cdae6ae3b1682042a35e2683768869527fa7d534054f6d1238',
    symbol: CanonicalTokenSymbol.WBTC,
    decimals: 8,
    network: Network.Ethereum,
  },
}
