import {
  BridgeState,
  BRIDGE_ACTIONS,
  IBridgeAction,
  ICalculateAction,
  ISetBaseTokenAction,
  ISetQuoteTokenAction,
  ISetTokensAction,
} from './types'

export const initialState: BridgeState = {
  tokens: [],
  fetchingTokens: false,
  isCalculating: false,
  baseToken: null,
  quoteToken: null,
  exchangeValue: null,
  fee: null,
}

export const reducer = (
  state: BridgeState,
  action: IBridgeAction,
): BridgeState => {
  switch (action.type) {
    case BRIDGE_ACTIONS.START_TYPING: {
      return {
        ...state,
      }
    }
    case BRIDGE_ACTIONS.SET_BASE_TOKEN: {
      const setBaseTokenAction = action as ISetBaseTokenAction
      const newBaseToken = state.tokens.find(
        (token) => token.model.symbol === setBaseTokenAction.payload,
      )

      const newQuoteToken = state.tokens.find(
        (token) =>
          token.network === newBaseToken?.shadow?.network &&
          token.model.id === newBaseToken?.shadow?.id,
      )

      return {
        ...state,
        baseToken: newBaseToken,
        quoteToken: newQuoteToken,
      }
    }
    case BRIDGE_ACTIONS.SET_QUOTE_TOKEN: {
      const setQuoteTokenAction = action as ISetQuoteTokenAction
      const newQuoteToken = state.tokens.find(
        (token) => token.model.symbol === setQuoteTokenAction.payload,
      )

      const newBaseToken = state.tokens.find(
        (token) =>
          token.network === newQuoteToken?.shadow?.network &&
          token.model.id === newQuoteToken?.shadow?.id,
      )

      return {
        ...state,
        baseToken: newBaseToken,
        quoteToken: newQuoteToken,
      }
    }

    case BRIDGE_ACTIONS.SET_TOKENS_REQUEST: {
      return {
        ...state,
        fetchingTokens: true,
      }
    }
    case BRIDGE_ACTIONS.CALCULATE_REQUEST: {
      return {
        ...state,
        isCalculating: true,
      }
    }
    case BRIDGE_ACTIONS.SET_TOKENS: {
      const setAction = action as ISetTokensAction
      const tokens = setAction.payload.tokens

      const baseToken = tokens.length > 0 ? tokens[0] : null

      const quoteToken = baseToken
        ? tokens.find((token) => token.model.id === baseToken.shadow.id)
        : null

      return {
        ...state,
        tokens: tokens,
        baseToken: baseToken,
        quoteToken: quoteToken,
        fetchingTokens: false,
      }
    }
    case BRIDGE_ACTIONS.CALCULATE: {
      const calculateAction = action as ICalculateAction
      const { exchangeResult, fee } = calculateAction.payload

      return {
        ...state,
        exchangeValue: exchangeResult,
        fee: fee,
        isCalculating: false,
      }
    }
    default:
      throw new Error()
  }
}
