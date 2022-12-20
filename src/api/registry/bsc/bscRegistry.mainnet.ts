import { CanonicalTokenSymbol, TokensRegistry } from '@api/types'
import { Network } from '@interfaces/data'
import { BigNumber } from 'ethers'

export const registry: TokensRegistry = {
  [CanonicalTokenSymbol.BNBBSC]: {
    address: '0x0000000000000000000000000000000000000000',
    symbol: CanonicalTokenSymbol.BNBBSC,
    decimals: 18,
    network: Network.BSC,
    minimalBridgeAmount: BigNumber.from('35400000000000000'),
    bridgeFee: {
      in: BigNumber.from('17700000000000000'),
      out: BigNumber.from('17700000000000000'),
    },
  },
  [CanonicalTokenSymbol.USDTBSC]: {
    address: '0x55d398326f99059fF775485246999027B3197955',
    symbol: CanonicalTokenSymbol.USDTBSC,
    decimals: 18,
    network: Network.BSC,
    minimalBridgeAmount: BigNumber.from('18200000000000000000'),
    bridgeFee: {
      in: BigNumber.from('9100000000000000000'),
      out: BigNumber.from('9100000000000000000'),
    },
  },
  [CanonicalTokenSymbol.USDCBSC]: {
    address: '0x8AC76a51cc950d9822D68b83fE1Ad97B32Cd580d',
    symbol: CanonicalTokenSymbol.USDCBSC,
    decimals: 18,
    network: Network.BSC,
    minimalBridgeAmount: BigNumber.from('18200000000000000000'),
    bridgeFee: {
      in: BigNumber.from('9100000000000000000'),
      out: BigNumber.from('9100000000000000000'),
    },
  },
  [CanonicalTokenSymbol.BUSDBSC]: {
    address: '0xe9e7CEA3DedcA5984780Bafc599bD69ADd087D56',
    symbol: CanonicalTokenSymbol.BUSDBSC,
    decimals: 18,
    network: Network.BSC,
    minimalBridgeAmount: BigNumber.from('18200000000000000000'),
    bridgeFee: {
      in: BigNumber.from('9100000000000000000'),
      out: BigNumber.from('9100000000000000000'),
    },
  },
}
