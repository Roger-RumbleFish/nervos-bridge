import { AccountBoundToken, IDisplayValue, Token } from '@interfaces/data'
import { BridgeState } from '@state/types'
import { useSelectors } from '@utils/hooks'

export const BridgeSelectors = (
  reducer: any,
): {
  getBaseTokens: () => AccountBoundToken[]
  getBaseToken: () => AccountBoundToken
  getQuoteTokens: () => AccountBoundToken[]
  getQuoteToken: () => AccountBoundToken
  getExchangeResult: () => IDisplayValue
  getFee: () => string
  isFetchingTokens: () => boolean
  isCalculating: () => boolean
  getNetwork: () => string
} =>
  useSelectors(reducer, (state: BridgeState) => ({
    getQuoteTokens: () => state.tokens,
    getBaseTokens: () => state.tokens,
    getBaseToken: (): Token => state.baseToken,
    getQuoteToken: (): AccountBoundToken => state.quoteToken,
    isFetchingTokens: (): boolean => state.fetchingTokens,
    getExchangeResult: (): IDisplayValue => state.exchangeValue,
    getFee: (): string => state.fee,
    isCalculating: (): boolean => state.isCalculating,
    getNetwork: (): string => state.network,
  }))
