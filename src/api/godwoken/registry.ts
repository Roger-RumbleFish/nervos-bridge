import { CanonicalTokenSymbol, TokensRegistry } from '@api/types'
import { Networks } from '@utils/constants'

export const registry: TokensRegistry = {
  network: Networks.Godwoken,
  tokens: {
    [CanonicalTokenSymbol.CKB]: {
      address: '0x0000000000000000000000000000000000000000',
      name: 'CKB',
      decimals: 8,
    },
    [CanonicalTokenSymbol.dCKB]: {
      address: '0xd64488E7E97242F3cd18627458907c0f1455d946',
      name: 'dCKB',
      decimals: 8,
    },
    [CanonicalTokenSymbol.DAI]: {
      address: '0x84c57202bCe3c784A1723F680dD38Cf6a2292d92',
      name: 'ckDai',
      decimals: 8,
    },
    [CanonicalTokenSymbol.USDC]: {
      address: '0x50ce6b8abe7E6943750b55283a155bb6cB5acFaB',
      name: 'ckUSDC',
      decimals: 6,
    },
    [CanonicalTokenSymbol.USDT]: {
      address: '0xD92dd1f7b17990B3EefB0104E9e4dC7B54e74e10',
      name: 'ckUSDT',
      decimals: 6,
    },
  },
}
