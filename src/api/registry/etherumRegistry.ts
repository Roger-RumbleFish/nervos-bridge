import { CanonicalTokenSymbol, TokensRegistry } from '@api/types'
import { Networks } from '@utils/constants'

export const registry: TokensRegistry = {
  [CanonicalTokenSymbol.ETH]: {
    address: '0x0000000000000000000000000000000000000000',
    symbol: 'ethETH',
    decimals: 18,
    network: Networks.Ethereum,
  },
  [CanonicalTokenSymbol.DAI]: {
    address: '0x6b175474e89094c44da98b954eedeac495271d0f',
    symbol: 'ethDAI',
    decimals: 18,
    network: Networks.Ethereum,
  },
  [CanonicalTokenSymbol.USDC]: {
    address: '0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48',
    symbol: 'ethUSDC',
    decimals: 6,
    network: Networks.Ethereum,
  },
  [CanonicalTokenSymbol.USDT]: {
    address: '0xdac17f958d2ee523a2206206994597c13d831ec7',
    symbol: 'ethUSDT',
    decimals: 6,
    network: Networks.Ethereum,
  },
}
