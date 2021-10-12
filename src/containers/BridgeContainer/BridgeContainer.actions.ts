import {
  calculateAction,
  calculateRequestAction,
  setBaseTokenAction,
  setNetworkAction,
  setQuoteTokenAction,
  setTokensAction,
  setTokensRequestAction,
} from '@api/actions'
import { BridgeToken, IDisplayValue } from '@interfaces/data'
import { useActions } from '@utils/hooks'

export const BridgeActions = (
  bridgeReducer: any,
): {
  setTokensRequest: () => void
  setTokens: (tokens: BridgeToken[]) => void
  setBaseToken: (symbol: string) => void
  setQuoteToken: (symbol: string) => void
  setNetwork: (network: string) => void
  calculate: (exchangeResult: IDisplayValue, fee: string) => void
  calculatingRequest: () => void
} =>
  useActions(bridgeReducer, (dispatch: typeof bridgeReducer[1]) => ({
    setTokensRequest: () => dispatch(setTokensRequestAction()),
    setTokens: (tokens: BridgeToken[]) => dispatch(setTokensAction(tokens)),
    setNetwork: (network: string) => dispatch(setNetworkAction(network)),
    setBaseToken: (symbol: string) => dispatch(setBaseTokenAction(symbol)),
    setQuoteToken: (symbol: string) => dispatch(setQuoteTokenAction(symbol)),
    calculate: (exchangeResult: IDisplayValue, fee: string) =>
      dispatch(calculateAction(exchangeResult, fee)),
    calculatingRequest: () => dispatch(calculateRequestAction()),
  }))
