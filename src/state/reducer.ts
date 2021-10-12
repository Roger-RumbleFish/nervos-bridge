import { BridgeToken } from '@interfaces/data'
import { ApiNetworks, Networks } from '@utils/constants'

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
  tokens: [],
  fetchingTokens: false,
  isCalculating: false,
  baseToken: null,
  quoteToken: null,
  exchangeValue: null,
  network: Networks.Ethereum,
  fee: null,
}

const getShadowToken = (
  tokens: BridgeToken[],
  firstToken: BridgeToken,
): BridgeToken => {
  return tokens.find(
    (token) =>
      token.network === firstToken?.shadow?.network &&
      token.model.id === firstToken?.shadow?.id,
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
      const newBaseToken = state.tokens.find(
        (token) => token.model.symbol === setBaseTokenAction.payload,
      )

      if (state.network === Networks.NervosL1) {
        return {
          ...state,
          baseToken: newBaseToken,
          quoteToken: newBaseToken,
        }
      }

      if (
        state.network === Networks.NervosL2 ||
        state.network === Networks.Ethereum
      ) {
        return {
          ...state,
          baseToken: newBaseToken,
          quoteToken: getShadowToken(state.tokens, newBaseToken),
        }
      }
    }
    case BRIDGE_ACTIONS.SET_QUOTE_TOKEN: {
      const setQuoteTokenAction = action as ISetQuoteTokenAction
      const newQuoteToken = state.tokens.find(
        (token) => token.model.symbol === setQuoteTokenAction.payload,
      )

      if (state.network === Networks.NervosL1) {
        return {
          ...state,
          baseToken: newQuoteToken,
          quoteToken: newQuoteToken,
        }
      }

      if (
        state.network === Networks.NervosL2 ||
        state.network === Networks.Ethereum
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
      const currentNetwork =
        state.network === Networks.Ethereum
          ? ApiNetworks.Ethereum
          : ApiNetworks.Nervos
      const baseToken =
        tokens.length > 0
          ? tokens.find((token) => token.network === currentNetwork)
          : null

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

      if (network === Networks.NervosL1) {
        const baseToken =
          state?.baseToken?.network !== ApiNetworks.Ethereum
            ? state?.baseToken
            : state?.tokens.find(
                (token) => token.network !== ApiNetworks.Ethereum,
              )

        return {
          ...state,
          baseToken: baseToken,
          quoteToken: baseToken,
          network,
        }
      }

      if (network === Networks.NervosL2) {
        const baseToken =
          state?.baseToken?.network !== ApiNetworks.Ethereum
            ? state?.baseToken
            : state?.tokens.find(
                (token) => token.network !== ApiNetworks.Ethereum,
              )

        const quoteToken = getShadowToken(state.tokens, baseToken)

        return {
          ...state,
          baseToken: baseToken,
          quoteToken: quoteToken,
          network,
        }
      }

      if (network === Networks.Ethereum) {
        const baseToken =
          state?.baseToken?.network === ApiNetworks.Ethereum
            ? state?.baseToken
            : state?.tokens.find(
                (token) => token.network === ApiNetworks.Ethereum,
              )

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
