import { CanonicalTokenSymbol, TokensRegistry } from '@api/types'
import { Network } from '@interfaces/data'
import { BigNumber } from 'ethers'

// Goerli network
export const registry: TokensRegistry = {
  [CanonicalTokenSymbol.ETH]: {
    address: '0x0000000000000000000000000000000000000000',
    symbol: CanonicalTokenSymbol.ETH,
    decimals: 18,
    network: Network.Ethereum,
    minimalBridgeAmount: BigNumber.from('10000000000000'),
    bridgeFee: {
      in: BigNumber.from('1000000000000'),
      out: BigNumber.from('2000000000000'),
    },
  },
  [CanonicalTokenSymbol.USDC]: {
    address: '0x149Dd3299643b4d607ef7E63ad6C94ca4C1b3527',
    symbol: CanonicalTokenSymbol.USDC,
    decimals: 6,
    network: Network.Ethereum,
    minimalBridgeAmount: BigNumber.from('1000'),
    bridgeFee: {
      in: BigNumber.from('10'),
      out: BigNumber.from('20'),
    },
  },
  [CanonicalTokenSymbol.USDT]: {
    address: '0xD5b940de010672CF8C009b2DDb2d7095d40C5175',
    symbol: CanonicalTokenSymbol.USDT,
    decimals: 6,
    network: Network.Ethereum,
    minimalBridgeAmount: BigNumber.from('1000'),
    bridgeFee: {
      in: BigNumber.from('10'),
      out: BigNumber.from('20'),
    },
  },
  [CanonicalTokenSymbol.WBTC]: {
    address: '0x6fB39185e89959AeF4a47A84611fB36255C2b3da',
    symbol: CanonicalTokenSymbol.WBTC,
    decimals: 18,
    network: Network.Ethereum,
    minimalBridgeAmount: BigNumber.from('1000000000'),
    bridgeFee: {
      in: BigNumber.from('1000000000'),
      out: BigNumber.from('1000000000'),
    },
  },
}
