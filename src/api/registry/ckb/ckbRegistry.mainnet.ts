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
  [CanonicalTokenSymbol.ETH]: {
    address:
      '0x9657b32fcdc463e13ec9205914fd91c443822a949937ae94add9869e7f2e1de8',
    symbol: CanonicalTokenSymbol.ETH,
    decimals: 18,
    network: Network.Ethereum,
  },
  [CanonicalTokenSymbol.USDC]: {
    address:
      '0x5c4ac961a2428137f27271cf2af205e5c55156d26d9ac285ed3170e8c4cc1501',
    symbol: CanonicalTokenSymbol.USDC,
    decimals: 6,
    network: Network.Ethereum,
  },
  [CanonicalTokenSymbol.USDT]: {
    address:
      '0x1b89ae72b96c4f02fa7667ab46febcedf9b495737752176303ddd215d66a615a',
    symbol: CanonicalTokenSymbol.USDT,
    decimals: 6,
    network: Network.Ethereum,
  },
  [CanonicalTokenSymbol.BUSD]: {
    address:
      '0x232678824938dfd87a049122c4e244af88dad7faa79a262362f5bc5356ee4c64',
    symbol: CanonicalTokenSymbol.BUSD,
    decimals: 18,
    network: Network.Ethereum,
  },
  [CanonicalTokenSymbol.BNBBSC]: {
    address:
      '0x578cd6ab8c0800e6fbc17b58633857dac5626883af89f842e79cb8f7af24de75',
    symbol: CanonicalTokenSymbol.BNBBSC,
    decimals: 18,
    network: Network.BSC,
  },
  [CanonicalTokenSymbol.USDTBSC]: {
    address:
      '0xfd6f1818fe746687ef5268f82ce1835ba1a94fdccee5f098a389aeed0067eb57',
    symbol: CanonicalTokenSymbol.USDTBSC,
    decimals: 18,
    network: Network.BSC,
  },
  [CanonicalTokenSymbol.USDCBSC]: {
    address:
      '0xcedd0f67f2d218ab992284ab343c2e729d2a124a1612592deaa9f8b8f8a581dd',
    symbol: CanonicalTokenSymbol.USDCBSC,
    decimals: 18,
    network: Network.BSC,
  },
  [CanonicalTokenSymbol.BUSDBSC]: {
    address:
      '0x69c215249102308356778d58259c91c0f1988f6f5b07aa614921ee1803ea0059',
    symbol: CanonicalTokenSymbol.BUSDBSC,
    decimals: 18,
    network: Network.BSC,
  },
  [CanonicalTokenSymbol.WBTC]: {
    address:
      '0x0a2117bce7a84cac80e7c5971919d12987e4da58f79e010c6c2f58c7d6e687e1',
    symbol: CanonicalTokenSymbol.WBTC,
    decimals: 8,
    network: Network.Ethereum,
  },
}
