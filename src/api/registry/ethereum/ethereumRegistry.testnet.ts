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
    address: '0x7Af456bf0065aADAB2E6BEc6DaD3731899550b84',
    symbol: CanonicalTokenSymbol.DAI,
    decimals: 18,
    network: Network.Ethereum,
  },
  [CanonicalTokenSymbol.USDC]: {
    address: '0x265566D4365d80152515E800ca39424300374A83',
    symbol: CanonicalTokenSymbol.USDC,
    decimals: 6,
    network: Network.Ethereum,
  },
  [CanonicalTokenSymbol.USDT]: {
    address: '0x74a3dbd5831f45CD0F3002Bb87a59B7C15b1B5E6',
    symbol: CanonicalTokenSymbol.USDT,
    decimals: 6,
    network: Network.Ethereum,
  },
  [CanonicalTokenSymbol.WBTC]: {
    address: '0x14B980AE9990391DF946fBA440A9ac88E28DB10c',
    symbol: CanonicalTokenSymbol.WBTC,
    decimals: 18,
    network: Network.Ethereum,
  },
}
