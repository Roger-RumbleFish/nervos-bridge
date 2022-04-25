import { AccountBoundToken, Network } from '@interfaces/data'

import {
  BridgeState,
  BRIDGE_ACTIONS,
  IBridgeAction,
  ICalculateAction,
  ISetBaseTokenAction,
  ISetNetworkAction,
  ISetQuoteTokenAction,
  ISetTokensAction,
} from './types'

export const initialState: BridgeState = {
  bridges: [],
  tokens: [],
  fetchingTokens: false,
  isCalculating: false,
  baseToken: null,
  quoteToken: null,
  exchangeValue: null,
  network: Network.Ethereum,
  fee: null,
}

const getShadowToken = (
  tokens: AccountBoundToken[],
  firstToken: AccountBoundToken,
): AccountBoundToken => {
  return tokens.find(
    (token) =>
      token.network === firstToken?.network &&
      token.address === firstToken?.address,
  )
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
      const baseTokenSymbol = setBaseTokenAction.payload
      const baseToken = state.tokens.find(
        (token) => token.symbol === baseTokenSymbol,
      )

      return {
        ...state,
        baseToken: baseToken,
        quoteToken: baseToken,
      }
    }
    case BRIDGE_ACTIONS.SET_QUOTE_TOKEN: {
      const setQuoteTokenAction = action as ISetQuoteTokenAction
      const newQuoteToken = state.tokens.find(
        (token) => token.symbol === setQuoteTokenAction.payload,
      )

      if (
        state.network === Network.Ethereum
      ) {
        return {
          ...state,
          baseToken: getShadowToken(state.tokens, newQuoteToken),
          quoteToken: newQuoteToken,
        }
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

      const baseToken = tokens[0]

      const quoteToken = getShadowToken(tokens, baseToken)

      return {
        ...state,
        tokens: tokens,
        baseToken: baseToken,
        quoteToken: quoteToken,
        fetchingTokens: false,
      }
    }
    case BRIDGE_ACTIONS.SET_NETWORK: {
      const setAction = action as ISetNetworkAction
      const network = setAction.payload.network


      if (network === Network.Ethereum) {
        const baseToken =
          state?.baseToken?.network === Network.Ethereum
            ? state?.baseToken
            : state?.tokens.find((token) => token.network === Network.Ethereum)

        const quoteToken = getShadowToken(state.tokens, baseToken)

        return {
          ...state,
          baseToken,
          quoteToken,
          network,
        }
      }

      return {
        ...state,
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
