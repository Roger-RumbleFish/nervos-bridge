import { CanonicalTokenSymbol, TokensRegistry } from '@api/types'
import { Network } from '@interfaces/data'

export const registry: TokensRegistry = {
  [CanonicalTokenSymbol.CKB]: {
    address: '0x0000000000000000000000000000000000000000',
    symbol: CanonicalTokenSymbol.CKB,
    decimals: 18,
    network: Network.CKB,
  },
  [CanonicalTokenSymbol.DAI]: {
    address: '0xA2370D7aFFf03e1E2FB77b28Fb65532636e0cB61',
    symbol: CanonicalTokenSymbol.DAI,
    decimals: 18,
    network: Network.Ethereum,
  },
  [CanonicalTokenSymbol.USDC]: {
    address: '0x630AcC0A29E325ce022563Df69ba7E25Eeb1e184',
    symbol: CanonicalTokenSymbol.USDC,
    decimals: 6,
    network: Network.Ethereum,
  },
  [CanonicalTokenSymbol.USDT]: {
    address: '0x10A86c9C8CbE7cf2849bfCb0EaBE39b3bFEc91D4',
    symbol: CanonicalTokenSymbol.USDT,
    decimals: 6,
    network: Network.Ethereum,
  },
}
