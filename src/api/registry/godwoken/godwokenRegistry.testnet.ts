import { CanonicalTokenSymbol, TokensRegistry } from '@api/types'
import { Network } from '@interfaces/data'

export const registry: TokensRegistry = {
  [CanonicalTokenSymbol.CKB]: {
    address: '0x0000000000000000000000000000000000000000',
    symbol: CanonicalTokenSymbol.CKB,
    decimals: 8,
    network: Network.CKB,
  },
  [CanonicalTokenSymbol.dCKB]: {
    address: '0xd64488E7E97242F3cd18627458907c0f1455d946',
    symbol: CanonicalTokenSymbol.dCKB,
    decimals: 8,
    network: Network.CKB,
  },
  [CanonicalTokenSymbol.DAI]: {
    address: '0x84c57202bCe3c784A1723F680dD38Cf6a2292d92',
    symbol: CanonicalTokenSymbol.DAI,
    decimals: 18,
    network: Network.Ethereum,
  },
  [CanonicalTokenSymbol.USDC]: {
    address: '0x50ce6b8abe7E6943750b55283a155bb6cB5acFaB',
    symbol: CanonicalTokenSymbol.USDC,
    decimals: 6,
    network: Network.Ethereum,
  },
  [CanonicalTokenSymbol.USDT]: {
    address: '0xD92dd1f7b17990B3EefB0104E9e4dC7B54e74e10',
    symbol: CanonicalTokenSymbol.USDT,
    decimals: 6,
    network: Network.Ethereum,
  },
}
