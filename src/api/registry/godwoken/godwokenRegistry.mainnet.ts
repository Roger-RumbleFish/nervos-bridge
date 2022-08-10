import { CanonicalTokenSymbol, TokensRegistry } from '@api/types'
import { Network } from '@interfaces/data'

export const registry: TokensRegistry = {
  [CanonicalTokenSymbol.CKB]: {
    address: '0x7538C85caE4E4673253fFd2568c1F1b48A71558a',
    symbol: CanonicalTokenSymbol.CKB,
    decimals: 8,
    network: Network.CKB,
  },
  [CanonicalTokenSymbol.dCKB]: {
    address: '0x893474456C475E738b13DdA824979bF7a355DE39',
    symbol: CanonicalTokenSymbol.dCKB,
    decimals: 8,
    network: Network.CKB,
  },
  [CanonicalTokenSymbol.DAI]: {
    address: '0x2c9Fc6087875646112f66a3C92fEF2d158FAa76e',
    symbol: CanonicalTokenSymbol.DAI,
    decimals: 18,
    network: Network.Ethereum,
  },
  [CanonicalTokenSymbol.USDC]: {
    address: '0x186181e225dc1Ad85a4A94164232bD261e351C33',
    symbol: CanonicalTokenSymbol.USDC,
    decimals: 6,
    network: Network.Ethereum,
  },
  [CanonicalTokenSymbol.USDT]: {
    address: '0x8E019acb11C7d17c26D334901fA2ac41C1f44d50',
    symbol: CanonicalTokenSymbol.USDT,
    decimals: 6,
    network: Network.Ethereum,
  },
  [CanonicalTokenSymbol.BNBBSC]: {
    address: '0xBAdb9b25150Ee75bb794198658A4D0448e43E528',
    symbol: CanonicalTokenSymbol.BNBBSC,
    decimals: 18,
    network: Network.BSC,
  },
  [CanonicalTokenSymbol.USDTBSC]: {
    address: '0xDFF2faCdFe47C1D5b51f18231f900949F1d5988f',
    symbol: CanonicalTokenSymbol.USDTBSC,
    decimals: 18,
    network: Network.BSC,
  },
  [CanonicalTokenSymbol.USDCBSC]: {
    address: '0xfA307CfdEA89DC197A346c338a98aC85d517af6e',
    symbol: CanonicalTokenSymbol.USDCBSC,
    decimals: 18,
    network: Network.BSC,
  },
  [CanonicalTokenSymbol.BUSDBSC]: {
    address: '0xD07920d57F400D89d62535D50eb9D1200ed7821B',
    symbol: CanonicalTokenSymbol.BUSDBSC,
    decimals: 18,
    network: Network.BSC,
  },
  [CanonicalTokenSymbol.WBTC]: {
    address: '0x82455018F2c32943b3f12F4e59D0DA2FAf2257Ef',
    symbol: CanonicalTokenSymbol.WBTC,
    decimals: 8,
    network: Network.Ethereum,
  },
}
