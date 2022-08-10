import { Token } from '@interfaces/data'

export enum CanonicalTokenSymbol {
  DAI = 'DAI',
  USDT = 'USDT',
  USDC = 'USDC',
  ETH = 'ETH',
  CKB = 'CKB',
  dCKB = 'dCKB',
  USDTBSC = 'USDT',
  BNBBSC = 'BNB',
  BUSDBSC = 'BUSD',
  USDCBSC = 'USDC',
  WBTC = 'WBTC',
}

export interface TokenDescriptor {
  address: string
  symbol: string
  decimals: number
}

export type TokenDescriptorsRegistry = {
  [key in CanonicalTokenSymbol]?: TokenDescriptor
}

export type TokensRegistry = {
  [key in CanonicalTokenSymbol]?: Token
}
