import { BridgedToken } from '@interfaces/data'

export enum CanonicalTokenSymbol {
  DAI = 'DAI',
  USDT = 'USDT',
  USDC = 'USDC',
  ETH = 'ETH',
  CKB = 'CKB',
  dCKB = 'dCKB',
  BUSD = 'BUSD',
  USDTBSC = 'USDT',
  BNBBSC = 'BNB',
  BUSDBSC = 'BUSD',
  USDCBSC = 'USDC',
  WBTC = 'WBTC',
}

export type TokensRegistry = {
  [key in CanonicalTokenSymbol]?: BridgedToken
}
