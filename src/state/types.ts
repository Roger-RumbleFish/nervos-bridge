import { BridgeToken, IDisplayValue } from '@interfaces/data'

export interface Token {
  address: string
  symbol: string
  network: string
  decimals: number
}

export type BridgeState = {
  tokens: BridgeToken[]
  baseToken: BridgeToken
  quoteToken: BridgeToken
  exchangeValue: IDisplayValue
  fee: string
}

export enum BRIDGE_ACTIONS {
  START_TYPING = 'startTyping',
  SET_TOKENS = 'setTokens',
  SET_BASE_TOKEN = 'setBaseToken',
  SET_QUOTE_TOKEN = 'setQuoteToken',
  CALCULATE = 'calculate',
}

export interface IBridgeAction<
  T extends BRIDGE_ACTIONS = BRIDGE_ACTIONS,
  // eslint-disable-next-line @typescript-eslint/ban-types
  P = {}
> {
  type: T
  payload: P
}

export type ISetTokensAction = IBridgeAction<
  typeof BRIDGE_ACTIONS.SET_TOKENS,
  {
    tokens: BridgeToken[]
  }
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
