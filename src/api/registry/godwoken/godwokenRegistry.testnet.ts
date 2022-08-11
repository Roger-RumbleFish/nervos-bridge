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
  [CanonicalTokenSymbol.ETH]: {
    address: '0xf0d66bf1260D21fE90329A7A311e84979FEB004d',
    symbol: CanonicalTokenSymbol.ETH,
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
  //TODO: format all addresses to lowerCase
  [CanonicalTokenSymbol.WBTC]: {
    address: '0x6935a6841bbBDb7430acc1906188301F3044FB76',
    symbol: CanonicalTokenSymbol.WBTC,
    decimals: 18,
    network: Network.Ethereum,
  },
  [CanonicalTokenSymbol.BNBBSC]: {
    address: '0xFB60eBF591bc5e363A24b67518339F0015Ad02eE',
    symbol: CanonicalTokenSymbol.BNBBSC,
    decimals: 18,
    network: Network.BSC,
  },
}
