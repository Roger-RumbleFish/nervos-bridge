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
        (x) => x.model.symbol === setBaseTokenAction.payload,
      )

      const newQuoteToken = state.tokens.find(
        (x) =>
          x.network === newBaseToken?.shadow?.network &&
          x.model.id === newBaseToken?.shadow?.id,
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
        (x) => x.model.symbol === setQuoteTokenAction.payload,
      )

      console.log('new quote', newQuoteToken)

      const newBaseToken = state.tokens.find(
        (x) =>
          x.network === newQuoteToken?.shadow?.network &&
          x.model.id === newQuoteToken?.shadow?.id,
      )

      return {
        ...state,
        baseToken: newBaseToken,
        quoteToken: newQuoteToken,
      }
    }
    case BRIDGE_ACTIONS.SET_TOKENS: {
      const setAction = action as ISetTokensAction
      const tokens = setAction.payload.tokens

      const baseToken = tokens.length > 0 ? tokens[0] : null

      const quoteToken = baseToken
        ? tokens.find((x) => x.model.id === baseToken.shadow.id)
        : null

      return {
        ...state,
        tokens: tokens,
        baseToken: baseToken,
        quoteToken: quoteToken,
      }
    }
    case BRIDGE_ACTIONS.CALCULATE: {
      const calculateAction = action as ICalculateAction
      const { exchangeResult, fee } = calculateAction.payload

      return {
        ...state,
        exchangeValue: exchangeResult,
        fee: fee,
      }
    }
    default:
      throw new Error()
  }
}
