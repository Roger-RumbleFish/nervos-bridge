import { CanonicalTokenSymbol, TokensRegistry } from '@api/types'
import { Networks } from '@utils/constants'

export const registry: TokensRegistry = {
  [CanonicalTokenSymbol.ETH]: {
    address: '0x0000000000000000000000000000000000000000',
    symbol: 'ETH',
    decimals: 18,
    network: Networks.Ethereum,
  },
  [CanonicalTokenSymbol.DAI]: {
    address: '0x7Af456bf0065aADAB2E6BEc6DaD3731899550b84',
    symbol: 'DAI',
    decimals: 18,
    network: Networks.Ethereum,
  },
  [CanonicalTokenSymbol.USDC]: {
    address: '0x265566D4365d80152515E800ca39424300374A83',
    symbol: 'USDC',
    decimals: 6,
    network: Networks.Ethereum,
  },
  [CanonicalTokenSymbol.USDT]: {
    address: '0x74a3dbd5831f45CD0F3002Bb87a59B7C15b1B5E6',
    symbol: 'USDT',
    decimals: 6,
    network: Networks.Ethereum,
  },
}