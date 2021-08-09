import {
  calculateAction,
  setBaseTokenAction,
  setQuoteTokenAction,
  setTokensAction,
} from '@api/actions'
import { BridgeToken, IDisplayValue } from '@interfaces/data'
import { useActions } from '@utils/hooks'

export const BridgeActions = (
  bridgeReducer: any,
): {
  setTokens: (tokens: BridgeToken[]) => void
  setBaseToken: (symbol: string) => void
  setQuoteToken: (symbol: string) => void
  calculate: (exchangeResult: IDisplayValue, fee: string) => void
} =>
  useActions(bridgeReducer, (dispatch: typeof bridgeReducer[1]) => ({
    setTokens: (tokens: BridgeToken[]) => dispatch(setTokensAction(tokens)),
    setBaseToken: (symbol: string) => dispatch(setBaseTokenAction(symbol)),
    setQuoteToken: (symbol: string) => dispatch(setQuoteTokenAction(symbol)),
    calculate: (exchangeResult: IDisplayValue, fee: string) =>
      dispatch(calculateAction(exchangeResult, fee)),
  }))
