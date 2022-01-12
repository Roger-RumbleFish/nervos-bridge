import { AccountBoundToken, IDisplayValue } from '@interfaces/data'

export interface IBridgeProps {
  baseTokenAmount: string
  baseTokens: AccountBoundToken[]
  selectedBaseToken: AccountBoundToken
  isFetchingTokens?: boolean
  isCalculating?: boolean
  disableButton?: boolean
  onBaseTokenChange?: (token: AccountBoundToken) => void
  onBaseTokenAmountChange?: (value: IDisplayValue) => void
  onDepositRequest?: () => void
}
