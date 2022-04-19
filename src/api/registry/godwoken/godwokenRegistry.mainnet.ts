import { CanonicalTokenSymbol, TokensRegistry } from '@api/types'
import { Networks } from '@utils/constants'

export const registry: TokensRegistry = {
  [CanonicalTokenSymbol.CKB]: {
    address: '0x9D9599c41383D7009C2093319d576AA6F89A4449',
    symbol: CanonicalTokenSymbol.CKB,
    decimals: 8,
    network: Networks.Godwoken,
  },
  [CanonicalTokenSymbol.dCKB]: {
    address: '0x53A1964a163f64Da59eFE6A802e35b5529d078E2',
    symbol: CanonicalTokenSymbol.dCKB,
    decimals: 8,
    network: Networks.Godwoken,
  },
  [CanonicalTokenSymbol.DAI]: {
    address: '0x128BEc17A6D527cdA1Fab65958F0D7bda17e4Aef',
    symbol: CanonicalTokenSymbol.DAI,
    decimals: 18,
    network: Networks.Godwoken,
  },
  [CanonicalTokenSymbol.USDC]: {
    address: '0xC3b946c53E2e62200515d284249f2a91d9DF7954',
    symbol: CanonicalTokenSymbol.USDC,
    decimals: 6,
    network: Networks.Godwoken,
  },
  [CanonicalTokenSymbol.USDT]: {
    address: '0x07a388453944bB54BE709AE505F14aEb5d5cbB2C',
    symbol: CanonicalTokenSymbol.USDT,
    decimals: 6,
    network: Networks.Godwoken,
  },
  [CanonicalTokenSymbol.BNBBSC]: {
    address: '0xF818146b3abaA7830B94A47C2703eEDE5971D055',
    symbol: CanonicalTokenSymbol.BNBBSC,
    decimals: 18,
    network: Networks.BSC,
  },
  [CanonicalTokenSymbol.USDTBSC]: {
    address: '0x5C30d9396a97f2279737E63B2bf64CC823046591',
    symbol: CanonicalTokenSymbol.USDTBSC,
    decimals: 18,
    network: Networks.BSC,
  },
  [CanonicalTokenSymbol.USDCBSC]: {
    address: '0xA21B19d660917C1DE263Ad040Ba552737cfcEf50',
    symbol: CanonicalTokenSymbol.USDCBSC,
    decimals: 18,
    network: Networks.BSC,
  },
  [CanonicalTokenSymbol.BUSDBSC]: {
    address: '0xC61BC16E5199E4988d517a08Fa3133194EEdd9fB',
    symbol: CanonicalTokenSymbol.BUSDBSC,
    decimals: 18,
    network: Networks.BSC,
  },
}
