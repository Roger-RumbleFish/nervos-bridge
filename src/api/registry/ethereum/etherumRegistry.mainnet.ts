import { CanonicalTokenSymbol, TokensRegistry } from '@api/types'
import { Network } from '@interfaces/data'
import { BigNumber } from 'ethers'

// Ethereum network - https://github.com/nervosnetwork/force-bridge/blob/main/configs/mainnet-asset-white-list.json
export const registry: TokensRegistry = {
  [CanonicalTokenSymbol.ETH]: {
    address: '0x0000000000000000000000000000000000000000',
    symbol: CanonicalTokenSymbol.ETH,
    decimals: 18,
    network: Network.Ethereum,
    minimalBridgeAmount: BigNumber.from('24000000000000000'),
    bridgeFee: {
      in: BigNumber.from('1490000000000000'),
      out: BigNumber.from('12000000000000000'),
    },
  },
  [CanonicalTokenSymbol.BUSD]: {
    address: '0x9dC5014998b6A7351d75D731263199D31feb4474',
    symbol: CanonicalTokenSymbol.BUSD,
    decimals: 18,
    network: Network.Ethereum,
    minimalBridgeAmount: BigNumber.from('77500000000000000000'),
    bridgeFee: {
      in: BigNumber.from('4820000000000000000'),
      out: BigNumber.from('38700000000000000000'),
    },
  },
  [CanonicalTokenSymbol.USDC]: {
    address: '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48',
    symbol: CanonicalTokenSymbol.USDC,
    decimals: 6,
    network: Network.Ethereum,
    minimalBridgeAmount: BigNumber.from('77600000'),
    bridgeFee: {
      in: BigNumber.from('4820000'),
      out: BigNumber.from('38800000'),
    },
  },
  [CanonicalTokenSymbol.USDT]: {
    address: '0xdAC17F958D2ee523a2206206994597C13D831ec7',
    symbol: CanonicalTokenSymbol.USDT,
    decimals: 6,
    network: Network.Ethereum,
    minimalBridgeAmount: BigNumber.from('77500000'),
    bridgeFee: {
      in: BigNumber.from('4820000'),
      out: BigNumber.from('38700000'),
    },
  },
  [CanonicalTokenSymbol.WBTC]: {
    address: '0x2260FAC5E5542a773Aa44fBCfeDf7C193bc2C599',
    symbol: CanonicalTokenSymbol.WBTC,
    decimals: 8,
    network: Network.Ethereum,
    minimalBridgeAmount: BigNumber.from('176000'),
    bridgeFee: {
      in: BigNumber.from('10900'),
      out: BigNumber.from('10900'),
    },
  },
}
