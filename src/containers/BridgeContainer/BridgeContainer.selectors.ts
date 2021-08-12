import { IDisplayValue } from '@interfaces/data'
import { BridgeState, Token } from '@state/types'
import { Networks } from '@utils/constants'
import { useSelectors } from '@utils/hooks'

export const BridgeSelectors = (
  reducer: any,
): {
  getBaseTokensTokens: () => Token[]
  getBaseToken: () => Token
  getQuoteTokens: () => Token[]
  getQuoteToken: () => Token
  getExchangeResult: () => IDisplayValue
  getFee: () => string
  isFetchingTokens: () => boolean
  isCalculating: () => boolean
} =>
  useSelectors(reducer, (state: BridgeState) => ({
    getQuoteTokens: () =>
      state.tokens
        .map((token) => ({
          address: token.model.address,
          network: token.network,
          symbol: token.model.symbol,
        }))
        .filter((token) => token.network === Networks.Nervos) ?? [],
    getBaseTokensTokens: () =>
      state.tokens
        .map((token) => ({
          address: token.model.address,
          network: token.network,
          symbol: token.model.symbol,
        }))
        .filter((token) => token.network === Networks.Ethereum),
    getBaseToken: (): Token => ({
      address: state.baseToken?.model?.address,
      network: state.baseToken?.network,
      symbol: state.baseToken?.model?.symbol,
      decimals: state.baseToken?.model?.decimals,
    }),
    getQuoteToken: (): Token => ({
      address: state.quoteToken?.model?.address,
      network: state.quoteToken?.network,
      symbol: state.quoteToken?.model?.symbol,
      decimals: state.quoteToken?.model?.decimals,
    }),
    isFetchingTokens: (): boolean => state.fetchingTokens,
    getExchangeResult: (): IDisplayValue => state.exchangeValue,
    getFee: (): string => state.fee,
    isCalculating: (): boolean => state.isCalculating,
  }))
