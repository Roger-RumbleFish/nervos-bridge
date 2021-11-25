import { BigNumber } from '@ethersproject/bignumber'
import { AccountBoundToken } from '@interfaces/data'

export interface IBridgeProps {
  value: BigNumber
  externalValue: BigNumber
  baseTokens: AccountBoundToken[]
  selectedBaseToken: AccountBoundToken
  isFetchingTokens?: boolean
  isCalculating?: boolean
  onBaseTokenChange?: (token: AccountBoundToken) => void
  onBaseTokenAmountChange?: (value: BigNumber) => void
  onExternalTokenAmountChange?: (value: BigNumber) => void
}
