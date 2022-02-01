import { CanonicalTokenSymbol, TokensRegistry } from '@api/types'
import { Networks } from '@utils/constants'

export const registry: TokensRegistry = {
  [CanonicalTokenSymbol.CKB]: {
    address: '0x9D9599c41383D7009C2093319d576AA6F89A4449',
    symbol: 'CKB',
    decimals: 8,
    network: Networks.Godwoken,
  },
  [CanonicalTokenSymbol.dCKB]: {
    address: '0x53A1964a163f64Da59eFE6A802e35b5529d078E2',
    symbol: 'dCKB',
    decimals: 8,
    network: Networks.Godwoken,
  },
  [CanonicalTokenSymbol.DAI]: {
    address: '0x128BEc17A6D527cdA1Fab65958F0D7bda17e4Aef',
    symbol: 'ckDai',
    decimals: 18,
    network: Networks.Godwoken,
  },
  [CanonicalTokenSymbol.USDC]: {
    address: '0xC3b946c53E2e62200515d284249f2a91d9DF7954',
    symbol: 'ckUSDC',
    decimals: 6,
    network: Networks.Godwoken,
  },
  [CanonicalTokenSymbol.USDT]: {
    address: '0x07a388453944bB54BE709AE505F14aEb5d5cbB2C',
    symbol: 'ckUSDT',
    decimals: 6,
    network: Networks.Godwoken,
  },
}
