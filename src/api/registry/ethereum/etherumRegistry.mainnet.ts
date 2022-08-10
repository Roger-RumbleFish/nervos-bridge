import { CanonicalTokenSymbol, TokensRegistry } from '@api/types'
import { Network } from '@interfaces/data'

export const registry: TokensRegistry = {
  [CanonicalTokenSymbol.ETH]: {
    address: '0x0000000000000000000000000000000000000000',
    symbol: CanonicalTokenSymbol.ETH,
    decimals: 18,
    network: Network.Ethereum,
  },
  [CanonicalTokenSymbol.DAI]: {
    address: '0x6B175474E89094C44Da98b954EedeAC495271d0F',
    symbol: CanonicalTokenSymbol.DAI,
    decimals: 18,
    network: Network.Ethereum,
  },
  [CanonicalTokenSymbol.USDC]: {
    address: '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48',
    symbol: CanonicalTokenSymbol.USDC,
    decimals: 6,
    network: Network.Ethereum,
  },
  [CanonicalTokenSymbol.USDT]: {
    address: '0xdAC17F958D2ee523a2206206994597C13D831ec7',
    symbol: CanonicalTokenSymbol.USDT,
    decimals: 6,
    network: Network.Ethereum,
  },
  [CanonicalTokenSymbol.WBTC]: {
    address: '0x2260fac5e5542a773aa44fbcfedf7c193bc2c599',
    symbol: CanonicalTokenSymbol.WBTC,
    decimals: 8,
    network: Network.Ethereum,
  },
}
