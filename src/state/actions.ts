import {
  AccountBoundToken,
  IGodwokenBridge,
  IDisplayValue,
} from '@interfaces/data'
import {
  BRIDGE_ACTIONS,
  IInitBridgesAction,
  ISetTokensAction,
  ISetBaseTokenAction,
  ICalculateAction,
  ISetQuoteTokenAction,
  ISetTokensRequestAction,
  ICalculateRequestAction,
  ISetNetworkAction,
} from '@state/types'

export const initBridgesAction = (
  bridges: IGodwokenBridge[],
): IInitBridgesAction => ({
  type: BRIDGE_ACTIONS.INIT_BRIDGES,
  payload: {
    bridges: bridges.reduce(
      (bridgesMap, bridge) => ({
        ...bridgesMap,
        [bridge.id]: bridge,
      }),
      {},
    ),
  },
})
export const setBaseTokenAction = (symbol: string): ISetBaseTokenAction => ({
  type: BRIDGE_ACTIONS.SET_BASE_TOKEN,
  payload: symbol,
})

export const setQuoteTokenAction = (symbol: string): ISetQuoteTokenAction => ({
  type: BRIDGE_ACTIONS.SET_QUOTE_TOKEN,
  payload: symbol,
})

export const setTokensAction = (
  tokens: AccountBoundToken[],
): ISetTokensAction => ({
  type: BRIDGE_ACTIONS.SET_TOKENS,
  payload: {
    tokens,
  },
})

export const setNetworkAction = (network: string): ISetNetworkAction => ({
  type: BRIDGE_ACTIONS.SET_NETWORK,
  payload: {
    network,
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
