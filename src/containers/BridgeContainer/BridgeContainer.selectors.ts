import { IDisplayValue } from '@interfaces/data'
import { BridgeState, Token } from '@state/types'
import { useSelectors } from '@utils/hooks'

// : {
//   getBaseTokensTokens: () => Token[]
//   getBaseToken: () => Token
//   getQuoteTokens: () => Token[]
//   getQuoteToken: () => Token
//   getExchangeResult: () => IDisplayValue
//   getFee: () => string
// }

export const BridgeSelectors = (
  reducer: any,
): {
  getBaseTokensTokens: () => Token[]
  getBaseToken: () => Token
  getQuoteTokens: () => Token[]
  getQuoteToken: () => Token
  getExchangeResult: () => IDisplayValue
  getFee: () => string
} =>
  useSelectors(reducer, (state: BridgeState) => ({
    getQuoteTokens: () =>
      state.tokens
        .map((x) => ({
          address: x.model.address,
          network: x.network,
          symbol: x.model.symbol,
        }))
        .filter((y) => y.network === 'Nervos') ?? [],
    getBaseTokensTokens: () =>
      state.tokens
        .map((x) => ({
          address: x.model.address,
          network: x.network,
          symbol: x.model.symbol,
        }))
        .filter((y) => y.network === 'Ethereum'),
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

    getExchangeResult: (): IDisplayValue => state.exchangeValue,
    getFee: (): string => state.fee,
  }))
