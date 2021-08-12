import { BridgeToken, IDisplayValue } from '@interfaces/data'
import {
  BRIDGE_ACTIONS,
  ISetTokensAction,
  ISetBaseTokenAction,
  ICalculateAction,
  ISetQuoteTokenAction,
  ISetTokensRequestAction,
  ICalculateRequestAction,
} from '@state/types'

export const setBaseTokenAction = (symbol: string): ISetBaseTokenAction => ({
  type: BRIDGE_ACTIONS.SET_BASE_TOKEN,
  payload: symbol,
})

export const setQuoteTokenAction = (symbol: string): ISetQuoteTokenAction => ({
  type: BRIDGE_ACTIONS.SET_QUOTE_TOKEN,
  payload: symbol,
})

export const setTokensAction = (tokens: BridgeToken[]): ISetTokensAction => ({
  type: BRIDGE_ACTIONS.SET_TOKENS,
  payload: {
    tokens,
  },
})

export const calculateRequestAction = (): ICalculateRequestAction => ({
  type: BRIDGE_ACTIONS.CALCULATE_REQUEST,
  payload: {},
})

export const setTokensRequestAction = (): ISetTokensRequestAction => ({
  type: BRIDGE_ACTIONS.SET_TOKENS_REQUEST,
  payload: {},
})

export const calculateAction = (
  exchangeResult: IDisplayValue,
  fee: string,
): ICalculateAction => ({
  type: BRIDGE_ACTIONS.CALCULATE,
  payload: {
    exchangeResult,
    fee,
  },
})
