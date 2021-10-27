import { IDisplayValue } from '@interfaces/data'
import { BridgeState, Token } from '@state/types'
import { ApiNetworks, Networks } from '@utils/constants'
import { useSelectors } from '@utils/hooks'

export const BridgeSelectors = (
  reducer: any,
): {
  getBaseTokens: () => Token[]
  getBaseToken: () => Token
  getQuoteTokens: () => Token[]
  getQuoteToken: () => Token
  getExchangeResult: () => IDisplayValue
  getFee: () => string
  isFetchingTokens: () => boolean
  isCalculating: () => boolean
  getNetwork: () => string
} =>
  useSelectors(reducer, (state: BridgeState) => ({
    getQuoteTokens: () => {
      const currentNetwork =
        state.network === Networks.Ethereum ||
        state.network === Networks.NervosL1
          ? Networks.NervosL1
          : ApiNetworks.Ethereum

      return (
        state.tokens
          .map((token) => ({
            address: token.model.address,
            network: token.network,
            symbol: token.model.symbol,
          }))
          .filter((token) => token.network === currentNetwork) ?? []
      )
    },
    getBaseTokens: () => {
      const currentNetwork =
        state.network === Networks.Ethereum
          ? ApiNetworks.Ethereum
          : Networks.NervosL2

      console.log('bridge::selectors::tokens', state.tokens)
      console.log(
        'bridge::selector::baseTokens',
        state.tokens
          .map((token) => ({
            address: token.model.address,
            network: token.network,
            symbol: token.model.symbol,
          }))
          .filter((token) => token.network === currentNetwork),
      )

      return state.tokens
        .map((token) => ({
          address: token.model.address,
          network: token.network,
          symbol: token.model.symbol,
        }))
        .filter((token) => token.network === currentNetwork)
    },
    getBaseToken: (): Token => {
      console.log('bridge::selector::baseToken', state.baseToken)
      return {
        address: state.baseToken?.model?.address,
        network: state.baseToken?.network,
        symbol: state.baseToken?.model?.symbol,
        decimals: state.baseToken?.model?.decimals,
      }
    },
    getQuoteToken: (): Token => ({
      address: state.quoteToken?.model?.address,
      network: state.quoteToken?.network,
      symbol: state.quoteToken?.model?.symbol,
      decimals: state.quoteToken?.model?.decimals,
    }),
    isFetchingTokens: (): boolean => state.fetchingTokens,
    getExchangeResult: (): IDisplayValue => state.exchangeValue,
    getFee: (): string => state.fee,
    isCalculating: (): boolean => state.isCalculating,
    getNetwork: (): string => state.network,
  }))
