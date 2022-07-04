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
  [CanonicalTokenSymbol.dCKB]: {
    address:
      '0xc43009f083e70ae3fee342d59b8df9eec24d669c1c3a3151706d305f5362c37e',
    symbol: CanonicalTokenSymbol.dCKB,
    decimals: 8,
    network: Network.CKB,
  },
  [CanonicalTokenSymbol.DAI]: {
    address:
      '0xcb8c7b352d88142993bae0f6a1cfc0ec0deac41e3377a2f7038ff6b103548353',
    symbol: CanonicalTokenSymbol.DAI,
    decimals: 18,
    network: Network.Ethereum,
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
  [CanonicalTokenSymbol.BNBBSC]: {
    address:
      '0x1c57a28aeb603700dd6f4bff4186ee63af2baf3d1a807f11ba9945b52ab20253',
    symbol: CanonicalTokenSymbol.BNBBSC,
    decimals: 18,
    network: Network.BSC,
  },
  [CanonicalTokenSymbol.USDTBSC]: {
    address:
      '0xf9eb966fbda208783f147dd3ebb12eb1fdd9049b18fea57cb75eb616975d3a7f',
    symbol: CanonicalTokenSymbol.USDTBSC,
    decimals: 6,
    network: Network.BSC,
  },
}
