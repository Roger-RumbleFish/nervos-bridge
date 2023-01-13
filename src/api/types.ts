import { BridgedToken } from '@interfaces/data'

export enum CanonicalTokenSymbol {
  DAI = 'DAI',
  USDT = 'USDT',
  USDC = 'USDC',
  ETH = 'ETH',
  CKB = 'CKB',
  dCKB = 'dCKB',
  BUSD = 'BUSD',
  USDTBSC = 'USDT|bsc',
  BNBBSC = 'BNB|bsc',
  BUSDBSC = 'BUSD|bsc',
  USDCBSC = 'USDC|bsc',
  WBTC = 'WBTC',
}

export type TokensRegistry = {
  [key in CanonicalTokenSymbol]?: BridgedToken
}
