import {
  AccountBoundToken,
  BridgedToken,
  IDisplayValue,
} from '@interfaces/data'
import {
  calculateAction,
  calculateRequestAction,
  setBaseTokenAction,
  setNetworkAction,
  setQuoteTokenAction,
  setTokensAction,
  setTokensRequestAction,
} from '@state/actions'
import { useActions } from '@utils/hooks'

export const BridgeActions = (
  bridgeReducer: any,
): {
  setTokensRequest: () => void
  setTokens: (tokens: BridgedToken[]) => void
  setBaseToken: (symbol: string) => void
  setQuoteToken: (symbol: string) => void
  setNetwork: (network: string) => void
  calculate: (exchangeResult: IDisplayValue, fee: string) => void
  calculatingRequest: () => void
} =>
  useActions(bridgeReducer, (dispatch: typeof bridgeReducer[1]) => ({
    setTokensRequest: () => dispatch(setTokensRequestAction()),
    setTokens: (tokens: AccountBoundToken[]) =>
      dispatch(setTokensAction(tokens)),
    setNetwork: (network: string) => dispatch(setNetworkAction(network)),
    setBaseToken: (symbol: string) => dispatch(setBaseTokenAction(symbol)),
    setQuoteToken: (symbol: string) => dispatch(setQuoteTokenAction(symbol)),
    calculate: (exchangeResult: IDisplayValue, fee: string) =>
      dispatch(calculateAction(exchangeResult, fee)),
    calculatingRequest: () => dispatch(calculateRequestAction()),
  }))
