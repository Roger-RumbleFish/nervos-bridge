import {
  AccountBoundToken,
  IGodwokenBridge,
  IDisplayValue,
  Network,
} from '@interfaces/data'

export type BridgeState = {
  bridges: IGodwokenBridge[]
  tokens: AccountBoundToken[]
  fetchingTokens: boolean
  isCalculating: boolean
  baseToken: AccountBoundToken
  quoteToken: AccountBoundToken
  exchangeValue: IDisplayValue
  network: Network
  fee: string
}

export enum BRIDGE_ACTIONS {
  INIT_BRIDGES = 'initBridges',
  START_TYPING = 'startTyping',
  SET_TOKENS = 'setTokens',
  SET_NETWORK = 'setNetwork',
  SET_TOKENS_REQUEST = 'setTokensRequest',
  SET_BASE_TOKEN = 'setBaseToken',
  SET_QUOTE_TOKEN = 'setQuoteToken',
  CALCULATE = 'calculate',
  CALCULATE_REQUEST = 'calculateRequest',
}

export interface IBridgeAction<
  T extends BRIDGE_ACTIONS = BRIDGE_ACTIONS,
  // eslint-disable-next-line @typescript-eslint/ban-types
  P = {}
> {
  type: T
  payload: P
}

export type IInitBridgesAction = IBridgeAction<
  typeof BRIDGE_ACTIONS.INIT_BRIDGES,
  {
    bridges: {
      [key: string]: IGodwokenBridge[]
    }
  }
>

export type ISetTokensAction = IBridgeAction<
  typeof BRIDGE_ACTIONS.SET_TOKENS,
  {
    tokens: AccountBoundToken[]
  }
>

export type ISetNetworkAction = IBridgeAction<
  typeof BRIDGE_ACTIONS.SET_NETWORK,
  {
    network: string
  }
>
export type ISetTokensRequestAction = IBridgeAction<
  typeof BRIDGE_ACTIONS.SET_TOKENS_REQUEST
>
export type ICalculateRequestAction = IBridgeAction<
  typeof BRIDGE_ACTIONS.CALCULATE_REQUEST
>

export type ISetBaseTokenAction = IBridgeAction<
  typeof BRIDGE_ACTIONS.SET_BASE_TOKEN,
  string
>

export type ISetQuoteTokenAction = IBridgeAction<
  typeof BRIDGE_ACTIONS.SET_QUOTE_TOKEN,
  string
>

export type ICalculateAction = IBridgeAction<
  typeof BRIDGE_ACTIONS.CALCULATE,
  {
    exchangeResult: IDisplayValue
    fee: string
  }
>
